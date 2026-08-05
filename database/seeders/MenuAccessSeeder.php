<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuAccessSeeder extends Seeder
{
    public function run(): void
    {
        $adminGroupId = DB::table('groups')->where('code', 'GROUP_ADMIN')->value('id');
        $internGroupId = DB::table('groups')->where('code', 'GROUP_INTERN')->value('id');

        $allMenus = DB::table('menus')->pluck('id');

        foreach ($allMenus as $menuId) {
            DB::table('menu_access')->insert([
                'group_id'   => $adminGroupId,
                'menu_id'    => $menuId,
                'can_view'   => true,
                'can_create' => true,
                'can_edit'   => true,
                'can_delete' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $dashboardMenuId = DB::table('menus')->where('module_key', 'dashboard')->value('id');

        DB::table('menu_access')->insert([
            'group_id'   => $internGroupId,
            'menu_id'    => $dashboardMenuId,
            'can_view'   => true,
            'can_create' => false,
            'can_edit'   => false,
            'can_delete' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}