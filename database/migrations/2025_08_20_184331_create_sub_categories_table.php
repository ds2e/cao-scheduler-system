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
        // if (!Schema::connection('mysql_waiter')->hasTable('sub_categories')) {
        //     Schema::connection('mysql_waiter')->create('sub_categories', function (Blueprint $table) {
        //         $table->id();
        //         $table->string('name');
        //         $table->string('color')->nullable();
        //         $table->foreignId('category_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
        //     });
        // }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::connection('mysql_waiter')->dropIfExists('sub_categories');
    }
};
