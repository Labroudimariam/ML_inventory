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
            $table->foreignId('beneficiary_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('order_number')->unique();
            $table->enum('type', [' Semen', ' Liquid nitrogen', ' Insemination equipment','Other']);
            $table->enum('status', ['Processing', 'Completed', 'Rejected', 'On Hold', 'In Transit'])->default('Processing');
            $table->decimal('total_amount', 10, 2);
            $table->date('order_date');
            $table->date('expected_delivery_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
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
