<?php namespace SunLab\UnsplashPicker\FormWidgets;

use Backend\FormWidgets\FileUpload;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Response;
use October\Rain\Exception\ApplicationException;
use October\Rain\Exception\ValidationException;
use October\Rain\Support\Facades\Validator;
use SunLab\UnsplashPicker\Models\Settings;

class UnsplashPicker extends FileUpload
{
    protected $defaultAlias = 'unsplashpicker';

    public function init()
    {
        $this->addViewPath(base_path('modules/backend/formwidgets/fileupload/partials'));
        parent::init();
    }

    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('~/modules/backend/formwidgets/fileupload/partials/_fileupload.htm')
            . $this->makePartial('unsplashpicker');
    }

    public function prepareVars()
    {
        parent::prepareVars();

        $this->vars['apiKey'] = Settings::instance()->api_key;
        $this->vars['apiSecret'] = Settings::instance()->api_secret;
    }

    public function loadAssets()
    {
        $this->addCss('/modules/backend/formwidgets/fileupload/assets/css/fileupload.css', 'core');
        $this->addJs('/modules/backend/formwidgets/fileupload/assets/js/fileupload.js', 'core');
        $this->addCss('css/unsplashpicker.css', 'SunLab.Unsplash');
        $this->addJs('js/unsplashpicker.js', 'SunLab.Unsplash');
    }

    public function onAddUnsplashImage()
    {
        try {
            if (!post('image_url') || !post('image_id')) {
                throw new ApplicationException('Image missing from request');
            }

            $fileModel = $this->getRelationModel();
            $url = post('image_url');

            // Parse the query parts of the url to retrieve the extension
            parse_str(parse_url($url, PHP_URL_QUERY), $query);

            $file = new \System\Models\File();
            $file = $file->fromUrl(
                $url,
                sprintf('unsplash-%s.%s', post('image_id'), $query['fm'])
            );



            $maxFilesize = $this->getUploadMaxFilesize();
            $validationRules = ['size' => "lt:${maxFilesize}"];

            if ($fileTypes = $this->getAcceptedFileTypes()) {
                $validationRules['extension'] = 'in:'.$fileTypes;
            }

            if ($this->mimeTypes) {
                $validationRules['mime'] = 'in:'.$this->mimeTypes;
            }

            $filesize = filesize($file->getLocalPath());
            $validation = Validator::make(
                [
                    'size' => $filesize/1024/1024,
                    'extension' => $file->getExtension(),
                    'mime' => $file->getContentType()
                ],
                $validationRules,
                [
                    'size.lt' => Lang::get('system::validation.size.file', ['size' => $maxFilesize*1024])
                ]
            );

            if ($validation->fails()) {
                throw new ValidationException($validation);
            }

            $fileRelation = $this->getRelationObject();
            $file->title = post('title');
            $file->description = post('description');
            $file->is_public = $fileRelation->isPublic();
            $file->save();
            /**
             * Attach directly to the parent model if it exists and attachOnUpload has been set to true
             * else attach via deferred binding
             */
            $parent = $fileRelation->getParent();
            if ($this->attachOnUpload && $parent && $parent->exists) {
                $fileRelation->add($file);
            }
            else {
                $fileRelation->add($file, post('session_key'));
            }

            $file = $this->decorateFileAttributes($file);

            $result = [
                'name' => $file->file_name,
                'name' => post('title', $file->file_name),
                'thumb' => $file->getThumb(200, 200),
                'size' => $filesize,
                'id' => $file->id,
                'path' => $file->path
            ];

            $response = Response::make($result, 200);
        }
        catch (\Exception $ex) {
            $response = Response::make($ex->getMessage(), 400);
        }

        return $response;
    }
}
