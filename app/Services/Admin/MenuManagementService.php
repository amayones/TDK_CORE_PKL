<?php

namespace App\Services\Admin;

use App\Core\BaseService;
use App\Repositories\MenuRepository;
use App\Models\AuditLog;
use App\Models\Menu;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Artisan;

class MenuManagementService extends BaseService
{
    protected MenuRepository $menuRepository;

    public function __construct(MenuRepository $menuRepository)
    {
        parent::__construct($menuRepository);
        $this->menuRepository = $menuRepository;
    }

    public function listAll()
    {
        return Menu::with('parent')->orderBy('sort_order')->get();
    }

    public function listTopLevel()
    {
        return Menu::topLevel()->orderBy('sort_order')->get(['id', 'name']);
    }

    public function createMenu(array $data)
    {
        if (Menu::where('module_key', $data['module_key'])->exists()) {
            throw ValidationException::withMessages([
                'module_key' => ['Module key sudah digunakan.'],
            ]);
        }

        $menu = $this->menuRepository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'menu-management',
            description: "Membuat menu baru: {$menu->name}",
            newData: $menu->toArray()
        );

        return $menu;
    }

    public function updateMenu(int $id, array $data)
    {
        $menu = $this->menuRepository->find($id);
        $oldData = $menu->toArray();

        if (Menu::where('module_key', $data['module_key'])->where('id', '!=', $id)->exists()) {
            throw ValidationException::withMessages([
                'module_key' => ['Module key sudah digunakan.'],
            ]);
        }

        if (isset($data['parent_id']) && $data['parent_id'] == $id) {
            throw ValidationException::withMessages([
                'parent_id' => ['Menu tidak dapat menjadi parent dirinya sendiri.'],
            ]);
        }

        $updated = $this->menuRepository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'menu-management',
            description: "Mengubah menu: {$updated->name}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteMenu(int $id)
    {
        $menu = $this->menuRepository->find($id);

        $protectedKeys = [
            'dashboard', 'user-management', 'group-management',
            'menu-management', 'menu-access-management',
            'system-setting', 'audit-log',
        ];

        if (in_array($menu->module_key, $protectedKeys)) {
            throw ValidationException::withMessages([
                'module_key' => ['Menu bawaan sistem tidak dapat dihapus.'],
            ]);
        }

        if ($menu->children()->exists()) {
            throw ValidationException::withMessages([
                'module_key' => ['Menu ini masih memiliki sub-menu. Hapus sub-menu terlebih dahulu.'],
            ]);
        }

        $oldData = $menu->toArray();
        
        // Delete module files if module_key exists
        if ($menu->module_key) {
            $this->deleteModuleFiles($menu->module_key);
        }
        
        $this->menuRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'menu-management',
            description: "Menghapus menu: {$menu->name}",
            oldData: $oldData
        );

        return true;
    }
    
    public function generateModule(string $moduleKey, string $studlyName, string $tableName): void
    {
        $camelName = Str::camel($studlyName);
        $basePath = resource_path("js/modules/{$moduleKey}");
        
        // Create frontend directories
        File::makeDirectory("{$basePath}/pages", 0755, true, true);
        File::makeDirectory("{$basePath}/components", 0755, true, true);
        File::makeDirectory("{$basePath}/services", 0755, true, true);
        
        // Create frontend files from stubs
        $serviceContent = str_replace(
            ['{{studlyName}}', '{{moduleKey}}', '{{tableName}}', '{{camelName}}'],
            [$studlyName, $moduleKey, $tableName, $camelName],
            File::get(base_path('stubs/module/frontend-service.stub'))
        );
        $pageContent = str_replace(
            ['{{studlyName}}', '{{moduleKey}}', '{{tableName}}', '{{camelName}}'],
            [$studlyName, $moduleKey, $tableName, $camelName],
            File::get(base_path('stubs/module/frontend-page.stub'))
        );
        $modalContent = str_replace(
            ['{{studlyName}}', '{{moduleKey}}', '{{tableName}}', '{{camelName}}'],
            [$studlyName, $moduleKey, $tableName, $camelName],
            File::get(base_path('stubs/module/frontend-modal.stub'))
        );
        
        File::put("{$basePath}/services/{$camelName}Service.js", $serviceContent);
        File::put("{$basePath}/pages/{$studlyName}Page.jsx", $pageContent);
        File::put("{$basePath}/components/{$studlyName}FormModal.jsx", $modalContent);
        
        // Create backend files
        $backendPath = app_path("Modules/{$studlyName}");
        File::makeDirectory("{$backendPath}", 0755, true, true);
        
        // Migration stub
        $migrationContent = str_replace(
            ['{{studlyName}}', '{{tableName}}'],
            [$studlyName, $tableName],
            File::get(base_path('stubs/module/migration.stub'))
        );
        $timestamp = date('Y_m_d_His');
        File::put(database_path("migrations/{$timestamp}_create_{$tableName}s_table.php"), $migrationContent);
        
        // Model stub
        $modelContent = str_replace(
            ['{{studlyName}}', '{{tableName}}'],
            [$studlyName, $tableName],
            File::get(base_path('stubs/module/model.stub'))
        );
        File::put(app_path("Models/{$studlyName}.php"), $modelContent);
        
        // Repository stub
        $repoContent = str_replace(
            ['{{studlyName}}', '{{tableName}}'],
            [$studlyName, $tableName],
            File::get(base_path('stubs/module/repository.stub'))
        );
        File::put(app_path("Repositories/{$studlyName}Repository.php"), $repoContent);
        
        // Service stub
        $serviceContentBackend = str_replace(
            ['{{studlyName}}', '{{tableName}}', '{{camelName}}'],
            [$studlyName, $tableName, $camelName],
            File::get(base_path('stubs/module/service.stub'))
        );
        File::put(app_path("Services/Modules/{$studlyName}Service.php"), $serviceContentBackend);
        
        // Controller stub
        $controllerContent = str_replace(
            ['{{studlyName}}', '{{tableName}}', '{{camelName}}'],
            [$studlyName, $tableName, $camelName],
            File::get(base_path('stubs/module/controller.stub'))
        );
        File::put(app_path("Http/Controllers/Modules/{$studlyName}Controller.php"), $controllerContent);
        
        // Request stubs
        $storeRequestContent = str_replace(
            ['{{studlyName}}'],
            [$studlyName],
            File::get(base_path('stubs/module/store-request.stub'))
        );
        $updateRequestContent = str_replace(
            ['{{studlyName}}'],
            [$studlyName],
            File::get(base_path('stubs/module/update-request.stub'))
        );
        File::put(app_path("Http/Requests/Modules/Store{$studlyName}Request.php"), $storeRequestContent);
        File::put(app_path("Http/Requests/Modules/Update{$studlyName}Request.php"), $updateRequestContent);
        
        // Route file
        $routeContent = str_replace(
            ['{{studlyName}}', '{{tableName}}', '{{camelName}}'],
            [$studlyName, $tableName, $camelName],
            File::get(base_path('stubs/module/route.stub'))
        );
        File::put(base_path("routes/modules/{$moduleKey}.php"), $routeContent);
        
        // Register in moduleRegistry
        $this->registerModuleInRegistry($moduleKey, $studlyName);
    }
    
    private function registerModuleInRegistry(string $moduleKey, string $studlyName): void
    {
        $registryPath = resource_path('js/core/moduleRegistry.js');
        if (!File::exists($registryPath)) {
            return;
        }
        
        $content = File::get($registryPath);
        
        // Check if already registered
        if (Str::contains($content, "'{$moduleKey}'")) {
            return;
        }
        
        $importLine = "    '{$moduleKey}': lazy(() => import('../modules/{$moduleKey}/pages/{$studlyName}Page')),\n";
        
        // Find closing brace of moduleRegistry object
        $closingPos = strpos($content, '};');
        if ($closingPos === false) {
            return;
        }
        
        $beforeClosing = rtrim(substr($content, 0, $closingPos));
        if (!Str::endsWith($beforeClosing, ',')) {
            $beforeClosing .= ',';
        }
        
        $afterClosing = substr($content, $closingPos + 2);
        $newContent = $beforeClosing . "\n" . $importLine . "};" . $afterClosing;
        
        File::put($registryPath, $newContent);
    }
    
    private function deleteModuleFiles(string $moduleKey): void
    {
        // Convert module_key to studly case for file names (e.g., 'inventory' -> 'Inventory')
        $studlyKey = ucfirst(str_replace(['-', '_'], '', $moduleKey));
        $tableName = Str::snake(Str::plural($studlyKey));
        
        // Frontend files
        $frontendPath = resource_path("js/modules/{$moduleKey}");
        if (File::exists($frontendPath)) {
            File::deleteDirectory($frontendPath);
        }
        
        // Route file
        $routeFile = base_path("routes/modules/{$moduleKey}.php");
        if (File::exists($routeFile)) {
            File::delete($routeFile);
        }
        
        // Migration file - find any file with create_{table}_table
        $migrationFiles = File::glob(database_path("migrations/*create_{$tableName}_table.php"));
        foreach ($migrationFiles as $file) {
            if (File::exists($file)) {
                File::delete($file);
            }
        }
        
        // Remove entry from moduleRegistry.js
        $registryPath = resource_path('js/core/moduleRegistry.js');
        if (File::exists($registryPath)) {
            $registryContent = File::get($registryPath);
            // Match both single and double quotes, and optional whitespace
            $pattern = "/    ['\"]({$moduleKey})['\"]:\\s*lazy\(\(\) => import\(['\"]\.\.\/modules\/{$moduleKey}\/pages\/.*?['\"]\)\),\n/";
            $newRegistryContent = preg_replace($pattern, '', $registryContent);
            if ($newRegistryContent !== $registryContent) {
                File::put($registryPath, $newRegistryContent);
            }
        }
        
        // Backend files
        $backendFiles = [
            app_path("Models/{$studlyKey}.php"),
            app_path("Repositories/{$studlyKey}Repository.php"),
            app_path("Services/Modules/{$studlyKey}Service.php"),
            app_path("Http/Controllers/Modules/{$studlyKey}Controller.php"),
            app_path("Http/Requests/Modules/Store{$studlyKey}Request.php"),
            app_path("Http/Requests/Modules/Update{$studlyKey}Request.php"),
        ];
        
        foreach ($backendFiles as $file) {
            if (File::exists($file)) {
                File::delete($file);
            }
        }
    }
}