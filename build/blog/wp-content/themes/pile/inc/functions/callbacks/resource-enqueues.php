<?php

/**
 * Invoked in wpgrade-config.php
 */
function wpgrade_callback_addthis() {
	//lets determine if we need the addthis script at all
	$social_share = false;
	if ( is_singular() && ( wpgrade::option( 'blog_single_show_share_links' ) || wpgrade::option('portfolio_single_show_share_links') ) ) {
		$social_share = true;
	}
	if ( is_page() ) {
		$social_share = get_post_meta( get_the_ID(), wpgrade::prefix() . 'page_enabled_social_share', true );
		if ( get_page_template() == 'page-templates/contact' ) {
			$social_share = get_post_meta( get_the_ID(), wpgrade::prefix() . 'gmap_enabled_social_share', true );
		}
	}

	if ( $social_share ) {
		wp_enqueue_script( 'addthis-api' );

		//here we will configure the AddThis sharing globally
		get_template_part( 'templates/core/addthis-js-config' );
	}
}

/**
 * Invoked in wpgrade-config.php
 */
function wpgrade_callback_picturefill() {
	//only load the picturefill polyfill if we wants it
	if ( wpgrade::option( 'use_responsive_images' ) ) {
		wp_enqueue_script( 'picturefill' );
	}
}

/**
 * Invoked in wpgrade-config.php
 */
function wpgrade_callback_thread_comments_scripts() {
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}

/**
 * We want the picturefill script using deferred loading (async)
 */
function add_async_to_picturefill( $url )
{
	if ( FALSE === strpos( $url, 'picturefill.min.js' ) ) { // not our file
		return $url;
	}
	// Must be a ', not "!
	return "$url' async='async";
}
add_filter( 'clean_url', 'add_async_to_picturefill', 11, 1 );

/**
 * Invoked in wpgrade-config.php
 */
function wpgrade_callback_enqueue_google_fonts_pile() {
	//load the web fonts loader api - if that is the case
	wpgrade_callback_load_google_fonts_api_pile();

	//put the webfonts config inline script in the head to avoid the FOUT
	add_action( 'wp_head', 'wpgrade_callback_load_google_fonts_config_pile' );
}

/**
 * Load google fonts config script block.
 * This callback is invoked by wpgrade_callback_enqueue_google_fonts_pile
 */
function wpgrade_callback_load_google_fonts_config_pile() {

	$fonts_array = wpgrade::confoption('google_fonts_keys');

	$families = array();
	if ( !empty($fonts_array) ) {
		foreach ( $fonts_array as $font ) {
			$clean_font = wpgrade::get_google_font_name( $font );

			if ( ! empty( $clean_font ) ) {
				$families[] = $clean_font;
			}
		}
	}


	$families = apply_filters( 'wpgrade_google_fonts', $families );

	if ( ! empty( $families ) || is_preview() ) {
		// any variables in scope will be available in the partial
		include wpgrade::themefilepath( 'templates/core/google-fonts-config' . EXT );
	}
}

/**
 * Load google fonts webfonts loader api script.
 * This callback is invoked by wpgrade_callback_enqueue_google_fonts
 */
function wpgrade_callback_load_google_fonts_api_pile() {

	$fonts_array = wpgrade::confoption('google_fonts_keys');

	$families = array();
	foreach ( $fonts_array as $font ) {
		$clean_font = wpgrade::get_google_font_name( $font );

		if ( ! empty( $clean_font ) ) {
			$families[] = $clean_font;
		}
	}

	$families = apply_filters( 'wpgrade_google_fonts', $families );

	if ( ! empty( $families ) || is_preview() ) {
		//only enqueue the api if we actually have webfonts
		wp_enqueue_script('webfont-script');
	}
}

/**
 * This callback is invoked by wpgrade_callback_themesetup.
 */
function wpgrade_callback_enqueue_dynamic_css_pile() {

	if ( wpgrade::option( 'inject_custom_css' ) == 'file' ) {
		wp_enqueue_style( 'wpgrade-custom-style', get_template_directory_uri() . '/assets/css/custom.css' );
	}
}

/**
 * Enqueue the 404 page css
 */
function wpgrade_callback_enqueue_404_css() {
	if (is_404()) {
		wp_enqueue_style( wpgrade::shortname() . '-404-style', get_template_directory_uri() . '/assets/css/pages/404.css', array(), time(), 'all' );
	}
}


/**
 * Enqueue our custom css on admin panel
 */
