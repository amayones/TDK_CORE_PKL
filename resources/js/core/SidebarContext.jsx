import { createContext, useContext, useState, useCallback } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    const toggle = useCallback(() => {
        setCollapsed((prev) => !prev);
    }, []);

    return (
        <SidebarContext.Provider value={{ collapsed, toggle }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}
