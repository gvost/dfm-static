var AjaxLoading = {
	preparing: false,
	loading: false,

	/**
	 *
	 */
	init: function () {

        if (typeof $body.data('ajaxloading') == "undefined") {
            return;
        }

		var that = this,
			transition = function ($new) {
				var $old = this;

				if (!that.preparing) {
					that.finishTransition($old, $new);
				} else {
					$('html').one('djax:transitionEnd', function () {
						that.finishTransition($old, $new);
					});
				}
			};
		//$('body').djax( {
		//	'selector': '.djax-updatable',
		//	'ignoreClass' : 'djax-ignore',
		//	'exceptions': ['.pdf', '.doc', '.eps', '.png', '.zip', 'admin', 'wp-', 'wp-admin', 'feed', '#', '?lang=', '&lang=', '&add-to-cart=', '?add-to-cart=', '?remove_item'],
		//	'replaceBlockFunction': transition
		//} );
		$('body').djax('.djax-updatable', ['.pdf', '.doc', '.eps', '.png', '.zip', 'admin', 'wp-', 'wp-admin', 'feed', '#', '?lang=', '&lang=', '&add-to-cart=', '?add-to-cart=', '?remove_item'], transition);
		this.bindEvents();

	},


	finishTransition: function ($old, $new) {
		$old.replaceWith($new);

		var that = this,
			$border = $('body > .pile-item-border');

		$('body').imagesLoaded(function () {
			TweenMax.to($border, 0.6, {
				opacity: 0,
				ease: Power1.easeIn,
				onComplete: function () {
					$border.removeAttr('style').hide();
					that.onLoad();
				}
			});
		});
	},


	/**
	 *
	 */
	bindEvents: function () {

		if (globalDebug) {
			console.group("djax::bindEvents");
		}

		var that = this;

		$window.on('djaxClick', function (e, item) {
			if (globalDebug) {
				console.group("djax::onClick");
			}

			var $item = $(item);
			$('.site-navigation').removeClass('is--visible');

			if ($item.hasClass('pile-item-wrap')) {
				that.preparing = true;
				animateProjectBorderOut($item);
			}

			if (globalDebug) {
				console.groupEnd();
			}
		});

		$window.on('djaxLoading', function (e, data) {
			if (globalDebug) {
				console.group("djax::onLoading");
			}
			that.cleanup(data);

			if (!that.preparing) {
				that.preparing = true;
				animateBorderOut();
			}

			if (globalDebug) {
				console.groupEnd();
			}
		});

		$window.on('djaxLoad', function (e, data) {
			if (globalDebug) {
				console.group("djax::onLoad");
			}
			gmapInit();
			// get data and replace the body tag with a nobody tag
			// because jquery strips the body tag when creating objects from data
			data = data.response.replace(/(<\/?)body( .+?)?>/gi, '$1NOTBODY$2>', data);
			// get the nobody tag's classes
			var nobodyClass = $(data).filter('notbody').attr("class");
			// set it to current body tag
			if (!that.preparing) {

				if ($body.hasClass('error404')) {
					$body.css('backgroundImage', '');
				}
				$body.attr('class', nobodyClass);

			} else {
				$('html').one('djax:transitionEnd', function () {
					if ($body.hasClass('error404')) {
						$body.css('backgroundImage', '');
					}
					$body.attr('class', nobodyClass);
				});
			}

			//need to get the id and edit string from the data attributes
			var curPostID = $(data).filter('notbody').data("curpostid"),
				curPostTax = $(data).filter('notbody').data("curtaxonomy"),
				curPostEditString = $(data).filter('notbody').data("curpostedit");

			adminBarEditFix(curPostID, curPostEditString, curPostTax);

			if (globalDebug) {
				console.groupEnd();
			}
		});

		if (globalDebug) {
			console.groupEnd();
		}
	},


	/**
	 *
	 */
	cleanup: function (data) {
		if (globalDebug) {
			console.group("djax::cleanup");
		}

		cleanupBeforeDJax(data);

		if (globalDebug) {
			console.groupEnd();
		}
	},

	onLoad: function () {
		loadUp();
		eventHandlers();
		// there are some things that should happen only when loading a page with dJax, not in the first "normal" loadUp
		loadUpDJaxOnly();
	}
};


function animateBorderOut() {

    if (globalDebug) {
        console.log("djax::borderOut");
    }

	var $border = $('body > .pile-item-border'),
		borderX = windowWidth / 2,
		borderY = windowHeight / 2;

	$border.css({
		top: 0,
		left: 0,
		scale: 1,
		width: windowWidth,
		height: windowHeight,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
		borderColor: 'white',
		display: 'block'
	});

	TweenMax.to($border, 0.3, {
        borderTopWidth: borderY,
        borderBottomWidth: borderY,
        borderRightWidth: borderX,
        borderLeftWidth: borderX,
		onComplete: onTransitionEnd
	});

}

function animateProjectBorderOut($item) {

    if (globalDebug) {
        console.log("djax::projectBorderOut");
    }

	var offset = $item.offset(),
		itemWidth = $item.outerWidth(),
		itemHeight = $item.outerHeight(),
		borderX = (itemWidth + 1) % 2 ? (itemWidth + 1) / 2 : itemWidth / 2 + 1,
		borderY = (itemHeight + 1) % 2 ? (itemHeight + 1) / 2 : itemHeight / 2 + 1,
		scaleX = windowWidth / itemWidth,
		scaleY = windowHeight / itemHeight,
		borderColor = $item.find('.pile-item-border').css('borderTopColor'),
		moveX = windowWidth / 2 - offset.left - itemWidth / 2,
		moveY = windowHeight / 2 - (offset.top - latestKnownScrollY) - itemHeight / 2,
		$clone = $('body > .pile-item-border');

	$clone.css({
		display: 'block',
		top: offset.top - latestKnownScrollY - 1,
		left: offset.left - 1,
		width: itemWidth + 2,
		height: itemHeight + 2,
		borderColor: borderColor
	});

	var timeline = new TimelineMax({
		paused: true,
		onComplete: onTransitionEnd
	});

	timeline.to($clone, .6, {
        borderTopWidth: borderY,
        borderBottomWidth: borderY,
        borderRightWidth: borderX,
        borderLeftWidth: borderX,
		'ease': Power3.easeOut,

		onComplete: function () {
			$clone.css('backgroundColor', $clone.css('borderTopColor'));
		}
	});

	timeline.fromTo($clone, .2, {
		x: 0,
		y: 0,
		scaleX: 1,
		scaleY: 1
	}, {
		x: moveX,
		y: moveY,
		scaleX: scaleX,
		scaleY: scaleY,
		ease: Power3.easeInOut
	});

	timeline.play();
}

function onTransitionEnd() {
	$('html, body').scrollTop(0);
	AjaxLoading.preparing = false;
	$('html').trigger('djax:transitionEnd');
}