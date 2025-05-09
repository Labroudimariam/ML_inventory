<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('beneficiary_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('order_number')->unique();
            $table->enum('type', ['Semen', 'Liquid nitrogen', 'Insemination equipment', 'Other']);
            $table->enum('status', ['Pending', 'Approved', 'Processing', 'Completed', 'Rejected'])->default('Pending');
            $table->decimal('total_quantity', 10, 2)->default(0);
            $table->date('order_date')->default(now());
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};