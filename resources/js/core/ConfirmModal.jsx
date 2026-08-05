import * as Icons from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ConfirmModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState(null);
    const [resolveValue, setResolveValue] = useState(null);

    const confirm = (options) => {
        return new Promise((resolve) => {
            setConfig(options);
            setResolveValue(() => resolve);
            setIsOpen(true);
        });
    };

    const handleConfirm = () => {
        setIsOpen(false);
        if (resolveValue) resolveValue(true);
        setConfig(null);
    };

    const handleCancel = () => {
        setIsOpen(false);
        if (resolveValue) resolveValue(false);
        setConfig(null);
    };

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleCancel();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    if (!isOpen || !config) return null;

    const titleColors = {
        warning: 'text-amber-600',
        danger: 'text-red-600',
        info: 'text-blue-600',
        success: 'text-green-600',
    };

    const buttonColors = {
        warning: 'bg-amber-600 hover:bg-amber-700',
        danger: 'bg-red-600 hover:bg-red-700',
        info: 'bg-blue-600 hover:bg-blue-700',
        success: 'bg-green-600 hover:bg-green-700',
    };

    const type = config.type || 'info';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        {type === 'danger' && (
                            <Icons.AlertTriangle className="w-6 h-6 text-red-600" />
                        )}
                        {type === 'warning' && (
                            <Icons.AlertCircle className="w-6 h-6 text-amber-600" />
                        )}
                        {type === 'info' && (
                            <Icons.HelpCircle className="w-6 h-6 text-blue-600" />
                        )}
                        {type === 'success' && (
                            <Icons.CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${titleColors[type] || titleColors.info}`}>
                            {config.title || 'Konfirmasi'}
                        </h3>
                        <p className="mt-2 text-gray-600">
                            {config.message || 'Apakah Anda yakin?'}
                        </p>
                        <div className="mt-6 flex gap-3 justify-end">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                            >
                                {config.cancelText || 'Batal'}
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`px-4 py-2 text-white rounded transition-colors ${buttonColors[type] || buttonColors.info}`}
                            >
                                {config.confirmText || 'Ya'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

