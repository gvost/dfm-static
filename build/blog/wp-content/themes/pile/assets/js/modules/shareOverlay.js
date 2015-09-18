function bindShareClick() {
    var tl              = new TimelineLite({ paused: true }),
        elements        = $(".share-icons > li"),
        randomGap       = .4;

    tl.to($('.overlay-share'), 0, {
        'display': 'table'
    });

    tl.to($('.overlay-share'), .2, {
        opacity: 1,
        pointerEvents: 'auto'
    });

    tl.fromTo('.pile-share .separator', .2, {
        opacity: 0
    }, {
        opacity: 1
    }, '-=.1');

    for (var i = 0; i < elements.length; i++) {
        tl.to(elements[i], .3, {
            y: 0,
            opacity: 1,
            ease: Back.easeOut
        }, 0.2 + Math.random() * randomGap);
    }

    $('.js-popup-share').on('click', function (e) {

        TweenMax.to($('.overlay-share'), 0, {
            'display': 'table'
        });

        var $destination    = $('.js-share-destination'),
            $source         = $('.js-share-source'),
            destinationTop  = $destination.offset().top - latestKnownScrollY,
            sourceTop       = $source.length ? $source.offset().top - latestKnownScrollY : 0;

        e.preventDefault();

        $('body').addClass('scroll-lock');

        if ($source.length) {
            TweenMax.from($destination,.2, {
                y: sourceTop - destinationTop
            }, '-=.5');
        }

        tl.play();
        $(document).on('keyup', bindToEscape);
    });

    $('.share-icons').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    function bindToEscape(e) {
        if (e.keyCode == 27) {
            tl.reverse();
            $(document).off('keyup', bindToEscape);
            $('body').removeClass('scroll-lock');
        }
    }

    $('.overlay-share').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        tl.reverse();
        $(document).off('keyup', bindToEscape);
        $('body').removeClass('scroll-lock');
    });
}