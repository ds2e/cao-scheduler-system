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
        if (!Schema::connection('mysql_waiter')->hasTable('bill_items')) {
            Schema::connection('mysql_waiter')->create('bill_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('bill_id')->constrained('bills')->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreignId('item_id')->constrained('items')->cascadeOnDelete()->cascadeOnUpdate();
                $table->integer('amount')->default(1);
                $table->string('notice')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('mysql_waiter')->dropIfExists('bill_items');
    }
};
