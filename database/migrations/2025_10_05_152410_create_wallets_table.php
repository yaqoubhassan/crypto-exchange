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
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('cryptocurrency_id')->constrained()->onDelete('cascade');
            $table->decimal('balance', 20, 8)->default(0); // Available balance
            $table->decimal('locked_balance', 20, 8)->default(0); // Locked in orders
            $table->string('address')->nullable(); // Wallet address for deposits
            $table->string('private_key')->nullable(); // Encrypted private key
            $table->timestamps();
            
            $table->unique(['user_id', 'cryptocurrency_id']); // One wallet per user per currency
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallets');
    }
};
