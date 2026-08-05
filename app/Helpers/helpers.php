<?php

use App\Helpers\ModulePathHelper;

if (!function_exists('module_expected_paths')) {
    function module_expected_paths(string $moduleKey): array
    {
        return ModulePathHelper::getExpectedPaths($moduleKey);
    }
}