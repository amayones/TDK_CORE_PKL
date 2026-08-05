import * as Icons from 'lucide-react';
import { useAlert } from '../core/AlertContext';

export default function Alert() {
    const { alerts, removeAlert } = useAlert();

    if (alerts.length === 0) return null;

    const getAlertStyles = (type) => {
        const styles = {
            success: 'bg-green-50 border-green-400 text-green-800',
            error: 'bg-red-50 border-red-400 text-red-800',
            warning: 'bg-amber-50 border-amber-400 text-amber-800',
            info: 'bg-blue-50 border-blue-400 text-blue-800',
        };
        return styles[type] || styles.info;
    };

    const getIcon = (type) => {
        const icons = {
            success: Icons.CheckCircle,
            error: Icons.XCircle,
            warning: Icons.AlertTriangle,
            info: Icons.Info,
        };
        const Icon = icons[type] || icons.info;
        return <Icon className="w-5 h-5 flex-shrink-0" />;
    };

    const getBorderColor = (type) => {
        const colors = {
            success: 'border-green-400',
            error: 'border-red-400',
            warning: 'border-amber-400',
            info: 'border-blue-400',
        };
        return colors[type] || colors.info;
    };

    return (
        <div className="fixed top-4 right-4 z-[9998] space-y-2 max-w-md w-full">
            {alerts.map((alert) => (
                <div
                    key={alert.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg transform transition-all duration-300 ${getAlertStyles(alert.type)} ${getBorderColor(alert.type)}`}
                >
                    <div className="flex-shrink-0 mt-0.5">
                        {getIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium break-words">
                            {alert.message}
                        </p>
                    </div>
                    <button
                        onClick={() => removeAlert(alert.id)}
                        className="flex-shrink-0 hover:opacity-70 transition-opacity"
                        aria-label="Close alert"
                    >
                        <Icons.X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}