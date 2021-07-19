<?php namespace Balkat\Mixmax\Models;

use Model;

/**
 * Model
 */
class Flavor extends Model
{
    use \October\Rain\Database\Traits\Validation;
    use \October\Rain\Database\Traits\Sortable;
    
    /*
     * Disable timestamps by default.
     * Remove this line if timestamps are defined in the database table.
     */
    public $timestamps = false;

    protected $jsonable = ['ig_photos','flavor_images'];

    /**
     * @var string The database table used by the model.
     */
    public $table = 'balkat_mixmax_flavors';

    /**
     * @var array Validation rules
     */
    public $rules = [
    ];
}
