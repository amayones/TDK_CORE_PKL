<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GroupSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('groups')->insert([
            [
                'code'        => 'GROUP_ADMIN',
                'name'        => 'Administrator',
                'description' => 'Grup dengan akses penuh ke seluruh sistem',
                'is_active'   => true,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'code'        => 'GROUP_INTERN',
                'name'        => 'Intern',
                'description' => 'Grup untuk pengguna magang dengan akses terbatas',
                'is_active'   => true,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }
}