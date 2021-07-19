<?php namespace Frozendo\PagePreview\Classes;

use Cms;
use October\Rain\Support\Str;
use October\Rain\Router\Helper as RouterHelper;
use Rainlab\Pages\Classes\Page;

class StaticPage extends Page
{
    public static $pageList;

    public function getParent()
    {
        if ($this->parentCache !== null) {
            return $this->parentCache;
        }

        $parent = null;
        if ($fileName = self::$pageList->getPageParent($this)) {
            $parent = self::load($this->theme, $fileName);
        }

        return $this->parentCache = $parent;
    }

    public function getChildren()
    {
        if ($this->childrenCache !== null) {
            return $this->childrenCache;
        }

        $children = [];

        $subtree = self::$pageList->getPageSubTree($this);

        foreach ($subtree as $fileName => $subPages) {
            $subPage = self::load($this->theme, $fileName);
            if ($subPage) {
                $children[] = $subPage;
            }
        }

        return $this->childrenCache = $children;
    }

    // Exact copy from Rainlab\Pages\Classes\Page to reference self::buildMenuTree
    public static function resolveMenuItem($item, $url, $theme)
    {
        $tree = self::buildMenuTree($theme);

        if ($item->type == 'static-page' && !isset($tree[$item->reference])) {
            return;
        }

        $result = [];

        if ($item->type == 'static-page') {
            $pageInfo = $tree[$item->reference];
            $result['url'] = Cms::url($pageInfo['url']);
            $result['mtime'] = $pageInfo['mtime'];
            $result['isActive'] = $result['url'] == $url;
        }

        if ($item->nesting || $item->type == 'all-static-pages') {
            $iterator = function($items) use (&$iterator, &$tree, $url) {
                $branch = [];

                foreach ($items as $itemName) {
                    if (!isset($tree[$itemName])) {
                        continue;
                    }

                    $itemInfo = $tree[$itemName];

                    if ($itemInfo['navigation_hidden']) {
                        continue;
                    }

                    $branchItem = [];
                    $branchItem['url'] = Cms::url($itemInfo['url']);
                    $branchItem['isActive'] = $branchItem['url'] == $url;
                    $branchItem['title'] = $itemInfo['title'];
                    $branchItem['mtime'] = $itemInfo['mtime'];

                    if ($itemInfo['items']) {
                        $branchItem['items'] = $iterator($itemInfo['items']);
                    }

                    $branch[] = $branchItem;
                }

                return $branch;
            };

            $result['items'] = $iterator($item->type == 'static-page' ? $pageInfo['items'] : $tree['--root-pages--']);
        }

        return $result;
    }

    public static function buildMenuTree($theme)
    {
        if (self::$menuTreeCache !== null) {
            return self::$menuTreeCache;
        }

        $menuTree = [
            '--root-pages--' => []
        ];

        $iterator = function($items, $parent, $level) use (&$menuTree, &$iterator) {
            $result = [];

            foreach ($items as $item) {
                $viewBag = $item->page->viewBag;
                $pageCode = $item->page->getBaseFileName();
                $pageUrl = Str::lower(RouterHelper::normalizeUrl(array_get($viewBag, 'url')));

                $itemData = [
                    'url'    => $pageUrl,
                    'title'  => array_get($viewBag, 'title'),
                    'mtime'  => $item->page->mtime,
                    'items'  => $iterator($item->subpages, $pageCode, $level+1),
                    'parent' => $parent,
                    'navigation_hidden' => array_get($viewBag, 'navigation_hidden')
                ];

                if ($level == 0) {
                    $menuTree['--root-pages--'][] = $pageCode;
                }

                $result[] = $pageCode;
                $menuTree[$pageCode] = $itemData;
            }

            return $result;
        };

        $iterator(self::$pageList->getPageTree(), null, 0);

        return self::$menuTreeCache = $menuTree;
    }

    public static function load($theme, $fileName)
    {
        if ($fileName == self::$pageList->staticPageFileName) {
            return self::$pageList->staticPage;
        }

        return parent::load($theme, $fileName);
    }
}
