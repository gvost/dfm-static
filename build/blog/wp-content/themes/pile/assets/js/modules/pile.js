var Pile = {

    initialize: function () {
        if (globalDebug) {
            console.group("pile::initialize");
        }

        $('.pile-item').each(function (i, item) {

            var $item       = $(item),
                itemOffset  = $item.offset(),
                itemHeight  = $item.outerHeight(),
                stickTop    = itemOffset.top - windowHeight,
                delay       = Math.random() * 0.5,
                timeline    = new TimelineMax({paused: true}),
                callback    = function() {},
                isArchive   = $item.hasClass('pile-item--archive');

            if (isArchive) {
                callback = function () {
                    $item.removeData('timeline');
                }
            }

            timeline.fromTo($item, 0.35, {
                y:          '+=' + 150,
                opacity:    0
            }, {
                y:          '-=' + 150,
                opacity:    1,
                delay:      delay,
                force3D:    true,
                ease:       Power1.easeOut,
                onComplete: callback
            });

            if (isArchive || latestKnownScrollY > stickTop) {
                setTimeout(function () {
                    timeline.play();
                }, delay);
            }

            if (!isArchive) {
                $item.data('pile', timeline);
            }

            $item.data('stickTop', stickTop);

        });

        if (globalDebug) {
            console.groupEnd();
        }
    },

	refresh: function () {
        if (globalDebug) {
            console.group("pile::prepare");
        }

        $('.pile-item').each(function (i, item) {
            var $item       = $(item),
                itemOffset  = $item.offset(),
                stickTop    = itemOffset.top - windowHeight;

            $item.data('stickTop', stickTop);
        });

        this.update();

        if (globalDebug) {
            console.groupEnd();
        }
	},

	update: function () {

		$('.pile-item--single').each(function (i, item) {

			var $item       = $(item),
				itemHeight  = $item.outerHeight(),
				stickTop    = $item.data('stickTop'),
                timeline    = $item.data('pile');

            if (typeof timeline == "undefined") {
                return;
            }

            if (0 != timeline.progress() && 'up' == scrollDirection && latestKnownScrollY <= stickTop + itemHeight / 2) {
                timeline.reverse();
                return;
            }

            if (1 != timeline.progress() && 'down' == scrollDirection && latestKnownScrollY > stickTop) {
                timeline.play();
            }

		});

	}

};