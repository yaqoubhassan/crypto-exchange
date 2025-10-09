<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CryptocurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cryptocurrencies = [
            // ==========================================
            // FIAT CURRENCIES (for trading pairs)
            // ==========================================
            [
                'name' => 'US Dollar',
                'symbol' => 'USD',
                'current_price' => 1.00000000,
                'is_active' => true,
                'is_fiat' => true,
                'decimal_places' => 2,
            ],
            [
                'name' => 'Euro',
                'symbol' => 'EUR',
                'current_price' => 1.08000000,
                'is_active' => true,
                'is_fiat' => true,
                'decimal_places' => 2,
            ],
            [
                'name' => 'British Pound',
                'symbol' => 'GBP',
                'current_price' => 1.27000000,
                'is_active' => true,
                'is_fiat' => true,
                'decimal_places' => 2,
            ],
            [
                'name' => 'Canadian Dollar',
                'symbol' => 'CAD',
                'current_price' => 0.74000000,
                'is_active' => true,
                'is_fiat' => true,
                'decimal_places' => 2,
            ],

            // ==========================================
            // TOP CRYPTOCURRENCIES (by market cap)
            // ==========================================
            
            // #1 Bitcoin
            [
                'name' => 'Bitcoin',
                'symbol' => 'BTC',
                'current_price' => 43250.50000000,
                'market_cap' => 847000000000.00,
                'volume_24h' => 15000000000.00,
                'change_24h' => 2.45,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // #2 Ethereum
            [
                'name' => 'Ethereum',
                'symbol' => 'ETH',
                'current_price' => 2650.75000000,
                'market_cap' => 318000000000.00,
                'volume_24h' => 8500000000.00,
                'change_24h' => 1.85,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // #3 Tether (Stablecoin)
            [
                'name' => 'Tether',
                'symbol' => 'USDT',
                'current_price' => 1.00000000,
                'market_cap' => 95000000000.00,
                'volume_24h' => 45000000000.00,
                'change_24h' => 0.01,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // #4 BNB (Binance Coin)
            [
                'name' => 'BNB',
                'symbol' => 'BNB',
                'current_price' => 315.25000000,
                'market_cap' => 47000000000.00,
                'volume_24h' => 1200000000.00,
                'change_24h' => -0.75,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // #5 Solana
            [
                'name' => 'Solana',
                'symbol' => 'SOL',
                'current_price' => 98.75000000,
                'market_cap' => 42000000000.00,
                'volume_24h' => 2100000000.00,
                'change_24h' => 4.15,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // #6 XRP (Ripple)
            [
                'name' => 'XRP',
                'symbol' => 'XRP',
                'current_price' => 0.52500000,
                'market_cap' => 28000000000.00,
                'volume_24h' => 1100000000.00,
                'change_24h' => 1.35,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // #7 USD Coin (Stablecoin)
            [
                'name' => 'USD Coin',
                'symbol' => 'USDC',
                'current_price' => 1.00000000,
                'market_cap' => 26000000000.00,
                'volume_24h' => 4500000000.00,
                'change_24h' => 0.00,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // #8 Cardano
            [
                'name' => 'Cardano',
                'symbol' => 'ADA',
                'current_price' => 0.48500000,
                'market_cap' => 17000000000.00,
                'volume_24h' => 450000000.00,
                'change_24h' => 3.25,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // #9 Dogecoin
            [
                'name' => 'Dogecoin',
                'symbol' => 'DOGE',
                'current_price' => 0.08500000,
                'market_cap' => 12000000000.00,
                'volume_24h' => 580000000.00,
                'change_24h' => 2.75,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // #10 TRON
            [
                'name' => 'TRON',
                'symbol' => 'TRX',
                'current_price' => 0.10500000,
                'market_cap' => 9200000000.00,
                'volume_24h' => 320000000.00,
                'change_24h' => 0.85,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],

            // ==========================================
            // POPULAR ALTCOINS
            // ==========================================
            
            // Polygon (MATIC)
            [
                'name' => 'Polygon',
                'symbol' => 'MATIC',
                'current_price' => 0.85250000,
                'market_cap' => 8500000000.00,
                'volume_24h' => 320000000.00,
                'change_24h' => -1.25,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // Polkadot
            [
                'name' => 'Polkadot',
                'symbol' => 'DOT',
                'current_price' => 7.45000000,
                'market_cap' => 9800000000.00,
                'volume_24h' => 285000000.00,
                'change_24h' => 1.92,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // Chainlink
            [
                'name' => 'Chainlink',
                'symbol' => 'LINK',
                'current_price' => 14.75000000,
                'market_cap' => 8200000000.00,
                'volume_24h' => 420000000.00,
                'change_24h' => 3.15,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // Avalanche
            [
                'name' => 'Avalanche',
                'symbol' => 'AVAX',
                'current_price' => 36.50000000,
                'market_cap' => 13500000000.00,
                'volume_24h' => 680000000.00,
                'change_24h' => 2.35,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // Litecoin
            [
                'name' => 'Litecoin',
                'symbol' => 'LTC',
                'current_price' => 72.50000000,
                'market_cap' => 5400000000.00,
                'volume_24h' => 385000000.00,
                'change_24h' => 1.45,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // Uniswap
            [
                'name' => 'Uniswap',
                'symbol' => 'UNI',
                'current_price' => 6.25000000,
                'market_cap' => 4700000000.00,
                'volume_24h' => 125000000.00,
                'change_24h' => 0.95,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // Shiba Inu
            [
                'name' => 'Shiba Inu',
                'symbol' => 'SHIB',
                'current_price' => 0.00000950,
                'market_cap' => 5600000000.00,
                'volume_24h' => 185000000.00,
                'change_24h' => 4.25,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // Stellar
            [
                'name' => 'Stellar',
                'symbol' => 'XLM',
                'current_price' => 0.12500000,
                'market_cap' => 3600000000.00,
                'volume_24h' => 95000000.00,
                'change_24h' => 1.75,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],

            // ==========================================
            // LAYER 2 & SCALING SOLUTIONS
            // ==========================================
            
            // Arbitrum
            [
                'name' => 'Arbitrum',
                'symbol' => 'ARB',
                'current_price' => 1.15000000,
                'market_cap' => 3800000000.00,
                'volume_24h' => 145000000.00,
                'change_24h' => 2.15,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
            
            // Optimism
            [
                'name' => 'Optimism',
                'symbol' => 'OP',
                'current_price' => 2.35000000,
                'market_cap' => 2400000000.00,
                'volume_24h' => 85000000.00,
                'change_24h' => 1.85,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
        ];

        foreach ($cryptocurrencies as $crypto) {
            \App\Models\Cryptocurrency::updateOrCreate(
                ['symbol' => $crypto['symbol']],
                $crypto
            );
        }
    }
}