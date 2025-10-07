import React from 'react';

export default function AdminAlertBadge({ alert, onDismiss }) {
    const typeConfig = {
        security: { color: 'red', icon: '🔒' },
        system: { color: 'blue', icon: '⚙️' },
        transaction: { color: 'yellow', icon: '💳' },
        compliance: { color: 'purple', icon: '📋' }
    };

    const severityConfig = {
        high: 'red',
        medium: 'yellow',
        low: 'green',
        info: 'blue'
    };

    const config = typeConfig[alert.type] || typeConfig.system;
    const severityColor = severityConfig[alert.severity] || 'blue';

    const getColorClasses = (color) => ({
        red: {
            border: 'border-red-500',
            bg: 'bg-red-50',
            hoverBg: 'hover:bg-red-100',
            badge: 'bg-red-100 text-red-800'
        },
        blue: {
            border: 'border-blue-500',
            bg: 'bg-blue-50',
            hoverBg: 'hover:bg-blue-100',
            badge: 'bg-blue-100 text-blue-800'
        },
        yellow: {
            border: 'border-yellow-500',
            bg: 'bg-yellow-50',
            hoverBg: 'hover:bg-yellow-100',
            badge: 'bg-yellow-100 text-yellow-800'
        },
        purple: {
            border: 'border-purple-500',
            bg: 'bg-purple-50',
            hoverBg: 'hover:bg-purple-100',
            badge: 'bg-purple-100 text-purple-800'
        },
        green: {
            border: 'border-green-500',
            bg: 'bg-green-50',
            hoverBg: 'hover:bg-green-100',
            badge: 'bg-green-100 text-green-800'
        }
    }[color]);

    const colorClasses = getColorClasses(config.color);
    const severityClasses = getColorClasses(severityColor);

    return (
        <div className={`flex items-start justify-between p-3 sm:p-4 rounded-lg border-l-4 ${colorClasses.border} ${colorClasses.bg} ${colorClasses.hoverBg} transition-colors`}>
            <div className="flex-1 min-w-0 pr-3">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-lg sm:text-xl flex-shrink-0">{config.icon}</span>
                    <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses.badge} capitalize`}>
                        {alert.type}
                    </span>
                    <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${severityClasses.badge} capitalize`}>
                        {alert.severity}
                    </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 font-medium break-words">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
            </div>
            {onDismiss && (
                <button
                    onClick={() => onDismiss(alert.id)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1"
                    aria-label="Dismiss alert"
                >
                    <span className="text-xl">×</span>
                </button>
            )}
        </div>
    );
}