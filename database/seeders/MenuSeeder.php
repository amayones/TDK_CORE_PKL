<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('menus')->insert([
            [
                'module_key'          => 'dashboard',
                'name'                => 'Dashboard',
                'icon'                => 'LayoutDashboard',
                'route_path'          => '/dashboard',
                'frontend_path'       => 'resources/js/modules/dashboard/pages/',
                'backend_controller'  => 'app/Http/Controllers/Modules/DashboardController.php',
                'backend_service'     => 'app/Services/Modules/DashboardService.php',
                'backend_repository'  => 'app/Repositories/DashboardRepository.php',
                'sort_order'          => 1,
                'is_active'           => true,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'module_key'          => 'user-management',
                'name'                => 'User Management',
                'icon'                => 'Users',
                'route_path'          => '/admin/users',
                'frontend_path'       => 'resources/js/modules/admin/user-management/pages/',
                'backend_controller'  => 'app/Http/Controllers/Admin/UserManagementController.php',
                'backend_service'     => 'app/Services/Admin/UserManagementService.php',
                'backend_repository'  => 'app/Repositories/UserRepository.php',
                'sort_order'          => 2,
                'is_active'           => true,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'module_key'          => 'group-management',
                'name'                => 'Group Management',
                'icon'                => 'ShieldCheck',
                'route_path'          => '/admin/groups',
                'frontend_path'       => 'resources/js/modules/admin/group-management/pages/',
                'backend_controller'  => 'app/Http/Controllers/Admin/GroupManagementController.php',
                'backend_service'     => 'app/Services/Admin/GroupManagementService.php',
                'backend_repository'  => 'app/Repositories/GroupRepository.php',
                'sort_order'          => 3,
                'is_active'           => true,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'module_key'          => 'menu-management',
                'name'                => 'Menu Management',
                'icon'                => 'ListTree',
                'route_path'          => '/admin/menus',
                'frontend_path'       => 'resources/js/modules/admin/menu-management/pages/',
                'backend_controller'  => 'app/Http/Controllers/Admin/MenuManagementController.php',
                'backend_service'     => 'app/Services/Admin/MenuManagementService.php',
                'backend_repository'  => 'app/Repositories/MenuRepository.php',
                'sort_order'          => 4,
                'is_active'           => true,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'module_key'          => 'menu-access-management',
                'name'                => 'Menu Access Management',
                'icon'                => 'KeyRound',
                'route_path'          => '/admin/menu-access',
                'frontend_path'       => 'resources/js/modules/admin/menu-access-management/pages/',
                'backend_controller'  => 'app/Http/Controllers/Admin/MenuAccessManagementController.php',
                'backend_service'     => 'app/Services/Admin/MenuAccessManagementService.php',
                'backend_repository'  => 'app/Repositories/MenuAccessRepository.php',
                'sort_order'          => 5,
                'is_active'           => true,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'module_key'          => 'system-setting',
                'name'                => 'System Setting',
                'icon'                => 'Settings',
                'route_path'          => '/admin/settings',
                'frontend_path'       => 'resources/js/modules/admin/system-setting/pages/',
                'backend_controller'  => 'app/Http/Controllers/Admin/SystemSettingController.php',
                'backend_service'     => 'app/Services/Admin/SystemSettingService.php',
                'backend_repository'  => 'app/Repositories/SystemSettingRepository.php',
                'sort_order'          => 6,
                'is_active'           => true,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'module_key'          => 'audit-log',
                'name'                => 'Audit Log',
                'icon'                => 'History',
                'route_path'          => '/admin/audit-logs',
                'frontend_path'       => 'resources/js/modules/admin/audit-log/pages/',
                'backend_controller'  => 'app/Http/Controllers/Admin/AuditLogController.php',
                'backend_service'     => 'app/Services/Admin/AuditLogService.php',
                'backend_repository'  => 'app/Repositories/AuditLogRepository.php',
                'sort_order'          => 7,
                'is_active'           => true,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
        ]);
    }
}