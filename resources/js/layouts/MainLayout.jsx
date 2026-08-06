import * as Icons from 'lucide-react';
import { useAuth } from '../core/AuthContext';
import { useSidebar } from '../core/SidebarContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Alert from '../components/Alert';

export default function MainLayout({ children }) {
    const { user, logout } = useAuth();
    const { collapsed, mobileOpen, toggleMobile, closeMobile } = useSidebar();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/tdk-core-pkl/login');
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {mobileOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden" onClick={closeMobile} />
            )}

            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-100 shadow-sm px-4 py-3 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Burger mobile */}
                        <button
                            onClick={toggleMobile}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none p-1.5 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
                            aria-label="Toggle mobile sidebar"
                        >
                            <Icons.Menu size={20} />
                        </button>
                        {/* Title hanya muncul di desktop saat sidebar collapsed */}
                        {collapsed && (
                            <h1 className="text-base sm:text-lg font-bold text-gray-800 hidden md:block">TDK Core PKL</h1>
                        )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
                            {user?.name} <span className="text-gray-400">({user?.group?.name})</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-xs sm:text-sm text-white px-3 py-1.5 rounded-lg transition-colors"
                            style={{ background: 'linear-gradient(135deg, #30AFFF, #CFECF3)' }}
                        >
                            Logout
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-3 sm:p-6">
                    {children}
                </main>

                <Alert />
            </div>
        </div>
    );
}
