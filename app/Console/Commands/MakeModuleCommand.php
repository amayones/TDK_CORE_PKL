<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class MakeModuleCommand extends Command
{
    protected $signature = 'make:module {name : Nama module, contoh: inventory atau finance-report}';
    protected $description = 'Membuat struktur lengkap module baru (Model, Repository, Service, Controller, Route, Frontend) tanpa mengubah core.';

    public function handle(): int
    {
        $rawName = $this->argument('name');
        $moduleKey = Str::kebab($rawName);
        $studlyName = Str::studly($moduleKey);
        $tableName = Str::snake(Str::plural($studlyName));

        $this->info("Membuat module: {$moduleKey}");

        $this->makeMigration($tableName, $studlyName);
        $this->makeModel($studlyName, $tableName);
        $this->makeRepository($studlyName);
        $this->makeService($studlyName, $moduleKey);
        $this->makeRequests($studlyName);
        $this->makeController($studlyName);
        $this->makeModuleRoute($moduleKey, $studlyName);
        $this->makeFrontend($moduleKey, $studlyName);
        $this->registerModuleInRegistry($moduleKey, $studlyName);
        $this->createMenuRecord($moduleKey, $studlyName);
        $this->runMigration();
        $this->runNpmBuild();

        $this->newLine();
        $this->info("Module '{$moduleKey}' berhasil dibuat!");
        $this->warn('Langkah selanjutnya (manual):');
        $this->line("1. Isi kolom sesuai kebutuhan di file migration yang dibuat");
        $this->line("2. Atur akses lewat UI Menu Access Management");

        return self::SUCCESS;
    }

    private function runMigration(): void
    {
        $this->newLine();
        $this->info("=== Migrasi Database ===");
        $run = $this->confirm("Jalankan 'php artisan migrate' sekarang?", true);

        if (!$run) {
            $this->warn("Migration dilewati. Jalankan secara manual: php artisan migrate");
            return;
        }

        $this->line("Menjalankan migration...");
        $process = Process::fromShellCommandline('php artisan migrate --force');

        try {
            $process->setTimeout(null);
            $process->run(function ($type, $buffer) {
                $this->line($buffer);
            });
            $this->info("Migration selesai.");
        } catch (ProcessFailedException $e) {
            $this->error("Migration gagal: " . $e->getMessage());
        }
    }

    private function runNpmBuild(): void
    {
        $this->newLine();
        $this->info("=== Build Frontend ===");
        $run = $this->confirm("Jalankan 'npm run build' sekarang? (memakan waktu)", true);

        if (!$run) {
            $this->warn("Build dilewati. Jalankan secara manual: npm run build");
            return;
        }

        $this->line("Menjalankan npm run build...");
        $process = Process::fromShellCommandline('npm run build');

        try {
            $process->setTimeout(null);
            $process->run(function ($type, $buffer) {
                $this->line($buffer);
            });
            $this->info("Build selesai.");
        } catch (ProcessFailedException $e) {
            $this->error("Build gagal: " . $e->getMessage());
        }
    }

    private function stub(string $name): string
    {
        return File::get(base_path("stubs/module/{$name}.stub"));
    }

    private function replacePlaceholders(string $content, string $studlyName, string $moduleKey, string $tableName): string
    {
        return str_replace(
            ['{{studlyName}}', '{{moduleKey}}', '{{tableName}}', '{{camelName}}'],
            [$studlyName, $moduleKey, $tableName, Str::camel($studlyName)],
            $content
        );
    }

    private function makeMigration(string $tableName, string $studlyName): void
    {
        $timestamp = date('Y_m_d_His');
        $path = database_path("migrations/{$timestamp}_create_{$tableName}_table.php");

        $content = $this->replacePlaceholders($this->stub('migration'), $studlyName, '', $tableName);

        File::put($path, $content);
        $this->line("Created: database/migrations/{$timestamp}_create_{$tableName}_table.php");
    }

    private function makeModel(string $studlyName, string $tableName): void
    {
        $path = app_path("Models/{$studlyName}.php");
        $content = $this->replacePlaceholders($this->stub('model'), $studlyName, '', $tableName);

        File::put($path, $content);
        $this->line("Created: app/Models/{$studlyName}.php");
    }

    private function makeRepository(string $studlyName): void
    {
        $path = app_path("Repositories/{$studlyName}Repository.php");
        $content = $this->replacePlaceholders($this->stub('repository'), $studlyName, '', '');

        File::put($path, $content);
        $this->line("Created: app/Repositories/{$studlyName}Repository.php");
    }

    private function makeService(string $studlyName, string $moduleKey): void
    {
        $path = app_path("Services/Modules/{$studlyName}Service.php");
        $content = $this->replacePlaceholders($this->stub('service'), $studlyName, $moduleKey, '');

        File::put($path, $content);
        $this->line("Created: app/Services/Modules/{$studlyName}Service.php");
    }

    private function makeRequests(string $studlyName): void
    {
        $storeContent = $this->replacePlaceholders($this->stub('store-request'), $studlyName, '', '');
        $updateContent = $this->replacePlaceholders($this->stub('update-request'), $studlyName, '', '');

        File::put(app_path("Http/Requests/Modules/Store{$studlyName}Request.php"), $storeContent);
        File::put(app_path("Http/Requests/Modules/Update{$studlyName}Request.php"), $updateContent);

        $this->line("Created: app/Http/Requests/Modules/Store{$studlyName}Request.php");
        $this->line("Created: app/Http/Requests/Modules/Update{$studlyName}Request.php");
    }

    private function makeController(string $studlyName): void
    {
        $path = app_path("Http/Controllers/Modules/{$studlyName}Controller.php");
        $content = $this->replacePlaceholders($this->stub('controller'), $studlyName, '', '');

        File::put($path, $content);
        $this->line("Created: app/Http/Controllers/Modules/{$studlyName}Controller.php");
    }

    private function makeModuleRoute(string $moduleKey, string $studlyName): void
    {
        $path = base_path("routes/modules/{$moduleKey}.php");
        $content = $this->replacePlaceholders($this->stub('route'), $studlyName, $moduleKey, '');

        File::put($path, $content);
        $this->line("Created: routes/modules/{$moduleKey}.php");
    }

    private function makeFrontend(string $moduleKey, string $studlyName): void
    {
        $basePath = resource_path("js/modules/{$moduleKey}");

        File::makeDirectory("{$basePath}/pages", 0755, true, true);
        File::makeDirectory("{$basePath}/components", 0755, true, true);
        File::makeDirectory("{$basePath}/services", 0755, true, true);

        $serviceContent = $this->replacePlaceholders($this->stub('frontend-service'), $studlyName, $moduleKey, '');
        $pageContent = $this->replacePlaceholders($this->stub('frontend-page'), $studlyName, $moduleKey, '');
        $modalContent = $this->replacePlaceholders($this->stub('frontend-modal'), $studlyName, $moduleKey, '');

        File::put("{$basePath}/services/" . Str::camel($studlyName) . "Service.js", $serviceContent);
        File::put("{$basePath}/pages/{$studlyName}Page.jsx", $pageContent);
        File::put("{$basePath}/components/{$studlyName}FormModal.jsx", $modalContent);

        $this->line("Created: resources/js/modules/{$moduleKey}/services/" . Str::camel($studlyName) . "Service.js");
        $this->line("Created: resources/js/modules/{$moduleKey}/pages/{$studlyName}Page.jsx");
        $this->line("Created: resources/js/modules/{$moduleKey}/components/{$studlyName}FormModal.jsx");
    }

    private function registerModuleInRegistry(string $moduleKey, string $studlyName): void
    {
        $registryPath = resource_path('js/core/moduleRegistry.js');

        if (!File::exists($registryPath)) {
            $this->warn("File moduleRegistry.js tidak ditemukan, lewati registrasi otomatis.");
            return;
        }

        $content = File::get($registryPath);

        // Cek apakah module sudah terdaftar
        if (Str::contains($content, "'{$moduleKey}'")) {
            $this->line("Module '{$moduleKey}' sudah terdaftar di moduleRegistry.js, lewati.");
            return;
        }

        $importLine = "    '{$moduleKey}': lazy(() => import('../modules/{$moduleKey}/pages/{$studlyName}Page')),\n";

        // Cari posisi "};" penutup objek
        $closingPos = strrpos($content, '};');

        if ($closingPos === false) {
            $this->warn("Format moduleRegistry.js tidak dikenali, tambahkan import secara manual.");
            return;
        }

        // Ambil bagian sebelum "};" dan pastikan baris terakhir memiliki koma
        $beforeClosing = rtrim(substr($content, 0, $closingPos));

        // Jika baris terakhir tidak diakhiri koma, tambahkan koma
        if (!Str::endsWith($beforeClosing, ',')) {
            $beforeClosing .= ',';
        }

        $newContent = $beforeClosing . "\n" . $importLine . "};";

        File::put($registryPath, $newContent);
        $this->line("Registered: resources/js/core/moduleRegistry.js (module_key: {$moduleKey})");
    }

    private function createMenuRecord(string $moduleKey, string $studlyName): void
    {
        $this->newLine();
        $this->info("=== Setup Menu (opsional) ===");
        $this->line("Module '{$moduleKey}' akan didaftarkan sebagai menu di sidebar.");

        $addMenu = $this->confirm("Apakah Anda ingin menambahkan menu '{$studlyName}' ke database sekarang?", true);

        if (!$addMenu) {
            $this->warn("Menu tidak ditambahkan. Anda bisa menambahkannya nanti lewat UI Menu Management.");
            return;
        }

        $name = $this->ask('Nama menu yang tampil di sidebar', $studlyName);
        $icon = $this->ask('Nama icon (lucide-react), contoh: Package, Boxes, FileText', 'Package');
        $routePath = $this->ask('Route path (contoh: /inventory)', '/' . $moduleKey);
        $parentId = $this->ask('Parent menu ID (kosongkan jika menu utama)', null);
        $sortOrder = (int) $this->ask('Urutan (sort order)', 99);

        // Validasi route_path harus diawali dengan /
        if (!Str::startsWith($routePath, '/')) {
            $routePath = '/' . $routePath;
        }

        $menuId = DB::table('menus')->insertGetId([
            'parent_id'          => $parentId ? (int) $parentId : null,
            'module_key'         => $moduleKey,
            'name'               => $name,
            'icon'               => $icon,
            'route_path'         => $routePath,
            'frontend_path'      => "resources/js/modules/{$moduleKey}/pages/",
            'backend_controller' => "app/Http/Controllers/Modules/{$studlyName}Controller.php",
            'backend_service'    => "app/Services/Modules/{$studlyName}Service.php",
            'backend_repository' => "app/Repositories/{$studlyName}Repository.php",
            'sort_order'         => $sortOrder,
            'is_active'          => true,
            'created_at'         => now(),
            'updated_at'         => now(),
        ]);

        $this->line("Menu '{$name}' berhasil ditambahkan (ID: {$menuId}, route: {$routePath}).");
        $this->warn("Jangan lupa atur akses menu ini lewat UI Menu Access Management.");
    }
}