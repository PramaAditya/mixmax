<?php namespace Frozendo\PagePreview\Classes;

use Event;
use Cms\Classes\ComponentManager;
use Cms\Classes\Page as CmsPage;
use Rainlab\Pages\Classes\SnippetManager;
use Rainlab\Pages\Controllers\Index as Controller;

class StaticPageController extends Controller
{
    const FILENAME = 'frozendo-pagepreview';

    private $components = [
        'RainLab\Pages\Components\StaticPage' => [
            'class' => '\Frozendo\PagePreview\Components\StaticPage',
            'alias' => 'staticPagePreview'
        ],
        'RainLab\Pages\Components\StaticBreadcrumbs' => [
            'class' => '\Frozendo\PagePreview\Components\StaticBreadcrumbs',
            'alias' => 'staticBreadcrumbsPreview'
        ]
    ];

    public function config()
    {
        $this->validateRequestTheme();

        $data = post();

        if ($data['objectType'] != 'page') {
            return false;
        }

        return [
            'page' => [
                'fileName' => self::FILENAME.'.htm',
                'markup'   => $data['markup'],
                'placeholders'   => array_get($data, 'placeholders'),
                'settings' => [
                    'viewBag' => array_merge($data['viewBag'], [
                        'url' => request()->path()
                    ]),
                    'mtime'   => time()
                ]
            ],
            'objectPath'     => array_get($data, 'objectPath'),
            'parentFileName' => array_get($data, 'parentFileName')
        ];
    }

    public function preview($config)
    {
        $staticPage = StaticPage::inTheme($this->theme);
        // If viewBag is not set, placeholders are not filled in
        $staticPage->getViewBag()->setProperties($config['page']['settings']['viewBag']);
        $staticPage->fill($config['page']);
        $staticPage->afterFetch();

        StaticPage::$pageList = new StaticPageList(
            $this->theme,
            $staticPage,
            self::FILENAME,
            $config['objectPath'],
            $config['parentFileName']
        );

        Event::listen('cms.page.initComponents', function($controller, $page, $layout) {
            $componentManager = ComponentManager::instance();

            foreach ($this->components as $class => $custom) {
                if (!$componentManager->hasComponent($custom['class'])) {
                    $componentManager->registerComponent(
                        $custom['class'],
                        $custom['alias']
                    );
                }

                foreach ($layout->components as $component) {
                    if ($component instanceof $class) {
                        $controller->addComponent(
                            $custom['alias'],
                            $component->alias,
                            $component->getProperties(),
                            true
                        );
                    }
                }
            }
        });

        Event::listen('pages.menuitem.resolveItem', function($type, $item, $url, $theme) {
            if ($type == 'static-page' || $type == 'all-static-pages') {
                return StaticPage::resolveMenuItem($item, $url, $theme);
            }
        }, 10);

        StaticPage::clearMenuCache($this->theme);
        SnippetManager::clearCache($this->theme);

        $cmsPage = CmsPage::inTheme($this->theme);
        $cmsPage->url = $staticPage->viewBag['url'];
        $cmsPage->apiBag['staticPage'] = $staticPage;

        $viewBagToSettings = ['title', 'layout', 'meta_title', 'meta_description', 'is_hidden'];

        foreach ($viewBagToSettings as $property) {
            $cmsPage->settings[$property] = array_get($staticPage->viewBag, $property);
        }

        return $cmsPage;
    }
}
