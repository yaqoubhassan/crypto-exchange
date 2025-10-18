import React from 'react';

export default function TimeframeBadge({ timeframe }) {
  const getTimeframeLabel = (tf) => {
    const labels = {
      '1h': 'Last Hour',
      '24h': 'Last 24 Hours',
      '7d': 'Last 7 Days',
      '30d': 'Last 30 Days',
      '90d': 'Last 90 Days'
    };
    return labels[tf] || 'Last 24 Hours';
  };

  const getTimeframeColor = (tf) => {
    const colors = {
      '1h': 'bg-purple-100 text-purple-700 border-purple-200',
      '24h': 'bg-blue-100 text-blue-700 border-blue-200',
      '7d': 'bg-green-100 text-green-700 border-green-200',
      '30d': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      '90d': 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return colors[tf] || colors['24h'];
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTimeframeColor(timeframe)}`}>
      <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {getTimeframeLabel(timeframe)}
    </div>
  );
}