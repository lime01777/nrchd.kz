<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clinical_medicine_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        $defaultCategories = [
            'Кардиология',
            'Неврология',
            'Онкология',
            'Педиатрия',
            'Хирургия',
            'Терапия',
            'Гинекология',
            'Психиатрия',
            'Дерматология',
            'Офтальмология',
            'Оториноларингология',
            'Урология',
            'Ортопедия',
            'Анестезиология',
            'Радиология',
            'Патология',
            'Инфекционные болезни',
            'Эндокринология',
            'Гастроэнтерология',
            'Пульмонология',
            'Нефрология',
            'Ревматология',
            'Гематология',
            'Иммунология',
        ];

        DB::table('clinical_medicine_categories')->insert(
            collect($defaultCategories)->map(fn ($name) => ['name' => $name, 'created_at' => now(), 'updated_at' => now()])->toArray()
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clinical_medicine_categories');
    }
};

