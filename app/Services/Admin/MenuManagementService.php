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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

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

        // If module_key is set and generate_module flag is true, create module files
        $generateModule = filter_var($data['generate_module'] ?? false, FILTER_VALIDATE_BOOLEAN);
        if (!empty($menu->module_key) && $generateModule) {
            $studlyName = ucfirst(str_replace(['-', '_'], '', $menu->module_key));
            $tableName = Str::snake(Str::plural($studlyName));
            $this->generateModule($menu->module_key, $studlyName, $tableName);
        }

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
        
        $migrationFiles = [];
        
        // Create frontend files from stubs
        $stubFiles = [
            'frontend-service' => "{$basePath}/services/{$camelName}Service.js",
            'frontend-page' => "{$basePath}/pages/{$studlyName}Page.jsx",
            'frontend-modal' => "{$basePath}/components/{$studlyName}FormModal.jsx",
        ];
        
        foreach ($stubFiles as $stubName => $targetPath) {
            try {
                $content = str_replace(
                    ['{{studlyName}}', '{{moduleKey}}', '{{tableName}}', '{{camelName}}'],
                    [$studlyName, $moduleKey, $tableName, $camelName],
                    File::get(base_path("stubs/module/{$stubName}.stub"))
                );
                File::put($targetPath, $content);
            } catch (\Exception $e) {
                throw new \RuntimeException("Gagal membuat file frontend {$targetPath}: " . $e->getMessage());
            }
        }
        
        // Create backend files
        $backendPath = app_path("Modules/{$studlyName}");
        File::makeDirectory("{$backendPath}", 0755, true, true);
        
        // Migration stub
        $timestamp = date('Y_m_d_His');
        try {
            $migrationContent = str_replace(
                ['{{studlyName}}', '{{tableName}}'],
                [$studlyName, $tableName],
                File::get(base_path('stubs/module/migration.stub'))
            );
            File::put(database_path("migrations/{$timestamp}_create_{$tableName}s_table.php"), $migrationContent);
        } catch (\Exception $e) {
            throw new \RuntimeException("Gagal membuat migration: " . $e->getMessage());
        }
        
        // Model stub
        try {
            $modelContent = str_replace(
                ['{{studlyName}}', '{{tableName}}'],
                [$studlyName, $tableName],
                File::get(base_path('stubs/module/model.stub'))
            );
            File::put(app_path("Models/{$studlyName}.php"), $modelContent);
        } catch (\Exception $e) {
            throw new \RuntimeException("Gagal membuat model: " . $e->getMessage());
        }
        
        // Repository stub
        try {
            $repoContent = str_replace(
                ['{{studlyName}}', '{{tableName}}'],
                [$studlyName, $tableName],
                File::get(base_path('stubs/module/repository.stub'))
            );
            File::put(app_path("Repositories/{$studlyName}Repository.php"), $repoContent);
        } catch (\Exception $e) {
            throw new \RuntimeException("Gagal membuat repository: " . $e->getMessage());
        }
        
        // Service stub
        try {
            $serviceContentBackend = str_replace(
                ['{{studlyName}}', '{{tableName}}', '{{camelName}}'],
                [$studlyName, $tableName, $camelName],
                File::get(base_path('stubs/module/service.stub'))
            );
            File::put(app_path("Services/Modules/{$studlyName}Service.php"), $serviceContentBackend);
        } catch (\Exception $e) {
            throw new \RuntimeException("Gagal membuat service: " . $e->getMessage());
        }
        
        // Controller stub
        try {
            $controllerContent = str_replace(
                ['{{studlyName}}', '{{tableName}}', '{{camelName}}'],
                [$studlyName, $tableName, $camelName],
                File::get(base_path('stubs/module/controller.stub'))
            );
            File::put(app_path("Http/Controllers/Modules/{$studlyName}Controller.php"), $controllerContent);
        } catch (\Exception $e) {
            throw new \RuntimeException("Gagal membuat controller: " . $e->getMessage());
        }
        
        // Request stubs
        try {
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
        } catch (\Exception $e) {
            throw new \RuntimeException("Gagal membuat request: " . $e->getMessage());
        }
        
        // Route file
        try {
            $routeContent = str_replace(
                ['{{studlyName}}', '{{tableName}}', '{{camelName}}'],
                [$studlyName, $tableName, $camelName],
                File::get(base_path('stubs/module/route.stub'))
            );
            File::put(base_path("routes/modules/{$moduleKey}.php"), $routeContent);
        } catch (\Exception $e) {
            throw new \RuntimeException("Gagal membuat route: " . $e->getMessage());
        }
        
        // Register in moduleRegistry
        $this->registerModuleInRegistry($moduleKey, $studlyName);
        
        // Auto run migration
        try {
            Artisan::call('migrate', [
                '--path' => "database/migrations/{$timestamp}_create_{$tableName}s_table.php",
                '--force' => true,
            ]);
            Log::info("Migration executed for module {$moduleKey}: " . Artisan::output());
        } catch (\Exception $e) {
            Log::error("Failed to run migration for module {$moduleKey}: " . $e->getMessage());
            throw new \RuntimeException("Gagal menjalankan migration: " . $e->getMessage());
        }
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
        
        // Migration files - find any file with create_{table}_table
        $migrationFiles = File::glob(database_path("migrations/*create_{$tableName}_table.php"));
        foreach ($migrationFiles as $file) {
            if (File::exists($file)) {
                File::delete($file);
            }
        }
        
        // Drop table from database if exists
        try {
            if (Schema::hasTable($tableName)) {
                Schema::dropIfExists($tableName);
                Log::info("Table {$tableName} dropped successfully");
            }
        } catch (\Exception $e) {
            Log::error("Failed to drop table {$tableName}: " . $e->getMessage());
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