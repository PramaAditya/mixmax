<?php namespace BalkatPlugins\Articles\Models;

use Model;

/**
 * Model
 */
class Article extends Model
{
    use \October\Rain\Database\Traits\Validation;
    
    /*
     * Disable timestamps by default.
     * Remove this line if timestamps are defined in the database table.
     */
    public $timestamps = false;


    /**
     * @var string The database table used by the model.
     */
    public $table = 'balkatplugins_articles_';

    /**
     * @var array Validation rules
     */
    public $rules = [
    ];
}
