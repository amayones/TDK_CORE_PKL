# Panduan Setup Proyek TDK Core PKL untuk Developer

## Masalah yang Sering Terjadi

1. **Tampilan tidak muncul** - Assets (CSS/JS) tidak ter-load
2. **Refresh browser menyebabkan 404** - Routing SPA tidak berfungsi

---

## Langkah 1: Konfigurasi Environment

### 1.1 Copy file `.env.example` ke `.env`

```bash
cp .env.example .env
```

### 1.2 Edit file `.env` sesuai dengan setup lokal

```env
# SESUAIKAN DENGAN IP/URL LOKAL ANDA
APP_URL=http://192.168.5.22:83/tdk-core-pkl
ASSET_URL=http://192.168.5.22:83/tdk-core-pkl

# Database
DB_CONNECTION=sqlsrv
DB_HOST=localhost
DB_PORT=1433
DB_DATABASE=TDK_CORE_PKL
DB_USERNAME=may
DB_PASSWORD=may
DB_ENCRYPT=yes
DB_TRUST_SERVER_CERTIFICATE=true

# Sanctum (jika menggunakan IP lokal)
SANCTUM_STATEFUL_DOMAINS=localhost:83,192.168.5.22:83
SESSION_DOMAIN=null
```

**PENTING:** Ganti `192.168.5.22:83/tdk-core-pkl` dengan URL sesuai setup lokal teman-teman!

---

## Langkah 2: Build Assets (Frontend)

Proyek ini menggunakan Vite untuk build assets. Setelah clone dari GitHub, jalankan:

```bash
# Install dependencies
npm install

# Build untuk production
npm run build
```

Atau untuk development:
```bash
npm run dev
```

Setelah build, folder `public/build` akan terisi dengan assets yang sudah di-compile.

---

## Langkah 3: Konfigurasi Apache

### 3.1 Cek File `.htaccess`

File `public/.htaccess` **sudah ada** dan sudah dikonfigurasi untuk subfolder:

```apache
RewriteBase /tdk-core-pkl
```

**Jika path subfolder berbeda**, edit `RewriteBase` sesuai path yang digunakan.

### 3.2 Enable `mod_rewrite` di Apache

Buka file konfigurasi Apache:
- Windows: `C:\Apache2462\conf\httpd.conf`
- Linux: `/etc/apache2/apache2.conf`

Cari dan pastikan baris ini TIDAK di-comment (tidak ada `#` di depannya):

```apache
LoadModule rewrite_module modules/mod_rewrite.so
```

### 3.3 Set `AllowOverride All`

Di file konfigurasi Apache (httpd.conf atau apache2.conf), cari section `<Directory>`:

```apache
<Directory "c:/Apache2462/htdocs">
    Options Indexes FollowSymLinks
    AllowOverride All  # ← WAJIB "All", bukan "None"
    Require all granted
</Directory>
```

Ganti `AllowOverride None` menjadi `AllowOverride All`.

### 3.4 Restart Apache

```bash
# Windows
net stop Apache2.4
net start Apache2.4

# Atau via XAMPP/WAMP control panel
```

---

## Langkah 4: Setup Database

### 4.1 Buat Database di SQL Server

```sql
CREATE DATABASE TDK_CORE_PKL;
```

### 4.2 Jalankan Migration dan Seeder

```bash
php artisan migrate --seed
```

Atau manual:
```bash
php artisan migrate
php artisan db:seed
```

---

## Langkah 5: Generate App Key (jika baru clone)

```bash
php artisan key:generate
```

---

## Langkah 6: Clear Cache

```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

---

## Langkah 7: Test Aplikasi

1. Akses: `http://[IP-ANDA]:[PORT]/tdk-core-pkl`
2. Login dengan akun yang sudah di-seed
3. **Refresh browser (F5)** - Harus tetap di halaman yang sama (TIDAK 404)

---

## Troubleshooting

### Masalah: Tampilan tidak muncul (blank/halaman putih)

**Penyebab:** Assets belum di-build

**Solusi:**
```bash
npm install
npm run build
```

### Masalah: Refresh browser 404

**Penyebab:** Apache `.htaccess` tidak aktif

**Solusi:**
1. Pastikan `AllowOverride All` sudah di-set
2. Pastikan `mod_rewrite` sudah di-enable
3. Restart Apache

### Masalah: API Error / CORS

**Penyebab:** Domain/IP tidak sesuai di `.env`

**Solusi:** Update `SANCTUM_STATEFUL_DOMAINS` dengan IP/domain yang benar

### Masalah: 500 Internal Server Error

**Solusi:**
```bash
# Cek log error
tail -f storage/logs/laravel.log

# Clear cache
php artisan config:clear
php artisan cache:clear
```

---

## Catatan Penting untuk Timen

### Struktur URL Aplikasi

Aplikasi ini berjalan di **subfolder**, bukan di root domain:

```
✅ BENAR: http://192.168.5.22:83/tdk-core-pkl
❌ SALAH: http://192.168.5.22:83/
```

### File yang Perlu Dikustomisasi

- `.env` - HARUS di-edit sesuai environment lokal
- `public/.htaccess` - Edit `RewriteBase` jika path berbeda
- `resources/js/services/api.js` - Edit `baseURL` jika path berbeda (line 4)

### Dependencies yang Harus Ada

- PHP 8.1+
- Composer
- Node.js 16+
- NPM
- SQL Server
- Apache dengan mod_rewrite

---

## Quick Start Checklist

- [ ] Clone repository dari GitHub
- [ ] Copy `.env.example` ke `.env`
- [ ] Edit `.env` (APP_URL, database credentials)
- [ ] Install Composer dependencies: `composer install`
- [ ] Install NPM dependencies: `npm install`
- [ ] Build assets: `npm run build`
- [ ] Generate app key: `php artisan key:generate`
- [ ] Jalankan migration: `php artisan migrate --seed`
- [ ] Konfigurasi Apache (AllowOverride All, mod_rewrite)
- [ ] Restart Apache
- [ ] Test aplikasi