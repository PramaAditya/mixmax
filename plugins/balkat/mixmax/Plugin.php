<?php

namespace Balkat\Mixmax;
use Balkat\Mixmax\FormWidgets\InstagramFeed;
use System\Classes\PluginBase;

class Plugin extends PluginBase
{
    public function boot() {
        \Cms\Models\ThemeData::extend(function ($model) { 
            $model->addJsonable('ig_feed');
        });

        \Event::listen('backend.menu.extendItems', function($manager) {
            // Add main menu item
            $manager->addMainMenuItems('Martin.Forms', [
                'forms' => [
                    'label' => 'Forms',
                    'iconSvg'     => '',
                    'icon'     => 'icon-wpforms'
                ]
            ]);
            $manager->addMainMenuItems('Martin.Forms', [
                'forms' => [
                    'label' => 'Forms',
                    'iconSvg'     => '',
                    'icon'     => 'icon-wpforms'
                ]
            ]);
            
            
        
        });
    }
    public function registerComponents()
    {
    }
    public function registerFormWidgets()
    {
        return [
            InstagramFeed::class => 'instagramfeed'
        ];
    }
    public function registerSettings()
    {
    }
    
}
