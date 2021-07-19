'use strict';

var _anime;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * Theme js.
 *
 */

/*
 * Helper function if Document ready
 */
function ready(callbackFunc) {
    if (document.readyState !== 'loading') {
        // Document is already ready, call the callback directly
        callbackFunc();
    } else if (document.addEventListener) {
        // All modern browsers to register DOMContentLoaded
        document.addEventListener('DOMContentLoaded', callbackFunc);
    } else {
        // Old IE browsers
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState === 'complete') {
                callbackFunc();
            }
        });
    }
}

/*!
 * Get a matching element or array of all matching elements in the DOM
 */
var $$$ = function $$$(selector, parent) {

    typeof parent == 'string' ? parent = document.querySelector(parent) : parent;

    if (Array.prototype.slice.call((parent ? parent : document).querySelectorAll(selector)).length > 1) {

        return Array.prototype.slice.call((parent ? parent : document).querySelectorAll(selector));
    } else {
        return (parent ? parent : document).querySelector(selector);
    }
};

var $$ = function $$(selector, parent) {

    typeof parent == 'string' ? parent = document.querySelector(parent) : parent;

    return (parent ? parent : document).querySelector(selector);
};

/*
 * Helper simple foreach: https://gomakethings.com/a-vanilla-js-foreach-helper-method/
 * example: forEach(jobs, function (job) { ... });
 */
var forEach = function forEach(arr, callback) {
    Array.prototype.forEach.call(arr, callback);
};

/* 
 * Helper to debounce to ensuring a given task doesn't fire so often that it bricks browser performance.
 * From https://davidwalsh.name/javascript-debounce-function.
 */
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

/* 
 * Helper to get the bounds of a certain element 
 * @top: the elements y-position (in px) from the top of the window
 * @height: the true height (in px) of the element
 */
function getBounds(el) {
    var rect = el.getBoundingClientRect(),
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, height: rect.height };
}

/**
 * Helper to get and update (on window resize) the current document window height (in px)
 */
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

/* Check if screensize is mobile */
var smallScreen = false;
vw < 768 ? smallScreen = true : smallScreen = false;

// update h when the window is resized
window.addEventListener("resize", function () {
    h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
});

/* 
 * Helper that returns true or false if an element is in view of current scrolled window
 */
function getInView(el) {

    return pageY + window.innerHeight > el.offsetTop && window.pageYOffset < el.offsetTop + el.offsetHeight;
}

/* 
 * Helper that returns the scrolled percentage of the given element in relation to the height of the window
 */
function getPercentageInView(el) {
    return (pageY - (el.offsetTop - h)) / (el.offsetHeight + h);
}

/* Global vars */
var pageY = window.pageYOffset,
    perspectiveImgs = [],
    start,
    bubbles,
    scrollableAnimations = [];

/* Sections that trigger data-visible on scroll */
var visibleSections = document.querySelectorAll('[data-visible]');

function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;

    while (element) {
        xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft;
        yPosition += element.offsetTop - element.scrollTop + element.clientTop;
        element = element.offsetParent;
    }

    return { x: xPosition, y: yPosition };
}

/**
 * PerspectiveImg Class creates an object for all '.perspective' images and animates them according to scroll position
 */

