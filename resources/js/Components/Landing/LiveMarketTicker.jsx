import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveMarketTicker() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch crypto data from CoinGecko
  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false&price_change_percentage=24h'
      );

      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();
      setCryptos(data);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    // Refresh every 60 seconds
    const interval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    if (price >= 1) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${price.toFixed(6)}`;
  };

  if (loading) {
    return (
      <motion.div
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center space-x-2">
          <Activity className="w-5 h-5 text-white animate-pulse" />
          <span className="text-white font-medium">Loading market data...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="bg-red-500/10 backdrop-blur-lg border border-red-500/20 rounded-2xl p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-red-300 text-sm text-center">Unable to load market data</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Activity className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-white">Live Market Prices</h3>
              <p className="text-xs text-indigo-100">Real-time cryptocurrency data</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-white font-medium">Live</span>
          </div>
        </div>
      </motion.div>

      {/* Crypto List */}
      <div className="divide-y divide-gray-100">
        {cryptos.map((crypto, index) => (
          <motion.div
            key={crypto.id}
            className="px-6 py-4 hover:bg-indigo-50/50 transition-all duration-200 group cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            whileHover={{ scale: 1.02, x: 5 }}
          >
            <div className="flex items-center justify-between">
              {/* Left - Coin Info */}
              <div className="flex items-center space-x-4 flex-1">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-12 h-12 rounded-full ring-2 ring-gray-100 group-hover:ring-indigo-200 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-1.5 py-0.5 text-[10px] font-bold text-gray-600 shadow-sm">
                    #{crypto.market_cap_rank}
                  </div>
                </motion.div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                    {crypto.name}
                  </div>
                  <div className="text-sm text-gray-500 uppercase font-medium">
                    {crypto.symbol}
                  </div>
                </div>
              </div>

              {/* Right - Price & Change */}
              <div className="text-right">
                <motion.div
                  className="font-bold text-gray-900 text-lg mb-1"
                  key={crypto.current_price}
                  initial={{ scale: 1.2, color: '#10b981' }}
                  animate={{ scale: 1, color: '#111827' }}
                  transition={{ duration: 0.3 }}
                >
                  {formatPrice(crypto.current_price)}
                </motion.div>
                <motion.div
                  className="flex items-center justify-end space-x-1"
                  whileHover={{ scale: 1.05 }}
                >
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-semibold text-green-600">
                        +{crypto.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-semibold text-red-600">
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Additional Stats - shown on hover */}
            <motion.div
              className="mt-3 pt-3 border-t border-gray-100 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 'auto',
                opacity: 1
              }}
              transition={{ duration: 0.3 }}
              style={{ display: 'none' }}
              whileHover={{ display: 'block' }}
            >
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Market Cap:</span>
                  <span className="ml-2 font-semibold text-gray-700">
                    ${(crypto.market_cap / 1e9).toFixed(2)}B
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">24h Volume:</span>
                  <span className="ml-2 font-semibold text-gray-700">
                    ${(crypto.total_volume / 1e9).toFixed(2)}B
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        className="bg-gray-50 px-6 py-3 border-t border-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Powered by CoinGecko API</span>
          <span className="text-gray-400">Updates every 60s</span>
        </div>
      </motion.div>
    </motion.div>
  );
}