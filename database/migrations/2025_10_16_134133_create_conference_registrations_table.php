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
        Schema::create('conference_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('surname');
            $table->string('email');
            $table->string('phone');
            $table->string('organization')->nullable();
            $table->string('position')->nullable();
            $table->string('type')->nullable(); // Тип участия (очно/онлайн)
            $table->text('topic')->nullable(); // Тема доклада/выступления
            $table->string('participant_category')->nullable(); // Категория участника
            $table->string('ip_address')->nullable(); // IP адрес для отслеживания
            $table->timestamps();
            
            // Индексы
            $table->index('email');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conference_registrations');
    }
};
