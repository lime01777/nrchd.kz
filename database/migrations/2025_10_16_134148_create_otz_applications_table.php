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
        Schema::create('otz_applications', function (Blueprint $table) {
            $table->id();
            $table->string('application_id')->unique(); // Уникальный ID заявки (например, OT3-2025-0001)
            $table->string('title');
            $table->string('category'); // Комплексная / Простая
            $table->string('current_stage'); // Текущий этап процесса
            $table->text('description')->nullable();
            $table->string('responsible_person')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->date('stage_start_date')->nullable();
            $table->date('stage_end_date')->nullable();
            $table->json('stage_documents')->nullable(); // Документы для текущего этапа
            $table->json('stage_progress')->nullable(); // Прогресс по этапам
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Индексы
            $table->index('application_id');
            $table->index('category');
            $table->index('current_stage');
            $table->index('is_active');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('otz_applications');
    }
};
