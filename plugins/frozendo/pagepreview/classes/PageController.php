<?php namespace Frozendo\PagePreview\Classes;

use Cms\Classes\CmsCompoundObject;
use Cms\Controllers\Index as Controller;

class PageController extends Controller
{
    const FILENAME = 'frozendo-pagepreview';

    public function config() {
        $this->validateRequestTheme();

        $data = post();

        if ($data['templateType'] != 'page') {
            return false;
        }

        return [
            'page' => [
                'fileName' => self::FILENAME.'.htm',
                'markup'   => $data['markup'],
                'code'     => $data['code'],
                'settings' => array_merge($this->upgradeSettings($data['settings']), [
                    'url'   => request()->path(),
                    'mtime' => time()
                ])
            ]
        ];
    }

    public function preview($config)
    {
        $page = $this->createTemplate('page');
        $page->fill($config['page']);
        $page->afterFetch();

        CmsCompoundObject::clearCache($this->theme);

        return $page;
    }
}
