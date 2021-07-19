<?php namespace SunLab\UnsplashPicker\Models;

use October\Rain\Database\Model;

class Settings extends Model
{
    use \October\Rain\Database\Traits\Validation;
    public $rules = [
        'api_key' => 'required',
        'api_secret' => 'required',
    ];

    public $implement = ['System.Behaviors.SettingsModel'];
    public $settingsCode = 'sunlab_unsplashpicker_settings';
    public $settingsFields = 'fields.yaml';
}
