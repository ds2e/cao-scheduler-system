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
        Schema::connection('mysql_waiter')->dropIfExists('items');
        Schema::connection('mysql_waiter')->dropIfExists('tables');
        Schema::connection('mysql_waiter')->dropIfExists('sub_categories');
        Schema::connection('mysql_waiter')->dropIfExists('categories');
        if (!Schema::connection('mysql_waiter')->hasTable('categories')) {
            Schema::connection('mysql_waiter')->create('categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('icon')->nullable();
                $table->integer('priority', false, true)->nullable();

                // Self reference column
                $table->unsignedBigInteger('sub_category_from')->nullable();

                // Foreign key constraint to self
                $table->foreign('sub_category_from')
                    ->references('id')
                    ->on('categories')
                    ->onDelete('cascade'); // optional, depends if you want cascading delete
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('mysql_waiter')->dropIfExists('categories');
    }
};
