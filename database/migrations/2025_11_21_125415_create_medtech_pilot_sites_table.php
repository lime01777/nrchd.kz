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
        Schema::create('medtech_pilot_sites', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Название учреждения
            $table->string('city')->nullable(); // Город
            $table->string('region')->nullable(); // Регион
            $table->string('profile')->nullable(); // Профиль (кардиология, онкология и т.п.)
            $table->text('description')->nullable(); // Краткое описание роли
            $table->text('technologies')->nullable(); // Какие технологии/направления пилотируются
            $table->boolean('is_active')->default(true); // Активна ли площадка
            $table->integer('order')->default(0); // Порядок сортировки
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medtech_pilot_sites');
    }
};
