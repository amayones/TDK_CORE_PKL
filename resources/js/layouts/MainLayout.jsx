import * as Icons from 'lucide-react';
import { useAuth } from '../core/AuthContext';
import { useSidebar } from '../core/SidebarContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function MainLayout({ children }) {
    const { user, logout } = useAuth();
    const { toggle } = useSidebar();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/tdk-core-pkl/login');
    };

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-blue-700 text-white px-4 py-3 shadow flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggle}
                            className="text-white hover:text-blue-200 focus:outline-none p-1 rounded hover:bg-blue-800 transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            <Icons.Menu size={20} />
                        </button>
                        <h1 className="text-xl font-bold">TDK Core PKL</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm">
                            {user?.name} <span className="text-blue-200">({user?.group?.name})</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-sm bg-blue-800 hover:bg-blue-900 px-3 py-1 rounded transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
