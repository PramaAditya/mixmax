<?php

namespace Balkat\Mixmax\FormWidgets;

use Backend\Classes\FormWidgetBase;
use Storage;
use Config;
use Request;
use Instagram\Api;

/**
 * InstagramFeed Form Widget
 */
class InstagramFeed extends FormWidgetBase
{
    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'balkat_mixmax_instagram_feed';

    /**
     * @inheritDoc
     */
    public function init()
    {
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('instagramfeed');
    }

    /**
     * prepareVars for view data
     */
    public function prepareVars()
    {
        $this->vars['name'] = $this->formField->getName() . '[]';
        $this->vars['value'] = $this->getLoadValue();
        $this->vars['model'] = $this->model;
        $this->vars['imagePaths'] = $this->getImagePaths();
    }


    /**
     * @inheritDoc
     */
    public function loadAssets()
    {
        $this->addCss('css/image-picker.css', 'Balkat.Mixmax');
        $this->addCss('css/style.css', 'Balkat.Mixmax');
        $this->addJs('js/image-picker.min.js', 'Balkat.Mixmax');
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        return $value;
    }
    public function rudr_instagram_api_curl_connect($api_url)
    {
        $connection_c = curl_init(); // initializing
        curl_setopt($connection_c, CURLOPT_URL, $api_url); // API URL to connect
        curl_setopt($connection_c, CURLOPT_RETURNTRANSFER, 1); // return the result, do not print
        curl_setopt($connection_c, CURLOPT_TIMEOUT, 20);
        $json_return = curl_exec($connection_c); // connect and get json data
        curl_close($connection_c); // close connection
        return json_decode($json_return); // decode and return
    }
    private function getImagePaths()
    {
        $totalImagesToSave = 10;
        $directory = "media/igs/";
        $savedImages = Storage::allFiles($directory);
        $savedImagesTotal = count($savedImages);

        // Check if the API need to be called or not, based on saved image
        if ($totalImagesToSave > $savedImagesTotal) {
            $totalImagesToGet = $totalImagesToSave - $savedImagesTotal;
        }

        try {
            $instagram = new \InstagramScraper\Instagram();
            $instagram->setRapidApiKey('d24896e719msh8f6349d2d058582p1cae84jsn0acc717a8724');
            $medias = $instagram->getMedias('mixmax_vodka');

            $imagePaths = array();

            // $media = $medias[0];
            foreach ($medias as $media) {
                $igURL = $media->getImageStandardResolutionUrl();
                $fileName = "{$directory}{$media->getCreatedTime()}{$media->getId()}.jpg";
                $this->downloadImage($igURL, $fileName);
            }
        } catch (\Throwable $th) {
            //throw $th;
        }




        foreach ($savedImages as $storagePath) {
            $imagePaths[] = Config::get('app.url').Storage::url($storagePath);
        }
        $imagePaths = array_reverse($imagePaths);
        // echo var_dump($imagePaths);
        return $imagePaths;
    }
    private function downloadImage($url, $fileName)
    {
        $is_exist = Storage::exists($fileName);
        if (!$is_exist) {
            Storage::put(
                $fileName,
                file_get_contents($url)
            );
        }
    }
}
