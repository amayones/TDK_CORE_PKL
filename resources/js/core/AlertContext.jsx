import { useState, useCallback, createContext, useContext, useEffect } from 'react';
import * as Icons from 'lucide-react';

const AlertContext = createContext(null);

export const initialState = {
    alerts: [],
};

export function AlertProvider({ children }) {
    const [alerts, setAlerts] = useState(initialState.alerts);

    const addAlert = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random();
        const alert = { id, message, type };

        setAlerts((prev) => [...prev, alert]);

        if (duration > 0) {
            setTimeout(() => {
                setAlerts((prev) => prev.filter((a) => a.id !== id));
            }, duration);
        }

        return id;
    }, []);

    const removeAlert = useCallback((id) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setAlerts([]);
    }, []);

    // Listen to custom events from API interceptor
    useEffect(() => {
        const handleAlertEvent = (event) => {
            const { message, type, duration } = event.detail;
            addAlert(message, type, duration);
        };

        window.addEventListener('app:alert', handleAlertEvent);

        return () => {
            window.removeEventListener('app:alert', handleAlertEvent);
        };
    }, [addAlert]);

    // Handle confirm events from global confirm function
    const [confirmResolve, setConfirmResolve] = useState(null);
    const [confirmConfig, setConfirmConfig] = useState(null);

    useEffect(() => {
        const handleConfirmEvent = (event) => {
            const { options, resolve } = event.detail;
            setConfirmConfig(options);
            setConfirmResolve(() => resolve);
        };

        window.addEventListener('app:confirm', handleConfirmEvent);

        return () => {
            window.removeEventListener('app:confirm', handleConfirmEvent);
        };
    }, []);

    const handleConfirm = () => {
        if (confirmResolve) confirmResolve(true);
        setConfirmConfig(null);
        setConfirmResolve(null);
    };

    const handleCancel = () => {
        if (confirmResolve) confirmResolve(false);
        setConfirmConfig(null);
        setConfirmResolve(null);
    };

    return (
        <AlertContext.Provider value={{ alerts, addAlert, removeAlert, clearAll }}>
            {children}
            {/* Global Confirmation Modal */}
            {confirmConfig && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                {confirmConfig.type === 'danger' && (
                                    <Icons.AlertTriangle className="w-6 h-6 text-red-600" />
                                )}
                                {confirmConfig.type === 'warning' && (
                                    <Icons.AlertCircle className="w-6 h-6 text-amber-600" />
                                )}
                                {confirmConfig.type === 'success' && (
                                    <Icons.CheckCircle className="w-6 h-6 text-green-600" />
                                )}
                                {(!confirmConfig.type || confirmConfig.type === 'info') && (
                                    <Icons.HelpCircle className="w-6 h-6 text-blue-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {confirmConfig.title || 'Konfirmasi'}
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    {confirmConfig.message || 'Apakah Anda yakin?'}
                                </p>
                                <div className="mt-6 flex gap-3 justify-end">
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                                    >
                                        {confirmConfig.cancelText || 'Batal'}
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className={`px-4 py-2 text-white rounded transition-colors ${
                                            confirmConfig.type === 'danger' ? 'bg-red-600 hover:bg-red-700' :
                                            confirmConfig.type === 'warning' ? 'bg-amber-600 hover:bg-amber-700' :
                                            confirmConfig.type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                                            'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                    >
                                        {confirmConfig.confirmText || 'Ya'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within AlertProvider');
    }
    return context;
}
