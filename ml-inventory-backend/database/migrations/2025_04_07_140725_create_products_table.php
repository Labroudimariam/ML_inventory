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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('image')->nullable();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('warehouse');
            $table->integer('quantity');
            $table->string('unit');
            $table->decimal('price', 10, 2);
            $table->integer('threshold_value')->nullable();
            $table->date('expiry_date')->nullable();
            $table->enum('status', ['in-stock', 'out-of-stock', 'low-stock'])->default('in-stock');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
