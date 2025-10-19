import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MarketOverview({ wallets = [] }) {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [marketStats, setMarketStats] = useState({
    totalMarketCap: 0,
    total24hVolume: 0,
    btcDominance: 0
  });

  const fetchMarketData = async () => {
    try {
      setLoading(true);

      // Fetch top cryptocurrencies
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=1h,24h,7d'
      );

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setCryptos(data);

      // Calculate market stats
      const totalCap = data.reduce((sum, crypto) => sum + (crypto.market_cap || 0), 0);
      const totalVol = data.reduce((sum, crypto) => sum + (crypto.total_volume || 0), 0);
      const btcMarketCap = data.find(c => c.id === 'bitcoin')?.market_cap || 0;
      const btcDom = totalCap > 0 ? (btcMarketCap / totalCap) * 100 : 0;

      setMarketStats({
        totalMarketCap: totalCap,
        total24hVolume: totalVol,
        btcDominance: btcDom
      });

      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    if (price >= 1) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatLargeNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  const getWalletBalance = (cryptoSymbol) => {
    const wallet = wallets.find(w =>
      w.cryptocurrency?.symbol?.toLowerCase() === cryptoSymbol.toLowerCase()
    );
    return wallet?.balance || 0;
  };

  const calculateWalletValue = (cryptoSymbol, price) => {
    const balance = getWalletBalance(cryptoSymbol);
    return balance * price;
  };

  if (loading && cryptos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100 text-sm font-medium">Total Market Cap</p>
            <Activity className="w-5 h-5 text-blue-200" />
          </div>
          <p className="text-3xl font-bold">{formatLargeNumber(marketStats.totalMarketCap)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-purple-100 text-sm font-medium">24h Volume</p>
            <Activity className="w-5 h-5 text-purple-200" />
          </div>
          <p className="text-3xl font-bold">{formatLargeNumber(marketStats.total24hVolume)}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-orange-100 text-sm font-medium">BTC Dominance</p>
            <Activity className="w-5 h-5 text-orange-200" />
          </div>
          <p className="text-3xl font-bold">{marketStats.btcDominance.toFixed(2)}%</p>
        </div>
      </div>

      {/* Main Market Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Market Overview</h2>
              <p className="text-sm text-gray-500 mt-1">
                Live cryptocurrency prices and market data
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {lastUpdate && (
                <span className="text-xs text-gray-500">
                  Updated {lastUpdate.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={fetchMarketData}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Coin
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  1h %
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  24h %
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  7d %
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Market Cap
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Volume (24h)
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Your Holdings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cryptos.map((crypto, index) => {
                const walletBalance = getWalletBalance(crypto.symbol);
                const walletValue = calculateWalletValue(crypto.symbol, crypto.current_price);

                return (
                  <tr
                    key={crypto.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {crypto.market_cap_rank || index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={crypto.image}
                          alt={crypto.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {crypto.name}
                          </div>
                          <div className="text-xs text-gray-500 uppercase">
                            {crypto.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-gray-900">
                        {formatPrice(crypto.current_price)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`inline-flex items-center space-x-1 ${crypto.price_change_percentage_1h_in_currency >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                        }`}>
                        {crypto.price_change_percentage_1h_in_currency >= 0 ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        <span className="font-medium text-sm">
                          {Math.abs(crypto.price_change_percentage_1h_in_currency || 0).toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`inline-flex items-center space-x-1 ${crypto.price_change_percentage_24h >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                        }`}>
                        {crypto.price_change_percentage_24h >= 0 ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        <span className="font-medium text-sm">
                          {Math.abs(crypto.price_change_percentage_24h || 0).toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`inline-flex items-center space-x-1 ${crypto.price_change_percentage_7d_in_currency >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                        }`}>
                        {crypto.price_change_percentage_7d_in_currency >= 0 ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        <span className="font-medium text-sm">
                          {Math.abs(crypto.price_change_percentage_7d_in_currency || 0).toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-gray-900 font-medium">
                        {formatLargeNumber(crypto.market_cap)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-gray-900">
                        {formatLargeNumber(crypto.total_volume)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {walletBalance > 0 ? (
                        <div>
                          <div className="text-sm font-semibold text-indigo-600">
                            {formatPrice(walletValue)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {walletBalance.toFixed(6)} {crypto.symbol.toUpperCase()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Powered by CoinGecko API</span>
            <span>Updates every 60 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
}