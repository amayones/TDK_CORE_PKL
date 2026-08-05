import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useMenu } from '../core/MenuContext';
import { useSidebar } from '../core/SidebarContext';

function MenuIcon({ name }) {
    const IconComponent = Icons[name] || Icons.Circle;
    return <IconComponent size={18} />;
}

/**
 * Tooltip yang di-render ke document.body via Portal.
 * Menggunakan position:fixed agar tidak terpotong oleh overflow container sidebar.
 */
function PortalTooltip({ targetRef, show, children }) {
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (show && targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top + rect.height / 2,
                left: rect.right + 8,
            });
        }
    }, [show, targetRef]);

    if (!show) return null;

    return createPortal(
        <div
            style={{
                position: 'fixed',
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                transform: 'translateY(-50%)',
            }}
            className="px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-[9999] pointer-events-none"
        >
            {children}
        </div>,
        document.body
    );
}

function MenuItem({ menu, basePath }) {
    const { collapsed } = useSidebar();
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState(false);
    const itemRef = useRef(null);
    const hasChildren = menu.children && menu.children.length > 0;

    const handleMouseEnter = useCallback(() => setHovered(true), []);
    const handleMouseLeave = useCallback(() => setHovered(false), []);

    if (hasChildren) {
        return (
            <div className="mb-1">
                <div
                    ref={itemRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
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
                </div>

                {/* Tooltip via Portal saat collapsed */}
                {collapsed && (
                    <PortalTooltip targetRef={itemRef} show={hovered}>
                        {menu.name}
                    </PortalTooltip>
                )}

                {/* Submenu — hanya saat tidak collapsed */}
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
        <div className="mb-1">
            <div
                ref={itemRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
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
            </div>

            {/* Tooltip via Portal saat collapsed */}
            {collapsed && (
                <PortalTooltip targetRef={itemRef} show={hovered}>
                    {menu.name}
                </PortalTooltip>
            )}
        </div>
    );
}

export default function Sidebar({ basePath = '/tdk-core-pkl' }) {
    const { menus, loading } = useMenu();
    const { collapsed, toggle } = useSidebar();

    return (
        <aside
            className={`bg-blue-700 h-screen shrink-0 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
                collapsed ? 'w-16' : 'w-64'
            }`}
        >
            {/* Header sidebar: burger toggle + tulisan "Menu" */}
            <div className="px-2 py-3 border-b border-blue-800 flex items-center gap-2">
                <button
                    onClick={toggle}
                    className="text-white hover:text-blue-200 focus:outline-none p-1.5 rounded hover:bg-blue-800 transition-colors shrink-0"
                    aria-label="Toggle sidebar"
                >
                    {collapsed ? <Icons.Menu size={18} /> : <Icons.PanelLeftClose size={18} />}
                </button>
                {!collapsed && <h2 className="text-white font-bold text-lg">Menu</h2>}
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {loading && <p className="text-blue-200 text-sm px-3">Memuat menu...</p>}

                {!loading && menus.length === 0 && (
                    <p className="text-blue-200 text-sm px-3">Tidak ada menu tersedia.</p>
                )}

                {!loading && menus.map((menu) => (
                    <MenuItem key={menu.id} menu={menu} basePath={basePath} />
                ))}
            </div>
        </aside>
    );
}