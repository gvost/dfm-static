<?php
/*
 * Get the comma delimited string from Theme Options and generate the a tags that are needed to make AddThis sharing work
 * @package Pile
 * @since   Pile 1.0
 */
$share_buttons_types = wpgrade::option('share_buttons_settings');

if (!empty($share_buttons_types) || $share_buttons_types !== 'false') {
	//lets go through each button type and create the needed markup
	//but first some cleaning - remove all whitespaces
	$share_buttons_types = preg_replace('/\s+/', '', $share_buttons_types);
	//now take each setting
	$buttons = explode(',',$share_buttons_types);
	//the preferred buttons need to have numbering appended to them
	$preferred_count = 0;
	$display_share_buttons = '';
	$display_share_buttons .= '<div class="overlay  overlay-share">' . PHP_EOL;
	$display_share_buttons .= '<div class="overlay-wrap">' . PHP_EOL;
	$display_share_buttons .= '<h2 class="share-title  js-share-destination">' . __( 'Share', wpgrade::textdomain() ) .'</h2>' . PHP_EOL;
	$display_share_buttons .= '<hr class="separator  separator--white"/>' . PHP_EOL;
	$display_share_buttons .= '<ul class="share-icons">' . PHP_EOL;
	if (!empty($buttons)) {
		for ($k = 0; $k < count($buttons); $k++) {
			switch ($buttons[$k]) {
				case 'preferred':
					$preferred_count++;
					$display_share_buttons .= '<li><a class="addthis_button_'.$buttons[$k].'_'.$preferred_count.'"></a></li>' . PHP_EOL;
					break;
				case 'more':
					$display_share_buttons .= '<li><a class="addthis_button_compact"></a></li>' . PHP_EOL;
					break;
				case 'counter':
					$display_share_buttons .= '<li><a class="addthis_counter addthis_bubble_style"></a></li>' . PHP_EOL;
					break;
				default :
					$display_share_buttons .= '<li><a class="addthis_button_'.$buttons[$k].'"></a></li>' . PHP_EOL;
			}
		}
	}
	$display_share_buttons .= '</ul>' . PHP_EOL;
	$display_share_buttons .= '</div>' . PHP_EOL;
	$display_share_buttons .= '</div>' . PHP_EOL;

	echo $display_share_buttons;
} ?>