import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useMenu } from '../core/MenuContext';
import { useSidebar } from '../core/SidebarContext';

function MenuIcon({ name }) {
    const IconComponent = Icons[name] || Icons.Circle;
    return <IconComponent size={18} />;
}

function MenuItem({ menu, basePath }) {
    const { collapsed } = useSidebar();
    const [open, setOpen] = useState(false);
    const hasChildren = menu.children && menu.children.length > 0;

    if (hasChildren) {
        return (
            <div className="relative group/menu mb-1">
                <button
                    onClick={() => !collapsed && setOpen(!open)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-blue-800 rounded transition-colors"
                >
                    <MenuIcon name={menu.icon} />
                    <span className={`transition-all duration-300 ${
                        collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    }`}>
                        {menu.name}
                    </span>
                    {!collapsed && (
                        <Icons.ChevronDown
                            size={16}
                            className={`ml-auto transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                        />
                    )}
                </button>

                {/* Tooltip nama menu saat collapsed */}
                {collapsed && (
                    <span
                        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/menu:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                    >
                        {menu.name}
                    </span>
                )}

                {/* Submenu — hanya muncul saat tidak collapsed */}
                {!collapsed && open && (
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
        <div className="relative group/item mb-1">
            <NavLink
                to={`${basePath}${menu.route_path}`}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 text-sm rounded transition-all duration-300 ${
                        isActive
                            ? 'bg-blue-900 text-white'
                            : 'text-gray-200 hover:bg-blue-800'
                    }`
                }
            >
                <MenuIcon name={menu.icon} />
                <span
                    className={`whitespace-nowrap transition-all duration-300 ${
                        collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    }`}
                >
                    {menu.name}
                </span>
            </NavLink>

            {/* Tooltip nama menu saat collapsed, muncul on hover */}
            {collapsed && (
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {menu.name}
                </span>
            )}
        </div>
    );
}

export default function Sidebar({ basePath = '/tdk-core-pkl' }) {
    const { menus, loading } = useMenu();
    const { collapsed } = useSidebar();

    return (
        <aside
            className={`bg-blue-700 h-screen shrink-0 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
                collapsed ? 'w-16' : 'w-64'
            }`}
        >
            <div className="px-3 py-3 border-b border-blue-800 flex items-center justify-between">
                {!collapsed && <h2 className="text-white font-bold text-lg">Menu</h2>}
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
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
