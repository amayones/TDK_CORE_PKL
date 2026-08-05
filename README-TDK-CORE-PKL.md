# TDK Core PKL — Enterprise Framework

Framework internal berbasis **Laravel 11 + React 18** untuk seluruh aplikasi perusahaan.
Arsitektur modular memungkinkan pembuatan modul (menu) baru secara cepat dan konsisten tanpa mengubah core framework.

---

## Daftar Isi

1. [Stack Teknologi](#stack-teknologi)
2. [Struktur Proyek](#struktur-proyek)
3. [Konsep Module & Menu](#konsep-module--menu)
4. [Cara Membuat Menu Baru (Modul Baru)](#cara-membuat-menu-baru-modul-baru)
5. [Cara Menambah Data CRUD pada Menu](#cara-menambah-data-crud-pada-menu)
6. [Alur Kerja Frontend](#alur-kerja-frontend)
7. [Alur Kerja Backend](#alur-kerja-backend)
8. [Perintah Penting](#perintah-penting)

---

## Stack Teknologi

| Komponen | Teknologi |
|----------|-----------|
| Backend | Laravel 11 (PHP 8.2+/8.3) |
| Frontend | React 18 + Vite (build production, tanpa dev server) |
| Styling | Tailwind CSS |
| Database | Microsoft SQL Server |
| Web Server | Apache (akses via subfolder, contoh: `http://localhost:83/tdk-core-pkl`) |
| Auth | Laravel Sanctum |

---

## Struktur Proyek

```
tdk-core-pkl/
├── app/
│   ├── Console/Commands/          # Artisan command (make:module)
│   ├── Core/                      # BaseService
│   ├── Helpers/                   # ModulePathHelper, helpers.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/             # Controller modul admin (bawaan)
│   │   │   └── Modules/           # Controller modul bisnis (hasil make:module)
│   │   ├── Middleware/            # CheckMenuAccess
│   │   └── Requests/
│   │       ├── Admin/
│   │       └── Modules/           # FormRequest modul bisnis
│   ├── Models/                    # Eloquent Model
│   ├── Repositories/              # Layer akses data
│   │   └── Contracts/
│   └── Services/
│       ├── Admin/
│       └── Modules/               # Service modul bisnis
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/js/
│   ├── core/                      # moduleRegistry, MenuContext, DynamicPage, AuthContext
│   ├── layouts/                   # MainLayout, Sidebar
│   ├── modules/                   # MODUL FRONTEND (per module_key)
│   │   ├── admin/                 # Modul admin bawaan
│   │   └── {module_key}/          # Modul bisnis (dibuat make:module)
│   │       ├── pages/
│   │       ├── components/
│   │       └── services/
│   ├── routes/                    # AppRoutes.jsx
│   └── services/                  # api.js, menuService.js
├── routes/
│   ├── api.php                    # Route API utama (auto-load modules/*)
│   ├── web.php                    # Route SPA
│   └── modules/                   # Route per modul (auto-loaded)
├── stubs/module/                  # Template pembuatan modul
└── public/build/                  # Hasil vite build
```

---

## Konsep Module & Menu

### Apa itu Module?
Module adalah kumpulan file backend + frontend untuk satu fitur bisnis (contoh: Inventory, Finance, HR).

### Bagaimana Menu Terhubung ke Module?
Setiap menu di database **tabel `menus`** memiliki kolom **`module_key`**. Nilai ini menjadi penghubung:

1. **Backend API** → file `routes/modules/{module_key}.php` (auto-loaded)
2. **Frontend page** → key di `resources/js/core/moduleRegistry.js`
3. **Sidebar** → ditampilkan dari data menu user (API `/menu/sidebar`)

### Alur Render Halaman
```
URL /tdk-core-pkl/{route_path}
    → Sidebar (dari menu user)
    → DynamicRoutes (route dinamis dari menu)
    → DynamicPage (cari menu by route_path)
    → moduleRegistry (get component by module_key)
    → Halaman React
```

---

## Cara Membuat Menu Baru (Modul Baru)

### Langkah 1: Buat Module (Otomatis)

```bash
php artisan make:module inventory
```

Command ini menghasilkan secara otomatis:

**Backend:**
- `database/migrations/{timestamp}_create_inventories_table.php`
- `app/Models/Inventory.php`
- `app/Repositories/InventoryRepository.php`
- `app/Services/Modules/InventoryService.php`
- `app/Http/Requests/Modules/StoreInventoryRequest.php`
- `app/Http/Requests/Modules/UpdateInventoryRequest.php`
- `app/Http/Controllers/Modules/InventoryController.php`
- `routes/modules/inventory.php` (otomatis ter-load)

**Frontend (CRUD lengkap):**
- `resources/js/modules/inventory/pages/InventoryPage.jsx`
- `resources/js/modules/inventory/services/inventoryService.js`
- `resources/js/modules/inventory/components/InventoryFormModal.jsx`

**Otomatis juga:**
- Mendaftarkan komponen ke `resources/js/core/moduleRegistry.js`
- Menawarkan membuat menu di tabel `menus`
- Menawarkan menjalankan `php artisan migrate`
- Menawarkan menjalankan `npm run build`

### Langkah 2: Tambah Menu ke Database

Lewat command (otomatis ditawarkan) **atau** lewat UI **Menu Management** (`/tdk-core-pkl/admin/menus`).

Kolom menu yang wajib:
- **module_key**: `inventory` (harus sama dengan key di moduleRegistry)
- **name**: Nama yang tampil di sidebar
- **icon**: Nama icon `lucide-react` (contoh: `Package`)
- **route_path**: contoh `/inventory`
- **parent_id**: kosongkan jika menu utama
- **sort_order**: urutan tampil

### Langkah 3: Migrasi & Build
- Jalankan `php artisan migrate` (otomatis ditawarkan command)
- Jalankan `npm run build` (otomatis ditawarkan command)

### Langkah 4: Atur Hak Akses
Buka UI **Menu Access Management** (`/tdk-core-pkl/admin/menu-access`) untuk memberi akses ke group.

---

## Cara Menambah Data CRUD pada Menu

Saat membuat module baru, file dihasilkan dengan field default `name` dan `description`.
Untuk menambah field CRUD baru (contoh: tambah field `category` pada Inventory), **ubah file berikut**:

### 1. Migration — Tambah kolom database

**File:** `database/migrations/{timestamp}_create_inventories_table.php`

Ubah method `up()`:

```php
Schema::create('inventories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description')->nullable();
    $table->string('category')->nullable(); // ✚ TAMBAH KOLOM BARU
    $table->timestamps();
});
```

Jika tabel sudah pernah di-migrate, buat migration baru:
```bash
php artisan make:migration add_category_to_inventories_table
```

### 2. Model — Tambah ke `$fillable`

**File:** `app/Models/Inventory.php`

```php
protected $fillable = [
    'name',
    'description',
    'category', // ✚ TAMBAH DI SINI
];
```

### 3. Request (Store & Update) — Tambah validasi

**File:** `app/Http/Requests/Modules/StoreInventoryRequest.php` dan `UpdateInventoryRequest.php`

```php
public function rules(): array
{
    return [
        'name'        => ['required', 'string', 'max:255'],
        'description' => ['nullable', 'string'],
        'category'    => ['nullable', 'string', 'max:100'], // ✚ TAMBAH
    ];
}
```

### 4. Service — (Opsional) logika bisnis / audit log

**File:** `app/Services/Modules/InventoryService.php`

Tambah logika di `createItem()`, `updateItem()`, `deleteItem()` bila perlu. Contoh menambah `updated_by`:

```php
public function updateItem(int $id, array $data)
{
    $data['updated_by'] = auth()->id(); // ✚
    // ... kode yang sudah ada
}
```

### 5. Frontend Service — Tambah field pada payload

**File:** `resources/js/modules/inventory/services/inventoryService.js`

**Sebagian besar tidak perlu diubah** karena payload dikirim dari form. Jika ada transformasi, tambahkan di sini.

### 6. Frontend Modal — Tambah input field

**File:** `resources/js/modules/inventory/components/InventoryFormModal.jsx`

Tiga bagian yang diubah:

**(a) State form:**
```jsx
const [form, setForm] = useState({ name: '', description: '', category: '' });
```

**(b) useEffect saat edit:**
```jsx
setForm({
    name: initialData.name || '',
    description: initialData.description || '',
    category: initialData.category || '', // ✚
});
```

**(c) JSX input (tambahkan di dalam `<form>`):**
```jsx
<div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
    <input
        type="text" name="category" value={form.category} onChange={handleChange}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
    />
    {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category[0]}</p>}
</div>
```

### 7. Frontend Page — Tambah kolom tabel

**File:** `resources/js/modules/inventory/pages/InventoryPage.jsx`

**(a) Kolom header:**
```jsx
<tr>
    <th className="px-4 py-3">Nama</th>
    <th className="px-4 py-3">Deskripsi</th>
    <th className="px-4 py-3">Kategori</th> {/* ✚ */}
    <th className="px-4 py-3 text-right">Aksi</th>
</tr>
```

**(b) Sel data:**
```jsx
<tr key={item.id} className="border-t border-gray-100">
    <td className="px-4 py-3">{item.name}</td>
    <td className="px-4 py-3 text-gray-500">{item.description || '-'}</td>
    <td className="px-4 py-3">{item.category || '-'}</td> {/* ✚ */}
    <td className="px-4 py-3 text-right">
        {/* tombol aksi */}
    </td>
</tr>
```

**(c) Sesuaikan `colSpan` pada empty state:**
```jsx
<td colSpan={4} className="text-center py-6 text-gray-400"> {/* ganti 3 → 4 */}
```

### 8. Build Ulang
```bash
npm run build
```

---

## Alur Kerja Frontend

### `resources/js/core/moduleRegistry.js`
Pemetaan `module_key → komponen React`. **Wajib didaftarkan** agar halaman tampil (jika tidak, muncul "Module Belum Dibuat").

```js
const moduleRegistry = {
    'dashboard': lazy(() => import('../modules/dashboard/pages/DashboardPage')),
    'inventory': lazy(() => import('../modules/inventory/pages/InventoryPage')),
    // tambahkan module_key baru di sini
};
```

### `resources/js/core/DynamicPage.jsx`
- Menerima `routePath`
- Mencari menu via `useMenu().findMenuByPath(routePath)`
- Mendapat komponen via `getModuleComponent(menu.module_key)`
- Jika tidak ada → tampilkan `ModuleNotBuilt`

### `resources/js/routes/AppRoutes.jsx`
- Membuat route dinamis dari daftar menu
- Setiap menu dengan `route_path` menjadi route `/tdk-core-pkl{route_path}`

### Pola Halaman CRUD Frontend
Setiap modul CRUD memiliki 3 file:
| File | Peran |
|------|-------|
| `pages/NamaPage.jsx` | Tampilan tabel + tombol aksi (create/edit/delete) |
| `components/NamaFormModal.jsx` | Modal form tambah/edit + validasi |
| `services/namaService.js` | Fungsi API (list, create, update, delete) |

---

## Alur Kerja Backend

### Pola Layer
```
Controller → Service → Repository → Model
```

### `app/Http/Controllers/Modules/{Nama}Controller.php`
- Terima request
- Panggil FormRequest untuk validasi
- Panggil Service

### `app/Services/Modules/{Nama}Service.php`
- Logika bisnis
- Catat **AuditLog** (CREATE/UPDATE/DELETE)
- extends `BaseService`

### `app/Repositories/{Nama}Repository.php`
- Akses data Eloquent
- extends `BaseRepository`

### Route Otomatis (`routes/api.php`)
```php
// Auto-load semua route module dari routes/modules/*.php
foreach (glob(__DIR__ . '/modules/*.php') as $moduleRouteFile) {
    require $moduleRouteFile;
}
```

### Proteksi Akses (`middleware menu.access`)
Setiap route dibungkus middleware `menu.access:{module_key},{permission}`:
```php
Route::middleware('menu.access:inventory,can_view')->group(function () {
    Route::get('/inventory', [InventoryController::class, 'index']);
});
```

---

## Perintah Penting

| Perintah | Keterangan |
|----------|------------|
| `php artisan make:module nama-module` | Membuat module lengkap (backend + frontend CRUD + otomatis daftarkan) |
| `php artisan migrate` | Menjalankan migration |
| `npm run build` | Build frontend produksi |
| `php artisan route:list` | Lihat semua route |
| `php artisan make:migration nama` | Buat migration baru |
| `php artisan db:seed` | Menjalankan seeder |

---

## Ringkasan Alur Membuat Menu Baru

1. **Jalankan** `php artisan make:module inventory`
2. **Ikuti prompt** (tambah menu, migrate, build)
3. **Sesuaikan field** sesuai kebutuhan (lihat [Cara Menambah Data CRUD pada Menu](#cara-menambah-data-crud-pada-menu))
4. **Atur hak akses** lewat UI Menu Access Management
5. **Selesai** — menu tampil di sidebar dan CRUD berfungsi

---

## Modul Bawaan (Admin)

| Module Key | Nama | Fungsi |
|------------|------|--------|
| `dashboard` | Dashboard | Ringkasan utama |
| `user-management` | User Management | Kelola user |
| `group-management` | Group Management | Kelola group & hak admin |
| `menu-management` | Menu Management | Kelola menu/sidebar |
| `menu-access-management` | Menu Access Management | Atur akses menu per group |
| `system-setting` | System Setting | Pengaturan sistem |
| `audit-log` | Audit Log | Log aktivitas |