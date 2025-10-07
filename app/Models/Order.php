<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'user_id',
        'base_currency_id',
        'quote_currency_id',
        'type',
        'side',
        'quantity',
        'price',
        'stop_price',
        'filled_quantity',
        'average_price',
        'status',
        'time_in_force',
        'expires_at',
    ];

    protected $casts = [
        'quantity' => 'decimal:8',
        'price' => 'decimal:8',
        'stop_price' => 'decimal:8',
        'filled_quantity' => 'decimal:8',
        'average_price' => 'decimal:8',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function baseCurrency()
    {
        return $this->belongsTo(Cryptocurrency::class, 'base_currency_id');
    }

    public function quoteCurrency()
    {
        return $this->belongsTo(Cryptocurrency::class, 'quote_currency_id');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['pending', 'partial']);
    }
}
