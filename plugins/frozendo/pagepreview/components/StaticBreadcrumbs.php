<?php namespace Frozendo\PagePreview\Components;

use Cms\Classes\Theme;
use Frozendo\PagePreview\Classes\StaticPage as StaticPageClass;
use RainLab\Pages\Classes\MenuItemReference;
use RainLab\Pages\Components\StaticBreadcrumbs as Component;

class StaticBreadcrumbs extends Component
{
    public $isHidden = true;

    public function onRun()
    {
        $page = $this->controller->getPage()->apiBag['staticPage'];

        if ($page) {
            $tree = StaticPageClass::buildMenuTree(Theme::getActiveTheme());

            $code = $startCode = $page->getBaseFileName();
            $breadcrumbs = [];

            while ($code) {
                if (!isset($tree[$code])) {
                    continue;
                }

                $pageInfo = $tree[$code];

                if ($pageInfo['navigation_hidden']) {
                    $code = $pageInfo['parent'];
                    continue;
                }

                $reference = new MenuItemReference();
                $reference->title = $pageInfo['title'];
                $reference->url = StaticPageClass::url($code);
                $reference->isActive = $code == $startCode;

                $breadcrumbs[] = $reference;

                $code = $pageInfo['parent'];
            }

            $breadcrumbs = array_reverse($breadcrumbs);

            $this->breadcrumbs = $this->page['breadcrumbs'] = $breadcrumbs;
        }
    }
}
