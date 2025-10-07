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

    return (
        <div className={`flex items-start justify-between p-4 rounded-lg border-l-4 border-${config.color}-500 bg-${config.color}-50 hover:bg-${config.color}-100 transition-colors`}>
            <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">{config.icon}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800 capitalize`}>
                        {alert.type}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${severityColor}-100 text-${severityColor}-800 capitalize`}>
                        {alert.severity}
                    </span>
                </div>
                <p className="text-sm text-gray-700 font-medium">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
            </div>
            {onDismiss && (
                <button
                    onClick={() => onDismiss(alert.id)}
                    className="text-gray-400 hover:text-gray-600 ml-4 flex-shrink-0"
                >
                    <span className="text-xl">×</span>
                </button>
            )}
        </div>
    );
}