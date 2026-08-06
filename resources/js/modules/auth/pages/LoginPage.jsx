import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/AuthContext';
import loginImage from '../../../../assets/login.jpg';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/tdk-core-pkl/dashboard');
        } catch (err) {
            const message = err.response?.data?.message
                || err.response?.data?.errors?.username?.[0]
                || 'Login gagal. Periksa kembali username dan password Anda.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #30AFFF, #CFECF3)' }}>
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl flex overflow-hidden">

                {/* Left — Form */}
                <div className="w-full md:w-1/2 p-10 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-10">
                            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#30AFFF' }}></span>
                            <span className="font-semibold text-gray-800">TDK Core PKL</span>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                            Holla, Welcome...
                        </h2>
                        <p className="text-sm text-gray-400 mb-8">Please sign in to your account</p>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4 border border-red-200">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#30AFFF]"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#30AFFF]"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="text-white px-8 py-3 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
                                style={{ background: '#30AFFF' }}
                            >
                                {loading ? 'Memproses...' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right — Image */}
                <div className="hidden md:block w-1/2">
                    <img
                        src={loginImage}
                        alt="Login Illustration"
                        className="w-full h-full object-cover"
                    />
                </div>

            </div>
        </div>
    );
}