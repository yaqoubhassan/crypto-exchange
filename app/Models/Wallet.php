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

    /**
     * Lock balance - move from available to locked
     * Used when placing orders
     */
    public function lockBalance($amount)
    {
        if ($this->balance >= $amount) {
            $this->balance -= $amount;
            $this->locked_balance += $amount;
            return $this->save();
        }
        return false;
    }

    /**
     * Unlock balance - move from locked back to available
     * Used when canceling orders or rejecting withdrawals
     */
    public function unlockBalance($amount)
    {
        if ($this->locked_balance >= $amount) {
            $this->locked_balance -= $amount;
            $this->balance += $amount;
            return $this->save();
        }
        return false;
    }

    /**
     * Unlock and deduct - remove from locked balance without adding to available
     * Used when completing trades (funds go to other party)
     * Also used when processing approved withdrawals
     */
    public function unlockAndDeduct($amount)
    {
        if ($this->locked_balance >= $amount) {
            $this->locked_balance -= $amount;
            return $this->save();
        }
        return false;
    }

    /**
     * Deduct from available balance
     * Used for direct deductions (fees, etc.)
     */
    public function deductBalance($amount)
    {
        if ($this->balance >= $amount) {
            $this->balance -= $amount;
            return $this->save();
        }
        return false;
    }

    /**
     * Add to available balance
     * Used for deposits, trade settlements, refunds
     */
    public function addBalance($amount)
    {
        $this->balance += $amount;
        return $this->save();
    }
}