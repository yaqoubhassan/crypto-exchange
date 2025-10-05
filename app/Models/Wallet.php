<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cryptocurrency_id',
        'balance',
        'locked_balance',
        'address',
        'private_key',
    ];

    protected $casts = [
        'balance' => 'decimal:8',
        'locked_balance' => 'decimal:8',
    ];

    protected $hidden = [
        'private_key',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cryptocurrency()
    {
        return $this->belongsTo(Cryptocurrency::class);
    }

    public function getTotalBalanceAttribute()
    {
        return $this->balance + $this->locked_balance;
    }

    public function getAvailableBalanceAttribute()
    {
        return $this->balance;
    }

    public function lockBalance($amount)
    {
        if ($this->balance >= $amount) {
            $this->balance -= $amount;
            $this->locked_balance += $amount;
            return $this->save();
        }
        return false;
    }

    public function unlockBalance($amount)
    {
        if ($this->locked_balance >= $amount) {
            $this->locked_balance -= $amount;
            $this->balance += $amount;
            return $this->save();
        }
        return false;
    }

    public function deductBalance($amount)
    {
        if ($this->balance >= $amount) {
            $this->balance -= $amount;
            return $this->save();
        }
        return false;
    }

    public function addBalance($amount)
    {
        $this->balance += $amount;
        return $this->save();
    }
}