var PerspectiveImg = function () {
    function PerspectiveImg(el) {
        _classCallCheck(this, PerspectiveImg);

        this.el = el;
        this.animation;
        this.percentage;
        this.direction = this.el.dataset.direction;
        this.init();
    }

    PerspectiveImg.prototype.init = function init() {
        // Set initial perspective with Anime
        anime.set(this.el, { perspective: 1000 });

        // Set the rotation direction
        var rotate = 20;
        var translate = 10;
        if (this.direction == 'right') {
            rotate = -20;
            translate = -10;
        }

        // Create an animation (prevent from autoplaying)
        this.animation = anime({
            targets: this.el,
            rotateY: rotate,
            translateX: translate,
            autoplay: false,
            easing: 'linear'
        });
    };

    PerspectiveImg.prototype.setSeek = function setSeek() {
        var percentage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        // Set the current animation frame according to percentage of in view
        this.animation.seek(this.animation.duration * percentage);
    };

    _createClass(PerspectiveImg, [{
        key: 'element',
        get: function get() {
            return this.el;
        }
    }]);

    return PerspectiveImg;
}();

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/* Document is ready */
ready(function () {

    var ageOverlay = document.querySelector('.age-overlay');

    if (ageOverlay) {
        if (readCookie('ageCookie')) {
            $$('.age-overlay').style.display = 'none';
            $$('body').style.overflow = 'visible';
        } else {
            $$('.age-overlay').style.display = 'block';
            $$('body').style.overflow = 'hidden';

            $$('.age-btn').addEventListener('click', function (event) {
                $$('.age-overlay').style.display = 'none';
                $$('body').style.overflow = 'visible';
                //document.cookie = "ageCookie=true";
                setCookie('ageCookie', 'true', 30);
            });
        }
    }

    function setCookie(name, value, days) {
        var d = new Date();
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
        document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
    }

    /**
     * Handle the doc and elements when a side nav is opened
     */
    forEach(document.querySelectorAll('.nav-check'), function (btn) {
        btn.addEventListener('change', function () {
            if (this.checked) {
                document.documentElement.classList.add('nav-open');

                // Find all bubble-gif images and put them on hide (to combat slow-down animation of the nav)
                forEach(document.querySelectorAll('img.bubbles-gif'), function (gif) {
                    gif.classList.add('hide');
                });
            } else {
                setTimeout(function () {
                    document.documentElement.classList.remove('nav-open');

                    // Unhide all bubble-gif images
                    forEach(document.querySelectorAll('img.bubbles-gif'), function (gif) {
                        gif.classList.remove('hide');
                    });
                }, 400);
            }
        });
    });

    /** 
     * Tinyslider 
     */
    forEach(document.querySelectorAll('.img-gallery'), function (gallery) {
        var slider = tns({
            container: gallery,
            autoplay: false,
            loop: true,
            mouseDrag: true,
            preventScrollOnTouch: 'auto',
            controls: true,
            controlsPosition: 'bottom',
            controlsText: ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>'],
            nav: true,
            navPosition: 'bottom'
        });
    });

    /** 
     * Tinyslider bottles tilt
     */
    forEach(document.querySelectorAll('.bieren-tilt-gallery'), function (gallery) {
        var slider = tns({
            items: 1,
            edgePadding: 50,
            container: gallery,
            autoplay: false,
            loop: false,
            mouseDrag: true,
            preventScrollOnTouch: 'auto',
            controls: false,
            nav: false,
            speed: 500,
            arrowKeys: true,
            center: true,
            responsive: {
                
                1000: {
                    items: 5,
                    slideBy: 1,
                    edgePadding: 100,
                }
              }
        });

        var blockAnim = false;
        var currentIndex = 0;

        // Foreach the slides and make sure the bottles are clickable
        var slideInfo = slider.getInfo();

        forEach(slideInfo.slideItems, function (slide) {
            slide.addEventListener("click", function () {
                slideClicked(slide);
            });
        });

        function slideClicked(slide) {
            if (!blockAnim && !slide.classList.contains('active-item')) {
                slider.goTo(slide.dataset.slide);
            }
        }

        // Identifies the current centered slide (even when there are more on the screen)
        var changeSlide = function changeSlide(info, eventName) {
            if (currentIndex != info.index) {
                blockAnim = true;
                currentIndex = info.index;

                // get current active slide
                var old = info.container.querySelector('.active-slide');
                setOldSlide(old);

                // get all slides
                var items = info.container.querySelectorAll('.tns-item');
                // remove current classes from the slides
                forEach(items, function (item) {
                    item.classList.remove('active-slide', 'prev-slide', 'next-slide');
                });

                setActiveSlide(items[info.index]);
            }
        };
        // bind function to slide change even
        slider.events.on('transitionStart', changeSlide);

        // animate the previous active slide
        function setOldSlide(old) {
            if (old) {
                anime.remove([old.querySelector('.bottle-tilt-bottle'), old.querySelector('.bottle-tilt-lijn'), old.querySelector('.bottle-tilt-lijn-wrap')]);
                anime({
                    targets: old.querySelector('.bottle-tilt-bottle'),
                    rotate: 0,
                    loop: false
                });
                anime({
                    targets: old.querySelector('.bottle-tilt-lijn-wrap'),
                    rotate: 0,
                    scaleX: 1,
                    loop: false,
                    complete: function complete(anim) {
                        blockAnim = false;
                    }
                });
            }
        }

        // animate the active slide and set next and previous slides
        function setActiveSlide(active) {
            active.classList.add('active-slide');

            anime.remove([active.querySelector('.bottle-tilt-bottle'), active.querySelector('.bottle-tilt-lijn'), active.querySelector('.bottle-tilt-lijn-wrap'), active.querySelector('.bier-item')]);

            // Tilt the new active bottle
            bottleTiltAnimate(active.querySelector('.bottle-tilt'));

            // Animate in the bier spec
            anime({
                targets: active.querySelectorAll('.bier-item'),
                width: [0, '17rem'],
                duration: 250,
                delay: 400,
                easing: 'easeOutQuad'
            });
            anime({
                targets: active.querySelectorAll('.bier-item .anim-me'),
                opacity: [0, 1],
                translateX: [-200, 0],
                duration: 250,
                delay: anime.stagger(50, { start: 500 }),
                easing: 'easeOutQuad'
            });

            // set new prev and next slides
            var prev = active.previousElementSibling;
            if (prev) prev.classList.add('prev-slide');
            var next = active.nextElementSibling;
            if (next) next.classList.add('next-slide');
        }

        // set the first slide as active
        setTimeout(function () {
            setActiveSlide(slider.getInfo().slideItems[0]);
        }, 100);
    });

    /**
     * Tinyslider bieren lineup
     */
    forEach(document.querySelectorAll('.bieren-lineup-gallery'), function (gallery) {
        var slider = tns({
            container: gallery,
            autoplay: false,
            loop: false,
            mouseDrag: true,
            preventScrollOnTouch: 'auto',
            controls: true,
            controlsPosition: 'bottom',
            controlsContainer: '.box-controls',
            nav: true,
            navPosition: 'bottom',
            items: 2,
            responsive: {
                768: {
                    items: 3
                },
                992: {
                    items: 4
                },
                1200: {
                    items: 4
                },
                1560: {
                    items: 5
                }
            }
        });
    });

    /**
     * Find all perspective blox and give them the PerspectiveImg js Class
     */
    forEach(document.querySelectorAll('.perspective'), function (img) {
        img = new PerspectiveImg(img);

        // Push this new perspective img in the global array of PerspectiveImg objects
        perspectiveImgs.push(img);
    });

    /**
     * Find all btn-box and give them a mouseenter and mouseleave
     */
    forEach(document.querySelectorAll('.btn-box'), function (btn) {
        btn.onmouseenter = function (e) {
            boxAnimation(true);
        };
        btn.onmouseleave = function (e) {
            boxAnimation(false);
        };
    });
    // Init the boxes
    anime.set('.perspective-bg', { perspective: 2500, translateZ: -50, rotateY: -25 });
    anime.set('.perspective-img', { perspective: 2500, translateZ: 45, rotateY: -10 });
    anime.set('.handje2', { translateX: -200, rotate: -90 });

    /**
     * Find the bubbles container (homepage) and start bubbling!
     */
    start = document.querySelector('#start');
    bubbles = document.querySelector('#bubbles');
    if (bubbles) {
        createBubbles();
        // setup the bubble element
        anime.set('.bubbles', { translateX: '-50%', perspective: 100, opacity: 0 });
    }

    /* 
     * Init the bottles that have to tilt 
     * Optional position the line:
     * 1. Add the attribute data-linepos="NUMBER" to offset the Y position of the line
     * 2. Add the attribute data-linewidth="NUMBER" to modify the width of the line
     */
    forEach(document.querySelectorAll('.bottle-tilt'), function (bottle) {
        var addStyle = '';

        if (bottle.hasAttribute("data-linepos")) {
            addStyle += 'margin-top:' + parseInt(bottle.getAttribute('data-linepos')) + '%; ';
        }
        if (bottle.hasAttribute("data-linewidth")) {
            addStyle += 'width: ' + parseInt(bottle.getAttribute('data-linewidth')) + '%;';
        }
        if (addStyle !== '') {
            bottle.querySelector('.bottle-tilt-lijn-wrap').style.cssText = addStyle;
        }
    });

    /* 
     * On hover tilt a bottle
     */
    forEach(document.querySelectorAll('.tilt-me'), function (bottle) {
        var target = bottle.querySelector('[data-tilt-target]');
        bottle.addEventListener("mouseenter", function (event) {
            bottleTiltAnimate(target);
        });
    });

    if ($$('.page-template-page-boxes')) {
        setTimeout(cardboxAnimations, 500);
    }

    /*
     * Bier en Spijs
     */

    /* Animation to fly in ingredients on load (from left and right) */
    var bierspijsmousemove = false;
    forEach(document.querySelectorAll('.spijs-ing'), function (spijsIng) {
        spijsIng.classList.contains('spijs-ing-left') ? operator = '-' : operator = '';

        var enterSpijs = anime({
            targets: spijsIng.querySelectorAll('img'),
            translateX: [operator + '35vw', 0],
            translateY: ['-25vh', 0],
            delay: anime.stagger(50),
            easing: 'easeInOutExpo',
            rotate: [operator + 180, 0],
            begin: function begin() {
                $$('.spijs-ing-wrap').style.display = 'flex';
            },
            complete: function complete(anim) {
                if (!bierspijsmousemove) {
                    mousemoveBierSpijs();
                    bierspijsmousemove = true;
                }
                anime.remove(enterSpijs);
            }
        });
    });

    // On hover boxes XL button
    forEach(document.querySelectorAll('.xl-checkbox'), function (xlCheckbox) {

        xlCheckbox.addEventListener('click', function (event) {

            targetBox = '.' + xlCheckbox.getAttribute('data-target');

            if (xlCheckbox.checked) {

                forEach($$(targetBox).querySelectorAll('.reg-box-target'), function (target) {
                    target.style.display = 'none';
                });

                forEach($$(targetBox).querySelectorAll('.xl-box-target'), function (target) {
                    target.style.display = 'block';
                });
            } else {

                forEach($$(targetBox).querySelectorAll('.reg-box-target'), function (target) {
                    target.style.display = 'block';
                });

                forEach($$(targetBox).querySelectorAll('.xl-box-target'), function (target) {
                    target.style.display = 'none';
                });
            }
        });
    });

    /* 
     * Keuzehulp / quiz / test
     */
    if (document.querySelector('#quiz')) {
        initQuiz();
    }
});

