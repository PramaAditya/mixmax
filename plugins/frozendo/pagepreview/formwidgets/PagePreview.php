<?php namespace Frozendo\PagePreview\FormWidgets;

use Config;
use Backend\Classes\FormWidgetBase;

class PagePreview extends FormWidgetBase
{
    public $replacePreviewButton = false;

    protected $defaultAlias = 'pagePreview';

    public function init()
    {
        $this->fillFromConfig([
            'replacePreviewButton'
        ]);
    }

    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('pagepreview');
    }

    public function prepareVars()
    {
        $this->vars['replacePreviewButton'] = $this->replacePreviewButton;

        $this->vars['iconSrc'] = $this->assetPath.'/images/icon.png';
        $this->vars['iconLink'] = 'https://octobercms.com/plugin/frozendo-pagepreview';

        $template = ($this->controller instanceof \Rainlab\Pages\Controllers\Index
            ? 'static-page'
            : 'page'
        );

        $this->vars['pagePreviewUrl'] = url(Config::get('cms.backendUri', 'backend').
            '/frozendo/pagepreview/preview/'.$template.'/'.strtolower(str_random(10))
        );

        $this->vars['inspectorConfig'] = htmlentities(json_encode([
            [
                'property'    => 'url_slugs',
                'type'        => 'dictionary',
                'title'       => trans('frozendo.pagepreview::lang.formwidget.inspector.url_slugs_title'),
                'description' => trans('frozendo.pagepreview::lang.formwidget.inspector.url_slugs_description')
            ], [
                'property'    => 'get_params',
                'type'        => 'dictionary',
                'title'       => trans('frozendo.pagepreview::lang.formwidget.inspector.get_params_title'),
                'description' => trans('frozendo.pagepreview::lang.formwidget.inspector.get_params_description')
            ], [
                'property'    => 'post_params',
                'type'        => 'dictionary',
                'title'       => trans('frozendo.pagepreview::lang.formwidget.inspector.post_params_title'),
                'description' => trans('frozendo.pagepreview::lang.formwidget.inspector.post_params_description')
            ], [
                'property'    => 'is_user',
                'type'        => 'checkbox',
                'title'       => trans('frozendo.pagepreview::lang.formwidget.inspector.is_user_title'),
                'description' => trans('frozendo.pagepreview::lang.formwidget.inspector.is_user_description')
            ]
        ]), ENT_QUOTES, 'UTF-8');

        $this->vars['inspectorValues'] = htmlentities(json_encode([
            'is_user' => true
        ]), ENT_QUOTES, 'UTF-8');
    }

    protected function loadAssets()
    {
        $this->addCss('css/pagepreview.css', 'core');
        $this->addJs('js/pagepreview.js', 'core');
    }
}
