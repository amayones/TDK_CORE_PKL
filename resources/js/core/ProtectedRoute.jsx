import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Memuat...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/tdk-core-pkl/login" replace />;
    }

    return children;
}