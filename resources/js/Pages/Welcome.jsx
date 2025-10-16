import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import LandingNavbar from '@/Components/Landing/LandingNavbar';
import LandingFooter from '@/Components/Landing/LandingFooter';
import { useState, useEffect } from 'react';

export default function Welcome({ auth }) {
    const [animatedStats, setAnimatedStats] = useState({
        users: 0,
        volume: 0,
        trades: 0
    });

    const cryptos = [
        { symbol: "BTC", name: "Bitcoin", price: 45234.67, change: 2.34, color: "from-orange-400 to-orange-600" },
        { symbol: "ETH", name: "Ethereum", price: 2834.12, change: -1.23, color: "from-blue-400 to-blue-600" },
        { symbol: "BNB", name: "Binance Coin", price: 315.25, change: 4.56, color: "from-yellow-400 to-yellow-600" },
        { symbol: "SOL", name: "Solana", price: 98.75, change: 1.78, color: "from-purple-400 to-purple-600" },
        { symbol: "ADA", name: "Cardano", price: 0.52, change: 3.21, color: "from-blue-500 to-blue-700" },
        { symbol: "DOT", name: "Polkadot", price: 7.89, change: -0.95, color: "from-pink-400 to-pink-600" },
        { symbol: "MATIC", name: "Polygon", price: 0.85, change: 5.67, color: "from-purple-500 to-purple-700" },
        { symbol: "AVAX", name: "Avalanche", price: 35.40, change: 2.18, color: "from-red-400 to-red-600" },
    ];

    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            title: "Bank-Grade Security",
            description: "Your assets are protected with multi-layer encryption, cold storage, and 2FA authentication."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: "Lightning Fast",
            description: "Execute trades in milliseconds with our high-performance trading engine."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Low Fees",
            description: "Trade with competitive fees starting at just 0.1%. More profit stays in your pocket."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "24/7 Support",
            description: "Round-the-clock customer support via chat, email, and phone. We're always here to help."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Global Access",
            description: "Trade from anywhere in the world. Support for 100+ countries and multiple currencies."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: "Advanced Analytics",
            description: "Make informed decisions with real-time charts, technical indicators, and market insights."
        }
    ];

    // Animate stats on mount
    useEffect(() => {
        const targets = { users: 50000, volume: 2.5, trades: 1000000 };
        const duration = 2000;
        const steps = 60;
        const increment = duration / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setAnimatedStats({
                users: Math.floor(targets.users * progress),
                volume: (targets.volume * progress).toFixed(1),
                trades: Math.floor(targets.trades * progress)
            });

            if (currentStep >= steps) clearInterval(timer);
        }, increment);

        return () => clearInterval(timer);
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const cryptoCardVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5
            }
        })
    };

    const featureCardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        }),
        hover: {
            y: -8,
            scale: 1.02,
            transition: { duration: 0.3 }
        }
    };

    return (
        <>
            <Head title="CryptoExchange - Trade Cryptocurrency with Confidence" />

            {/* Navbar */}
            <LandingNavbar auth={auth} />

            {/* Hero Section */}
            <section className="relative min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden pt-20">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="text-center lg:text-left"
                        >
                            <motion.div
                                variants={itemVariants}
                                className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full text-white text-sm font-semibold mb-6"
                            >
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                                Now Live - Start Trading Today
                            </motion.div>

                            <motion.h1
                                variants={itemVariants}
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                            >
                                Trade Crypto with
                                <span className="block bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                                    Confidence
                                </span>
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                className="text-lg md:text-xl text-indigo-100 mb-8 leading-relaxed"
                            >
                                Buy, sell, and trade over 200+ cryptocurrencies with advanced tools,
                                competitive fees, and bank-level security.
                            </motion.p>

                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-xl shadow-2xl hover:shadow-3xl transition-all"
                                    >
                                        Get Started Free
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                </motion.div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white hover:text-indigo-600 transition-all"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Watch Demo
                                </motion.button>
                            </motion.div>

                            {/* Live Stats */}
                            <motion.div
                                variants={containerVariants}
                                className="grid grid-cols-3 gap-6 pt-12"
                            >
                                {[
                                    { value: animatedStats.users.toLocaleString() + '+', label: 'Active Users' },
                                    { value: '$' + animatedStats.volume + 'B+', label: 'Trading Volume' },
                                    { value: animatedStats.trades.toLocaleString() + '+', label: 'Trades' }
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        variants={itemVariants}
                                        className="text-center lg:text-left"
                                    >
                                        <div className="text-2xl md:text-3xl font-bold text-white">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-indigo-100 font-medium">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Right Content - Crypto Cards */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-gray-200"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Live Prices</h3>
                                    <div className="flex items-center space-x-2">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-2 h-2 bg-green-500 rounded-full"
                                        />
                                        <span className="text-sm text-gray-600 font-medium">Real-time</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {cryptos.slice(0, 4).map((crypto, i) => (
                                        <motion.div
                                            key={crypto.symbol}
                                            custom={i}
                                            initial="hidden"
                                            animate="visible"
                                            variants={cryptoCardVariants}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-12 h-12 bg-gradient-to-br ${crypto.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                                    <span className="text-white font-bold text-sm">{crypto.symbol}</span>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{crypto.symbol}</div>
                                                    <div className="text-sm text-gray-500">{crypto.name}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-gray-900">
                                                    ${crypto.price.toLocaleString()}
                                                </div>
                                                <motion.div
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                    className={`text-sm font-semibold ${crypto.change >= 0 ? 'text-green-600' : 'text-red-600'
                                                        }`}
                                                >
                                                    {crypto.change >= 0 ? '↑' : '↓'} {Math.abs(crypto.change)}%
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-semibold mb-6">
                            <span>Why Choose Us</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Built for Modern Traders
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to trade cryptocurrencies safely, efficiently, and profitably.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true }}
                                variants={featureCardVariants}
                                className="relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-2xl transition-all cursor-pointer"
                            >
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                    className="inline-flex p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl mb-6 shadow-lg"
                                >
                                    {feature.icon}
                                </motion.div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-base text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    className="mt-4 text-indigo-600 font-semibold flex items-center"
                                >
                                    Learn more
                                    <motion.svg
                                        className="w-4 h-4 ml-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        animate={{ x: [0, 4, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </motion.svg>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Markets Section */}
            <section id="markets" className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-semibold mb-6">
                            <span>Live Markets</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Popular Cryptocurrencies
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Trade the most popular digital assets with real-time pricing
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase">Coin</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">Price</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">24h Change</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cryptos.map((crypto, i) => (
                                        <motion.tr
                                            key={crypto.symbol}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.05, duration: 0.4 }}
                                            whileHover={{ backgroundColor: '#f9fafb' }}
                                            className="border-b border-gray-100"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-10 h-10 bg-gradient-to-br ${crypto.color} rounded-lg flex items-center justify-center`}>
                                                        <span className="text-white font-bold text-xs">{crypto.symbol}</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{crypto.symbol}</div>
                                                        <div className="text-sm text-gray-500">{crypto.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-gray-900">
                                                ${crypto.price.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`font-semibold ${crypto.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {crypto.change >= 0 ? '↑' : '↓'} {Math.abs(crypto.change)}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                                                >
                                                    Trade
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-semibold mb-6">
                                <span>About Us</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Trusted by Traders Worldwide
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                CryptoExchange is a leading cryptocurrency platform that combines cutting-edge technology
                                with user-friendly design. We're committed to making crypto trading accessible to everyone.
                            </p>
                            <p className="text-lg text-gray-600 mb-8">
                                With bank-grade security, 24/7 support, and competitive fees, we provide everything you
                                need to trade confidently in the digital asset market.
                            </p>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Start Trading Now
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {[
                                { number: '50K+', label: 'Active Traders' },
                                { number: '$2.5B+', label: 'Volume Traded' },
                                { number: '200+', label: 'Cryptocurrencies' },
                                { number: '24/7', label: 'Customer Support' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-200 text-center"
                                >
                                    <div className="text-3xl font-bold text-indigo-600 mb-2">{stat.number}</div>
                                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-yellow-100 rounded-full text-yellow-700 text-sm font-semibold mb-6">
                            <span>Transparent Pricing</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Industry-Low Trading Fees
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            More profits for you with our competitive fee structure
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { title: 'Spot Trading', fee: '0.1%', desc: 'Per transaction' },
                            { title: 'Margin Trading', fee: '0.15%', desc: 'Per transaction' },
                            { title: 'Futures', fee: '0.05%', desc: 'Per transaction' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:border-indigo-500 transition-all"
                            >
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    {item.fee}
                                </div>
                                <p className="text-gray-600">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="mt-12 text-center"
                    >
                        <p className="text-gray-600 mb-6">
                            Volume discounts available for high-frequency traders
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                href={route('register')}
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                            >
                                Start Trading with Low Fees
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Support/CTA Section */}
            <section id="support" className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 50, 0],
                            y: [0, 30, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.3, 1],
                            x: [0, -50, 0],
                            y: [0, -30, 0],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Start Trading?
                        </h2>
                        <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of traders who trust CryptoExchange. Create your account in minutes.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-xl shadow-2xl"
                                >
                                    Create Free Account
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            </motion.div>

                            <motion.a
                                href="#markets"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white hover:text-indigo-600 transition-all"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                View Markets
                            </motion.a>
                        </div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="flex flex-wrap justify-center gap-8 text-white/90"
                        >
                            {[
                                { icon: '✓', text: 'No credit card required' },
                                { icon: '✓', text: 'Instant verification' },
                                { icon: '✓', text: '24/7 customer support' }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 + (i * 0.1), duration: 0.4 }}
                                    className="flex items-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm md:text-base">{item.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <LandingFooter />
        </>
    );
}