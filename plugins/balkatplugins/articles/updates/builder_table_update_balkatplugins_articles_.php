<?php namespace BalkatPlugins\Articles\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateBalkatpluginsArticles extends Migration
{
    public function up()
    {
        Schema::table('balkatplugins_articles_', function($table)
        {
            $table->text('title')->nullable();
            $table->text('subtitle')->nullable();
            $table->text('content')->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('balkatplugins_articles_', function($table)
        {
            $table->dropColumn('title');
            $table->dropColumn('subtitle');
            $table->dropColumn('content');
        });
    }
}
