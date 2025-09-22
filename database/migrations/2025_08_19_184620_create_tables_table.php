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
        if (!Schema::connection('mysql_waiter')->hasTable('tables')) {
            Schema::connection('mysql_waiter')->create('tables', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->integer('type', false, true)->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('mysql_waiter')->dropIfExists('tables');
    }
};
