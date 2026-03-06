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
        Schema::create('researches', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('sample')->nullable();
            $table->string('geography')->nullable();
            $table->string('period')->nullable();
            $table->text('methodology')->nullable();
            $table->text('citation_rules')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('research_indicators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('research_id')->constrained('researches')->onDelete('cascade');
            $table->string('name');
            $table->text('definition')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('research_dashboards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('research_id')->constrained('researches')->onDelete('cascade');
            $table->string('title');
            $table->text('embed_url')->nullable();
            $table->string('type')->default('trend'); // trend, map, comparison
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('research_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('research_id')->constrained('researches')->onDelete('cascade');
            $table->string('title');
            $table->enum('category', ['report', 'exec_summary', 'questionnaire', 'codebook', 'export', 'other'])->default('other');
            $table->string('file_path');
            $table->string('file_type')->nullable(); // pdf, docx, csv
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('research_infographics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('research_id')->constrained('researches')->onDelete('cascade');
            $table->string('title');
            $table->string('image_path')->nullable();
            $table->string('pdf_path')->nullable();
            $table->json('attributes')->nullable(); // brand, disclaimers, period, source
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('research_infographics');
        Schema::dropIfExists('research_files');
        Schema::dropIfExists('research_dashboards');
        Schema::dropIfExists('research_indicators');
        Schema::dropIfExists('researches');
    }
};
