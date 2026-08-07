<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_logbooks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('peserta_pkl_id');
            $table->date('log_date');
            $table->text('activities');
            $table->text('challenges')->nullable();
            $table->text('next_plan')->nullable();
            $table->integer('hours_worked')->nullable();
            $table->enum('status', ['draft', 'submitted', 'reviewed'])->default('draft');
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->foreign('peserta_pkl_id')->references('id')->on('peserta_pkls')->cascadeOnDelete();
            $table->foreign('reviewed_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_logbooks');
    }
};