var countBox = 0;

// Animation for the cardboard box
function cardboxAnimations() {
    anime.set('.cardbox-flap', { perspective: 2500, filter: 'brightness(1)' });
    anime.set('.cardbox-flap.flap3', { filter: 'brightness(.75)' });
    anime.set('.flaps-shadow-wrap', { translateZ: 200 });
    anime.set('.flap-wrap1', { translateZ: 201 });

    function flapWiggle(target, o) {

        if (o == 'X') {
            anime({
                targets: target,
                rotateX: ['-=2.5', '+=2.5', '-=2', '+=2', '-=1', '+=1', '-=.5', '+=.5'],
                easing: 'easeInOutSine',
                duration: 2500
            });
        } else {
            anime({
                targets: target,
                rotateY: ['-=2.5', '+=2.5', '-=2', '+=2', '-=1', '+=1', '-=.5', '+=.5'],
                easing: 'easeInOutSine',
                duration: 2500
            });
        }
    }

    anime({
        targets: '.cardbox-flap.flap1',
        rotateX: 252.5,
        duration: 2000,
        filter: ['brightness(' + 1 + ')', 'brightness(' + .6 + ')',, 'brightness(' + 1.1 + ')'],
        easing: 'easeInOutSine',
        update: function update(anim) {
            if (anim.progress > 40) {
                anime.set(['.cardbox-logo', '.cardbox-boxtitle'], { opacity: 0 });
            }
        },
        complete: function complete(anim) {
            flapWiggle(anim.animatables[0].target, 'X');
            anime.set('.flap-wrap1', { translateZ: 0 });
        }

    });

    anime({
        targets: '.cardbox-flap.flap2',
        rotateX: -256.5,
        duration: 2000,
        filter: ['brightness(' + 1 + ')', 'brightness(' + .6 + ')'],
        easing: 'easeInOutSine',
        complete: function complete(anim) {
            flapWiggle(anim.animatables[0].target, 'X');
        }
    });

    anime({
        targets: '.cardbox-flap.flap3',
        rotateY: -260,
        duration: 2000,
        filter: ['brightness(' + .75 + ')', 'brightness(' + 1.1 + ')',, 'brightness(' + .6 + ')'],
        delay: 650,
        easing: 'easeInOutSine',
        update: function update(anim) {
            if (anim.progress > 35) {
                anime.set('.flap-wrap2', { translateZ: 203, zIndex: 4 });
            }
        },
        complete: function complete(anim) {
            flapWiggle(anim.animatables[0].target, 'Y');
            anime.set('.flap-wrap2', { translateZ: 0 });
        }
    });

    anime({
        targets: '.cardbox-flap.flap4',
        rotateY: 255,
        duration: 2000,
        filter: ['brightness(' + .8 + ')', 'brightness(' + 1 + ')'],
        delay: 650,
        easing: 'easeInOutSine',
        complete: function complete(anim) {
            flapWiggle(anim.animatables[0].target, 'Y');
        }
    });

    anime({
        targets: '.cardbox-shadow',
        duration: 2000,
        opacity: [.6, 0],
        delay: 200,
        easing: 'easeInOutSine'
    });

    anime({
        targets: '.cardbox-title',
        duration: 2000,
        textShadow: ['-25px 25px 7.5px rgba(0,0,0,0)', '-25px 25px 7.5px rgba(0,0,0,.25)'],
        delay: 200,
        easing: 'easeInOutSine'
    });

    anime({
        targets: '.flaps-shadow.flaps-shadow1',
        translateY: '-100%',
        duration: 800,
        delay: 200,
        easing: 'easeInCubic',
        complete: function complete() {
            anime.set('.flaps-shadow-wrap', { translateZ: 0 });
        }
    });

    anime({
        targets: '.flaps-shadow.flaps-shadow2',
        translateY: '100%',
        duration: 800,
        delay: 200,
        easing: 'easeInCubic'
    });

    anime({
        targets: '.flaps-shadow.flaps-shadow3',
        translateX: '-100%',
        duration: 800,
        delay: 950,
        easing: 'easeInCubic'
    });

    anime({
        targets: '.flaps-shadow.flaps-shadow4',
        translateX: '100%',
        duration: 800,
        delay: 950,
        easing: 'easeInCubic'
    });

    anime({
        targets: '.box-controls',
        opacity: [0, 1],
        duration: 800,
        delay: 950,
        easing: 'easeInCubic'
    });
}

