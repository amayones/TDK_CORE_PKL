<?php

namespace App\Services\Admin;

use App\Core\BaseService;
use App\Repositories\MenuRepository;
use App\Models\AuditLog;
use App\Models\Menu;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

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