import { Link, Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome({ auth }) {
    const [currentPrice, setCurrentPrice] = useState(45234.67);
    const [priceChange, setPriceChange] = useState(2.34);
    const [animatedStats, setAnimatedStats] = useState({
        users: 0,
        volume: 0,
        trades: 0
    });

    // Animate price changes
    useEffect(() => {
        const interval = setInterval(() => {
            const change = (Math.random() - 0.5) * 100;
            setCurrentPrice(prev => Math.max(prev + change, 30000));
            setPriceChange((Math.random() - 0.5) * 5);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

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

    const features = [
        {
            icon: "🚀",
            title: "Instant Trading",
            description: "Execute trades instantly with our advanced matching engine. No delays, no hassles."
        },
        {
            icon: "🔒",
            title: "Bank-Level Security",
            description: "Your funds are protected with military-grade encryption and cold storage technology."
        },
        {
            icon: "📊",
            title: "Advanced Charts",
            description: "Professional trading tools with real-time charts and technical indicators."
        },
        {
            icon: "💰",
            title: "Low Fees",
            description: "Industry-leading low trading fees. More profit in your pocket."
        },
        {
            icon: "⚡",
            title: "Quick Withdrawals",
            description: "Withdraw your crypto immediately after purchase. No waiting periods."
        },
        {
            icon: "🌍",
            title: "Multi-Currency",
            description: "Trade with USD, CAD, GBP, and other major fiat currencies."
        }
    ];

    const cryptos = [
        { symbol: "BTC", name: "Bitcoin", price: 45234.67, change: 2.34 },
        { symbol: "ETH", name: "Ethereum", price: 2834.12, change: -1.23 },
        { symbol: "ADA", name: "Cardano", price: 0.52, change: 4.56 },
        { symbol: "DOT", name: "Polkadot", price: 7.89, change: 1.78 },
    ];

    return (
        <>
            <Head title="CryptoExchange - Your Gateway to Digital Assets" />
            
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">CE</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">CryptoExchange</span>
                        </div>
                        
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                            <a href="#markets" className="text-gray-600 hover:text-gray-900 transition-colors">Markets</a>
                            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
                        </div>

                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-24 pb-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                                    Trade Crypto with
                                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        {" "}Confidence
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    The most trusted cryptocurrency exchange platform. Buy, sell, and trade Bitcoin, Ethereum, and 100+ cryptocurrencies with industry-leading security and low fees.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={route('register')}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 text-center"
                                >
                                    Start Trading Now
                                </Link>
                                <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:bg-gray-50">
                                    Learn More
                                </button>
                            </div>

                            {/* Live Stats */}
                            <div className="grid grid-cols-3 gap-6 pt-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {animatedStats.users.toLocaleString()}+
                                    </div>
                                    <div className="text-sm text-gray-600">Active Users</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">
                                        ${animatedStats.volume}B+
                                    </div>
                                    <div className="text-sm text-gray-600">Trading Volume</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {animatedStats.trades.toLocaleString()}+
                                    </div>
                                    <div className="text-sm text-gray-600">Trades Executed</div>
                                </div>
                            </div>
                        </div>

                        {/* Live Price Ticker */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Live Prices</h3>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                                
                                <div className="space-y-4">
                                    {cryptos.map((crypto, index) => (
                                        <div key={crypto.symbol} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                    {crypto.symbol.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{crypto.name}</div>
                                                    <div className="text-sm text-gray-500">{crypto.symbol}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-gray-900">
                                                    ${crypto.price.toLocaleString()}
                                                </div>
                                                <div className={`text-sm font-medium ${
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
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                                <h3 className="text-lg font-semibold mb-4">Quick Trade</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span>Bitcoin (BTC)</span>
                                        <span className="font-bold">${currentPrice.toLocaleString()}</span>
                                    </div>
                                    <div className={`text-sm ${priceChange >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                                        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}% (24h)
                                    </div>
                                    <Link
                                        href={route('register')}
                                        className="block w-full bg-white text-indigo-600 text-center py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                                    >
                                        Trade Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose CryptoExchange?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Built for both beginners and professionals, our platform offers everything you need to trade cryptocurrencies safely and efficiently.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-200"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Markets Section */}
            <section id="markets" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Popular Markets
                        </h2>
                        <p className="text-xl text-gray-600">
                            Trade the most popular cryptocurrencies with competitive spreads
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {cryptos.map((crypto, index) => (
                                    <div key={crypto.symbol} className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                                            {crypto.symbol.substring(0, 2)}
                                        </div>
                                        <div className="font-semibold text-gray-900">{crypto.name}</div>
                                        <div className="text-sm text-gray-500 mb-2">{crypto.symbol}</div>
                                        <div className="text-xl font-bold text-gray-900">
                                            ${crypto.price.toLocaleString()}
                                        </div>
                                        <div className={`text-sm font-medium ${
                                            crypto.change >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                About CryptoExchange
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Founded in 2020, CryptoExchange has become one of the world's most trusted cryptocurrency trading platforms. We're committed to making digital assets accessible to everyone, from beginners to professional traders.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Our mission is to accelerate the world's transition to cryptocurrency through secure, reliable, and user-friendly trading services. With over 50,000 active users and $2.5B+ in trading volume, we're proud to be at the forefront of the crypto revolution.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                                    <div className="text-2xl font-bold text-indigo-600">24/7</div>
                                    <div className="text-sm text-gray-600">Customer Support</div>
                                </div>
                                <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                                    <div className="text-2xl font-bold text-indigo-600">100+</div>
                                    <div className="text-sm text-gray-600">Cryptocurrencies</div>
                                </div>
                                <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                                    <div className="text-2xl font-bold text-indigo-600">0.1%</div>
                                    <div className="text-sm text-gray-600">Trading Fees</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🚀</div>
                                <div className="text-2xl font-bold text-gray-900 mb-2">
                                    Join the Future of Finance
                                </div>
                                <div className="text-gray-600">
                                    Trade with confidence on our secure platform
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Start Trading?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-8">
                        Join thousands of traders who trust CryptoExchange for their crypto trading needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={route('register')}
                            className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
                        >
                            Create Free Account
                        </Link>
                        <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-colors">
                            View Markets
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">CE</span>
                                </div>
                                <span className="text-xl font-bold text-white">CryptoExchange</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                The most trusted cryptocurrency exchange platform.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Products</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Spot Trading</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Margin Trading</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Staking</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">NFT Marketplace</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Fees</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; 2025 CryptoExchange. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}