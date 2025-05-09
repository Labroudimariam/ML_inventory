<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWarehousesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warehouses', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // Storekeeper
            $table->string('name'); 
            $table->string('location')->nullable(); 
            $table->text('description')->nullable(); 
            $table->integer('capacity')->nullable();
            $table->integer('current_stock')->nullable();

            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('warehouses');
    }
}
