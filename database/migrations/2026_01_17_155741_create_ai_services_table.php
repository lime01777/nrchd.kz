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
        Schema::create('ai_services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->json('pathology')->nullable();
            $table->json('modality')->nullable();
            $table->json('area')->nullable();
            $table->string('status')->default('inactive');
            $table->string('company')->nullable();
            $table->string('image')->nullable();
            $table->string('videoUrl')->nullable();
            $table->text('description')->nullable();
            $table->text('briefInfo')->nullable();
            $table->json('advantages')->nullable();
            $table->json('purpose')->nullable();
            $table->text('effectiveness')->nullable();
            $table->text('targetPopulation')->nullable();
            $table->string('calibrationRequired')->nullable();
            $table->text('decisionSupport')->nullable(); // Using text as it can be long
            $table->json('validationTable')->nullable();
            $table->json('risks')->nullable();
            $table->json('limitations')->nullable();
            $table->json('discontinuationReasons')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_services');
    }
};
