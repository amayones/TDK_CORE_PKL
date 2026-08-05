<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminGroupId = DB::table('groups')->where('code', 'GROUP_ADMIN')->value('id');
        $internGroupId = DB::table('groups')->where('code', 'GROUP_INTERN')->value('id');

        DB::table('users')->insert([
            [
                'group_id'  => $adminGroupId,
                'username'  => 'admin',
                'name'      => 'Administrator',
                'email'     => 'admin@tdkcorepkl.local',
                'password'  => Hash::make('admin123'),
                'is_active' => true,
                'created_at'=> now(),
                'updated_at'=> now(),
            ],
            [
                'group_id'  => $internGroupId,
                'username'  => 'dapina',
                'name'      => 'Dapina',
                'email'     => 'dapina@tdkcorepkl.local',
                'password'  => Hash::make('dapina123'),
                'is_active' => true,
                'created_at'=> now(),
                'updated_at'=> now(),
            ],
            [
                'group_id'  => $internGroupId,
                'username'  => 'maura',
                'name'      => 'Maura',
                'email'     => 'maura@tdkcorepkl.local',
                'password'  => Hash::make('maura123'),
                'is_active' => true,
                'created_at'=> now(),
                'updated_at'=> now(),
            ],
        ]);
    }
}