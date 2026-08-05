export default function ModuleNotBuilt({ menu }) {
    const paths = [
        { label: 'Frontend Page', value: menu?.frontend_path || `resources/js/modules/${menu?.module_key}/pages/` },
        { label: 'Backend Route', value: `routes/modules/${menu?.module_key}.php` },
        { label: 'Controller', value: menu?.backend_controller || `app/Http/Controllers/Modules/` },
        { label: 'Service', value: menu?.backend_service || `app/Services/Modules/` },
        { label: 'Repository', value: menu?.backend_repository || `app/Repositories/` },
    ];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Modul "{menu?.name}" Belum Dibuat
            </h2>
            <p className="text-gray-500 mb-4 text-sm">
                Menu ini sudah terdaftar di database, tetapi file halaman untuk modul ini
                belum dibuat. Buat file berikut untuk mengaktifkan modul ini:
            </p>

            <div className="space-y-2">
                {paths.map((path, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded px-4 py-2">
                        <span className="text-xs text-gray-500 block">{path.label}</span>
                        <code className="text-sm text-blue-700 break-all">{path.value}</code>
                    </div>
                ))}
            </div>

            <p className="text-xs text-gray-400 mt-4">
                Setelah file dibuat, daftarkan module_key "{menu?.module_key}" di
                resources/js/core/moduleRegistry.js
            </p>
        </div>
    );
}