var charmeleonSelector  = '.navigation-toggle, .site-branding, .cart-widget',
    $charmeleon         = $(charmeleonSelector),
    bgCheckInitialized  = false;

function bgCheckUpdate() {
    var $hero = $('.hero');

    if ($hero.length) {
        var heroHeight = $hero.outerHeight();
        $charmeleon.toggleClass('background--light-scroll', latestKnownScrollY >= heroHeight - headerHeight/3);
    } else {
        $charmeleon.addClass('background--light-scroll');
    }
}

window.bgCheckInit = function() {
    if (globalDebug) {console.group("global::bgCheckInit");}

    if (bgCheckInitialized) {
        if ($('.hero-bg--image').length) {
            BackgroundCheck.set('images', '.hero-bg--image');
        } else if ($('.hero img.rsImg').length) {
            BackgroundCheck.set('images', '.hero img.rsImg');
        } else {
            //nothing interesting on the page
            //put a bogus image class
            //emptying it would cause it to evaluate all the images on the page
            BackgroundCheck.set('images', '.hero-bg--image-nono');
        }
        return;
    }

    if ($('.hero-bg--image').length) {
        BackgroundCheck.init({
            targets: charmeleonSelector,
            images: '.hero-bg--image',
            threshold: 65,
            debug: globalDebug
        });
        bgCheckInitialized = true;

        if (globalDebug) {console.groupEnd();}
        //return;
    } else if ($('.hero img.rsImg').length) {
        BackgroundCheck.init({
            targets: charmeleonSelector,
            images: '.hero img.rsImg',
            threshold: 65,
            debug: globalDebug
        });
        bgCheckInitialized = true;

        if (globalDebug) {console.groupEnd();}
        //return;
    }

    //$charmeleon.addClass('background--light-scroll');
}