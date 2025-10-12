<?php

use App\Enums\ItemTypes;
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
        if (!Schema::connection('mysql_waiter')->hasTable('items')) {
            Schema::connection('mysql_waiter')->create('items', function (Blueprint $table) {
                // $table->charset = 'utf8mb4';
                // $table->collation = 'utf8mb4_0900_ai_ci'; // MySQL 8: best Unicode sorting

                $table->id();
                $table->string('code')->nullable();
                $table
                    ->string('name');
                $table->decimal('price', 10, 2);
                $table->enum('type', array_column(ItemTypes::cases(), 'value'))
                    ->default(ItemTypes::Normal->value);
                $table->foreignId('item_class')
                    ->nullable()
                    ->constrained('item_classes')
                    ->nullOnDelete()
                    ->cascadeOnUpdate();

                // foreign key
                $table->foreignId('category_id')
                    ->nullable()
                    ->constrained('categories')
                    ->nullOnDelete()
                    ->cascadeOnUpdate();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('mysql_waiter')->dropIfExists('items');
    }
};
