import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useMenu } from '../core/MenuContext';

function MenuIcon({ name }) {
    const IconComponent = Icons[name] || Icons.Circle;
    return <IconComponent size={18} />;
}

function MenuItem({ menu, basePath }) {
    const [open, setOpen] = useState(false);
    const hasChildren = menu.children && menu.children.length > 0;

    if (hasChildren) {
        return (
            <div>
                <button
                    onClick={() => setOpen(!open)}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-200 hover:bg-blue-800 rounded"
                >
                    <span className="flex items-center gap-3">
                        <MenuIcon name={menu.icon} />
                        {menu.name}
                    </span>
                    <Icons.ChevronDown size={16} className={open ? 'rotate-180 transition' : 'transition'} />
                </button>
                {open && (
                    <div className="ml-6 mt-1 space-y-1">
                        {menu.children.map((child) => (
                            <MenuItem key={child.id} menu={child} basePath={basePath} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <NavLink
            to={`${basePath}${menu.route_path}`}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 text-sm rounded ${
                    isActive ? 'bg-blue-900 text-white' : 'text-gray-200 hover:bg-blue-800'
                }`
            }
        >
            <MenuIcon name={menu.icon} />
            {menu.name}
        </NavLink>
    );
}

export default function Sidebar({ basePath = '/tdk-core-pkl' }) {
    const { menus, loading } = useMenu();

    return (
        <aside className="w-64 bg-blue-700 h-screen shrink-0 flex flex-col overflow-hidden">
            <div className="px-4 py-4 border-b border-blue-800">
                <h2 className="text-white font-bold text-lg">Menu</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {loading && <p className="text-blue-200 text-sm px-4">Memuat menu...</p>}

                {!loading && menus.length === 0 && (
                    <p className="text-blue-200 text-sm px-4">Tidak ada menu tersedia.</p>
                )}

                {!loading && menus.map((menu) => (
                    <MenuItem key={menu.id} menu={menu} basePath={basePath} />
                ))}
            </div>
        </aside>
    );
}