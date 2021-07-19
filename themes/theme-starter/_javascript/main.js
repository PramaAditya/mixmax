if ($('#news-slider').length) {
    var newsSlider = tns({
        container: '#news-slider',
        items: 1,
        slideBy: 1,
        // slideBy: 'page',
        center: true,
        loop: true,
        nav: false,
        gutter: 100,
        controlsContainer: '#news-control',
        mouseDrag: true,
        arrowKeys: true,
    });
}