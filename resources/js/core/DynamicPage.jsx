import { Suspense } from 'react';
import { useMenu } from './MenuContext';
import { getModuleComponent } from './moduleRegistry';
import ModuleNotBuilt from './ModuleNotBuilt';

export default function DynamicPage({ routePath }) {
    const { findMenuByPath, loading } = useMenu();

    if (loading) {
        return <p className="text-gray-500">Memuat...</p>;
    }

    const menu = findMenuByPath(routePath);

    if (!menu) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">Halaman tidak ditemukan atau Anda tidak memiliki akses.</p>
            </div>
        );
    }

    const Component = getModuleComponent(menu.module_key);

    if (!Component) {
        return <ModuleNotBuilt menu={menu} />;
    }

    return (
        <Suspense fallback={<p className="text-gray-500">Memuat modul...</p>}>
            <Component menu={menu} />
        </Suspense>
    );
}