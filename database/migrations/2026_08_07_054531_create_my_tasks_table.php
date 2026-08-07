<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('my_tasks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('peserta_pkl_id');
            $table->unsignedBigInteger('task_assignment_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->integer('progress')->default(0);
            $table->text('notes')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->foreign('peserta_pkl_id')->references('id')->on('peserta_pkls')->cascadeOnDelete();
            $table->foreign('task_assignment_id')->references('id')->on('task_assignments')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('my_tasks');
    }
};