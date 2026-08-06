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

function PortalTooltip({ targetRef, show, children }) {
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (show && targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            setCoords({ top: rect.top, left: rect.right + 4, height: rect.height });
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
                background: 'linear-gradient(135deg, #30AFFF, #CFECF3)',
            }}
            className="flex items-center px-3 text-white text-sm rounded-md shadow-lg whitespace-nowrap z-[9999] pointer-events-none sidebar-tooltip-enter"
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

    const baseItemClass = 'text-gray-500 hover:text-gray-800 hover:bg-gray-100';

    if (hasChildren) {
        return (
            <div className="mb-1">
                <div ref={itemRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <button
                        onClick={() => !collapsed && setOpen(!open)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${baseItemClass}`}
                    >
                        <span className="shrink-0"><MenuIcon name={menu.icon} /></span>
                        {!collapsed && (
                            <>
                                <span className="whitespace-nowrap">{menu.name}</span>
                                <Icons.ChevronDown
                                    size={16}
                                    className={`ml-auto transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                                />
                            </>
                        )}
                    </button>
                </div>

                {collapsed && <PortalTooltip targetRef={itemRef} show={hovered}>{menu.name}</PortalTooltip>}

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
            <div ref={itemRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <NavLink
                    to={`${basePath}${menu.route_path}`}
                    onClick={closeMobile}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 ${
                            isActive ? 'text-white font-medium shadow-sm' : baseItemClass
                        }`
                    }
                    style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg, #30AFFF, #CFECF3)' } : {}}
                >
                    <span className="shrink-0"><MenuIcon name={menu.icon} /></span>
                    {!collapsed && (
                        <span className="whitespace-nowrap">{menu.name}</span>
                    )}
                </NavLink>
            </div>

            {collapsed && <PortalTooltip targetRef={itemRef} show={hovered}>{menu.name}</PortalTooltip>}
        </div>
    );
}

export default function Sidebar({ basePath = '/tdk-core-pkl' }) {
    const { menus, loading } = useMenu();
    const { collapsed, toggle, mobileOpen, closeMobile } = useSidebar();

    const menuContent = (
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {loading && <p className="text-sm px-3 text-gray-400">Memuat menu...</p>}
            {!loading && menus.length === 0 && (
                <p className="text-sm px-3 text-gray-400">Tidak ada menu tersedia.</p>
            )}
            {!loading && menus.map((menu) => (
                <MenuItem key={menu.id} menu={menu} basePath={basePath} />
            ))}
        </div>
    );

    return (
        <>
            {/* Mobile */}
            <aside className={`fixed inset-y-0 left-0 z-40 bg-white flex flex-col overflow-hidden transition-transform duration-300 ease-in-out md:hidden shadow-xl ${
                mobileOpen ? 'translate-x-0' : '-translate-x-full'
            } w-64`}>
                <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ background: 'linear-gradient(135deg, #30AFFF, #CFECF3)' }}>T</div>
                    <h2 className="font-bold text-base text-gray-800">TDK Core PKL</h2>
                    <button onClick={closeMobile} className="text-gray-400 hover:text-gray-600 focus:outline-none p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0 ml-auto" aria-label="Close sidebar">
                        <Icons.X size={18} />
                    </button>
                </div>
                {menuContent}
            </aside>

            {/* Desktop */}
            <aside className={`hidden md:flex bg-white h-screen shrink-0 flex-col overflow-hidden transition-all duration-300 ease-in-out border-r border-gray-100 shadow-sm ${
                collapsed ? 'w-16' : 'w-64'
            }`}>
                {/* Header: saat collapsed hanya tombol toggle, saat expanded logo + title + tombol */}
                <div className="h-[57px] border-b border-gray-100 flex items-center px-3">
                    {collapsed ? (
                        <button
                            onClick={toggle}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none p-1.5 rounded-lg hover:bg-gray-100 transition-colors mx-auto"
                            aria-label="Open sidebar"
                        >
                            <Icons.Menu size={18} />
                        </button>
                    ) : (
                        <>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                                style={{ background: 'linear-gradient(135deg, #30AFFF, #CFECF3)' }}>T</div>
                            <h2 className="font-bold text-base text-gray-800 ml-3">TDK Core PKL</h2>
                            <button
                                onClick={toggle}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0 ml-auto"
                                aria-label="Close sidebar"
                            >
                                <Icons.PanelLeftClose size={18} />
                            </button>
                        </>
                    )}
                </div>
                {menuContent}
            </aside>
        </>
    );
}
