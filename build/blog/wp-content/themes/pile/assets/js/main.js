/* ====== SHARED VARS ====== */

var ua                  = navigator.userAgent,
    isiPhone            = false,
    isiPod              = false,
    isAndroidPhone      = false,
    android             = false,
    iOS                 = false,
    isIE                = false,
    ieMobile            = false,
    isSafari            = false,
    isMac               = false,
    // useful logs in the console
    globalDebug         = false;

(function ($, window, undefined) {
	"use strict";

/* --- 404 Page --- */
var gifImages = [
	"http://cdn.makeagif.com/media/9-04-2014/LqSsUg.gif"
];

function getGif() {
	return gifImages[Math.floor(Math.random() * gifImages.length)];
}

function changeBackground() {
	$('.error404').css('background-image', 'url(' + getGif() + ')');
}

$(window).on('load', function () {
	if ($('.error404').length) {
		changeBackground();
	}
});

$(window).keydown(function (e) {
	if (e.keyCode == 32) {
		changeBackground();
	}
});
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
function copyrightOverlayAnimation(direction, x, y){
    switch (direction){
        case 'in':{
            if (globalDebug) {timestamp = ' [' + Date.now() + ']';console.log("Animate Copyright Overlay - IN"+timestamp);}

            TweenMax.fromTo($('.copyright-overlay'), 0.1, {opacity: 0, scale: 0.7}, {opacity: 1, scale: 1,
                onStart: function(){
                    $('.copyright-overlay').css({top: y, left: x});
                    $('body').addClass('is--active-copyright-overlay');
                }
            });

            break;
        }

        case 'out':{
            if (globalDebug) {timestamp = ' [' + Date.now() + ']';console.log("Animate Copyright Overlay - OUT"+timestamp);}

            TweenMax.fromTo($('.copyright-overlay'), 0.1, {opacity: 1, scale: 1}, {opacity: 0, scale: 0.7,
                onComplete: function(){
                    $('body').removeClass('is--active-copyright-overlay');
                }
            });

            break;
        }

        default: break;
    }
}

function copyrightOverlayInit(){
    $(document).on('contextmenu', '.entry__featured-image, .hero, .entry-content img, .pile-item img, .mfp-img', function(e){
        if( !empty($('.copyright-overlay'))){
            e.preventDefault();
            e.stopPropagation();

            copyrightOverlayAnimation('in', e.clientX, event.clientY);
        }
    });

    $(document).on('mousedown', function(){
        if($('body').hasClass('is--active-copyright-overlay'))
            copyrightOverlayAnimation('out');
    });
}
/* --- GMAP Init --- */

window.gmapInit = function () {

	var $gmap = $('#gmap');

	if ($gmap.length && typeof google !== 'undefined') {
		if (globalDebug) {
			console.log("GMap Init");
		}

		var gmap_link, gmap_variables, gmap_zoom, gmap_style;
		gmap_link = $gmap.data('url');
		gmap_style = typeof $gmap.data('customstyle') !== "undefined" ? "style1" : google.maps.MapTypeId.ROADMAP;
		var gmap_markercontent = $gmap.data('markercontent');

		// Overwrite Math.log to accept a second optional parameter as base for logarhitm
		Math.log = (function () {
			var log = Math.log;
			return function (n, base) {
				return log(n) / (base ? log(base) : 1);
			};
		})();

		var get_url_parameter = function (needed_param, gmap_url) {
			var sURLVariables = (gmap_url.split('?'))[1];
			if (typeof sURLVariables === "undefined") {
				return sURLVariables;
			}
			sURLVariables = sURLVariables.split('&');
			for (var i = 0; i < sURLVariables.length; i++) {
				var sParameterName = sURLVariables[i].split('=');
				if (sParameterName[0] == needed_param) {
					return sParameterName[1];
				}
			}
		};

		var gmap_coordinates = [],
			gmap_zoom;

		if (gmap_link) {
			//Parse the URL and load variables (ll = latitude/longitude; z = zoom)
			var gmap_variables = get_url_parameter('ll', gmap_link);
			if (typeof gmap_variables === "undefined") {
				gmap_variables = get_url_parameter('sll', gmap_link);
			}
			// if gmap_variables is still undefined that means the url was pasted from the new version of google maps
			if (typeof gmap_variables === "undefined") {

				if (gmap_link.split('!3d') != gmap_link) {
					//new google maps old link type

					var split, lt, ln, dist, z;
					split = gmap_link.split('!3d');
					lt = split[1];
					split = split[0].split('!2d');
					ln = split[1];
					split = split[0].split('!1d');
					dist = split[1];
					gmap_zoom = 21 - Math.round(Math.log(Math.round(dist / 218), 2));
					gmap_coordinates = [lt, ln];

				} else {
					//new google maps new link type

					var gmap_link_l;

					gmap_link_l = gmap_link.split('@')[1];
					gmap_link_l = gmap_link_l.split('z/')[0];

					gmap_link_l = gmap_link_l.split(',');

					var latitude = gmap_link_l[0];
					var longitude = gmap_link_l[1];
					var zoom = gmap_link_l[2];

					if (zoom.indexOf('z') >= 0)
						zoom = zoom.substring(0, zoom.length - 1);

					gmap_coordinates[0] = latitude;
					gmap_coordinates[1] = longitude;
					gmap_zoom = zoom;
				}


			} else {
				gmap_zoom = get_url_parameter('z', gmap_link);
				if (typeof gmap_zoom === "undefined") {
					gmap_zoom = 10;
				}
				gmap_coordinates = gmap_variables.split(',');
			}
		}

		$gmap.gmap3({
			map: {
				options: {
					center: new google.maps.LatLng(gmap_coordinates[0], gmap_coordinates[1]),
					zoom: parseInt(gmap_zoom),
					mapTypeId: gmap_style,
					mapTypeControlOptions: {mapTypeIds: []},
					scrollwheel: false
				}
			},
			overlay: {
				latLng: new google.maps.LatLng(gmap_coordinates[0], gmap_coordinates[1]),
				options: {
					content: '<div class="map__marker-wrap">' +
					'<div class="map__marker">' +
					gmap_markercontent +
					'</div>' +
					'</div>'
				}
			},
			styledmaptype: {
				id: "style1",
				options: {
					name: "Style 1"
				},
				styles: [
					{
						"stylers": [
							{"saturation": -100},
							{"gamma": 2.45},
							{"visibility": "simplified"}
						]
					}, {
						"featureType": "road",
						"stylers": [
							{"hue": $("body").data("color") ? $("body").data("color") : "#ffaa00"},
							{"saturation": 48},
							{"gamma": 0.40},
							{"visibility": "on"}
						]
					}, {
						"featureType": "administrative",
						"stylers": [
							{"visibility": "on"}
						]
					}
				]
			}
		});
	}
}
/* --- Magnific Popup Initialization --- */

function magnificPopupInit() {
	if (globalDebug) {
		console.log("Magnific Popup - Init");
	}

	$('.js-post-gallery').each(function () { // the containers for all your galleries should have the class gallery
		$(this).magnificPopup({
			delegate: 'a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"]', // the container for each your gallery items
			type: 'image',
			closeOnContentClick: false,
			closeBtnInside: false,
			removalDelay: 500,
			mainClass: 'mfp-fade',
			image: {
				markup: '<div class="mfp-figure">' +
				'<div class="mfp-img"></div>' +
				'<div class="mfp-bottom-bar">' +
				'<div class="mfp-title"></div>' +
				'<div class="mfp-counter"></div>' +
				'</div>' +
				'</div>',
				titleSrc: function (item) {
					var output = '';
					if (typeof item.el.attr('data-alt') !== "undefined" && item.el.attr('data-alt') !== "") {
						output += '<small>' + item.el.attr('data-alt') + '</small>';
					}
					return output;
				}
			},
			gallery: {
				enabled: true,
				navigateByImgClick: true
				//arrowMarkup: '<a href="#" class="gallery-arrow gallery-arrow--%dir% control-item arrow-button arrow-button--%dir%">%dir%</a>'
			},
			callbacks: {
				elementParse: function (item) {

					if (this.currItem != undefined) {
						item = this.currItem;
					}

					var output = '';
					if (typeof item.el.attr('data-alt') !== "undefined" && item.el.attr('data-alt') !== "") {
						output += '<small>' + item.el.attr('data-alt') + '</small>';
					}

					$('.mfp-title').html(output);
				},
				change: function (item) {
					var output = '';
					if (typeof item.el.attr('data-alt') !== "undefined" && item.el.attr('data-alt') !== "") {
						output += '<small>' + item.el.attr('data-alt') + '</small>';
					}

					$('.mfp-title').html(output);
				}
			}
		});
	});

	$('.js-gallery').each(function() { // the containers for all your galleries should have the class gallery
		$(this).magnificPopup({
			delegate: '.mfp-image, .mfp-video', // the container for each your gallery items
			mainClass: 'mfp-fade',
			closeOnBgClick: true,
			closeBtnInside: false,
			image: {
				markup:
				'<div class="mfp-figure">' +
					'<div class="mfp-img"></div>' +
					'<div class="mfp-bottom-bar">' +
						'<div class="mfp-title"></div>' +
						'<div class="mfp-counter"></div>' +
					'</div>' +
				'</div>'
			},
			iframe: {
				markup:
				'<div class="mfp-figure">'+
					'<div class="mfp-iframe-scaler">'+
						'<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
					'</div>'+
					'<div class="mfp-bottom-bar">' +
						'<div class="mfp-title mfp-title--video"></div>' +
						'<div class="mfp-counter"></div>' +
					'</div>' +
				'</div>',
				patterns: {
					youtube: {
						index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).
						id: function(url){
							var video_id = url.split('v=')[1];
							var ampersandPosition = video_id.indexOf('&');
							if(ampersandPosition != -1) {
								video_id = video_id.substring(0, ampersandPosition);
							}

							return video_id;
						}, // String that splits URL in a two parts, second part should be %id%
						// Or null - full URL will be returned
						// Or a function that should return %id%, for example:
						// id: function(url) { return 'parsed id'; }
						src: '//www.youtube.com/embed/%id%' // URL that will be set as a source for iframe.
					},
					youtu_be: {
						index: 'youtu.be/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).
						id: '.be/', // String that splits URL in a two parts, second part should be %id%
						// Or null - full URL will be returned
						// Or a function that should return %id%, for example:
						// id: function(url) { return 'parsed id'; }
						src: '//www.youtube.com/embed/%id%' // URL that will be set as a source for iframe.
					},

					vimeo: {
						index: 'vimeo.com/',
						id: '/',
						src: '//player.vimeo.com/video/%id%'
					},
					gmaps: {
						index: '//maps.google.',
						src: '%id%&output=embed'
					}
					// you may add here more sources
				},
				srcAction: 'iframe_src' // Templating object key. First part defines CSS selector, second attribute. "iframe_src" means: find "iframe" and set attribute "src".
			},
			gallery:{
				enabled:true,
				navigateByImgClick: true
			},
			callbacks:{
				change: function(item){
					$(this.content).find('iframe').each(function(){
						var url = $(this).attr("src");
						$(this).attr("src", setQueryParameter(url, "wmode", "transparent"));
					});
				},
				elementParse: function(item) {
					if (globalDebug) {console.log("Magnific Popup - Parse Element");}

					$(item).find('iframe').each(function(){
						var url = $(this).attr("src");
						$(this).attr("src", url+"?wmode=transparent");
					});
				},
				markupParse: function(template, values, item) {
					values.title = '<span class="title">' + item.el.attr('data-title') + '</span>' + '<span class="description">' + item.el.attr('data-caption') + '</span>';
				}
			}
		});
	});

}

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
function niceScrollInit() {

    var smoothScroll = $('body').data('smoothscrolling') !== undefined;

    if (smoothScroll && !Modernizr.touch && !ieMobile && !iOS && !isMac) {

        var $window = $window || $(window);		// Window object

        $window.on("mousewheel DOMMouseScroll", function(event) {

            var scrollTo,
                scrollDistance  = 400,
                delta;

            if (event.type == 'mousewheel') {
                delta    = event.originalEvent.wheelDelta / 120;
            }
            else if (event.type == 'DOMMouseScroll') {
                delta    = - event.originalEvent.detail / 3;
            }

            scrollTo = latestKnownScrollY - delta * scrollDistance;

            if (scrollTo) {

                event.preventDefault();

                TweenMax.to($window, .6, {
                    scrollTo: {
                        y:          scrollTo,
                        autoKill:   true
                    },
                    ease:           Power1.easeOut,	// For more easing functions see http://api.greensock.com/js/com/greensock/easing/package-detail.html
                    autoKill:       true,
                    overwrite:      5
                });

            }

        });

    }

}

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
// Platform Detection
function getIOSVersion(ua) {
    ua = ua || navigator.userAgent;
    return parseFloat(
        ('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(ua) || [0,''])[1])
            .replace('undefined', '3_2').replace('_', '.').replace('_', '')
    ) || false;
}

function getAndroidVersion(ua) {
    var matches;
    ua = ua || navigator.userAgent;
    matches = ua.match(/[A|a]ndroid\s([0-9\.]*)/);
    return matches ? matches[1] : false;
}

function platformDetect() {

    var navUA           = navigator.userAgent.toLowerCase(),
        navPlat         = navigator.platform.toLowerCase();

    isiPhone        = navPlat.indexOf("iphone");
    isiPod          = navPlat.indexOf("ipod");
    isAndroidPhone  = navPlat.indexOf("android");
    isSafari        = navUA.indexOf('safari') != -1 && navUA.indexOf('chrome') == -1;
    isIE            = typeof (is_ie) !== "undefined" || (!(window.ActiveXObject) && "ActiveXObject" in window);
    ieMobile        = ua.match(/Windows Phone/i) ? true : false;
    iOS             = getIOSVersion();
    android         = getAndroidVersion();
    isMac           = navigator.platform.toUpperCase().indexOf('MAC')>=0;

    if (Modernizr.touch) {
        $html.addClass('touch');
    }

    if (iOS && iOS < 8) {
        $html.addClass('no-scroll-fx')
    }

    if (isIE) {
        $html.addClass('is--ie');
    }

    if (ieMobile) {
        $html.addClass('is--ie-mobile')
    }
}
/* --- $VIDEOS --- */

// function used to resize videos to fit their containers by keeping the original aspect ratio
function initVideos() {
    if (globalDebug) {console.group("videos::init");}

    var videos = $('.youtube-player, .entry-media iframe, .entry-media video, .entry-media embed, .entry-media object, iframe[width][height]');

    // Figure out and save aspect ratio for each video
    videos.each(function () {
        $(this).attr('data-aspectRatio', this.width / this.height)
            // and remove the hard coded width/height
            .removeAttr('height')
            .removeAttr('width');
    });

    resizeVideos();

    // Firefox Opacity Video Hack
    $('iframe').each(function () {
        var url = $(this).attr("src");
        if (!empty(url))
            $(this).attr("src", setQueryParameter(url, "wmode", "transparent"));
    });

    if (globalDebug) {console.groupEnd();}
}

function resizeVideos() {
    if (globalDebug) {console.group("videos::resize");}

    var videos = $('.youtube-player, .entry-media iframe, .entry-media video, .entry-media embed, .entry-media object, iframe[data-aspectRatio]');

    videos.each(function () {
        var video = $(this),
            ratio = video.attr('data-aspectRatio'),
            w = video.css('width', '100%').width(),
            h = w / ratio;

        video.height(h);
    });

    if (globalDebug) {console.groupEnd();}
}
/* --- Royal Slider Init --- */

function royalSliderInit($container) {
	$container = typeof $container !== 'undefined' ? $container : $('body');

	// Transform Wordpress Galleries to Sliders
	$container.find('.wp-gallery').each(function () {
		sliderMarkupGallery($(this));
	});

	// Find and initialize each slider
	$container.find('.js-pixslider').each(function () {

		sliderInit($(this));

		var slider 				= $(this).data('royalSlider');

		if (!slider.slides.length) {
			return;
		}

		var firstSlide 			= slider.slides[0],
			firstSlideContent 	= $(firstSlide.content),
			$video 				= firstSlideContent.hasClass('video') ? firstSlideContent : firstSlideContent.find('.video'),
			firstSlideAutoPlay 	= typeof $video.data('video_autoplay') !== "undefined";

		if ( firstSlideAutoPlay || ieMobile || iOS || android ) {
			firstSlide.holder.on('rsAfterContentSet', function () {
				slider.playVideo();
			});
		}

		// Bind backgroundCheck refresh to desired slider events
		slider.ev.on('rsAfterContentSet rsAfterSlideChange', function () {
			bgCheckInit();
		});

		slider.ev.on('rsBeforeAnimStart', function(event) {
			slider.stopVideo();
		});

		// auto play video sliders if is set so
		slider.ev.on('rsAfterSlideChange', function(event) {

			var $slide_content 		= $(slider.currSlide.content),
				$video 				= $slide_content.hasClass('video') ? $slide_content : $slide_content.find('.video'),
				rs_videoAutoPlay 	= typeof $video.data('video_autoplay') !== "undefined";

			if ( rs_videoAutoPlay || ieMobile || iOS || android ) {
				slider.stopVideo();
				slider.playVideo();
			}

		});

		// after destroying a video remove the autoplay class (this way the image gets visible)
		slider.ev.on('rsOnDestroyVideoElement', function(i ,el){

			var $slide_content 		= $( this.currSlide.content),
				$video 				= $slide_content.hasClass('video') ? $slide_content : $slide_content.find('.video');

			$video.removeClass('video_autoplay');

		});

	});

}

/*
 * Slider Initialization
 */
function sliderInit($slider) {
	if (globalDebug) {
		console.log("Royal Slider Init");
	}

	$slider.find('img').removeClass('invisible');

	var $children                   = $(this).children(),
		rs_arrows                   = typeof $slider.data('arrows') !== "undefined",
		rs_bullets                  = typeof $slider.data('bullets') !== "undefined" ? "bullets" : "none",
		rs_autoheight               = typeof $slider.data('autoheight') !== "undefined",
		rs_autoScaleSlider          = false,
		rs_autoScaleSliderWidth     = typeof $slider.data('autoscalesliderwidth') !== "undefined" && $slider.data('autoscalesliderwidth') != '' ? $slider.data('autoscalesliderwidth') : false,
		rs_autoScaleSliderHeight    = typeof $slider.data('autoscalesliderheight') !== "undefined" && $slider.data('autoscalesliderheight') != '' ? $slider.data('autoscalesliderheight') : false,
		rs_customArrows             = typeof $slider.data('customarrows') !== "undefined",
		rs_slidesSpacing            = typeof $slider.data('slidesspacing') !== "undefined" ? parseInt($slider.data('slidesspacing')) : 0,
		rs_keyboardNav              = typeof $slider.data('fullscreen') !== "undefined",
		rs_imageScale               = $slider.data('imagescale'),
		rs_visibleNearby            = typeof $slider.data('visiblenearby') !== "undefined",
		rs_imageAlignCenter         = typeof $slider.data('imagealigncenter') !== "undefined",
		//rs_imageAlignCenter = false,
		rs_transition               = typeof $slider.data('slidertransition') !== "undefined" && $slider.data('slidertransition') != '' ? $slider.data('slidertransition') : 'fade',
		rs_transitionSpeed          = typeof $slider.data('slidertransitionspeed') !== "undefined" && $slider.data('slidertransitionspeed') != '' ? $slider.data('slidertransitionspeed') : 600,
		rs_autoPlay                 = typeof $slider.data('sliderautoplay') !== "undefined",
		rs_delay                    = typeof $slider.data('sliderdelay') !== "undefined" && $slider.data('sliderdelay') != '' ? $slider.data('sliderdelay') : '1000',
		rs_drag                     = true,
		rs_globalCaption            = typeof $slider.data('showcaptions') !== "undefined",
		is_headerSlider             = $slider.hasClass('hero-slider') ? true : false,
		hoverArrows                 = typeof $slider.data('hoverarrows') !== "undefined";

	if (rs_autoheight) {
		rs_autoScaleSlider = false;
	} else {
		rs_autoScaleSlider = true;
	}

	// Single slide case
	if ($children.length == 1) {
		rs_arrows = false;
		rs_bullets = 'none';
		rs_keyboardNav = false;
		rs_drag = false;
		rs_transition = 'fade';
		rs_customArrows = false;
	}

	// make sure default arrows won't appear if customArrows is set
	if (rs_customArrows) rs_arrows = false;

	//the main params for Royal Slider
	var royalSliderParams = {
		autoHeight: rs_autoheight,
		autoScaleSlider: rs_autoScaleSlider,
		loop: true,
		autoScaleSliderWidth: rs_autoScaleSliderWidth,
		autoScaleSliderHeight: rs_autoScaleSliderHeight,
		imageScaleMode: rs_imageScale,
		imageAlignCenter: rs_imageAlignCenter,
		slidesSpacing: rs_slidesSpacing,
		arrowsNav: rs_arrows,
		controlNavigation: rs_bullets,
		keyboardNavEnabled: rs_keyboardNav,
		arrowsNavAutoHide: false,
		sliderDrag: rs_drag,
		transitionType: rs_transition,
		transitionSpeed: rs_transitionSpeed,
		imageScalePadding: 0,
		autoPlay: {
			enabled: rs_autoPlay,
			stopAtAction: true,
			pauseOnHover: true,
			delay: rs_delay
		},
		globalCaption: rs_globalCaption,
		numImagesToPreload: 2
	};

	if (rs_visibleNearby) {
		royalSliderParams['visibleNearby'] = {
			enabled: true,
			//centerArea: 0.8,
			center: true,
			breakpoint: 0,
			//breakpointCenterArea: 0.64,
			navigateByCenterClick: false
		}
	}

	//lets fire it up
	$slider.royalSlider(royalSliderParams);

	var royalSlider = $slider.data('royalSlider' ),
		slidesNumber = royalSlider.numSlides;

	// create the markup for the customArrows
	//don't need it if we have only one slide
	if (royalSlider && rs_customArrows && slidesNumber > 1 ) {

		var classes = '';

		if (is_headerSlider) classes = 'slider-arrows-header';
		if (hoverArrows && !Modernizr.touch) classes += ' arrows--hover ';

		var $gallery_control = $(
			'<div class="' + classes + '">' +
			'<div class="rsArrow rsArrowLeft js-arrow-left" style="display: block;"><div class="rsArrowIcn"></div></div>' +
			'<div class="rsArrow rsArrowRight js-arrow-right" style="display: block;"><div class="rsArrowIcn"></div></div>' +
			'</div>'
		);

		if ($slider.data('customarrows') == "left") {
			$gallery_control.addClass('gallery-control--left');
		}

		$gallery_control.insertBefore($slider);

		$gallery_control.on('click', '.js-arrow-left', function (event) {
			event.preventDefault();
			royalSlider.prev();
		});

		$gallery_control.on('click', '.js-arrow-right', function (event) {
			event.preventDefault();
			royalSlider.next();
		});

		if (hoverArrows && !Modernizr.touch) {
			hoverArrow( $('.slider-arrows-header .rsArrow') );
		}

		$slider.parent().children('.slider-arrows-header').addClass('slider-arrows--loaded');
	}

	if (slidesNumber == 1) {
		$slider.addClass('single-slide');
	}

	$slider.addClass('slider--loaded');
}

/*
 * Wordpress Galleries to Sliders
 * Create the markup for the slider from the gallery shortcode
 * take all the images and insert them in the .gallery <div>
 */
function sliderMarkupGallery($gallery) {
	var $old_gallery = $gallery,
		gallery_data = $gallery.data(),
		$images = $old_gallery.find('img'),
		$new_gallery = $('<div class="pixslider js-pixslider">');

	$images.prependTo($new_gallery).addClass('rsImg');

	//add the data attributes
	$.each(gallery_data, function (key, value) {
		$new_gallery.attr('data-' + key, value);
	})

	$old_gallery.replaceWith($new_gallery);
}

/*
 Get slider arrows to hover, following the cursor
 */

function hoverArrow($arrow) {
	var $mouseX = 0, $mouseY = 0;
	var $arrowH = 35, $arrowW = 35;

	$arrow.mouseenter(function (e) {
		$(this).addClass('visible');

		moveArrow($(this));
	});

	var $loop;

	function moveArrow($arrow) {
		var $mouseX;
		var $mouseY;

		$arrow.mousemove(function (e) {
			$mouseX = e.pageX - $arrow.offset().left - 40;
			$mouseY = e.pageY - $arrow.offset().top - 40;

			var $arrowIcn = $arrow.find('.rsArrowIcn');
			TweenMax.to($arrowIcn, 0, {x: $mouseX, y: $mouseY, z: 0.01});
		});

		$arrow.mouseleave(function (e) {
			$(this).removeClass('visible').removeClass('is--scrolled');
			clearInterval($loop);
		});

		$(window).scroll(function() {
			if($arrow.hasClass('visible')){

				$arrow.addClass('is--scrolled');

				clearTimeout($.data(this, 'scrollTimer'));
				$.data(this, 'scrollTimer', setTimeout(function() {
					$arrow.removeClass('is--scrolled');
				}, 100));
			}
		});
	}
}
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
(function ($, sr) {

    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            };

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 200);
        };
    };

    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery, 'smartresize');
function smoothScrollTo(y, speed) {

    speed = typeof speed == "undefined" ? 1 : speed;

    var distance = Math.abs(latestKnownScrollY - y),
        time     = speed * distance / 2000;

    TweenMax.to($(window), time, {scrollTo: {y: y, autoKill: true, ease: Quint.easeInOut}});
}
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
// here we change the link of the Edit button in the Admin Bar
// to make sure it reflects the current page
function adminBarEditFix(id, editString, taxonomy) {
	//get the admin ajax url and clean it
	var baseEditURL = ajaxurl.replace('admin-ajax.php','post.php'),
		baseExitTaxURL = ajaxurl.replace('admin-ajax.php','edit-tags.php'),
		$editButton = $('#wp-admin-bar-edit a');

	if ( !empty($editButton) ) {
		if ( id !== undefined && editString !== undefined ) { //modify the current Edit button
			if (!empty(taxonomy)) { //it seems we need to edit a taxonomy
				$editButton.attr('href', baseExitTaxURL + '?tag_ID=' + id + '&taxonomy=' + taxonomy + '&action=edit');
			} else {
				$editButton.attr('href', baseEditURL + '?post=' + id + '&action=edit');
			}
			$editButton.html(editString);
		} else { //we have found an edit button but right now we don't need it anymore since we have no id
			$('#wp-admin-bar-edit').remove();
		}
	} else { //upss ... no edit button
		//lets see if we need one
		if ( id !== undefined && editString !== undefined ) { //we do need one after all
			//locate the New button because we need to add stuff after it
			var $newButton = $('#wp-admin-bar-new-content');

			if (!empty($newButton)) {
				if (!empty(taxonomy)) { //it seems we need to generate a taxonomy edit thingy
					$newButton.after('<li id="wp-admin-bar-edit"><a class="ab-item dJAX_internal" href="' + baseExitTaxURL + '?tag_ID=' + id + '&taxonomy=' + taxonomy + '&action=edit">' + editString + '</a></li>');
				} else { //just a regular edit
					$newButton.after('<li id="wp-admin-bar-edit"><a class="ab-item dJAX_internal" href="' + baseEditURL + '?post=' + id + '&action=edit">' + editString + '</a></li>');
				}
			}
		}
	}
}

/* --- Load AddThis Async --- */
function loadAddThisScript() {
	if (window.addthis) {
		if (globalDebug) {console.log("addthis::Load Script");}
		// Listen for the ready event
		addthis.addEventListener('addthis.ready', addthisReady);
		addthis.init();
	}
}

/* --- AddThis On Ready - The API is fully loaded --- */
//only fire this the first time we load the AddThis API - even when using ajax
function addthisReady() {
	if (globalDebug) {console.log("addthis::Ready");}
	addThisInit();
}

/* --- AddThis Init --- */
function addThisInit() {
	if (window.addthis) {
		if (globalDebug) {console.log("addthis::Toolbox INIT");}

		addthis.toolbox('.addthis_toolbox');
	}
}

/* --- Do all the cleanup that is needed when going to another page with dJax --- */
function cleanupBeforeDJax() {
	if (globalDebug) {console.group("djax::Cleanup Before dJax");}

	/* --- KILL ROYALSLIDER ---*/
	var sliders = $('.js-pixslider');
	if (!empty(sliders)) {
		sliders.each(function() {
			var slider = $(this).data('royalSlider');
			if (!empty(slider)) {
				slider.destroy();
			}
		});
	}

	/* --- KILL MAGNIFIC POPUP ---*/
	//when hitting back or forward we need to make sure that there is no rezidual Magnific Popup
	$.magnificPopup.close(); // Close popup that is currently opened (shorthand)

    if (globalDebug) {console.groupEnd();}

}

function loadUpDJaxOnly(data) {
	if (globalDebug) {console.group("djax::loadup - dJaxOnly");}

	//reevaluate PictureFill if present
	if (typeof picturefill == 'function') {
		picturefill();
	}

	//fire the AddThis reinitialization separate from loadUp()
	//because on normal load we want to fire it only after the API is fully loaded - addthisReady()
	addThisInit();

    //bgCheckInit();

	//find and initialize Tiled Galleries via Jetpack
	if ( typeof tiledGalleries !== "undefined" ) {
		if (globalDebug) {console.log("Find and setup new galleries - Jetpack");}
		tiledGalleries.findAndSetupNewGalleries();
	}

	//lets do some Google Analytics Tracking
	if (window._gaq) {
		_gaq.push(['_trackPageview']);
	}

	if (globalDebug) {console.groupEnd();}
}
})(jQuery, window);
/*!
 * VERSION: 1.12.1
 * DATE: 2014-06-26
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * Includes all of the following: TweenLite, TweenMax, TimelineLite, TimelineMax, EasePack, CSSPlugin, RoundPropsPlugin, BezierPlugin, AttrPlugin, DirectionalRotationPlugin
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue || (window._gsQueue = [])).push(function () {
	"use strict";
	window._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (t, e, i) {
		var s = [].slice, r = function (t, e, s) {
			i.call(this, t, e, s), this._cycle = 0, this._yoyo = this.vars.yoyo === !0, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._dirty = !0, this.render = r.prototype.render
		}, n = 1e-10, a = i._internals, o = a.isSelector, h = a.isArray, l = r.prototype = i.to({}, .1, {}), _ = [];
		r.version = "1.12.1", l.constructor = r, l.kill()._gc = !1, r.killTweensOf = r.killDelayedCallsTo = i.killTweensOf, r.getTweensOf = i.getTweensOf, r.lagSmoothing = i.lagSmoothing, r.ticker = i.ticker, r.render = i.render, l.invalidate = function () {
			return this._yoyo = this.vars.yoyo === !0, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._uncache(!0), i.prototype.invalidate.call(this)
		}, l.updateTo = function (t, e) {
			var s, r = this.ratio;
			e && this._startTime < this._timeline._time && (this._startTime = this._timeline._time, this._uncache(!1), this._gc ? this._enabled(!0, !1) : this._timeline.insert(this, this._startTime - this._delay));
			for (s in t)this.vars[s] = t[s];
			if (this._initted)if (e)this._initted = !1; else if (this._gc && this._enabled(!0, !1), this._notifyPluginsOfEnabled && this._firstPT && i._onPluginEvent("_onDisable", this), this._time / this._duration > .998) {
				var n = this._time;
				this.render(0, !0, !1), this._initted = !1, this.render(n, !0, !1)
			} else if (this._time > 0) {
				this._initted = !1, this._init();
				for (var a, o = 1 / (1 - r), h = this._firstPT; h;)a = h.s + h.c, h.c *= o, h.s = a - h.c, h = h._next
			}
			return this
		}, l.render = function (t, e, i) {
			this._initted || 0 === this._duration && this.vars.repeat && this.invalidate();
			var s, r, o, h, l, u, p, f, c = this._dirty ? this.totalDuration() : this._totalDuration, m = this._time, d = this._totalTime, g = this._cycle, v = this._duration, y = this._rawPrevTime;
			if (t >= c ? (this._totalTime = c, this._cycle = this._repeat, this._yoyo && 0 !== (1 & this._cycle) ? (this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0) : (this._time = v, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1), this._reversed || (s = !0, r = "onComplete"), 0 === v && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0), (0 === t || 0 > y || y === n) && y !== t && (i = !0, y > n && (r = "onReverseComplete")), this._rawPrevTime = f = !e || t || y === t ? t : n)) : 1e-7 > t ? (this._totalTime = this._time = this._cycle = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== d || 0 === v && y > 0 && y !== n) && (r = "onReverseComplete", s = this._reversed), 0 > t ? (this._active = !1, 0 === v && (this._initted || !this.vars.lazy || i) && (y >= 0 && (i = !0), this._rawPrevTime = f = !e || t || y === t ? t : n)) : this._initted || (i = !0)) : (this._totalTime = this._time = t, 0 !== this._repeat && (h = v + this._repeatDelay, this._cycle = this._totalTime / h >> 0, 0 !== this._cycle && this._cycle === this._totalTime / h && this._cycle--, this._time = this._totalTime - this._cycle * h, this._yoyo && 0 !== (1 & this._cycle) && (this._time = v - this._time), this._time > v ? this._time = v : 0 > this._time && (this._time = 0)), this._easeType ? (l = this._time / v, u = this._easeType, p = this._easePower, (1 === u || 3 === u && l >= .5) && (l = 1 - l), 3 === u && (l *= 2), 1 === p ? l *= l : 2 === p ? l *= l * l : 3 === p ? l *= l * l * l : 4 === p && (l *= l * l * l * l), this.ratio = 1 === u ? 1 - l : 2 === u ? l : .5 > this._time / v ? l / 2 : 1 - l / 2) : this.ratio = this._ease.getRatio(this._time / v)), m === this._time && !i && g === this._cycle)return d !== this._totalTime && this._onUpdate && (e || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _)), void 0;
			if (!this._initted) {
				if (this._init(), !this._initted || this._gc)return;
				if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration))return this._time = m, this._totalTime = d, this._rawPrevTime = y, this._cycle = g, a.lazyTweens.push(this), this._lazy = t, void 0;
				this._time && !s ? this.ratio = this._ease.getRatio(this._time / v) : s && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
			}
			for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== m && t >= 0 && (this._active = !0), 0 === d && (2 === this._initted && t > 0 && this._init(), this._startAt && (t >= 0 ? this._startAt.render(t, e, i) : r || (r = "_dummyGS")), this.vars.onStart && (0 !== this._totalTime || 0 === v) && (e || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || _))), o = this._firstPT; o;)o.f ? o.t[o.p](o.c * this.ratio + o.s) : o.t[o.p] = o.c * this.ratio + o.s, o = o._next;
			this._onUpdate && (0 > t && this._startAt && this._startTime && this._startAt.render(t, e, i), e || (this._totalTime !== d || s) && this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _)), this._cycle !== g && (e || this._gc || this.vars.onRepeat && this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || _)), r && (this._gc || (0 > t && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(t, e, i), s && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[r] && this.vars[r].apply(this.vars[r + "Scope"] || this, this.vars[r + "Params"] || _), 0 === v && this._rawPrevTime === n && f !== n && (this._rawPrevTime = 0)))
		}, r.to = function (t, e, i) {
			return new r(t, e, i)
		}, r.from = function (t, e, i) {
			return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new r(t, e, i)
		}, r.fromTo = function (t, e, i, s) {
			return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, new r(t, e, s)
		}, r.staggerTo = r.allTo = function (t, e, n, a, l, u, p) {
			a = a || 0;
			var f, c, m, d, g = n.delay || 0, v = [], y = function () {
				n.onComplete && n.onComplete.apply(n.onCompleteScope || this, arguments), l.apply(p || this, u || _)
			};
			for (h(t) || ("string" == typeof t && (t = i.selector(t) || t), o(t) && (t = s.call(t, 0))), f = t.length, m = 0; f > m; m++) {
				c = {};
				for (d in n)c[d] = n[d];
				c.delay = g, m === f - 1 && l && (c.onComplete = y), v[m] = new r(t[m], e, c), g += a
			}
			return v
		}, r.staggerFrom = r.allFrom = function (t, e, i, s, n, a, o) {
			return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, r.staggerTo(t, e, i, s, n, a, o)
		}, r.staggerFromTo = r.allFromTo = function (t, e, i, s, n, a, o, h) {
			return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, r.staggerTo(t, e, s, n, a, o, h)
		}, r.delayedCall = function (t, e, i, s, n) {
			return new r(e, 0, {
				delay: t,
				onComplete: e,
				onCompleteParams: i,
				onCompleteScope: s,
				onReverseComplete: e,
				onReverseCompleteParams: i,
				onReverseCompleteScope: s,
				immediateRender: !1,
				useFrames: n,
				overwrite: 0
			})
		}, r.set = function (t, e) {
			return new r(t, 0, e)
		}, r.isTweening = function (t) {
			return i.getTweensOf(t, !0).length > 0
		};
		var u = function (t, e) {
			for (var s = [], r = 0, n = t._first; n;)n instanceof i ? s[r++] = n : (e && (s[r++] = n), s = s.concat(u(n, e)), r = s.length), n = n._next;
			return s
		}, p = r.getAllTweens = function (e) {
			return u(t._rootTimeline, e).concat(u(t._rootFramesTimeline, e))
		};
		r.killAll = function (t, i, s, r) {
			null == i && (i = !0), null == s && (s = !0);
			var n, a, o, h = p(0 != r), l = h.length, _ = i && s && r;
			for (o = 0; l > o; o++)a = h[o], (_ || a instanceof e || (n = a.target === a.vars.onComplete) && s || i && !n) && (t ? a.totalTime(a._reversed ? 0 : a.totalDuration()) : a._enabled(!1, !1))
		}, r.killChildTweensOf = function (t, e) {
			if (null != t) {
				var n, l, _, u, p, f = a.tweenLookup;
				if ("string" == typeof t && (t = i.selector(t) || t), o(t) && (t = s.call(t, 0)), h(t))for (u = t.length; --u > -1;)r.killChildTweensOf(t[u], e); else {
					n = [];
					for (_ in f)for (l = f[_].target.parentNode; l;)l === t && (n = n.concat(f[_].tweens)), l = l.parentNode;
					for (p = n.length, u = 0; p > u; u++)e && n[u].totalTime(n[u].totalDuration()), n[u]._enabled(!1, !1)
				}
			}
		};
		var f = function (t, i, s, r) {
			i = i !== !1, s = s !== !1, r = r !== !1;
			for (var n, a, o = p(r), h = i && s && r, l = o.length; --l > -1;)a = o[l], (h || a instanceof e || (n = a.target === a.vars.onComplete) && s || i && !n) && a.paused(t)
		};
		return r.pauseAll = function (t, e, i) {
			f(!0, t, e, i)
		}, r.resumeAll = function (t, e, i) {
			f(!1, t, e, i)
		}, r.globalTimeScale = function (e) {
			var s = t._rootTimeline, r = i.ticker.time;
			return arguments.length ? (e = e || n, s._startTime = r - (r - s._startTime) * s._timeScale / e, s = t._rootFramesTimeline, r = i.ticker.frame, s._startTime = r - (r - s._startTime) * s._timeScale / e, s._timeScale = t._rootTimeline._timeScale = e, e) : s._timeScale
		}, l.progress = function (t) {
			return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - t : t) + this._cycle * (this._duration + this._repeatDelay), !1) : this._time / this.duration()
		}, l.totalProgress = function (t) {
			return arguments.length ? this.totalTime(this.totalDuration() * t, !1) : this._totalTime / this.totalDuration()
		}, l.time = function (t, e) {
			return arguments.length ? (this._dirty && this.totalDuration(), t > this._duration && (t = this._duration), this._yoyo && 0 !== (1 & this._cycle) ? t = this._duration - t + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (t += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(t, e)) : this._time
		}, l.duration = function (e) {
			return arguments.length ? t.prototype.duration.call(this, e) : this._duration
		}, l.totalDuration = function (t) {
			return arguments.length ? -1 === this._repeat ? this : this.duration((t - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat, this._dirty = !1), this._totalDuration)
		}, l.repeat = function (t) {
			return arguments.length ? (this._repeat = t, this._uncache(!0)) : this._repeat
		}, l.repeatDelay = function (t) {
			return arguments.length ? (this._repeatDelay = t, this._uncache(!0)) : this._repeatDelay
		}, l.yoyo = function (t) {
			return arguments.length ? (this._yoyo = t, this) : this._yoyo
		}, r
	}, !0), window._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (t, e, i) {
		var s = function (t) {
			e.call(this, t), this._labels = {}, this.autoRemoveChildren = this.vars.autoRemoveChildren === !0, this.smoothChildTiming = this.vars.smoothChildTiming === !0, this._sortChildren = !0, this._onUpdate = this.vars.onUpdate;
			var i, s, r = this.vars;
			for (s in r)i = r[s], a(i) && -1 !== i.join("").indexOf("{self}") && (r[s] = this._swapSelfInParams(i));
			a(r.tweens) && this.add(r.tweens, 0, r.align, r.stagger)
		}, r = 1e-10, n = i._internals.isSelector, a = i._internals.isArray, o = [], h = window._gsDefine.globals, l = function (t) {
			var e, i = {};
			for (e in t)i[e] = t[e];
			return i
		}, _ = function (t, e, i, s) {
			t._timeline.pause(t._startTime), e && e.apply(s || t._timeline, i || o)
		}, u = o.slice, p = s.prototype = new e;
		return s.version = "1.12.1", p.constructor = s, p.kill()._gc = !1, p.to = function (t, e, s, r) {
			var n = s.repeat && h.TweenMax || i;
			return e ? this.add(new n(t, e, s), r) : this.set(t, s, r)
		}, p.from = function (t, e, s, r) {
			return this.add((s.repeat && h.TweenMax || i).from(t, e, s), r)
		}, p.fromTo = function (t, e, s, r, n) {
			var a = r.repeat && h.TweenMax || i;
			return e ? this.add(a.fromTo(t, e, s, r), n) : this.set(t, r, n)
		}, p.staggerTo = function (t, e, r, a, o, h, _, p) {
			var f, c = new s({
				onComplete: h,
				onCompleteParams: _,
				onCompleteScope: p,
				smoothChildTiming: this.smoothChildTiming
			});
			for ("string" == typeof t && (t = i.selector(t) || t), n(t) && (t = u.call(t, 0)), a = a || 0, f = 0; t.length > f; f++)r.startAt && (r.startAt = l(r.startAt)), c.to(t[f], e, l(r), f * a);
			return this.add(c, o)
		}, p.staggerFrom = function (t, e, i, s, r, n, a, o) {
			return i.immediateRender = 0 != i.immediateRender, i.runBackwards = !0, this.staggerTo(t, e, i, s, r, n, a, o)
		}, p.staggerFromTo = function (t, e, i, s, r, n, a, o, h) {
			return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, this.staggerTo(t, e, s, r, n, a, o, h)
		}, p.call = function (t, e, s, r) {
			return this.add(i.delayedCall(0, t, e, s), r)
		}, p.set = function (t, e, s) {
			return s = this._parseTimeOrLabel(s, 0, !0), null == e.immediateRender && (e.immediateRender = s === this._time && !this._paused), this.add(new i(t, 0, e), s)
		}, s.exportRoot = function (t, e) {
			t = t || {}, null == t.smoothChildTiming && (t.smoothChildTiming = !0);
			var r, n, a = new s(t), o = a._timeline;
			for (null == e && (e = !0), o._remove(a, !0), a._startTime = 0, a._rawPrevTime = a._time = a._totalTime = o._time, r = o._first; r;)n = r._next, e && r instanceof i && r.target === r.vars.onComplete || a.add(r, r._startTime - r._delay), r = n;
			return o.add(a, 0), a
		}, p.add = function (r, n, o, h) {
			var l, _, u, p, f, c;
			if ("number" != typeof n && (n = this._parseTimeOrLabel(n, 0, !0, r)), !(r instanceof t)) {
				if (r instanceof Array || r && r.push && a(r)) {
					for (o = o || "normal", h = h || 0, l = n, _ = r.length, u = 0; _ > u; u++)a(p = r[u]) && (p = new s({tweens: p})), this.add(p, l), "string" != typeof p && "function" != typeof p && ("sequence" === o ? l = p._startTime + p.totalDuration() / p._timeScale : "start" === o && (p._startTime -= p.delay())), l += h;
					return this._uncache(!0)
				}
				if ("string" == typeof r)return this.addLabel(r, n);
				if ("function" != typeof r)throw"Cannot add " + r + " into the timeline; it is not a tween, timeline, function, or string.";
				r = i.delayedCall(0, r)
			}
			if (e.prototype.add.call(this, r, n), (this._gc || this._time === this._duration) && !this._paused && this._duration < this.duration())for (f = this, c = f.rawTime() > r._startTime; f._timeline;)c && f._timeline.smoothChildTiming ? f.totalTime(f._totalTime, !0) : f._gc && f._enabled(!0, !1), f = f._timeline;
			return this
		}, p.remove = function (e) {
			if (e instanceof t)return this._remove(e, !1);
			if (e instanceof Array || e && e.push && a(e)) {
				for (var i = e.length; --i > -1;)this.remove(e[i]);
				return this
			}
			return "string" == typeof e ? this.removeLabel(e) : this.kill(null, e)
		}, p._remove = function (t, i) {
			e.prototype._remove.call(this, t, i);
			var s = this._last;
			return s ? this._time > s._startTime + s._totalDuration / s._timeScale && (this._time = this.duration(), this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0, this
		}, p.append = function (t, e) {
			return this.add(t, this._parseTimeOrLabel(null, e, !0, t))
		}, p.insert = p.insertMultiple = function (t, e, i, s) {
			return this.add(t, e || 0, i, s)
		}, p.appendMultiple = function (t, e, i, s) {
			return this.add(t, this._parseTimeOrLabel(null, e, !0, t), i, s)
		}, p.addLabel = function (t, e) {
			return this._labels[t] = this._parseTimeOrLabel(e), this
		}, p.addPause = function (t, e, i, s) {
			return this.call(_, ["{self}", e, i, s], this, t)
		}, p.removeLabel = function (t) {
			return delete this._labels[t], this
		}, p.getLabelTime = function (t) {
			return null != this._labels[t] ? this._labels[t] : -1
		}, p._parseTimeOrLabel = function (e, i, s, r) {
			var n;
			if (r instanceof t && r.timeline === this)this.remove(r); else if (r && (r instanceof Array || r.push && a(r)))for (n = r.length; --n > -1;)r[n]instanceof t && r[n].timeline === this && this.remove(r[n]);
			if ("string" == typeof i)return this._parseTimeOrLabel(i, s && "number" == typeof e && null == this._labels[i] ? e - this.duration() : 0, s);
			if (i = i || 0, "string" != typeof e || !isNaN(e) && null == this._labels[e])null == e && (e = this.duration()); else {
				if (n = e.indexOf("="), -1 === n)return null == this._labels[e] ? s ? this._labels[e] = this.duration() + i : i : this._labels[e] + i;
				i = parseInt(e.charAt(n - 1) + "1", 10) * Number(e.substr(n + 1)), e = n > 1 ? this._parseTimeOrLabel(e.substr(0, n - 1), 0, s) : this.duration()
			}
			return Number(e) + i
		}, p.seek = function (t, e) {
			return this.totalTime("number" == typeof t ? t : this._parseTimeOrLabel(t), e !== !1)
		}, p.stop = function () {
			return this.paused(!0)
		}, p.gotoAndPlay = function (t, e) {
			return this.play(t, e)
		}, p.gotoAndStop = function (t, e) {
			return this.pause(t, e)
		}, p.render = function (t, e, i) {
			this._gc && this._enabled(!0, !1);
			var s, n, a, h, l, _ = this._dirty ? this.totalDuration() : this._totalDuration, u = this._time, p = this._startTime, f = this._timeScale, c = this._paused;
			if (t >= _ ? (this._totalTime = this._time = _, this._reversed || this._hasPausedChild() || (n = !0, h = "onComplete", 0 === this._duration && (0 === t || 0 > this._rawPrevTime || this._rawPrevTime === r) && this._rawPrevTime !== t && this._first && (l = !0, this._rawPrevTime > r && (h = "onReverseComplete"))), this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : r, t = _ + 1e-4) : 1e-7 > t ? (this._totalTime = this._time = 0, (0 !== u || 0 === this._duration && this._rawPrevTime !== r && (this._rawPrevTime > 0 || 0 > t && this._rawPrevTime >= 0)) && (h = "onReverseComplete", n = this._reversed), 0 > t ? (this._active = !1, 0 === this._duration && this._rawPrevTime >= 0 && this._first && (l = !0), this._rawPrevTime = t) : (this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : r, t = 0, this._initted || (l = !0))) : this._totalTime = this._time = this._rawPrevTime = t, this._time !== u && this._first || i || l) {
				if (this._initted || (this._initted = !0), this._active || !this._paused && this._time !== u && t > 0 && (this._active = !0), 0 === u && this.vars.onStart && 0 !== this._time && (e || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || o)), this._time >= u)for (s = this._first; s && (a = s._next, !this._paused || c);)(s._active || s._startTime <= this._time && !s._paused && !s._gc) && (s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)), s = a; else for (s = this._last; s && (a = s._prev, !this._paused || c);)(s._active || u >= s._startTime && !s._paused && !s._gc) && (s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)), s = a;
				this._onUpdate && (e || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || o)), h && (this._gc || (p === this._startTime || f !== this._timeScale) && (0 === this._time || _ >= this.totalDuration()) && (n && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[h] && this.vars[h].apply(this.vars[h + "Scope"] || this, this.vars[h + "Params"] || o)))
			}
		}, p._hasPausedChild = function () {
			for (var t = this._first; t;) {
				if (t._paused || t instanceof s && t._hasPausedChild())return !0;
				t = t._next
			}
			return !1
		}, p.getChildren = function (t, e, s, r) {
			r = r || -9999999999;
			for (var n = [], a = this._first, o = 0; a;)r > a._startTime || (a instanceof i ? e !== !1 && (n[o++] = a) : (s !== !1 && (n[o++] = a), t !== !1 && (n = n.concat(a.getChildren(!0, e, s)), o = n.length))), a = a._next;
			return n
		}, p.getTweensOf = function (t, e) {
			var s, r, n = this._gc, a = [], o = 0;
			for (n && this._enabled(!0, !0), s = i.getTweensOf(t), r = s.length; --r > -1;)(s[r].timeline === this || e && this._contains(s[r])) && (a[o++] = s[r]);
			return n && this._enabled(!1, !0), a
		}, p._contains = function (t) {
			for (var e = t.timeline; e;) {
				if (e === this)return !0;
				e = e.timeline
			}
			return !1
		}, p.shiftChildren = function (t, e, i) {
			i = i || 0;
			for (var s, r = this._first, n = this._labels; r;)r._startTime >= i && (r._startTime += t), r = r._next;
			if (e)for (s in n)n[s] >= i && (n[s] += t);
			return this._uncache(!0)
		}, p._kill = function (t, e) {
			if (!t && !e)return this._enabled(!1, !1);
			for (var i = e ? this.getTweensOf(e) : this.getChildren(!0, !0, !1), s = i.length, r = !1; --s > -1;)i[s]._kill(t, e) && (r = !0);
			return r
		}, p.clear = function (t) {
			var e = this.getChildren(!1, !0, !0), i = e.length;
			for (this._time = this._totalTime = 0; --i > -1;)e[i]._enabled(!1, !1);
			return t !== !1 && (this._labels = {}), this._uncache(!0)
		}, p.invalidate = function () {
			for (var t = this._first; t;)t.invalidate(), t = t._next;
			return this
		}, p._enabled = function (t, i) {
			if (t === this._gc)for (var s = this._first; s;)s._enabled(t, !0), s = s._next;
			return e.prototype._enabled.call(this, t, i)
		}, p.duration = function (t) {
			return arguments.length ? (0 !== this.duration() && 0 !== t && this.timeScale(this._duration / t), this) : (this._dirty && this.totalDuration(), this._duration)
		}, p.totalDuration = function (t) {
			if (!arguments.length) {
				if (this._dirty) {
					for (var e, i, s = 0, r = this._last, n = 999999999999; r;)e = r._prev, r._dirty && r.totalDuration(), r._startTime > n && this._sortChildren && !r._paused ? this.add(r, r._startTime - r._delay) : n = r._startTime, 0 > r._startTime && !r._paused && (s -= r._startTime, this._timeline.smoothChildTiming && (this._startTime += r._startTime / this._timeScale), this.shiftChildren(-r._startTime, !1, -9999999999), n = 0), i = r._startTime + r._totalDuration / r._timeScale, i > s && (s = i), r = e;
					this._duration = this._totalDuration = s, this._dirty = !1
				}
				return this._totalDuration
			}
			return 0 !== this.totalDuration() && 0 !== t && this.timeScale(this._totalDuration / t), this
		}, p.usesFrames = function () {
			for (var e = this._timeline; e._timeline;)e = e._timeline;
			return e === t._rootFramesTimeline
		}, p.rawTime = function () {
			return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale
		}, s
	}, !0), window._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function (t, e, i) {
		var s = function (e) {
			t.call(this, e), this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._cycle = 0, this._yoyo = this.vars.yoyo === !0, this._dirty = !0
		}, r = 1e-10, n = [], a = new i(null, null, 1, 0), o = s.prototype = new t;
		return o.constructor = s, o.kill()._gc = !1, s.version = "1.12.1", o.invalidate = function () {
			return this._yoyo = this.vars.yoyo === !0, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._uncache(!0), t.prototype.invalidate.call(this)
		}, o.addCallback = function (t, i, s, r) {
			return this.add(e.delayedCall(0, t, s, r), i)
		}, o.removeCallback = function (t, e) {
			if (t)if (null == e)this._kill(null, t); else for (var i = this.getTweensOf(t, !1), s = i.length, r = this._parseTimeOrLabel(e); --s > -1;)i[s]._startTime === r && i[s]._enabled(!1, !1);
			return this
		}, o.tweenTo = function (t, i) {
			i = i || {};
			var s, r, o, h = {ease: a, overwrite: i.delay ? 2 : 1, useFrames: this.usesFrames(), immediateRender: !1};
			for (r in i)h[r] = i[r];
			return h.time = this._parseTimeOrLabel(t), s = Math.abs(Number(h.time) - this._time) / this._timeScale || .001, o = new e(this, s, h), h.onStart = function () {
				o.target.paused(!0), o.vars.time !== o.target.time() && s === o.duration() && o.duration(Math.abs(o.vars.time - o.target.time()) / o.target._timeScale), i.onStart && i.onStart.apply(i.onStartScope || o, i.onStartParams || n)
			}, o
		}, o.tweenFromTo = function (t, e, i) {
			i = i || {}, t = this._parseTimeOrLabel(t), i.startAt = {
				onComplete: this.seek,
				onCompleteParams: [t],
				onCompleteScope: this
			}, i.immediateRender = i.immediateRender !== !1;
			var s = this.tweenTo(e, i);
			return s.duration(Math.abs(s.vars.time - t) / this._timeScale || .001)
		}, o.render = function (t, e, i) {
			this._gc && this._enabled(!0, !1);
			var s, a, o, h, l, _, u = this._dirty ? this.totalDuration() : this._totalDuration, p = this._duration, f = this._time, c = this._totalTime, m = this._startTime, d = this._timeScale, g = this._rawPrevTime, v = this._paused, y = this._cycle;
			if (t >= u ? (this._locked || (this._totalTime = u, this._cycle = this._repeat), this._reversed || this._hasPausedChild() || (a = !0, h = "onComplete", 0 === this._duration && (0 === t || 0 > g || g === r) && g !== t && this._first && (l = !0, g > r && (h = "onReverseComplete"))), this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : r, this._yoyo && 0 !== (1 & this._cycle) ? this._time = t = 0 : (this._time = p, t = p + 1e-4)) : 1e-7 > t ? (this._locked || (this._totalTime = this._cycle = 0), this._time = 0, (0 !== f || 0 === p && g !== r && (g > 0 || 0 > t && g >= 0) && !this._locked) && (h = "onReverseComplete", a = this._reversed), 0 > t ? (this._active = !1, 0 === p && g >= 0 && this._first && (l = !0), this._rawPrevTime = t) : (this._rawPrevTime = p || !e || t || this._rawPrevTime === t ? t : r, t = 0, this._initted || (l = !0))) : (0 === p && 0 > g && (l = !0), this._time = this._rawPrevTime = t, this._locked || (this._totalTime = t, 0 !== this._repeat && (_ = p + this._repeatDelay, this._cycle = this._totalTime / _ >> 0, 0 !== this._cycle && this._cycle === this._totalTime / _ && this._cycle--, this._time = this._totalTime - this._cycle * _, this._yoyo && 0 !== (1 & this._cycle) && (this._time = p - this._time), this._time > p ? (this._time = p, t = p + 1e-4) : 0 > this._time ? this._time = t = 0 : t = this._time))), this._cycle !== y && !this._locked) {
				var T = this._yoyo && 0 !== (1 & y), w = T === (this._yoyo && 0 !== (1 & this._cycle)), x = this._totalTime, b = this._cycle, P = this._rawPrevTime, S = this._time;
				if (this._totalTime = y * p, y > this._cycle ? T = !T : this._totalTime += p, this._time = f, this._rawPrevTime = 0 === p ? g - 1e-4 : g, this._cycle = y, this._locked = !0, f = T ? 0 : p, this.render(f, e, 0 === p), e || this._gc || this.vars.onRepeat && this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || n), w && (f = T ? p + 1e-4 : -1e-4, this.render(f, !0, !1)), this._locked = !1, this._paused && !v)return;
				this._time = S, this._totalTime = x, this._cycle = b, this._rawPrevTime = P
			}
			if (!(this._time !== f && this._first || i || l))return c !== this._totalTime && this._onUpdate && (e || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || n)), void 0;
			if (this._initted || (this._initted = !0), this._active || !this._paused && this._totalTime !== c && t > 0 && (this._active = !0), 0 === c && this.vars.onStart && 0 !== this._totalTime && (e || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || n)), this._time >= f)for (s = this._first; s && (o = s._next, !this._paused || v);)(s._active || s._startTime <= this._time && !s._paused && !s._gc) && (s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)), s = o; else for (s = this._last; s && (o = s._prev, !this._paused || v);)(s._active || f >= s._startTime && !s._paused && !s._gc) && (s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)), s = o;
			this._onUpdate && (e || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || n)), h && (this._locked || this._gc || (m === this._startTime || d !== this._timeScale) && (0 === this._time || u >= this.totalDuration()) && (a && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[h] && this.vars[h].apply(this.vars[h + "Scope"] || this, this.vars[h + "Params"] || n)))
		}, o.getActive = function (t, e, i) {
			null == t && (t = !0), null == e && (e = !0), null == i && (i = !1);
			var s, r, n = [], a = this.getChildren(t, e, i), o = 0, h = a.length;
			for (s = 0; h > s; s++)r = a[s], r.isActive() && (n[o++] = r);
			return n
		}, o.getLabelAfter = function (t) {
			t || 0 !== t && (t = this._time);
			var e, i = this.getLabelsArray(), s = i.length;
			for (e = 0; s > e; e++)if (i[e].time > t)return i[e].name;
			return null
		}, o.getLabelBefore = function (t) {
			null == t && (t = this._time);
			for (var e = this.getLabelsArray(), i = e.length; --i > -1;)if (t > e[i].time)return e[i].name;
			return null
		}, o.getLabelsArray = function () {
			var t, e = [], i = 0;
			for (t in this._labels)e[i++] = {time: this._labels[t], name: t};
			return e.sort(function (t, e) {
				return t.time - e.time
			}), e
		}, o.progress = function (t) {
			return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - t : t) + this._cycle * (this._duration + this._repeatDelay), !1) : this._time / this.duration()
		}, o.totalProgress = function (t) {
			return arguments.length ? this.totalTime(this.totalDuration() * t, !1) : this._totalTime / this.totalDuration()
		}, o.totalDuration = function (e) {
			return arguments.length ? -1 === this._repeat ? this : this.duration((e - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (t.prototype.totalDuration.call(this), this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat), this._totalDuration)
		}, o.time = function (t, e) {
			return arguments.length ? (this._dirty && this.totalDuration(), t > this._duration && (t = this._duration), this._yoyo && 0 !== (1 & this._cycle) ? t = this._duration - t + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (t += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(t, e)) : this._time
		}, o.repeat = function (t) {
			return arguments.length ? (this._repeat = t, this._uncache(!0)) : this._repeat
		}, o.repeatDelay = function (t) {
			return arguments.length ? (this._repeatDelay = t, this._uncache(!0)) : this._repeatDelay
		}, o.yoyo = function (t) {
			return arguments.length ? (this._yoyo = t, this) : this._yoyo
		}, o.currentLabel = function (t) {
			return arguments.length ? this.seek(t, !0) : this.getLabelBefore(this._time + 1e-8)
		}, s
	}, !0), function () {
		var t = 180 / Math.PI, e = [], i = [], s = [], r = {}, n = function (t, e, i, s) {
			this.a = t, this.b = e, this.c = i, this.d = s, this.da = s - t, this.ca = i - t, this.ba = e - t
		}, a = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,", o = function (t, e, i, s) {
			var r = {a: t}, n = {}, a = {}, o = {c: s}, h = (t + e) / 2, l = (e + i) / 2, _ = (i + s) / 2, u = (h + l) / 2, p = (l + _) / 2, f = (p - u) / 8;
			return r.b = h + (t - h) / 4, n.b = u + f, r.c = n.a = (r.b + n.b) / 2, n.c = a.a = (u + p) / 2, a.b = p - f, o.b = _ + (s - _) / 4, a.c = o.a = (a.b + o.b) / 2, [r, n, a, o]
		}, h = function (t, r, n, a, h) {
			var l, _, u, p, f, c, m, d, g, v, y, T, w, x = t.length - 1, b = 0, P = t[0].a;
			for (l = 0; x > l; l++)f = t[b], _ = f.a, u = f.d, p = t[b + 1].d, h ? (y = e[l], T = i[l], w = .25 * (T + y) * r / (a ? .5 : s[l] || .5), c = u - (u - _) * (a ? .5 * r : 0 !== y ? w / y : 0), m = u + (p - u) * (a ? .5 * r : 0 !== T ? w / T : 0), d = u - (c + ((m - c) * (3 * y / (y + T) + .5) / 4 || 0))) : (c = u - .5 * (u - _) * r, m = u + .5 * (p - u) * r, d = u - (c + m) / 2), c += d, m += d, f.c = g = c, f.b = 0 !== l ? P : P = f.a + .6 * (f.c - f.a), f.da = u - _, f.ca = g - _, f.ba = P - _, n ? (v = o(_, P, g, u), t.splice(b, 1, v[0], v[1], v[2], v[3]), b += 4) : b++, P = m;
			f = t[b], f.b = P, f.c = P + .4 * (f.d - P), f.da = f.d - f.a, f.ca = f.c - f.a, f.ba = P - f.a, n && (v = o(f.a, P, f.c, f.d), t.splice(b, 1, v[0], v[1], v[2], v[3]))
		}, l = function (t, s, r, a) {
			var o, h, l, _, u, p, f = [];
			if (a)for (t = [a].concat(t), h = t.length; --h > -1;)"string" == typeof(p = t[h][s]) && "=" === p.charAt(1) && (t[h][s] = a[s] + Number(p.charAt(0) + p.substr(2)));
			if (o = t.length - 2, 0 > o)return f[0] = new n(t[0][s], 0, 0, t[-1 > o ? 0 : 1][s]), f;
			for (h = 0; o > h; h++)l = t[h][s], _ = t[h + 1][s], f[h] = new n(l, 0, 0, _), r && (u = t[h + 2][s], e[h] = (e[h] || 0) + (_ - l) * (_ - l), i[h] = (i[h] || 0) + (u - _) * (u - _));
			return f[h] = new n(t[h][s], 0, 0, t[h + 1][s]), f
		}, _ = function (t, n, o, _, u, p) {
			var f, c, m, d, g, v, y, T, w = {}, x = [], b = p || t[0];
			u = "string" == typeof u ? "," + u + "," : a, null == n && (n = 1);
			for (c in t[0])x.push(c);
			if (t.length > 1) {
				for (T = t[t.length - 1], y = !0, f = x.length; --f > -1;)if (c = x[f], Math.abs(b[c] - T[c]) > .05) {
					y = !1;
					break
				}
				y && (t = t.concat(), p && t.unshift(p), t.push(t[1]), p = t[t.length - 3])
			}
			for (e.length = i.length = s.length = 0, f = x.length; --f > -1;)c = x[f], r[c] = -1 !== u.indexOf("," + c + ","), w[c] = l(t, c, r[c], p);
			for (f = e.length; --f > -1;)e[f] = Math.sqrt(e[f]), i[f] = Math.sqrt(i[f]);
			if (!_) {
				for (f = x.length; --f > -1;)if (r[c])for (m = w[x[f]], v = m.length - 1, d = 0; v > d; d++)g = m[d + 1].da / i[d] + m[d].da / e[d], s[d] = (s[d] || 0) + g * g;
				for (f = s.length; --f > -1;)s[f] = Math.sqrt(s[f])
			}
			for (f = x.length, d = o ? 4 : 1; --f > -1;)c = x[f], m = w[c], h(m, n, o, _, r[c]), y && (m.splice(0, d), m.splice(m.length - d, d));
			return w
		}, u = function (t, e, i) {
			e = e || "soft";
			var s, r, a, o, h, l, _, u, p, f, c, m = {}, d = "cubic" === e ? 3 : 2, g = "soft" === e, v = [];
			if (g && i && (t = [i].concat(t)), null == t || d + 1 > t.length)throw"invalid Bezier data";
			for (p in t[0])v.push(p);
			for (l = v.length; --l > -1;) {
				for (p = v[l], m[p] = h = [], f = 0, u = t.length, _ = 0; u > _; _++)s = null == i ? t[_][p] : "string" == typeof(c = t[_][p]) && "=" === c.charAt(1) ? i[p] + Number(c.charAt(0) + c.substr(2)) : Number(c), g && _ > 1 && u - 1 > _ && (h[f++] = (s + h[f - 2]) / 2), h[f++] = s;
				for (u = f - d + 1, f = 0, _ = 0; u > _; _ += d)s = h[_], r = h[_ + 1], a = h[_ + 2], o = 2 === d ? 0 : h[_ + 3], h[f++] = c = 3 === d ? new n(s, r, a, o) : new n(s, (2 * r + s) / 3, (2 * r + a) / 3, a);
				h.length = f
			}
			return m
		}, p = function (t, e, i) {
			for (var s, r, n, a, o, h, l, _, u, p, f, c = 1 / i, m = t.length; --m > -1;)for (p = t[m], n = p.a, a = p.d - n, o = p.c - n, h = p.b - n, s = r = 0, _ = 1; i >= _; _++)l = c * _, u = 1 - l, s = r - (r = (l * l * a + 3 * u * (l * o + u * h)) * l), f = m * i + _ - 1, e[f] = (e[f] || 0) + s * s
		}, f = function (t, e) {
			e = e >> 0 || 6;
			var i, s, r, n, a = [], o = [], h = 0, l = 0, _ = e - 1, u = [], f = [];
			for (i in t)p(t[i], a, e);
			for (r = a.length, s = 0; r > s; s++)h += Math.sqrt(a[s]), n = s % e, f[n] = h, n === _ && (l += h, n = s / e >> 0, u[n] = f, o[n] = l, h = 0, f = []);
			return {length: l, lengths: o, segments: u}
		}, c = window._gsDefine.plugin({
			propName: "bezier", priority: -1, version: "1.3.2", API: 2, global: !0, init: function (t, e, i) {
				this._target = t, e instanceof Array && (e = {values: e}), this._func = {}, this._round = {}, this._props = [], this._timeRes = null == e.timeResolution ? 6 : parseInt(e.timeResolution, 10);
				var s, r, n, a, o, h = e.values || [], l = {}, p = h[0], c = e.autoRotate || i.vars.orientToBezier;
				this._autoRotate = c ? c instanceof Array ? c : [
					["x", "y", "rotation", c === !0 ? 0 : Number(c) || 0]
				] : null;
				for (s in p)this._props.push(s);
				for (n = this._props.length; --n > -1;)s = this._props[n], this._overwriteProps.push(s), r = this._func[s] = "function" == typeof t[s], l[s] = r ? t[s.indexOf("set") || "function" != typeof t["get" + s.substr(3)] ? s : "get" + s.substr(3)]() : parseFloat(t[s]), o || l[s] !== h[0][s] && (o = l);
				if (this._beziers = "cubic" !== e.type && "quadratic" !== e.type && "soft" !== e.type ? _(h, isNaN(e.curviness) ? 1 : e.curviness, !1, "thruBasic" === e.type, e.correlate, o) : u(h, e.type, l), this._segCount = this._beziers[s].length, this._timeRes) {
					var m = f(this._beziers, this._timeRes);
					this._length = m.length, this._lengths = m.lengths, this._segments = m.segments, this._l1 = this._li = this._s1 = this._si = 0, this._l2 = this._lengths[0], this._curSeg = this._segments[0], this._s2 = this._curSeg[0], this._prec = 1 / this._curSeg.length
				}
				if (c = this._autoRotate)for (this._initialRotations = [], c[0]instanceof Array || (this._autoRotate = c = [c]), n = c.length; --n > -1;) {
					for (a = 0; 3 > a; a++)s = c[n][a], this._func[s] = "function" == typeof t[s] ? t[s.indexOf("set") || "function" != typeof t["get" + s.substr(3)] ? s : "get" + s.substr(3)] : !1;
					s = c[n][2], this._initialRotations[n] = this._func[s] ? this._func[s].call(this._target) : this._target[s]
				}
				return this._startRatio = i.vars.runBackwards ? 1 : 0, !0
			}, set: function (e) {
				var i, s, r, n, a, o, h, l, _, u, p = this._segCount, f = this._func, c = this._target, m = e !== this._startRatio;
				if (this._timeRes) {
					if (_ = this._lengths, u = this._curSeg, e *= this._length, r = this._li, e > this._l2 && p - 1 > r) {
						for (l = p - 1; l > r && e >= (this._l2 = _[++r]););
						this._l1 = _[r - 1], this._li = r, this._curSeg = u = this._segments[r], this._s2 = u[this._s1 = this._si = 0]
					} else if (this._l1 > e && r > 0) {
						for (; r > 0 && (this._l1 = _[--r]) >= e;);
						0 === r && this._l1 > e ? this._l1 = 0 : r++, this._l2 = _[r], this._li = r, this._curSeg = u = this._segments[r], this._s1 = u[(this._si = u.length - 1) - 1] || 0, this._s2 = u[this._si]
					}
					if (i = r, e -= this._l1, r = this._si, e > this._s2 && u.length - 1 > r) {
						for (l = u.length - 1; l > r && e >= (this._s2 = u[++r]););
						this._s1 = u[r - 1], this._si = r
					} else if (this._s1 > e && r > 0) {
						for (; r > 0 && (this._s1 = u[--r]) >= e;);
						0 === r && this._s1 > e ? this._s1 = 0 : r++, this._s2 = u[r], this._si = r
					}
					o = (r + (e - this._s1) / (this._s2 - this._s1)) * this._prec
				} else i = 0 > e ? 0 : e >= 1 ? p - 1 : p * e >> 0, o = (e - i * (1 / p)) * p;
				for (s = 1 - o, r = this._props.length; --r > -1;)n = this._props[r], a = this._beziers[n][i], h = (o * o * a.da + 3 * s * (o * a.ca + s * a.ba)) * o + a.a, this._round[n] && (h = Math.round(h)), f[n] ? c[n](h) : c[n] = h;
				if (this._autoRotate) {
					var d, g, v, y, T, w, x, b = this._autoRotate;
					for (r = b.length; --r > -1;)n = b[r][2], w = b[r][3] || 0, x = b[r][4] === !0 ? 1 : t, a = this._beziers[b[r][0]], d = this._beziers[b[r][1]], a && d && (a = a[i], d = d[i], g = a.a + (a.b - a.a) * o, y = a.b + (a.c - a.b) * o, g += (y - g) * o, y += (a.c + (a.d - a.c) * o - y) * o, v = d.a + (d.b - d.a) * o, T = d.b + (d.c - d.b) * o, v += (T - v) * o, T += (d.c + (d.d - d.c) * o - T) * o, h = m ? Math.atan2(T - v, y - g) * x + w : this._initialRotations[r], f[n] ? c[n](h) : c[n] = h)
				}
			}
		}), m = c.prototype;
		c.bezierThrough = _, c.cubicToQuadratic = o, c._autoCSS = !0, c.quadraticToCubic = function (t, e, i) {
			return new n(t, (2 * e + t) / 3, (2 * e + i) / 3, i)
		}, c._cssRegister = function () {
			var t = window._gsDefine.globals.CSSPlugin;
			if (t) {
				var e = t._internals, i = e._parseToProxy, s = e._setPluginRatio, r = e.CSSPropTween;
				e._registerComplexSpecialProp("bezier", {
					parser: function (t, e, n, a, o, h) {
						e instanceof Array && (e = {values: e}), h = new c;
						var l, _, u, p = e.values, f = p.length - 1, m = [], d = {};
						if (0 > f)return o;
						for (l = 0; f >= l; l++)u = i(t, p[l], a, o, h, f !== l), m[l] = u.end;
						for (_ in e)d[_] = e[_];
						return d.values = m, o = new r(t, "bezier", 0, 0, u.pt, 2), o.data = u, o.plugin = h, o.setRatio = s, 0 === d.autoRotate && (d.autoRotate = !0), !d.autoRotate || d.autoRotate instanceof Array || (l = d.autoRotate === !0 ? 0 : Number(d.autoRotate), d.autoRotate = null != u.end.left ? [
							["left", "top", "rotation", l, !1]
						] : null != u.end.x ? [
							["x", "y", "rotation", l, !1]
						] : !1), d.autoRotate && (a._transform || a._enableTransforms(!1), u.autoRotate = a._target._gsTransform), h._onInitTween(u.proxy, d, a._tween), o
					}
				})
			}
		}, m._roundProps = function (t, e) {
			for (var i = this._overwriteProps, s = i.length; --s > -1;)(t[i[s]] || t.bezier || t.bezierThrough) && (this._round[i[s]] = e)
		}, m._kill = function (t) {
			var e, i, s = this._props;
			for (e in this._beziers)if (e in t)for (delete this._beziers[e], delete this._func[e], i = s.length; --i > -1;)s[i] === e && s.splice(i, 1);
			return this._super._kill.call(this, t)
		}
	}(), window._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function (t, e) {
		var i, s, r, n, a = function () {
			t.call(this, "css"), this._overwriteProps.length = 0, this.setRatio = a.prototype.setRatio
		}, o = {}, h = a.prototype = new t("css");
		h.constructor = a, a.version = "1.12.1", a.API = 2, a.defaultTransformPerspective = 0, a.defaultSkewType = "compensated", h = "px", a.suffixMap = {
			top: h,
			right: h,
			bottom: h,
			left: h,
			width: h,
			height: h,
			fontSize: h,
			padding: h,
			margin: h,
			perspective: h,
			lineHeight: ""
		};
		var l, _, u, p, f, c, m = /(?:\d|\-\d|\.\d|\-\.\d)+/g, d = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g, g = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi, v = /[^\d\-\.]/g, y = /(?:\d|\-|\+|=|#|\.)*/g, T = /opacity *= *([^)]*)/i, w = /opacity:([^;]*)/i, x = /alpha\(opacity *=.+?\)/i, b = /^(rgb|hsl)/, P = /([A-Z])/g, S = /-([a-z])/gi, k = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi, R = function (t, e) {
			return e.toUpperCase()
		}, A = /(?:Left|Right|Width)/i, C = /(M11|M12|M21|M22)=[\d\-\.e]+/gi, O = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i, D = /,(?=[^\)]*(?:\(|$))/gi, M = Math.PI / 180, z = 180 / Math.PI, I = {}, E = document, L = E.createElement("div"), F = E.createElement("img"), N = a._internals = {_specialProps: o}, X = navigator.userAgent, U = function () {
			var t, e = X.indexOf("Android"), i = E.createElement("div");
			return u = -1 !== X.indexOf("Safari") && -1 === X.indexOf("Chrome") && (-1 === e || Number(X.substr(e + 8, 1)) > 3), f = u && 6 > Number(X.substr(X.indexOf("Version/") + 8, 1)), p = -1 !== X.indexOf("Firefox"), /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(X) && (c = parseFloat(RegExp.$1)), i.innerHTML = "<a style='top:1px;opacity:.55;'>a</a>", t = i.getElementsByTagName("a")[0], t ? /^0.55/.test(t.style.opacity) : !1
		}(), Y = function (t) {
			return T.test("string" == typeof t ? t : (t.currentStyle ? t.currentStyle.filter : t.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
		}, j = function (t) {
			window.console && console.log(t)
		}, B = "", q = "", V = function (t, e) {
			e = e || L;
			var i, s, r = e.style;
			if (void 0 !== r[t])return t;
			for (t = t.charAt(0).toUpperCase() + t.substr(1), i = ["O", "Moz", "ms", "Ms", "Webkit"], s = 5; --s > -1 && void 0 === r[i[s] + t];);
			return s >= 0 ? (q = 3 === s ? "ms" : i[s], B = "-" + q.toLowerCase() + "-", q + t) : null
		}, W = E.defaultView ? E.defaultView.getComputedStyle : function () {
		}, G = a.getStyle = function (t, e, i, s, r) {
			var n;
			return U || "opacity" !== e ? (!s && t.style[e] ? n = t.style[e] : (i = i || W(t)) ? n = i[e] || i.getPropertyValue(e) || i.getPropertyValue(e.replace(P, "-$1").toLowerCase()) : t.currentStyle && (n = t.currentStyle[e]), null == r || n && "none" !== n && "auto" !== n && "auto auto" !== n ? n : r) : Y(t)
		}, $ = N.convertToPixels = function (t, i, s, r, n) {
			if ("px" === r || !r)return s;
			if ("auto" === r || !s)return 0;
			var o, h, l, _ = A.test(i), u = t, p = L.style, f = 0 > s;
			if (f && (s = -s), "%" === r && -1 !== i.indexOf("border"))o = s / 100 * (_ ? t.clientWidth : t.clientHeight); else {
				if (p.cssText = "border:0 solid red;position:" + G(t, "position") + ";line-height:0;", "%" !== r && u.appendChild)p[_ ? "borderLeftWidth" : "borderTopWidth"] = s + r; else {
					if (u = t.parentNode || E.body, h = u._gsCache, l = e.ticker.frame, h && _ && h.time === l)return h.width * s / 100;
					p[_ ? "width" : "height"] = s + r
				}
				u.appendChild(L), o = parseFloat(L[_ ? "offsetWidth" : "offsetHeight"]), u.removeChild(L), _ && "%" === r && a.cacheWidths !== !1 && (h = u._gsCache = u._gsCache || {}, h.time = l, h.width = 100 * (o / s)), 0 !== o || n || (o = $(t, i, s, r, !0))
			}
			return f ? -o : o
		}, Z = N.calculateOffset = function (t, e, i) {
			if ("absolute" !== G(t, "position", i))return 0;
			var s = "left" === e ? "Left" : "Top", r = G(t, "margin" + s, i);
			return t["offset" + s] - ($(t, e, parseFloat(r), r.replace(y, "")) || 0)
		}, Q = function (t, e) {
			var i, s, r = {};
			if (e = e || W(t, null))if (i = e.length)for (; --i > -1;)r[e[i].replace(S, R)] = e.getPropertyValue(e[i]); else for (i in e)r[i] = e[i]; else if (e = t.currentStyle || t.style)for (i in e)"string" == typeof i && void 0 === r[i] && (r[i.replace(S, R)] = e[i]);
			return U || (r.opacity = Y(t)), s = Pe(t, e, !1), r.rotation = s.rotation, r.skewX = s.skewX, r.scaleX = s.scaleX, r.scaleY = s.scaleY, r.x = s.x, r.y = s.y, xe && (r.z = s.z, r.rotationX = s.rotationX, r.rotationY = s.rotationY, r.scaleZ = s.scaleZ), r.filters && delete r.filters, r
		}, H = function (t, e, i, s, r) {
			var n, a, o, h = {}, l = t.style;
			for (a in i)"cssText" !== a && "length" !== a && isNaN(a) && (e[a] !== (n = i[a]) || r && r[a]) && -1 === a.indexOf("Origin") && ("number" == typeof n || "string" == typeof n) && (h[a] = "auto" !== n || "left" !== a && "top" !== a ? "" !== n && "auto" !== n && "none" !== n || "string" != typeof e[a] || "" === e[a].replace(v, "") ? n : 0 : Z(t, a), void 0 !== l[a] && (o = new ue(l, a, l[a], o)));
			if (s)for (a in s)"className" !== a && (h[a] = s[a]);
			return {difs: h, firstMPT: o}
		}, K = {
			width: ["Left", "Right"],
			height: ["Top", "Bottom"]
		}, J = ["marginLeft", "marginRight", "marginTop", "marginBottom"], te = function (t, e, i) {
			var s = parseFloat("width" === e ? t.offsetWidth : t.offsetHeight), r = K[e], n = r.length;
			for (i = i || W(t, null); --n > -1;)s -= parseFloat(G(t, "padding" + r[n], i, !0)) || 0, s -= parseFloat(G(t, "border" + r[n] + "Width", i, !0)) || 0;
			return s
		}, ee = function (t, e) {
			(null == t || "" === t || "auto" === t || "auto auto" === t) && (t = "0 0");
			var i = t.split(" "), s = -1 !== t.indexOf("left") ? "0%" : -1 !== t.indexOf("right") ? "100%" : i[0], r = -1 !== t.indexOf("top") ? "0%" : -1 !== t.indexOf("bottom") ? "100%" : i[1];
			return null == r ? r = "0" : "center" === r && (r = "50%"), ("center" === s || isNaN(parseFloat(s)) && -1 === (s + "").indexOf("=")) && (s = "50%"), e && (e.oxp = -1 !== s.indexOf("%"), e.oyp = -1 !== r.indexOf("%"), e.oxr = "=" === s.charAt(1), e.oyr = "=" === r.charAt(1), e.ox = parseFloat(s.replace(v, "")), e.oy = parseFloat(r.replace(v, ""))), s + " " + r + (i.length > 2 ? " " + i[2] : "")
		}, ie = function (t, e) {
			return "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) : parseFloat(t) - parseFloat(e)
		}, se = function (t, e) {
			return null == t ? e : "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * Number(t.substr(2)) + e : parseFloat(t)
		}, re = function (t, e, i, s) {
			var r, n, a, o, h = 1e-6;
			return null == t ? o = e : "number" == typeof t ? o = t : (r = 360, n = t.split("_"), a = Number(n[0].replace(v, "")) * (-1 === t.indexOf("rad") ? 1 : z) - ("=" === t.charAt(1) ? 0 : e), n.length && (s && (s[i] = e + a), -1 !== t.indexOf("short") && (a %= r, a !== a % (r / 2) && (a = 0 > a ? a + r : a - r)), -1 !== t.indexOf("_cw") && 0 > a ? a = (a + 9999999999 * r) % r - (0 | a / r) * r : -1 !== t.indexOf("ccw") && a > 0 && (a = (a - 9999999999 * r) % r - (0 | a / r) * r)), o = e + a), h > o && o > -h && (o = 0), o
		}, ne = {
			aqua: [0, 255, 255],
			lime: [0, 255, 0],
			silver: [192, 192, 192],
			black: [0, 0, 0],
			maroon: [128, 0, 0],
			teal: [0, 128, 128],
			blue: [0, 0, 255],
			navy: [0, 0, 128],
			white: [255, 255, 255],
			fuchsia: [255, 0, 255],
			olive: [128, 128, 0],
			yellow: [255, 255, 0],
			orange: [255, 165, 0],
			gray: [128, 128, 128],
			purple: [128, 0, 128],
			green: [0, 128, 0],
			red: [255, 0, 0],
			pink: [255, 192, 203],
			cyan: [0, 255, 255],
			transparent: [255, 255, 255, 0]
		}, ae = function (t, e, i) {
			return t = 0 > t ? t + 1 : t > 1 ? t - 1 : t, 0 | 255 * (1 > 6 * t ? e + 6 * (i - e) * t : .5 > t ? i : 2 > 3 * t ? e + 6 * (i - e) * (2 / 3 - t) : e) + .5
		}, oe = function (t) {
			var e, i, s, r, n, a;
			return t && "" !== t ? "number" == typeof t ? [t >> 16, 255 & t >> 8, 255 & t] : ("," === t.charAt(t.length - 1) && (t = t.substr(0, t.length - 1)), ne[t] ? ne[t] : "#" === t.charAt(0) ? (4 === t.length && (e = t.charAt(1), i = t.charAt(2), s = t.charAt(3), t = "#" + e + e + i + i + s + s), t = parseInt(t.substr(1), 16), [t >> 16, 255 & t >> 8, 255 & t]) : "hsl" === t.substr(0, 3) ? (t = t.match(m), r = Number(t[0]) % 360 / 360, n = Number(t[1]) / 100, a = Number(t[2]) / 100, i = .5 >= a ? a * (n + 1) : a + n - a * n, e = 2 * a - i, t.length > 3 && (t[3] = Number(t[3])), t[0] = ae(r + 1 / 3, e, i), t[1] = ae(r, e, i), t[2] = ae(r - 1 / 3, e, i), t) : (t = t.match(m) || ne.transparent, t[0] = Number(t[0]), t[1] = Number(t[1]), t[2] = Number(t[2]), t.length > 3 && (t[3] = Number(t[3])), t)) : ne.black
		}, he = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";
		for (h in ne)he += "|" + h + "\\b";
		he = RegExp(he + ")", "gi");
		var le = function (t, e, i, s) {
			if (null == t)return function (t) {
				return t
			};
			var r, n = e ? (t.match(he) || [""])[0] : "", a = t.split(n).join("").match(g) || [], o = t.substr(0, t.indexOf(a[0])), h = ")" === t.charAt(t.length - 1) ? ")" : "", l = -1 !== t.indexOf(" ") ? " " : ",", _ = a.length, u = _ > 0 ? a[0].replace(m, "") : "";
			return _ ? r = e ? function (t) {
				var e, p, f, c;
				if ("number" == typeof t)t += u; else if (s && D.test(t)) {
					for (c = t.replace(D, "|").split("|"), f = 0; c.length > f; f++)c[f] = r(c[f]);
					return c.join(",")
				}
				if (e = (t.match(he) || [n])[0], p = t.split(e).join("").match(g) || [], f = p.length, _ > f--)for (; _ > ++f;)p[f] = i ? p[0 | (f - 1) / 2] : a[f];
				return o + p.join(l) + l + e + h + (-1 !== t.indexOf("inset") ? " inset" : "")
			} : function (t) {
				var e, n, p;
				if ("number" == typeof t)t += u; else if (s && D.test(t)) {
					for (n = t.replace(D, "|").split("|"), p = 0; n.length > p; p++)n[p] = r(n[p]);
					return n.join(",")
				}
				if (e = t.match(g) || [], p = e.length, _ > p--)for (; _ > ++p;)e[p] = i ? e[0 | (p - 1) / 2] : a[p];
				return o + e.join(l) + h
			} : function (t) {
				return t
			}
		}, _e = function (t) {
			return t = t.split(","), function (e, i, s, r, n, a, o) {
				var h, l = (i + "").split(" ");
				for (o = {}, h = 0; 4 > h; h++)o[t[h]] = l[h] = l[h] || l[(h - 1) / 2 >> 0];
				return r.parse(e, o, n, a)
			}
		}, ue = (N._setPluginRatio = function (t) {
			this.plugin.setRatio(t);
			for (var e, i, s, r, n = this.data, a = n.proxy, o = n.firstMPT, h = 1e-6; o;)e = a[o.v], o.r ? e = Math.round(e) : h > e && e > -h && (e = 0), o.t[o.p] = e, o = o._next;
			if (n.autoRotate && (n.autoRotate.rotation = a.rotation), 1 === t)for (o = n.firstMPT; o;) {
				if (i = o.t, i.type) {
					if (1 === i.type) {
						for (r = i.xs0 + i.s + i.xs1, s = 1; i.l > s; s++)r += i["xn" + s] + i["xs" + (s + 1)];
						i.e = r
					}
				} else i.e = i.s + i.xs0;
				o = o._next
			}
		}, function (t, e, i, s, r) {
			this.t = t, this.p = e, this.v = i, this.r = r, s && (s._prev = this, this._next = s)
		}), pe = (N._parseToProxy = function (t, e, i, s, r, n) {
			var a, o, h, l, _, u = s, p = {}, f = {}, c = i._transform, m = I;
			for (i._transform = null, I = e, s = _ = i.parse(t, e, s, r), I = m, n && (i._transform = c, u && (u._prev = null, u._prev && (u._prev._next = null))); s && s !== u;) {
				if (1 >= s.type && (o = s.p, f[o] = s.s + s.c, p[o] = s.s, n || (l = new ue(s, "s", o, l, s.r), s.c = 0), 1 === s.type))for (a = s.l; --a > 0;)h = "xn" + a, o = s.p + "_" + h, f[o] = s.data[h], p[o] = s[h], n || (l = new ue(s, h, o, l, s.rxp[h]));
				s = s._next
			}
			return {proxy: p, end: f, firstMPT: l, pt: _}
		}, N.CSSPropTween = function (t, e, s, r, a, o, h, l, _, u, p) {
			this.t = t, this.p = e, this.s = s, this.c = r, this.n = h || e, t instanceof pe || n.push(this.n), this.r = l, this.type = o || 0, _ && (this.pr = _, i = !0), this.b = void 0 === u ? s : u, this.e = void 0 === p ? s + r : p, a && (this._next = a, a._prev = this)
		}), fe = a.parseComplex = function (t, e, i, s, r, n, a, o, h, _) {
			i = i || n || "", a = new pe(t, e, 0, 0, a, _ ? 2 : 1, null, !1, o, i, s), s += "";
			var u, p, f, c, g, v, y, T, w, x, P, S, k = i.split(", ").join(",").split(" "), R = s.split(", ").join(",").split(" "), A = k.length, C = l !== !1;
			for ((-1 !== s.indexOf(",") || -1 !== i.indexOf(",")) && (k = k.join(" ").replace(D, ", ").split(" "), R = R.join(" ").replace(D, ", ").split(" "), A = k.length), A !== R.length && (k = (n || "").split(" "), A = k.length), a.plugin = h, a.setRatio = _, u = 0; A > u; u++)if (c = k[u], g = R[u], T = parseFloat(c), T || 0 === T)a.appendXtra("", T, ie(g, T), g.replace(d, ""), C && -1 !== g.indexOf("px"), !0); else if (r && ("#" === c.charAt(0) || ne[c] || b.test(c)))S = "," === g.charAt(g.length - 1) ? ")," : ")", c = oe(c), g = oe(g), w = c.length + g.length > 6, w && !U && 0 === g[3] ? (a["xs" + a.l] += a.l ? " transparent" : "transparent", a.e = a.e.split(R[u]).join("transparent")) : (U || (w = !1), a.appendXtra(w ? "rgba(" : "rgb(", c[0], g[0] - c[0], ",", !0, !0).appendXtra("", c[1], g[1] - c[1], ",", !0).appendXtra("", c[2], g[2] - c[2], w ? "," : S, !0), w && (c = 4 > c.length ? 1 : c[3], a.appendXtra("", c, (4 > g.length ? 1 : g[3]) - c, S, !1))); else if (v = c.match(m)) {
				if (y = g.match(d), !y || y.length !== v.length)return a;
				for (f = 0, p = 0; v.length > p; p++)P = v[p], x = c.indexOf(P, f), a.appendXtra(c.substr(f, x - f), Number(P), ie(y[p], P), "", C && "px" === c.substr(x + P.length, 2), 0 === p), f = x + P.length;
				a["xs" + a.l] += c.substr(f)
			} else a["xs" + a.l] += a.l ? " " + c : c;
			if (-1 !== s.indexOf("=") && a.data) {
				for (S = a.xs0 + a.data.s, u = 1; a.l > u; u++)S += a["xs" + u] + a.data["xn" + u];
				a.e = S + a["xs" + u]
			}
			return a.l || (a.type = -1, a.xs0 = a.e), a.xfirst || a
		}, ce = 9;
		for (h = pe.prototype, h.l = h.pr = 0; --ce > 0;)h["xn" + ce] = 0, h["xs" + ce] = "";
		h.xs0 = "", h._next = h._prev = h.xfirst = h.data = h.plugin = h.setRatio = h.rxp = null, h.appendXtra = function (t, e, i, s, r, n) {
			var a = this, o = a.l;
			return a["xs" + o] += n && o ? " " + t : t || "", i || 0 === o || a.plugin ? (a.l++, a.type = a.setRatio ? 2 : 1, a["xs" + a.l] = s || "", o > 0 ? (a.data["xn" + o] = e + i, a.rxp["xn" + o] = r, a["xn" + o] = e, a.plugin || (a.xfirst = new pe(a, "xn" + o, e, i, a.xfirst || a, 0, a.n, r, a.pr), a.xfirst.xs0 = 0), a) : (a.data = {s: e + i}, a.rxp = {}, a.s = e, a.c = i, a.r = r, a)) : (a["xs" + o] += e + (s || ""), a)
		};
		var me = function (t, e) {
			e = e || {}, this.p = e.prefix ? V(t) || t : t, o[t] = o[this.p] = this, this.format = e.formatter || le(e.defaultValue, e.color, e.collapsible, e.multi), e.parser && (this.parse = e.parser), this.clrs = e.color, this.multi = e.multi, this.keyword = e.keyword, this.dflt = e.defaultValue, this.pr = e.priority || 0
		}, de = N._registerComplexSpecialProp = function (t, e, i) {
			"object" != typeof e && (e = {parser: i});
			var s, r, n = t.split(","), a = e.defaultValue;
			for (i = i || [a], s = 0; n.length > s; s++)e.prefix = 0 === s && e.prefix, e.defaultValue = i[s] || a, r = new me(n[s], e)
		}, ge = function (t) {
			if (!o[t]) {
				var e = t.charAt(0).toUpperCase() + t.substr(1) + "Plugin";
				de(t, {
					parser: function (t, i, s, r, n, a, h) {
						var l = (window.GreenSockGlobals || window).com.greensock.plugins[e];
						return l ? (l._cssRegister(), o[s].parse(t, i, s, r, n, a, h)) : (j("Error: " + e + " js file not loaded."), n)
					}
				})
			}
		};
		h = me.prototype, h.parseComplex = function (t, e, i, s, r, n) {
			var a, o, h, l, _, u, p = this.keyword;
			if (this.multi && (D.test(i) || D.test(e) ? (o = e.replace(D, "|").split("|"), h = i.replace(D, "|").split("|")) : p && (o = [e], h = [i])), h) {
				for (l = h.length > o.length ? h.length : o.length, a = 0; l > a; a++)e = o[a] = o[a] || this.dflt, i = h[a] = h[a] || this.dflt, p && (_ = e.indexOf(p), u = i.indexOf(p), _ !== u && (i = -1 === u ? h : o, i[a] += " " + p));
				e = o.join(", "), i = h.join(", ")
			}
			return fe(t, this.p, e, i, this.clrs, this.dflt, s, this.pr, r, n)
		}, h.parse = function (t, e, i, s, n, a) {
			return this.parseComplex(t.style, this.format(G(t, this.p, r, !1, this.dflt)), this.format(e), n, a)
		}, a.registerSpecialProp = function (t, e, i) {
			de(t, {
				parser: function (t, s, r, n, a, o) {
					var h = new pe(t, r, 0, 0, a, 2, r, !1, i);
					return h.plugin = o, h.setRatio = e(t, s, n._tween, r), h
				}, priority: i
			})
		};
		var ve = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective".split(","), ye = V("transform"), Te = B + "transform", we = V("transformOrigin"), xe = null !== V("perspective"), be = N.Transform = function () {
			this.skewY = 0
		}, Pe = N.getTransform = function (t, e, i, s) {
			if (t._gsTransform && i && !s)return t._gsTransform;
			var r, n, o, h, l, _, u, p, f, c, m, d, g, v = i ? t._gsTransform || new be : new be, y = 0 > v.scaleX, T = 2e-5, w = 1e5, x = 179.99, b = x * M, P = xe ? parseFloat(G(t, we, e, !1, "0 0 0").split(" ")[2]) || v.zOrigin || 0 : 0;
			for (ye ? r = G(t, Te, e, !0) : t.currentStyle && (r = t.currentStyle.filter.match(C), r = r && 4 === r.length ? [r[0].substr(4), Number(r[2].substr(4)), Number(r[1].substr(4)), r[3].substr(4), v.x || 0, v.y || 0].join(",") : ""), n = (r || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [], o = n.length; --o > -1;)h = Number(n[o]), n[o] = (l = h - (h |= 0)) ? (0 | l * w + (0 > l ? -.5 : .5)) / w + h : h;
			if (16 === n.length) {
				var S = n[8], k = n[9], R = n[10], A = n[12], O = n[13], D = n[14];
				if (v.zOrigin && (D = -v.zOrigin, A = S * D - n[12], O = k * D - n[13], D = R * D + v.zOrigin - n[14]), !i || s || null == v.rotationX) {
					var I, E, L, F, N, X, U, Y = n[0], j = n[1], B = n[2], q = n[3], V = n[4], W = n[5], $ = n[6], Z = n[7], Q = n[11], H = Math.atan2($, R), K = -b > H || H > b;
					v.rotationX = H * z, H && (F = Math.cos(-H), N = Math.sin(-H), I = V * F + S * N, E = W * F + k * N, L = $ * F + R * N, S = V * -N + S * F, k = W * -N + k * F, R = $ * -N + R * F, Q = Z * -N + Q * F, V = I, W = E, $ = L), H = Math.atan2(S, Y), v.rotationY = H * z, H && (X = -b > H || H > b, F = Math.cos(-H), N = Math.sin(-H), I = Y * F - S * N, E = j * F - k * N, L = B * F - R * N, k = j * N + k * F, R = B * N + R * F, Q = q * N + Q * F, Y = I, j = E, B = L), H = Math.atan2(j, W), v.rotation = H * z, H && (U = -b > H || H > b, F = Math.cos(-H), N = Math.sin(-H), Y = Y * F + V * N, E = j * F + W * N, W = j * -N + W * F, $ = B * -N + $ * F, j = E), U && K ? v.rotation = v.rotationX = 0 : U && X ? v.rotation = v.rotationY = 0 : X && K && (v.rotationY = v.rotationX = 0), v.scaleX = (0 | Math.sqrt(Y * Y + j * j) * w + .5) / w, v.scaleY = (0 | Math.sqrt(W * W + k * k) * w + .5) / w, v.scaleZ = (0 | Math.sqrt($ * $ + R * R) * w + .5) / w, v.skewX = 0, v.perspective = Q ? 1 / (0 > Q ? -Q : Q) : 0, v.x = A, v.y = O, v.z = D
				}
			} else if (!(xe && !s && n.length && v.x === n[4] && v.y === n[5] && (v.rotationX || v.rotationY) || void 0 !== v.x && "none" === G(t, "display", e))) {
				var J = n.length >= 6, te = J ? n[0] : 1, ee = n[1] || 0, ie = n[2] || 0, se = J ? n[3] : 1;
				v.x = n[4] || 0, v.y = n[5] || 0, _ = Math.sqrt(te * te + ee * ee), u = Math.sqrt(se * se + ie * ie), p = te || ee ? Math.atan2(ee, te) * z : v.rotation || 0, f = ie || se ? Math.atan2(ie, se) * z + p : v.skewX || 0, c = _ - Math.abs(v.scaleX || 0), m = u - Math.abs(v.scaleY || 0), Math.abs(f) > 90 && 270 > Math.abs(f) && (y ? (_ *= -1, f += 0 >= p ? 180 : -180, p += 0 >= p ? 180 : -180) : (u *= -1, f += 0 >= f ? 180 : -180)), d = (p - v.rotation) % 180, g = (f - v.skewX) % 180, (void 0 === v.skewX || c > T || -T > c || m > T || -T > m || d > -x && x > d && false | d * w || g > -x && x > g && false | g * w) && (v.scaleX = _, v.scaleY = u, v.rotation = p, v.skewX = f), xe && (v.rotationX = v.rotationY = v.z = 0, v.perspective = parseFloat(a.defaultTransformPerspective) || 0, v.scaleZ = 1)
			}
			v.zOrigin = P;
			for (o in v)T > v[o] && v[o] > -T && (v[o] = 0);
			return i && (t._gsTransform = v), v
		}, Se = function (t) {
			var e, i, s = this.data, r = -s.rotation * M, n = r + s.skewX * M, a = 1e5, o = (0 | Math.cos(r) * s.scaleX * a) / a, h = (0 | Math.sin(r) * s.scaleX * a) / a, l = (0 | Math.sin(n) * -s.scaleY * a) / a, _ = (0 | Math.cos(n) * s.scaleY * a) / a, u = this.t.style, p = this.t.currentStyle;
			if (p) {
				i = h, h = -l, l = -i, e = p.filter, u.filter = "";
				var f, m, d = this.t.offsetWidth, g = this.t.offsetHeight, v = "absolute" !== p.position, w = "progid:DXImageTransform.Microsoft.Matrix(M11=" + o + ", M12=" + h + ", M21=" + l + ", M22=" + _, x = s.x, b = s.y;
				if (null != s.ox && (f = (s.oxp ? .01 * d * s.ox : s.ox) - d / 2, m = (s.oyp ? .01 * g * s.oy : s.oy) - g / 2, x += f - (f * o + m * h), b += m - (f * l + m * _)), v ? (f = d / 2, m = g / 2, w += ", Dx=" + (f - (f * o + m * h) + x) + ", Dy=" + (m - (f * l + m * _) + b) + ")") : w += ", sizingMethod='auto expand')", u.filter = -1 !== e.indexOf("DXImageTransform.Microsoft.Matrix(") ? e.replace(O, w) : w + " " + e, (0 === t || 1 === t) && 1 === o && 0 === h && 0 === l && 1 === _ && (v && -1 === w.indexOf("Dx=0, Dy=0") || T.test(e) && 100 !== parseFloat(RegExp.$1) || -1 === e.indexOf("gradient(" && e.indexOf("Alpha")) && u.removeAttribute("filter")), !v) {
					var P, S, k, R = 8 > c ? 1 : -1;
					for (f = s.ieOffsetX || 0, m = s.ieOffsetY || 0, s.ieOffsetX = Math.round((d - ((0 > o ? -o : o) * d + (0 > h ? -h : h) * g)) / 2 + x), s.ieOffsetY = Math.round((g - ((0 > _ ? -_ : _) * g + (0 > l ? -l : l) * d)) / 2 + b), ce = 0; 4 > ce; ce++)S = J[ce], P = p[S], i = -1 !== P.indexOf("px") ? parseFloat(P) : $(this.t, S, parseFloat(P), P.replace(y, "")) || 0, k = i !== s[S] ? 2 > ce ? -s.ieOffsetX : -s.ieOffsetY : 2 > ce ? f - s.ieOffsetX : m - s.ieOffsetY, u[S] = (s[S] = Math.round(i - k * (0 === ce || 2 === ce ? 1 : R))) + "px"
				}
			}
		}, ke = N.set3DTransformRatio = function (t) {
			var e, i, s, r, n, a, o, h, l, _, u, f, c, m, d, g, v, y, T, w, x, b, P, S = this.data, k = this.t.style, R = S.rotation * M, A = S.scaleX, C = S.scaleY, O = S.scaleZ, D = S.perspective;
			if (!(1 !== t && 0 !== t || "auto" !== S.force3D || S.rotationY || S.rotationX || 1 !== O || D || S.z))return Re.call(this, t), void 0;
			if (p) {
				var z = 1e-4;
				z > A && A > -z && (A = O = 2e-5), z > C && C > -z && (C = O = 2e-5), !D || S.z || S.rotationX || S.rotationY || (D = 0)
			}
			if (R || S.skewX)y = Math.cos(R), T = Math.sin(R), e = y, n = T, S.skewX && (R -= S.skewX * M, y = Math.cos(R), T = Math.sin(R), "simple" === S.skewType && (w = Math.tan(S.skewX * M), w = Math.sqrt(1 + w * w), y *= w, T *= w)), i = -T, a = y; else {
				if (!(S.rotationY || S.rotationX || 1 !== O || D))return k[ye] = "translate3d(" + S.x + "px," + S.y + "px," + S.z + "px)" + (1 !== A || 1 !== C ? " scale(" + A + "," + C + ")" : ""), void 0;
				e = a = 1, i = n = 0
			}
			u = 1, s = r = o = h = l = _ = f = c = m = 0, d = D ? -1 / D : 0, g = S.zOrigin, v = 1e5, R = S.rotationY * M, R && (y = Math.cos(R), T = Math.sin(R), l = u * -T, c = d * -T, s = e * T, o = n * T, u *= y, d *= y, e *= y, n *= y), R = S.rotationX * M, R && (y = Math.cos(R), T = Math.sin(R), w = i * y + s * T, x = a * y + o * T, b = _ * y + u * T, P = m * y + d * T, s = i * -T + s * y, o = a * -T + o * y, u = _ * -T + u * y, d = m * -T + d * y, i = w, a = x, _ = b, m = P), 1 !== O && (s *= O, o *= O, u *= O, d *= O), 1 !== C && (i *= C, a *= C, _ *= C, m *= C), 1 !== A && (e *= A, n *= A, l *= A, c *= A), g && (f -= g, r = s * f, h = o * f, f = u * f + g), r = (w = (r += S.x) - (r |= 0)) ? (0 | w * v + (0 > w ? -.5 : .5)) / v + r : r, h = (w = (h += S.y) - (h |= 0)) ? (0 | w * v + (0 > w ? -.5 : .5)) / v + h : h, f = (w = (f += S.z) - (f |= 0)) ? (0 | w * v + (0 > w ? -.5 : .5)) / v + f : f, k[ye] = "matrix3d(" + [(0 | e * v) / v, (0 | n * v) / v, (0 | l * v) / v, (0 | c * v) / v, (0 | i * v) / v, (0 | a * v) / v, (0 | _ * v) / v, (0 | m * v) / v, (0 | s * v) / v, (0 | o * v) / v, (0 | u * v) / v, (0 | d * v) / v, r, h, f, D ? 1 + -f / D : 1].join(",") + ")"
		}, Re = N.set2DTransformRatio = function (t) {
			var e, i, s, r, n, a = this.data, o = this.t, h = o.style;
			return a.rotationX || a.rotationY || a.z || a.force3D === !0 || "auto" === a.force3D && 1 !== t && 0 !== t ? (this.setRatio = ke, ke.call(this, t), void 0) : (a.rotation || a.skewX ? (e = a.rotation * M, i = e - a.skewX * M, s = 1e5, r = a.scaleX * s, n = a.scaleY * s, h[ye] = "matrix(" + (0 | Math.cos(e) * r) / s + "," + (0 | Math.sin(e) * r) / s + "," + (0 | Math.sin(i) * -n) / s + "," + (0 | Math.cos(i) * n) / s + "," + a.x + "," + a.y + ")") : h[ye] = "matrix(" + a.scaleX + ",0,0," + a.scaleY + "," + a.x + "," + a.y + ")", void 0)
		};
		de("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType", {
			parser: function (t, e, i, s, n, o, h) {
				if (s._transform)return n;
				var l, _, u, p, f, c, m, d = s._transform = Pe(t, r, !0, h.parseTransform), g = t.style, v = 1e-6, y = ve.length, T = h, w = {};
				if ("string" == typeof T.transform && ye)u = L.style, u[ye] = T.transform, u.display = "block", u.position = "absolute", E.body.appendChild(L), l = Pe(L, null, !1), E.body.removeChild(L); else if ("object" == typeof T) {
					if (l = {
							scaleX: se(null != T.scaleX ? T.scaleX : T.scale, d.scaleX),
							scaleY: se(null != T.scaleY ? T.scaleY : T.scale, d.scaleY),
							scaleZ: se(T.scaleZ, d.scaleZ),
							x: se(T.x, d.x),
							y: se(T.y, d.y),
							z: se(T.z, d.z),
							perspective: se(T.transformPerspective, d.perspective)
						}, m = T.directionalRotation, null != m)if ("object" == typeof m)for (u in m)T[u] = m[u]; else T.rotation = m;
					l.rotation = re("rotation"in T ? T.rotation : "shortRotation"in T ? T.shortRotation + "_short" : "rotationZ"in T ? T.rotationZ : d.rotation, d.rotation, "rotation", w), xe && (l.rotationX = re("rotationX"in T ? T.rotationX : "shortRotationX"in T ? T.shortRotationX + "_short" : d.rotationX || 0, d.rotationX, "rotationX", w), l.rotationY = re("rotationY"in T ? T.rotationY : "shortRotationY"in T ? T.shortRotationY + "_short" : d.rotationY || 0, d.rotationY, "rotationY", w)), l.skewX = null == T.skewX ? d.skewX : re(T.skewX, d.skewX), l.skewY = null == T.skewY ? d.skewY : re(T.skewY, d.skewY), (_ = l.skewY - d.skewY) && (l.skewX += _, l.rotation += _)
				}
				for (xe && null != T.force3D && (d.force3D = T.force3D, c = !0), d.skewType = T.skewType || d.skewType || a.defaultSkewType, f = d.force3D || d.z || d.rotationX || d.rotationY || l.z || l.rotationX || l.rotationY || l.perspective, f || null == T.scale || (l.scaleZ = 1); --y > -1;)i = ve[y], p = l[i] - d[i], (p > v || -v > p || null != I[i]) && (c = !0, n = new pe(d, i, d[i], p, n), i in w && (n.e = w[i]), n.xs0 = 0, n.plugin = o, s._overwriteProps.push(n.n));
				return p = T.transformOrigin, (p || xe && f && d.zOrigin) && (ye ? (c = !0, i = we, p = (p || G(t, i, r, !1, "50% 50%")) + "", n = new pe(g, i, 0, 0, n, -1, "transformOrigin"), n.b = g[i], n.plugin = o, xe ? (u = d.zOrigin, p = p.split(" "), d.zOrigin = (p.length > 2 && (0 === u || "0px" !== p[2]) ? parseFloat(p[2]) : u) || 0, n.xs0 = n.e = p[0] + " " + (p[1] || "50%") + " 0px", n = new pe(d, "zOrigin", 0, 0, n, -1, n.n), n.b = u, n.xs0 = n.e = d.zOrigin) : n.xs0 = n.e = p) : ee(p + "", d)), c && (s._transformType = f || 3 === this._transformType ? 3 : 2), n
			}, prefix: !0
		}), de("boxShadow", {
			defaultValue: "0px 0px 0px 0px #999",
			prefix: !0,
			color: !0,
			multi: !0,
			keyword: "inset"
		}), de("borderRadius", {
			defaultValue: "0px", parser: function (t, e, i, n, a) {
				e = this.format(e);
				var o, h, l, _, u, p, f, c, m, d, g, v, y, T, w, x, b = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"], P = t.style;
				for (m = parseFloat(t.offsetWidth), d = parseFloat(t.offsetHeight), o = e.split(" "), h = 0; b.length > h; h++)this.p.indexOf("border") && (b[h] = V(b[h])), u = _ = G(t, b[h], r, !1, "0px"), -1 !== u.indexOf(" ") && (_ = u.split(" "), u = _[0], _ = _[1]), p = l = o[h], f = parseFloat(u), v = u.substr((f + "").length), y = "=" === p.charAt(1), y ? (c = parseInt(p.charAt(0) + "1", 10), p = p.substr(2), c *= parseFloat(p), g = p.substr((c + "").length - (0 > c ? 1 : 0)) || "") : (c = parseFloat(p), g = p.substr((c + "").length)), "" === g && (g = s[i] || v), g !== v && (T = $(t, "borderLeft", f, v), w = $(t, "borderTop", f, v), "%" === g ? (u = 100 * (T / m) + "%", _ = 100 * (w / d) + "%") : "em" === g ? (x = $(t, "borderLeft", 1, "em"), u = T / x + "em", _ = w / x + "em") : (u = T + "px", _ = w + "px"), y && (p = parseFloat(u) + c + g, l = parseFloat(_) + c + g)), a = fe(P, b[h], u + " " + _, p + " " + l, !1, "0px", a);
				return a
			}, prefix: !0, formatter: le("0px 0px 0px 0px", !1, !0)
		}), de("backgroundPosition", {
			defaultValue: "0 0", parser: function (t, e, i, s, n, a) {
				var o, h, l, _, u, p, f = "background-position", m = r || W(t, null), d = this.format((m ? c ? m.getPropertyValue(f + "-x") + " " + m.getPropertyValue(f + "-y") : m.getPropertyValue(f) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"), g = this.format(e);
				if (-1 !== d.indexOf("%") != (-1 !== g.indexOf("%")) && (p = G(t, "backgroundImage").replace(k, ""), p && "none" !== p)) {
					for (o = d.split(" "), h = g.split(" "), F.setAttribute("src", p), l = 2; --l > -1;)d = o[l], _ = -1 !== d.indexOf("%"), _ !== (-1 !== h[l].indexOf("%")) && (u = 0 === l ? t.offsetWidth - F.width : t.offsetHeight - F.height, o[l] = _ ? parseFloat(d) / 100 * u + "px" : 100 * (parseFloat(d) / u) + "%");
					d = o.join(" ")
				}
				return this.parseComplex(t.style, d, g, n, a)
			}, formatter: ee
		}), de("backgroundSize", {defaultValue: "0 0", formatter: ee}), de("perspective", {
			defaultValue: "0px",
			prefix: !0
		}), de("perspectiveOrigin", {
			defaultValue: "50% 50%",
			prefix: !0
		}), de("transformStyle", {prefix: !0}), de("backfaceVisibility", {prefix: !0}), de("userSelect", {prefix: !0}), de("margin", {parser: _e("marginTop,marginRight,marginBottom,marginLeft")}), de("padding", {parser: _e("paddingTop,paddingRight,paddingBottom,paddingLeft")}), de("clip", {
			defaultValue: "rect(0px,0px,0px,0px)",
			parser: function (t, e, i, s, n, a) {
				var o, h, l;
				return 9 > c ? (h = t.currentStyle, l = 8 > c ? " " : ",", o = "rect(" + h.clipTop + l + h.clipRight + l + h.clipBottom + l + h.clipLeft + ")", e = this.format(e).split(",").join(l)) : (o = this.format(G(t, this.p, r, !1, this.dflt)), e = this.format(e)), this.parseComplex(t.style, o, e, n, a)
			}
		}), de("textShadow", {
			defaultValue: "0px 0px 0px #999",
			color: !0,
			multi: !0
		}), de("autoRound,strictUnits", {
			parser: function (t, e, i, s, r) {
				return r
			}
		}), de("border", {
			defaultValue: "0px solid #000", parser: function (t, e, i, s, n, a) {
				return this.parseComplex(t.style, this.format(G(t, "borderTopWidth", r, !1, "0px") + " " + G(t, "borderTopStyle", r, !1, "solid") + " " + G(t, "borderTopColor", r, !1, "#000")), this.format(e), n, a)
			}, color: !0, formatter: function (t) {
				var e = t.split(" ");
				return e[0] + " " + (e[1] || "solid") + " " + (t.match(he) || ["#000"])[0]
			}
		}), de("borderWidth", {parser: _e("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}), de("float,cssFloat,styleFloat", {
			parser: function (t, e, i, s, r) {
				var n = t.style, a = "cssFloat"in n ? "cssFloat" : "styleFloat";
				return new pe(n, a, 0, 0, r, -1, i, !1, 0, n[a], e)
			}
		});
		var Ae = function (t) {
			var e, i = this.t, s = i.filter || G(this.data, "filter"), r = 0 | this.s + this.c * t;
			100 === r && (-1 === s.indexOf("atrix(") && -1 === s.indexOf("radient(") && -1 === s.indexOf("oader(") ? (i.removeAttribute("filter"), e = !G(this.data, "filter")) : (i.filter = s.replace(x, ""), e = !0)), e || (this.xn1 && (i.filter = s = s || "alpha(opacity=" + r + ")"), -1 === s.indexOf("pacity") ? 0 === r && this.xn1 || (i.filter = s + " alpha(opacity=" + r + ")") : i.filter = s.replace(T, "opacity=" + r))
		};
		de("opacity,alpha,autoAlpha", {
			defaultValue: "1", parser: function (t, e, i, s, n, a) {
				var o = parseFloat(G(t, "opacity", r, !1, "1")), h = t.style, l = "autoAlpha" === i;
				return "string" == typeof e && "=" === e.charAt(1) && (e = ("-" === e.charAt(0) ? -1 : 1) * parseFloat(e.substr(2)) + o), l && 1 === o && "hidden" === G(t, "visibility", r) && 0 !== e && (o = 0), U ? n = new pe(h, "opacity", o, e - o, n) : (n = new pe(h, "opacity", 100 * o, 100 * (e - o), n), n.xn1 = l ? 1 : 0, h.zoom = 1, n.type = 2, n.b = "alpha(opacity=" + n.s + ")", n.e = "alpha(opacity=" + (n.s + n.c) + ")", n.data = t, n.plugin = a, n.setRatio = Ae), l && (n = new pe(h, "visibility", 0, 0, n, -1, null, !1, 0, 0 !== o ? "inherit" : "hidden", 0 === e ? "hidden" : "inherit"), n.xs0 = "inherit", s._overwriteProps.push(n.n), s._overwriteProps.push(i)), n
			}
		});
		var Ce = function (t, e) {
			e && (t.removeProperty ? ("ms" === e.substr(0, 2) && (e = "M" + e.substr(1)), t.removeProperty(e.replace(P, "-$1").toLowerCase())) : t.removeAttribute(e))
		}, Oe = function (t) {
			if (this.t._gsClassPT = this, 1 === t || 0 === t) {
				this.t.setAttribute("class", 0 === t ? this.b : this.e);
				for (var e = this.data, i = this.t.style; e;)e.v ? i[e.p] = e.v : Ce(i, e.p), e = e._next;
				1 === t && this.t._gsClassPT === this && (this.t._gsClassPT = null)
			} else this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e)
		};
		de("className", {
			parser: function (t, e, s, n, a, o, h) {
				var l, _, u, p, f, c = t.getAttribute("class") || "", m = t.style.cssText;
				if (a = n._classNamePT = new pe(t, s, 0, 0, a, 2), a.setRatio = Oe, a.pr = -11, i = !0, a.b = c, _ = Q(t, r), u = t._gsClassPT) {
					for (p = {}, f = u.data; f;)p[f.p] = 1, f = f._next;
					u.setRatio(1)
				}
				return t._gsClassPT = a, a.e = "=" !== e.charAt(1) ? e : c.replace(RegExp("\\s*\\b" + e.substr(2) + "\\b"), "") + ("+" === e.charAt(0) ? " " + e.substr(2) : ""), n._tween._duration && (t.setAttribute("class", a.e), l = H(t, _, Q(t), h, p), t.setAttribute("class", c), a.data = l.firstMPT, t.style.cssText = m, a = a.xfirst = n.parse(t, l.difs, a, o)), a
			}
		});
		var De = function (t) {
			if ((1 === t || 0 === t) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
				var e, i, s, r, n = this.t.style, a = o.transform.parse;
				if ("all" === this.e)n.cssText = "", r = !0; else for (e = this.e.split(","), s = e.length; --s > -1;)i = e[s], o[i] && (o[i].parse === a ? r = !0 : i = "transformOrigin" === i ? we : o[i].p), Ce(n, i);
				r && (Ce(n, ye), this.t._gsTransform && delete this.t._gsTransform)
			}
		};
		for (de("clearProps", {
			parser: function (t, e, s, r, n) {
				return n = new pe(t, s, 0, 0, n, 2), n.setRatio = De, n.e = e, n.pr = -10, n.data = r._tween, i = !0, n
			}
		}), h = "bezier,throwProps,physicsProps,physics2D".split(","), ce = h.length; ce--;)ge(h[ce]);
		h = a.prototype, h._firstPT = null, h._onInitTween = function (t, e, o) {
			if (!t.nodeType)return !1;
			this._target = t, this._tween = o, this._vars = e, l = e.autoRound, i = !1, s = e.suffixMap || a.suffixMap, r = W(t, ""), n = this._overwriteProps;
			var h, p, c, m, d, g, v, y, T, x = t.style;
			if (_ && "" === x.zIndex && (h = G(t, "zIndex", r), ("auto" === h || "" === h) && this._addLazySet(x, "zIndex", 0)), "string" == typeof e && (m = x.cssText, h = Q(t, r), x.cssText = m + ";" + e, h = H(t, h, Q(t)).difs, !U && w.test(e) && (h.opacity = parseFloat(RegExp.$1)), e = h, x.cssText = m), this._firstPT = p = this.parse(t, e, null), this._transformType) {
				for (T = 3 === this._transformType, ye ? u && (_ = !0, "" === x.zIndex && (v = G(t, "zIndex", r), ("auto" === v || "" === v) && this._addLazySet(x, "zIndex", 0)), f && this._addLazySet(x, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (T ? "visible" : "hidden"))) : x.zoom = 1, c = p; c && c._next;)c = c._next;
				y = new pe(t, "transform", 0, 0, null, 2), this._linkCSSP(y, null, c), y.setRatio = T && xe ? ke : ye ? Re : Se, y.data = this._transform || Pe(t, r, !0), n.pop()
			}
			if (i) {
				for (; p;) {
					for (g = p._next, c = m; c && c.pr > p.pr;)c = c._next;
					(p._prev = c ? c._prev : d) ? p._prev._next = p : m = p, (p._next = c) ? c._prev = p : d = p, p = g
				}
				this._firstPT = m
			}
			return !0
		}, h.parse = function (t, e, i, n) {
			var a, h, _, u, p, f, c, m, d, g, v = t.style;
			for (a in e)f = e[a], h = o[a], h ? i = h.parse(t, f, a, this, i, n, e) : (p = G(t, a, r) + "", d = "string" == typeof f, "color" === a || "fill" === a || "stroke" === a || -1 !== a.indexOf("Color") || d && b.test(f) ? (d || (f = oe(f), f = (f.length > 3 ? "rgba(" : "rgb(") + f.join(",") + ")"), i = fe(v, a, p, f, !0, "transparent", i, 0, n)) : !d || -1 === f.indexOf(" ") && -1 === f.indexOf(",") ? (_ = parseFloat(p), c = _ || 0 === _ ? p.substr((_ + "").length) : "", ("" === p || "auto" === p) && ("width" === a || "height" === a ? (_ = te(t, a, r), c = "px") : "left" === a || "top" === a ? (_ = Z(t, a, r), c = "px") : (_ = "opacity" !== a ? 0 : 1, c = "")), g = d && "=" === f.charAt(1), g ? (u = parseInt(f.charAt(0) + "1", 10), f = f.substr(2), u *= parseFloat(f), m = f.replace(y, "")) : (u = parseFloat(f), m = d ? f.substr((u + "").length) || "" : ""), "" === m && (m = a in s ? s[a] : c), f = u || 0 === u ? (g ? u + _ : u) + m : e[a], c !== m && "" !== m && (u || 0 === u) && _ && (_ = $(t, a, _, c), "%" === m ? (_ /= $(t, a, 100, "%") / 100, e.strictUnits !== !0 && (p = _ + "%")) : "em" === m ? _ /= $(t, a, 1, "em") : "px" !== m && (u = $(t, a, u, m), m = "px"), g && (u || 0 === u) && (f = u + _ + m)), g && (u += _), !_ && 0 !== _ || !u && 0 !== u ? void 0 !== v[a] && (f || "NaN" != f + "" && null != f) ? (i = new pe(v, a, u || _ || 0, 0, i, -1, a, !1, 0, p, f), i.xs0 = "none" !== f || "display" !== a && -1 === a.indexOf("Style") ? f : p) : j("invalid " + a + " tween value: " + e[a]) : (i = new pe(v, a, _, u - _, i, 0, a, l !== !1 && ("px" === m || "zIndex" === a), 0, p, f), i.xs0 = m)) : i = fe(v, a, p, f, !0, null, i, 0, n)), n && i && !i.plugin && (i.plugin = n);
			return i
		}, h.setRatio = function (t) {
			var e, i, s, r = this._firstPT, n = 1e-6;
			if (1 !== t || this._tween._time !== this._tween._duration && 0 !== this._tween._time)if (t || this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1e-6)for (; r;) {
				if (e = r.c * t + r.s, r.r ? e = Math.round(e) : n > e && e > -n && (e = 0), r.type)if (1 === r.type)if (s = r.l, 2 === s)r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2; else if (3 === s)r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3; else if (4 === s)r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3 + r.xn3 + r.xs4; else if (5 === s)r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3 + r.xn3 + r.xs4 + r.xn4 + r.xs5; else {
					for (i = r.xs0 + e + r.xs1, s = 1; r.l > s; s++)i += r["xn" + s] + r["xs" + (s + 1)];
					r.t[r.p] = i
				} else-1 === r.type ? r.t[r.p] = r.xs0 : r.setRatio && r.setRatio(t); else r.t[r.p] = e + r.xs0;
				r = r._next
			} else for (; r;)2 !== r.type ? r.t[r.p] = r.b : r.setRatio(t), r = r._next; else for (; r;)2 !== r.type ? r.t[r.p] = r.e : r.setRatio(t), r = r._next
		}, h._enableTransforms = function (t) {
			this._transformType = t || 3 === this._transformType ? 3 : 2, this._transform = this._transform || Pe(this._target, r, !0)
		};
		var Me = function () {
			this.t[this.p] = this.e, this.data._linkCSSP(this, this._next, null, !0)
		};
		h._addLazySet = function (t, e, i) {
			var s = this._firstPT = new pe(t, e, 0, 0, this._firstPT, 2);
			s.e = i, s.setRatio = Me, s.data = this
		}, h._linkCSSP = function (t, e, i, s) {
			return t && (e && (e._prev = t), t._next && (t._next._prev = t._prev), t._prev ? t._prev._next = t._next : this._firstPT === t && (this._firstPT = t._next, s = !0), i ? i._next = t : s || null !== this._firstPT || (this._firstPT = t), t._next = e, t._prev = i), t
		}, h._kill = function (e) {
			var i, s, r, n = e;
			if (e.autoAlpha || e.alpha) {
				n = {};
				for (s in e)n[s] = e[s];
				n.opacity = 1, n.autoAlpha && (n.visibility = 1)
			}
			return e.className && (i = this._classNamePT) && (r = i.xfirst, r && r._prev ? this._linkCSSP(r._prev, i._next, r._prev._prev) : r === this._firstPT && (this._firstPT = i._next), i._next && this._linkCSSP(i._next, i._next._next, r._prev), this._classNamePT = null), t.prototype._kill.call(this, n)
		};
		var ze = function (t, e, i) {
			var s, r, n, a;
			if (t.slice)for (r = t.length; --r > -1;)ze(t[r], e, i); else for (s = t.childNodes, r = s.length; --r > -1;)n = s[r], a = n.type, n.style && (e.push(Q(n)), i && i.push(n)), 1 !== a && 9 !== a && 11 !== a || !n.childNodes.length || ze(n, e, i)
		};
		return a.cascadeTo = function (t, i, s) {
			var r, n, a, o = e.to(t, i, s), h = [o], l = [], _ = [], u = [], p = e._internals.reservedProps;
			for (t = o._targets || o.target, ze(t, l, u), o.render(i, !0), ze(t, _), o.render(0, !0), o._enabled(!0), r = u.length; --r > -1;)if (n = H(u[r], l[r], _[r]), n.firstMPT) {
				n = n.difs;
				for (a in s)p[a] && (n[a] = s[a]);
				h.push(e.to(u[r], i, n))
			}
			return h
		}, t.activate([a]), a
	}, !0), function () {
		var t = window._gsDefine.plugin({
			propName: "roundProps", priority: -1, API: 2, init: function (t, e, i) {
				return this._tween = i, !0
			}
		}), e = t.prototype;
		e._onInitAllProps = function () {
			for (var t, e, i, s = this._tween, r = s.vars.roundProps instanceof Array ? s.vars.roundProps : s.vars.roundProps.split(","), n = r.length, a = {}, o = s._propLookup.roundProps; --n > -1;)a[r[n]] = 1;
			for (n = r.length; --n > -1;)for (t = r[n], e = s._firstPT; e;)i = e._next, e.pg ? e.t._roundProps(a, !0) : e.n === t && (this._add(e.t, t, e.s, e.c), i && (i._prev = e._prev), e._prev ? e._prev._next = i : s._firstPT === e && (s._firstPT = i), e._next = e._prev = null, s._propLookup[t] = o), e = i;
			return !1
		}, e._add = function (t, e, i, s) {
			this._addTween(t, e, i, i + s, e, !0), this._overwriteProps.push(e)
		}
	}(), window._gsDefine.plugin({
		propName: "attr", API: 2, version: "0.3.2", init: function (t, e) {
			var i, s, r;
			if ("function" != typeof t.setAttribute)return !1;
			this._target = t, this._proxy = {}, this._start = {}, this._end = {};
			for (i in e)this._start[i] = this._proxy[i] = s = t.getAttribute(i), r = this._addTween(this._proxy, i, parseFloat(s), e[i], i), this._end[i] = r ? r.s + r.c : e[i], this._overwriteProps.push(i);
			return !0
		}, set: function (t) {
			this._super.setRatio.call(this, t);
			for (var e, i = this._overwriteProps, s = i.length, r = 1 === t ? this._end : t ? this._proxy : this._start; --s > -1;)e = i[s], this._target.setAttribute(e, r[e] + "")
		}
	}), window._gsDefine.plugin({
		propName: "directionalRotation", API: 2, version: "0.2.0", init: function (t, e) {
			"object" != typeof e && (e = {rotation: e}), this.finals = {};
			var i, s, r, n, a, o, h = e.useRadians === !0 ? 2 * Math.PI : 360, l = 1e-6;
			for (i in e)"useRadians" !== i && (o = (e[i] + "").split("_"), s = o[0], r = parseFloat("function" != typeof t[i] ? t[i] : t[i.indexOf("set") || "function" != typeof t["get" + i.substr(3)] ? i : "get" + i.substr(3)]()), n = this.finals[i] = "string" == typeof s && "=" === s.charAt(1) ? r + parseInt(s.charAt(0) + "1", 10) * Number(s.substr(2)) : Number(s) || 0, a = n - r, o.length && (s = o.join("_"), -1 !== s.indexOf("short") && (a %= h, a !== a % (h / 2) && (a = 0 > a ? a + h : a - h)), -1 !== s.indexOf("_cw") && 0 > a ? a = (a + 9999999999 * h) % h - (0 | a / h) * h : -1 !== s.indexOf("ccw") && a > 0 && (a = (a - 9999999999 * h) % h - (0 | a / h) * h)), (a > l || -l > a) && (this._addTween(t, i, r, r + a, i), this._overwriteProps.push(i)));
			return !0
		}, set: function (t) {
			var e;
			if (1 !== t)this._super.setRatio.call(this, t); else for (e = this._firstPT; e;)e.f ? e.t[e.p](this.finals[e.p]) : e.t[e.p] = this.finals[e.p], e = e._next
		}
	})._autoCSS = !0, window._gsDefine("easing.Back", ["easing.Ease"], function (t) {
		var e, i, s, r = window.GreenSockGlobals || window, n = r.com.greensock, a = 2 * Math.PI, o = Math.PI / 2, h = n._class, l = function (e, i) {
			var s = h("easing." + e, function () {
			}, !0), r = s.prototype = new t;
			return r.constructor = s, r.getRatio = i, s
		}, _ = t.register || function () {
			}, u = function (t, e, i, s) {
			var r = h("easing." + t, {easeOut: new e, easeIn: new i, easeInOut: new s}, !0);
			return _(r, t), r
		}, p = function (t, e, i) {
			this.t = t, this.v = e, i && (this.next = i, i.prev = this, this.c = i.v - e, this.gap = i.t - t)
		}, f = function (e, i) {
			var s = h("easing." + e, function (t) {
				this._p1 = t || 0 === t ? t : 1.70158, this._p2 = 1.525 * this._p1
			}, !0), r = s.prototype = new t;
			return r.constructor = s, r.getRatio = i, r.config = function (t) {
				return new s(t)
			}, s
		}, c = u("Back", f("BackOut", function (t) {
			return (t -= 1) * t * ((this._p1 + 1) * t + this._p1) + 1
		}), f("BackIn", function (t) {
			return t * t * ((this._p1 + 1) * t - this._p1)
		}), f("BackInOut", function (t) {
			return 1 > (t *= 2) ? .5 * t * t * ((this._p2 + 1) * t - this._p2) : .5 * ((t -= 2) * t * ((this._p2 + 1) * t + this._p2) + 2)
		})), m = h("easing.SlowMo", function (t, e, i) {
			e = e || 0 === e ? e : .7, null == t ? t = .7 : t > 1 && (t = 1), this._p = 1 !== t ? e : 0, this._p1 = (1 - t) / 2, this._p2 = t, this._p3 = this._p1 + this._p2, this._calcEnd = i === !0
		}, !0), d = m.prototype = new t;
		return d.constructor = m, d.getRatio = function (t) {
			var e = t + (.5 - t) * this._p;
			return this._p1 > t ? this._calcEnd ? 1 - (t = 1 - t / this._p1) * t : e - (t = 1 - t / this._p1) * t * t * t * e : t > this._p3 ? this._calcEnd ? 1 - (t = (t - this._p3) / this._p1) * t : e + (t - e) * (t = (t - this._p3) / this._p1) * t * t * t : this._calcEnd ? 1 : e
		}, m.ease = new m(.7, .7), d.config = m.config = function (t, e, i) {
			return new m(t, e, i)
		}, e = h("easing.SteppedEase", function (t) {
			t = t || 1, this._p1 = 1 / t, this._p2 = t + 1
		}, !0), d = e.prototype = new t, d.constructor = e, d.getRatio = function (t) {
			return 0 > t ? t = 0 : t >= 1 && (t = .999999999), (this._p2 * t >> 0) * this._p1
		}, d.config = e.config = function (t) {
			return new e(t)
		}, i = h("easing.RoughEase", function (e) {
			e = e || {};
			for (var i, s, r, n, a, o, h = e.taper || "none", l = [], _ = 0, u = 0 | (e.points || 20), f = u, c = e.randomize !== !1, m = e.clamp === !0, d = e.template instanceof t ? e.template : null, g = "number" == typeof e.strength ? .4 * e.strength : .4; --f > -1;)i = c ? Math.random() : 1 / u * f, s = d ? d.getRatio(i) : i, "none" === h ? r = g : "out" === h ? (n = 1 - i, r = n * n * g) : "in" === h ? r = i * i * g : .5 > i ? (n = 2 * i, r = .5 * n * n * g) : (n = 2 * (1 - i), r = .5 * n * n * g), c ? s += Math.random() * r - .5 * r : f % 2 ? s += .5 * r : s -= .5 * r, m && (s > 1 ? s = 1 : 0 > s && (s = 0)), l[_++] = {
				x: i,
				y: s
			};
			for (l.sort(function (t, e) {
				return t.x - e.x
			}), o = new p(1, 1, null), f = u; --f > -1;)a = l[f], o = new p(a.x, a.y, o);
			this._prev = new p(0, 0, 0 !== o.t ? o : o.next)
		}, !0), d = i.prototype = new t, d.constructor = i, d.getRatio = function (t) {
			var e = this._prev;
			if (t > e.t) {
				for (; e.next && t >= e.t;)e = e.next;
				e = e.prev
			} else for (; e.prev && e.t >= t;)e = e.prev;
			return this._prev = e, e.v + (t - e.t) / e.gap * e.c
		}, d.config = function (t) {
			return new i(t)
		}, i.ease = new i, u("Bounce", l("BounceOut", function (t) {
			return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
		}), l("BounceIn", function (t) {
			return 1 / 2.75 > (t = 1 - t) ? 1 - 7.5625 * t * t : 2 / 2.75 > t ? 1 - (7.5625 * (t -= 1.5 / 2.75) * t + .75) : 2.5 / 2.75 > t ? 1 - (7.5625 * (t -= 2.25 / 2.75) * t + .9375) : 1 - (7.5625 * (t -= 2.625 / 2.75) * t + .984375)
		}), l("BounceInOut", function (t) {
			var e = .5 > t;
			return t = e ? 1 - 2 * t : 2 * t - 1, t = 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375, e ? .5 * (1 - t) : .5 * t + .5
		})), u("Circ", l("CircOut", function (t) {
			return Math.sqrt(1 - (t -= 1) * t)
		}), l("CircIn", function (t) {
			return -(Math.sqrt(1 - t * t) - 1)
		}), l("CircInOut", function (t) {
			return 1 > (t *= 2) ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
		})), s = function (e, i, s) {
			var r = h("easing." + e, function (t, e) {
				this._p1 = t || 1, this._p2 = e || s, this._p3 = this._p2 / a * (Math.asin(1 / this._p1) || 0)
			}, !0), n = r.prototype = new t;
			return n.constructor = r, n.getRatio = i, n.config = function (t, e) {
				return new r(t, e)
			}, r
		}, u("Elastic", s("ElasticOut", function (t) {
			return this._p1 * Math.pow(2, -10 * t) * Math.sin((t - this._p3) * a / this._p2) + 1
		}, .3), s("ElasticIn", function (t) {
			return -(this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * a / this._p2))
		}, .3), s("ElasticInOut", function (t) {
			return 1 > (t *= 2) ? -.5 * this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * a / this._p2) : .5 * this._p1 * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - this._p3) * a / this._p2) + 1
		}, .45)), u("Expo", l("ExpoOut", function (t) {
			return 1 - Math.pow(2, -10 * t)
		}), l("ExpoIn", function (t) {
			return Math.pow(2, 10 * (t - 1)) - .001
		}), l("ExpoInOut", function (t) {
			return 1 > (t *= 2) ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
		})), u("Sine", l("SineOut", function (t) {
			return Math.sin(t * o)
		}), l("SineIn", function (t) {
			return -Math.cos(t * o) + 1
		}), l("SineInOut", function (t) {
			return -.5 * (Math.cos(Math.PI * t) - 1)
		})), h("easing.EaseLookup", {
			find: function (e) {
				return t.map[e]
			}
		}, !0), _(r.SlowMo, "SlowMo", "ease,"), _(i, "RoughEase", "ease,"), _(e, "SteppedEase", "ease,"), c
	}, !0)
}), function (t) {
	"use strict";
	var e = t.GreenSockGlobals || t;
	if (!e.TweenLite) {
		var i, s, r, n, a, o = function (t) {
			var i, s = t.split("."), r = e;
			for (i = 0; s.length > i; i++)r[s[i]] = r = r[s[i]] || {};
			return r
		}, h = o("com.greensock"), l = 1e-10, _ = [].slice, u = function () {
		}, p = function () {
			var t = Object.prototype.toString, e = t.call([]);
			return function (i) {
				return null != i && (i instanceof Array || "object" == typeof i && !!i.push && t.call(i) === e)
			}
		}(), f = {}, c = function (i, s, r, n) {
			this.sc = f[i] ? f[i].sc : [], f[i] = this, this.gsClass = null, this.func = r;
			var a = [];
			this.check = function (h) {
				for (var l, _, u, p, m = s.length, d = m; --m > -1;)(l = f[s[m]] || new c(s[m], [])).gsClass ? (a[m] = l.gsClass, d--) : h && l.sc.push(this);
				if (0 === d && r)for (_ = ("com.greensock." + i).split("."), u = _.pop(), p = o(_.join("."))[u] = this.gsClass = r.apply(r, a), n && (e[u] = p, "function" == typeof define && define.amd ? define((t.GreenSockAMDPath ? t.GreenSockAMDPath + "/" : "") + i.split(".").join("/"), [], function () {
					return p
				}) : "undefined" != typeof module && module.exports && (module.exports = p)), m = 0; this.sc.length > m; m++)this.sc[m].check()
			}, this.check(!0)
		}, m = t._gsDefine = function (t, e, i, s) {
			return new c(t, e, i, s)
		}, d = h._class = function (t, e, i) {
			return e = e || function () {
			}, m(t, [], function () {
				return e
			}, i), e
		};
		m.globals = e;
		var g = [0, 0, 1, 1], v = [], y = d("easing.Ease", function (t, e, i, s) {
			this._func = t, this._type = i || 0, this._power = s || 0, this._params = e ? g.concat(e) : g
		}, !0), T = y.map = {}, w = y.register = function (t, e, i, s) {
			for (var r, n, a, o, l = e.split(","), _ = l.length, u = (i || "easeIn,easeOut,easeInOut").split(","); --_ > -1;)for (n = l[_], r = s ? d("easing." + n, null, !0) : h.easing[n] || {}, a = u.length; --a > -1;)o = u[a], T[n + "." + o] = T[o + n] = r[o] = t.getRatio ? t : t[o] || new t
		};
		for (r = y.prototype, r._calcEnd = !1, r.getRatio = function (t) {
			if (this._func)return this._params[0] = t, this._func.apply(null, this._params);
			var e = this._type, i = this._power, s = 1 === e ? 1 - t : 2 === e ? t : .5 > t ? 2 * t : 2 * (1 - t);
			return 1 === i ? s *= s : 2 === i ? s *= s * s : 3 === i ? s *= s * s * s : 4 === i && (s *= s * s * s * s), 1 === e ? 1 - s : 2 === e ? s : .5 > t ? s / 2 : 1 - s / 2
		}, i = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"], s = i.length; --s > -1;)r = i[s] + ",Power" + s, w(new y(null, null, 1, s), r, "easeOut", !0), w(new y(null, null, 2, s), r, "easeIn" + (0 === s ? ",easeNone" : "")), w(new y(null, null, 3, s), r, "easeInOut");
		T.linear = h.easing.Linear.easeIn, T.swing = h.easing.Quad.easeInOut;
		var x = d("events.EventDispatcher", function (t) {
			this._listeners = {}, this._eventTarget = t || this
		});
		r = x.prototype, r.addEventListener = function (t, e, i, s, r) {
			r = r || 0;
			var o, h, l = this._listeners[t], _ = 0;
			for (null == l && (this._listeners[t] = l = []), h = l.length; --h > -1;)o = l[h], o.c === e && o.s === i ? l.splice(h, 1) : 0 === _ && r > o.pr && (_ = h + 1);
			l.splice(_, 0, {c: e, s: i, up: s, pr: r}), this !== n || a || n.wake()
		}, r.removeEventListener = function (t, e) {
			var i, s = this._listeners[t];
			if (s)for (i = s.length; --i > -1;)if (s[i].c === e)return s.splice(i, 1), void 0
		}, r.dispatchEvent = function (t) {
			var e, i, s, r = this._listeners[t];
			if (r)for (e = r.length, i = this._eventTarget; --e > -1;)s = r[e], s.up ? s.c.call(s.s || i, {
				type: t,
				target: i
			}) : s.c.call(s.s || i)
		};
		var b = t.requestAnimationFrame, P = t.cancelAnimationFrame, S = Date.now || function () {
				return (new Date).getTime()
			}, k = S();
		for (i = ["ms", "moz", "webkit", "o"], s = i.length; --s > -1 && !b;)b = t[i[s] + "RequestAnimationFrame"], P = t[i[s] + "CancelAnimationFrame"] || t[i[s] + "CancelRequestAnimationFrame"];
		d("Ticker", function (t, e) {
			var i, s, r, o, h, _ = this, p = S(), f = e !== !1 && b, c = 500, m = 33, d = function (t) {
				var e, n, a = S() - k;
				a > c && (p += a - m), k += a, _.time = (k - p) / 1e3, e = _.time - h, (!i || e > 0 || t === !0) && (_.frame++, h += e + (e >= o ? .004 : o - e), n = !0), t !== !0 && (r = s(d)), n && _.dispatchEvent("tick")
			};
			x.call(_), _.time = _.frame = 0, _.tick = function () {
				d(!0)
			}, _.lagSmoothing = function (t, e) {
				c = t || 1 / l, m = Math.min(e, c, 0)
			}, _.sleep = function () {
				null != r && (f && P ? P(r) : clearTimeout(r), s = u, r = null, _ === n && (a = !1))
			}, _.wake = function () {
				null !== r ? _.sleep() : _.frame > 10 && (k = S() - c + 5), s = 0 === i ? u : f && b ? b : function (t) {
					return setTimeout(t, 0 | 1e3 * (h - _.time) + 1)
				}, _ === n && (a = !0), d(2)
			}, _.fps = function (t) {
				return arguments.length ? (i = t, o = 1 / (i || 60), h = this.time + o, _.wake(), void 0) : i
			}, _.useRAF = function (t) {
				return arguments.length ? (_.sleep(), f = t, _.fps(i), void 0) : f
			}, _.fps(t), setTimeout(function () {
				f && (!r || 5 > _.frame) && _.useRAF(!1)
			}, 1500)
		}), r = h.Ticker.prototype = new h.events.EventDispatcher, r.constructor = h.Ticker;
		var R = d("core.Animation", function (t, e) {
			if (this.vars = e = e || {}, this._duration = this._totalDuration = t || 0, this._delay = Number(e.delay) || 0, this._timeScale = 1, this._active = e.immediateRender === !0, this.data = e.data, this._reversed = e.reversed === !0, j) {
				a || n.wake();
				var i = this.vars.useFrames ? Y : j;
				i.add(this, i._time), this.vars.paused && this.paused(!0)
			}
		});
		n = R.ticker = new h.Ticker, r = R.prototype, r._dirty = r._gc = r._initted = r._paused = !1, r._totalTime = r._time = 0, r._rawPrevTime = -1, r._next = r._last = r._onUpdate = r._timeline = r.timeline = null, r._paused = !1;
		var A = function () {
			a && S() - k > 2e3 && n.wake(), setTimeout(A, 2e3)
		};
		A(), r.play = function (t, e) {
			return null != t && this.seek(t, e), this.reversed(!1).paused(!1)
		}, r.pause = function (t, e) {
			return null != t && this.seek(t, e), this.paused(!0)
		}, r.resume = function (t, e) {
			return null != t && this.seek(t, e), this.paused(!1)
		}, r.seek = function (t, e) {
			return this.totalTime(Number(t), e !== !1)
		}, r.restart = function (t, e) {
			return this.reversed(!1).paused(!1).totalTime(t ? -this._delay : 0, e !== !1, !0)
		}, r.reverse = function (t, e) {
			return null != t && this.seek(t || this.totalDuration(), e), this.reversed(!0).paused(!1)
		}, r.render = function () {
		}, r.invalidate = function () {
			return this
		}, r.isActive = function () {
			var t, e = this._timeline, i = this._startTime;
			return !e || !this._gc && !this._paused && e.isActive() && (t = e.rawTime()) >= i && i + this.totalDuration() / this._timeScale > t
		}, r._enabled = function (t, e) {
			return a || n.wake(), this._gc = !t, this._active = this.isActive(), e !== !0 && (t && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !t && this.timeline && this._timeline._remove(this, !0)), !1
		}, r._kill = function () {
			return this._enabled(!1, !1)
		}, r.kill = function (t, e) {
			return this._kill(t, e), this
		}, r._uncache = function (t) {
			for (var e = t ? this : this.timeline; e;)e._dirty = !0, e = e.timeline;
			return this
		}, r._swapSelfInParams = function (t) {
			for (var e = t.length, i = t.concat(); --e > -1;)"{self}" === t[e] && (i[e] = this);
			return i
		}, r.eventCallback = function (t, e, i, s) {
			if ("on" === (t || "").substr(0, 2)) {
				var r = this.vars;
				if (1 === arguments.length)return r[t];
				null == e ? delete r[t] : (r[t] = e, r[t + "Params"] = p(i) && -1 !== i.join("").indexOf("{self}") ? this._swapSelfInParams(i) : i, r[t + "Scope"] = s), "onUpdate" === t && (this._onUpdate = e)
			}
			return this
		}, r.delay = function (t) {
			return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + t - this._delay), this._delay = t, this) : this._delay
		}, r.duration = function (t) {
			return arguments.length ? (this._duration = this._totalDuration = t, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== t && this.totalTime(this._totalTime * (t / this._duration), !0), this) : (this._dirty = !1, this._duration)
		}, r.totalDuration = function (t) {
			return this._dirty = !1, arguments.length ? this.duration(t) : this._totalDuration
		}, r.time = function (t, e) {
			return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(t > this._duration ? this._duration : t, e)) : this._time
		}, r.totalTime = function (t, e, i) {
			if (a || n.wake(), !arguments.length)return this._totalTime;
			if (this._timeline) {
				if (0 > t && !i && (t += this.totalDuration()), this._timeline.smoothChildTiming) {
					this._dirty && this.totalDuration();
					var s = this._totalDuration, r = this._timeline;
					if (t > s && !i && (t = s), this._startTime = (this._paused ? this._pauseTime : r._time) - (this._reversed ? s - t : t) / this._timeScale, r._dirty || this._uncache(!1), r._timeline)for (; r._timeline;)r._timeline._time !== (r._startTime + r._totalTime) / r._timeScale && r.totalTime(r._totalTime, !0), r = r._timeline
				}
				this._gc && this._enabled(!0, !1), (this._totalTime !== t || 0 === this._duration) && (this.render(t, e, !1), z.length && B())
			}
			return this
		}, r.progress = r.totalProgress = function (t, e) {
			return arguments.length ? this.totalTime(this.duration() * t, e) : this._time / this.duration()
		}, r.startTime = function (t) {
			return arguments.length ? (t !== this._startTime && (this._startTime = t, this.timeline && this.timeline._sortChildren && this.timeline.add(this, t - this._delay)), this) : this._startTime
		}, r.timeScale = function (t) {
			if (!arguments.length)return this._timeScale;
			if (t = t || l, this._timeline && this._timeline.smoothChildTiming) {
				var e = this._pauseTime, i = e || 0 === e ? e : this._timeline.totalTime();
				this._startTime = i - (i - this._startTime) * this._timeScale / t
			}
			return this._timeScale = t, this._uncache(!1)
		}, r.reversed = function (t) {
			return arguments.length ? (t != this._reversed && (this._reversed = t, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed
		}, r.paused = function (t) {
			if (!arguments.length)return this._paused;
			if (t != this._paused && this._timeline) {
				a || t || n.wake();
				var e = this._timeline, i = e.rawTime(), s = i - this._pauseTime;
				!t && e.smoothChildTiming && (this._startTime += s, this._uncache(!1)), this._pauseTime = t ? i : null, this._paused = t, this._active = this.isActive(), !t && 0 !== s && this._initted && this.duration() && this.render(e.smoothChildTiming ? this._totalTime : (i - this._startTime) / this._timeScale, !0, !0)
			}
			return this._gc && !t && this._enabled(!0, !1), this
		};
		var C = d("core.SimpleTimeline", function (t) {
			R.call(this, 0, t), this.autoRemoveChildren = this.smoothChildTiming = !0
		});
		r = C.prototype = new R, r.constructor = C, r.kill()._gc = !1, r._first = r._last = null, r._sortChildren = !1, r.add = r.insert = function (t, e) {
			var i, s;
			if (t._startTime = Number(e || 0) + t._delay, t._paused && this !== t._timeline && (t._pauseTime = t._startTime + (this.rawTime() - t._startTime) / t._timeScale), t.timeline && t.timeline._remove(t, !0), t.timeline = t._timeline = this, t._gc && t._enabled(!0, !0), i = this._last, this._sortChildren)for (s = t._startTime; i && i._startTime > s;)i = i._prev;
			return i ? (t._next = i._next, i._next = t) : (t._next = this._first, this._first = t), t._next ? t._next._prev = t : this._last = t, t._prev = i, this._timeline && this._uncache(!0), this
		}, r._remove = function (t, e) {
			return t.timeline === this && (e || t._enabled(!1, !0), t.timeline = null, t._prev ? t._prev._next = t._next : this._first === t && (this._first = t._next), t._next ? t._next._prev = t._prev : this._last === t && (this._last = t._prev), this._timeline && this._uncache(!0)), this
		}, r.render = function (t, e, i) {
			var s, r = this._first;
			for (this._totalTime = this._time = this._rawPrevTime = t; r;)s = r._next, (r._active || t >= r._startTime && !r._paused) && (r._reversed ? r.render((r._dirty ? r.totalDuration() : r._totalDuration) - (t - r._startTime) * r._timeScale, e, i) : r.render((t - r._startTime) * r._timeScale, e, i)), r = s
		}, r.rawTime = function () {
			return a || n.wake(), this._totalTime
		};
		var O = d("TweenLite", function (e, i, s) {
			if (R.call(this, i, s), this.render = O.prototype.render, null == e)throw"Cannot tween a null target.";
			this.target = e = "string" != typeof e ? e : O.selector(e) || e;
			var r, n, a, o = e.jquery || e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType), h = this.vars.overwrite;
			if (this._overwrite = h = null == h ? U[O.defaultOverwrite] : "number" == typeof h ? h >> 0 : U[h], (o || e instanceof Array || e.push && p(e)) && "number" != typeof e[0])for (this._targets = a = _.call(e, 0), this._propLookup = [], this._siblings = [], r = 0; a.length > r; r++)n = a[r], n ? "string" != typeof n ? n.length && n !== t && n[0] && (n[0] === t || n[0].nodeType && n[0].style && !n.nodeType) ? (a.splice(r--, 1), this._targets = a = a.concat(_.call(n, 0))) : (this._siblings[r] = q(n, this, !1), 1 === h && this._siblings[r].length > 1 && V(n, this, null, 1, this._siblings[r])) : (n = a[r--] = O.selector(n), "string" == typeof n && a.splice(r + 1, 1)) : a.splice(r--, 1); else this._propLookup = {}, this._siblings = q(e, this, !1), 1 === h && this._siblings.length > 1 && V(e, this, null, 1, this._siblings);
			(this.vars.immediateRender || 0 === i && 0 === this._delay && this.vars.immediateRender !== !1) && (this._time = -l, this.render(-this._delay))
		}, !0), D = function (e) {
			return e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType)
		}, M = function (t, e) {
			var i, s = {};
			for (i in t)X[i] || i in e && "transform" !== i && "x" !== i && "y" !== i && "width" !== i && "height" !== i && "className" !== i && "border" !== i || !(!L[i] || L[i] && L[i]._autoCSS) || (s[i] = t[i], delete t[i]);
			t.css = s
		};
		r = O.prototype = new R, r.constructor = O, r.kill()._gc = !1, r.ratio = 0, r._firstPT = r._targets = r._overwrittenProps = r._startAt = null, r._notifyPluginsOfEnabled = r._lazy = !1, O.version = "1.12.1", O.defaultEase = r._ease = new y(null, null, 1, 1), O.defaultOverwrite = "auto", O.ticker = n, O.autoSleep = !0, O.lagSmoothing = function (t, e) {
			n.lagSmoothing(t, e)
		}, O.selector = t.$ || t.jQuery || function (e) {
			return t.$ ? (O.selector = t.$, t.$(e)) : t.document ? t.document.getElementById("#" === e.charAt(0) ? e.substr(1) : e) : e
		};
		var z = [], I = {}, E = O._internals = {
			isArray: p,
			isSelector: D,
			lazyTweens: z
		}, L = O._plugins = {}, F = E.tweenLookup = {}, N = 0, X = E.reservedProps = {
			ease: 1,
			delay: 1,
			overwrite: 1,
			onComplete: 1,
			onCompleteParams: 1,
			onCompleteScope: 1,
			useFrames: 1,
			runBackwards: 1,
			startAt: 1,
			onUpdate: 1,
			onUpdateParams: 1,
			onUpdateScope: 1,
			onStart: 1,
			onStartParams: 1,
			onStartScope: 1,
			onReverseComplete: 1,
			onReverseCompleteParams: 1,
			onReverseCompleteScope: 1,
			onRepeat: 1,
			onRepeatParams: 1,
			onRepeatScope: 1,
			easeParams: 1,
			yoyo: 1,
			immediateRender: 1,
			repeat: 1,
			repeatDelay: 1,
			data: 1,
			paused: 1,
			reversed: 1,
			autoCSS: 1,
			lazy: 1
		}, U = {
			none: 0,
			all: 1,
			auto: 2,
			concurrent: 3,
			allOnStart: 4,
			preexisting: 5,
			"true": 1,
			"false": 0
		}, Y = R._rootFramesTimeline = new C, j = R._rootTimeline = new C, B = function () {
			var t = z.length;
			for (I = {}; --t > -1;)i = z[t], i && i._lazy !== !1 && (i.render(i._lazy, !1, !0), i._lazy = !1);
			z.length = 0
		};
		j._startTime = n.time, Y._startTime = n.frame, j._active = Y._active = !0, setTimeout(B, 1), R._updateRoot = O.render = function () {
			var t, e, i;
			if (z.length && B(), j.render((n.time - j._startTime) * j._timeScale, !1, !1), Y.render((n.frame - Y._startTime) * Y._timeScale, !1, !1), z.length && B(), !(n.frame % 120)) {
				for (i in F) {
					for (e = F[i].tweens, t = e.length; --t > -1;)e[t]._gc && e.splice(t, 1);
					0 === e.length && delete F[i]
				}
				if (i = j._first, (!i || i._paused) && O.autoSleep && !Y._first && 1 === n._listeners.tick.length) {
					for (; i && i._paused;)i = i._next;
					i || n.sleep()
				}
			}
		}, n.addEventListener("tick", R._updateRoot);
		var q = function (t, e, i) {
			var s, r, n = t._gsTweenID;
			if (F[n || (t._gsTweenID = n = "t" + N++)] || (F[n] = {
					target: t,
					tweens: []
				}), e && (s = F[n].tweens, s[r = s.length] = e, i))for (; --r > -1;)s[r] === e && s.splice(r, 1);
			return F[n].tweens
		}, V = function (t, e, i, s, r) {
			var n, a, o, h;
			if (1 === s || s >= 4) {
				for (h = r.length, n = 0; h > n; n++)if ((o = r[n]) !== e)o._gc || o._enabled(!1, !1) && (a = !0); else if (5 === s)break;
				return a
			}
			var _, u = e._startTime + l, p = [], f = 0, c = 0 === e._duration;
			for (n = r.length; --n > -1;)(o = r[n]) === e || o._gc || o._paused || (o._timeline !== e._timeline ? (_ = _ || W(e, 0, c), 0 === W(o, _, c) && (p[f++] = o)) : u >= o._startTime && o._startTime + o.totalDuration() / o._timeScale > u && ((c || !o._initted) && 2e-10 >= u - o._startTime || (p[f++] = o)));
			for (n = f; --n > -1;)o = p[n], 2 === s && o._kill(i, t) && (a = !0), (2 !== s || !o._firstPT && o._initted) && o._enabled(!1, !1) && (a = !0);
			return a
		}, W = function (t, e, i) {
			for (var s = t._timeline, r = s._timeScale, n = t._startTime; s._timeline;) {
				if (n += s._startTime, r *= s._timeScale, s._paused)return -100;
				s = s._timeline
			}
			return n /= r, n > e ? n - e : i && n === e || !t._initted && 2 * l > n - e ? l : (n += t.totalDuration() / t._timeScale / r) > e + l ? 0 : n - e - l
		};
		r._init = function () {
			var t, e, i, s, r, n = this.vars, a = this._overwrittenProps, o = this._duration, h = !!n.immediateRender, l = n.ease;
			if (n.startAt) {
				this._startAt && (this._startAt.render(-1, !0), this._startAt.kill()), r = {};
				for (s in n.startAt)r[s] = n.startAt[s];
				if (r.overwrite = !1, r.immediateRender = !0, r.lazy = h && n.lazy !== !1, r.startAt = r.delay = null, this._startAt = O.to(this.target, 0, r), h)if (this._time > 0)this._startAt = null; else if (0 !== o)return
			} else if (n.runBackwards && 0 !== o)if (this._startAt)this._startAt.render(-1, !0), this._startAt.kill(), this._startAt = null; else {
				i = {};
				for (s in n)X[s] && "autoCSS" !== s || (i[s] = n[s]);
				if (i.overwrite = 0, i.data = "isFromStart", i.lazy = h && n.lazy !== !1, i.immediateRender = h, this._startAt = O.to(this.target, 0, i), h) {
					if (0 === this._time)return
				} else this._startAt._init(), this._startAt._enabled(!1)
			}
			if (this._ease = l ? l instanceof y ? n.easeParams instanceof Array ? l.config.apply(l, n.easeParams) : l : "function" == typeof l ? new y(l, n.easeParams) : T[l] || O.defaultEase : O.defaultEase, this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets)for (t = this._targets.length; --t > -1;)this._initProps(this._targets[t], this._propLookup[t] = {}, this._siblings[t], a ? a[t] : null) && (e = !0); else e = this._initProps(this.target, this._propLookup, this._siblings, a);
			if (e && O._onPluginEvent("_onInitAllProps", this), a && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), n.runBackwards)for (i = this._firstPT; i;)i.s += i.c, i.c = -i.c, i = i._next;
			this._onUpdate = n.onUpdate, this._initted = !0
		}, r._initProps = function (e, i, s, r) {
			var n, a, o, h, l, _;
			if (null == e)return !1;
			I[e._gsTweenID] && B(), this.vars.css || e.style && e !== t && e.nodeType && L.css && this.vars.autoCSS !== !1 && M(this.vars, e);
			for (n in this.vars) {
				if (_ = this.vars[n], X[n])_ && (_ instanceof Array || _.push && p(_)) && -1 !== _.join("").indexOf("{self}") && (this.vars[n] = _ = this._swapSelfInParams(_, this)); else if (L[n] && (h = new L[n])._onInitTween(e, this.vars[n], this)) {
					for (this._firstPT = l = {
						_next: this._firstPT,
						t: h,
						p: "setRatio",
						s: 0,
						c: 1,
						f: !0,
						n: n,
						pg: !0,
						pr: h._priority
					}, a = h._overwriteProps.length; --a > -1;)i[h._overwriteProps[a]] = this._firstPT;
					(h._priority || h._onInitAllProps) && (o = !0), (h._onDisable || h._onEnable) && (this._notifyPluginsOfEnabled = !0)
				} else this._firstPT = i[n] = l = {
					_next: this._firstPT,
					t: e,
					p: n,
					f: "function" == typeof e[n],
					n: n,
					pg: !1,
					pr: 0
				}, l.s = l.f ? e[n.indexOf("set") || "function" != typeof e["get" + n.substr(3)] ? n : "get" + n.substr(3)]() : parseFloat(e[n]), l.c = "string" == typeof _ && "=" === _.charAt(1) ? parseInt(_.charAt(0) + "1", 10) * Number(_.substr(2)) : Number(_) - l.s || 0;
				l && l._next && (l._next._prev = l)
			}
			return r && this._kill(r, e) ? this._initProps(e, i, s, r) : this._overwrite > 1 && this._firstPT && s.length > 1 && V(e, this, i, this._overwrite, s) ? (this._kill(i, e), this._initProps(e, i, s, r)) : (this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration) && (I[e._gsTweenID] = !0), o)
		}, r.render = function (t, e, i) {
			var s, r, n, a, o = this._time, h = this._duration, _ = this._rawPrevTime;
			if (t >= h)this._totalTime = this._time = h, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (s = !0, r = "onComplete"), 0 === h && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0), (0 === t || 0 > _ || _ === l) && _ !== t && (i = !0, _ > l && (r = "onReverseComplete")), this._rawPrevTime = a = !e || t || _ === t ? t : l); else if (1e-7 > t)this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== o || 0 === h && _ > 0 && _ !== l) && (r = "onReverseComplete", s = this._reversed), 0 > t ? (this._active = !1, 0 === h && (this._initted || !this.vars.lazy || i) && (_ >= 0 && (i = !0), this._rawPrevTime = a = !e || t || _ === t ? t : l)) : this._initted || (i = !0); else if (this._totalTime = this._time = t, this._easeType) {
				var u = t / h, p = this._easeType, f = this._easePower;
				(1 === p || 3 === p && u >= .5) && (u = 1 - u), 3 === p && (u *= 2), 1 === f ? u *= u : 2 === f ? u *= u * u : 3 === f ? u *= u * u * u : 4 === f && (u *= u * u * u * u), this.ratio = 1 === p ? 1 - u : 2 === p ? u : .5 > t / h ? u / 2 : 1 - u / 2
			} else this.ratio = this._ease.getRatio(t / h);
			if (this._time !== o || i) {
				if (!this._initted) {
					if (this._init(), !this._initted || this._gc)return;
					if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration))return this._time = this._totalTime = o, this._rawPrevTime = _, z.push(this), this._lazy = t, void 0;
					this._time && !s ? this.ratio = this._ease.getRatio(this._time / h) : s && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
				}
				for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== o && t >= 0 && (this._active = !0), 0 === o && (this._startAt && (t >= 0 ? this._startAt.render(t, e, i) : r || (r = "_dummyGS")), this.vars.onStart && (0 !== this._time || 0 === h) && (e || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || v))), n = this._firstPT; n;)n.f ? n.t[n.p](n.c * this.ratio + n.s) : n.t[n.p] = n.c * this.ratio + n.s, n = n._next;
				this._onUpdate && (0 > t && this._startAt && this._startTime && this._startAt.render(t, e, i), e || (this._time !== o || s) && this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || v)), r && (this._gc || (0 > t && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(t, e, i), s && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[r] && this.vars[r].apply(this.vars[r + "Scope"] || this, this.vars[r + "Params"] || v), 0 === h && this._rawPrevTime === l && a !== l && (this._rawPrevTime = 0)))
			}
		}, r._kill = function (t, e) {
			if ("all" === t && (t = null), null == t && (null == e || e === this.target))return this._lazy = !1, this._enabled(!1, !1);
			e = "string" != typeof e ? e || this._targets || this.target : O.selector(e) || e;
			var i, s, r, n, a, o, h, l;
			if ((p(e) || D(e)) && "number" != typeof e[0])for (i = e.length; --i > -1;)this._kill(t, e[i]) && (o = !0); else {
				if (this._targets) {
					for (i = this._targets.length; --i > -1;)if (e === this._targets[i]) {
						a = this._propLookup[i] || {}, this._overwrittenProps = this._overwrittenProps || [], s = this._overwrittenProps[i] = t ? this._overwrittenProps[i] || {} : "all";
						break
					}
				} else {
					if (e !== this.target)return !1;
					a = this._propLookup, s = this._overwrittenProps = t ? this._overwrittenProps || {} : "all"
				}
				if (a) {
					h = t || a, l = t !== s && "all" !== s && t !== a && ("object" != typeof t || !t._tempKill);
					for (r in h)(n = a[r]) && (n.pg && n.t._kill(h) && (o = !0), n.pg && 0 !== n.t._overwriteProps.length || (n._prev ? n._prev._next = n._next : n === this._firstPT && (this._firstPT = n._next), n._next && (n._next._prev = n._prev), n._next = n._prev = null), delete a[r]), l && (s[r] = 1);
					!this._firstPT && this._initted && this._enabled(!1, !1)
				}
			}
			return o
		}, r.invalidate = function () {
			return this._notifyPluginsOfEnabled && O._onPluginEvent("_onDisable", this), this._firstPT = null, this._overwrittenProps = null, this._onUpdate = null, this._startAt = null, this._initted = this._active = this._notifyPluginsOfEnabled = this._lazy = !1, this._propLookup = this._targets ? {} : [], this
		}, r._enabled = function (t, e) {
			if (a || n.wake(), t && this._gc) {
				var i, s = this._targets;
				if (s)for (i = s.length; --i > -1;)this._siblings[i] = q(s[i], this, !0); else this._siblings = q(this.target, this, !0)
			}
			return R.prototype._enabled.call(this, t, e), this._notifyPluginsOfEnabled && this._firstPT ? O._onPluginEvent(t ? "_onEnable" : "_onDisable", this) : !1
		}, O.to = function (t, e, i) {
			return new O(t, e, i)
		}, O.from = function (t, e, i) {
			return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new O(t, e, i)
		}, O.fromTo = function (t, e, i, s) {
			return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, new O(t, e, s)
		}, O.delayedCall = function (t, e, i, s, r) {
			return new O(e, 0, {
				delay: t,
				onComplete: e,
				onCompleteParams: i,
				onCompleteScope: s,
				onReverseComplete: e,
				onReverseCompleteParams: i,
				onReverseCompleteScope: s,
				immediateRender: !1,
				useFrames: r,
				overwrite: 0
			})
		}, O.set = function (t, e) {
			return new O(t, 0, e)
		}, O.getTweensOf = function (t, e) {
			if (null == t)return [];
			t = "string" != typeof t ? t : O.selector(t) || t;
			var i, s, r, n;
			if ((p(t) || D(t)) && "number" != typeof t[0]) {
				for (i = t.length, s = []; --i > -1;)s = s.concat(O.getTweensOf(t[i], e));
				for (i = s.length; --i > -1;)for (n = s[i], r = i; --r > -1;)n === s[r] && s.splice(i, 1)
			} else for (s = q(t).concat(), i = s.length; --i > -1;)(s[i]._gc || e && !s[i].isActive()) && s.splice(i, 1);
			return s
		}, O.killTweensOf = O.killDelayedCallsTo = function (t, e, i) {
			"object" == typeof e && (i = e, e = !1);
			for (var s = O.getTweensOf(t, e), r = s.length; --r > -1;)s[r]._kill(i, t)
		};
		var G = d("plugins.TweenPlugin", function (t, e) {
			this._overwriteProps = (t || "").split(","), this._propName = this._overwriteProps[0], this._priority = e || 0, this._super = G.prototype
		}, !0);
		if (r = G.prototype, G.version = "1.10.1", G.API = 2, r._firstPT = null, r._addTween = function (t, e, i, s, r, n) {
				var a, o;
				return null != s && (a = "number" == typeof s || "=" !== s.charAt(1) ? Number(s) - i : parseInt(s.charAt(0) + "1", 10) * Number(s.substr(2))) ? (this._firstPT = o = {
					_next: this._firstPT,
					t: t,
					p: e,
					s: i,
					c: a,
					f: "function" == typeof t[e],
					n: r || e,
					r: n
				}, o._next && (o._next._prev = o), o) : void 0
			}, r.setRatio = function (t) {
				for (var e, i = this._firstPT, s = 1e-6; i;)e = i.c * t + i.s, i.r ? e = Math.round(e) : s > e && e > -s && (e = 0), i.f ? i.t[i.p](e) : i.t[i.p] = e, i = i._next
			}, r._kill = function (t) {
				var e, i = this._overwriteProps, s = this._firstPT;
				if (null != t[this._propName])this._overwriteProps = []; else for (e = i.length; --e > -1;)null != t[i[e]] && i.splice(e, 1);
				for (; s;)null != t[s.n] && (s._next && (s._next._prev = s._prev), s._prev ? (s._prev._next = s._next, s._prev = null) : this._firstPT === s && (this._firstPT = s._next)), s = s._next;
				return !1
			}, r._roundProps = function (t, e) {
				for (var i = this._firstPT; i;)(t[this._propName] || null != i.n && t[i.n.split(this._propName + "_").join("")]) && (i.r = e), i = i._next
			}, O._onPluginEvent = function (t, e) {
				var i, s, r, n, a, o = e._firstPT;
				if ("_onInitAllProps" === t) {
					for (; o;) {
						for (a = o._next, s = r; s && s.pr > o.pr;)s = s._next;
						(o._prev = s ? s._prev : n) ? o._prev._next = o : r = o, (o._next = s) ? s._prev = o : n = o, o = a
					}
					o = e._firstPT = r
				}
				for (; o;)o.pg && "function" == typeof o.t[t] && o.t[t]() && (i = !0), o = o._next;
				return i
			}, G.activate = function (t) {
				for (var e = t.length; --e > -1;)t[e].API === G.API && (L[(new t[e])._propName] = t[e]);
				return !0
			}, m.plugin = function (t) {
				if (!(t && t.propName && t.init && t.API))throw"illegal plugin definition.";
				var e, i = t.propName, s = t.priority || 0, r = t.overwriteProps, n = {
					init: "_onInitTween",
					set: "setRatio",
					kill: "_kill",
					round: "_roundProps",
					initAll: "_onInitAllProps"
				}, a = d("plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin", function () {
					G.call(this, i, s), this._overwriteProps = r || []
				}, t.global === !0), o = a.prototype = new G(i);
				o.constructor = a, a.API = t.API;
				for (e in n)"function" == typeof t[e] && (o[n[e]] = t[e]);
				return a.version = t.version, G.activate([a]), a
			}, i = t._gsQueue) {
			for (s = 0; i.length > s; s++)i[s]();
			for (r in f)f[r].func || t.console.log("GSAP encountered missing dependency: com.greensock." + r)
		}
		a = !1
	}
}(window);
/*
 * BackgroundCheck
 * http://kennethcachia.com/background-check
 *
 * v1.2.2
 */

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else {
		root.BackgroundCheck = factory(root);
	}

}(this, function () {

	'use strict';

	var resizeEvent = window.orientation !== undefined ? 'orientationchange' : 'resize';
	var supported;
	var canvas;
	var context;
	var throttleDelay;
	var viewport;
	var attrs = {};


	/*
	 * Initializer
	 */
	function init(a) {

		if (a === undefined || a.targets === undefined) {
			throw 'Missing attributes';
		}

		// Default values
		attrs.debug = checkAttr(a.debug, false);
		attrs.debugOverlay = checkAttr(a.debugOverlay, false);
		attrs.targets = getElements(a.targets);
		attrs.images = getElements(a.images || 'img', true);
		attrs.changeParent = checkAttr(a.changeParent, false);
		attrs.threshold = checkAttr(a.threshold, 50);
		attrs.minComplexity = checkAttr(a.minComplexity, 30);
		attrs.minOverlap = checkAttr(a.minOverlap, 50);
		attrs.windowEvents = checkAttr(a.windowEvents, true);
		attrs.maxDuration = checkAttr(a.maxDuration, 500);

		attrs.mask = checkAttr(a.mask, {
			r: 0,
			g: 255,
			b: 0
		});

		attrs.classes = checkAttr(a.classes, {
			dark: 'background--dark',
			light: 'background--light',
			complex: 'background--complex'
		});

		if (supported === undefined) {
			checkSupport();

			if (supported) {
				canvas.style.position = 'fixed';
				canvas.style.top = '0px';
				canvas.style.left = '0px';
				canvas.style.width = '100%';
				canvas.style.height = '100%';

				window.addEventListener(resizeEvent, throttle.bind(null, function () {
					resizeCanvas();
					check();
				}));

				window.addEventListener('scroll', throttle.bind(null, check));

				resizeCanvas();
				check();
			}
		}
	}


	/*
	 * Destructor
	 */
	function destroy() {
		supported = null;
		canvas = null;
		context = null;
		attrs = {};

		if (throttleDelay) {
			clearTimeout(throttleDelay);
		}
	}


	/*
	 * Output debug logs
	 */
	function log(msg) {

		if (get('debug')) {
			console.log(msg);
		}
	}


	/*
	 * Get attribute value, use a default
	 * when undefined
	 */
	function checkAttr(value, def) {
		checkType(value, typeof def);
		return (value === undefined) ? def : value;
	}


	/*
	 * Reject unwanted types
	 */
	function checkType(value, type) {

		if (value !== undefined && typeof value !== type) {
			throw 'Incorrect attribute type';
		}
	}


	/*
	 * Convert elements with background-image
	 * to Images
	 */
	function checkForCSSImages(els) {
		var el;
		var url;
		var list = [];

		for (var e = 0; e < els.length; e++) {
			el = els[e];
			list.push(el);

			if (el.tagName !== 'IMG') {
				url = window.getComputedStyle(el).backgroundImage;

				// Ignore multiple backgrounds
				if (url.split(/,url|, url/).length > 1) {
					throw 'Multiple backgrounds are not supported';
				}

				if (url && url !== 'none') {
					list[e] = {
						img: new Image(),
						el: list[e]
					};

					url = url.slice(4, -1);
					url = url.replace(/"/g, '');

					list[e].img.src = url;
					log('CSS Image - ' + url);
				} else {
					throw 'Element is not an <img> but does not have a background-image';
				}
			}
		}

		return list;
	}


	/*
	 * Check for String, Element or NodeList
	 */
	function getElements(selector, convertToImages) {
		var els = selector;

		if (typeof selector === 'string') {
			els = document.querySelectorAll(selector);
		} else if (selector && selector.nodeType === 1) {
			els = [selector];
		}

		if (!els || els.length === 0 || els.length === undefined) {
			log('Elements not found');
		} else {

			if (convertToImages) {
				els = checkForCSSImages(els);
			}

			els = Array.prototype.slice.call(els);
		}

		return els;
	}


	/*
	 * Check if browser supports <canvas>
	 */
	function checkSupport() {
		canvas = document.createElement('canvas');

		if (canvas && canvas.getContext) {
			context = canvas.getContext('2d');
			supported = true;
		} else {
			supported = false;
		}

		showDebugOverlay();
	}


	/*
	 * Show <canvas> on top of page
	 */
	function showDebugOverlay() {

		if (get('debugOverlay')) {
			canvas.style.opacity = 0.5;
			canvas.style.pointerEvents = 'none';
			document.body.appendChild(canvas);
		} else {

			// Check if it was previously added
			if (canvas.parentNode) {
				canvas.parentNode.removeChild(canvas);
			}
		}
	}


	/*
	 * Stop if it's slow
	 */
	function kill(start) {
		var duration = new Date().getTime() - start;

		log('Duration: ' + duration + 'ms');

		if (duration > get('maxDuration')) {
			// Log a message even when debug is false
			console.log('BackgroundCheck - Killed');
			removeClasses();
			destroy();
		}
	}


	/*
	 * Set width and height of <canvas>
	 */
	function resizeCanvas() {
		viewport = {
			left: 0,
			top: 0,
			right: document.body.clientWidth,
			bottom: window.innerHeight
		};

		canvas.width = document.body.clientWidth;
		canvas.height = window.innerHeight;
	}


	/*
	 * Process px and %, discard anything else
	 */
	function getValue(css, parent, delta) {
		var value;
		var percentage;

		if (css.indexOf('px') !== -1) {
			value = parseFloat(css);
		} else if (css.indexOf('%') !== -1) {
			value = parseFloat(css);
			percentage = value / 100;
			value = percentage * parent;

			if (delta) {
				value -= delta * percentage;
			}
		} else {
			value = parent;
		}

		return value;
	}


	/*
	 * Calculate top, left, width and height
	 * using the object's CSS
	 */
	function calculateAreaFromCSS(obj) {
		var css = window.getComputedStyle(obj.el);

		// Force no-repeat and padding-box
		obj.el.style.backgroundRepeat = 'no-repeat';
		obj.el.style.backgroundOrigin = 'padding-box';

		// Background Size
		var size = css.backgroundSize.split(' ');
		var width = size[0];
		var height = size[1] === undefined ? 'auto' : size[1];

		var parentRatio = obj.el.clientWidth / obj.el.clientHeight;
		var imgRatio = obj.img.naturalWidth / obj.img.naturalHeight;

		if (width === 'cover') {

			if (parentRatio >= imgRatio) {
				width = '100%';
				height = 'auto';
			} else {
				width = 'auto';
				size[0] = 'auto';
				height = '100%';
			}

		} else if (width === 'contain') {

			if (1 / parentRatio < 1 / imgRatio) {
				width = 'auto';
				size[0] = 'auto';
				height = '100%';
			} else {
				width = '100%';
				height = 'auto';
			}
		}

		if (width === 'auto') {
			width = obj.img.naturalWidth;
		} else {
			width = getValue(width, obj.el.clientWidth);
		}

		if (height === 'auto') {
			height = (width / obj.img.naturalWidth) * obj.img.naturalHeight;
		} else {
			height = getValue(height, obj.el.clientHeight);
		}

		if (size[0] === 'auto' && size[1] !== 'auto') {
			width = (height / obj.img.naturalHeight) * obj.img.naturalWidth;
		}

		var position = css.backgroundPosition;

		// Fix inconsistencies between browsers
		if (position === 'top') {
			position = '50% 0%';
		} else if (position === 'left') {
			position = '0% 50%';
		} else if (position === 'right') {
			position = '100% 50%';
		} else if (position === 'bottom') {
			position = '50% 100%';
		} else if (position === 'center') {
			position = '50% 50%';
		}

		position = position.split(' ');

		var x;
		var y;

		// Two-value syntax vs Four-value syntax
		if (position.length === 4) {
			x = position[1];
			y = position[3];
		} else {
			x = position[0];
			y = position[1];
		}

		// Use a default value
		y = y || '50%';

		// Background Position
		x = getValue(x, obj.el.clientWidth, width);
		y = getValue(y, obj.el.clientHeight, height);

		// Take care of ex: background-position: right 20px bottom 20px;
		if (position.length === 4) {

			if (position[0] === 'right') {
				x = obj.el.clientWidth - obj.img.naturalWidth - x;
			}

			if (position[2] === 'bottom') {
				y = obj.el.clientHeight - obj.img.naturalHeight - y;
			}
		}

		x += obj.el.getBoundingClientRect().left;
		y += obj.el.getBoundingClientRect().top;

		return {
			left: Math.floor(x),
			right: Math.floor(x + width),
			top: Math.floor(y),
			bottom: Math.floor(y + height),
			width: Math.floor(width),
			height: Math.floor(height)
		};
	}


	/*
	 * Get Bounding Client Rect
	 */
	function getArea(obj) {
		var area;
		var image;
		var parent;

		if (obj.nodeType) {
			var rect = obj.getBoundingClientRect();

			// Clone ClientRect for modification purposes
			area = {
				left: rect.left,
				right: rect.right,
				top: rect.top,
				bottom: rect.bottom,
				width: rect.width,
				height: rect.height
			};

			parent = obj.parentNode;
			image = obj;
		} else {
			area = calculateAreaFromCSS(obj);
			parent = obj.el;
			image = obj.img;
		}

		parent = parent.getBoundingClientRect();

		area.imageTop = 0;
		area.imageLeft = 0;
		area.imageWidth = image.naturalWidth;
		area.imageHeight = image.naturalHeight;

		var ratio = area.imageHeight / area.height;
		var delta;

		// Stay within the parent's boundary
		if (area.top < parent.top) {
			delta = parent.top - area.top;
			area.imageTop = ratio * delta;
			area.imageHeight -= ratio * delta;
			area.top += delta;
			area.height -= delta;
		}

		if (area.left < parent.left) {
			delta = parent.left - area.left;
			area.imageLeft += ratio * delta;
			area.imageWidth -= ratio * delta;
			area.width -= delta;
			area.left += delta;
		}

		if (area.bottom > parent.bottom) {
			delta = area.bottom - parent.bottom;
			area.imageHeight -= ratio * delta;
			area.height -= delta;
		}

		if (area.right > parent.right) {
			delta = area.right - parent.right;
			area.imageWidth -= ratio * delta;
			area.width -= delta;
		}

		area.imageTop = Math.floor(area.imageTop);
		area.imageLeft = Math.floor(area.imageLeft);
		area.imageHeight = Math.floor(area.imageHeight);
		area.imageWidth = Math.floor(area.imageWidth);

		return area;
	}


	/*
	 * Render image on canvas
	 */
	function drawImage(image) {
		var area = getArea(image);

		image = image.nodeType ? image : image.img;

		if (area.imageWidth > 0 && area.imageHeight > 0 && area.width > 0 && area.height > 0) {
			context.drawImage(image,
				area.imageLeft, area.imageTop, area.imageWidth, area.imageHeight,
				area.left, area.top, area.width, area.height);
		} else {
			log('Skipping image - ' + image.src + ' - area too small');
		}
	}


	/*
	 * Add/remove classes
	 */
	function classList(node, name, mode) {
		var className = node.className;

		switch (mode) {
			case 'add':
				className += ' ' + name;
				break;
			case 'remove':
				var pattern = new RegExp('(?:^|\\s)' + name + '(?!\\S)', 'g');
				className = className.replace(pattern, '');
				break;
		}

		node.className = className.trim();
	}


	/*
	 * Remove classes from element or
	 * their parents, depending on checkParent
	 */
	function removeClasses(el) {
		var targets = el ? [el] : get('targets');
		var target;

		for (var t = 0; t < targets.length; t++) {
			target = targets[t];
			target = get('changeParent') ? target.parentNode : target;

			classList(target, get('classes').light, 'remove');
			classList(target, get('classes').dark, 'remove');
			classList(target, get('classes').complex, 'remove');
		}
	}


	/*
	 * Calculate average pixel brightness of a region
	 * and add 'light' or 'dark' accordingly
	 */
	function calculatePixelBrightness(target) {
		var dims = target.getBoundingClientRect();
		var brightness;
		var data;
		var pixels = 0;
		var delta;
		var deltaSqr = 0;
		var mean = 0;
		var variance;
		var minOverlap = 0;
		var mask = get('mask');

		if (dims.width > 0 && dims.height > 0) {
			removeClasses(target);

			target = get('changeParent') ? target.parentNode : target;
			data = context.getImageData(dims.left, dims.top, dims.width, dims.height).data;

			for (var p = 0; p < data.length; p += 4) {

				if (data[p] === mask.r && data[p + 1] === mask.g && data[p + 2] === mask.b) {
					minOverlap++;
				} else {
					pixels++;
					brightness = (0.2126 * data[p]) + (0.7152 * data[p + 1]) + (0.0722 * data[p + 2]);
					delta = brightness - mean;
					deltaSqr += delta * delta;
					mean = mean + delta / pixels;
				}
			}

			if (minOverlap <= (data.length / 4) * (1 - (get('minOverlap') / 100))) {
				variance = Math.sqrt(deltaSqr / pixels) / 255;
				mean = mean / 255;
				log('Target: ' + target.className + ' lum: ' + mean + ' var: ' + variance);
				classList(target, mean <= (get('threshold') / 100) ? get('classes').dark : get('classes').light, 'add');

				if (variance > get('minComplexity') / 100) {
					classList(target, get('classes').complex, 'add');
				}
			}
		}
	}


	/*
	 * Test if a is within b's boundary
	 */
	function isInside(a, b) {
		a = (a.nodeType ? a : a.el).getBoundingClientRect();
		b = b === viewport ? b : (b.nodeType ? b : b.el).getBoundingClientRect();

		return !(a.right < b.left || a.left > b.right || a.top > b.bottom || a.bottom < b.top);
	}


	/*
	 * Process all targets (checkTarget is undefined)
	 * or a single target (checkTarget is a previously set target)
	 *
	 * When not all images are loaded, checkTarget is an image
	 * to avoid processing all targets multiple times
	 */
	function processTargets(checkTarget) {
		var start = new Date().getTime();
		var mode = (checkTarget && (checkTarget.tagName === 'IMG' || checkTarget.img)) ? 'image' : 'targets';
		var found = checkTarget ? false : true;
		var total = get('targets').length;
		var target;

		for (var t = 0; t < total; t++) {
			target = get('targets')[t];

			if (isInside(target, viewport)) {
				if (mode === 'targets' && (!checkTarget || checkTarget === target)) {
					found = true;
					calculatePixelBrightness(target);
				} else if (mode === 'image' && isInside(target, checkTarget)) {
					calculatePixelBrightness(target);
				}
			}
		}

		if (mode === 'targets' && !found) {
			throw checkTarget + ' is not a target';
		}

		kill(start);
	}


	/*
	 * Find the element's zIndex. Also checks
	 * the zIndex of its parent
	 */
	function getZIndex(el) {
		var calculate = function (el) {
			var zindex = 0;

			if (window.getComputedStyle(el).position !== 'static') {
				zindex = parseInt(window.getComputedStyle(el).zIndex, 10) || 0;

				// Reserve zindex = 0 for elements with position: static;
				if (zindex >= 0) {
					zindex++;
				}
			}

			return zindex;
		};

		var parent = el.parentNode;
		var zIndexParent = parent ? calculate(parent) : 0;
		var zIndexEl = calculate(el);

		return (zIndexParent * 100000) + zIndexEl;
	}


	/*
	 * Check zIndexes
	 */
	function sortImagesByZIndex(images) {
		var sorted = false;
		if (images && images.length) {
			images.sort( function( a, b ) {
				a = a.nodeType ? a : a.el;
				b = b.nodeType ? b : b.el;

				var pos = a.compareDocumentPosition( b );
				var reverse = 0;

				a = getZIndex( a );
				b = getZIndex( b );

				if ( a > b ) {
					sorted = true;
				}

				// Reposition if zIndex is the same but the elements are not
				// sorted according to their document position
				if ( a === b && pos === 2 ) {
					reverse = 1;
				} else if ( a === b && pos === 4 ) {
					reverse = -1;
				}

				return reverse || a - b;
			} );

			log( 'Sorted: ' + sorted );

			if ( sorted ) {
				log( images );
			}
		}

		return sorted;
	}


	/*
	 * Main function
	 */
	function check(target, avoidClear, imageLoaded) {

		if (supported) {
			var mask = get('mask');

			log('--- BackgroundCheck ---');
			log('onLoad event: ' + (imageLoaded && imageLoaded.src));

			if (avoidClear !== true) {
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.fillStyle = 'rgb(' + mask.r + ', ' + mask.g + ', ' + mask.b + ')';
				context.fillRect(0, 0, canvas.width, canvas.height);
			}

			var processImages = imageLoaded ? [imageLoaded] : get('images');
			var sorted = sortImagesByZIndex(processImages);

			var image;
			var imageNode;
			var loading = false;

			for (var i = 0; i < processImages.length; i++) {
				image = processImages[i];

				if (isInside(image, viewport)) {
					imageNode = image.nodeType ? image : image.img;

					if (imageNode.naturalWidth === 0) {
						loading = true;
						log('Loading... ' + image.src);

						imageNode.removeEventListener('load', check);

						if (sorted) {
							// Sorted -- redraw all images
							imageNode.addEventListener('load', check.bind(null, null, false, null));
						} else {
							// Not sorted -- just draw one image
							imageNode.addEventListener('load', check.bind(null, target, true, image));
						}
					} else {
						log('Drawing: ' + image.src);
						drawImage(image);
					}
				}
			}

			if (!imageLoaded && !loading) {
				processTargets(target);
			} else if (imageLoaded) {
				processTargets(imageLoaded);
			}
		}
	}


	/*
	 * Throttle events
	 */
	function throttle(callback) {

		if (get('windowEvents') === true) {

			if (throttleDelay) {
				clearTimeout(throttleDelay);
			}

			throttleDelay = setTimeout(callback, 200);
		}
	}


	/*
	 * Setter
	 */
	function set(property, newValue) {

		if (attrs[property] === undefined) {
			throw 'Unknown property - ' + property;
		} else if (newValue === undefined) {
			throw 'Missing value for ' + property;
		}

		if (property === 'targets' || property === 'images') {

			try {
				newValue = getElements(property === 'images' && !newValue ? 'img' : newValue, property === 'images' ? true : false);
			} catch (err) {
				newValue = [];
				throw err;
			}
		} else {
			checkType(newValue, typeof attrs[property]);
		}

		removeClasses();
		attrs[property] = newValue;
		check();

		if (property === 'debugOverlay') {
			showDebugOverlay();
		}
	}


	/*
	 * Getter
	 */
	function get(property) {

		if (attrs[property] === undefined) {
			throw 'Unknown property - ' + property;
		}

		return attrs[property];
	}


	/*
	 * Get position and size of all images.
	 * Used for testing purposes
	 */
	function getImageData() {
		var images = get('images');
		var area;
		var data = [];

		for (var i = 0; i < images.length; i++) {
			area = getArea(images[i]);
			data.push(area);
		}

		return data;
	}


	return {
		/*
		 * Init and destroy
		 */
		init: init,
		destroy: destroy,

		/*
		 * Expose main function
		 */
		refresh: check,

		/*
		 * Setters and getters
		 */
		set: set,
		get: get,

		/*
		 * Return image data
		 */
		getImageData: getImageData
	};

}));
/* --- $DEBOUNCES RESIZE --- */

/* debouncedresize: special jQuery event that happens once after a window resize
 * https://github.com/louisremi/jquery-smartresize
 * Copyright 2012 @louis_remi
 */
(function ($) {
    var $event = $.event, $special, resizeTimeout;
    $special = $event.special.debouncedresize = {
        setup: function () {
            $(this).on("resize", $special.handler);
        }, teardown: function () {
            $(this).off("resize", $special.handler);
        }, handler: function (event, execAsap) {
            var context = this, args = arguments, dispatch = function () {
                event.type = "debouncedresize";
                $event.dispatch.apply(context, args);
            };
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            execAsap ? dispatch() : resizeTimeout = setTimeout(dispatch, $special.threshold);
        }, threshold: 150
    };
})(jQuery);
/* --- $GMAP3 ---*/

// GMap 3 v5.1.1 by DEMONTE Jean-Baptiste
// http://gmap3.net
(function (y, t) {
	"use strict";
	var z, i = 0;

	function J() {
		if (!z) {
			z = {
				verbose: false,
				queryLimit: {attempt: 5, delay: 250, random: 250},
				classes: {
					Map: google.maps.Map,
					Marker: google.maps.Marker,
					InfoWindow: google.maps.InfoWindow,
					Circle: google.maps.Circle,
					Rectangle: google.maps.Rectangle,
					OverlayView: google.maps.OverlayView,
					StreetViewPanorama: google.maps.StreetViewPanorama,
					KmlLayer: google.maps.KmlLayer,
					TrafficLayer: google.maps.TrafficLayer,
					BicyclingLayer: google.maps.BicyclingLayer,
					GroundOverlay: google.maps.GroundOverlay,
					StyledMapType: google.maps.StyledMapType,
					ImageMapType: google.maps.ImageMapType
				},
				map: {mapTypeId: google.maps.MapTypeId.ROADMAP, center: [46.578498, 2.457275], zoom: 2},
				overlay: {pane: "floatPane", content: "", offset: {x: 0, y: 0}},
				geoloc: {getCurrentPosition: {maximumAge: 60000, timeout: 5000}}
			}
		}
	}

	function k(M, L) {
		return M !== t ? M : "gmap3_" + (L ? i + 1 : ++i)
	}

	function d(L) {
		var O = function (P) {
			return parseInt(P, 10)
		}, N = google.maps.version.split(".").map(O), M;
		L = L.split(".").map(O);
		for (M = 0; M < L.length; M++) {
			if (N.hasOwnProperty(M)) {
				if (N[M] < L[M]) {
					return false
				}
			} else {
				return false
			}
		}
		return true
	}

	function n(P, L, N, Q, O) {
		if (L.todo.events || L.todo.onces) {
			var M = {id: Q, data: L.todo.data, tag: L.todo.tag};
			if (L.todo.events) {
				y.each(L.todo.events, function (R, U) {
					var T = P, S = U;
					if (y.isArray(U)) {
						T = U[0];
						S = U[1]
					}
					google.maps.event.addListener(N, R, function (V) {
						S.apply(T, [O ? O : N, V, M])
					})
				})
			}
			if (L.todo.onces) {
				y.each(L.todo.onces, function (R, U) {
					var T = P, S = U;
					if (y.isArray(U)) {
						T = U[0];
						S = U[1]
					}
					google.maps.event.addListenerOnce(N, R, function (V) {
						S.apply(T, [O ? O : N, V, M])
					})
				})
			}
		}
	}

	function l() {
		var L = [];
		this.empty = function () {
			return !L.length
		};
		this.add = function (M) {
			L.push(M)
		};
		this.get = function () {
			return L.length ? L[0] : false
		};
		this.ack = function () {
			L.shift()
		}
	}

	function w(T, L, N) {
		var R = {}, P = this, Q, S = {
			latLng: {
				map: false,
				marker: false,
				infowindow: false,
				circle: false,
				overlay: false,
				getlatlng: false,
				getmaxzoom: false,
				getelevation: false,
				streetviewpanorama: false,
				getaddress: true
			}, geoloc: {getgeoloc: true}
		};
		if (typeof N === "string") {
			N = M(N)
		}
		function M(V) {
			var U = {};
			U[V] = {};
			return U
		}

		function O() {
			var U;
			for (U in N) {
				if (U in R) {
					continue
				}
				return U
			}
		}

		this.run = function () {
			var U, V;
			while (U = O()) {
				if (typeof T[U] === "function") {
					Q = U;
					V = y.extend(true, {}, z[U] || {}, N[U].options || {});
					if (U in S.latLng) {
						if (N[U].values) {
							x(N[U].values, T, T[U], {todo: N[U], opts: V, session: R})
						} else {
							v(T, T[U], S.latLng[U], {todo: N[U], opts: V, session: R})
						}
					} else {
						if (U in S.geoloc) {
							o(T, T[U], {todo: N[U], opts: V, session: R})
						} else {
							T[U].apply(T, [
								{todo: N[U], opts: V, session: R}
							])
						}
					}
					return
				} else {
					R[U] = null
				}
			}
			L.apply(T, [N, R])
		};
		this.ack = function (U) {
			R[Q] = U;
			P.run.apply(P, [])
		}
	}

	function c(N) {
		var L, M = [];
		for (L in N) {
			M.push(L)
		}
		return M
	}

	function b(N, Q) {
		var L = {};
		if (N.todo) {
			for (var M in N.todo) {
				if ((M !== "options") && (M !== "values")) {
					L[M] = N.todo[M]
				}
			}
		}
		var O, P = ["data", "tag", "id", "events", "onces"];
		for (O = 0; O < P.length; O++) {
			A(L, P[O], Q, N.todo)
		}
		L.options = y.extend({}, N.opts || {}, Q.options || {});
		return L
	}

	function A(N, M) {
		for (var L = 2; L < arguments.length; L++) {
			if (M in arguments[L]) {
				N[M] = arguments[L][M];
				return
			}
		}
	}

	function r() {
		var L = [];
		this.get = function (S) {
			if (L.length) {
				var P, O, N, R, M, Q = c(S);
				for (P = 0; P < L.length; P++) {
					R = L[P];
					M = Q.length == R.keys.length;
					for (O = 0; (O < Q.length) && M; O++) {
						N = Q[O];
						M = N in R.request;
						if (M) {
							if ((typeof S[N] === "object") && ("equals" in S[N]) && (typeof S[N] === "function")) {
								M = S[N].equals(R.request[N])
							} else {
								M = S[N] === R.request[N]
							}
						}
					}
					if (M) {
						return R.results
					}
				}
			}
		};
		this.store = function (N, M) {
			L.push({request: N, keys: c(N), results: M})
		}
	}

	function e(Q, P, O, L) {
		var N = this, M = [];
		z.classes.OverlayView.call(this);
		this.setMap(Q);
		this.onAdd = function () {
			var R = this.getPanes();
			if (P.pane in R) {
				y(R[P.pane]).append(L)
			}
			y.each("dblclick click mouseover mousemove mouseout mouseup mousedown".split(" "), function (T, S) {
				M.push(google.maps.event.addDomListener(L[0], S, function (U) {
					y.Event(U).stopPropagation();
					google.maps.event.trigger(N, S, [U]);
					N.draw()
				}))
			});
			M.push(google.maps.event.addDomListener(L[0], "contextmenu", function (S) {
				y.Event(S).stopPropagation();
				google.maps.event.trigger(N, "rightclick", [S]);
				N.draw()
			}))
		};
		this.getPosition = function () {
			return O
		};
		this.draw = function () {
			var R = this.getProjection().fromLatLngToDivPixel(O);
			L.css("left", (R.x + P.offset.x) + "px").css("top", (R.y + P.offset.y) + "px")
		};
		this.onRemove = function () {
			for (var R = 0; R < M.length; R++) {
				google.maps.event.removeListener(M[R])
			}
			L.remove()
		};
		this.hide = function () {
			L.hide()
		};
		this.show = function () {
			L.show()
		};
		this.toggle = function () {
			if (L) {
				if (L.is(":visible")) {
					this.show()
				} else {
					this.hide()
				}
			}
		};
		this.toggleDOM = function () {
			if (this.getMap()) {
				this.setMap(null)
			} else {
				this.setMap(Q)
			}
		};
		this.getDOMElement = function () {
			return L[0]
		}
	}

	function f(O, L) {
		function M() {
			this.onAdd = function () {
			};
			this.onRemove = function () {
			};
			this.draw = function () {
			};
			return z.classes.OverlayView.apply(this, [])
		}

		M.prototype = z.classes.OverlayView.prototype;
		var N = new M();
		N.setMap(O);
		return N
	}

	function F(ae, ao, aa) {
		var an = false, ai = false, af = false, Z = false, W = true, V = this, N = [], T = {}, ad = {}, U = {}, aj = [], ah = [], O = [], ak = f(ao, aa.radius), Y, ap, am, P, Q;
		S();
		function L(aq) {
			if (!aj[aq]) {
				delete ah[aq].options.map;
				aj[aq] = new z.classes.Marker(ah[aq].options);
				n(ae, {todo: ah[aq]}, aj[aq], ah[aq].id)
			}
		}

		this.getById = function (aq) {
			if (aq in ad) {
				L(ad[aq]);
				return aj[ad[aq]]
			}
			return false
		};
		this.rm = function (ar) {
			var aq = ad[ar];
			if (aj[aq]) {
				aj[aq].setMap(null)
			}
			delete aj[aq];
			aj[aq] = false;
			delete ah[aq];
			ah[aq] = false;
			delete O[aq];
			O[aq] = false;
			delete ad[ar];
			delete U[aq];
			ai = true
		};
		this.clearById = function (aq) {
			if (aq in ad) {
				this.rm(aq);
				return true
			}
		};
		this.clear = function (az, av, aA) {
			var ar, ay, at, aw, au, ax = [], aq = C(aA);
			if (az) {
				ar = ah.length - 1;
				ay = -1;
				at = -1
			} else {
				ar = 0;
				ay = ah.length;
				at = 1
			}
			for (aw = ar; aw != ay; aw += at) {
				if (ah[aw]) {
					if (!aq || aq(ah[aw].tag)) {
						ax.push(U[aw]);
						if (av || az) {
							break
						}
					}
				}
			}
			for (au = 0; au < ax.length; au++) {
				this.rm(ax[au])
			}
		};
		this.add = function (aq, ar) {
			aq.id = k(aq.id);
			this.clearById(aq.id);
			ad[aq.id] = aj.length;
			U[aj.length] = aq.id;
			aj.push(null);
			ah.push(aq);
			O.push(ar);
			ai = true
		};
		this.addMarker = function (ar, aq) {
			aq = aq || {};
			aq.id = k(aq.id);
			this.clearById(aq.id);
			if (!aq.options) {
				aq.options = {}
			}
			aq.options.position = ar.getPosition();
			n(ae, {todo: aq}, ar, aq.id);
			ad[aq.id] = aj.length;
			U[aj.length] = aq.id;
			aj.push(ar);
			ah.push(aq);
			O.push(aq.data || {});
			ai = true
		};
		this.todo = function (aq) {
			return ah[aq]
		};
		this.value = function (aq) {
			return O[aq]
		};
		this.marker = function (aq) {
			if (aq in aj) {
				L(aq);
				return aj[aq]
			}
			return false
		};
		this.markerIsSet = function (aq) {
			return Boolean(aj[aq])
		};
		this.setMarker = function (ar, aq) {
			aj[ar] = aq
		};
		this.store = function (aq, ar, at) {
			T[aq.ref] = {obj: ar, shadow: at}
		};
		this.free = function () {
			for (var aq = 0; aq < N.length; aq++) {
				google.maps.event.removeListener(N[aq])
			}
			N = [];
			y.each(T, function (ar) {
				ac(ar)
			});
			T = {};
			y.each(ah, function (ar) {
				ah[ar] = null
			});
			ah = [];
			y.each(aj, function (ar) {
				if (aj[ar]) {
					aj[ar].setMap(null);
					delete aj[ar]
				}
			});
			aj = [];
			y.each(O, function (ar) {
				delete O[ar]
			});
			O = [];
			ad = {};
			U = {}
		};
		this.filter = function (aq) {
			am = aq;
			ag()
		};
		this.enable = function (aq) {
			if (W != aq) {
				W = aq;
				ag()
			}
		};
		this.display = function (aq) {
			P = aq
		};
		this.error = function (aq) {
			Q = aq
		};
		this.beginUpdate = function () {
			an = true
		};
		this.endUpdate = function () {
			an = false;
			if (ai) {
				ag()
			}
		};
		this.autofit = function (ar) {
			for (var aq = 0; aq < ah.length; aq++) {
				if (ah[aq]) {
					ar.extend(ah[aq].options.position)
				}
			}
		};
		function S() {
			ap = ak.getProjection();
			if (!ap) {
				setTimeout(function () {
					S.apply(V, [])
				}, 25);
				return
			}
			Z = true;
			N.push(google.maps.event.addListener(ao, "zoom_changed", function () {
				al()
			}));
			N.push(google.maps.event.addListener(ao, "bounds_changed", function () {
				al()
			}));
			ag()
		}

		function ac(aq) {
			if (typeof T[aq] === "object") {
				if (typeof(T[aq].obj.setMap) === "function") {
					T[aq].obj.setMap(null)
				}
				if (typeof(T[aq].obj.remove) === "function") {
					T[aq].obj.remove()
				}
				if (typeof(T[aq].shadow.remove) === "function") {
					T[aq].obj.remove()
				}
				if (typeof(T[aq].shadow.setMap) === "function") {
					T[aq].shadow.setMap(null)
				}
				delete T[aq].obj;
				delete T[aq].shadow
			} else {
				if (aj[aq]) {
					aj[aq].setMap(null)
				}
			}
			delete T[aq]
		}

		function M() {
			var ay, ax, aw, au, av, at, ar, aq;
			if (arguments[0] instanceof google.maps.LatLng) {
				ay = arguments[0].lat();
				aw = arguments[0].lng();
				if (arguments[1] instanceof google.maps.LatLng) {
					ax = arguments[1].lat();
					au = arguments[1].lng()
				} else {
					ax = arguments[1];
					au = arguments[2]
				}
			} else {
				ay = arguments[0];
				aw = arguments[1];
				if (arguments[2] instanceof google.maps.LatLng) {
					ax = arguments[2].lat();
					au = arguments[2].lng()
				} else {
					ax = arguments[2];
					au = arguments[3]
				}
			}
			av = Math.PI * ay / 180;
			at = Math.PI * aw / 180;
			ar = Math.PI * ax / 180;
			aq = Math.PI * au / 180;
			return 1000 * 6371 * Math.acos(Math.min(Math.cos(av) * Math.cos(ar) * Math.cos(at) * Math.cos(aq) + Math.cos(av) * Math.sin(at) * Math.cos(ar) * Math.sin(aq) + Math.sin(av) * Math.sin(ar), 1))
		}

		function R() {
			var aq = M(ao.getCenter(), ao.getBounds().getNorthEast()), ar = new google.maps.Circle({
				center: ao.getCenter(),
				radius: 1.25 * aq
			});
			return ar.getBounds()
		}

		function X() {
			var ar = {}, aq;
			for (aq in T) {
				ar[aq] = true
			}
			return ar
		}

		function al() {
			clearTimeout(Y);
			Y = setTimeout(function () {
				ag()
			}, 25)
		}

		function ab(ar) {
			var au = ap.fromLatLngToDivPixel(ar), at = ap.fromDivPixelToLatLng(new google.maps.Point(au.x + aa.radius, au.y - aa.radius)), aq = ap.fromDivPixelToLatLng(new google.maps.Point(au.x - aa.radius, au.y + aa.radius));
			return new google.maps.LatLngBounds(aq, at)
		}

		function ag() {
			if (an || af || !Z) {
				return
			}
			var aE = [], aG = {}, aF = ao.getZoom(), aH = ("maxZoom" in aa) && (aF > aa.maxZoom), aw = X(), av, au, at, aA, ar = false, aq, aD, ay, az, aB, aC, ax;
			ai = false;
			if (aF > 3) {
				aq = R();
				ar = aq.getSouthWest().lng() < aq.getNorthEast().lng()
			}
			for (av = 0; av < ah.length; av++) {
				if (ah[av] && (!ar || aq.contains(ah[av].options.position)) && (!am || am(O[av]))) {
					aE.push(av)
				}
			}
			while (1) {
				av = 0;
				while (aG[av] && (av < aE.length)) {
					av++
				}
				if (av == aE.length) {
					break
				}
				aA = [];
				if (W && !aH) {
					ax = 10;
					do {
						az = aA;
						aA = [];
						ax--;
						if (az.length) {
							ay = aq.getCenter()
						} else {
							ay = ah[aE[av]].options.position
						}
						aq = ab(ay);
						for (au = av; au < aE.length; au++) {
							if (aG[au]) {
								continue
							}
							if (aq.contains(ah[aE[au]].options.position)) {
								aA.push(au)
							}
						}
					} while ((az.length < aA.length) && (aA.length > 1) && ax)
				} else {
					for (au = av; au < aE.length; au++) {
						if (aG[au]) {
							continue
						}
						aA.push(au);
						break
					}
				}
				aD = {indexes: [], ref: []};
				aB = aC = 0;
				for (at = 0; at < aA.length; at++) {
					aG[aA[at]] = true;
					aD.indexes.push(aE[aA[at]]);
					aD.ref.push(aE[aA[at]]);
					aB += ah[aE[aA[at]]].options.position.lat();
					aC += ah[aE[aA[at]]].options.position.lng()
				}
				aB /= aA.length;
				aC /= aA.length;
				aD.latLng = new google.maps.LatLng(aB, aC);
				aD.ref = aD.ref.join("-");
				if (aD.ref in aw) {
					delete aw[aD.ref]
				} else {
					if (aA.length === 1) {
						T[aD.ref] = true
					}
					P(aD)
				}
			}
			y.each(aw, function (aI) {
				ac(aI)
			});
			af = false
		}
	}

	function a(M, L) {
		this.id = function () {
			return M
		};
		this.filter = function (N) {
			L.filter(N)
		};
		this.enable = function () {
			L.enable(true)
		};
		this.disable = function () {
			L.enable(false)
		};
		this.add = function (O, N, P) {
			if (!P) {
				L.beginUpdate()
			}
			L.addMarker(O, N);
			if (!P) {
				L.endUpdate()
			}
		};
		this.getById = function (N) {
			return L.getById(N)
		};
		this.clearById = function (P, O) {
			var N;
			if (!O) {
				L.beginUpdate()
			}
			N = L.clearById(P);
			if (!O) {
				L.endUpdate()
			}
			return N
		};
		this.clear = function (P, Q, N, O) {
			if (!O) {
				L.beginUpdate()
			}
			L.clear(P, Q, N);
			if (!O) {
				L.endUpdate()
			}
		}
	}

	function D() {
		var M = {}, N = {};

		function L(P) {
			return{id: P.id, name: P.name, object: P.obj, tag: P.tag, data: P.data}
		}

		this.add = function (R, Q, T, S) {
			var P = R.todo || {}, U = k(P.id);
			if (!M[Q]) {
				M[Q] = []
			}
			if (U in N) {
				this.clearById(U)
			}
			N[U] = {obj: T, sub: S, name: Q, id: U, tag: P.tag, data: P.data};
			M[Q].push(U);
			return U
		};
		this.getById = function (R, Q, P) {
			if (R in N) {
				if (Q) {
					return N[R].sub
				} else {
					if (P) {
						return L(N[R])
					}
				}
				return N[R].obj
			}
			return false
		};
		this.get = function (R, T, P, S) {
			var V, U, Q = C(P);
			if (!M[R] || !M[R].length) {
				return null
			}
			V = M[R].length;
			while (V) {
				V--;
				U = M[R][T ? V : M[R].length - V - 1];
				if (U && N[U]) {
					if (Q && !Q(N[U].tag)) {
						continue
					}
					return S ? L(N[U]) : N[U].obj
				}
			}
			return null
		};
		this.all = function (S, Q, T) {
			var P = [], R = C(Q), U = function (X) {
				var V, W;
				for (V = 0; V < M[X].length; V++) {
					W = M[X][V];
					if (W && N[W]) {
						if (R && !R(N[W].tag)) {
							continue
						}
						P.push(T ? L(N[W]) : N[W].obj)
					}
				}
			};
			if (S in M) {
				U(S)
			} else {
				if (S === t) {
					for (S in M) {
						U(S)
					}
				}
			}
			return P
		};
		function O(P) {
			if (typeof(P.setMap) === "function") {
				P.setMap(null)
			}
			if (typeof(P.remove) === "function") {
				P.remove()
			}
			if (typeof(P.free) === "function") {
				P.free()
			}
			P = null
		}

		this.rm = function (S, Q, R) {
			var P, T;
			if (!M[S]) {
				return false
			}
			if (Q) {
				if (R) {
					for (P = M[S].length - 1; P >= 0; P--) {
						T = M[S][P];
						if (Q(N[T].tag)) {
							break
						}
					}
				} else {
					for (P = 0; P < M[S].length; P++) {
						T = M[S][P];
						if (Q(N[T].tag)) {
							break
						}
					}
				}
			} else {
				P = R ? M[S].length - 1 : 0
			}
			if (!(P in M[S])) {
				return false
			}
			return this.clearById(M[S][P], P)
		};
		this.clearById = function (S, P) {
			if (S in N) {
				var R, Q = N[S].name;
				for (R = 0; P === t && R < M[Q].length; R++) {
					if (S === M[Q][R]) {
						P = R
					}
				}
				O(N[S].obj);
				if (N[S].sub) {
					O(N[S].sub)
				}
				delete N[S];
				M[Q].splice(P, 1);
				return true
			}
			return false
		};
		this.objGetById = function (R) {
			var Q;
			if (M.clusterer) {
				for (var P in M.clusterer) {
					if ((Q = N[M.clusterer[P]].obj.getById(R)) !== false) {
						return Q
					}
				}
			}
			return false
		};
		this.objClearById = function (Q) {
			if (M.clusterer) {
				for (var P in M.clusterer) {
					if (N[M.clusterer[P]].obj.clearById(Q)) {
						return true
					}
				}
			}
			return null
		};
		this.clear = function (V, U, W, P) {
			var R, T, S, Q = C(P);
			if (!V || !V.length) {
				V = [];
				for (R in M) {
					V.push(R)
				}
			} else {
				V = g(V)
			}
			for (T = 0; T < V.length; T++) {
				S = V[T];
				if (U) {
					this.rm(S, Q, true)
				} else {
					if (W) {
						this.rm(S, Q, false)
					} else {
						while (this.rm(S, Q, false)) {
						}
					}
				}
			}
		};
		this.objClear = function (S, R, T, Q) {
			if (M.clusterer && (y.inArray("marker", S) >= 0 || !S.length)) {
				for (var P in M.clusterer) {
					N[M.clusterer[P]].obj.clear(R, T, Q)
				}
			}
		}
	}

	var m = {}, H = new r();

	function p() {
		if (!m.geocoder) {
			m.geocoder = new google.maps.Geocoder()
		}
		return m.geocoder
	}

	function G() {
		if (!m.directionsService) {
			m.directionsService = new google.maps.DirectionsService()
		}
		return m.directionsService
	}

	function h() {
		if (!m.elevationService) {
			m.elevationService = new google.maps.ElevationService()
		}
		return m.elevationService
	}

	function q() {
		if (!m.maxZoomService) {
			m.maxZoomService = new google.maps.MaxZoomService()
		}
		return m.maxZoomService
	}

	function B() {
		if (!m.distanceMatrixService) {
			m.distanceMatrixService = new google.maps.DistanceMatrixService()
		}
		return m.distanceMatrixService
	}

	function u() {
		if (z.verbose) {
			var L, M = [];
			if (window.console && (typeof console.error === "function")) {
				for (L = 0; L < arguments.length; L++) {
					M.push(arguments[L])
				}
				console.error.apply(console, M)
			} else {
				M = "";
				for (L = 0; L < arguments.length; L++) {
					M += arguments[L].toString() + " "
				}
				alert(M)
			}
		}
	}

	function E(L) {
		return(typeof(L) === "number" || typeof(L) === "string") && L !== "" && !isNaN(L)
	}

	function g(N) {
		var M, L = [];
		if (N !== t) {
			if (typeof(N) === "object") {
				if (typeof(N.length) === "number") {
					L = N
				} else {
					for (M in N) {
						L.push(N[M])
					}
				}
			} else {
				L.push(N)
			}
		}
		return L
	}

	function C(L) {
		if (L) {
			if (typeof L === "function") {
				return L
			}
			L = g(L);
			return function (N) {
				if (N === t) {
					return false
				}
				if (typeof N === "object") {
					for (var M = 0; M < N.length; M++) {
						if (y.inArray(N[M], L) >= 0) {
							return true
						}
					}
					return false
				}
				return y.inArray(N, L) >= 0
			}
		}
	}

	function I(M, O, L) {
		var N = O ? M : null;
		if (!M || (typeof M === "string")) {
			return N
		}
		if (M.latLng) {
			return I(M.latLng)
		}
		if (M instanceof google.maps.LatLng) {
			return M
		} else {
			if (E(M.lat)) {
				return new google.maps.LatLng(M.lat, M.lng)
			} else {
				if (!L && y.isArray(M)) {
					if (!E(M[0]) || !E(M[1])) {
						return N
					}
					return new google.maps.LatLng(M[0], M[1])
				}
			}
		}
		return N
	}

	function j(M) {
		var N, L;
		if (!M || M instanceof google.maps.LatLngBounds) {
			return M || null
		}
		if (y.isArray(M)) {
			if (M.length == 2) {
				N = I(M[0]);
				L = I(M[1])
			} else {
				if (M.length == 4) {
					N = I([M[0], M[1]]);
					L = I([M[2], M[3]])
				}
			}
		} else {
			if (("ne" in M) && ("sw" in M)) {
				N = I(M.ne);
				L = I(M.sw)
			} else {
				if (("n" in M) && ("e" in M) && ("s" in M) && ("w" in M)) {
					N = I([M.n, M.e]);
					L = I([M.s, M.w])
				}
			}
		}
		if (N && L) {
			return new google.maps.LatLngBounds(L, N)
		}
		return null
	}

	function v(T, L, O, S, P) {
		var N = O ? I(S.todo, false, true) : false, R = N ? {latLng: N} : (S.todo.address ? (typeof(S.todo.address) === "string" ? {address: S.todo.address} : S.todo.address) : false), M = R ? H.get(R) : false, Q = this;
		if (R) {
			P = P || 0;
			if (M) {
				S.latLng = M.results[0].geometry.location;
				S.results = M.results;
				S.status = M.status;
				L.apply(T, [S])
			} else {
				if (R.location) {
					R.location = I(R.location)
				}
				if (R.bounds) {
					R.bounds = j(R.bounds)
				}
				p().geocode(R, function (V, U) {
					if (U === google.maps.GeocoderStatus.OK) {
						H.store(R, {results: V, status: U});
						S.latLng = V[0].geometry.location;
						S.results = V;
						S.status = U;
						L.apply(T, [S])
					} else {
						if ((U === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) && (P < z.queryLimit.attempt)) {
							setTimeout(function () {
								v.apply(Q, [T, L, O, S, P + 1])
							}, z.queryLimit.delay + Math.floor(Math.random() * z.queryLimit.random))
						} else {
							u("geocode failed", U, R);
							S.latLng = S.results = false;
							S.status = U;
							L.apply(T, [S])
						}
					}
				})
			}
		} else {
			S.latLng = I(S.todo, false, true);
			L.apply(T, [S])
		}
	}

	function x(Q, L, R, M) {
		var O = this, N = -1;

		function P() {
			do {
				N++
			} while ((N < Q.length) && !("address" in Q[N]));
			if (N >= Q.length) {
				R.apply(L, [M]);
				return
			}
			v(O, function (S) {
				delete S.todo;
				y.extend(Q[N], S);
				P.apply(O, [])
			}, true, {todo: Q[N]})
		}

		P()
	}

	function o(L, O, M) {
		var N = false;
		if (navigator && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (P) {
				if (N) {
					return
				}
				N = true;
				M.latLng = new google.maps.LatLng(P.coords.latitude, P.coords.longitude);
				O.apply(L, [M])
			}, function () {
				if (N) {
					return
				}
				N = true;
				M.latLng = false;
				O.apply(L, [M])
			}, M.opts.getCurrentPosition)
		} else {
			M.latLng = false;
			O.apply(L, [M])
		}
	}

	function K(T) {
		var S = this, U = new l(), V = new D(), N = null, P;
		this._plan = function (Z) {
			for (var Y = 0; Y < Z.length; Y++) {
				U.add(new w(S, R, Z[Y]))
			}
			Q()
		};
		function Q() {
			if (!P && (P = U.get())) {
				P.run()
			}
		}

		function R() {
			P = null;
			U.ack();
			Q.call(S)
		}

		function X(Y) {
			if (Y.todo.callback) {
				var Z = Array.prototype.slice.call(arguments, 1);
				if (typeof Y.todo.callback === "function") {
					Y.todo.callback.apply(T, Z)
				} else {
					if (y.isArray(Y.todo.callback)) {
						if (typeof Y.todo.callback[1] === "function") {
							Y.todo.callback[1].apply(Y.todo.callback[0], Z)
						}
					}
				}
			}
		}

		function O(Y, Z, aa) {
			if (aa) {
				n(T, Y, Z, aa)
			}
			X(Y, Z);
			P.ack(Z)
		}

		function L(aa, Y) {
			Y = Y || {};
			if (N) {
				if (Y.todo && Y.todo.options) {
					if (Y.todo.options.center) {
						Y.todo.options.center = I(Y.todo.options.center)
					}
					N.setOptions(Y.todo.options)
				}
			} else {
				var Z = Y.opts || y.extend(true, {}, z.map, Y.todo && Y.todo.options ? Y.todo.options : {});
				Z.center = aa || I(Z.center);
				N = new z.classes.Map(T.get(0), Z)
			}
		}

		this.map = function (Y) {
			L(Y.latLng, Y);
			n(T, Y, N);
			O(Y, N)
		};
		this.destroy = function (Y) {
			V.clear();
			T.empty();
			if (N) {
				N = null
			}
			O(Y, true)
		};
		this.infowindow = function (Z) {
			var aa = [], Y = "values" in Z.todo;
			if (!Y) {
				if (Z.latLng) {
					Z.opts.position = Z.latLng
				}
				Z.todo.values = [
					{options: Z.opts}
				]
			}
			y.each(Z.todo.values, function (ac, ad) {
				var af, ae, ab = b(Z, ad);
				ab.options.position = ab.options.position ? I(ab.options.position) : I(ad.latLng);
				if (!N) {
					L(ab.options.position)
				}
				ae = new z.classes.InfoWindow(ab.options);
				if (ae && ((ab.open === t) || ab.open)) {
					if (Y) {
						ae.open(N, ab.anchor ? ab.anchor : t)
					} else {
						ae.open(N, ab.anchor ? ab.anchor : (Z.latLng ? t : (Z.session.marker ? Z.session.marker : t)))
					}
				}
				aa.push(ae);
				af = V.add({todo: ab}, "infowindow", ae);
				n(T, {todo: ab}, ae, af)
			});
			O(Z, Y ? aa : aa[0])
		};
		this.circle = function (Z) {
			var aa = [], Y = "values" in Z.todo;
			if (!Y) {
				Z.opts.center = Z.latLng || I(Z.opts.center);
				Z.todo.values = [
					{options: Z.opts}
				]
			}
			if (!Z.todo.values.length) {
				O(Z, false);
				return
			}
			y.each(Z.todo.values, function (ac, ad) {
				var af, ae, ab = b(Z, ad);
				ab.options.center = ab.options.center ? I(ab.options.center) : I(ad);
				if (!N) {
					L(ab.options.center)
				}
				ab.options.map = N;
				ae = new z.classes.Circle(ab.options);
				aa.push(ae);
				af = V.add({todo: ab}, "circle", ae);
				n(T, {todo: ab}, ae, af)
			});
			O(Z, Y ? aa : aa[0])
		};
		this.overlay = function (aa, Z) {
			var ab = [], Y = "values" in aa.todo;
			if (!Y) {
				aa.todo.values = [
					{latLng: aa.latLng, options: aa.opts}
				]
			}
			if (!aa.todo.values.length) {
				O(aa, false);
				return
			}
			if (!e.__initialised) {
				e.prototype = new z.classes.OverlayView();
				e.__initialised = true
			}
			y.each(aa.todo.values, function (ae, af) {
				var ah, ag, ac = b(aa, af), ad = y(document.createElement("div")).css({
					border: "none",
					borderWidth: "0px",
					position: "absolute"
				});
				ad.append(ac.options.content);
				ag = new e(N, ac.options, I(ac) || I(af), ad);
				ab.push(ag);
				ad = null;
				if (!Z) {
					ah = V.add(aa, "overlay", ag);
					n(T, {todo: ac}, ag, ah)
				}
			});
			if (Z) {
				return ab[0]
			}
			O(aa, Y ? ab : ab[0])
		};
		this.getaddress = function (Y) {
			X(Y, Y.results, Y.status);
			P.ack()
		};
		this.getlatlng = function (Y) {
			X(Y, Y.results, Y.status);
			P.ack()
		};
		this.getmaxzoom = function (Y) {
			q().getMaxZoomAtLatLng(Y.latLng, function (Z) {
				X(Y, Z.status === google.maps.MaxZoomStatus.OK ? Z.zoom : false, status);
				P.ack()
			})
		};
		this.getelevation = function (Z) {
			var aa, Y = [], ab = function (ad, ac) {
				X(Z, ac === google.maps.ElevationStatus.OK ? ad : false, ac);
				P.ack()
			};
			if (Z.latLng) {
				Y.push(Z.latLng)
			} else {
				Y = g(Z.todo.locations || []);
				for (aa = 0; aa < Y.length; aa++) {
					Y[aa] = I(Y[aa])
				}
			}
			if (Y.length) {
				h().getElevationForLocations({locations: Y}, ab)
			} else {
				if (Z.todo.path && Z.todo.path.length) {
					for (aa = 0; aa < Z.todo.path.length; aa++) {
						Y.push(I(Z.todo.path[aa]))
					}
				}
				if (Y.length) {
					h().getElevationAlongPath({path: Y, samples: Z.todo.samples}, ab)
				} else {
					P.ack()
				}
			}
		};
		this.defaults = function (Y) {
			y.each(Y.todo, function (Z, aa) {
				if (typeof z[Z] === "object") {
					z[Z] = y.extend({}, z[Z], aa)
				} else {
					z[Z] = aa
				}
			});
			P.ack(true)
		};
		this.rectangle = function (Z) {
			var aa = [], Y = "values" in Z.todo;
			if (!Y) {
				Z.todo.values = [
					{options: Z.opts}
				]
			}
			if (!Z.todo.values.length) {
				O(Z, false);
				return
			}
			y.each(Z.todo.values, function (ac, ad) {
				var af, ae, ab = b(Z, ad);
				ab.options.bounds = ab.options.bounds ? j(ab.options.bounds) : j(ad);
				if (!N) {
					L(ab.options.bounds.getCenter())
				}
				ab.options.map = N;
				ae = new z.classes.Rectangle(ab.options);
				aa.push(ae);
				af = V.add({todo: ab}, "rectangle", ae);
				n(T, {todo: ab}, ae, af)
			});
			O(Z, Y ? aa : aa[0])
		};
		function M(Z, aa, ab) {
			var ac = [], Y = "values" in Z.todo;
			if (!Y) {
				Z.todo.values = [
					{options: Z.opts}
				]
			}
			if (!Z.todo.values.length) {
				O(Z, false);
				return
			}
			L();
			y.each(Z.todo.values, function (af, ah) {
				var aj, ag, ae, ai, ad = b(Z, ah);
				if (ad.options[ab]) {
					if (ad.options[ab][0][0] && y.isArray(ad.options[ab][0][0])) {
						for (ag = 0; ag < ad.options[ab].length; ag++) {
							for (ae = 0; ae < ad.options[ab][ag].length; ae++) {
								ad.options[ab][ag][ae] = I(ad.options[ab][ag][ae])
							}
						}
					} else {
						for (ag = 0; ag < ad.options[ab].length; ag++) {
							ad.options[ab][ag] = I(ad.options[ab][ag])
						}
					}
				}
				ad.options.map = N;
				ai = new google.maps[aa](ad.options);
				ac.push(ai);
				aj = V.add({todo: ad}, aa.toLowerCase(), ai);
				n(T, {todo: ad}, ai, aj)
			});
			O(Z, Y ? ac : ac[0])
		}

		this.polyline = function (Y) {
			M(Y, "Polyline", "path")
		};
		this.polygon = function (Y) {
			M(Y, "Polygon", "paths")
		};
		this.trafficlayer = function (Y) {
			L();
			var Z = V.get("trafficlayer");
			if (!Z) {
				Z = new z.classes.TrafficLayer();
				Z.setMap(N);
				V.add(Y, "trafficlayer", Z)
			}
			O(Y, Z)
		};
		this.bicyclinglayer = function (Y) {
			L();
			var Z = V.get("bicyclinglayer");
			if (!Z) {
				Z = new z.classes.BicyclingLayer();
				Z.setMap(N);
				V.add(Y, "bicyclinglayer", Z)
			}
			O(Y, Z)
		};
		this.groundoverlay = function (Y) {
			Y.opts.bounds = j(Y.opts.bounds);
			if (Y.opts.bounds) {
				L(Y.opts.bounds.getCenter())
			}
			var aa, Z = new z.classes.GroundOverlay(Y.opts.url, Y.opts.bounds, Y.opts.opts);
			Z.setMap(N);
			aa = V.add(Y, "groundoverlay", Z);
			O(Y, Z, aa)
		};
		this.streetviewpanorama = function (Y) {
			if (!Y.opts.opts) {
				Y.opts.opts = {}
			}
			if (Y.latLng) {
				Y.opts.opts.position = Y.latLng
			} else {
				if (Y.opts.opts.position) {
					Y.opts.opts.position = I(Y.opts.opts.position)
				}
			}
			if (Y.todo.divId) {
				Y.opts.container = document.getElementById(Y.todo.divId)
			} else {
				if (Y.opts.container) {
					Y.opts.container = y(Y.opts.container).get(0)
				}
			}
			var aa, Z = new z.classes.StreetViewPanorama(Y.opts.container, Y.opts.opts);
			if (Z) {
				N.setStreetView(Z)
			}
			aa = V.add(Y, "streetviewpanorama", Z);
			O(Y, Z, aa)
		};
		this.kmllayer = function (Z) {
			var aa = [], Y = "values" in Z.todo;
			if (!Y) {
				Z.todo.values = [
					{options: Z.opts}
				]
			}
			if (!Z.todo.values.length) {
				O(Z, false);
				return
			}
			y.each(Z.todo.values, function (ad, ae) {
				var ag, af, ac, ab = b(Z, ae);
				if (!N) {
					L()
				}
				ac = ab.options;
				if (ab.options.opts) {
					ac = ab.options.opts;
					if (ab.options.url) {
						ac.url = ab.options.url
					}
				}
				ac.map = N;
				if (d("3.10")) {
					af = new z.classes.KmlLayer(ac)
				} else {
					af = new z.classes.KmlLayer(ac.url, ac)
				}
				aa.push(af);
				ag = V.add({todo: ab}, "kmllayer", af);
				n(T, {todo: ab}, af, ag)
			});
			O(Z, Y ? aa : aa[0])
		};
		this.panel = function (ab) {
			L();
			var ad, Y = 0, ac = 0, aa, Z = y(document.createElement("div"));
			Z.css({position: "absolute", zIndex: 1000, visibility: "hidden"});
			if (ab.opts.content) {
				aa = y(ab.opts.content);
				Z.append(aa);
				T.first().prepend(Z);
				if (ab.opts.left !== t) {
					Y = ab.opts.left
				} else {
					if (ab.opts.right !== t) {
						Y = T.width() - aa.width() - ab.opts.right
					} else {
						if (ab.opts.center) {
							Y = (T.width() - aa.width()) / 2
						}
					}
				}
				if (ab.opts.top !== t) {
					ac = ab.opts.top
				} else {
					if (ab.opts.bottom !== t) {
						ac = T.height() - aa.height() - ab.opts.bottom
					} else {
						if (ab.opts.middle) {
							ac = (T.height() - aa.height()) / 2
						}
					}
				}
				Z.css({top: ac, left: Y, visibility: "visible"})
			}
			ad = V.add(ab, "panel", Z);
			O(ab, Z, ad);
			Z = null
		};
		function W(aa) {
			var af = new F(T, N, aa), Y = {}, ab = {}, ae = [], ad = /^[0-9]+$/, ac, Z;
			for (Z in aa) {
				if (ad.test(Z)) {
					ae.push(1 * Z);
					ab[Z] = aa[Z];
					ab[Z].width = ab[Z].width || 0;
					ab[Z].height = ab[Z].height || 0
				} else {
					Y[Z] = aa[Z]
				}
			}
			ae.sort(function (ah, ag) {
				return ah > ag
			});
			if (Y.calculator) {
				ac = function (ag) {
					var ah = [];
					y.each(ag, function (aj, ai) {
						ah.push(af.value(ai))
					});
					return Y.calculator.apply(T, [ah])
				}
			} else {
				ac = function (ag) {
					return ag.length
				}
			}
			af.error(function () {
				u.apply(S, arguments)
			});
			af.display(function (ag) {
				var ai, aj, am, ak, al, ah = ac(ag.indexes);
				if (aa.force || ah > 1) {
					for (ai = 0; ai < ae.length; ai++) {
						if (ae[ai] <= ah) {
							aj = ab[ae[ai]]
						}
					}
				}
				if (aj) {
					al = aj.offset || [-aj.width / 2, -aj.height / 2];
					am = y.extend({}, Y);
					am.options = y.extend({
						pane: "overlayLayer",
						content: aj.content ? aj.content.replace("CLUSTER_COUNT", ah) : "",
						offset: {x: ("x" in al ? al.x : al[0]) || 0, y: ("y" in al ? al.y : al[1]) || 0}
					}, Y.options || {});
					ak = S.overlay({todo: am, opts: am.options, latLng: I(ag)}, true);
					am.options.pane = "floatShadow";
					am.options.content = y(document.createElement("div")).width(aj.width + "px").height(aj.height + "px").css({cursor: "pointer"});
					shadow = S.overlay({todo: am, opts: am.options, latLng: I(ag)}, true);
					Y.data = {latLng: I(ag), markers: []};
					y.each(ag.indexes, function (ao, an) {
						Y.data.markers.push(af.value(an));
						if (af.markerIsSet(an)) {
							af.marker(an).setMap(null)
						}
					});
					n(T, {todo: Y}, shadow, t, {main: ak, shadow: shadow});
					af.store(ag, ak, shadow)
				} else {
					y.each(ag.indexes, function (ao, an) {
						af.marker(an).setMap(N)
					})
				}
			});
			return af
		}

		this.marker = function (aa) {
			var Y = "values" in aa.todo, ad = !N;
			if (!Y) {
				aa.opts.position = aa.latLng || I(aa.opts.position);
				aa.todo.values = [
					{options: aa.opts}
				]
			}
			if (!aa.todo.values.length) {
				O(aa, false);
				return
			}
			if (ad) {
				L()
			}
			if (aa.todo.cluster && !N.getBounds()) {
				google.maps.event.addListenerOnce(N, "bounds_changed", function () {
					S.marker.apply(S, [aa])
				});
				return
			}
			if (aa.todo.cluster) {
				var Z, ab;
				if (aa.todo.cluster instanceof a) {
					Z = aa.todo.cluster;
					ab = V.getById(Z.id(), true)
				} else {
					ab = W(aa.todo.cluster);
					Z = new a(k(aa.todo.id, true), ab);
					V.add(aa, "clusterer", Z, ab)
				}
				ab.beginUpdate();
				y.each(aa.todo.values, function (af, ag) {
					var ae = b(aa, ag);
					ae.options.position = ae.options.position ? I(ae.options.position) : I(ag);
					ae.options.map = N;
					if (ad) {
						N.setCenter(ae.options.position);
						ad = false
					}
					ab.add(ae, ag)
				});
				ab.endUpdate();
				O(aa, Z)
			} else {
				var ac = [];
				y.each(aa.todo.values, function (af, ag) {
					var ai, ah, ae = b(aa, ag);
					ae.options.position = ae.options.position ? I(ae.options.position) : I(ag);
					ae.options.map = N;
					if (ad) {
						N.setCenter(ae.options.position);
						ad = false
					}
					ah = new z.classes.Marker(ae.options);
					ac.push(ah);
					ai = V.add({todo: ae}, "marker", ah);
					n(T, {todo: ae}, ah, ai)
				});
				O(aa, Y ? ac : ac[0])
			}
		};
		this.getroute = function (Y) {
			Y.opts.origin = I(Y.opts.origin, true);
			Y.opts.destination = I(Y.opts.destination, true);
			G().route(Y.opts, function (aa, Z) {
				X(Y, Z == google.maps.DirectionsStatus.OK ? aa : false, Z);
				P.ack()
			})
		};
		this.directionsrenderer = function (Y) {
			Y.opts.map = N;
			var aa, Z = new google.maps.DirectionsRenderer(Y.opts);
			if (Y.todo.divId) {
				Z.setPanel(document.getElementById(Y.todo.divId))
			} else {
				if (Y.todo.container) {
					Z.setPanel(y(Y.todo.container).get(0))
				}
			}
			aa = V.add(Y, "directionsrenderer", Z);
			O(Y, Z, aa)
		};
		this.getgeoloc = function (Y) {
			O(Y, Y.latLng)
		};
		this.styledmaptype = function (Y) {
			L();
			var Z = new z.classes.StyledMapType(Y.todo.styles, Y.opts);
			N.mapTypes.set(Y.todo.id, Z);
			O(Y, Z)
		};
		this.imagemaptype = function (Y) {
			L();
			var Z = new z.classes.ImageMapType(Y.opts);
			N.mapTypes.set(Y.todo.id, Z);
			O(Y, Z)
		};
		this.autofit = function (Y) {
			var Z = new google.maps.LatLngBounds();
			y.each(V.all(), function (aa, ab) {
				if (ab.getPosition) {
					Z.extend(ab.getPosition())
				} else {
					if (ab.getBounds) {
						Z.extend(ab.getBounds().getNorthEast());
						Z.extend(ab.getBounds().getSouthWest())
					} else {
						if (ab.getPaths) {
							ab.getPaths().forEach(function (ac) {
								ac.forEach(function (ad) {
									Z.extend(ad)
								})
							})
						} else {
							if (ab.getPath) {
								ab.getPath().forEach(function (ac) {
									Z.extend(ac);
									""
								})
							} else {
								if (ab.getCenter) {
									Z.extend(ab.getCenter())
								} else {
									if (ab instanceof a) {
										ab = V.getById(ab.id(), true);
										if (ab) {
											ab.autofit(Z)
										}
									}
								}
							}
						}
					}
				}
			});
			if (!Z.isEmpty() && (!N.getBounds() || !N.getBounds().equals(Z))) {
				if ("maxZoom" in Y.todo) {
					google.maps.event.addListenerOnce(N, "bounds_changed", function () {
						if (this.getZoom() > Y.todo.maxZoom) {
							this.setZoom(Y.todo.maxZoom)
						}
					})
				}
				N.fitBounds(Z)
			}
			O(Y, true)
		};
		this.clear = function (Y) {
			if (typeof Y.todo === "string") {
				if (V.clearById(Y.todo) || V.objClearById(Y.todo)) {
					O(Y, true);
					return
				}
				Y.todo = {name: Y.todo}
			}
			if (Y.todo.id) {
				y.each(g(Y.todo.id), function (Z, aa) {
					V.clearById(aa) || V.objClearById(aa)
				})
			} else {
				V.clear(g(Y.todo.name), Y.todo.last, Y.todo.first, Y.todo.tag);
				V.objClear(g(Y.todo.name), Y.todo.last, Y.todo.first, Y.todo.tag)
			}
			O(Y, true)
		};
		this.exec = function (Y) {
			var Z = this;
			y.each(g(Y.todo.func), function (aa, ab) {
				y.each(Z.get(Y.todo, true, Y.todo.hasOwnProperty("full") ? Y.todo.full : true), function (ac, ad) {
					ab.call(T, ad)
				})
			});
			O(Y, true)
		};
		this.get = function (aa, ad, ac) {
			var Z, ab, Y = ad ? aa : aa.todo;
			if (!ad) {
				ac = Y.full
			}
			if (typeof Y === "string") {
				ab = V.getById(Y, false, ac) || V.objGetById(Y);
				if (ab === false) {
					Z = Y;
					Y = {}
				}
			} else {
				Z = Y.name
			}
			if (Z === "map") {
				ab = N
			}
			if (!ab) {
				ab = [];
				if (Y.id) {
					y.each(g(Y.id), function (ae, af) {
						ab.push(V.getById(af, false, ac) || V.objGetById(af))
					});
					if (!y.isArray(Y.id)) {
						ab = ab[0]
					}
				} else {
					y.each(Z ? g(Z) : [t], function (af, ag) {
						var ae;
						if (Y.first) {
							ae = V.get(ag, false, Y.tag, ac);
							if (ae) {
								ab.push(ae)
							}
						} else {
							if (Y.all) {
								y.each(V.all(ag, Y.tag, ac), function (ai, ah) {
									ab.push(ah)
								})
							} else {
								ae = V.get(ag, true, Y.tag, ac);
								if (ae) {
									ab.push(ae)
								}
							}
						}
					});
					if (!Y.all && !y.isArray(Z)) {
						ab = ab[0]
					}
				}
			}
			ab = y.isArray(ab) || !Y.all ? ab : [ab];
			if (ad) {
				return ab
			} else {
				O(aa, ab)
			}
		};
		this.getdistance = function (Y) {
			var Z;
			Y.opts.origins = g(Y.opts.origins);
			for (Z = 0; Z < Y.opts.origins.length; Z++) {
				Y.opts.origins[Z] = I(Y.opts.origins[Z], true)
			}
			Y.opts.destinations = g(Y.opts.destinations);
			for (Z = 0; Z < Y.opts.destinations.length; Z++) {
				Y.opts.destinations[Z] = I(Y.opts.destinations[Z], true)
			}
			B().getDistanceMatrix(Y.opts, function (ab, aa) {
				X(Y, aa === google.maps.DistanceMatrixStatus.OK ? ab : false, aa);
				P.ack()
			})
		};
		this.trigger = function (Z) {
			if (typeof Z.todo === "string") {
				google.maps.event.trigger(N, Z.todo)
			} else {
				var Y = [N, Z.todo.eventName];
				if (Z.todo.var_args) {
					y.each(Z.todo.var_args, function (ab, aa) {
						Y.push(aa)
					})
				}
				google.maps.event.trigger.apply(google.maps.event, Y)
			}
			X(Z);
			P.ack()
		}
	}

	function s(M) {
		var L;
		if (!typeof M === "object" || !M.hasOwnProperty("get")) {
			return false
		}
		for (L in M) {
			if (L !== "get") {
				return false
			}
		}
		return !M.get.hasOwnProperty("callback")
	}

	y.fn.gmap3 = function () {
		var M, O = [], N = true, L = [];
		J();
		for (M = 0; M < arguments.length; M++) {
			if (arguments[M]) {
				O.push(arguments[M])
			}
		}
		if (!O.length) {
			O.push("map")
		}
		y.each(this, function () {
			var P = y(this), Q = P.data("gmap3");
			N = false;
			if (!Q) {
				Q = new K(P);
				P.data("gmap3", Q)
			}
			if (O.length === 1 && (O[0] === "get" || s(O[0]))) {
				if (O[0] === "get") {
					L.push(Q.get("map", true))
				} else {
					L.push(Q.get(O[0].get, true, O[0].get.full))
				}
			} else {
				Q._plan(O)
			}
		});
		if (L.length) {
			if (L.length === 1) {
				return L[0]
			} else {
				return L
			}
		}
		return this
	}
})(jQuery);

/**
 * @preserve HTML5 Shiv 3.7.2 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
 */
!function(a,b){function c(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function d(){var a=t.elements;return"string"==typeof a?a.split(" "):a}function e(a,b){var c=t.elements;"string"!=typeof c&&(c=c.join(" ")),"string"!=typeof a&&(a=a.join(" ")),t.elements=c+" "+a,j(b)}function f(a){var b=s[a[q]];return b||(b={},r++,a[q]=r,s[r]=b),b}function g(a,c,d){if(c||(c=b),l)return c.createElement(a);d||(d=f(c));var e;return e=d.cache[a]?d.cache[a].cloneNode():p.test(a)?(d.cache[a]=d.createElem(a)).cloneNode():d.createElem(a),!e.canHaveChildren||o.test(a)||e.tagUrn?e:d.frag.appendChild(e)}function h(a,c){if(a||(a=b),l)return a.createDocumentFragment();c=c||f(a);for(var e=c.frag.cloneNode(),g=0,h=d(),i=h.length;i>g;g++)e.createElement(h[g]);return e}function i(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return t.shivMethods?g(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+d().join().replace(/[\w\-:]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(t,b.frag)}function j(a){a||(a=b);var d=f(a);return!t.shivCSS||k||d.hasCSS||(d.hasCSS=!!c(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),l||i(a,d),a}var k,l,m="3.7.2",n=a.html5||{},o=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,p=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,q="_html5shiv",r=0,s={};!function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",k="hidden"in a,l=1==a.childNodes.length||function(){b.createElement("a");var a=b.createDocumentFragment();return"undefined"==typeof a.cloneNode||"undefined"==typeof a.createDocumentFragment||"undefined"==typeof a.createElement}()}catch(c){k=!0,l=!0}}();var t={elements:n.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",version:m,shivCSS:n.shivCSS!==!1,supportsUnknownElements:l,shivMethods:n.shivMethods!==!1,type:"default",shivDocument:j,createElement:g,createDocumentFragment:h,addElements:e};a.html5=t,j(b)}(this,document);
/*!
 * imagesLoaded PACKAGED v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function(){function e(){}function t(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var i=e.prototype,r=this,o=r.EventEmitter;i.getListeners=function(e){var t,n,i=this._getEvents();if("object"==typeof e){t={};for(n in i)i.hasOwnProperty(n)&&e.test(n)&&(t[n]=i[n])}else t=i[e]||(i[e]=[]);return t},i.flattenListeners=function(e){var t,n=[];for(t=0;e.length>t;t+=1)n.push(e[t].listener);return n},i.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},i.addListener=function(e,n){var i,r=this.getListenersAsObject(e),o="object"==typeof n;for(i in r)r.hasOwnProperty(i)&&-1===t(r[i],n)&&r[i].push(o?n:{listener:n,once:!1});return this},i.on=n("addListener"),i.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},i.once=n("addOnceListener"),i.defineEvent=function(e){return this.getListeners(e),this},i.defineEvents=function(e){for(var t=0;e.length>t;t+=1)this.defineEvent(e[t]);return this},i.removeListener=function(e,n){var i,r,o=this.getListenersAsObject(e);for(r in o)o.hasOwnProperty(r)&&(i=t(o[r],n),-1!==i&&o[r].splice(i,1));return this},i.off=n("removeListener"),i.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},i.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},i.manipulateListeners=function(e,t,n){var i,r,o=e?this.removeListener:this.addListener,s=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(i=n.length;i--;)o.call(this,t,n[i]);else for(i in t)t.hasOwnProperty(i)&&(r=t[i])&&("function"==typeof r?o.call(this,i,r):s.call(this,i,r));return this},i.removeEvent=function(e){var t,n=typeof e,i=this._getEvents();if("string"===n)delete i[e];else if("object"===n)for(t in i)i.hasOwnProperty(t)&&e.test(t)&&delete i[t];else delete this._events;return this},i.removeAllListeners=n("removeEvent"),i.emitEvent=function(e,t){var n,i,r,o,s=this.getListenersAsObject(e);for(r in s)if(s.hasOwnProperty(r))for(i=s[r].length;i--;)n=s[r][i],n.once===!0&&this.removeListener(e,n.listener),o=n.listener.apply(this,t||[]),o===this._getOnceReturnValue()&&this.removeListener(e,n.listener);return this},i.trigger=n("emitEvent"),i.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},i.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},i._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},i._getEvents=function(){return this._events||(this._events={})},e.noConflict=function(){return r.EventEmitter=o,e},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return e}):"object"==typeof module&&module.exports?module.exports=e:this.EventEmitter=e}).call(this),function(e){function t(t){var n=e.event;return n.target=n.target||n.srcElement||t,n}var n=document.documentElement,i=function(){};n.addEventListener?i=function(e,t,n){e.addEventListener(t,n,!1)}:n.attachEvent&&(i=function(e,n,i){e[n+i]=i.handleEvent?function(){var n=t(e);i.handleEvent.call(i,n)}:function(){var n=t(e);i.call(e,n)},e.attachEvent("on"+n,e[n+i])});var r=function(){};n.removeEventListener?r=function(e,t,n){e.removeEventListener(t,n,!1)}:n.detachEvent&&(r=function(e,t,n){e.detachEvent("on"+t,e[t+n]);try{delete e[t+n]}catch(i){e[t+n]=void 0}});var o={bind:i,unbind:r};"function"==typeof define&&define.amd?define("eventie/eventie",o):e.eventie=o}(this),function(e,t){"function"==typeof define&&define.amd?define(["eventEmitter/EventEmitter","eventie/eventie"],function(n,i){return t(e,n,i)}):"object"==typeof exports?module.exports=t(e,require("wolfy87-eventemitter"),require("eventie")):e.imagesLoaded=t(e,e.EventEmitter,e.eventie)}(window,function(e,t,n){function i(e,t){for(var n in t)e[n]=t[n];return e}function r(e){return"[object Array]"===d.call(e)}function o(e){var t=[];if(r(e))t=e;else if("number"==typeof e.length)for(var n=0,i=e.length;i>n;n++)t.push(e[n]);else t.push(e);return t}function s(e,t,n){if(!(this instanceof s))return new s(e,t);"string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=o(e),this.options=i({},this.options),"function"==typeof t?n=t:i(this.options,t),n&&this.on("always",n),this.getImages(),a&&(this.jqDeferred=new a.Deferred);var r=this;setTimeout(function(){r.check()})}function f(e){this.img=e}function c(e){this.src=e,v[e]=this}var a=e.jQuery,u=e.console,h=u!==void 0,d=Object.prototype.toString;s.prototype=new t,s.prototype.options={},s.prototype.getImages=function(){this.images=[];for(var e=0,t=this.elements.length;t>e;e++){var n=this.elements[e];"IMG"===n.nodeName&&this.addImage(n);var i=n.nodeType;if(i&&(1===i||9===i||11===i))for(var r=n.querySelectorAll("img"),o=0,s=r.length;s>o;o++){var f=r[o];this.addImage(f)}}},s.prototype.addImage=function(e){var t=new f(e);this.images.push(t)},s.prototype.check=function(){function e(e,r){return t.options.debug&&h&&u.log("confirm",e,r),t.progress(e),n++,n===i&&t.complete(),!0}var t=this,n=0,i=this.images.length;if(this.hasAnyBroken=!1,!i)return this.complete(),void 0;for(var r=0;i>r;r++){var o=this.images[r];o.on("confirm",e),o.check()}},s.prototype.progress=function(e){this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded;var t=this;setTimeout(function(){t.emit("progress",t,e),t.jqDeferred&&t.jqDeferred.notify&&t.jqDeferred.notify(t,e)})},s.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";this.isComplete=!0;var t=this;setTimeout(function(){if(t.emit(e,t),t.emit("always",t),t.jqDeferred){var n=t.hasAnyBroken?"reject":"resolve";t.jqDeferred[n](t)}})},a&&(a.fn.imagesLoaded=function(e,t){var n=new s(this,e,t);return n.jqDeferred.promise(a(this))}),f.prototype=new t,f.prototype.check=function(){var e=v[this.img.src]||new c(this.img.src);if(e.isConfirmed)return this.confirm(e.isLoaded,"cached was confirmed"),void 0;if(this.img.complete&&void 0!==this.img.naturalWidth)return this.confirm(0!==this.img.naturalWidth,"naturalWidth"),void 0;var t=this;e.on("confirm",function(e,n){return t.confirm(e.isLoaded,n),!0}),e.check()},f.prototype.confirm=function(e,t){this.isLoaded=e,this.emit("confirm",this,t)};var v={};return c.prototype=new t,c.prototype.check=function(){if(!this.isChecked){var e=new Image;n.bind(e,"load",this),n.bind(e,"error",this),e.src=this.src,this.isChecked=!0}},c.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},c.prototype.onload=function(e){this.confirm(!0,"onload"),this.unbindProxyEvents(e)},c.prototype.onerror=function(e){this.confirm(!1,"onerror"),this.unbindProxyEvents(e)},c.prototype.confirm=function(e,t){this.isConfirmed=!0,this.isLoaded=e,this.emit("confirm",this,t)},c.prototype.unbindProxyEvents=function(e){n.unbind(e.target,"load",this),n.unbind(e.target,"error",this)},s});
(function($) {

    var elementList = [];
    /**
     * v Velocity of the mouse pointer
     * vd Magnitude of velocity
     * p Position of the mouse pointer
     * t Average delta time for a simple calculation of new position, x = x0 +  v * t
     * mouseX the last retrived x coordinate of mouse cursor
     * mouseY the last retrived y coordinate of mouse cursor
     * anticipator a jquery object to debug where mouse is aiming
     * anticipator.size, anticipator.radius, anticipator.center, anticipator.rect anticipator related properties
     * anRad Radius (or size) of the anticipator, increases as mouse move faster
     */

    var v = {x: 0, y: 0},
        vd = 0,
        p = {x: 0, y: 0},
        t = 12,
        mouseX = 0,
        mouseY = 0,
        DEBUG = false,
        anticipator = {
            size: 50,
            center: {x: 0, y: 0},
            effectiveSize: 1
        };
    anticipator.rect = {x0: 0, y0: 0, x1: anticipator.size, y1: anticipator.size};

    /*
     * Default anticipate function 
     * 
     * @function anticipateFunc
     * 
     * @param {type} p position of anticipator
     * @param {type} v velocity of anticipator
     * @param {type} mouseX mouse X coordinate
     * @param {type} mouseY mouse Y coordinate
     * @param {type} anticipator anticipator object
     * @returns {undefined}
     */

    function anticipateFunc(p, v, mouseX, mouseY, anticipator) {
        var a = anticipator;

        //smoothen velocity values with ratio 0.7/0.3
        if (p.x && p.y) {
            v.x = v.x * 0.7 + (mouseX - p.x) * 0.3;
            v.y = v.y * 0.7 + (mouseY - p.y) * 0.3;
        }

        p.x = mouseX;
        p.y = mouseY;

        //find velocity magnitude
        vd = Math.sqrt(v.x * v.x + v.y * v.y);
        vd < 0.1 && (v.x = 0, v.y = 0);

        //change radius according to velocity magnitude
        a.effectiveSize = Math.sqrt(a.size * vd + 1);

        //assign anticipator coordinates according to new velocity values and smoothen it with ratio 0.7/0.3
        a.center.x = a.center.x * 0.7 + (p.x + v.x * t) * 0.3;
        a.center.x < 0 && (a.center.x = 0);
        (a.center.x > $(window).width() - a.effectiveSize) && (a.center.x = $(window).width() - a.effectiveSize);

        a.rect.x0 = a.center.x - a.effectiveSize;
        a.rect.x1 = a.center.x + a.effectiveSize;

        a.center.y = a.center.y * 0.7 + (p.y + v.y * t) * 0.3;
        a.center.y < 0 && (a.center.y = 0);
        (a.center.y > $(window).height() - a.effectiveSize) && (a.center.y = $(window).height() - a.effectiveSize);

        a.rect.y0 = a.center.y - a.effectiveSize;
        a.rect.y1 = a.center.y + a.effectiveSize;
    }


    $.fn.aim = function(opts) {
        // Initialize menu-aim for all elements in jQuery collection
        this.each(function() {
            init.call(this, opts);
        });

        return this;
    };

    /*
     * Sets debug mode to true or false. If debug mode is set to true, a circle showing the 
     * position and radius of anticipator will be created
     * 
     * @param {type} val
     * @returns {undefined}
     */

    $.aim = {};

    $.aim.setDebug = function(val) {
        if (val) {
            if ($('#jquery-aim-debug').length) {
                return;
            }
            anticipator.elem = createDebugObject();

        } else {
            $('#jquery-aim-debug').remove();
            anticipator.elem = null;
        }
        DEBUG = val;
    };


    $.aim.setAnticipateFunction = function(func) {
        if (typeof func === 'function') {
            anticipateFunc = func;
        }
    };

    /*
     * Adds properties with jquery `.data()` function so each time it doesn't recalculate every property
     *  
     * @param {type} elem Jquery element to add properties
     * @returns {undefined} none
     */

    function addProperties($elem) {
        var percent = 0.25;
        var w = $elem.outerWidth();
        var h = $elem.outerHeight();
        var x = $elem.offset().left;
        var y = $elem.offset().top;

        var max = Math.sqrt(w * w + h * h);
        var r = max / 2 * (1 + percent);

        $elem.data('aim-data', {
                rect: {
                    x0: x,
                    y0: y,
                    x1: x + w,
                    y1: y + h
                },
                center: {x: x, y: y},
                increment: 0
            }
        );
    }

    /*
     * Creates a circle jquery object which is to be used to 
     * show where the anticipator is at any time
     * 
     * @returns {Object}
     */
    function createDebugObject() {
        var s = anticipator.size;
        var elem = $('<div>')
            .attr({
                id: 'jquery-aim-debug'
            })
            .css({
                width: 2 * s + 'px',
                height: 2 * s + 'px',
                'margin-left': -s + 'px',
                'margin-top': -s + 'px',
                top: 0,
                left: 0,
                border: '2px solid #333',
                opacity: 0.3,
                'background-color': 'yellowgreen',
                position: 'absolute',
                'pointer-events':'none'
            })
            .appendTo($('body'));
        return elem;
    }

    /*
     * Tests rectangle - rectangle intersection and gives the ratio of intersection. Max 1, min 0.
     * 
     * @param {type} rect The first rectange
     * @param {type} rect2 The second rectange
     * @returns {Number} Ratio of intersection area to area of tailblazer
     */

    function intersectRatio(rect, rect2) {

        var x_overlap = Math.max(0, Math.min(rect.x1, rect2.x1) - Math.max(rect.x0, rect2.x0));
        var y_overlap = Math.max(0, Math.min(rect.y1, rect2.y1) - Math.max(rect.y0, rect2.y0));

        return x_overlap * y_overlap / (anticipator.effectiveSize * anticipator.effectiveSize);
    }

    function init(opts) {
        var $this = $(this);
        if ($.inArray($this, elementList) > -1)
            return;

        elementList.push($this);
        addProperties($this);
        $this.data('aim-data').options = opts;
    }

    $().ready(function() {
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX,
                mouseY = e.clientY;
        }, false);
    });


    var timer = setInterval(function() {
        var a = anticipator;

        if (!elementList.length)
            return;

        anticipateFunc(p, v, mouseX, mouseY, a);


        var prop = 'translate(' + a.center.x + 'px,' + a.center.y + 'px) scale(' + a.effectiveSize / a.size + ')';

        DEBUG && a.elem.css({
            '-webkit-transform': prop,
            '-moz-transform': prop,
            '-ms-transform': prop,
            'transform': prop
            /*width: tbRad * 2,
             height: tbRad * 2,
             marginLeft: -tbRad + 'px',
             marginTop: -tbRad + 'px'*/
        });

        /* 
         * Iterate over each elements and calculate increment for all
         * In each cycle, it increases by a value between 0 - 0.2 (reaches max if it fully intersects) and decreases by 0.05
         * Increment can be between 0 and 2
         * If it's greater than 1, aimEnter function will be called
         * if it's less than or equal to 0, aimExit function will be called 
         */
        for (var i = 0; i < elementList.length; i++) {

            var target = elementList[i];

            var data = target.data('aim-data');

            var isctRat = intersectRatio(data.rect, a.rect);

            //check if they intersects and mouse is not on the element
            if (isctRat && vd !== 0) {

                data.increment = data.increment + isctRat * 0.2;
                if (data.increment > 1 && data.increment < 2) {
                    if (data.options.className)
                        target.addClass(data.options.className);
                    else if (data.options.aimEnter && typeof data.options.aimEnter === 'function')
                        data.options.aimEnter.call(target, true);

                    if (data.increment > 2) {
                        data.increment = 2;
                    }
                    DEBUG && a.elem.css('background-color', 'tomato');
                } else if (data.increment > 2) {
                    data.increment = 2;
                    DEBUG && a.elem.css('background-color', 'tomato');
                }
                break;
            } else {
                DEBUG && a.elem.css('background-color', 'yellowgreen');
            }

            if (data.increment !== 0) {
                data.increment = data.increment - 0.05;
                if (data.increment < 0) {
                    data.increment = 0;
                    if (data.options.className)
                        target.removeClass(data.options.className);
                    else if (data.options.aimExit && typeof data.options.aimExit === 'function')
                        data.options.aimExit.call(target, true);
                }
            }
        }

    }, 16); //~60 FPS

})(jQuery);

/*
 * jQuery djax
 *
 * @version v0.122
 *
 * Copyright 2012, Brian Zeligson
 * Released under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Homepage:
 *   http://beezee.github.com/djax.html
 *
 * Authors:
 *   Brian Zeligson
 *
 * Contributors:
 *  Gary Jones @GaryJones
 *
 * Maintainer:
 *   Brian Zeligson github @beezee
 *
 */

/*jslint browser: true, indent: 4, maxerr: 50, sub: true */
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, noarg:true, noempty:true, nomen:true, nonew:true, onevar:true, plusplus:true, regexp:true, smarttabs:true, strict:true, trailing:true, undef:true, white:true, browser:true, jquery:true, indent:4, maxerr:50, */
/*global jQuery */

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name jquery.djax.js
// @externs_url http://closure-compiler.googlecode.com/svn/trunk/contrib/externs/jquery-1.7.js
// ==/ClosureCompiler==
// http://closure-compiler.appspot.com/home

(function ($, exports) {
	'use strict';

	$.support.cors = true;

	$.fn.djax = function (selector, exceptions, replaceBlockWithFunc) {

		// If browser doesn't support pushState, abort now
		if (!history.pushState) {
			return $(this);
		}

		var self = this,
			blockSelector = selector,
			excludes = (exceptions && exceptions.length) ? exceptions : [],
			replaceBlockWith = (replaceBlockWithFunc) ? replaceBlockWithFunc : $.fn.replaceWith,
			djaxing = false;

		// Ensure that the history is correct when going from 2nd page to 1st
		window.history.replaceState(
			{
				'url' : window.location.href,
				'title' : $('title').text()
			},
			$('title').text(),
			window.location.href
		);

		if (globalDebug) {console.log("djax::replaceState url:" + window.location.href);}

		self.clearDjaxing = function() {
			self.djaxing = false;
		}

		// Exclude the link exceptions
		self.attachClick = function (element, event) {

			var link = $(element),
				exception = false;

			$.each(excludes, function (index, exclusion) {
				if (link.attr('href').indexOf(exclusion) !== -1) {
					exception = true;
				}
				if (window.location.href.indexOf(exclusion) !== -1) {
					exception = true;
				}
			});

			// If the link is one of the exceptions, return early so that
			// the link can be clicked and a full page load as normal
			if (exception) {
				return $(element);
			}

			// From this point on, we handle the behaviour
			event.preventDefault();

			// If we're already doing djaxing, return now and silently fail
			if (self.djaxing) {
				setTimeout(self.clearDjaxing, 1000);
				return $(element);
			}

			$(window).trigger('djaxClick', [element]);
			self.reqUrl = link.attr('href');
			self.triggered = false;
			self.navigate(link.attr('href'), true);
		};

		// Handle the navigation
		self.navigate = function (url, add) {

			var blocks = $(blockSelector);

			self.djaxing = true;

			// Get the new page
			$(window).trigger(
				'djaxLoading',
				[{
					'url' : url
				}]
			);

			var replaceBlocks = function (response) {
				if (url !== self.reqUrl) {
					self.navigate(self.reqUrl, false);
					return true;
				}

				var result = $(response),
					newBlocks = $(result).find(blockSelector);

				if ( add === true ) {
					window.history.pushState(
						{
							'url' : url,
							'title' : $(result).filter('title').text()
						},
						$(result).filter('title').text(),
						url
					);

					if (globalDebug) {console.log("djax::pushState url:" + url);}
				}

				// Set page title as new page title
				// Set title cross-browser:
				// - $('title').text(title_text); returns an error on IE7
				//
				document.title = $(result).filter('title').text();

				// Loop through each block and find new page equivalent
				blocks.each(function () {

					var id = '#' + $(this).attr('id'),
						newBlock = newBlocks.filter(id),
						block = $(this);

					$('a', newBlock).filter(function () {
						return this.hostname === location.hostname;
					}).addClass('dJAX_internal').one('click', function (event) {
						return self.attachClick(this, event);
					});

					if (newBlock.length) {
						if (block.html() !== newBlock.html()) {
							replaceBlockWith.call(block, newBlock);

						}
					} else {
						block.remove();
					}

				});

				// Loop through new page blocks and add in as needed
				$.each(newBlocks, function () {

					var newBlock = $(this),
						id = '#' + $(this).attr('id'),
						$previousSibling;

					// If there is a new page block without an equivalent block
					// in the old page, we need to find out where to insert it
					if (!$(id).length) {

						// Find the previous sibling
						$previousSibling = $(result).find(id).prev();

						if ($previousSibling.length) {
							// Insert after the previous element
							newBlock.insertAfter('#' + $previousSibling.attr('id'));
						} else {
							// There's no previous sibling, so prepend to parent instead
							newBlock.prependTo('#' + newBlock.parent().attr('id'));
						}

						// Only add a class to internal links
						$('a', newBlock).filter(function () {
							return this.hostname === location.hostname;
						}).addClass('dJAX_internal').one('click', function (event) {
							return self.attachClick(this, event);
						});
					}

				});


				// Trigger djaxLoad event as a pseudo ready()
				if (!self.triggered) {
					$(window).trigger(
						'djaxLoad',
						[{
							'url' : url,
							'title' : $(result).filter('title').text(),
							'response' : response
						}]
					);
					self.triggered = true;
					self.djaxing = false;
				}

				// Trigger a djaxLoaded event when done
				$(window).trigger(
					'djaxLoaded',
					[{
						'url' : url,
						'title' : $(result).filter('title').text(),
						'response' : response
					}]
				);
			};

			$.ajax({
				'url' : url,
				'success' : function (response) {
					replaceBlocks(response);
				},
				'error' : function (response, textStatus, errorThrown) {
					// handle error
					console.log('error', response, textStatus, errorThrown);
					replaceBlocks(response['responseText']);
				}
			});
		}; /* End self.navigate */

		// Only add a class to internal links
		$(this).find('a').filter(function () {
			return this.hostname === location.hostname;
		}).addClass('dJAX_internal').one('click', function (event) {
			return self.attachClick(this, event);
		});

		// On new page load
		$(window).bind('popstate', function (event) {
			self.triggered = false;
			if (event.originalEvent.state) {
				self.reqUrl = event.originalEvent.state.url;
				self.navigate(event.originalEvent.state.url, false);
			}
		});

	};

}(jQuery, window));
/*!
 * VERSION: 0.1.8
 * DATE: 2014-06-21
 * UPDATES AND DOCS AT: http://www.greensock.com/jquery-gsap-plugin/
 *
 * Requires TweenLite version 1.8.0 or higher and CSSPlugin.
 *
 * @license Copyright (c) 2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 */
(function (t) {
	"use strict";
	var e, i, s, r = t.fn.animate, n = t.fn.stop, a = !0, o = function (t) {
		var e, i = {};
		for (e in t)i[e] = t[e];
		return i
	}, h = {
		overwrite: 1,
		delay: 1,
		useFrames: 1,
		runBackwards: 1,
		easeParams: 1,
		yoyo: 1,
		immediateRender: 1,
		repeat: 1,
		repeatDelay: 1,
		autoCSS: 1
	}, l = function (t, e) {
		for (var i in h)h[i] && void 0 !== t[i] && (e[i] = t[i])
	}, _ = function (t) {
		return function (e) {
			return t.getRatio(e)
		}
	}, u = {}, c = function () {
		var r, n, a, o = window.GreenSockGlobals || window;
		if (e = o.TweenMax || o.TweenLite, e && (r = (e.version + ".0.0").split("."), n = !(Number(r[0]) > 0 && Number(r[1]) > 7), o = o.com.greensock, i = o.plugins.CSSPlugin, u = o.easing.Ease.map || {}), !e || !i || n)return e = null, !s && window.console && (window.console.log("The jquery.gsap.js plugin requires the TweenMax (or at least TweenLite and CSSPlugin) JavaScript file(s)." + (n ? " Version " + r.join(".") + " is too old." : "")), s = !0), void 0;
		if (t.easing) {
			for (a in u)t.easing[a] = _(u[a]);
			c = !1
		}
	};
	t.fn.animate = function (s, n, h, _) {
		if (s = s || {}, c && (c(), !e || !i))return r.call(this, s, n, h, _);
		if (!a || s.skipGSAP === !0 || "object" == typeof n && "function" == typeof n.step || null != s.scrollTop || null != s.scrollLeft)return r.call(this, s, n, h, _);
		var f, p, m, d, g = t.speed(n, h, _), v = {ease: u[g.easing] || (g.easing === !1 ? u.linear : u.swing)}, T = this, y = "object" == typeof n ? n.specialEasing : null;
		for (p in s) {
			if (f = s[p], f instanceof Array && u[f[1]] && (y = y || {}, y[p] = f[1], f = f[0]), "toggle" === f || "hide" === f || "show" === f)return r.call(this, s, n, h, _);
			v[-1 === p.indexOf("-") ? p : t.camelCase(p)] = f
		}
		if (y) {
			v = o(v), d = [];
			for (p in y)f = d[d.length] = {}, l(v, f), f.ease = u[y[p]] || v.ease, -1 !== p.indexOf("-") && (p = t.camelCase(p)), f[p] = v[p], delete v[p];
			0 === d.length && (d = null)
		}
		return m = function (i) {
			var s, r = o(v);
			if (d)for (s = d.length; --s > -1;)e.to(this, t.fx.off ? 0 : g.duration / 1e3, d[s]);
			r.onComplete = function () {
				i ? i() : g.old && t(this).each(g.old)
			}, e.to(this, t.fx.off ? 0 : g.duration / 1e3, r)
		}, g.queue !== !1 ? (T.queue(g.queue, m), "function" == typeof g.old && T.queue(g.queue, function (t) {
			g.old(), t()
		})) : m.call(T), T
	}, t.fn.stop = function (t, i) {
		if (n.call(this, t, i), e) {
			if (i)for (var s, r = e.getTweensOf(this), a = r.length; --a > -1;)s = r[a].totalTime() / r[a].totalDuration(), s > 0 && 1 > s && r[a].seek(r[a].totalDuration());
			e.killTweensOf(this)
		}
		return this
	}, t.gsap = {
		enabled: function (t) {
			a = t
		}, version: "0.1.8"
	}
})(jQuery);
/*!
 * hoverIntent v1.8.0 // 2014.06.29 // jQuery v1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2014 Brian Cherne
 */
 
/* hoverIntent is similar to jQuery's built-in "hover" method except that
 * instead of firing the handlerIn function immediately, hoverIntent checks
 * to see if the user's mouse has slowed down (beneath the sensitivity
 * threshold) before firing the event. The handlerOut function is only
 * called after a matching handlerIn.
 *
 * // basic usage ... just like .hover()
 * .hoverIntent( handlerIn, handlerOut )
 * .hoverIntent( handlerInOut )
 *
 * // basic usage ... with event delegation!
 * .hoverIntent( handlerIn, handlerOut, selector )
 * .hoverIntent( handlerInOut, selector )
 *
 * // using a basic configuration object
 * .hoverIntent( config )
 *
 * @param  handlerIn   function OR configuration object
 * @param  handlerOut  function OR selector for delegation OR undefined
 * @param  selector    selector OR undefined
 * @author Brian Cherne <brian(at)cherne(dot)net>
 */
(function($) {
    $.fn.hoverIntent = function(handlerIn,handlerOut,selector) {

        // default configuration values
        var cfg = {
            interval: 100,
            sensitivity: 6,
            timeout: 0
        };

        if ( typeof handlerIn === "object" ) {
            cfg = $.extend(cfg, handlerIn );
        } else if ($.isFunction(handlerOut)) {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerOut, selector: selector } );
        } else {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerIn, selector: handlerOut } );
        }

        // instantiate variables
        // cX, cY = current X and Y position of mouse, updated by mousemove event
        // pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
        var cX, cY, pX, pY;

        // A private function for getting mouse position
        var track = function(ev) {
            cX = ev.pageX;
            cY = ev.pageY;
        };

        // A private function for comparing current and previous mouse position
        var compare = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            // compare mouse positions to see if they've crossed the threshold
            if ( Math.sqrt( (pX-cX)*(pX-cX) + (pY-cY)*(pY-cY) ) < cfg.sensitivity ) {
                $(ob).off("mousemove.hoverIntent",track);
                // set hoverIntent state to true (so mouseOut can be called)
                ob.hoverIntent_s = true;
                return cfg.over.apply(ob,[ev]);
            } else {
                // set previous coordinates for next time
                pX = cX; pY = cY;
                // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
                ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
            }
        };

        // A private function for delaying the mouseOut function
        var delay = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            ob.hoverIntent_s = false;
            return cfg.out.apply(ob,[ev]);
        };

        // A private function for handling mouse 'hovering'
        var handleHover = function(e) {
            // copy objects to be passed into t (required for event object to be passed in IE)
            var ev = $.extend({},e);
            var ob = this;

            // cancel hoverIntent timer if it exists
            if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

            // if e.type === "mouseenter"
            if (e.type === "mouseenter") {
                // set "previous" X and Y position based on initial entry point
                pX = ev.pageX; pY = ev.pageY;
                // update "current" X and Y position based on mousemove
                $(ob).on("mousemove.hoverIntent",track);
                // start polling interval (self-calling timeout) to compare mouse coordinates over time
                if (!ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

                // else e.type == "mouseleave"
            } else {
                // unbind expensive mousemove event
                $(ob).off("mousemove.hoverIntent",track);
                // if hoverIntent state is true, then call the mouseOut function after the specified delay
                if (ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
            }
        };

        // listen for mouseenter and mouseleave
        return this.on({'mouseenter.hoverIntent':handleHover,'mouseleave.hoverIntent':handleHover}, cfg.selector);
    };
})(jQuery);

// Magnific Popup v0.9.9 by Dmitry Semenov
// http://bit.ly/magnific-popup#build=image+iframe+gallery+retina+imagezoom+fastclick
(function(a){var b="Close",c="BeforeClose",d="AfterClose",e="BeforeAppend",f="MarkupParse",g="Open",h="Change",i="mfp",j="."+i,k="mfp-ready",l="mfp-removing",m="mfp-prevent-close",n,o=function(){},p=!!window.jQuery,q,r=a(window),s,t,u,v,w,x=function(a,b){n.ev.on(i+a+j,b)},y=function(b,c,d,e){var f=document.createElement("div");return f.className="mfp-"+b,d&&(f.innerHTML=d),e?c&&c.appendChild(f):(f=a(f),c&&f.appendTo(c)),f},z=function(b,c){n.ev.triggerHandler(i+b,c),n.st.callbacks&&(b=b.charAt(0).toLowerCase()+b.slice(1),n.st.callbacks[b]&&n.st.callbacks[b].apply(n,a.isArray(c)?c:[c]))},A=function(b){if(b!==w||!n.currTemplate.closeBtn)n.currTemplate.closeBtn=a(n.st.closeMarkup.replace("%title%",n.st.tClose)),w=b;return n.currTemplate.closeBtn},B=function(){a.magnificPopup.instance||(n=new o,n.init(),a.magnificPopup.instance=n)},C=function(){var a=document.createElement("p").style,b=["ms","O","Moz","Webkit"];if(a.transition!==undefined)return!0;while(b.length)if(b.pop()+"Transition"in a)return!0;return!1};o.prototype={constructor:o,init:function(){var b=navigator.appVersion;n.isIE7=b.indexOf("MSIE 7.")!==-1,n.isIE8=b.indexOf("MSIE 8.")!==-1,n.isLowIE=n.isIE7||n.isIE8,n.isAndroid=/android/gi.test(b),n.isIOS=/iphone|ipad|ipod/gi.test(b),n.supportsTransition=C(),n.probablyMobile=n.isAndroid||n.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),t=a(document),n.popupsCache={}},open:function(b){s||(s=a(document.body));var c;if(b.isObj===!1){n.items=b.items.toArray(),n.index=0;var d=b.items,e;for(c=0;c<d.length;c++){e=d[c],e.parsed&&(e=e.el[0]);if(e===b.el[0]){n.index=c;break}}}else n.items=a.isArray(b.items)?b.items:[b.items],n.index=b.index||0;if(n.isOpen){n.updateItemHTML();return}n.types=[],v="",b.mainEl&&b.mainEl.length?n.ev=b.mainEl.eq(0):n.ev=t,b.key?(n.popupsCache[b.key]||(n.popupsCache[b.key]={}),n.currTemplate=n.popupsCache[b.key]):n.currTemplate={},n.st=a.extend(!0,{},a.magnificPopup.defaults,b),n.fixedContentPos=n.st.fixedContentPos==="auto"?!n.probablyMobile:n.st.fixedContentPos,n.st.modal&&(n.st.closeOnContentClick=!1,n.st.closeOnBgClick=!1,n.st.showCloseBtn=!1,n.st.enableEscapeKey=!1),n.bgOverlay||(n.bgOverlay=y("bg").on("click"+j,function(){n.close()}),n.wrap=y("wrap").attr("tabindex",-1).on("click"+j,function(a){n._checkIfClose(a.target)&&n.close()}),n.container=y("container",n.wrap)),n.contentContainer=y("content"),n.st.preloader&&(n.preloader=y("preloader",n.container,n.st.tLoading));var h=a.magnificPopup.modules;for(c=0;c<h.length;c++){var i=h[c];i=i.charAt(0).toUpperCase()+i.slice(1),n["init"+i].call(n)}z("BeforeOpen"),n.st.showCloseBtn&&(n.st.closeBtnInside?(x(f,function(a,b,c,d){c.close_replaceWith=A(d.type)}),v+=" mfp-close-btn-in"):n.wrap.append(A())),n.st.alignTop&&(v+=" mfp-align-top"),n.fixedContentPos?n.wrap.css({overflow:n.st.overflowY,overflowX:"hidden",overflowY:n.st.overflowY}):n.wrap.css({top:r.scrollTop(),position:"absolute"}),(n.st.fixedBgPos===!1||n.st.fixedBgPos==="auto"&&!n.fixedContentPos)&&n.bgOverlay.css({height:t.height(),position:"absolute"}),n.st.enableEscapeKey&&t.on("keyup"+j,function(a){a.keyCode===27&&n.close()}),r.on("resize"+j,function(){n.updateSize()}),n.st.closeOnContentClick||(v+=" mfp-auto-cursor"),v&&n.wrap.addClass(v);var l=n.wH=r.height(),m={};if(n.fixedContentPos&&n._hasScrollBar(l)){var o=n._getScrollbarSize();o&&(m.marginRight=o)}n.fixedContentPos&&(n.isIE7?a("body, html").css("overflow","hidden"):m.overflow="hidden");var p=n.st.mainClass;return n.isIE7&&(p+=" mfp-ie7"),p&&n._addClassToMFP(p),n.updateItemHTML(),z("BuildControls"),a("html").css(m),n.bgOverlay.add(n.wrap).prependTo(n.st.prependTo||s),n._lastFocusedEl=document.activeElement,setTimeout(function(){n.content?(n._addClassToMFP(k),n._setFocus()):n.bgOverlay.addClass(k),t.on("focusin"+j,n._onFocusIn)},16),n.isOpen=!0,n.updateSize(l),z(g),b},close:function(){if(!n.isOpen)return;z(c),n.isOpen=!1,n.st.removalDelay&&!n.isLowIE&&n.supportsTransition?(n._addClassToMFP(l),setTimeout(function(){n._close()},n.st.removalDelay)):n._close()},_close:function(){z(b);var c=l+" "+k+" ";n.bgOverlay.detach(),n.wrap.detach(),n.container.empty(),n.st.mainClass&&(c+=n.st.mainClass+" "),n._removeClassFromMFP(c);if(n.fixedContentPos){var e={marginRight:""};n.isIE7?a("body, html").css("overflow",""):e.overflow="",a("html").css(e)}t.off("keyup"+j+" focusin"+j),n.ev.off(j),n.wrap.attr("class","mfp-wrap").removeAttr("style"),n.bgOverlay.attr("class","mfp-bg"),n.container.attr("class","mfp-container"),n.st.showCloseBtn&&(!n.st.closeBtnInside||n.currTemplate[n.currItem.type]===!0)&&n.currTemplate.closeBtn&&n.currTemplate.closeBtn.detach(),n._lastFocusedEl&&a(n._lastFocusedEl).focus(),n.currItem=null,n.content=null,n.currTemplate=null,n.prevHeight=0,z(d)},updateSize:function(a){if(n.isIOS){var b=document.documentElement.clientWidth/window.innerWidth,c=window.innerHeight*b;n.wrap.css("height",c),n.wH=c}else n.wH=a||r.height();n.fixedContentPos||n.wrap.css("height",n.wH),z("Resize")},updateItemHTML:function(){var b=n.items[n.index];n.contentContainer.detach(),n.content&&n.content.detach(),b.parsed||(b=n.parseEl(n.index));var c=b.type;z("BeforeChange",[n.currItem?n.currItem.type:"",c]),n.currItem=b;if(!n.currTemplate[c]){var d=n.st[c]?n.st[c].markup:!1;z("FirstMarkupParse",d),d?n.currTemplate[c]=a(d):n.currTemplate[c]=!0}u&&u!==b.type&&n.container.removeClass("mfp-"+u+"-holder");var e=n["get"+c.charAt(0).toUpperCase()+c.slice(1)](b,n.currTemplate[c]);n.appendContent(e,c),b.preloaded=!0,z(h,b),u=b.type,n.container.prepend(n.contentContainer),z("AfterChange")},appendContent:function(a,b){n.content=a,a?n.st.showCloseBtn&&n.st.closeBtnInside&&n.currTemplate[b]===!0?n.content.find(".mfp-close").length||n.content.append(A()):n.content=a:n.content="",z(e),n.container.addClass("mfp-"+b+"-holder"),n.contentContainer.append(n.content)},parseEl:function(b){var c=n.items[b],d;c.tagName?c={el:a(c)}:(d=c.type,c={data:c,src:c.src});if(c.el){var e=n.types;for(var f=0;f<e.length;f++)if(c.el.hasClass("mfp-"+e[f])){d=e[f];break}c.src=c.el.attr("data-mfp-src"),c.src||(c.src=c.el.attr("href"))}return c.type=d||n.st.type||"inline",c.index=b,c.parsed=!0,n.items[b]=c,z("ElementParse",c),n.items[b]},addGroup:function(a,b){var c=function(c){c.mfpEl=this,n._openClick(c,a,b)};b||(b={});var d="click.magnificPopup";b.mainEl=a,b.items?(b.isObj=!0,a.off(d).on(d,c)):(b.isObj=!1,b.delegate?a.off(d).on(d,b.delegate,c):(b.items=a,a.off(d).on(d,c)))},_openClick:function(b,c,d){var e=d.midClick!==undefined?d.midClick:a.magnificPopup.defaults.midClick;if(!e&&(b.which===2||b.ctrlKey||b.metaKey))return;var f=d.disableOn!==undefined?d.disableOn:a.magnificPopup.defaults.disableOn;if(f)if(a.isFunction(f)){if(!f.call(n))return!0}else if(r.width()<f)return!0;b.type&&(b.preventDefault(),n.isOpen&&b.stopPropagation()),d.el=a(b.mfpEl),d.delegate&&(d.items=c.find(d.delegate)),n.open(d)},updateStatus:function(a,b){if(n.preloader){q!==a&&n.container.removeClass("mfp-s-"+q),!b&&a==="loading"&&(b=n.st.tLoading);var c={status:a,text:b};z("UpdateStatus",c),a=c.status,b=c.text,n.preloader.html(b),n.preloader.find("a").on("click",function(a){a.stopImmediatePropagation()}),n.container.addClass("mfp-s-"+a),q=a}},_checkIfClose:function(b){if(a(b).hasClass(m))return;var c=n.st.closeOnContentClick,d=n.st.closeOnBgClick;if(c&&d)return!0;if(!n.content||a(b).hasClass("mfp-close")||n.preloader&&b===n.preloader[0])return!0;if(b!==n.content[0]&&!a.contains(n.content[0],b)){if(d&&a.contains(document,b))return!0}else if(c)return!0;return!1},_addClassToMFP:function(a){n.bgOverlay.addClass(a),n.wrap.addClass(a)},_removeClassFromMFP:function(a){this.bgOverlay.removeClass(a),n.wrap.removeClass(a)},_hasScrollBar:function(a){return(n.isIE7?t.height():document.body.scrollHeight)>(a||r.height())},_setFocus:function(){(n.st.focus?n.content.find(n.st.focus).eq(0):n.wrap).focus()},_onFocusIn:function(b){if(b.target!==n.wrap[0]&&!a.contains(n.wrap[0],b.target))return n._setFocus(),!1},_parseMarkup:function(b,c,d){var e;d.data&&(c=a.extend(d.data,c)),z(f,[b,c,d]),a.each(c,function(a,c){if(c===undefined||c===!1)return!0;e=a.split("_");if(e.length>1){var d=b.find(j+"-"+e[0]);if(d.length>0){var f=e[1];f==="replaceWith"?d[0]!==c[0]&&d.replaceWith(c):f==="img"?d.is("img")?d.attr("src",c):d.replaceWith('<img src="'+c+'" class="'+d.attr("class")+'" />'):d.attr(e[1],c)}}else b.find(j+"-"+a).html(c)})},_getScrollbarSize:function(){if(n.scrollbarSize===undefined){var a=document.createElement("div");a.id="mfp-sbm",a.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(a),n.scrollbarSize=a.offsetWidth-a.clientWidth,document.body.removeChild(a)}return n.scrollbarSize}},a.magnificPopup={instance:null,proto:o.prototype,modules:[],open:function(b,c){return B(),b?b=a.extend(!0,{},b):b={},b.isObj=!0,b.index=c||0,this.instance.open(b)},close:function(){return a.magnificPopup.instance&&a.magnificPopup.instance.close()},registerModule:function(b,c){c.options&&(a.magnificPopup.defaults[b]=c.options),a.extend(this.proto,c.proto),this.modules.push(b)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeOnBgClick:!0,closeBtnInside:!0,showCloseBtn:!0,enableEscapeKey:!0,modal:!1,alignTop:!1,removalDelay:0,prependTo:null,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&times;</button>',tClose:"Close (Esc)",tLoading:"Loading..."}},a.fn.magnificPopup=function(b){B();var c=a(this);if(typeof b=="string")if(b==="open"){var d,e=p?c.data("magnificPopup"):c[0].magnificPopup,f=parseInt(arguments[1],10)||0;e.items?d=e.items[f]:(d=c,e.delegate&&(d=d.find(e.delegate)),d=d.eq(f)),n._openClick({mfpEl:d},c,e)}else n.isOpen&&n[b].apply(n,Array.prototype.slice.call(arguments,1));else b=a.extend(!0,{},b),p?c.data("magnificPopup",b):c[0].magnificPopup=b,n.addGroup(c,b);return c};var D,E=function(b){if(b.data&&b.data.title!==undefined)return b.data.title;var c=n.st.image.titleSrc;if(c){if(a.isFunction(c))return c.call(n,b);if(b.el)return b.el.attr(c)||""}return""};a.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var a=n.st.image,c=".image";n.types.push("image"),x(g+c,function(){n.currItem.type==="image"&&a.cursor&&s.addClass(a.cursor)}),x(b+c,function(){a.cursor&&s.removeClass(a.cursor),r.off("resize"+j)}),x("Resize"+c,n.resizeImage),n.isLowIE&&x("AfterChange",n.resizeImage)},resizeImage:function(){var a=n.currItem;if(!a||!a.img)return;if(n.st.image.verticalFit){var b=0;n.isLowIE&&(b=parseInt(a.img.css("padding-top"),10)+parseInt(a.img.css("padding-bottom"),10)),a.img.css("max-height",n.wH-b)}},_onImageHasSize:function(a){a.img&&(a.hasSize=!0,D&&clearInterval(D),a.isCheckingImgSize=!1,z("ImageHasSize",a),a.imgHidden&&(n.content&&n.content.removeClass("mfp-loading"),a.imgHidden=!1))},findImageSize:function(a){var b=0,c=a.img[0],d=function(e){D&&clearInterval(D),D=setInterval(function(){if(c.naturalWidth>0){n._onImageHasSize(a);return}b>200&&clearInterval(D),b++,b===3?d(10):b===40?d(50):b===100&&d(500)},e)};d(1)},getImage:function(b,c){var d=0,e=function(){b&&(b.img[0].complete?(b.img.off(".mfploader"),b===n.currItem&&(n._onImageHasSize(b),n.updateStatus("ready")),b.hasSize=!0,b.loaded=!0,z("ImageLoadComplete")):(d++,d<200?setTimeout(e,100):f()))},f=function(){b&&(b.img.off(".mfploader"),b===n.currItem&&(n._onImageHasSize(b),n.updateStatus("error",g.tError.replace("%url%",b.src))),b.hasSize=!0,b.loaded=!0,b.loadError=!0)},g=n.st.image,h=c.find(".mfp-img");if(h.length){var i=document.createElement("img");i.className="mfp-img",b.img=a(i).on("load.mfploader",e).on("error.mfploader",f),i.src=b.src,h.is("img")&&(b.img=b.img.clone()),i=b.img[0],i.naturalWidth>0?b.hasSize=!0:i.width||(b.hasSize=!1)}return n._parseMarkup(c,{title:E(b),img_replaceWith:b.img},b),n.resizeImage(),b.hasSize?(D&&clearInterval(D),b.loadError?(c.addClass("mfp-loading"),n.updateStatus("error",g.tError.replace("%url%",b.src))):(c.removeClass("mfp-loading"),n.updateStatus("ready")),c):(n.updateStatus("loading"),b.loading=!0,b.hasSize||(b.imgHidden=!0,c.addClass("mfp-loading"),n.findImageSize(b)),c)}}});var F,G=function(){return F===undefined&&(F=document.createElement("p").style.MozTransform!==undefined),F};a.magnificPopup.registerModule("zoom",{options:{enabled:!1,easing:"ease-in-out",duration:300,opener:function(a){return a.is("img")?a:a.find("img")}},proto:{initZoom:function(){var a=n.st.zoom,d=".zoom",e;if(!a.enabled||!n.supportsTransition)return;var f=a.duration,g=function(b){var c=b.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),d="all "+a.duration/1e3+"s "+a.easing,e={position:"fixed",zIndex:9999,left:0,top:0,"-webkit-backface-visibility":"hidden"},f="transition";return e["-webkit-"+f]=e["-moz-"+f]=e["-o-"+f]=e[f]=d,c.css(e),c},h=function(){n.content.css("visibility","visible")},i,j;x("BuildControls"+d,function(){if(n._allowZoom()){clearTimeout(i),n.content.css("visibility","hidden"),e=n._getItemToZoom();if(!e){h();return}j=g(e),j.css(n._getOffset()),n.wrap.append(j),i=setTimeout(function(){j.css(n._getOffset(!0)),i=setTimeout(function(){h(),setTimeout(function(){j.remove(),e=j=null,z("ZoomAnimationEnded")},16)},f)},16)}}),x(c+d,function(){if(n._allowZoom()){clearTimeout(i),n.st.removalDelay=f;if(!e){e=n._getItemToZoom();if(!e)return;j=g(e)}j.css(n._getOffset(!0)),n.wrap.append(j),n.content.css("visibility","hidden"),setTimeout(function(){j.css(n._getOffset())},16)}}),x(b+d,function(){n._allowZoom()&&(h(),j&&j.remove(),e=null)})},_allowZoom:function(){return n.currItem.type==="image"},_getItemToZoom:function(){return n.currItem.hasSize?n.currItem.img:!1},_getOffset:function(b){var c;b?c=n.currItem.img:c=n.st.zoom.opener(n.currItem.el||n.currItem);var d=c.offset(),e=parseInt(c.css("padding-top"),10),f=parseInt(c.css("padding-bottom"),10);d.top-=a(window).scrollTop()-e;var g={width:c.width(),height:(p?c.innerHeight():c[0].offsetHeight)-f-e};return G()?g["-moz-transform"]=g.transform="translate("+d.left+"px,"+d.top+"px)":(g.left=d.left,g.top=d.top),g}}});var H="iframe",I="//about:blank",J=function(a){if(n.currTemplate[H]){var b=n.currTemplate[H].find("iframe");b.length&&(a||(b[0].src=I),n.isIE8&&b.css("display",a?"block":"none"))}};a.magnificPopup.registerModule(H,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){n.types.push(H),x("BeforeChange",function(a,b,c){b!==c&&(b===H?J():c===H&&J(!0))}),x(b+"."+H,function(){J()})},getIframe:function(b,c){var d=b.src,e=n.st.iframe;a.each(e.patterns,function(){if(d.indexOf(this.index)>-1)return this.id&&(typeof this.id=="string"?d=d.substr(d.lastIndexOf(this.id)+this.id.length,d.length):d=this.id.call(this,d)),d=this.src.replace("%id%",d),!1});var f={};return e.srcAction&&(f[e.srcAction]=d),n._parseMarkup(c,f,b),n.updateStatus("ready"),c}}});var K=function(a){var b=n.items.length;return a>b-1?a-b:a<0?b+a:a},L=function(a,b,c){return a.replace(/%curr%/gi,b+1).replace(/%total%/gi,c)};a.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var c=n.st.gallery,d=".mfp-gallery",e=Boolean(a.fn.mfpFastClick);n.direction=!0;if(!c||!c.enabled)return!1;v+=" mfp-gallery",x(g+d,function(){c.navigateByImgClick&&n.wrap.on("click"+d,".mfp-img",function(){if(n.items.length>1)return n.next(),!1}),t.on("keydown"+d,function(a){a.keyCode===37?n.prev():a.keyCode===39&&n.next()})}),x("UpdateStatus"+d,function(a,b){b.text&&(b.text=L(b.text,n.currItem.index,n.items.length))}),x(f+d,function(a,b,d,e){var f=n.items.length;d.counter=f>1?L(c.tCounter,e.index,f):""}),x("BuildControls"+d,function(){if(n.items.length>1&&c.arrows&&!n.arrowLeft){var b=c.arrowMarkup,d=n.arrowLeft=a(b.replace(/%title%/gi,c.tPrev).replace(/%dir%/gi,"left")).addClass(m),f=n.arrowRight=a(b.replace(/%title%/gi,c.tNext).replace(/%dir%/gi,"right")).addClass(m),g=e?"mfpFastClick":"click";d[g](function(){n.prev()}),f[g](function(){n.next()}),n.isIE7&&(y("b",d[0],!1,!0),y("a",d[0],!1,!0),y("b",f[0],!1,!0),y("a",f[0],!1,!0)),n.container.append(d.add(f))}}),x(h+d,function(){n._preloadTimeout&&clearTimeout(n._preloadTimeout),n._preloadTimeout=setTimeout(function(){n.preloadNearbyImages(),n._preloadTimeout=null},16)}),x(b+d,function(){t.off(d),n.wrap.off("click"+d),n.arrowLeft&&e&&n.arrowLeft.add(n.arrowRight).destroyMfpFastClick(),n.arrowRight=n.arrowLeft=null})},next:function(){n.direction=!0,n.index=K(n.index+1),n.updateItemHTML()},prev:function(){n.direction=!1,n.index=K(n.index-1),n.updateItemHTML()},goTo:function(a){n.direction=a>=n.index,n.index=a,n.updateItemHTML()},preloadNearbyImages:function(){var a=n.st.gallery.preload,b=Math.min(a[0],n.items.length),c=Math.min(a[1],n.items.length),d;for(d=1;d<=(n.direction?c:b);d++)n._preloadItem(n.index+d);for(d=1;d<=(n.direction?b:c);d++)n._preloadItem(n.index-d)},_preloadItem:function(b){b=K(b);if(n.items[b].preloaded)return;var c=n.items[b];c.parsed||(c=n.parseEl(b)),z("LazyLoad",c),c.type==="image"&&(c.img=a('<img class="mfp-img" />').on("load.mfploader",function(){c.hasSize=!0}).on("error.mfploader",function(){c.hasSize=!0,c.loadError=!0,z("LazyLoadError",c)}).attr("src",c.src)),c.preloaded=!0}}});var M="retina";a.magnificPopup.registerModule(M,{options:{replaceSrc:function(a){return a.src.replace(/\.\w+$/,function(a){return"@2x"+a})},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var a=n.st.retina,b=a.ratio;b=isNaN(b)?b():b,b>1&&(x("ImageHasSize."+M,function(a,c){c.img.css({"max-width":c.img[0].naturalWidth/b,width:"100%"})}),x("ElementParse."+M,function(c,d){d.src=a.replaceSrc(d,b)}))}}}}),function(){var b=1e3,c="ontouchstart"in window,d=function(){r.off("touchmove"+f+" touchend"+f)},e="mfpFastClick",f="."+e;a.fn.mfpFastClick=function(e){return a(this).each(function(){var g=a(this),h;if(c){var i,j,k,l,m,n;g.on("touchstart"+f,function(a){l=!1,n=1,m=a.originalEvent?a.originalEvent.touches[0]:a.touches[0],j=m.clientX,k=m.clientY,r.on("touchmove"+f,function(a){m=a.originalEvent?a.originalEvent.touches:a.touches,n=m.length,m=m[0];if(Math.abs(m.clientX-j)>10||Math.abs(m.clientY-k)>10)l=!0,d()}).on("touchend"+f,function(a){d();if(l||n>1)return;h=!0,a.preventDefault(),clearTimeout(i),i=setTimeout(function(){h=!1},b),e()})})}g.on("click"+f,function(){h||e()})})},a.fn.destroyMfpFastClick=function(){a(this).off("touchstart"+f+" click"+f),c&&r.off("touchmove"+f+" touchend"+f)}}(),B()})(window.jQuery||window.Zepto)
/* Modernizr 2.8.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-mq-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function D(a){j.cssText=a}function E(a,b){return D(n.join(a+";")+(b||""))}function F(a,b){return typeof a===b}function G(a,b){return!!~(""+a).indexOf(b)}function H(a,b){for(var d in a){var e=a[d];if(!G(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function I(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:F(f,"function")?f.bind(d||b):f}return!1}function J(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+p.join(d+" ")+d).split(" ");return F(b,"string")||F(b,"undefined")?H(e,b):(e=(a+" "+q.join(d+" ")+d).split(" "),I(e,b,c))}function K(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)u[c[d]]=c[d]in k;return u.list&&(u.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),u}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)k.setAttribute("type",f=a[d]),e=k.type!=="text",e&&(k.value=l,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&k.style.WebkitAppearance!==c?(g.appendChild(k),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(k,null).WebkitAppearance!=="textfield"&&k.offsetHeight!==0,g.removeChild(k)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=k.checkValidity&&k.checkValidity()===!1:e=k.value!=l)),t[a[d]]=!!e;return t}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.8.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=":)",m={}.toString,n=" -webkit- -moz- -o- -ms- ".split(" "),o="Webkit Moz O ms",p=o.split(" "),q=o.toLowerCase().split(" "),r={svg:"http://www.w3.org/2000/svg"},s={},t={},u={},v=[],w=v.slice,x,y=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},z=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b)&&c(b).matches||!1;var d;return y("@media "+b+" { #"+h+" { position: absolute; } }",function(b){d=(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle)["position"]=="absolute"}),d},A=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;return f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=F(e[d],"function"),F(e[d],"undefined")||(e[d]=c),e.removeAttribute(d))),e=null,f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),B={}.hasOwnProperty,C;!F(B,"undefined")&&!F(B.call,"undefined")?C=function(a,b){return B.call(a,b)}:C=function(a,b){return b in a&&F(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=w.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(w.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(w.call(arguments)))};return e}),s.flexbox=function(){return J("flexWrap")},s.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},s.canvastext=function(){return!!e.canvas&&!!F(b.createElement("canvas").getContext("2d").fillText,"function")},s.webgl=function(){return!!a.WebGLRenderingContext},s.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:y(["@media (",n.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},s.geolocation=function(){return"geolocation"in navigator},s.postmessage=function(){return!!a.postMessage},s.websqldatabase=function(){return!!a.openDatabase},s.indexedDB=function(){return!!J("indexedDB",a)},s.hashchange=function(){return A("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},s.history=function(){return!!a.history&&!!history.pushState},s.draganddrop=function(){var a=b.createElement("div");return"draggable"in a||"ondragstart"in a&&"ondrop"in a},s.websockets=function(){return"WebSocket"in a||"MozWebSocket"in a},s.rgba=function(){return D("background-color:rgba(150,255,150,.5)"),G(j.backgroundColor,"rgba")},s.hsla=function(){return D("background-color:hsla(120,40%,100%,.5)"),G(j.backgroundColor,"rgba")||G(j.backgroundColor,"hsla")},s.multiplebgs=function(){return D("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(j.background)},s.backgroundsize=function(){return J("backgroundSize")},s.borderimage=function(){return J("borderImage")},s.borderradius=function(){return J("borderRadius")},s.boxshadow=function(){return J("boxShadow")},s.textshadow=function(){return b.createElement("div").style.textShadow===""},s.opacity=function(){return E("opacity:.55"),/^0.55$/.test(j.opacity)},s.cssanimations=function(){return J("animationName")},s.csscolumns=function(){return J("columnCount")},s.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return D((a+"-webkit- ".split(" ").join(b+a)+n.join(c+a)).slice(0,-a.length)),G(j.backgroundImage,"gradient")},s.cssreflections=function(){return J("boxReflect")},s.csstransforms=function(){return!!J("transform")},s.csstransforms3d=function(){var a=!!J("perspective");return a&&"webkitPerspective"in g.style&&y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},s.csstransitions=function(){return J("transition")},s.fontface=function(){var a;return y('@font-face {font-family:"font";src:url("https://")}',function(c,d){var e=b.getElementById("smodernizr"),f=e.sheet||e.styleSheet,g=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"";a=/src/i.test(g)&&g.indexOf(d.split(" ")[0])===0}),a},s.generatedcontent=function(){var a;return y(["#",h,"{font:0/0 a}#",h,':after{content:"',l,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},s.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c},s.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c},s.localstorage=function(){try{return localStorage.setItem(h,h),localStorage.removeItem(h),!0}catch(a){return!1}},s.sessionstorage=function(){try{return sessionStorage.setItem(h,h),sessionStorage.removeItem(h),!0}catch(a){return!1}},s.webworkers=function(){return!!a.Worker},s.applicationcache=function(){return!!a.applicationCache},s.svg=function(){return!!b.createElementNS&&!!b.createElementNS(r.svg,"svg").createSVGRect},s.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==r.svg},s.smil=function(){return!!b.createElementNS&&/SVGAnimate/.test(m.call(b.createElementNS(r.svg,"animate")))},s.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(m.call(b.createElementNS(r.svg,"clipPath")))};for(var L in s)C(s,L)&&(x=L.toLowerCase(),e[x]=s[L](),v.push((e[x]?"":"no-")+x));return e.input||K(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)C(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},D(""),i=k=null,function(a,b){function l(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function m(){var a=s.elements;return typeof a=="string"?a.split(" "):a}function n(a){var b=j[a[h]];return b||(b={},i++,a[h]=i,j[i]=b),b}function o(a,c,d){c||(c=b);if(k)return c.createElement(a);d||(d=n(c));var g;return d.cache[a]?g=d.cache[a].cloneNode():f.test(a)?g=(d.cache[a]=d.createElem(a)).cloneNode():g=d.createElem(a),g.canHaveChildren&&!e.test(a)&&!g.tagUrn?d.frag.appendChild(g):g}function p(a,c){a||(a=b);if(k)return a.createDocumentFragment();c=c||n(a);var d=c.frag.cloneNode(),e=0,f=m(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function q(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return s.shivMethods?o(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(s,b.frag)}function r(a){a||(a=b);var c=n(a);return s.shivCSS&&!g&&!c.hasCSS&&(c.hasCSS=!!l(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||q(a,c),a}var c="3.7.0",d=a.html5||{},e=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,f=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g,h="_html5shiv",i=0,j={},k;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",g="hidden"in a,k=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){g=!0,k=!0}})();var s={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:c,shivCSS:d.shivCSS!==!1,supportsUnknownElements:k,shivMethods:d.shivMethods!==!1,type:"default",shivDocument:r,createElement:o,createDocumentFragment:p};a.html5=s,r(b)}(this,b),e._version=d,e._prefixes=n,e._domPrefixes=q,e._cssomPrefixes=p,e.mq=z,e.hasEvent=A,e.testProp=function(a){return H([a])},e.testAllProps=J,e.testStyles=y,e.prefixed=function(a,b,c){return b?J(a,b,c):J(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+v.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
/* --- ORGANIC TABS --- */

// --- MODIFIED
// https://github.com/CSS-Tricks/jQuery-Organic-Tabs
(function ($) {
	"use strict";
    $.organicTabs = function (el, options) {
        var base = this;
        base.$el = $(el);
        base.$nav = base.$el.find(".tabs__nav");
        base.init = function () {
            base.options = $.extend({}, $.organicTabs.defaultOptions, options);
            var $allListWrap = base.$el.find(".tabs__content"),
                curList = base.$el.find("a.current").attr("href").substring(1);
            $allListWrap.height(base.$el.find("#" + curList).height());
            base.$nav.find("li > a").click(function (event) {

                var curList = base.$el.find("a.current").attr("href").substring(1),
                    $newList = $(this),
                    listID = $newList.attr("href").substring(1);
                if ((listID != curList) && (base.$el.find(":animated").length == 0)) {
                    base.$el.find("#" + curList).css({
                        opacity: 0,
                        "z-index": 10
                    });
                    var newHeight = base.$el.find("#" + listID).height();
                    $allListWrap.css({
                        height: newHeight
                    });
                    setTimeout(function () {
                        base.$el.find("#" + curList);
                        base.$el.find("#" + listID).css({
                            opacity: 1,
                            "z-index": 13
                        });
                        base.$el.find(".tabs__nav li a").removeClass("current");
                        $newList.addClass("current");
                    }, 250);
                }
                event.preventDefault();
            });
        };
        base.init();
    };
    $.organicTabs.defaultOptions = {
        speed: 300
    };
    $.fn.organicTabs = function (options) {
        return this.each(function () {
            (new $.organicTabs(this, options));
        });
    };

})(jQuery);
// Adapted from https://gist.github.com/paulirish/1579671 which derived from
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon

// MIT license

if (!Date.now)
    Date.now = function() { return new Date().getTime(); };

(function() {
    'use strict';

    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
        || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());
/* --- ROYALSLIDER --- */

// jQuery RoyalSlider plugin. Custom build. Copyright 2011-2013 Dmitry Semenov http://dimsemenov.com
// http://dimsemenov.com/private/home.php?build=bullets_thumbnails_tabs_fullscreen_autoplay_video_animated-blocks_auto-height_global-caption_active-class_deeplinking_visible-nearby
// jquery.royalslider v9.5.6
(function(n){function u(b,f){var c,a=this,e=window.navigator,g=e.userAgent.toLowerCase();a.uid=n.rsModules.uid++;a.ns=".rs"+a.uid;var d=document.createElement("div").style,h=["webkit","Moz","ms","O"],k="",l=0,r;for(c=0;c<h.length;c++)r=h[c],!k&&r+"Transform"in d&&(k=r),r=r.toLowerCase(),window.requestAnimationFrame||(window.requestAnimationFrame=window[r+"RequestAnimationFrame"],window.cancelAnimationFrame=window[r+"CancelAnimationFrame"]||window[r+"CancelRequestAnimationFrame"]);window.requestAnimationFrame||
(window.requestAnimationFrame=function(a,b){var c=(new Date).getTime(),d=Math.max(0,16-(c-l)),e=window.setTimeout(function(){a(c+d)},d);l=c+d;return e});window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)});a.isIPAD=g.match(/(ipad)/);a.isIOS=a.isIPAD||g.match(/(iphone|ipod)/);c=function(a){a=/(chrome)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||0>a.indexOf("compatible")&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||
[];return{browser:a[1]||"",version:a[2]||"0"}}(g);h={};c.browser&&(h[c.browser]=!0,h.version=c.version);h.chrome&&(h.webkit=!0);a._a=h;a.isAndroid=-1<g.indexOf("android");a.slider=n(b);a.ev=n(a);a._b=n(document);a.st=n.extend({},n.fn.royalSlider.defaults,f);a._c=a.st.transitionSpeed;a._d=0;!a.st.allowCSS3||h.webkit&&!a.st.allowCSS3OnWebkit||(c=k+(k?"T":"t"),a._e=c+"ransform"in d&&c+"ransition"in d,a._e&&(a._f=k+(k?"P":"p")+"erspective"in d));k=k.toLowerCase();a._g="-"+k+"-";a._h="vertical"===a.st.slidesOrientation?
	!1:!0;a._i=a._h?"left":"top";a._j=a._h?"width":"height";a._k=-1;a._l="fade"===a.st.transitionType?!1:!0;a._l||(a.st.sliderDrag=!1,a._m=10);a._n="z-index:0; display:none; opacity:0;";a._o=0;a._p=0;a._q=0;n.each(n.rsModules,function(b,c){"uid"!==b&&c.call(a)});a.slides=[];a._r=0;(a.st.slides?n(a.st.slides):a.slider.children().detach()).each(function(){a._s(this,!0)});a.st.randomizeSlides&&a.slides.sort(function(){return.5-Math.random()});a.numSlides=a.slides.length;a._t();a.st.startSlideId?a.st.startSlideId>
a.numSlides-1&&(a.st.startSlideId=a.numSlides-1):a.st.startSlideId=0;a._o=a.staticSlideId=a.currSlideId=a._u=a.st.startSlideId;a.currSlide=a.slides[a.currSlideId];a._v=0;a.pointerMultitouch=!1;a.slider.addClass((a._h?"rsHor":"rsVer")+(a._l?"":" rsFade"));d='<div class="rsOverflow"><div class="rsContainer">';a.slidesSpacing=a.st.slidesSpacing;a._w=(a._h?a.slider.width():a.slider.height())+a.st.slidesSpacing;a._x=Boolean(0<a._y);1>=a.numSlides&&(a._z=!1);a._a1=a._z&&a._l?2===a.numSlides?1:2:0;a._b1=
	6>a.numSlides?a.numSlides:6;a._c1=0;a._d1=0;a.slidesJQ=[];for(c=0;c<a.numSlides;c++)a.slidesJQ.push(n('<div style="'+(a._l?"":c!==a.currSlideId?a._n:"z-index:0;")+'" class="rsSlide "></div>'));a._e1=d=n(d+"</div></div>");var m=a.ns,k=function(b,c,d,e,f){a._j1=b+c+m;a._k1=b+d+m;a._l1=b+e+m;f&&(a._m1=b+f+m)};c=e.pointerEnabled;a.pointerEnabled=c||e.msPointerEnabled;a.pointerEnabled?(a.hasTouch=!1,a._n1=.2,a.pointerMultitouch=Boolean(1<e[(c?"m":"msM")+"axTouchPoints"]),c?k("pointer","down","move","up",
	"cancel"):k("MSPointer","Down","Move","Up","Cancel")):(a.isIOS?a._j1=a._k1=a._l1=a._m1="":k("mouse","down","move","up"),"ontouchstart"in window||"createTouch"in document?(a.hasTouch=!0,a._j1+=" touchstart"+m,a._k1+=" touchmove"+m,a._l1+=" touchend"+m,a._m1+=" touchcancel"+m,a._n1=.5,a.st.sliderTouch&&(a._f1=!0)):(a.hasTouch=!1,a._n1=.2));a.st.sliderDrag&&(a._f1=!0,h.msie||h.opera?a._g1=a._h1="move":h.mozilla?(a._g1="-moz-grab",a._h1="-moz-grabbing"):h.webkit&&-1!=e.platform.indexOf("Mac")&&(a._g1=
	"-webkit-grab",a._h1="-webkit-grabbing"),a._i1());a.slider.html(d);a._o1=a.st.controlsInside?a._e1:a.slider;a._p1=a._e1.children(".rsContainer");a.pointerEnabled&&a._p1.css((c?"":"-ms-")+"touch-action",a._h?"pan-y":"pan-x");a._q1=n('<div class="rsPreloader"></div>');e=a._p1.children(".rsSlide");a._r1=a.slidesJQ[a.currSlideId];a._s1=0;a._e?(a._t1="transition-property",a._u1="transition-duration",a._v1="transition-timing-function",a._w1=a._x1=a._g+"transform",a._f?(h.webkit&&!h.chrome&&a.slider.addClass("rsWebkit3d"),
	a._y1="translate3d(",a._z1="px, ",a._a2="px, 0px)"):(a._y1="translate(",a._z1="px, ",a._a2="px)"),a._l?a._p1[a._g+a._t1]=a._g+"transform":(h={},h[a._g+a._t1]="opacity",h[a._g+a._u1]=a.st.transitionSpeed+"ms",h[a._g+a._v1]=a.st.css3easeInOut,e.css(h))):(a._x1="left",a._w1="top");var p;n(window).on("resize"+a.ns,function(){p&&clearTimeout(p);p=setTimeout(function(){a.updateSliderSize()},50)});a.ev.trigger("rsAfterPropsSetup");a.updateSliderSize();a.st.keyboardNavEnabled&&a._b2();a.st.arrowsNavHideOnTouch&&
(a.hasTouch||a.pointerMultitouch)&&(a.st.arrowsNav=!1);a.st.arrowsNav&&(e=a._o1,n('<div class="rsArrow rsArrowLeft"><div class="rsArrowIcn"></div></div><div class="rsArrow rsArrowRight"><div class="rsArrowIcn"></div></div>').appendTo(e),a._c2=e.children(".rsArrowLeft").click(function(b){b.preventDefault();a.prev()}),a._d2=e.children(".rsArrowRight").click(function(b){b.preventDefault();a.next()}),a.st.arrowsNavAutoHide&&!a.hasTouch&&(a._c2.addClass("rsHidden"),a._d2.addClass("rsHidden"),e.one("mousemove.arrowshover",
	function(){a._c2.removeClass("rsHidden");a._d2.removeClass("rsHidden")}),e.hover(function(){a._e2||(a._c2.removeClass("rsHidden"),a._d2.removeClass("rsHidden"))},function(){a._e2||(a._c2.addClass("rsHidden"),a._d2.addClass("rsHidden"))})),a.ev.on("rsOnUpdateNav",function(){a._f2()}),a._f2());if(a.hasTouch&&a.st.sliderTouch||!a.hasTouch&&a.st.sliderDrag)a._p1.on(a._j1,function(b){a._g2(b)});else a.dragSuccess=!1;var q=["rsPlayBtnIcon","rsPlayBtn","rsCloseVideoBtn","rsCloseVideoIcn"];a._p1.click(function(b){if(!a.dragSuccess){var c=
	n(b.target).attr("class");if(-1!==n.inArray(c,q)&&a.toggleVideo())return!1;if(a.st.navigateByClick&&!a._h2){if(n(b.target).closest(".rsNoDrag",a._r1).length)return!0;a._i2(b)}a.ev.trigger("rsSlideClick",b)}}).on("click.rs","a",function(b){if(a.dragSuccess)return!1;a._h2=!0;setTimeout(function(){a._h2=!1},3)});a.ev.trigger("rsAfterInit")}n.rsModules||(n.rsModules={uid:0});u.prototype={constructor:u,_i2:function(b){b=b[this._h?"pageX":"pageY"]-this._j2;b>=this._q?this.next():0>b&&this.prev()},_t:function(){var b;
	b=this.st.numImagesToPreload;if(this._z=this.st.loop)2===this.numSlides?(this._z=!1,this.st.loopRewind=!0):2>this.numSlides&&(this.st.loopRewind=this._z=!1);this._z&&0<b&&(4>=this.numSlides?b=1:this.st.numImagesToPreload>(this.numSlides-1)/2&&(b=Math.floor((this.numSlides-1)/2)));this._y=b},_s:function(b,f){function c(b,c){c?g.images.push(b.attr(c)):g.images.push(b.text());if(h){h=!1;g.caption="src"===c?b.attr("alt"):b.contents();g.image=g.images[0];g.videoURL=b.attr("data-rsVideo");var d=b.attr("data-rsw"),
	e=b.attr("data-rsh");"undefined"!==typeof d&&!1!==d&&"undefined"!==typeof e&&!1!==e?(g.iW=parseInt(d,10),g.iH=parseInt(e,10)):a.st.imgWidth&&a.st.imgHeight&&(g.iW=a.st.imgWidth,g.iH=a.st.imgHeight)}}var a=this,e,g={},d,h=!0;b=n(b);a._k2=b;a.ev.trigger("rsBeforeParseNode",[b,g]);if(!g.stopParsing)return b=a._k2,g.id=a._r,g.contentAdded=!1,a._r++,g.images=[],g.isBig=!1,g.hasCover||(b.hasClass("rsImg")?(d=b,e=!0):(d=b.find(".rsImg"),d.length&&(e=!0)),e?(g.bigImage=d.eq(0).attr("data-rsBigImg"),d.each(function(){var a=
	n(this);a.is("a")?c(a,"href"):a.is("img")?c(a,"src"):c(a)})):b.is("img")&&(b.addClass("rsImg rsMainSlideImage"),c(b,"src"))),d=b.find(".rsCaption"),d.length&&(g.caption=d.remove()),g.content=b,a.ev.trigger("rsAfterParseNode",[b,g]),f&&a.slides.push(g),0===g.images.length&&(g.isLoaded=!0,g.isRendered=!1,g.isLoading=!1,g.images=null),g},_b2:function(){var b=this,f,c,a=function(a){37===a?b.prev():39===a&&b.next()};b._b.on("keydown"+b.ns,function(e){b._l2||(c=e.keyCode,37!==c&&39!==c||f||(e.preventDefault(),
	a(c),f=setInterval(function(){a(c)},700)))}).on("keyup"+b.ns,function(a){f&&(clearInterval(f),f=null)})},goTo:function(b,f){b!==this.currSlideId&&this._m2(b,this.st.transitionSpeed,!0,!f)},destroy:function(b){this.ev.trigger("rsBeforeDestroy");this._b.off("keydown"+this.ns+" keyup"+this.ns+" "+this._k1+" "+this._l1);this._p1.off(this._j1+" click");this.slider.data("royalSlider",null);n.removeData(this.slider,"royalSlider");n(window).off("resize"+this.ns);this.loadingTimeout&&clearTimeout(this.loadingTimeout);
	b&&this.slider.remove();this.ev=this.slider=this.slides=null},_n2:function(b,f){function c(c,f,g){c.isAdded?(a(f,c),e(f,c)):(g||(g=d.slidesJQ[f]),c.holder?g=c.holder:(g=d.slidesJQ[f]=n(g),c.holder=g),c.appendOnLoaded=!1,e(f,c,g),a(f,c),d._p2(c,g,b),c.isAdded=!0)}function a(a,c){c.contentAdded||(d.setItemHtml(c,b),b||(c.contentAdded=!0))}function e(a,b,c){d._l&&(c||(c=d.slidesJQ[a]),c.css(d._i,(a+d._d1+p)*d._w))}function g(a){if(l){if(a>r-1)return g(a-r);if(0>a)return g(r+a)}return a}var d=this,h,
	k,l=d._z,r=d.numSlides;if(!isNaN(f))return g(f);var m=d.currSlideId,p,q=b?Math.abs(d._o2-d.currSlideId)>=d.numSlides-1?0:1:d._y,s=Math.min(2,q),v=!1,u=!1,t;for(k=m;k<m+1+s;k++)if(t=g(k),(h=d.slides[t])&&(!h.isAdded||!h.positionSet)){v=!0;break}for(k=m-1;k>m-1-s;k--)if(t=g(k),(h=d.slides[t])&&(!h.isAdded||!h.positionSet)){u=!0;break}if(v)for(k=m;k<m+q+1;k++)t=g(k),p=Math.floor((d._u-(m-k))/d.numSlides)*d.numSlides,(h=d.slides[t])&&c(h,t);if(u)for(k=m-1;k>m-1-q;k--)t=g(k),p=Math.floor((d._u-(m-k))/
r)*r,(h=d.slides[t])&&c(h,t);if(!b)for(s=g(m-q),m=g(m+q),q=s>m?0:s,k=0;k<r;k++)s>m&&k>s-1||!(k<q||k>m)||(h=d.slides[k])&&h.holder&&(h.holder.detach(),h.isAdded=!1)},setItemHtml:function(b,f){var c=this,a=function(){if(!b.images)b.isRendered=!0,b.isLoaded=!0,b.isLoading=!1,d(!0);else if(!b.isLoading){var a,f;b.content.hasClass("rsImg")?(a=b.content,f=!0):a=b.content.find(".rsImg:not(img)");a&&!a.is("img")&&a.each(function(){var a=n(this),c='<img class="rsImg" src="'+(a.is("a")?a.attr("href"):a.text())+
	'" />';f?b.content=n(c):a.replaceWith(c)});a=f?b.content:b.content.find("img.rsImg");k();a.eq(0).addClass("rsMainSlideImage");b.iW&&b.iH&&(b.isLoaded||c._q2(b),d());b.isLoading=!0;if(b.isBig)n("<img />").on("load.rs error.rs",function(a){n(this).off("load.rs error.rs");e([this],!0)}).attr("src",b.image);else{b.loaded=[];b.numStartedLoad=0;a=function(a){n(this).off("load.rs error.rs");b.loaded.push(this);b.loaded.length===b.numStartedLoad&&e(b.loaded,!1)};for(var g=0;g<b.images.length;g++){var h=n("<img />");
	b.numStartedLoad++;h.on("load.rs error.rs",a).attr("src",b.images[g])}}}},e=function(a,c){if(a.length){var d=a[0];if(c!==b.isBig)(d=b.holder.children())&&1<d.length&&l();else if(b.iW&&b.iH)g();else if(b.iW=d.width,b.iH=d.height,b.iW&&b.iH)g();else{var e=new Image;e.onload=function(){e.width?(b.iW=e.width,b.iH=e.height,g()):setTimeout(function(){e.width&&(b.iW=e.width,b.iH=e.height);g()},1E3)};e.src=d.src}}else g()},g=function(){b.isLoaded=!0;b.isLoading=!1;d();l();h()},d=function(){if(!b.isAppended&&
	c.ev){var a=c.st.visibleNearby,d=b.id-c._o;f||b.appendOnLoaded||!c.st.fadeinLoadedSlide||0!==d&&(!(a||c._r2||c._l2)||-1!==d&&1!==d)||(a={visibility:"visible",opacity:0},a[c._g+"transition"]="opacity 400ms ease-in-out",b.content.css(a),setTimeout(function(){b.content.css("opacity",1)},16));b.holder.find(".rsPreloader").length?b.holder.append(b.content):b.holder.html(b.content);b.isAppended=!0;b.isLoaded&&(c._q2(b),h());b.sizeReady||(b.sizeReady=!0,setTimeout(function(){c.ev.trigger("rsMaybeSizeReady",
	b)},100))}},h=function(){!b.loadedTriggered&&c.ev&&(b.isLoaded=b.loadedTriggered=!0,b.holder.trigger("rsAfterContentSet"),c.ev.trigger("rsAfterContentSet",b))},k=function(){c.st.usePreloader&&b.holder.html(c._q1.clone())},l=function(a){c.st.usePreloader&&(a=b.holder.find(".rsPreloader"),a.length&&a.remove())};b.isLoaded?d():f?!c._l&&b.images&&b.iW&&b.iH?a():(b.holder.isWaiting=!0,k(),b.holder.slideId=-99):a()},_p2:function(b,f,c){this._p1.append(b.holder);b.appendOnLoaded=!1},_g2:function(b,f){var c=
	this,a,e="touchstart"===b.type;c._s2=e;c.ev.trigger("rsDragStart");if(n(b.target).closest(".rsNoDrag",c._r1).length)return c.dragSuccess=!1,!0;!f&&c._r2&&(c._t2=!0,c._u2());c.dragSuccess=!1;if(c._l2)e&&(c._v2=!0);else{e&&(c._v2=!1);c._w2();if(e){var g=b.originalEvent.touches;if(g&&0<g.length)a=g[0],1<g.length&&(c._v2=!0);else return}else b.preventDefault(),a=b,c.pointerEnabled&&(a=a.originalEvent);c._l2=!0;c._b.on(c._k1,function(a){c._x2(a,f)}).on(c._l1,function(a){c._y2(a,f)});c._z2="";c._a3=!1;
	c._b3=a.pageX;c._c3=a.pageY;c._d3=c._v=(f?c._e3:c._h)?a.pageX:a.pageY;c._f3=0;c._g3=0;c._h3=f?c._i3:c._p;c._j3=(new Date).getTime();if(e)c._e1.on(c._m1,function(a){c._y2(a,f)})}},_k3:function(b,f){if(this._l3){var c=this._m3,a=b.pageX-this._b3,e=b.pageY-this._c3,g=this._h3+a,d=this._h3+e,h=f?this._e3:this._h,g=h?g:d,d=this._z2;this._a3=!0;this._b3=b.pageX;this._c3=b.pageY;"x"===d&&0!==a?this._f3=0<a?1:-1:"y"===d&&0!==e&&(this._g3=0<e?1:-1);d=h?this._b3:this._c3;a=h?a:e;f?g>this._n3?g=this._h3+a*this._n1:
g<this._o3&&(g=this._h3+a*this._n1):this._z||(0>=this.currSlideId&&0<d-this._d3&&(g=this._h3+a*this._n1),this.currSlideId>=this.numSlides-1&&0>d-this._d3&&(g=this._h3+a*this._n1));this._h3=g;200<c-this._j3&&(this._j3=c,this._v=d);f?this._q3(this._h3):this._l&&this._p3(this._h3)}},_x2:function(b,f){var c=this,a,e="touchmove"===b.type;if(!c._s2||e){if(e){if(c._r3)return;var g=b.originalEvent.touches;if(g){if(1<g.length)return;a=g[0]}else return}else a=b,c.pointerEnabled&&(a=a.originalEvent);c._a3||
(c._e&&(f?c._s3:c._p1).css(c._g+c._u1,"0s"),function h(){c._l2&&(c._t3=requestAnimationFrame(h),c._u3&&c._k3(c._u3,f))}());if(c._l3)b.preventDefault(),c._m3=(new Date).getTime(),c._u3=a;else if(g=f?c._e3:c._h,a=Math.abs(a.pageX-c._b3)-Math.abs(a.pageY-c._c3)-(g?-7:7),7<a){if(g)b.preventDefault(),c._z2="x";else if(e){c._v3(b);return}c._l3=!0}else if(-7>a){if(!g)b.preventDefault(),c._z2="y";else if(e){c._v3(b);return}c._l3=!0}}},_v3:function(b,f){this._r3=!0;this._a3=this._l2=!1;this._y2(b)},_y2:function(b,
																																																																																																																															f){function c(a){return 100>a?100:500<a?500:a}function a(a,b){if(e._l||f)h=(-e._u-e._d1)*e._w,k=Math.abs(e._p-h),e._c=k/b,a&&(e._c+=250),e._c=c(e._c),e._x3(h,!1)}var e=this,g,d,h,k;g=-1<b.type.indexOf("touch");if(!e._s2||g)if(e._s2=!1,e.ev.trigger("rsDragRelease"),e._u3=null,e._l2=!1,e._r3=!1,e._l3=!1,e._m3=0,cancelAnimationFrame(e._t3),e._a3&&(f?e._q3(e._h3):e._l&&e._p3(e._h3)),e._b.off(e._k1).off(e._l1),g&&e._e1.off(e._m1),e._i1(),!e._a3&&!e._v2&&f&&e._w3){var l=n(b.target).closest(".rsNavItem");
	l.length&&e.goTo(l.index())}else{d=f?e._e3:e._h;if(!e._a3||"y"===e._z2&&d||"x"===e._z2&&!d)if(!f&&e._t2){e._t2=!1;if(e.st.navigateByClick){e._i2(e.pointerEnabled?b.originalEvent:b);e.dragSuccess=!0;return}e.dragSuccess=!0}else{e._t2=!1;e.dragSuccess=!1;return}else e.dragSuccess=!0;e._t2=!1;e._z2="";var r=e.st.minSlideOffset;g=g?b.originalEvent.changedTouches[0]:e.pointerEnabled?b.originalEvent:b;var m=d?g.pageX:g.pageY,p=e._d3;g=e._v;var q=e.currSlideId,s=e.numSlides,v=d?e._f3:e._g3,u=e._z;Math.abs(m-
p);g=m-g;d=(new Date).getTime()-e._j3;d=Math.abs(g)/d;if(0===v||1>=s)a(!0,d);else{if(!u&&!f)if(0>=q){if(0<v){a(!0,d);return}}else if(q>=s-1&&0>v){a(!0,d);return}if(f){h=e._i3;if(h>e._n3)h=e._n3;else if(h<e._o3)h=e._o3;else{m=d*d/.006;l=-e._i3;p=e._y3-e._z3+e._i3;0<g&&m>l?(l+=e._z3/(15/(m/d*.003)),d=d*l/m,m=l):0>g&&m>p&&(p+=e._z3/(15/(m/d*.003)),d=d*p/m,m=p);l=Math.max(Math.round(d/.003),50);h+=m*(0>g?-1:1);if(h>e._n3){e._a4(h,l,!0,e._n3,200);return}if(h<e._o3){e._a4(h,l,!0,e._o3,200);return}}e._a4(h,
	l,!0)}else l=function(a){var b=Math.floor(a/e._w);a-b*e._w>r&&b++;return b},p+r<m?0>v?a(!1,d):(l=l(m-p),e._m2(e.currSlideId-l,c(Math.abs(e._p-(-e._u-e._d1+l)*e._w)/d),!1,!0,!0)):p-r>m?0<v?a(!1,d):(l=l(p-m),e._m2(e.currSlideId+l,c(Math.abs(e._p-(-e._u-e._d1-l)*e._w)/d),!1,!0,!0)):a(!1,d)}}},_p3:function(b){b=this._p=b;this._e?this._p1.css(this._x1,this._y1+(this._h?b+this._z1+0:0+this._z1+b)+this._a2):this._p1.css(this._h?this._x1:this._w1,b)},updateSliderSize:function(b){var f,c;if(this.slider){if(this.st.autoScaleSlider){var a=
	this.st.autoScaleSliderWidth,e=this.st.autoScaleSliderHeight;this.st.autoScaleHeight?(f=this.slider.width(),f!=this.width&&(this.slider.css("height",e/a*f),f=this.slider.width()),c=this.slider.height()):(c=this.slider.height(),c!=this.height&&(this.slider.css("width",a/e*c),c=this.slider.height()),f=this.slider.width())}else f=this.slider.width(),c=this.slider.height();if(b||f!=this.width||c!=this.height){this.width=f;this.height=c;this._b4=f;this._c4=c;this.ev.trigger("rsBeforeSizeSet");this.ev.trigger("rsAfterSizePropSet");
	this._e1.css({width:this._b4,height:this._c4});this._w=(this._h?this._b4:this._c4)+this.st.slidesSpacing;this._d4=this.st.imageScalePadding;for(f=0;f<this.slides.length;f++)b=this.slides[f],b.positionSet=!1,b&&b.images&&b.isLoaded&&(b.isRendered=!1,this._q2(b));if(this._e4)for(f=0;f<this._e4.length;f++)b=this._e4[f],b.holder.css(this._i,(b.id+this._d1)*this._w);this._n2();this._l&&(this._e&&this._p1.css(this._g+"transition-duration","0s"),this._p3((-this._u-this._d1)*this._w));this.ev.trigger("rsOnUpdateNav")}this._j2=
	this._e1.offset();this._j2=this._j2[this._i]}},appendSlide:function(b,f){var c=this._s(b);if(isNaN(f)||f>this.numSlides)f=this.numSlides;this.slides.splice(f,0,c);this.slidesJQ.splice(f,0,n('<div style="'+(this._l?"position:absolute;":this._n)+'" class="rsSlide"></div>'));f<=this.currSlideId&&this.currSlideId++;this.ev.trigger("rsOnAppendSlide",[c,f]);this._f4(f);f===this.currSlideId&&this.ev.trigger("rsAfterSlideChange")},removeSlide:function(b){var f=this.slides[b];f&&(f.holder&&f.holder.remove(),
b<this.currSlideId&&this.currSlideId--,this.slides.splice(b,1),this.slidesJQ.splice(b,1),this.ev.trigger("rsOnRemoveSlide",[b]),this._f4(b),b===this.currSlideId&&this.ev.trigger("rsAfterSlideChange"))},_f4:function(b){var f=this;b=f.numSlides;b=0>=f._u?0:Math.floor(f._u/b);f.numSlides=f.slides.length;0===f.numSlides?(f.currSlideId=f._d1=f._u=0,f.currSlide=f._g4=null):f._u=b*f.numSlides+f.currSlideId;for(b=0;b<f.numSlides;b++)f.slides[b].id=b;f.currSlide=f.slides[f.currSlideId];f._r1=f.slidesJQ[f.currSlideId];
	f.currSlideId>=f.numSlides?f.goTo(f.numSlides-1):0>f.currSlideId&&f.goTo(0);f._t();f._l&&f._p1.css(f._g+f._u1,"0ms");f._h4&&clearTimeout(f._h4);f._h4=setTimeout(function(){f._l&&f._p3((-f._u-f._d1)*f._w);f._n2();f._l||f._r1.css({display:"block",opacity:1})},14);f.ev.trigger("rsOnUpdateNav")},_i1:function(){this._f1&&this._l&&(this._g1?this._e1.css("cursor",this._g1):(this._e1.removeClass("grabbing-cursor"),this._e1.addClass("grab-cursor")))},_w2:function(){this._f1&&this._l&&(this._h1?this._e1.css("cursor",
	this._h1):(this._e1.removeClass("grab-cursor"),this._e1.addClass("grabbing-cursor")))},next:function(b){this._m2("next",this.st.transitionSpeed,!0,!b)},prev:function(b){this._m2("prev",this.st.transitionSpeed,!0,!b)},_m2:function(b,f,c,a,e){var g=this,d,h,k;g.ev.trigger("rsBeforeMove",[b,a]);k="next"===b?g.currSlideId+1:"prev"===b?g.currSlideId-1:b=parseInt(b,10);if(!g._z){if(0>k){g._i4("left",!a);return}if(k>=g.numSlides){g._i4("right",!a);return}}g._r2&&(g._u2(!0),c=!1);h=k-g.currSlideId;k=g._o2=
	g.currSlideId;var l=g.currSlideId+h;a=g._u;var n;g._z?(l=g._n2(!1,l),a+=h):a=l;g._o=l;g._g4=g.slidesJQ[g.currSlideId];g._u=a;g.currSlideId=g._o;g.currSlide=g.slides[g.currSlideId];g._r1=g.slidesJQ[g.currSlideId];var l=g.st.slidesDiff,m=Boolean(0<h);h=Math.abs(h);var p=Math.floor(k/g._y),q=Math.floor((k+(m?l:-l))/g._y),p=(m?Math.max(p,q):Math.min(p,q))*g._y+(m?g._y-1:0);p>g.numSlides-1?p=g.numSlides-1:0>p&&(p=0);k=m?p-k:k-p;k>g._y&&(k=g._y);if(h>k+l)for(g._d1+=(h-(k+l))*(m?-1:1),f*=1.4,k=0;k<g.numSlides;k++)g.slides[k].positionSet=
	!1;g._c=f;g._n2(!0);e||(n=!0);d=(-a-g._d1)*g._w;n?setTimeout(function(){g._j4=!1;g._x3(d,b,!1,c);g.ev.trigger("rsOnUpdateNav")},0):(g._x3(d,b,!1,c),g.ev.trigger("rsOnUpdateNav"))},_f2:function(){this.st.arrowsNav&&(1>=this.numSlides?(this._c2.css("display","none"),this._d2.css("display","none")):(this._c2.css("display","block"),this._d2.css("display","block"),this._z||this.st.loopRewind||(0===this.currSlideId?this._c2.addClass("rsArrowDisabled"):this._c2.removeClass("rsArrowDisabled"),this.currSlideId===
this.numSlides-1?this._d2.addClass("rsArrowDisabled"):this._d2.removeClass("rsArrowDisabled"))))},_x3:function(b,f,c,a,e){function g(){var a;h&&(a=h.data("rsTimeout"))&&(h!==k&&h.css({opacity:0,display:"none",zIndex:0}),clearTimeout(a),h.data("rsTimeout",""));if(a=k.data("rsTimeout"))clearTimeout(a),k.data("rsTimeout","")}var d=this,h,k,l={};isNaN(d._c)&&(d._c=400);d._p=d._h3=b;d.ev.trigger("rsBeforeAnimStart");d._e?d._l?(d._c=parseInt(d._c,10),c=d._g+d._v1,l[d._g+d._u1]=d._c+"ms",l[c]=a?n.rsCSS3Easing[d.st.easeInOut]:
	n.rsCSS3Easing[d.st.easeOut],d._p1.css(l),a||!d.hasTouch?setTimeout(function(){d._p3(b)},5):d._p3(b)):(d._c=d.st.transitionSpeed,h=d._g4,k=d._r1,k.data("rsTimeout")&&k.css("opacity",0),g(),h&&h.data("rsTimeout",setTimeout(function(){l[d._g+d._u1]="0ms";l.zIndex=0;l.display="none";h.data("rsTimeout","");h.css(l);setTimeout(function(){h.css("opacity",0)},16)},d._c+60)),l.display="block",l.zIndex=d._m,l.opacity=0,l[d._g+d._u1]="0ms",l[d._g+d._v1]=n.rsCSS3Easing[d.st.easeInOut],k.css(l),k.data("rsTimeout",
	setTimeout(function(){k.css(d._g+d._u1,d._c+"ms");k.data("rsTimeout",setTimeout(function(){k.css("opacity",1);k.data("rsTimeout","")},20))},20))):d._l?(l[d._h?d._x1:d._w1]=b+"px",d._p1.animate(l,d._c,a?d.st.easeInOut:d.st.easeOut)):(h=d._g4,k=d._r1,k.stop(!0,!0).css({opacity:0,display:"block",zIndex:d._m}),d._c=d.st.transitionSpeed,k.animate({opacity:1},d._c,d.st.easeInOut),g(),h&&h.data("rsTimeout",setTimeout(function(){h.stop(!0,!0).css({opacity:0,display:"none",zIndex:0})},d._c+60)));d._r2=!0;
	d.loadingTimeout&&clearTimeout(d.loadingTimeout);d.loadingTimeout=e?setTimeout(function(){d.loadingTimeout=null;e.call()},d._c+60):setTimeout(function(){d.loadingTimeout=null;d._k4(f)},d._c+60)},_u2:function(b){this._r2=!1;clearTimeout(this.loadingTimeout);if(this._l)if(!this._e)this._p1.stop(!0),this._p=parseInt(this._p1.css(this._h?this._x1:this._w1),10);else{if(!b){b=this._p;var f=this._h3=this._l4();this._p1.css(this._g+this._u1,"0ms");b!==f&&this._p3(f)}}else 20<this._m?this._m=10:this._m++},
	_l4:function(){var b=window.getComputedStyle(this._p1.get(0),null).getPropertyValue(this._g+"transform").replace(/^matrix\(/i,"").split(/, |\)$/g),f=0===b[0].indexOf("matrix3d");return parseInt(b[this._h?f?12:4:f?13:5],10)},_m4:function(b,f){return this._e?this._y1+(f?b+this._z1+0:0+this._z1+b)+this._a2:b},_k4:function(b){this._l||(this._r1.css("z-index",0),this._m=10);this._r2=!1;this.staticSlideId=this.currSlideId;this._n2();this._n4=!1;this.ev.trigger("rsAfterSlideChange")},_i4:function(b,f){var c=
		this,a=(-c._u-c._d1)*c._w;if(0!==c.numSlides&&!c._r2)if(c.st.loopRewind)c.goTo("left"===b?c.numSlides-1:0,f);else if(c._l){c._c=200;var e=function(){c._r2=!1};c._x3(a+("left"===b?30:-30),"",!1,!0,function(){c._r2=!1;c._x3(a,"",!1,!0,e)})}},_q2:function(b,f){if(!b.isRendered){var c=b.content,a="rsMainSlideImage",e,g=this.st.imageAlignCenter,d=this.st.imageScaleMode,h;b.videoURL&&(a="rsVideoContainer","fill"!==d?e=!0:(h=c,h.hasClass(a)||(h=h.find("."+a)),h.css({width:"100%",height:"100%"}),a="rsMainSlideImage"));
		c.hasClass(a)||(c=c.find("."+a));if(c){var k=b.iW,l=b.iH;b.isRendered=!0;if("none"!==d||g){a="fill"!==d?this._d4:0;h=this._b4-2*a;var n=this._c4-2*a,m,p,q={};"fit-if-smaller"===d&&(k>h||l>n)&&(d="fit");if("fill"===d||"fit"===d)m=h/k,p=n/l,m="fill"==d?m>p?m:p:"fit"==d?m<p?m:p:1,k=Math.ceil(k*m,10),l=Math.ceil(l*m,10);"none"!==d&&(q.width=k,q.height=l,e&&c.find(".rsImg").css({width:"100%",height:"100%"}));g&&(q.marginLeft=Math.floor((h-k)/2)+a,q.marginTop=Math.floor((n-l)/2)+a);c.css(q)}}}}};n.rsProto=
	u.prototype;n.fn.royalSlider=function(b){var f=arguments;return this.each(function(){var c=n(this);if("object"!==typeof b&&b){if((c=c.data("royalSlider"))&&c[b])return c[b].apply(c,Array.prototype.slice.call(f,1))}else c.data("royalSlider")||c.data("royalSlider",new u(c,b))})};n.fn.royalSlider.defaults={slidesSpacing:8,startSlideId:0,loop:!1,loopRewind:!1,numImagesToPreload:4,fadeinLoadedSlide:!0,slidesOrientation:"horizontal",transitionType:"move",transitionSpeed:600,controlNavigation:"bullets",
	controlsInside:!0,arrowsNav:!0,arrowsNavAutoHide:!0,navigateByClick:!0,randomizeSlides:!1,sliderDrag:!0,sliderTouch:!0,keyboardNavEnabled:!1,fadeInAfterLoaded:!0,allowCSS3:!0,allowCSS3OnWebkit:!0,addActiveClass:!1,autoHeight:!1,easeOut:"easeOutSine",easeInOut:"easeInOutSine",minSlideOffset:10,imageScaleMode:"fit-if-smaller",imageAlignCenter:!0,imageScalePadding:4,usePreloader:!0,autoScaleSlider:!1,autoScaleSliderWidth:800,autoScaleSliderHeight:400,autoScaleHeight:!0,arrowsNavHideOnTouch:!1,globalCaption:!1,
	slidesDiff:2};n.rsCSS3Easing={easeOutSine:"cubic-bezier(0.390, 0.575, 0.565, 1.000)",easeInOutSine:"cubic-bezier(0.445, 0.050, 0.550, 0.950)"};n.extend(jQuery.easing,{easeInOutSine:function(b,f,c,a,e){return-a/2*(Math.cos(Math.PI*f/e)-1)+c},easeOutSine:function(b,f,c,a,e){return a*Math.sin(f/e*(Math.PI/2))+c},easeOutCubic:function(b,f,c,a,e){return a*((f=f/e-1)*f*f+1)+c}})})(jQuery,window);
// jquery.rs.bullets v1.0.1
(function(c){c.extend(c.rsProto,{_i5:function(){var a=this;"bullets"===a.st.controlNavigation&&(a.ev.one("rsAfterPropsSetup",function(){a._j5=!0;a.slider.addClass("rsWithBullets");for(var b='<div class="rsNav rsBullets">',e=0;e<a.numSlides;e++)b+='<div class="rsNavItem rsBullet"><span></span></div>';a._k5=b=c(b+"</div>");a._l5=b.appendTo(a.slider).children();a._k5.on("click.rs",".rsNavItem",function(b){a._m5||a.goTo(c(this).index())})}),a.ev.on("rsOnAppendSlide",function(b,c,d){d>=a.numSlides?a._k5.append('<div class="rsNavItem rsBullet"><span></span></div>'):
	a._l5.eq(d).before('<div class="rsNavItem rsBullet"><span></span></div>');a._l5=a._k5.children()}),a.ev.on("rsOnRemoveSlide",function(b,c){var d=a._l5.eq(c);d&&d.length&&(d.remove(),a._l5=a._k5.children())}),a.ev.on("rsOnUpdateNav",function(){var b=a.currSlideId;a._n5&&a._n5.removeClass("rsNavSelected");b=a._l5.eq(b);b.addClass("rsNavSelected");a._n5=b}))}});c.rsModules.bullets=c.rsProto._i5})(jQuery);
// jquery.rs.thumbnails v1.0.8
(function(f){f.extend(f.rsProto,{_h6:function(){var a=this;"thumbnails"===a.st.controlNavigation&&(a._i6={drag:!0,touch:!0,orientation:"horizontal",navigation:!0,arrows:!0,arrowLeft:null,arrowRight:null,spacing:4,arrowsAutoHide:!1,appendSpan:!1,transitionSpeed:600,autoCenter:!0,fitInViewport:!0,firstMargin:!0,paddingTop:0,paddingBottom:0},a.st.thumbs=f.extend({},a._i6,a.st.thumbs),a._j6=!0,!1===a.st.thumbs.firstMargin?a.st.thumbs.firstMargin=0:!0===a.st.thumbs.firstMargin&&(a.st.thumbs.firstMargin=
	a.st.thumbs.spacing),a.ev.on("rsBeforeParseNode",function(a,b,c){b=f(b);c.thumbnail=b.find(".rsTmb").remove();c.thumbnail.length?c.thumbnail=f(document.createElement("div")).append(c.thumbnail).html():(c.thumbnail=b.attr("data-rsTmb"),c.thumbnail||(c.thumbnail=b.find(".rsImg").attr("data-rsTmb")),c.thumbnail=c.thumbnail?'<img src="'+c.thumbnail+'"/>':"")}),a.ev.one("rsAfterPropsSetup",function(){a._k6()}),a._n5=null,a.ev.on("rsOnUpdateNav",function(){var e=f(a._l5[a.currSlideId]);e!==a._n5&&(a._n5&&
(a._n5.removeClass("rsNavSelected"),a._n5=null),a._l6&&a._m6(a.currSlideId),a._n5=e.addClass("rsNavSelected"))}),a.ev.on("rsOnAppendSlide",function(e,b,c){e="<div"+a._n6+' class="rsNavItem rsThumb">'+a._o6+b.thumbnail+"</div>";a._e&&a._s3.css(a._g+"transition-duration","0ms");c>=a.numSlides?a._s3.append(e):a._l5.eq(c).before(e);a._l5=a._s3.children();a.updateThumbsSize(!0)}),a.ev.on("rsOnRemoveSlide",function(e,b){var c=a._l5.eq(b);c&&(a._e&&a._s3.css(a._g+"transition-duration","0ms"),c.remove(),
	a._l5=a._s3.children(),a.updateThumbsSize(!0))}))},_k6:function(){var a=this,e="rsThumbs",b=a.st.thumbs,c="",g,d,h=b.spacing;a._j5=!0;a._e3="vertical"===b.orientation?!1:!0;a._n6=g=h?' style="margin-'+(a._e3?"right":"bottom")+":"+h+'px;"':"";a._i3=0;a._p6=!1;a._m5=!1;a._l6=!1;a._q6=b.arrows&&b.navigation;d=a._e3?"Hor":"Ver";a.slider.addClass("rsWithThumbs rsWithThumbs"+d);c+='<div class="rsNav rsThumbs rsThumbs'+d+'"><div class="'+e+'Container">';a._o6=b.appendSpan?'<span class="thumbIco"></span>':
	"";for(var k=0;k<a.numSlides;k++)d=a.slides[k],c+="<div"+g+' class="rsNavItem rsThumb">'+d.thumbnail+a._o6+"</div>";c=f(c+"</div></div>");g={};b.paddingTop&&(g[a._e3?"paddingTop":"paddingLeft"]=b.paddingTop);b.paddingBottom&&(g[a._e3?"paddingBottom":"paddingRight"]=b.paddingBottom);c.css(g);a._s3=f(c).find("."+e+"Container");a._q6&&(e+="Arrow",b.arrowLeft?a._r6=b.arrowLeft:(a._r6=f('<div class="'+e+" "+e+'Left"><div class="'+e+'Icn"></div></div>'),c.append(a._r6)),b.arrowRight?a._s6=b.arrowRight:
	(a._s6=f('<div class="'+e+" "+e+'Right"><div class="'+e+'Icn"></div></div>'),c.append(a._s6)),a._r6.click(function(){var b=(Math.floor(a._i3/a._t6)+a._u6)*a._t6+a.st.thumbs.firstMargin;a._a4(b>a._n3?a._n3:b)}),a._s6.click(function(){var b=(Math.floor(a._i3/a._t6)-a._u6)*a._t6+a.st.thumbs.firstMargin;a._a4(b<a._o3?a._o3:b)}),b.arrowsAutoHide&&!a.hasTouch&&(a._r6.css("opacity",0),a._s6.css("opacity",0),c.one("mousemove.rsarrowshover",function(){a._l6&&(a._r6.css("opacity",1),a._s6.css("opacity",1))}),
	c.hover(function(){a._l6&&(a._r6.css("opacity",1),a._s6.css("opacity",1))},function(){a._l6&&(a._r6.css("opacity",0),a._s6.css("opacity",0))})));a._k5=c;a._l5=a._s3.children();a.msEnabled&&a.st.thumbs.navigation&&a._s3.css("-ms-touch-action",a._e3?"pan-y":"pan-x");a.slider.append(c);a._w3=!0;a._v6=h;b.navigation&&a._e&&a._s3.css(a._g+"transition-property",a._g+"transform");a._k5.on("click.rs",".rsNavItem",function(b){a._m5||a.goTo(f(this).index())});a.ev.off("rsBeforeSizeSet.thumbs").on("rsBeforeSizeSet.thumbs",
	function(){a._w6=a._e3?a._c4:a._b4;a.updateThumbsSize(!0)});a.ev.off("rsAutoHeightChange.thumbs").on("rsAutoHeightChange.thumbs",function(b,c){a.updateThumbsSize(!0,c)})},updateThumbsSize:function(a,e){var b=this,c=b._l5.first(),f={},d=b._l5.length;b._t6=(b._e3?c.outerWidth():c.outerHeight())+b._v6;b._y3=d*b._t6-b._v6;f[b._e3?"width":"height"]=b._y3+b._v6;b._z3=b._e3?b._k5.width():void 0!==e?e:b._k5.height();b._w3&&(b.isFullscreen||b.st.thumbs.fitInViewport)&&(b._e3?b._c4=b._w6-b._k5.outerHeight():
	b._b4=b._w6-b._k5.outerWidth());b._z3&&(b._o3=-(b._y3-b._z3)-b.st.thumbs.firstMargin,b._n3=b.st.thumbs.firstMargin,b._u6=Math.floor(b._z3/b._t6),b._y3<b._z3?(b.st.thumbs.autoCenter?b._q3((b._z3-b._y3)/2):b._q3(b._n3),b.st.thumbs.arrows&&b._r6&&(b._r6.addClass("rsThumbsArrowDisabled"),b._s6.addClass("rsThumbsArrowDisabled")),b._l6=!1,b._m5=!1,b._k5.off(b._j1)):b.st.thumbs.navigation&&!b._l6&&(b._l6=!0,!b.hasTouch&&b.st.thumbs.drag||b.hasTouch&&b.st.thumbs.touch)&&(b._m5=!0,b._k5.on(b._j1,function(a){b._g2(a,
	!0)})),b._s3.css(f),a&&e&&b._m6(b.currSlideId,!0))},setThumbsOrientation:function(a,e){this._w3&&(this.st.thumbs.orientation=a,this._k5.remove(),this.slider.removeClass("rsWithThumbsHor rsWithThumbsVer"),this._k6(),this._k5.off(this._j1),e||this.updateSliderSize(!0))},_q3:function(a){this._i3=a;this._e?this._s3.css(this._x1,this._y1+(this._e3?a+this._z1+0:0+this._z1+a)+this._a2):this._s3.css(this._e3?this._x1:this._w1,a)},_a4:function(a,e,b,c,g){var d=this;if(d._l6){e||(e=d.st.thumbs.transitionSpeed);
	d._i3=a;d._x6&&clearTimeout(d._x6);d._p6&&(d._e||d._s3.stop(),b=!0);var h={};d._p6=!0;d._e?(h[d._g+"transition-duration"]=e+"ms",h[d._g+"transition-timing-function"]=b?f.rsCSS3Easing[d.st.easeOut]:f.rsCSS3Easing[d.st.easeInOut],d._s3.css(h),d._q3(a)):(h[d._e3?d._x1:d._w1]=a+"px",d._s3.animate(h,e,b?"easeOutCubic":d.st.easeInOut));c&&(d._i3=c);d._y6();d._x6=setTimeout(function(){d._p6=!1;g&&(d._a4(c,g,!0),g=null)},e)}},_y6:function(){this._q6&&(this._i3===this._n3?this._r6.addClass("rsThumbsArrowDisabled"):
	this._r6.removeClass("rsThumbsArrowDisabled"),this._i3===this._o3?this._s6.addClass("rsThumbsArrowDisabled"):this._s6.removeClass("rsThumbsArrowDisabled"))},_m6:function(a,e){var b=0,c,f=a*this._t6+2*this._t6-this._v6+this._n3,d=Math.floor(this._i3/this._t6);this._l6&&(this._j6&&(e=!0,this._j6=!1),f+this._i3>this._z3?(a===this.numSlides-1&&(b=1),d=-a+this._u6-2+b,c=d*this._t6+this._z3%this._t6+this._v6-this._n3):0!==a?(a-1)*this._t6<=-this._i3+this._n3&&a-1<=this.numSlides-this._u6&&(c=(-a+1)*this._t6+
this._n3):c=this._n3,c!==this._i3&&(b=void 0===c?this._i3:c,b>this._n3?this._q3(this._n3):b<this._o3?this._q3(this._o3):void 0!==c&&(e?this._q3(c):this._a4(c))),this._y6())}});f.rsModules.thumbnails=f.rsProto._h6})(jQuery);
// jquery.rs.tabs v1.0.2
(function(e){e.extend(e.rsProto,{_f6:function(){var a=this;"tabs"===a.st.controlNavigation&&(a.ev.on("rsBeforeParseNode",function(a,d,b){d=e(d);b.thumbnail=d.find(".rsTmb").remove();b.thumbnail.length?b.thumbnail=e(document.createElement("div")).append(b.thumbnail).html():(b.thumbnail=d.attr("data-rsTmb"),b.thumbnail||(b.thumbnail=d.find(".rsImg").attr("data-rsTmb")),b.thumbnail=b.thumbnail?'<img src="'+b.thumbnail+'"/>':"")}),a.ev.one("rsAfterPropsSetup",function(){a._g6()}),a.ev.on("rsOnAppendSlide",
	function(c,d,b){b>=a.numSlides?a._k5.append('<div class="rsNavItem rsTab">'+d.thumbnail+"</div>"):a._l5.eq(b).before('<div class="rsNavItem rsTab">'+item.thumbnail+"</div>");a._l5=a._k5.children()}),a.ev.on("rsOnRemoveSlide",function(c,d){var b=a._l5.eq(d);b&&(b.remove(),a._l5=a._k5.children())}),a.ev.on("rsOnUpdateNav",function(){var c=a.currSlideId;a._n5&&a._n5.removeClass("rsNavSelected");c=a._l5.eq(c);c.addClass("rsNavSelected");a._n5=c}))},_g6:function(){var a=this,c;a._j5=!0;c='<div class="rsNav rsTabs">';
	for(var d=0;d<a.numSlides;d++)c+='<div class="rsNavItem rsTab">'+a.slides[d].thumbnail+"</div>";c=e(c+"</div>");a._k5=c;a._l5=c.children(".rsNavItem");a.slider.append(c);a._k5.click(function(b){b=e(b.target).closest(".rsNavItem");b.length&&a.goTo(b.index())})}});e.rsModules.tabs=e.rsProto._f6})(jQuery);
// jquery.rs.fullscreen v1.0.6
(function(c){c.extend(c.rsProto,{_q5:function(){var a=this;a._r5={enabled:!1,keyboardNav:!0,buttonFS:!0,nativeFS:!1,doubleTap:!0};a.st.fullscreen=c.extend({},a._r5,a.st.fullscreen);if(a.st.fullscreen.enabled)a.ev.one("rsBeforeSizeSet",function(){a._s5()})},_s5:function(){var a=this;a._t5=!a.st.keyboardNavEnabled&&a.st.fullscreen.keyboardNav;if(a.st.fullscreen.nativeFS){var b={supportsFullScreen:!1,isFullScreen:function(){return!1},requestFullScreen:function(){},cancelFullScreen:function(){},fullScreenEventName:"",
	prefix:""},d=["webkit","moz","o","ms","khtml"];if("undefined"!=typeof document.cancelFullScreen)b.supportsFullScreen=!0;else for(var e=0,f=d.length;e<f;e++)if(b.prefix=d[e],"undefined"!=typeof document[b.prefix+"CancelFullScreen"]){b.supportsFullScreen=!0;break}b.supportsFullScreen?(a.nativeFS=!0,b.fullScreenEventName=b.prefix+"fullscreenchange"+a.ns,b.isFullScreen=function(){switch(this.prefix){case "":return document.fullScreen;case "webkit":return document.webkitIsFullScreen;default:return document[this.prefix+
"FullScreen"]}},b.requestFullScreen=function(a){return""===this.prefix?a.requestFullScreen():a[this.prefix+"RequestFullScreen"]()},b.cancelFullScreen=function(a){return""===this.prefix?document.cancelFullScreen():document[this.prefix+"CancelFullScreen"]()},a._u5=b):a._u5=!1}a.st.fullscreen.buttonFS&&(a._v5=c('<div class="rsFullscreenBtn"><div class="rsFullscreenIcn"></div></div>').appendTo(a._o1).on("click.rs",function(){a.isFullscreen?a.exitFullscreen():a.enterFullscreen()}))},enterFullscreen:function(a){var b=
	this;if(b._u5)if(a)b._u5.requestFullScreen(c("html")[0]);else{b._b.on(b._u5.fullScreenEventName,function(a){b._u5.isFullScreen()?b.enterFullscreen(!0):b.exitFullscreen(!0)});b._u5.requestFullScreen(c("html")[0]);return}if(!b._w5){b._w5=!0;b._b.on("keyup"+b.ns+"fullscreen",function(a){27===a.keyCode&&b.exitFullscreen()});b._t5&&b._b2();a=c(window);b._x5=a.scrollTop();b._y5=a.scrollLeft();b._z5=c("html").attr("style");b._a6=c("body").attr("style");b._b6=b.slider.attr("style");c("body, html").css({overflow:"hidden",
	height:"100%",width:"100%",margin:"0",padding:"0"});b.slider.addClass("rsFullscreen");var d;for(d=0;d<b.numSlides;d++)a=b.slides[d],a.isRendered=!1,a.bigImage&&(a.isBig=!0,a.isMedLoaded=a.isLoaded,a.isMedLoading=a.isLoading,a.medImage=a.image,a.medIW=a.iW,a.medIH=a.iH,a.slideId=-99,a.bigImage!==a.medImage&&(a.sizeType="big"),a.isLoaded=a.isBigLoaded,a.isLoading=!1,a.image=a.bigImage,a.images[0]=a.bigImage,a.iW=a.bigIW,a.iH=a.bigIH,a.isAppended=a.contentAdded=!1,b._c6(a));b.isFullscreen=!0;b._w5=!1;
	b.updateSliderSize();b.ev.trigger("rsEnterFullscreen")}},exitFullscreen:function(a){var b=this;if(b._u5){if(!a){b._u5.cancelFullScreen(c("html")[0]);return}b._b.off(b._u5.fullScreenEventName)}if(!b._w5){b._w5=!0;b._b.off("keyup"+b.ns+"fullscreen");b._t5&&b._b.off("keydown"+b.ns);c("html").attr("style",b._z5||"");c("body").attr("style",b._a6||"");var d;for(d=0;d<b.numSlides;d++)a=b.slides[d],a.isRendered=!1,a.bigImage&&(a.isBig=!1,a.slideId=-99,a.isBigLoaded=a.isLoaded,a.isBigLoading=a.isLoading,a.bigImage=
	a.image,a.bigIW=a.iW,a.bigIH=a.iH,a.isLoaded=a.isMedLoaded,a.isLoading=!1,a.image=a.medImage,a.images[0]=a.medImage,a.iW=a.medIW,a.iH=a.medIH,a.isAppended=a.contentAdded=!1,b._c6(a,!0),a.bigImage!==a.medImage&&(a.sizeType="med"));b.isFullscreen=!1;a=c(window);a.scrollTop(b._x5);a.scrollLeft(b._y5);b._w5=!1;b.slider.removeClass("rsFullscreen");b.updateSliderSize();setTimeout(function(){b.updateSliderSize()},1);b.ev.trigger("rsExitFullscreen")}},_c6:function(a,b){var d=a.isLoaded||a.isLoading?'<img class="rsImg rsMainSlideImage" src="'+
a.image+'"/>':'<a class="rsImg rsMainSlideImage" href="'+a.image+'"></a>';a.content.hasClass("rsImg")?a.content=c(d):a.content.find(".rsImg").eq(0).replaceWith(d);a.isLoaded||a.isLoading||!a.holder||a.holder.html(a.content)}});c.rsModules.fullscreen=c.rsProto._q5})(jQuery);
// jquery.rs.autoplay v1.0.5
(function(b){b.extend(b.rsProto,{_x4:function(){var a=this,d;a._y4={enabled:!1,stopAtAction:!0,pauseOnHover:!0,delay:2E3};!a.st.autoPlay&&a.st.autoplay&&(a.st.autoPlay=a.st.autoplay);a.st.autoPlay=b.extend({},a._y4,a.st.autoPlay);a.st.autoPlay.enabled&&(a.ev.on("rsBeforeParseNode",function(a,c,f){c=b(c);if(d=c.attr("data-rsDelay"))f.customDelay=parseInt(d,10)}),a.ev.one("rsAfterInit",function(){a._z4()}),a.ev.on("rsBeforeDestroy",function(){a.stopAutoPlay();a.slider.off("mouseenter mouseleave");b(window).off("blur"+
a.ns+" focus"+a.ns)}))},_z4:function(){var a=this;a.startAutoPlay();a.ev.on("rsAfterContentSet",function(b,e){a._l2||a._r2||!a._a5||e!==a.currSlide||a._b5()});a.ev.on("rsDragRelease",function(){a._a5&&a._c5&&(a._c5=!1,a._b5())});a.ev.on("rsAfterSlideChange",function(){a._a5&&a._c5&&(a._c5=!1,a.currSlide.isLoaded&&a._b5())});a.ev.on("rsDragStart",function(){a._a5&&(a.st.autoPlay.stopAtAction?a.stopAutoPlay():(a._c5=!0,a._d5()))});a.ev.on("rsBeforeMove",function(b,e,c){a._a5&&(c&&a.st.autoPlay.stopAtAction?
	a.stopAutoPlay():(a._c5=!0,a._d5()))});a._e5=!1;a.ev.on("rsVideoStop",function(){a._a5&&(a._e5=!1,a._b5())});a.ev.on("rsVideoPlay",function(){a._a5&&(a._c5=!1,a._d5(),a._e5=!0)});b(window).on("blur"+a.ns,function(){a._a5&&(a._c5=!0,a._d5())}).on("focus"+a.ns,function(){a._a5&&a._c5&&(a._c5=!1,a._b5())});a.st.autoPlay.pauseOnHover&&(a._f5=!1,a.slider.hover(function(){a._a5&&(a._c5=!1,a._d5(),a._f5=!0)},function(){a._a5&&(a._f5=!1,a._b5())}))},toggleAutoPlay:function(){this._a5?this.stopAutoPlay():
	this.startAutoPlay()},startAutoPlay:function(){this._a5=!0;this.currSlide.isLoaded&&this._b5()},stopAutoPlay:function(){this._e5=this._f5=this._c5=this._a5=!1;this._d5()},_b5:function(){var a=this;a._f5||a._e5||(a._g5=!0,a._h5&&clearTimeout(a._h5),a._h5=setTimeout(function(){var b;a._z||a.st.loopRewind||(b=!0,a.st.loopRewind=!0);a.next(!0);b&&(a.st.loopRewind=!1)},a.currSlide.customDelay?a.currSlide.customDelay:a.st.autoPlay.delay))},_d5:function(){this._f5||this._e5||(this._g5=!1,this._h5&&(clearTimeout(this._h5),
	this._h5=null))}});b.rsModules.autoplay=b.rsProto._x4})(jQuery);
// jquery.rs.video v1.1.3
(function(f){f.extend(f.rsProto,{_z6:function(){var a=this;a._a7={autoHideArrows:!0,autoHideControlNav:!1,autoHideBlocks:!1,autoHideCaption:!1,disableCSS3inFF:!0,youTubeCode:'<iframe src="http://www.youtube.com/embed/%id%?rel=1&showinfo=0&autoplay=1&wmode=transparent" frameborder="no"></iframe>',vimeoCode:'<iframe src="http://player.vimeo.com/video/%id%?byline=0&portrait=0&autoplay=1" frameborder="no" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'};a.st.video=f.extend({},a._a7,
	a.st.video);a.ev.on("rsBeforeSizeSet",function(){a._b7&&setTimeout(function(){var b=a._r1,b=b.hasClass("rsVideoContainer")?b:b.find(".rsVideoContainer");a._c7&&a._c7.css({width:b.width(),height:b.height()})},32)});var d=a._a.mozilla;a.ev.on("rsAfterParseNode",function(b,c,e){b=f(c);if(e.videoURL){a.st.video.disableCSS3inFF&&d&&(a._e=a._f=!1);c=f('<div class="rsVideoContainer"></div>');var g=f('<div class="rsBtnCenterer"><div class="rsPlayBtn"><div class="rsPlayBtnIcon"></div></div></div>');b.hasClass("rsImg")?
	e.content=c.append(b).append(g):e.content.find(".rsImg").wrap(c).after(g)}});a.ev.on("rsAfterSlideChange",function(){a.stopVideo()})},toggleVideo:function(){return this._b7?this.stopVideo():this.playVideo()},playVideo:function(){var a=this;if(!a._b7){var d=a.currSlide;if(!d.videoURL)return!1;a._d7=d;var b=a._e7=d.content,d=d.videoURL,c,e;d.match(/youtu\.be/i)||d.match(/youtube\.com/i)?(e=/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,(e=d.match(e))&&11==e[7].length&&
(c=e[7]),void 0!==c&&(a._c7=a.st.video.youTubeCode.replace("%id%",c))):d.match(/vimeo\.com/i)&&(e=/(www\.)?vimeo.com\/(\d+)($|\/)/,(e=d.match(e))&&(c=e[2]),void 0!==c&&(a._c7=a.st.video.vimeoCode.replace("%id%",c)));a.videoObj=f(a._c7);a.ev.trigger("rsOnCreateVideoElement",[d]);a.videoObj.length&&(a._c7=f('<div class="rsVideoFrameHolder"><div class="rsPreloader"></div><div class="rsCloseVideoBtn"><div class="rsCloseVideoIcn"></div></div></div>'),a._c7.find(".rsPreloader").after(a.videoObj),b=b.hasClass("rsVideoContainer")?
	b:b.find(".rsVideoContainer"),a._c7.css({width:b.width(),height:b.height()}).find(".rsCloseVideoBtn").off("click.rsv").on("click.rsv",function(b){a.stopVideo();b.preventDefault();b.stopPropagation();return!1}),b.append(a._c7),a.isIPAD&&b.addClass("rsIOSVideo"),a._f7(!1),setTimeout(function(){a._c7.addClass("rsVideoActive")},10),a.ev.trigger("rsVideoPlay"),a._b7=!0);return!0}return!1},stopVideo:function(){var a=this;return a._b7?(a.isIPAD&&a.slider.find(".rsCloseVideoBtn").remove(),a._f7(!0),setTimeout(function(){a.ev.trigger("rsOnDestroyVideoElement",
	[a.videoObj]);var d=a._c7.find("iframe");if(d.length)try{d.attr("src","")}catch(b){}a._c7.remove();a._c7=null},16),a.ev.trigger("rsVideoStop"),a._b7=!1,!0):!1},_f7:function(a,d){var b=[],c=this.st.video;c.autoHideArrows&&(this._c2&&(b.push(this._c2,this._d2),this._e2=!a),this._v5&&b.push(this._v5));c.autoHideControlNav&&this._k5&&b.push(this._k5);c.autoHideBlocks&&this._d7.animBlocks&&b.push(this._d7.animBlocks);c.autoHideCaption&&this.globalCaption&&b.push(this.globalCaption);this.slider[a?"removeClass":
	"addClass"]("rsVideoPlaying");if(b.length)for(c=0;c<b.length;c++)a?b[c].removeClass("rsHidden"):b[c].addClass("rsHidden")}});f.rsModules.video=f.rsProto._z6})(jQuery);
// jquery.rs.animated-blocks v1.0.7
(function(l){l.extend(l.rsProto,{_p4:function(){function m(){var g=a.currSlide;if(a.currSlide&&a.currSlide.isLoaded&&a._t4!==g){if(0<a._s4.length){for(b=0;b<a._s4.length;b++)clearTimeout(a._s4[b]);a._s4=[]}if(0<a._r4.length){var f;for(b=0;b<a._r4.length;b++)if(f=a._r4[b])a._e?(f.block.css(a._g+a._u1,"0s"),f.block.css(f.css)):f.block.stop(!0).css(f.css),a._t4=null,g.animBlocksDisplayed=!1;a._r4=[]}g.animBlocks&&(g.animBlocksDisplayed=!0,a._t4=g,a._u4(g.animBlocks))}}var a=this,b;a._q4={fadeEffect:!0,
	moveEffect:"top",moveOffset:20,speed:400,easing:"easeOutSine",delay:200};a.st.block=l.extend({},a._q4,a.st.block);a._r4=[];a._s4=[];a.ev.on("rsAfterInit",function(){m()});a.ev.on("rsBeforeParseNode",function(a,b,d){b=l(b);d.animBlocks=b.find(".rsABlock").css("display","none");d.animBlocks.length||(b.hasClass("rsABlock")?d.animBlocks=b.css("display","none"):d.animBlocks=!1)});a.ev.on("rsAfterContentSet",function(b,f){f.id===a.slides[a.currSlideId].id&&setTimeout(function(){m()},a.st.fadeinLoadedSlide?
	300:0)});a.ev.on("rsAfterSlideChange",function(){m()})},_v4:function(l,a){setTimeout(function(){l.css(a)},6)},_u4:function(m){var a=this,b,g,f,d,h,e,n;a._s4=[];m.each(function(m){b=l(this);g={};f={};d=null;var c=b.attr("data-move-offset"),c=c?parseInt(c,10):a.st.block.moveOffset;if(0<c&&((e=b.data("move-effect"))?(e=e.toLowerCase(),"none"===e?e=!1:"left"!==e&&"top"!==e&&"bottom"!==e&&"right"!==e&&(e=a.st.block.moveEffect,"none"===e&&(e=!1))):e=a.st.block.moveEffect,e&&"none"!==e)){var p;p="right"===
e||"left"===e?!0:!1;var k;n=!1;a._e?(k=0,h=a._x1):(p?isNaN(parseInt(b.css("right"),10))?h="left":(h="right",n=!0):isNaN(parseInt(b.css("bottom"),10))?h="top":(h="bottom",n=!0),h="margin-"+h,n&&(c=-c),a._e?k=parseInt(b.css(h),10):(k=b.data("rs-start-move-prop"),void 0===k&&(k=parseInt(b.css(h),10),isNaN(k)&&(k=0),b.data("rs-start-move-prop",k))));f[h]=a._m4("top"===e||"left"===e?k-c:k+c,p);g[h]=a._m4(k,p)}c=b.attr("data-fade-effect");if(!c)c=a.st.block.fadeEffect;else if("none"===c.toLowerCase()||
	"false"===c.toLowerCase())c=!1;c&&(f.opacity=0,g.opacity=1);if(c||e)d={},d.hasFade=Boolean(c),Boolean(e)&&(d.moveProp=h,d.hasMove=!0),d.speed=b.data("speed"),isNaN(d.speed)&&(d.speed=a.st.block.speed),d.easing=b.data("easing"),d.easing||(d.easing=a.st.block.easing),d.css3Easing=l.rsCSS3Easing[d.easing],d.delay=b.data("delay"),isNaN(d.delay)&&(d.delay=a.st.block.delay*m);c={};a._e&&(c[a._g+a._u1]="0ms");c.moveProp=g.moveProp;c.opacity=g.opacity;c.display="none";a._r4.push({block:b,css:c});a._v4(b,
	f);a._s4.push(setTimeout(function(b,d,c,e){return function(){b.css("display","block");if(c){var g={};if(a._e){var f="";c.hasMove&&(f+=c.moveProp);c.hasFade&&(c.hasMove&&(f+=", "),f+="opacity");g[a._g+a._t1]=f;g[a._g+a._u1]=c.speed+"ms";g[a._g+a._v1]=c.css3Easing;b.css(g);setTimeout(function(){b.css(d)},24)}else setTimeout(function(){b.animate(d,c.speed,c.easing)},16)}delete a._s4[e]}}(b,g,d,m),6>=d.delay?12:d.delay))})}});l.rsModules.animatedBlocks=l.rsProto._p4})(jQuery);
// jquery.rs.auto-height v1.0.3
(function(b){b.extend(b.rsProto,{_w4:function(){var a=this;if(a.st.autoHeight){var b,c,e,f=!0,d=function(d){e=a.slides[a.currSlideId];(b=e.holder)&&(c=b.height())&&void 0!==c&&c>(a.st.minAutoHeight||30)&&(a._c4=c,a._e||!d?a._e1.css("height",c):a._e1.stop(!0,!0).animate({height:c},a.st.transitionSpeed),a.ev.trigger("rsAutoHeightChange",c),f&&(a._e&&setTimeout(function(){a._e1.css(a._g+"transition","height "+a.st.transitionSpeed+"ms ease-in-out")},16),f=!1))};a.ev.on("rsMaybeSizeReady.rsAutoHeight",
	function(a,b){e===b&&d()});a.ev.on("rsAfterContentSet.rsAutoHeight",function(a,b){e===b&&d()});a.slider.addClass("rsAutoHeight");a.ev.one("rsAfterInit",function(){setTimeout(function(){d(!1);setTimeout(function(){a.slider.append('<div style="clear:both; float: none;"></div>')},16)},16)});a.ev.on("rsBeforeAnimStart",function(){d(!0)});a.ev.on("rsBeforeSizeSet",function(){setTimeout(function(){d(!1)},16)})}}});b.rsModules.autoHeight=b.rsProto._w4})(jQuery);
// jquery.rs.global-caption v1.0
(function(b){b.extend(b.rsProto,{_d6:function(){var a=this;a.st.globalCaption&&(a.ev.on("rsAfterInit",function(){a.globalCaption=b('<div class="rsGCaption"></div>').appendTo(a.st.globalCaptionInside?a._e1:a.slider);a.globalCaption.html(a.currSlide.caption)}),a.ev.on("rsBeforeAnimStart",function(){a.globalCaption.html(a.currSlide.caption)}))}});b.rsModules.globalCaption=b.rsProto._d6})(jQuery);
// jquery.rs.active-class v1.0.1
(function(c){c.rsProto._o4=function(){var b,a=this;if(a.st.addActiveClass)a.ev.on("rsOnUpdateNav",function(){b&&clearTimeout(b);b=setTimeout(function(){a._g4&&a._g4.removeClass("rsActiveSlide");a._r1&&a._r1.addClass("rsActiveSlide");b=null},50)})};c.rsModules.activeClass=c.rsProto._o4})(jQuery);
// jquery.rs.deeplinking v1.0.6 + jQuery hashchange plugin v1.3 Copyright (c) 2010 Ben Alman
(function(b){b.extend(b.rsProto,{_o5:function(){var a=this,h,d,f;a._p5={enabled:!1,change:!1,prefix:""};a.st.deeplinking=b.extend({},a._p5,a.st.deeplinking);if(a.st.deeplinking.enabled){var g=a.st.deeplinking.change,e=a.st.deeplinking.prefix,c="#"+e,k=function(){var a=window.location.hash;return a&&0<a.indexOf(e)&&(a=parseInt(a.substring(c.length),10),0<=a)?a-1:-1},p=k();-1!==p&&(a.st.startSlideId=p);g&&(b(window).on("hashchange"+a.ns,function(b){h||(b=k(),0>b||(b>a.numSlides-1&&(b=a.numSlides-1),
	a.goTo(b)))}),a.ev.on("rsBeforeAnimStart",function(){d&&clearTimeout(d);f&&clearTimeout(f)}),a.ev.on("rsAfterSlideChange",function(){d&&clearTimeout(d);f&&clearTimeout(f);f=setTimeout(function(){h=!0;window.location.replace((""+window.location).split("#")[0]+c+(a.currSlideId+1));d=setTimeout(function(){h=!1;d=null},60)},400)}));a.ev.on("rsBeforeDestroy",function(){d=f=null;g&&b(window).off("hashchange"+a.ns)})}}});b.rsModules.deeplinking=b.rsProto._o5})(jQuery);
(function(b,a,h){function d(a){a=a||location.href;return"#"+a.replace(/^[^#]*#?(.*)$/,"$1")}"$:nomunge";var f=document,g,e=b.event.special,c=f.documentMode,k="onhashchange"in a&&(c===h||7<c);b.fn.hashchange=function(a){return a?this.bind("hashchange",a):this.trigger("hashchange")};b.fn.hashchange.delay=50;e.hashchange=b.extend(e.hashchange,{setup:function(){if(k)return!1;b(g.start)},teardown:function(){if(k)return!1;b(g.stop)}});g=function(){function g(){var f=d(),e=q(l);f!==l?(m(l=f,e),b(a).trigger("hashchange")):
e!==l&&(location.href=location.href.replace(/#.*/,"")+e);c=setTimeout(g,b.fn.hashchange.delay)}var e={},c,l=d(),n=function(a){return a},m=n,q=n;e.start=function(){c||g()};e.stop=function(){c&&clearTimeout(c);c=h};a.attachEvent&&!a.addEventListener&&!k&&function(){var a,c;e.start=function(){a||(c=(c=b.fn.hashchange.src)&&c+d(),a=b('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){c||m(d());g()}).attr("src",c||"javascript:0").insertAfter("body")[0].contentWindow,f.onpropertychange=
	function(){try{"title"===event.propertyName&&(a.document.title=f.title)}catch(b){}})};e.stop=n;q=function(){return d(a.location.href)};m=function(c,e){var d=a.document,g=b.fn.hashchange.domain;c!==e&&(d.title=f.title,d.open(),g&&d.write('<script>document.domain="'+g+'"\x3c/script>'),d.close(),a.location.hash=c)}}();return e}()})(jQuery,this);
// jquery.rs.visible-nearby v1.0.2
(function(d){d.rsProto._g7=function(){var a=this;a.st.visibleNearby&&a.st.visibleNearby.enabled&&(a._h7={enabled:!0,centerArea:.6,center:!0,breakpoint:0,breakpointCenterArea:.8,hiddenOverflow:!0,navigateByCenterClick:!1},a.st.visibleNearby=d.extend({},a._h7,a.st.visibleNearby),a.ev.one("rsAfterPropsSetup",function(){a._i7=a._e1.css("overflow","visible").wrap('<div class="rsVisibleNearbyWrap"></div>').parent();a.st.visibleNearby.hiddenOverflow||a._i7.css("overflow","visible");a._o1=a.st.controlsInside?
	a._i7:a.slider}),a.ev.on("rsAfterSizePropSet",function(){var b,c=a.st.visibleNearby;b=c.breakpoint&&a.width<c.breakpoint?c.breakpointCenterArea:c.centerArea;a._h?(a._b4*=b,a._i7.css({height:a._c4,width:a._b4/b}),a._d=a._b4*(1-b)/2/b):(a._c4*=b,a._i7.css({height:a._c4/b,width:a._b4}),a._d=a._c4*(1-b)/2/b);c.navigateByCenterClick||(a._q=a._h?a._b4:a._c4);c.center&&a._e1.css("margin-"+(a._h?"left":"top"),a._d)}))};d.rsModules.visibleNearby=d.rsProto._g7})(jQuery);

/* --- ROYALSLIDER end --- */

/*!
 * VERSION: 1.7.3
 * DATE: 2014-01-14
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";var t=document.documentElement,e=window,i=function(i,r){var s="x"===r?"Width":"Height",n="scroll"+s,a="client"+s,o=document.body;return i===e||i===t||i===o?Math.max(t[n],o[n])-(e["inner"+s]||Math.max(t[a],o[a])):i[n]-i["offset"+s]},r=window._gsDefine.plugin({propName:"scrollTo",API:2,version:"1.7.3",init:function(t,r,s){return this._wdw=t===e,this._target=t,this._tween=s,"object"!=typeof r&&(r={y:r}),this._autoKill=r.autoKill!==!1,this.x=this.xPrev=this.getX(),this.y=this.yPrev=this.getY(),null!=r.x?(this._addTween(this,"x",this.x,"max"===r.x?i(t,"x"):r.x,"scrollTo_x",!0),this._overwriteProps.push("scrollTo_x")):this.skipX=!0,null!=r.y?(this._addTween(this,"y",this.y,"max"===r.y?i(t,"y"):r.y,"scrollTo_y",!0),this._overwriteProps.push("scrollTo_y")):this.skipY=!0,!0},set:function(t){this._super.setRatio.call(this,t);var r=this._wdw||!this.skipX?this.getX():this.xPrev,s=this._wdw||!this.skipY?this.getY():this.yPrev,n=s-this.yPrev,a=r-this.xPrev;this._autoKill&&(!this.skipX&&(a>7||-7>a)&&i(this._target,"x")>r&&(this.skipX=!0),!this.skipY&&(n>7||-7>n)&&i(this._target,"y")>s&&(this.skipY=!0),this.skipX&&this.skipY&&this._tween.kill()),this._wdw?e.scrollTo(this.skipX?r:this.x,this.skipY?s:this.y):(this.skipY||(this._target.scrollTop=this.y),this.skipX||(this._target.scrollLeft=this.x)),this.xPrev=this.x,this.yPrev=this.y}}),s=r.prototype;r.max=i,s.getX=function(){return this._wdw?null!=e.pageXOffset?e.pageXOffset:null!=t.scrollLeft?t.scrollLeft:document.body.scrollLeft:this._target.scrollLeft},s.getY=function(){return this._wdw?null!=e.pageYOffset?e.pageYOffset:null!=t.scrollTop?t.scrollTop:document.body.scrollTop:this._target.scrollTop},s._kill=function(t){return t.scrollTo_x&&(this.skipX=!0),t.scrollTo_y&&(this.skipY=!0),this._super._kill.call(this,t)}}),window._gsDefine&&window._gsQueue.pop()();
// /* ====== HELPER FUNCTIONS ====== */

//similar to PHP's empty function
function empty(data)
{
	if(typeof(data) == 'number' || typeof(data) == 'boolean')
	{
		return false;
	}
	if(typeof(data) == 'undefined' || data === null)
	{
		return true;
	}
	if(typeof(data.length) != 'undefined')
	{
		return data.length === 0;
	}
	var count = 0;
	for(var i in data)
	{
		// if(data.hasOwnProperty(i))
		//
		// This doesn't work in ie8/ie9 due the fact that hasOwnProperty works only on native objects.
		// http://stackoverflow.com/questions/8157700/object-has-no-hasownproperty-method-i-e-its-undefined-ie8
		//
		// for hosts objects we do this
		if(Object.prototype.hasOwnProperty.call(data,i))
		{
			count ++;
		}
	}
	return count === 0;
}

/* --- Set Query Parameter--- */
function setQueryParameter(uri, key, value) {
	var re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
	separator = uri.indexOf('?') !== -1 ? "&" : "?";
	if (uri.match(re)) {
		return uri.replace(re, '$1' + key + "=" + value + '$2');
	}
	else {
		return uri + separator + key + "=" + value;
	}
}