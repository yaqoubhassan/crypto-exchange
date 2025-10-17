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
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('ticket_number')->unique();
            $table->string('subject');
            $table->enum('category', ['account', 'trading', 'wallet', 'technical', 'security', 'other']);
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->text('message');
            $table->enum('status', ['open', 'in_progress', 'resolved', 'closed'])->default('open');
            $table->json('attachments')->nullable();
            $table->text('admin_response')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->foreignId('resolved_by')->nullable()->constrained('users');
            $table->timestamps();

            $table->index('ticket_number');
            $table->index('user_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('support_tickets');
    }
};
