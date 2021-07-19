<?php namespace Frozendo\PagePreview;

use Event;
use System\Classes\PluginBase;

class Plugin extends PluginBase
{
    public function pluginDetails()
    {
        return [
            'name'        => 'frozendo.pagepreview::lang.plugin.name',
            'description' => 'frozendo.pagepreview::lang.plugin.description',
            'author'      => 'Frozendo',
            'icon'        => 'oc-icon-eye',
            'homepage'    => 'http://frozen.do'
        ];
    }

    public function boot()
    {
        Event::listen('backend.form.extendFields', function($widget) {
            if (!($widget->getController() instanceof \Cms\Controllers\Index && $widget->model instanceof \Cms\Classes\Page)
                && !($widget->getController() instanceof \Rainlab\Pages\Controllers\Index && $widget->model instanceof \Rainlab\Pages\Classes\Page)
                || $widget->isNested) {
                return;
            }

            $widget->addFields([
                '_pagepreview' => [
                    'type'                 => 'Frozendo\PagePreview\FormWidgets\PagePreview',
                    'cssClass'             => 'collapse-visible',
                    'replacePreviewButton' => false
                ]
            ]);
        });
    }

    public function registerFormWidgets()
    {
        return [
            'Frozendo\PagePreview\FormWidgets\PagePreview' => 'pagepreview'
        ];
    }
}
