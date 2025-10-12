<?php

use App\Enums\OrderStatuses;
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
        if (!Schema::connection('mysql_waiter')->hasTable('orders')) {
            Schema::connection('mysql_waiter')->create('orders', function (Blueprint $table) {
                $table->id();
                $table->enum('status', array_column(OrderStatuses::cases(), 'value'))
                    ->default(OrderStatuses::Preparing->value);
                $table->timestamps();
                $table->foreignId('table_id')
                    ->constrained('tables')
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
        Schema::connection('mysql_waiter')->dropIfExists('orders');
    }
};