add_action( 'redux/page/' . wpgrade::shortname() . '_options/enqueue', 'wpgrade_add_admin_custom_style', 0 );
function wpgrade_add_admin_custom_style() {

	wp_enqueue_style( wpgrade::shortname() . '-redux-theme-custom', wpgrade::resourceuri( 'css/admin/admin-panel.css' ), array(), time(), 'all' );

	wp_enqueue_script( 'wp-ajax-response' );

//	wp_enqueue_script( wpgrade::shortname() . '-redux-theme-custom', wpgrade::resourceuri( 'js/admin/admin-panel.js' ), array(), time(), true );
}

/*
 * Enqueue some custom JS in the admin area for various small tasks
 */
add_action('admin_enqueue_scripts','wpgrade_add_admin_general_script');
function wpgrade_add_admin_general_script( $hook ){
	wp_enqueue_script(
		'wpgrade_admin_general_script', //unique handle
		get_template_directory_uri().'/assets/js/admin/admin-general.js', //location
		array('jquery')  //dependencies
	);

	wp_enqueue_style( wpgrade::shortname() . '-admin-general', wpgrade::resourceuri( 'css/admin/admin-general.css' ), array(), time(), 'all' );
}

/**
 * Customize pixbuilder
 */

/*
 * Enqueue some custom JS in the admin area for various small tasks
 */
add_action('admin_enqueue_scripts','wpgrade_add_pix_builder_script');
function wpgrade_add_pix_builder_script( $hook ){

	wp_enqueue_script(
		'wpgrade_pix_builder_custom', //unique handle
		get_template_directory_uri().'/assets/js/admin/pix_builder.js', //location
		array('jquery')  //dependencies
	);

	$gridster_params = wpgrade::confoption('gridster_params');

	if ( !empty($gridster_params) ) {
		wp_localize_script('wpgrade_pix_builder_custom', 'gridster_params', $gridster_params );
	}

	/**
	 * We are gonna create an empty style tag which will be
	 * targeted with jQuery and filled with new gridster css rules
	 * any time the grid is changing values
	 */
	add_action('admin_head', 'add_custom_gridster_style_tag');
	function add_custom_gridster_style_tag() {
		echo '<style id="custom_gridster_style"></style>';
	}
}

/**
 * Add google fonts api into the editor head
 *
 * @output //fonts.googleapis.com/css?family=Oswalt:400:latin
 * @param $opt
 */
function wpgrade_load_google_fonts_in_editor( $opt ) {
	$fonts_array = wpgrade::confoption('google_fonts_keys');
	$link = '';
	if ( !empty($fonts_array) ) {
		foreach ( $fonts_array as $font ) {
			if (!empty($link)) {
				$link.= "%7C"; // Append a new font to the string
			}

			$clean_font = wpgrade::get_google_font_name( $font );

			if ( ! empty( $clean_font ) ) {
				$link .= str_replace( ' ','+', $clean_font ) . '';
			}
		}
	}

	$link = str_replace( '|','%7C', $link );
	add_editor_style( '//fonts.googleapis.com/css?family=' . $link );
}
add_filter('after_setup_theme', 'wpgrade_load_google_fonts_in_editor');

/**
 * add our customizer styling edits into the wp_editor
 */
function add_customizer_settings_into_wp_editor(  ){

	ob_start();
	include wpgrade::corepartial( 'inline-custom-css' . EXT );
	$custom_css = ob_get_clean(); ?>
	<script type="text/javascript">
		/* <![CDATA[ */
		(function($){
			$(window).load(function(){
				/**
				 * @param iframe_id the id of the frame you whant to append the style
				 * @param style_element the style element you want to append
				 */
				var append_style_to_iframe = function( ifrm_id, styleElment ) {
					var ifrm = window.frames[ ifrm_id ];
					ifrm = ( ifrm.contentDocument || ifrm.contentDocument || ifrm.document );;
					var head = ifrm.getElementsByTagName('head')[0];
					head.appendChild(styleElment);
				};

				// Create style element if needed
				var styleElment = document.getElementById('pile_editor_style');

				if (!styleElment) {
					styleElment = document.createElement('style');
					styleElment.id = 'pile_editor_style';
					styleElment.type = 'text/css';
					styleElment.innerHTML = <?php echo json_encode ( $custom_css ); ?>;

					if ( typeof window.frames['content_ifr'] !== 'undefined' ) {
						append_style_to_iframe( 'content_ifr',styleElment );
					} else if ( typeof window.frames['pix_builder_editor_ifr'] !== 'undefined' ) {
						append_style_to_iframe( 'pix_builder_editor_ifr', styleElment );
					}
				}
			});
		})(jQuery);
		/* ]]> */
	</script>
<?php }
add_action('admin_head', 'add_customizer_settings_into_wp_editor', 9999999);