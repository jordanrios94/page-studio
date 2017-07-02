<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSourcesColumnsToPagesHistory extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pages_history', function (Blueprint $table) {
            $table->mediumText('scripts')->after('js')->nullable();
            $table->mediumText('styles')->after('scripts')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pages_history', function (Blueprint $table) {
            $table->dropColumn('scripts');
            $table->dropColumn('styles');
        });
    }
}