if ($$('.page-template-page-contact')) {
    anime({
        targets: '.krabmap',
        rotate: -720,
        easing: 'linear',
        loop: true,
        duration: 480000
    });

    anime({
        targets: '.globe',
        rotate: 360,
        easing: 'linear',
        loop: true,
        duration: 240000
    });
}

/**
 * Animations to move the truck on scroll
 */

anime.set('.wielen', { rotate: '0turn' });
anime.set('.de-truck', { translateX: '-75vw' });

var wielenAnim = anime({
    targets: '.wielen',
    rotate: ['4turn'],
    duration: 1,
    easing: 'easeInOutSine',
    autoplay: false
});

var truckAnim = anime({
    targets: '.de-truck',
    translateX: ['-5vw'],
    duration: 1,
    easing: 'easeInOutSine',
    autoplay: false
});

anime({
    targets: '.truck-leeg',
    translateY: -4,
    direction: 'alternate',
    easing: 'easeInOutSine',
    loop: true
});

anime({
    targets: '.truck-fles',
    translateY: .5,
    rotate: 2.5,
    direction: 'alternate',
    easing: 'easeInOutSine',
    loop: true
});

/**
 * Animations to pair the photos on brouwerij page 
 */
if ($$('.page-template-page-brouwerij')) {

    anime.set('.fotoboek-foto', {
        rotate: function rotate() {
            return anime.random(-45, 45);
        },
        scale: function scale() {
            return anime.random(90, 110) / 100;
        }

    });

    var fotoboekLeft = anime({
        targets: '.fotoboek-left div',
        translateX: function translateX() {
            return smallScreen ? '-150vw' : '-100vw';
        },
        rotate: -25,
        easing: 'linear',
        delay: anime.stagger(150),
        autoplay: false
    });

    var fotoboekRight = anime({
        targets: '.fotoboek-right div',
        translateX: function translateX() {
            return smallScreen ? '150vw' : '100vw';
        },
        rotate: 25,
        easing: 'linear',
        delay: anime.stagger(150),
        autoplay: false
    });
}

/**
 * Animations to give the beer boiler perspective
 */

anime.set('.ketel-trots-bg', { scale: 1.175 });
//anime.set('.ketel-trots-content', {scale: 1.15})


var ketelBg = anime({
    targets: ['.ketel-trots-bg'],
    translateY: ['-35%', '35%'],
    easing: 'linear',
    autoplay: false
});

var ketelContent = anime({
    targets: '.ketel-trots-content',
    translateY: ['-15%', '15%'],
    easing: 'linear',
    autoplay: false
});

/* Array contains all scroll animations for the boiler */
var ketelAnimations = [ketelBg, ketelContent];

/**
 * Animations to animate the hops from the hand
 */

anime.set('.hophand-wrap img', {
    translateX: function translateX() {
        return anime.random(-300, 200) + '%';
    },
    translateY: function translateY() {
        return anime.random(-350, 0) + '%';
    }
});

