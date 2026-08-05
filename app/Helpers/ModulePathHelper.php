<?php

namespace App\Helpers;

class ModulePathHelper
{
    /**
     * Mengembalikan daftar lokasi file yang harus dibuat untuk sebuah module.
     */
    public static function getExpectedPaths(string $moduleKey): array
    {
        return [
            'frontend_page'      => "resources/js/modules/{$moduleKey}/pages/",
            'backend_route'      => "routes/modules/{$moduleKey}.php",
            'controller'         => "app/Http/Controllers/Modules/" . self::studify($moduleKey) . "Controller.php",
            'service'            => "app/Services/Modules/" . self::studify($moduleKey) . "Service.php",
            'repository'         => "app/Repositories/" . self::studify($moduleKey) . "Repository.php",
        ];
    }

    public static function studify(string $key): string
    {
        return str_replace(' ', '', ucwords(str_replace(['-', '_'], ' ', $key)));
    }
}