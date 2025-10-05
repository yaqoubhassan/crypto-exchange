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
        Schema::create('cryptocurrencies', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Bitcoin, Ethereum, etc.
            $table->string('symbol')->unique(); // BTC, ETH, etc.
            $table->string('icon')->nullable(); // Icon URL or path
            $table->decimal('current_price', 20, 8)->default(0); // Current market price
            $table->decimal('market_cap', 30, 2)->nullable(); // Market capitalization
            $table->decimal('volume_24h', 30, 2)->nullable(); // 24h trading volume
            $table->decimal('change_24h', 10, 4)->nullable(); // 24h price change percentage
            $table->boolean('is_active')->default(true); // Whether trading is enabled
            $table->boolean('is_fiat')->default(false); // Whether it's a fiat currency
            $table->integer('decimal_places')->default(8); // Number of decimal places
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cryptocurrencies');
    }
};
