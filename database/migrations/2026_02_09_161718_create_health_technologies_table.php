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
        Schema::create('health_technologies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('registry_code')->nullable();
            
            // Classification codes
            $table->string('code_a')->nullable();
            $table->string('code_b')->nullable();
            $table->string('code_c')->nullable();
            $table->string('code_d')->nullable();
            $table->string('code_e')->nullable();
            
            // Type & Status
            $table->string('type')->default('digital');
            $table->string('status')->default('project');
            $table->date('status_date')->nullable();
            
            // Dates
            $table->date('validation_date')->nullable();
            $table->date('piloting_date')->nullable();
            $table->date('revalidation_date')->nullable();
            
            // Participants
            $table->string('initiator')->nullable();
            $table->string('developer')->nullable();
            $table->string('pilot_org')->nullable();
            $table->json('app_orgs')->nullable(); // Array of org names
            
            // Details
            $table->string('region')->nullable();
            $table->string('risk_level')->default('low');
            $table->string('autonomy_level')->default('low');
            $table->integer('trl')->default(1);
            
            // Media & Docs
            $table->text('logo_url')->nullable(); // Can be long if base64, so text
            $table->json('documents')->nullable(); // Array of {name, type, url/path}
            
            // Directions (tags)
            $table->json('directions')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_technologies');
    }
};
