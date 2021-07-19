/**
 *    ImagePreloader v1.0
 *    https://github.com/antwan1986/image-preloader
 *
 *    This library may be freely distributed under the MIT license.
 */

(function(root, factory) {
    'use strict';

    if (typeof(define) === 'function' && define.amd) {
        define(factory);
    } else if (typeof(exports) === 'object') {
        module.exports = factory();
    } else {
        root.ImagePreloader = factory();
    }
}(window, function() { 
    'use strict';

    /**
     *  Creates an image element in memory, binds a load listener to it
     *  that will run a callback function passed through during initialise,
     *  and then triggers the loading of the image by applying the src.
     *
     *  @param string imageSrc - The path of the image to load.
     *  @param func callbackFunc - The callback function to run after load.
     *  @return void.
     */
    function ImagePreloader(imageSrc, callbackFunc) {
        var img = document.createElement('img');

        img.addEventListener('load', function onImageLoaded() {
            if (typeof(callbackFunc) === 'function' && callbackFunc.call) {
                callbackFunc.call();
            }
            img.removeEventListener('click', onImageLoaded, false);
            img = null;
        }, false);

        img.src = imageSrc;
    }

    return ImagePreloader;
}));
