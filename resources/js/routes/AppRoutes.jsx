import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../modules/auth/pages/LoginPage';
import ProtectedRoute from '../core/ProtectedRoute';
import DynamicPage from '../core/DynamicPage';
import { useMenu } from '../core/MenuContext';

function flattenMenus(items) {
    let result = [];
    items.forEach((item) => {
        result.push(item);
        if (item.children && item.children.length > 0) {
            result = result.concat(flattenMenus(item.children));
        }
    });
    return result;
}

function DynamicRoutes() {
    const { menus, loading } = useMenu();

    if (loading) {
        return null;
    }

    const flatMenus = flattenMenus(menus);

    return (
        <Routes>
            <Route
                path="/tdk-core-pkl"
                element={<DynamicPage routePath="/dashboard" />}
            />
            {flatMenus.map((menu) => (
                <Route
                    key={menu.id}
                    path={`/tdk-core-pkl${menu.route_path}`}
                    element={<DynamicPage routePath={menu.route_path} />}
                />
            ))}
        </Routes>
    );
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/tdk-core-pkl/login" element={<LoginPage />} />

            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <DynamicRoutes />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}