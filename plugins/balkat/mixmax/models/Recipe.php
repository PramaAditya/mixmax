<?php namespace Balkat\Mixmax\Models;

use Model;

/**
 * Model
 */
class Recipe extends Model
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
    public $table = 'balkat_mixmax_recipes';

    /**
     * @var array Validation rules
     */
    public $rules = [
    ];
}
