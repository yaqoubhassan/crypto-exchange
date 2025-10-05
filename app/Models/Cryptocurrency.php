<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cryptocurrency extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'symbol',
        'icon',
        'current_price',
        'market_cap',
        'volume_24h',
        'change_24h',
        'is_active',
        'is_fiat',
        'decimal_places',
    ];

    protected $casts = [
        'current_price' => 'decimal:8',
        'market_cap' => 'decimal:2',
        'volume_24h' => 'decimal:2',
        'change_24h' => 'decimal:4',
        'is_active' => 'boolean',
        'is_fiat' => 'boolean',
    ];

    public function wallets()
    {
        return $this->hasMany(Wallet::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function buyOrders()
    {
        return $this->hasMany(Order::class, 'base_currency_id');
    }

    public function sellOrders()
    {
        return $this->hasMany(Order::class, 'quote_currency_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFiat($query)
    {
        return $query->where('is_fiat', true);
    }

    public function scopeCrypto($query)
    {
        return $query->where('is_fiat', false);
    }
}