anime({
    targets: '.hophand-wrap img',
    rotate: function rotate() {
        return anime.random(-360, 360);
    },
    direction: 'alternate',
    loop: true,
    easing: 'linear',
    duration: 20000
});

var hopAnim = anime({
    targets: '.hophand-hop',
    translateY: function translateY() {
        return anime.random(-150, -750) + "%";
    },
    easing: 'linear',
    autoplay: false
});

anime((_anime = {
    targets: '.prijzen-award',
    filter: ['brightness(' + 1 + ')', 'brightness(' + 6 + ')', 'brightness(' + 1 + ')'],
    duration: 250,
    loop: true
}, _defineProperty(_anime, 'duration', 500), _defineProperty(_anime, 'delay', anime.stagger(75, { start: 1500 })), _defineProperty(_anime, 'easing', 'easeInOutSine'), _anime));

function fireworksAward() {

    anime({
        targets: ['.wba-vector path', '.wba-vector rect'],
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 750,
        delay: function delay(el, i) {
            return i * 5;
        }
    });

    anime({
        targets: '.wba-vector',
        opacity: 1,
        easing: 'easeInOutSine',
        duration: 5
    });

    anime({
        targets: '.wba-20',
        easing: 'easeInOutSine',
        delay: 1000,
        duration: 250,
        opacity: [0, 1]
    });
};

var fwCount = 0;

if ($$('.fireworks-shop')) {

    fireworks();

    setInterval(fireworks, 2500);
}

function fireworks() {

    var particleColors = [];

    if (fwCount % 2 == 0) {
        particleIteration = true;
        particleColors = ['#15B7B7', '#30C9C9', '#071F38', '#ffda45'];
    } else {
        particleIteration = false;
        particleColors = ['#000000', '#d42a2a', '#ffd900'];
    }

    var ranNrsX = [];
    var ranNrsY = [];

    forEach($$$('.firework-particle div'), function (fireworkPartile) {

        fireworkPartile.style.background = particleColors[anime.random(0, particleColors.length - 1)];

        anime.set(fireworkPartile, { scale: anime.random(100, 200) / 100 });

        ranNrX = anime.random(-300, 300);
        ranNrY = anime.random(-300, 300);

        if (particleIteration) {

            if (ranNrX > ranNrY) {
                ranNrsX.push(ranNrX - ranNrY);
                ranNrsY.push(ranNrY);
            } else {
                ranNrsY.push(ranNrY - ranNrX);
                ranNrsX.push(ranNrX);
            }
        } else {
            if (ranNrX > ranNrY) {
                ranNrsX.push(ranNrX + ranNrY);
                ranNrsY.push(ranNrY);
            } else {
                ranNrsY.push(ranNrY + ranNrX);
                ranNrsX.push(ranNrX);
            }
        }
    });

    anime({
        targets: '.firework-particle',
        easing: 'easeOutExpo',
        translateX: function translateX(el, i, l) {
            return [0, ranNrsX[i]];
        },
        translateY: function translateY(el, i, l) {
            return [0, ranNrsY[i]];
        },
        duration: function duration() {
            return anime.random(800, 1200);
        }
    });

    anime({
        targets: '.firework-particle div',
        easing: 'easeOutSine',
        scale: function scale() {
            return [0];
        },
        duration: function duration() {
            return anime.random(1500, 3500);
        }
    });

    fwCount++;
}

window.addEventListener('scroll', windowScroll);

var k = 0;
var countBox = 0;
/* 
 * On window scroll function 
 * Uses the debounce function to not needlessly tax the cpu
 */
