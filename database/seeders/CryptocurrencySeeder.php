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
            // Fiat currencies
            [
                'name' => 'US Dollar',
                'symbol' => 'USD',
                'current_price' => 1.00000000,
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
            [
                'name' => 'British Pound',
                'symbol' => 'GBP',
                'current_price' => 1.27000000,
                'is_active' => true,
                'is_fiat' => true,
                'decimal_places' => 2,
            ],
            // Cryptocurrencies
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
            [
                'name' => 'Binance Coin',
                'symbol' => 'BNB',
                'current_price' => 315.25000000,
                'market_cap' => 47000000000.00,
                'volume_24h' => 1200000000.00,
                'change_24h' => -0.75,
                'is_active' => true,
                'is_fiat' => false,
                'decimal_places' => 8,
            ],
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
        ];

        foreach ($cryptocurrencies as $crypto) {
            \App\Models\Cryptocurrency::create($crypto);
        }
    }
}
