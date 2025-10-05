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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_id')->unique(); // Unique transaction identifier
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('cryptocurrency_id')->constrained();
            $table->enum('type', ['deposit', 'withdrawal', 'buy', 'sell', 'transfer', 'fee']);
            $table->decimal('amount', 20, 8); // Transaction amount
            $table->decimal('fee', 20, 8)->default(0); // Transaction fee
            $table->decimal('price', 20, 8)->nullable(); // Price at time of transaction (for trades)
            $table->enum('status', ['pending', 'completed', 'failed', 'cancelled'])->default('pending');
            $table->string('external_tx_id')->nullable(); // Blockchain transaction ID
            $table->string('from_address')->nullable(); // Source address
            $table->string('to_address')->nullable(); // Destination address
            $table->text('notes')->nullable(); // Additional notes
            $table->json('metadata')->nullable(); // Additional transaction data
            $table->timestamp('processed_at')->nullable(); // When transaction was processed
            $table->timestamps();
            
            $table->index(['user_id', 'type']);
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
