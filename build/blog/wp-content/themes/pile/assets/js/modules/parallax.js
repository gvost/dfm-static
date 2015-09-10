/* --- Parallax Init --- */

window.Parallax = {
	pileItems: null,
	hero: null,

	initialize: function () {
		if (globalDebug) {
			console.group("parallax::initialize");
		}

		this.prepare();
		this.update();

		if (globalDebug) {
			console.groupEnd();
		}
	},

	prepare: function () {
		if (globalDebug) {
			console.group("parallax::prepare");
		}

		var that            = this,
            $pileItems      = $('.pile-item--archive'),
			$hero           = $('.hero-bg--image, .hero-slider'),
			parallaxAmount  = parseInt($('body').data('parallax'), 10) / 100,
            data            = [['toTop', 'finalTop', 'toBottom', 'finalBottom']],
            $content        = $('.site-content'),
            top             = 0,
            bottom          = $document.height(),
            maxMissingTop   = 0,
            maxMissingBtm   = 0,
            isJournal       = !!$('.site-content--journal').length;

        if (isJournal) {
            parallaxAmount = 0.35;
        }

        $content.css({
            'padding-top': '',
            'padding-bottom': ''
        });

		bottom = $document.height();

        $pileItems.each(function (i, element) {

            TweenMax.to($(element), 0, {y: 0});

            var $item           = $(element),
                itemTop         = $item.offset().top,
                itemHeight      = $item.outerHeight(),
                toTop           = itemTop + itemHeight/2 - top,
                toBottom        = bottom - itemTop - itemHeight/2,
                missingTop      = toTop < windowHeight/2 ? windowHeight/2 - toTop : 0,
                missingBottom   = toBottom < windowHeight/2 ? windowHeight/2 - toBottom : 0;

            maxMissingTop   = Math.max(missingTop, maxMissingTop);
            maxMissingBtm   = Math.max(missingBottom, maxMissingBtm);
        });

        $content.css({
            'padding-top': '+=' + maxMissingTop,
            'padding-bottom': '+=' + maxMissingBtm
        });

		$pileItems.each(function (i, element) {

			var $item           = $(element),
                itemTop         = $item.offset().top,
				itemHeight      = $item.outerHeight(),
				parallaxInfo    = {
					start       : itemTop - windowHeight,
					end         : itemTop + itemHeight
				},
				initialTop      = (windowHeight - itemHeight) * parallaxAmount,
				finalTop        = -1 * initialTop,
				timeline        = new TimelineMax({paused: true});

            if ( (isJournal && !(i % 2)) || (!isJournal && parseInt($item.find('.pile-item-even-spacing').css('paddingRight'))) ) {
                initialTop += windowHeight * parallaxAmount / 2;
                finalTop    = -1 * initialTop;
            }

			timeline.fromTo($item, 1, {
				y: initialTop
			}, {
                y: finalTop,
                ease: Linear.easeNone,
                force3D: true
            });

			parallaxInfo.timeline = timeline;
			// bind sensible variables for tweening to the image using a data attribute
			$item.data('parallax', parallaxInfo);

		});

		$hero.each(function (i, element) {

            TweenMax.to($(element), 0, {y: 0});

            var $item           = $(element),
                parallaxInfo    = {
					start       : 0,
					end         : windowHeight
				},
                heroHeight      = $item.closest('#djaxHero').outerHeight(),
				timeline        = new TimelineMax({paused: true});

            if ($item.hasClass('hero-bg--image')) {

                $item.removeAttr("style");

                var $container  = $item.closest('#djaxHero'),
                    width       = $item.outerWidth(),
                    scaleX      = windowWidth / width + 2/width,
                    height      = $item.outerHeight(),
                    scaleY      = heroHeight / height + 2/height,
                    scale       = Math.max(scaleX, scaleY),
                    newWidth    = width * scale,
                    newHeight   = height * scale,
                    adminBarFix = 0;

                if ($('#wpadminbar').length) {
                    adminBarFix = $('#wpadminbar').outerHeight();
                }

                TweenMax.to($item, 0, {
                    left: windowWidth/2 - newWidth/2,
                    top: heroHeight/2 - newHeight/2,
                    'margin-top': adminBarFix,
                    width: newWidth,
                    height: newHeight
                });

                $container.imagesLoaded(function () {
                    TweenMax.to($item, .3, {
						opacity: 1,
						onComplete: function () {
							bgCheckInit();
						}
					});
                });

            }

			// create timeline for current image
			timeline.to($item, 1, {
				y: '-=' + windowHeight / 2,
				ease: Linear.easeNone,
				force3D: true,
                overwrite: "all"
			});

			parallaxInfo.timeline = timeline;

			// bind sensible variables for tweening to the image using a data attribute
			$item.data('parallax', parallaxInfo);

		});

		if (globalDebug) {
			console.groupEnd();
		}
	},

	update: function () {
		updateItemsProgress($('.pile-item--archive'));
		updateItemsProgress($('.hero-bg--image, .hero-slider'));
	}

};


function setProgress(start, end, timeline) {

	if (end - start == 0) {
		return;
	}

	var progress = (1 / (end - start)) * (latestKnownScrollY - start);

	if (0 > progress) {
		timeline.progress(0);
		return;
	}

	if (1 < progress) {
		timeline.progress(1);
		return;
	}

    timeline.progress(progress);

}


function updateItemsProgress(items) {

	if (!items.length) {
		return;
	}

	items.each(function (i, element) {

		var options = $(element).data('parallax');

		// some sanity check
		// we wouldn't want to divide by 0 - the Universe might come to an end
		if (!empty(options)) {
			setProgress(options.start, options.end, options.timeline);
		}

	});

}