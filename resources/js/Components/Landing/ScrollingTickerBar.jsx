import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function ScrollingTickerBar() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h'
      );

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setCryptos(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(6)}`;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-indigo-900/90 to-purple-900/90 backdrop-blur-lg py-3">
        <div className="text-center text-white text-sm">
          Loading market data...
        </div>
      </div>
    );
  }

  // Duplicate cryptos for seamless loop
  const duplicatedCryptos = [...cryptos, ...cryptos];

  return (
    <div className="bg-gradient-to-r from-indigo-900/90 to-purple-900/90 backdrop-blur-lg border-y border-white/10 overflow-hidden">
      <div className="relative py-3">
        {/* Scrolling Container */}
        <div className="flex animate-scroll">
          {duplicatedCryptos.map((crypto, index) => (
            <div
              key={`${crypto.id}-${index}`}
              className="flex items-center space-x-3 px-6 flex-shrink-0 group cursor-pointer hover:bg-white/5 transition-colors rounded-lg mx-1 py-2"
            >
              {/* Coin Icon */}
              <img
                src={crypto.image}
                alt={crypto.name}
                className="w-8 h-8 rounded-full"
              />

              {/* Coin Info */}
              <div className="flex items-center space-x-3">
                <span className="text-white font-bold text-sm uppercase">
                  {crypto.symbol}
                </span>
                <span className="text-white font-semibold">
                  {formatPrice(crypto.current_price)}
                </span>

                {/* Change Indicator */}
                <div className="flex items-center space-x-1">
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium text-sm">
                        +{crypto.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-medium text-sm">
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-white/20 ml-3"></div>
            </div>
          ))}
        </div>

        {/* Gradient Overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-indigo-900/90 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-purple-900/90 to-transparent pointer-events-none"></div>
      </div>

      {/* CSS for animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}