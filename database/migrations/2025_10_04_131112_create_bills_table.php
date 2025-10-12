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
        if (!Schema::connection('mysql_waiter')->hasTable('bills')) {
            Schema::connection('mysql_waiter')->create('bills', function (Blueprint $table) {
                $table->id();
                $table->timestamps();
                $table->foreignId('order_id')
                    ->constrained('orders')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('mysql_waiter')->dropIfExists('bills');
    }
};
