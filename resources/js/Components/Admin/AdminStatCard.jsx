import React from 'react';

export default function AdminStatCard({ 
    title, 
    value, 
    icon, 
    color = 'indigo', 
    trend = null, 
    subtitle = null,
    loading = false 
}) {
    const colorClasses = {
        indigo: 'border-indigo-500 text-indigo-600 bg-indigo-50',
        blue: 'border-blue-500 text-blue-600 bg-blue-50',
        green: 'border-green-500 text-green-600 bg-green-50',
        yellow: 'border-yellow-500 text-yellow-600 bg-yellow-50',
        red: 'border-red-500 text-red-600 bg-red-50',
        purple: 'border-purple-500 text-purple-600 bg-purple-50',
        orange: 'border-orange-500 text-orange-600 bg-orange-50',
        cyan: 'border-cyan-500 text-cyan-600 bg-cyan-50',
        gray: 'border-gray-500 text-gray-600 bg-gray-50'
    };

    if (loading) {
        return (
            <div className="bg-white overflow-hidden shadow-sm rounded-xl border-l-4 border-gray-300 animate-pulse">
                <div className="p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg"></div>
                        </div>
                        <div className="ml-4 sm:ml-5 w-0 flex-1">
                            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const borderColor = colorClasses[color].split(' ')[0];
    const textColor = colorClasses[color].split(' ')[1];
    const bgColor = colorClasses[color].split(' ')[2];

    return (
        <div className={`bg-white overflow-hidden shadow-sm rounded-xl border-l-4 ${borderColor} hover:shadow-md transition-all duration-200`}>
            <div className="p-4 sm:p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
                            <span className={`text-xl sm:text-2xl ${textColor}`}>{icon}</span>
                        </div>
                    </div>
                    <div className="ml-4 sm:ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate mb-1">
                                {title}
                            </dt>
                            <dd className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                                {typeof value === 'number' ? value.toLocaleString() : value}
                            </dd>
                            {subtitle && (
                                <dd className="text-xs text-gray-600 mt-1 truncate">{subtitle}</dd>
                            )}
                            {trend && (
                                <dd className={`text-xs font-medium mt-2 flex items-center ${
                                    trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    <span className="mr-1">
                                        {trend.direction === 'up' ? '↗' : '↘'}
                                    </span>
                                    <span className="truncate">{trend.value}% from last period</span>
                                </dd>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}