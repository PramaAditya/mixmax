<?php namespace BalkatPlugins\Articles\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateBalkatpluginsArticles2 extends Migration
{
    public function up()
    {
        Schema::table('balkatplugins_articles_', function($table)
        {
            $table->string('image')->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('balkatplugins_articles_', function($table)
        {
            $table->dropColumn('image');
        });
    }
}
