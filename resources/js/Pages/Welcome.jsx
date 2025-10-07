import { Head, Link } from '@inertiajs/react';
import LandingNavbar from '@/Components/Landing/LandingNavbar';
import HeroSection from '@/Components/Landing/HeroSection';
import FeaturesSection from '@/Components/Landing/FeaturesSection';
import LandingFooter from '@/Components/Landing/LandingFooter';

export default function Welcome({ auth }) {
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

    return (
        <>
            <Head title="CryptoExchange - Trade Cryptocurrency with Confidence" />
            
            {/* Navbar */}
            <LandingNavbar auth={auth} />

            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <FeaturesSection />

            {/* Markets Section */}
            <section id="markets" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 md:mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-semibold mb-6">
                            <span>Live Markets</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                            Popular Cryptocurrencies
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Trade the most popular digital assets with real-time pricing and competitive spreads
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                            Asset
                                        </th>
                                        <th className="px-4 md:px-6 py-4 text-right text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-4 md:px-6 py-4 text-right text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                            24h Change
                                        </th>
                                        <th className="px-4 md:px-6 py-4 text-center text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {cryptos.map((crypto, index) => (
                                        <tr key={crypto.symbol} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="flex items-center space-x-3 md:space-x-4">
                                                    <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${crypto.color} rounded-xl flex items-center justify-center text-white font-bold text-sm md:text-base shadow-md flex-shrink-0`}>
                                                        {crypto.symbol.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 text-sm md:text-base">{crypto.name}</div>
                                                        <div className="text-xs md:text-sm text-gray-500">{crypto.symbol}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 text-right">
                                                <div className="font-bold text-gray-900 text-sm md:text-base">
                                                    ${crypto.price.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 text-right">
                                                <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                                                    crypto.change >= 0 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {crypto.change >= 0 ? '↗' : '↘'} {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 text-center hidden md:table-cell">
                                                <Link
                                                    href={route('register')}
                                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
                                                >
                                                    Trade
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-200 text-center">
                            <Link
                                href={route('register')}
                                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold"
                            >
                                View all markets
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* About/Trust Section */}
            <section id="about" className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="order-2 lg:order-1 space-y-6 md:space-y-8">
                            <div>
                                <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-semibold mb-6">
                                    <span>Trusted Platform</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                                    Built on Trust & Security
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Founded in 2020, CryptoExchange has become one of the world's most trusted cryptocurrency trading platforms. We're committed to making digital assets accessible to everyone.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { icon: '🔒', title: 'Bank-Grade Security', desc: 'Your funds are protected with industry-leading security measures' },
                                    { icon: '⚡', title: 'Lightning Fast', desc: 'Execute trades in milliseconds with our advanced matching engine' },
                                    { icon: '🌍', title: 'Global Reach', desc: 'Trade from anywhere with support for 100+ countries' },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="text-3xl">{item.icon}</div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                                            <p className="text-sm text-gray-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4">
                                {[
                                    { value: '24/7', label: 'Support' },
                                    { value: '100+', label: 'Cryptos' },
                                    { value: '0.1%', label: 'Fees' }
                                ].map((stat, index) => (
                                    <div key={index} className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                                        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs md:text-sm text-gray-600 font-medium mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-3xl transform rotate-3"></div>
                                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-700 rounded-3xl p-8 md:p-12 text-white h-96 md:h-[500px] flex flex-col justify-center items-center text-center">
                                    <div className="text-6xl md:text-8xl mb-6">🚀</div>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                        Join the Future of Finance
                                    </h3>
                                    <p className="text-indigo-100 mb-8 max-w-md">
                                        Start your crypto journey today with the most trusted exchange platform
                                    </p>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                                    >
                                        Get Started Free
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing/Support Section */}
            <section id="pricing" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 md:mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-yellow-100 rounded-full text-yellow-700 text-sm font-semibold mb-6">
                            <span>Transparent Pricing</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                            Industry-Low Trading Fees
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            More profits for you with our competitive fee structure
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                        {[
                            { title: 'Spot Trading', fee: '0.1%', desc: 'Per transaction' },
                            { title: 'Margin Trading', fee: '0.15%', desc: 'Per transaction' },
                            { title: 'Futures', fee: '0.05%', desc: 'Per transaction' }
                        ].map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-gray-200 hover:border-indigo-500 transition-all duration-300 hover:shadow-xl">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    {item.fee}
                                </div>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="support" className="py-16 md:py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 md:mb-8">
                        Ready to Start Trading?
                    </h2>
                    <p className="text-lg md:text-xl text-indigo-100 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of traders who trust CryptoExchange for their crypto trading needs. Create your account in minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={route('register')}
                            className="group inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
                        >
                            Create Free Account
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                        <a
                            href="#markets"
                            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white hover:text-indigo-600 transition-all"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            View Markets
                        </a>
                    </div>
                    
                    <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/90">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm md:text-base">No credit card required</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm md:text-base">Setup in 2 minutes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm md:text-base">Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <LandingFooter />
        </>
    );
}