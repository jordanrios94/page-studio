<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->uuid('id');
            $table->string('title', 255);
            $table->mediumText('description')->nullable();
            $table->mediumText('settings');
            $table->mediumText('scripts')->nullable();
            $table->mediumText('styles')->nullable();
            $table->integer('creator_user_id');
            $table->mediumText('permissions')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pages');
    }
}
