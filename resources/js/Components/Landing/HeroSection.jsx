import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function HeroSection() {
    const [animatedStats, setAnimatedStats] = useState({
        users: 0,
        volume: 0,
        trades: 0
    });

    const [currentPrice, setCurrentPrice] = useState(45234.67);
    const [priceChange, setPriceChange] = useState(2.34);

    // Animate statistics
    useEffect(() => {
        const targets = { users: 50000, volume: 2.5, trades: 1000000 };
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;

        let step = 0;
        const interval = setInterval(() => {
            step++;
            const progress = step / steps;
            
            setAnimatedStats({
                users: Math.floor(targets.users * progress),
                volume: (targets.volume * progress).toFixed(1),
                trades: Math.floor(targets.trades * progress)
            });

            if (step >= steps) {
                clearInterval(interval);
            }
        }, stepDuration);

        return () => clearInterval(interval);
    }, []);

    // Animate price changes
    useEffect(() => {
        const interval = setInterval(() => {
            const change = (Math.random() - 0.5) * 100;
            setCurrentPrice(prev => Math.max(prev + change, 30000));
            setPriceChange((Math.random() - 0.5) * 5);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const cryptos = [
        { symbol: "BTC", name: "Bitcoin", price: 45234.67, change: 2.34, color: "from-orange-400 to-orange-600" },
        { symbol: "ETH", name: "Ethereum", price: 2834.12, change: -1.23, color: "from-blue-400 to-blue-600" },
        { symbol: "BNB", name: "Binance Coin", price: 315.25, change: 4.56, color: "from-yellow-400 to-yellow-600" },
        { symbol: "SOL", name: "Solana", price: 98.75, change: 1.78, color: "from-purple-400 to-purple-600" },
    ];

    return (
        <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div 
                    className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
                    style={{
                        animation: 'blob 7s infinite'
                    }}
                ></div>
                <div 
                    className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
                    style={{
                        animation: 'blob 7s infinite',
                        animationDelay: '2s'
                    }}
                ></div>
                <div 
                    className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
                    style={{
                        animation: 'blob 7s infinite',
                        animationDelay: '4s'
                    }}
                ></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                        {/* Badge */}
                        <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-semibold">
                            <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2 animate-pulse"></span>
                            Trusted by 50,000+ traders worldwide
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                            Trade Crypto
                            <br />
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                with Confidence
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            The most trusted cryptocurrency exchange platform. Buy, sell, and trade Bitcoin, Ethereum, and 100+ cryptocurrencies with industry-leading security and ultra-low fees.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href={route('register')}
                                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                Start Trading Free
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold text-lg rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Watch Demo
                            </button>
                        </div>

                        {/* Live Stats */}
                        <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8">
                            <div className="text-center lg:text-left">
                                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {animatedStats.users.toLocaleString()}+
                                </div>
                                <div className="text-sm md:text-base text-gray-600 font-medium">Active Users</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    ${animatedStats.volume}B+
                                </div>
                                <div className="text-sm md:text-base text-gray-600 font-medium">Trading Volume</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {animatedStats.trades.toLocaleString()}+
                                </div>
                                <div className="text-sm md:text-base text-gray-600 font-medium">Trades</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Price Cards */}
                    <div className="space-y-4 md:space-y-6">
                        {/* Live Prices Card */}
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900">Live Prices</h3>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs md:text-sm text-gray-600 font-medium">Real-time</span>
                                </div>
                            </div>
                            
                            <div className="space-y-3 md:space-y-4">
                                {cryptos.map((crypto) => (
                                    <div key={crypto.symbol} className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 cursor-pointer group">
                                        <div className="flex items-center space-x-3 md:space-x-4">
                                            <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${crypto.color} rounded-xl flex items-center justify-center text-white font-bold text-sm md:text-base shadow-md group-hover:shadow-lg transition-shadow`}>
                                                {crypto.symbol.substring(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-sm md:text-base">{crypto.name}</div>
                                                <div className="text-xs md:text-sm text-gray-500">{crypto.symbol}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900 text-sm md:text-base">
                                                ${crypto.price.toLocaleString()}
                                            </div>
                                            <div className={`text-xs md:text-sm font-semibold ${
                                                crypto.change >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Trade Card */}
                        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
                            
                            <div className="relative">
                                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Quick Trade</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/90 text-sm md:text-base">Bitcoin (BTC)</span>
                                        <span className="text-xl md:text-2xl font-bold">${currentPrice.toLocaleString()}</span>
                                    </div>
                                    <div className={`text-sm md:text-base font-semibold ${priceChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                        {priceChange >= 0 ? '↗' : '↘'} {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}% (24h)
                                    </div>
                                    <Link
                                        href={route('register')}
                                        className="block w-full bg-white text-indigo-600 text-center py-3 md:py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg text-sm md:text-base"
                                    >
                                        Trade Now →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
        </section>
    );
}