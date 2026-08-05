# Global Confirmation Modal & Alert System

Sistem notifikasi global dan modal konfirmasi yang sudah diintegrasikan ke dalam proyek.

## Fitur

### 1. Alert Notification (Notifikasi)
- Tampilan notifikasi di pojok kanan atas
- 4 tipe alert dengan warna berbeda:
  - `success` (hijau) - Untuk operasi berhasil
  - `error` (merah) - Untuk kesalahan
  - `warning` (kuning/amber) - Untuk peringatan
  - `info` (biru) - Untuk informasi umum
- Auto-dismiss setelah 5 detik (dapat dikonfigurasi)
- Tombol close untuk menutup manual

### 2. Confirmation Modal (Modal Konfirmasi)
- Dialog konfirmasi dengan Promise-based API
- 4 tipe konfirmasi:
  - `danger` (merah) - Untuk aksi berbahaya (delete, dll)
  - `warning` (kuning) - Untuk peringatan
  - `success` (hijau) - Untuk konfirmasi positif
  - `info` (biru) - Untuk konfirmasi umum
- Support tombol Escape untuk cancel
- Customizable title, message, dan button text

## Penggunaan

### A. Menggunakan Alert (Notifikasi)

#### Cara 1: Global Function (Mudah)
```javascript
// Di component apapun
const handleSave = async () => {
    try {
        await saveData();
        window.__APP__.alert('Data berhasil disimpan!', 'success');
    } catch (error) {
        window.__APP__.alert('Gagal menyimpan data', 'error');
    }
};
```

#### Cara 2: Menggunakan Hook (React)
```javascript
import { useAlert } from '../core/AlertContext';

function MyComponent() {
    const { addAlert } = useAlert();
    
    const handleSave = async () => {
        try {
            await saveData();
            addAlert('Data berhasil disimpan!', 'success');
        } catch (error) {
            addAlert('Gagal menyimpan data', 'error');
        }
    };
}
```

#### Cara 3: Custom Event (Advanced)
```javascript
window.dispatchEvent(new CustomEvent('app:alert', {
    detail: {
        message: 'Custom alert message',
        type: 'warning',
        duration: 3000 // optional, default 5000ms
    }
}));
```

### B. Menggunakan Confirmation Modal

#### Cara 1: Global Function (Mudah)
```javascript
const handleDelete = async (id) => {
    const confirmed = await window.__APP__.confirm({
        type: 'danger',
        title: 'Hapus Data',
        message: 'Apakah Anda yakin ingin menghapus data ini?',
        confirmText: 'Ya, Hapus',
        cancelText: 'Batal'
    });
    
    if (confirmed) {
        await deleteData(id);
    }
};
```

#### Cara 2: Async/Await Pattern
```javascript
const handleLogout = async () => {
    const confirmed = await window.__APP__.confirm({
        type: 'warning',
        title: 'Konfirmasi Logout',
        message: 'Apakah Anda yakin ingin keluar?',
        confirmText: 'Ya, Keluar',
        cancelText: 'Batal'
    });
    
    if (confirmed) {
        // Perform logout
        await logout();
    }
};
```

#### Cara 3: Custom Event (Advanced)
```javascript
const confirmed = await new Promise((resolve) => {
    window.dispatchEvent(new CustomEvent('app:confirm', {
        detail: {
            options: {
                type: 'info',
                title: 'Konfirmasi',
                message: 'Apakah Anda yakin?',
                confirmText: 'Ya',
                cancelText: 'Tidak'
            },
            resolve
        }
    }));
});
```

### C. API Error Handling Otomatis

Sistem alert otomatis menangkap error dari API:

```javascript
import api from '../services/api';

// 401 Unauthorized - Auto redirect ke login
// 403 Forbidden - Alert error
// 422 Validation Error - Alert warning
// 500 Server Error - Alert error
// Network Error - Alert error

try {
    await api.post('/endpoint', data);
} catch (error) {
    // Alert sudah ditampilkan otomatis oleh interceptor
    // Tidak perlu handle alert lagi di sini
}
```

## Contoh Penggunaan di Component

