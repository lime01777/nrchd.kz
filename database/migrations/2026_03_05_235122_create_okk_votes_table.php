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
        Schema::create('okk_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('okk_projects')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('question_id')->constrained('okk_questions')->onDelete('cascade');
            $table->string('answer'); // Рекомендовать, С учетом замечаний, На доработку
            $table->timestamps();

            $table->unique(['project_id', 'user_id', 'question_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('okk_votes');
    }
};
