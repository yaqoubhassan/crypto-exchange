import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LiveMarketTicker from './LiveMarketTicker';

export default function HeroSection({ auth }) {
    const [animatedStats, setAnimatedStats] = useState({
        users: 0,
        volume: 0,
        trades: 0
    });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    // Animate stats on mount
    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        const targets = {
            users: 50000,
            volume: 24.5,
            trades: 1000000
        };

        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setAnimatedStats({
                users: Math.floor(targets.users * progress),
                volume: (targets.volume * progress).toFixed(1),
                trades: Math.floor(targets.trades * progress)
            });

            if (currentStep >= steps) {
                clearInterval(timer);
                setAnimatedStats(targets);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
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
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-300/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        className="space-y-6 md:space-y-8 text-center lg:text-left"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Badge */}
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold"
                        >
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                            Trusted by 50,000+ traders worldwide
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                        >
                            Trade Crypto
                            <br />
                            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                                with Confidence
                            </span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            variants={itemVariants}
                            className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                        >
                            The most trusted cryptocurrency exchange platform. Buy, sell, and trade Bitcoin, Ethereum, and 100+ cryptocurrencies with industry-leading security.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl"
                                >
                                    {auth.user ? 'Go to Dashboard' : 'Get Started Free'}
                                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            </motion.div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all border border-white/30"
                            >
                                <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Watch Demo
                            </motion.button>
                        </motion.div>

                        {/* Live Stats */}
                        <motion.div
                            variants={itemVariants}
                            className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8"
                        >
                            <motion.div
                                className="text-center lg:text-left"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="text-2xl md:text-3xl font-bold text-white">
                                    {animatedStats.users.toLocaleString()}+
                                </div>
                                <div className="text-sm md:text-base text-white/80 font-medium">Active Users</div>
                            </motion.div>
                            <motion.div
                                className="text-center lg:text-left"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="text-2xl md:text-3xl font-bold text-white">
                                    ${animatedStats.volume}B+
                                </div>
                                <div className="text-sm md:text-base text-white/80 font-medium">Trading Volume</div>
                            </motion.div>
                            <motion.div
                                className="text-center lg:text-left"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="text-2xl md:text-3xl font-bold text-white">
                                    {animatedStats.trades.toLocaleString()}+
                                </div>
                                <div className="text-sm md:text-base text-white/80 font-medium">Trades</div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Live Market Prices */}
                    <motion.div
                        className="space-y-4 md:space-y-6"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <motion.div
                            animate={{
                                y: [0, -10, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <LiveMarketTicker />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}