import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchSidebarMenu } from '../services/menuService';
import { useAuth } from './AuthContext';

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const loadMenu = useCallback(async () => {
        if (!user) {
            setMenus([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const data = await fetchSidebarMenu();
            setMenus(data);
        } catch (err) {
            setMenus([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadMenu();
    }, [loadMenu]);

    const flattenMenus = (items) => {
        let result = [];
        items.forEach((item) => {
            result.push(item);
            if (item.children && item.children.length > 0) {
                result = result.concat(flattenMenus(item.children));
            }
        });
        return result;
    };

    const findMenuByPath = (routePath) => {
        return flattenMenus(menus).find((m) => m.route_path === routePath);
    };

    return (
        <MenuContext.Provider value={{ menus, loading, findMenuByPath, reloadMenu: loadMenu }}>
            {children}
        </MenuContext.Provider>
    );
}

export function useMenu() {
    return useContext(MenuContext);
}