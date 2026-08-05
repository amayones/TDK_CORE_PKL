import axios from 'axios';

const api = axios.create({
    baseURL: '/tdk-core-pkl/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        const message = response?.data?.message || 'Terjadi kesalahan yang tidak diketahui';

        if (response) {
            switch (response.status) {
                case 401:
                    // Unauthorized - token expired or invalid
                    window.dispatchEvent(new Event('auth:logout'));
                    break;
                case 403:
                    // Forbidden - no access
                    window.dispatchEvent(new CustomEvent('app:alert', {
                        detail: {
                            message: 'Akses ditolak: Anda tidak memiliki hak untuk melakukan aksi ini',
                            type: 'error',
                        },
                    }));
                    break;
                case 422:
                    // Validation error
                    window.dispatchEvent(new CustomEvent('app:alert', {
                        detail: {
                            message,
                            type: 'warning',
                        },
                    }));
                    break;
                case 500:
                    // Server error
                    window.dispatchEvent(new CustomEvent('app:alert', {
                        detail: {
                            message: 'Terjadi kesalahan server. Silakan coba lagi nanti.',
                            type: 'error',
                        },
                    }));
                    break;
                default:
                    window.dispatchEvent(new CustomEvent('app:alert', {
                        detail: {
                            message,
                            type: 'error',
                        },
                    }));
            }
        } else {
            // Network error
            window.dispatchEvent(new CustomEvent('app:alert', {
                detail: {
                    message: 'Tidak dapat terhubung ke server. Periksa koneksi Anda.',
                    type: 'error',
                },
            }));
        }

        return Promise.reject(error);
    }
);

export default api;
