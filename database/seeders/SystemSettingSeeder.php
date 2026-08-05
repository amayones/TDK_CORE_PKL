<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SystemSettingSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('system_settings')->insert([
            [
                'key'         => 'app_name',
                'value'       => 'TDK Core PKL',
                'type'        => 'string',
                'label'       => 'Nama Aplikasi',
                'description' => 'Nama aplikasi yang ditampilkan di header',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'key'         => 'app_timezone',
                'value'       => 'Asia/Jakarta',
                'type'        => 'string',
                'label'       => 'Timezone Aplikasi',
                'description' => 'Zona waktu default aplikasi',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }
}