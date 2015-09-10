var $navigation = $('.site-navigation'),
    $navToggle  = $('.navigation-toggle'),
    navIsOpen   = false;

function hideMenu() {

    if (!navIsOpen) {
        return;
    }

    if (windowWidth < 900) {
        $('html').removeClass('scroll-lock');
    }

    $('html').removeClass('nav--is-visible');
    TweenMax.to($navigation, 0.3, {
        opacity: 0,
        ease: Power2.easeOut
    });

    $charmeleon.removeClass('background--light-menu');

    navIsOpen = false;
}

function showMenu() {

    if (navIsOpen) {
        return;
    }

    if (windowWidth < 900) {
        $('html').addClass('scroll-lock');
    }

    $('html').addClass('nav--is-visible');

    TweenMax.to($navigation, 0.3, {
        opacity: 1,
        ease: Power2.easeOut
    });

    $charmeleon.addClass('background--light-menu');

    navIsOpen = true;
}

$navToggle.on('touchstart click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!navIsOpen) {
        showMenu();
    } else {
        hideMenu();
    }
});

function navigationInit() {

    $navigation.on('touchstart', function (e) {
        e.stopPropagation();
    });

    $('html').on('touchstart', function () {
        if (navIsOpen) {
            hideMenu();
        }
    });

    $navigation.on('mouseleave', function () {
        setTimeout(hideMenu, 300);
    });

    $window.on('djaxClick', function (e, item) {
        hideMenu();
    });

    function showCartWidget() {
        $('.cart-widget-details').addClass('is-visible');
    }

    function hideCartWidget() {
        $('.cart-widget-details').removeClass('is-visible');
    }

    $('.cart-widget').hoverIntent({
        over: showCartWidget,
        out: hideCartWidget,
        timeout: 300
    });

    // touch menus
    $('.touch .sub-menu-toggle').on('touchstart', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(this);

        $this.toggleClass('is-toggled');
        $this.closest('.menu-item').children('ul').fadeToggle();
    });

}