var windowScroll = debounce(function () {

    // fire award animations on home page
    if (document.querySelector('.page-template-page-home')) {

        if (getPercentageInView(document.querySelector('.winnaar')) > .25 && getPercentageInView(document.querySelector('.winnaar')) > .25 && k < 1) {

            fireworksAward();

            setTimeout(function () {
                fireworks();
            }, 500);

            setInterval(fireworks, 2500);

            k++;
        }
    }

    // update the current scrollposition (used in multiple places)
    pageY = window.pageYOffset;

    // brouwerij page scroll animation
    if ($$('.page-template-page-brouwerij')) {

        // the boiler
        var elem = $$('.ketel-trots');

        if (getInView(elem)) {

            forEach(ketelAnimations, function (ketelAnim) {
                ketelAnim.seek(getPercentageInView(elem) * 1000);
            });
        }

        // the hops from the hand
        var elem2 = $$('.hophand');

        if (getInView(elem2)) {

            hopAnim.seek(getPercentageInView(elem2) * 1000);
        }

        // the scrapbook
        var elem3 = $$('.fotoboek-section');

        if (getInView(elem3)) {

            fotoboekLeft.seek(getPercentageInView(elem3) * 1000);
            fotoboekRight.seek(getPercentageInView(elem3) * 1000);
        }
    }

    /* Check if there are any perspective images on screen and if so, animate them */
    forEach(perspectiveImgs, function (img) {
        var el = img.element;
        if (getInView(el)) {
            img.setSeek(getPercentageInView(el));
        }
    });

    // Truck scroll animation
    if ($$('.page-template-page-bieren')) {

        var _elem = document.querySelector('.de-truck');

        if (getInView(_elem)) {

            truckAnim.seek(getPercentageInView(_elem) + .3);
            wielenAnim.seek(getPercentageInView(_elem) + .3);
        }
    }

    // Run cardboard box animations
    if ($$('.single-boxes')) {
        if (countBox < 1) {
            if (getPercentageInView($$('.cardbox')) > .75 && countBox < 1) {
                setTimeout(cardboxAnimations);
                countBox++;
            } else {
                countBox = 0;
            }
        }
    }

    // Invert menu for special beer detail pages
    if ($$('.invert-menu')) {
        if (scrollY > getPosition($$('.invert-menu')).y && scrollY < getPosition($$('.invert-menu')).y + $$('.invert-menu').clientHeight) {
            document.body.classList.add('invert');
        } else {
            document.body.classList.remove('invert');
        }
    }

    /* Homepage functions to fire scroll animations */
    if (bubbles && start && getInView(start)) {
        forEach(scrollableAnimations, function (item) {
            animateScroll(item);
        });

        if (bubbles.style.display == "none") {
            bubbles.style.display = "block";
        }
    } else if (bubbles && start && pageY > h - h / 2.5) {
        bubbles.style.display = "none";
    }

    /* Bier en Spijs function onscroll header */
    if ($$('.bier-en-spijs-header')) {
        scrollBierSpijs();
    }

    /*
     * Start data-visible animation triggers [data-visible]
     */
    // Don't bother running the rest of the below data-visible code if every section is already visible
    if (document.querySelectorAll('[data-visible]:not(.visible)').length === 0) return;

    // Add visible class on visible in viewport
    for (i = 0; i < visibleSections.length; i++) {
        var section = visibleSections[i];
        var bounds = getBounds(section);
        /* determine how fast the visible class should be added (lower number is further down the page) */
        var offset = parseFloat(section.getAttribute('data-visible'));

        // If the top position of the element is less than the current scrollposition (pageY) and hasn't been visible yet
        if (bounds.top - h * offset < pageY && !section.classList.contains('visible')) {
            // Show and animate the element
            section.classList.add('visible');
            // Do a tilt animation if this is a bottle-tilt
            if (section.classList.contains('bottle-tilt')) {
                if (section.classList.contains('detail-bottle-tilt')) {} else {
                    bottleTiltAnimate(section);
                }
            }
            if (section.classList.contains('bier-spijs')) {
                bierSpijsSections(section);
            }
        }
        /* If a page is loaded when an element is already visible (below it's scrollTop position), always show it (without animations) */
        else if (!section.classList.contains('visible') && section.top < pageY) {
                section.classList.add('visible');
                section.classList.add('skip-anim');
                // Do a tilt animation if this is a bottle-tilt
                if (section.classList.contains('bottle-tilt')) {
                    bottleTiltAnimate(section);
                }
            }
    }
}, 10);

window.addEventListener('scroll', windowScroll);

setTimeout(function () {
    windowScroll();
}, 10);

/* 
* Tilts a beer bottle 
*/
function bottleTiltAnimate(target) {
    var bottle = target.querySelector('.bottle-tilt-bottle'),
        lijnWrap = target.querySelector('.bottle-tilt-lijn-wrap'),
        lijn = target.querySelector('.bottle-tilt-lijn'),
        shadow = target.querySelector('.bottle-tilt-shadow');

    anime.set(lijn, {
        scaleY: 1
    });

    var bottleTiltTimeline = anime.timeline({
        easing: 'easeInOutBack',
        duration: 500,
        delay: 300,
        complete: function complete(anim) {
            tiltLoop(bottle, lijnWrap, shadow);
        }
    });

    bottleTiltTimeline.add({
        targets: bottle,
        rotate: 5,
        scale: 1
    }, 0)
    //     .add({
    //     targets: shadow,
    //     scaleX: [.75, 1],
    //     rotate: 0.01

    // }, 0)
    //     .add({
    //     targets: lijnWrap,
    //     rotate: -25,
    //     scaleX: 1.15,
    //     translateX: '-5%',
    // }, 0)
    .add({
        targets: target,
        rotate: 0,
        translateX: 0,
        scale: 1
    }, 0);

    // moveLiquid(lijn);
}

/* 
 * Loop for beer bottles tilting back and forth 
 */
function tiltLoop(bottle, lijnWrap, shadow) {
    var tiltLoopTimeline = anime.timeline({
        easing: 'easeInOutSine',
        duration: 10000,
        loop: true,
        rotate: 0.01
    });

    tiltLoopTimeline.add({
        targets: bottle,
        rotate: ['+=1', '-=2', '+=1']
    }, 0).add({
        targets: lijnWrap,
        rotate: ['-=3', '+=6', '-=3'],
        translateY: ['-=1.5', '+=4', '-=2.5']
    }, 0).add({
        targets: shadow,
        translateX: ['+=5', '-=5'],
        rotate: 0.01
    }, 0);
}

/* 
 * Wiggle the beer line on movement 
 */
function moveLiquid(lijn) {
    anime({
        targets: lijn,
        rotate: ['-=9', '+=13.5', '-=12', '+=10.5', '-=9', '+=7.5',, '-=6',, '+=4.5',, '-=3',, '+=1.75', '-=1', '+=1.5', '-=.25', '+=1.125', 0],
        scaleY: [1, '-=0.3', '+=0.45', '-=0.4', '+=0.35', '-=0.3', '+=0.25',, '-=0.2',, '+=0.15',, '-=0.1',, '+=0.08', '-=0.04', '+=0.06', '-=0.02', 1],
        easing: 'easeInOutSine',
        duration: 2500,
        delay: 350
    });
}

/* 
 * Specific Anime.js animations 
 */

/* Box (met bieren) animation */

