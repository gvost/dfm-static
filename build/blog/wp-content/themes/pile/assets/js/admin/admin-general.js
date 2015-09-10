(function($){

	$(document).ready(function(){
		var featured_image = $('#postimagediv .inside'),
			project_color = $('#_pile_project_color');

		if ( project_color.length > 0 ) {

			featured_image.on('html-change-post', function() {
				var image = featured_image.find('#set-post-thumbnail img');
				if ( image.length > 0 ) {

					var alt = $(image).attr('alt'),
						src = $(image).attr('src');

					$.ajax({
						type: "post",
						url: ajaxurl,
						data: { action: 'get_project_color', attachment_src: src },
						success:function(response){

							if ( response === 0 ) return;

							var color = '#' + response,
								isColor  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);

							if ( isColor ) {
								//$('#postimagediv').attr('style', 'background-color:'+ color);

								var palettes = get_colorpicker_palettes(color);

								// setup the color and the new palettes
								$('#_pile_project_color')
									.iris('option', 'palettes', palettes )
									.val(color)
									.trigger('change');
							}
						}
					});
				}
			});

			var get_colorpicker_palettes = function( color ){

				var palettes = [],
					darker1 = ColorLuminance(color, -0.5),
					darker2 = ColorLuminance(color, -0.25),
					lighter1 = ColorLuminance(color, 0.25),
					lighter2 = ColorLuminance(color, 0.5),
					current_color = $('#_pile_project_color').val();


				// in the future save the old color in palette
				//if(typeof(Storage) !== "undefined") {
				//
				//}

				palettes = ['#fff', lighter2, lighter1, color, darker2, darker1, '#000', current_color];

				return palettes;
			};

			$(document).on('mouseup', '#_project_aside .iris-square-inner, #_project_aside .iris-slider-offset, #_project_aside .iris-palette-container', function(){

				var el = $('<input type="hidden" id="_pile_project_color_forced_by_user" name="_pile_project_color_forced_by_user" value="'+ curent_colorpicker.val() +'" />');

				if ( $('#_pile_project_color_forced_by_user').length  == 0 ) {
					project_color.parent().append( el );
				} else {
					$('#_pile_project_color_forced_by_user').val(project_color.val());
				}

			});
		}
	});

	// Redefines jQuery.fn.html() to add custom events that are triggered before and after a DOM element's innerHtml is changed
	// html-change-pre is triggered before the innerHtml is changed
	// html-change-post is triggered after the innerHtml is changed
	var eventName = 'html-change';
	// Save a reference to the original html function
	jQuery.fn.originalHtml = jQuery.fn.html;
	// Let's redefine the html function to include a custom event
	jQuery.fn.html = function() {
		var currentHtml = this.originalHtml();
		if(arguments.length) {
			this.trigger(eventName + '-pre', jQuery.merge([currentHtml], arguments));
			jQuery.fn.originalHtml.apply(this, arguments);
			this.trigger(eventName + '-post', jQuery.merge([currentHtml], arguments));
			return this;
		} else {
			return currentHtml;
		}
	};

})(jQuery);

function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}