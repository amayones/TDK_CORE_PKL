import * as Icons from 'lucide-react';
import { useAuth } from '../core/AuthContext';
import { useSidebar } from '../core/SidebarContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function MainLayout({ children }) {
    const { user, logout } = useAuth();
    const { mobileOpen, toggleMobile, closeMobile } = useSidebar();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/tdk-core-pkl/login');
    };

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden">
            {/* Backdrop untuk mobile saat sidebar terbuka */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                    onClick={closeMobile}
                />
            )}

            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-blue-700 text-white px-4 py-3 shadow flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Burger untuk mobile (di navbar) */}
                        <button
                            onClick={toggleMobile}
                            className="text-white hover:text-blue-200 focus:outline-none p-1 rounded hover:bg-blue-800 transition-colors md:hidden"
                            aria-label="Toggle mobile sidebar"
                        >
                            <Icons.Menu size={20} />
                        </button>
                        <h1 className="text-base sm:text-xl font-bold">TDK Core PKL</h1>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <span className="text-xs sm:text-sm hidden sm:inline">
                            {user?.name} <span className="text-blue-200">({user?.group?.name})</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-xs sm:text-sm bg-blue-800 hover:bg-blue-900 px-2 sm:px-3 py-1 rounded transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-3 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}