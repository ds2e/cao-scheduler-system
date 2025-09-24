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
        // Schema::connection('mysql_waiter')->dropIfExists('items');
        // Schema::connection('mysql_waiter')->dropIfExists('tables');
        // Schema::connection('mysql_waiter')->dropIfExists('categories');
        // Schema::connection('mysql_waiter')->dropIfExists('item_classes');
        if (!Schema::connection('mysql_waiter')->hasTable('item_classes')) {
            Schema::connection('mysql_waiter')->create('item_classes', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->decimal('rate', 10, 2)->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('mysql_waiter')->dropIfExists('item_classes');
    }
};
