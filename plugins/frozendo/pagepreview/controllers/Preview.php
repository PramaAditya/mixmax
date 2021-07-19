<?php namespace Frozendo\PagePreview\Controllers;

use App;
use Auth;
use Cache;
use Event;
use Request;
use Validator;
use Cms\Classes\CmsException;
use Backend\Classes\Controller;

class Preview extends Controller
{
    protected $cmsController;

    public function __construct()
    {
        parent::__construct();

        $this->layout = null;
        $this->cmsController = App::make('Cms\Classes\Controller');
    }

    public function index()
    {
        return $this->cmsController->run('error');
    }

    public function page($key)
    {
        return $this->preview('page', $key);
    }

    public function staticPage($key)
    {
        return $this->preview('staticPage', $key);
    }

    protected function preview($template, $key) {
        $validator = Validator::make(
            ['key' => $key],
            ['key' => 'required|alpha_num|size:10']
        );

        if ($validator->fails()) {
            return $this->cmsController->run('error');
        }

        $key = 'frozendo-pagepreview-'.$key;

        $page = ($template == 'staticPage'
            ? new \Frozendo\PagePreview\Classes\StaticPageController
            : new \Frozendo\PagePreview\Classes\PageController
        );

        Event::listen('cms.page.initComponents', function($controller, $page, $layout) {
            foreach ([$page, $layout] as $template) {
                foreach ($template->components as $component) {
                    if ($component instanceof \Rainlab\Translate\Components\LocalePicker) {
                        $component->setProperty('forceUrl', false);
                    }
                }
            }
        });

        if (Request::isMethod('get') || Request::ajax()) {
            $preview = Cache::get($key);

            if (!$preview) {
                throw new CmsException('Page not found in cache. Please reload.');
            }

            $this->setPreviewSettings($preview['settings']);

            return $this->cmsController->runPage($page->preview($preview['config']));
        } else if (Request::isMethod('post')) {
            $preview = [
                'settings' => json_decode(Request::input('FrozendoPagePreviewSettings'), true),
                'config'   => $page->config()
            ];

            if (!$preview['config']) {
                return $this->cmsController->run('error');
            }

            $this->setPreviewSettings($preview['settings']);

            unset($preview['settings']['get_params']);
            unset($preview['settings']['post_params']);

            Cache::put($key, $preview, 10);

            return $this->cmsController->runPage($page->preview($preview['config']));
        }

        return $this->cmsController->run('error');
    }

    protected function setPreviewSettings($settings) {
        if (isset($settings['url_slugs'])) {
            $routerParameters = [];

            foreach ($settings['url_slugs'] as $key => $value) {
                $routerParameters[str_replace(':', '', $key)] = $value;
            }

            $this->cmsController->getRouter()->setParameters($routerParameters);
        }

        if (isset($settings['get_params'])) {
            foreach ($settings['get_params'] as $key => $value) {
                $_GET[$key] = $value;
            }
        }

        if (isset($settings['post_params'])) {
            foreach ($settings['post_params'] as $key => $value) {
                $_POST[$key] = $value;
            }
        }

        if (isset($settings['is_user']) && !$settings['is_user']) {
            Auth::setUser(false);
        }
    }

    public function getAjaxHandler()
    {
        return null;
    }

    protected function verifyCsrfToken()
    {
        return true;
    }
}
