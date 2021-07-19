<?php namespace Frozendo\PagePreview\Components;

use RainLab\Pages\Components\StaticPage as Component;

class StaticPage extends Component
{
    public $isHidden = true;

    public function onRun()
    {
        $this->pageObject = $this->page['page'] = $this->controller->getPage()->apiBag['staticPage'];

        if ($this->pageObject) {
            $this->title = $this->page['title'] = array_get($this->pageObject->viewBag, 'title');
            $this->extraData = $this->page['extraData'] = $this->defineExtraData();
        }
    }
}
