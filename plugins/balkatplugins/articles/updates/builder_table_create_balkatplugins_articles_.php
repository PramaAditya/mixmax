<?php namespace BalkatPlugins\Articles\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateBalkatpluginsArticles extends Migration
{
    public function up()
    {
        Schema::create('balkatplugins_articles_', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('balkatplugins_articles_');
    }
}
