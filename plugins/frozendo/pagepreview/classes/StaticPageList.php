<?php namespace Frozendo\PagePreview\Classes;

use Rainlab\Pages\Classes\PageList;

class StaticPageList extends PageList
{
    public $staticPage;
    public $staticPageFileName;
    protected $fileName;
    protected $parentFileName;

    // Needed because on page first load after save, $configCache is set
    protected static $configCache = false;

    public function __construct($theme, $staticPage, $staticPageFileName, $fileName, $parentFileName)
    {
        parent::__construct($theme);

        $this->staticPage = $staticPage;
        $this->staticPageFileName = $staticPageFileName;
        $this->fileName = $fileName;
        $this->parentFileName = $parentFileName;
    }

    public function listPages($skipCache = false)
    {
        $pages = StaticPage::listInTheme($this->theme, $skipCache)->filter(function($item) {
            return $item->getBaseFileName() != $this->fileName;
        });

        $pages->push($this->staticPage);

        return $pages;
    }

    protected function getPagesConfig()
    {
        if (self::$configCache !== false) {
            return self::$configCache;
        }

        $pagesConfig = parent::getPagesConfig();

        if ($this->fileName || $this->parentFileName) {
            $iterator = function($pages) use (&$iterator) {
                $pos = 0;

                foreach ($pages as $parent => &$children) {
                    if ($parent == $this->fileName) {
                        return array_merge(
                            array_slice($pages, 0, $pos),
                            [$this->staticPageFileName => $children],
                            array_slice($pages, $pos+1)
                        );
                    } else if ($parent == $this->parentFileName && !isset($children[$this->fileName])) {
                        $children[$this->staticPageFileName] = [];
                        return $pages;
                    } else if (!empty($children)) {
                        $children = $iterator($children);
                    }

                    $pos++;
                }

                return $pages;
            };

            $pagesConfig['static-pages'] = $iterator($pagesConfig['static-pages']);
        } else {
            $pagesConfig['static-pages'][$this->staticPageFileName] = [];
        }

        return self::$configCache = $pagesConfig;
    }
}
