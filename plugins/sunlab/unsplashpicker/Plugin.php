<?php namespace SunLab\UnsplashPicker;

use SunLab\UnsplashPicker\FormWidgets\UnsplashPicker;
use SunLab\UnsplashPicker\Models\Settings;
use System\Classes\PluginBase;
use System\Classes\SettingsManager;

class Plugin extends PluginBase
{
    public function pluginDetails()
    {
        return [
            'name'        => 'UnsplashPicker',
            'description' => 'sunlab.unsplashpicker::lang.plugin.description',
            'author'      => 'SunLab',
            'icon'        => 'icon-picture-o',
            'homepage'    => 'https://sunlab.dev'
        ];
    }

    public function registerPermissions()
    {
        return [
            'sunlab.unsplashpicker.access_settings' => [
                'tab' => 'UnsplashPicker',
                'label' => 'sunlab.unsplashpicker::lang.permission.label'
            ],
        ];
    }

    public function registerSettings()
    {
        return [
            'settings' => [
                'label'       => 'UnsplashPicker',
                'description' => 'sunlab.unsplashpicker::lang.settings.description',
                'category'    => SettingsManager::CATEGORY_SYSTEM,
                'icon'        => 'icon-picture-o',
                'class'       => Settings::class,
                'order'       => 500,
                'keywords'    => 'credentials api key',
                'permissions' => ['sunlab.unsplashpicker.access_settings']
            ]
        ];
    }

    public function registerFormWidgets()
    {
        return [
            UnsplashPicker::class => 'unsplashpicker'
        ];
    }
}
