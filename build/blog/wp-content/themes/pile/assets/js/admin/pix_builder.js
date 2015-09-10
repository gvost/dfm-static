(function ($) {
	"use strict";

	$(document).ready(function () {

		var $page_template = $('#page_template');

		// Make page builder visible only when the page builde template is selected
		if ($page_template.val() === 'page-templates/page-builder.php') {
			$('#postdivrich').hide();
		} else {
			$('#postdivrich').show();
		}

		$page_template.on('change', function() {

			if ($page_template.val() === 'page-templates/page-builder.php') {
				$('#postdivrich').hide();
			} else {
				$('#postdivrich').show();
				// tinyMce will be messed, a simple resize will do the job
				$(window).resize();
			}
		});

		// classify the gallery number
		$('#pixgallery').on('html-change-post', function() {
			var $gallery = $( this ).children('ul'),
				nr_of_images = $gallery.children('li').length,
				metabox_class = '',
				options_container = $('#pile_project_header_area_slideshow tr:not(.display_on.hidden):not(:first-child)');

			if ( nr_of_images == 0 ) {
				metabox_class = 'no-image';
			} else if ( nr_of_images == 1 ) {
				metabox_class = 'single-image';
			} else {
				metabox_class = 'multiple-images';
			}

			if ( metabox_class !== '' ) {
				$( '#_project_aside')
					.removeClass('no-image single-image multiple-images')
					.addClass(metabox_class);
			}

			toggleSliderOptions(nr_of_images, options_container);
		});


		// Show/Hide "Slideshow Options"
		var toggleSliderOptions = function(no, el) {
			if (no <= 1) {
				el.slideUp();
			} else {
				el.slideDown();
			}
		}

		// Hide Slideshow Options by default
		var hideSlideshowOptions = function(el) {
			$('#pile_project_header_area_slideshow tr').not(":eq(0)").hide();
			$('#pile_project_header_area_slideshow tr:eq(1) td input').hide();
		};

		hideSlideshowOptions();

	});
})(jQuery);