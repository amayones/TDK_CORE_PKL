import { createContext, useContext, useState, useCallback } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [collapsed, setCollapsed] = useState(false); // desktop: icon-only
    const [mobileOpen, setMobileOpen] = useState(false); // mobile: overlay open

    const toggle = useCallback(() => {
        setCollapsed((prev) => !prev);
    }, []);

    const toggleMobile = useCallback(() => {
        setMobileOpen((prev) => !prev);
    }, []);

    const closeMobile = useCallback(() => {
        setMobileOpen(false);
    }, []);

    return (
        <SidebarContext.Provider value={{ collapsed, toggle, mobileOpen, toggleMobile, closeMobile }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}