### Example 1: Delete Button dengan Konfirmasi
```javascript
import { useState } from 'react';
import api from '../../services/api';

function UserList() {
    const [loading, setLoading] = useState(false);
    
    const handleDelete = async (userId) => {
        const confirmed = await window.__APP__.confirm({
            type: 'danger',
            title: 'Hapus User',
            message: 'Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak bisa dibatalkan.',
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal'
        });
        
        if (!confirmed) return;
        
        setLoading(true);
        try {
            await api.delete(`/users/${userId}`);
            window.__APP__.alert('User berhasil dihapus', 'success');
            // Refresh data
            fetchUsers();
        } catch (error) {
            // Alert error sudah ditampilkan otomatis
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <button 
            onClick={() => handleDelete(user.id)}
            disabled={loading}
        >
            Hapus
        </button>
    );
}
```

### Example 2: Form Submit dengan Validasi
```javascript
const handleSubmit = async (formData) => {
    try {
        await api.post('/users', formData);
        window.__APP__.alert('User berhasil ditambahkan!', 'success', 5000);
        // Close modal, reset form, etc.
    } catch (error) {
        // Validation errors (422) akan ditampilkan otomatis
        // Anda juga bisa menambahkan custom message jika perlu
        if (error.response?.status === 422) {
            // Alert warning sudah ditampilkan oleh interceptor
        }
    }
};
```

### Example 3: Warning untuk Aksi Berbahaya
```javascript
const handleBulkDelete = async (selectedIds) => {
    const confirmed = await window.__APP__.confirm({
        type: 'warning',
        title: 'Hapus Data Terpilih',
        message: `Anda akan menghapus ${selectedIds.length} data. Apakah yakin?`,
        confirmText: 'Ya, Hapus Semua',
        cancelText: 'Batal'
    });
    
    if (confirmed) {
        await api.post('/users/bulk-delete', { ids: selectedIds });
        window.__APP__.alert('Data berhasil dihapus', 'success');
    }
};
```

## Konfigurasi Alert

### Duration (Auto-dismiss)
```javascript
// Alert dengan duration custom (dalam milliseconds)
window.__APP__.alert('Pesan penting!', 'info', 8000); // 8 detik

// Alert tanpa auto-dismiss (harus di-close manual)
window.__APP__.alert('Pesan permanen', 'error', 0); // 0 = tidak auto-close
```

## Tips Penggunaan

1. **Gunakan type yang sesuai:**
   - `success`: Operasi berhasil (create, update, delete)
   - `error`: Kesalahan sistem, network error
   - `warning`: Validation errors, aksi berbahaya
   - `info`: Informasi umum, tips

2. **Konfirmasi untuk aksi destruktif:**
   - Delete operations
   - Bulk actions
   - Aksi yang tidak bisa dibatalkan

3. **Message yang jelas:**
   - Gunakan bahasa yang mudah dipahami
   - Sertakan konteks jika perlu
   - Untuk error, tampilkan pesan yang actionable

## Files yang Ditambahkan/Diubah

### Files Baru:
- `resources/js/core/ConfirmModal.jsx` - Component modal konfirmasi
- `resources/js/core/AlertContext.jsx` - Context dan provider untuk alert + confirm
- `resources/js/components/Alert.jsx` - Component UI untuk alert notifications
- `resources/js/hooks/useConfirm.js` - Helper hook untuk confirm
- `resources/js/core/README_GLOBAL_MODAL_ALERT.md` - Dokumentasi ini

### Files yang Diubah:
- `resources/js/app.jsx` - Menambahkan AlertProvider
- `resources/js/layouts/MainLayout.jsx` - Menambahkan Alert component
- `resources/js/services/api.js` - Menambahkan interceptor untuk error handling

## Troubleshooting

### Alert tidak muncul?
- Pastikan AlertProvider sudah di-wrap di app.jsx
- Pastikan Alert component ada di MainLayout

### Confirm tidak muncul?
- Pastikan AlertProvider terinstall
- Cek console untuk error

### API error tidak menampilkan alert?
- Pastikan api interceptor sudah terpasang
- Cek apakah window.__APP__ sudah terdefinisi