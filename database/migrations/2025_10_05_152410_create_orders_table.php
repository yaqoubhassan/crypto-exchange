<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique(); // Unique order identifier
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('base_currency_id')->constrained('cryptocurrencies'); // Currency being traded
            $table->foreignId('quote_currency_id')->constrained('cryptocurrencies'); // Currency used for pricing
            $table->enum('type', ['market', 'limit', 'stop', 'stop_limit']);
            $table->enum('side', ['buy', 'sell']);
            $table->decimal('quantity', 20, 8); // Amount to trade
            $table->decimal('price', 20, 8)->nullable(); // Price per unit (null for market orders)
            $table->decimal('stop_price', 20, 8)->nullable(); // Stop price for stop orders
            $table->decimal('filled_quantity', 20, 8)->default(0); // Amount already filled
            $table->decimal('average_price', 20, 8)->nullable(); // Average fill price
            $table->enum('status', ['pending', 'partial', 'filled', 'cancelled', 'expired'])->default('pending');
            $table->enum('time_in_force', ['GTC', 'IOC', 'FOK'])->default('GTC'); // Good Till Cancelled, Immediate Or Cancel, Fill Or Kill
            $table->timestamp('expires_at')->nullable(); // Order expiration time
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
            $table->index(['base_currency_id', 'quote_currency_id', 'side']);
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
