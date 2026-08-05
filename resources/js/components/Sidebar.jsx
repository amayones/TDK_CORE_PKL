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
 * - position: fixed agar tidak terpotong overflow container sidebar
 * - background & text sesuai tema sidebar (bg-blue-700, text-white)
 * - height mengikuti icon, width menyesuaikan teks
 * - animasi fade + slide perlahan
 */
function PortalTooltip({ targetRef, show, children }) {
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (show && targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top,
                left: rect.right + 4,
                height: rect.height,
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
                height: `${coords.height}px`,
            }}
            className="flex items-center px-3 bg-blue-700 text-white text-sm rounded-md shadow-lg whitespace-nowrap z-[9999] pointer-events-none sidebar-tooltip-enter"
        >
            {children}
        </div>,
        document.body
    );
}

function MenuItem({ menu, basePath }) {
    const { collapsed, closeMobile } = useSidebar();
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

                {/* Tooltip via Portal saat collapsed (desktop only) */}
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
                    onClick={closeMobile}
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

            {/* Tooltip via Portal saat collapsed (desktop only) */}
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
    const { collapsed, toggle, mobileOpen, closeMobile } = useSidebar();

    return (
        <>
            {/* Mobile: sidebar overlay (fixed) */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 bg-blue-700 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out md:hidden ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                } w-64`}
            >
                {/* Header sidebar mobile: tulisan "Menu" + tombol close */}
                <div className="px-3 py-3 border-b border-blue-800 flex items-center">
                    <h2 className="text-white font-bold text-lg">Menu</h2>
                    <button
                        onClick={closeMobile}
                        className="text-white hover:text-blue-200 focus:outline-none p-1.5 rounded hover:bg-blue-800 transition-colors shrink-0 ml-auto"
                        aria-label="Close sidebar"
                    >
                        <Icons.X size={18} />
                    </button>
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

            {/* Desktop: sidebar static */}
            <aside
                className={`hidden md:flex bg-blue-700 h-screen shrink-0 flex-col overflow-hidden transition-all duration-300 ease-in-out ${
                    collapsed ? 'w-16' : 'w-64'
                }`}
            >
                {/* Header sidebar desktop: tulisan "Menu" + burger toggle di sebelah kanan */}
                <div className="px-3 py-3 border-b border-blue-800 flex items-center">
                    {!collapsed && <h2 className="text-white font-bold text-lg">Menu</h2>}
                    <button
                        onClick={toggle}
                        className="text-white hover:text-blue-200 focus:outline-none p-1.5 rounded hover:bg-blue-800 transition-colors shrink-0 ml-auto"
                        aria-label="Toggle sidebar"
                    >
                        {collapsed ? <Icons.Menu size={18} /> : <Icons.PanelLeftClose size={18} />}
                    </button>
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
        </>
    );
}