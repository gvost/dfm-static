var $window             = $(window),
    $document           = $(document),
    $html               = $('html'),
    $body               = $('body'),
    // needed for browserSize
    windowWidth         = $window.width(),
    windowHeight        = $window.height(),
    documentHeight      = $document.height(),
    aspectRatio         = windowWidth / windowHeight,
    orientation         = windowWidth > windowHeight ? 'landscape' : 'portrait',
    orientationChanged  = false,
    headerHeight        = $('.panel--logo').outerHeight(),
    // needed for requestAnimationFrame
    latestKnownScrollY  = window.scrollY,
    lastKnownScrollY    = latestKnownScrollY,
    scrollDirection     = 'down',
    ticking             = false;

function browserSize() {
    var newOrientation;

    windowWidth         = $window.outerWidth();
    windowHeight        = $window.outerHeight();
    documentHeight      = $document.height();
    aspectRatio         = windowWidth / windowHeight;
    newOrientation      = windowWidth > windowHeight ? 'landscape' : 'portrait';

    if (newOrientation !== orientation) {
        orientationChanged = true;
    }

    orientation         = newOrientation;
}

function onOrientationChange(firstTime) {

    firstTime = firstTime || false;

    if (!orientationChanged) {
        return;
    }

    if (orientationChanged || !!firstTime) {

        if (Modernizr.touch) {

            var $hero = $('#djaxHero, .hero-slider');

            $hero.removeAttr('style');
            $hero.attr('style', 'height: ' + $hero.outerHeight() + 'px !important');

            // trigger resize to let royal slider relayout
            $(window).trigger('resize');

        }

        Parallax.initialize();
        Pile.refresh();
    }

    orientationChanged = false;

}

function reload(firstTime) {
    if (globalDebug) {console.group("global::reload")}
    browserSize();
    resizeVideos();
    onOrientationChange(firstTime);

    if (firstTime === true) {
        Parallax.initialize();
        Pile.initialize();
        return;
    }

    if (!Modernizr.touch) {
        Parallax.initialize();
    }

    Pile.refresh();
    if (globalDebug) {console.groupEnd()}
}

$window.smartresize(reload);

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(update);
    }
    ticking = true;
}

function update() {
    ticking = false;

    bgCheckUpdate();
    Parallax.update();
    Pile.update();
}

/* ====== INTERNAL FUNCTIONS END ====== */


/* ====== ONE TIME INIT ====== */

function init() {
    if (globalDebug) {console.group("global::init");}

    //  GET BROWSER DIMENSIONS
    browserSize();

    // /* DETECT PLATFORM */
    platformDetect();

	loadAddThisScript();

    /* INSTANTIATE DJAX */
    AjaxLoading.init();
    navigationInit();

    /* ONE TIME EVENT HANDLERS */
    eventHandlersOnce();

    /* INSTANTIATE EVENT HANDLERS */
    eventHandlers();

    if (globalDebug) {console.groupEnd();}
}



/* ====== CONDITIONAL LOADING ====== */

function loadUp() {
    if (globalDebug) {console.group("global::loadup");}

    initVideos();
    resizeVideos();
    magnificPopupInit();
    royalSliderInit();

    $('.pixcode--tabs').organicTabs();

    $('body').imagesLoaded(function () {
        if (globalDebug) {console.log("body::imagesLoaded")}
        var $hero       = $('#djaxHero');

        if (Modernizr.touch) {
            $hero.css('cssText', 'height: ' + $hero.outerHeight() + 'px !important');
            $('.hero-slider').css('cssText', 'height: ' + $hero.outerHeight() + 'px !important');
        }

        TweenMax.to($('.title-wrapper, .entry-content'), 0.5, {
            opacity: 1,
            ease: Power3.easeInOut
        });

        reload(true);

    });

	/*
	 * Woocommerce Events support
	 * */

	if (typeof woocommerce_events_handlers == 'function') {
		woocommerce_events_handlers();
	}

    if (globalDebug) {console.groupEnd();}
}

/* ====== EVENT HANDLERS ====== */

function eventHandlersOnce() {
    if (globalDebug) {console.group("eventHandlers::once");}

    $('a[href="#top"]').on('click', function(e) {
        e.preventDefault();
        smoothScrollTo(0);
    });

    copyrightOverlayInit();

    if (globalDebug) {console.groupEnd();}

}

function eventHandlers() {
    if (globalDebug) {console.group("eventHandlers");}

    bindShareClick();

    $('.pile-item').not('.pile-share, .post').each(function (i, item) {

        var $item       = $(this).find('.pile-item-wrap'),
            $border     = $item.find('.pile-item-border'),
            $image      = $item.find('img'),
            $content    = $item.find('.pile-item-content'),
            $title      = $item.find('.pile-item-title'),
            $meta = $item.find('.pile-item-meta'),
            itemHeight  = $item.outerHeight(),
            itemWidth   = $item.outerWidth();

        $(this).hover(function () {
            TweenMax.to($border, .2, {
                borderTopWidth: 18,
                borderRightWidth: 18,
                borderBottomWidth: 18,
                borderLeftWidth: 18,
                'ease': Power3.easeOut
            });

            TweenMax.to($content, .2, {
                opacity: 1,
                'ease': Power3.easeOut
            }, '-=.2');

            TweenMax.fromTo($title, .2, {
                y: -20
            }, {
                y: 0
            }, '-=.2');

            TweenMax.fromTo($meta, .2, {
                y: 20
            }, {
                y: 0
            }, '-=.2');

            TweenMax.to($image, .2, {
                'opacity': .35,
                'ease': Power3.easeOut
            });

        }, function () {

            TweenMax.to($border, .2, {
                borderTopWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0,
                borderLeftWidth: 0,
                'ease': Power3.easeOut
            });

            TweenMax.to($content, .2, {
                opacity: 0,
                'ease': Power3.easeIn
            }, '-=.2');

            TweenMax.fromTo($title, .2, {
                y: 0
            }, {
                y: -20
            }, '-=.2');

            TweenMax.fromTo($meta, .2, {
                y: 0
            }, {
                y: 20
            }, '-=.2');

            TweenMax.to($image, .2, {
                'opacity': 1,
                'ease': Power3.easeIn
            });
        });

    });

    //Scroll Down Arrows on Full Height Hero
    $('.hero-scroll-down').on('click', function(e){
        smoothScrollTo(windowHeight);
    })

    if (globalDebug) {console.groupEnd();}
}


/* --- GLOBAL EVENT HANDLERS --- */


/* ====== ON DOCUMENT READY ====== */

$(document).ready(function () {
    if (globalDebug) {console.group("document::ready");}

    init();

    if (globalDebug) {console.groupEnd();}
});


$window.load(function () {
    if (globalDebug) {console.group("window::load");}

    loadUp();

    niceScrollInit();
    gmapInit();

    $('.pixcode--tabs').organicTabs();

    if (globalDebug) {console.groupEnd();}
});

/* ====== ON JETPACK POST LOAD ====== */

$(document).on('post-load', function () {
	if (globalDebug) {console.log("Jetpack Post load");}

    initVideos();
    resizeVideos();

});

/* ====== ON SCROLL ====== */

$window.on('scroll', onScroll);

function onScroll() {
    latestKnownScrollY = $(document).scrollTop();
    scrollDirection = lastKnownScrollY > latestKnownScrollY ? 'up' : 'down';
    lastKnownScrollY = latestKnownScrollY;
    requestTick();
    bgCheckUpdate();
}