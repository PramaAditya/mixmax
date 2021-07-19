<?php

namespace NetSTI\SEO\models;

use Model;

class Settings extends Model{

    public $implement = ['System.Behaviors.SettingsModel'];

    public $settingsCode = 'netsti_seo_settings';

    public $settingsFields = 'fields.yaml';

    protected $cache = [];

    public $attachOne = [
        'og_image' => ['System\Models\File'],
        'favicon' => ['System\Models\File'],
        'appicon' => ['System\Models\File']
    ];

} 