function boxAnimation(direction) {
    if (direction) {
        direction = 'normal';easing = 'easeOutElastic';
    } else {
        direction = 'reverse';easing = 'easeInElastic';
    }

    anime.remove(['.box-flessen img', '.perspective-bg', '.perspective-img', '.box-prijs', 'handje2']);

    anime({
        targets: '.box-flessen img',
        translateY: [0, -35],
        delay: anime.stagger(25),
        duration: 750,
        direction: direction,
        easing: easing
    });
    anime({
        targets: '.perspective-bg',
        translateZ: [-50, -85],
        translateX: 10,
        duration: 350,
        direction: direction,
        easing: 'easeInOutCubic'
    });
    anime({
        targets: '.perspective-img',
        translateZ: [45, 125],
        translateX: [0, -10],
        direction: direction,
        duration: 350,
        easing: 'easeInOutCubic'
    });
    anime({
        targets: '.box-prijs',
        scale: [1, 1.1],
        easing: easing,
        direction: direction
    });
    anime({
        targets: '.handje2',
        translateX: [-200, 0],
        rotate: [-90, 0],
        easing: 'easeOutQuint',
        duration: 500,
        direction: direction
    });
}

/* Homepage: Create, append and animate pink bubbles */

function createBubbles() {
    var bubblesParent = document.querySelector("#bubbles");
    var BubblesAmount = 75;

    for (i = 0; i < BubblesAmount; i++) {
        bubbleSize = anime.random(7, 17);

        var bubble = document.createElement('div');
        bubble.setAttribute("class", "bubble bubble" + i); //Set path's data //Create a path in SVG's namespace
        bubblesParent.appendChild(bubble);

        /* random starting X position and set scale to 0 */
        anime.set(bubble, { translateX: anime.random(-50, 50), width: bubbleSize, height: bubbleSize });
        bubbleAnimation = anime({
            targets: bubble,
            translateY: {
                easing: 'linear',
                value: [0, -Math.abs(h)]
            },
            translateX: [anime.random(-35, 35), anime.random(-27, 45), anime.random(-30, 30), anime.random(-25, 25)],
            duration: anime.random(6000, 12000),
            easing: 'easeInOutCubic',
            autoplay: false,
            loop: true
        });

        bubbleAnimation.seek(anime.random(0, bubbleAnimation.duration));

        bubbleAnimation.play();
    }
}

/* Homepage onscroll pink bubbles zoom + opacity */

if (pageY < 1) {

    anime({
        targets: '.bubbles',
        easing: 'easeInOutQuad',
        opacity: [0, 1]
    });
}

var bubbleZoom = anime({
    targets: '.bubbles',
    opacity: [1, 0],
    autoplay: false,
    translateZ: 100
});

var headerWrap = anime({
    targets: '.header-fade',
    opacity: [1, 0],
    autoplay: false,
    easing: 'easeOutQuint'
});

// Fill up the scrollableAnimation array for the elements that should animate on homepage scroll
scrollableAnimations = [[bubbleZoom, 'multiply', 3], [headerWrap, 'multiply', 1.2]];

function animateScroll(item) {
    var wh = h;
    if (item[1] == 'multiply') wh = wh * item[2];else if (item[1] == 'divide') wh = wh / item[2];

    item[0].seek(item[0].duration * (pageY / wh));
}

/*
 * Bier en Spijs
 */

/* Animation to make ingredients follow the mouse X position */
function mousemoveBierSpijs() {
    //anime.set('.spijs-ing img', { translateX: 0 }); 
    document.querySelector('.bier-en-spijs-header').addEventListener('mousemove', function (event) {
        spijsAnim.seek(event.pageX / vw);
    });
}

var spijsAnim = anime({
    targets: '.spijs-ing img',
    translateY: [0, 0],
    translateX: function translateX() {
        return ['0px', anime.random(150, 50) + 'px'];
    },
    rotate: function rotate() {
        return [0, anime.random(5, 15)];
    },
    easing: 'linear',
    duration: 10,
    autoplay: false
});

/* Animation to animate ingredients on scroll */
function scrollBierSpijs() {
    spijsWrapAnim.seek(window.scrollY / 2500);
}

var spijsWrapAnim = anime({
    targets: '.spijs-ing-wrap',
    translateY: 500,
    autoplay: false,
    duration: 1,
    scale: [1, 1.75],
    easing: 'linear'
});

/* Bier stats on scroll animations */

anime.set('.bier-spijs hr', { width: 0 });
anime.set('.spectxt', { translateY: '150%' });
anime.set('.smaasuggestie', { translateX: -75, opacity: 0 });

function bierSpijsSections(target) {

    anime({
        targets: target.querySelectorAll('hr'),
        width: [0, '100%'],
        easing: 'easeInOutExpo',
        delay: anime.stagger(50)
    });

    anime({
        targets: target.querySelectorAll('.spectxt'),
        translateY: ['150%', 0],
        easing: 'easeInOutExpo',
        delay: anime.stagger(50, { start: 200 })
    });

    anime({
        targets: target.querySelectorAll('.smaaksuggestie'),
        translateX: [-75, 0],
        opacity: [0, 1],
        delay: anime.stagger(50, { start: 400 }),
        easing: 'easeInOutExpo'
    });
}

/* 
 * Keuzehulp / quiz / test functionality
 */
var quiz = {},
    roundcount,
    rounds,
    prio;

