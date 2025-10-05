import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    ComposedChart
} from 'recharts';

export default function TradingChart({ cryptocurrency, loading }) {
    const [chartType, setChartType] = useState('line');
    const [timeframe, setTimeframe] = useState('1D');
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (cryptocurrency) {
            generateMockData();
        }
    }, [cryptocurrency, timeframe]);

    const generateMockData = () => {
        const basePrice = parseFloat(cryptocurrency.current_price);
        const dataPoints = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : 365;
        const data = [];

        for (let i = 0; i < dataPoints; i++) {
            const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
            const price = basePrice * (1 + variation * (i / dataPoints));
            const volume = Math.random() * 1000000 + 500000;
            
            const date = new Date();
            if (timeframe === '1D') {
                date.setHours(date.getHours() - (dataPoints - i));
            } else if (timeframe === '1W') {
                date.setDate(date.getDate() - (dataPoints - i));
            } else if (timeframe === '1M') {
                date.setDate(date.getDate() - (dataPoints - i));
            } else {
                date.setDate(date.getDate() - (dataPoints - i));
            }

            data.push({
                time: timeframe === '1D' 
                    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
                price: price,
                volume: volume,
                high: price * 1.02,
                low: price * 0.98,
                open: price * 0.99,
                close: price
            });
        }

        setChartData(data);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!cryptocurrency) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                <div className="text-gray-500">Select a cryptocurrency to view chart</div>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-sm text-indigo-600">
                        Price: ${payload[0].value.toFixed(2)}
                    </p>
                    {payload[1] && (
                        <p className="text-sm text-gray-600">
                            Volume: {payload[1].value.toLocaleString()}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    const renderChart = () => {
        switch (chartType) {
            case 'area':
                return (
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="time" 
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                        />
                        <YAxis 
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            tickFormatter={(value) => `$${value.toFixed(0)}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#6366f1"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                        />
                    </AreaChart>
                );
            case 'volume':
                return (
                    <ComposedChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="time" 
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                        />
                        <YAxis 
                            yAxisId="price"
                            orientation="right"
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            tickFormatter={(value) => `$${value.toFixed(0)}`}
                        />
                        <YAxis 
                            yAxisId="volume"
                            orientation="left"
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                            yAxisId="volume"
                            dataKey="volume" 
                            fill="#e2e8f0" 
                            opacity={0.6}
                        />
                        <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="price"
                            stroke="#6366f1"
                            strokeWidth={2}
                            dot={false}
                        />
                    </ComposedChart>
                );
            default:
                return (
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="time" 
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                        />
                        <YAxis 
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            tickFormatter={(value) => `$${value.toFixed(0)}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#6366f1"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: '#6366f1' }}
                        />
                    </LineChart>
                );
        }
    };

    return (
        <div className="space-y-4">
            {/* Chart Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">
                        {cryptocurrency.symbol}/USD
                    </h4>
                    <div className={`text-sm font-medium ${
                        cryptocurrency.change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {cryptocurrency.change_24h >= 0 ? '+' : ''}
                        {cryptocurrency.change_24h}%
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Chart Type Selector */}
                    <select
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="line">Line</option>
                        <option value="area">Area</option>
                        <option value="volume">Volume</option>
                    </select>
                    
                    {/* Timeframe Selector */}
                    <div className="flex bg-gray-100 rounded-md p-1">
                        {['1D', '1W', '1M', '1Y'].map((tf) => (
                            <button
                                key={tf}
                                onClick={() => setTimeframe(tf)}
                                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                                    timeframe === tf
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Price Display */}
            <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold text-gray-900">
                    ${parseFloat(cryptocurrency.current_price).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                    Market Cap: ${cryptocurrency.market_cap ? parseFloat(cryptocurrency.market_cap).toLocaleString() : 'N/A'}
                </div>
                <div className="text-sm text-gray-500">
                    Volume: ${cryptocurrency.volume_24h ? parseFloat(cryptocurrency.volume_24h).toLocaleString() : 'N/A'}
                </div>
            </div>

            {/* Chart */}
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>

            {/* Technical Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                    <div className="text-xs text-gray-500">RSI (14)</div>
                    <div className="text-sm font-medium text-gray-900">
                        {(Math.random() * 40 + 30).toFixed(1)}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-xs text-gray-500">MACD</div>
                    <div className="text-sm font-medium text-green-600">
                        +{(Math.random() * 10).toFixed(2)}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-xs text-gray-500">MA (20)</div>
                    <div className="text-sm font-medium text-gray-900">
                        ${(parseFloat(cryptocurrency.current_price) * 0.98).toFixed(2)}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-xs text-gray-500">Volatility</div>
                    <div className="text-sm font-medium text-orange-600">
                        {(Math.random() * 5 + 2).toFixed(1)}%
                    </div>
                </div>
            </div>
        </div>
    );
}