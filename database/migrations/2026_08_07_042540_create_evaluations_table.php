<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('peserta_pkl_id');
            $table->unsignedBigInteger('evaluator_id');
            $table->unsignedBigInteger('project_id')->nullable();
            $table->date('period_start');
            $table->date('period_end');
            $table->integer('score_attitude')->nullable();
            $table->integer('score_skills')->nullable();
            $table->integer('score_knowledge')->nullable();
            $table->integer('score_communication')->nullable();
            $table->integer('score_teamwork')->nullable();
            $table->integer('total_score')->nullable();
            $table->text('strengths')->nullable();
            $table->text('improvements')->nullable();
            $table->text('overall_notes')->nullable();
            $table->enum('status', ['draft', 'submitted', 'reviewed'])->default('draft');
            $table->timestamps();

            $table->foreign('peserta_pkl_id')->references('id')->on('peserta_pkls')->cascadeOnDelete();
            $table->foreign('evaluator_id')->references('id')->on('users')->noActionOnDelete();
            $table->foreign('project_id')->references('id')->on('projects')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};