function initQuiz() {
    roundcount = parseInt(document.querySelector('#counter').dataset.total);
    rounds = document.querySelectorAll('li[data-round]');
    // push a new array for all questions
    forEach(document.querySelectorAll('[data-score]'), function (answer) {
        answer.addEventListener("click", setScore);
    });

    // fill the prio bier array
    prio = document.getElementById('prio').value.split(',');

    // animate the opening screen
    anime({
        targets: document.querySelectorAll('.opening .anim-me'),
        opacity: 1,
        translateY: [100, 0],
        duration: 500,
        delay: anime.stagger(80, { start: 200 }),
        easing: 'easeOutExpo'
    });

    document.getElementById('startQuizBtn').addEventListener('click', function (event) {
        startQuiz();
    });
}

/* Animate the start of the quiz */
function startQuiz() {
    document.querySelector('.opening').classList.add('hide');

    document.querySelector('.start').classList.remove('hide');
    anime({
        targets: document.querySelectorAll('.start .countdown'),
        scale: [0, 1],
        opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(600, { start: 200 }),
        complete: function complete(anim) {
            anime({
                targets: '.start',
                opacity: 0,
                duration: 600,
                easing: 'linear'
            });
            document.querySelector('.questions').classList.remove('hide');
            document.querySelector('.questions').classList.add('vh-90');
            document.querySelector('.counter-bottom').classList.remove('hide');
            setTimeout(function () {
                document.querySelector('.start').classList.add('hide');
                animateAnswers(rounds[0]);
            }, 400);
        }
    });
}

/* Animate the answers in */
function animateAnswers(round) {
    var answers = round.querySelectorAll('.answer');
    anime({
        targets: answers,
        opacity: [0, 1],
        scale: [0, 1],
        duration: 600,
        delay: anime.stagger(150, { start: 200 })
    });
}

/* Animate the results in */
function animateResults(winnerID) {
    document.querySelector('.questions').classList.add('hide');
    document.querySelector('.counter-bottom').classList.add('hide');
    document.querySelector('.brewing').classList.remove('hide');

    anime({
        targets: '.brewing .computer',
        opacity: [0, 1],
        translateY: [-400, 0],
        scale: [0, 1],
        duration: 600
    });

    var winnerEl = document.querySelector('[data-bier-result="' + winnerID + '"]');

    setTimeout(function () {
        document.querySelector('.brewing').classList.add('hide');
        document.querySelector('.quiz-results').classList.remove('hide');
        document.querySelector('.logo').classList.add('black');
        winnerEl.classList.remove('hide');

        anime({
            targets: '.bottle-tilt',
            translateX: [-200, 0],
            duration: 600,
            complete: function complete(anim) {
                bottleTiltAnimate(winnerEl.querySelector('.bottle-tilt'));

                anime({
                    targets: document.querySelectorAll('.quiz-results .anim-me-bottle'),
                    opacity: [0, 1],
                    translateX: [100, 0],
                    duration: 600
                });

                anime({
                    targets: document.querySelectorAll('.quiz-results .go-again'),
                    opacity: [0, 1],
                    translateY: [100, 0],
                    easing: 'easeOutExpo',
                    delay: 500
                });
            }
        });
    }, 4000);
}

// Fill the quiz object with the round and the score for that round
function setScore() {
    var round = parseInt(this.dataset.round);
    quiz[round] = this.dataset.score.split(',');

    if (round !== roundcount) {
        getRound(round + 1);
    } else {
        getQuizResults();
    }
    updateRoundCounter(round);
}

// Exit the current round and enter the next
function getRound(key) {
    forEach(rounds, function (round) {
        if (round.dataset.round == key) {
            round.classList.add('active');

            animateAnswers(round);
        } else {
            round.classList.remove('active');
        }
    });
}

// Update the rounds counter (and show / hide the complete counter)
function updateRoundCounter(round) {
    document.querySelector('#counter').innerHTML = roundcount - round;

    if (roundcount - round > 1) {
        document.querySelector('#counter-stats').classList.remove('hide');
        document.querySelector('#counter-last').classList.add('hide');
    } else if (roundcount - round == 1) {
        document.querySelector('#counter-stats').classList.add('hide');
        document.querySelector('#counter-last').classList.remove('hide');
    }
}

// Calculate and show the correct results
function getQuizResults() {
    var results = [];

    // Make one big array with all the scores of all the rounds (scores are arrays with bier ID's)
    for (var key in quiz) {
        var arr = quiz[key];
        results = results.concat(quiz[key]);
    }

    // First get the duplicate IDs and group them
    var compressed = compressArray(results);
    // Create an array of the top entries (could contain multiple entries with the same amount of occurances)
    var winners = getTopEntries(compressed);
    // Test if there are any IDs in the prio array (defined in the WP backend)
    var winnerID = testPrio(winners);

    animateResults(winnerID);
}

/* 
 * Helper function to get a js Map that counts duplicates
 * by: https://gist.github.com/ralphcrisostomo/3141412#gistcomment-2315593
 */
function compressArray(array) {
    return array.reduce(function (countsMap, item) {
        return countsMap.set(item, countsMap.get(item) + 1 || 1);
    }, new Map());
}

/* 
 * Helper function to return the top sorted entries in an array
 */
function getTopEntries(compressed) {
    var sorted = new Map([].concat(_toConsumableArray(compressed.entries())).sort(function (a, b) {
        return b[1] - a[1];
    }));

    var winners = [];
    var a = 0;

    // Foreach the js Map and find out how many top results are there
    sorted.forEach(function (value, key) {
        if (value >= a) {
            a = value;
            winners.push(key);
        }
    });
    return winners;
}

/* 
 * Helper function to test if there are prio IDs in the array
 */
function testPrio(winners) {
    for (var id in prio) {
        if (winners.indexOf(prio[id]) > -1) {
            return prio[id];
        }
    }

    return winners[0];
}