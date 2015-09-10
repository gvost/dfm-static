<?php

// ensure EXT is defined
if ( ! defined( 'EXT' ) ) {
	define( 'EXT', '.php' );
}

#
# See: wpgrade-config.php -> include-paths for additional theme specific
# function and class includes
#

// ensure REQUEST_PROTOCOL is defined
if ( ! defined('REQUEST_PROTOCOL')) {
	if (is_ssl()) {
		define( 'REQUEST_PROTOCOL', 'https:' );
	} else {
		define( 'REQUEST_PROTOCOL', 'http:' );
	}
}

// Theme specific settings
// -----------------------

// add theme support for post formats
// child themes note: use the after_setup_theme hook with a callback
$formats = array( 'quote', );
add_theme_support( 'post-formats', $formats );

/**
 * Set the content width based on the theme's design and stylesheet.
 */
if ( ! isset( $content_width ) ) {
	$content_width = 1024; /* pixels */
}

// Initialize system core
// ----------------------

require_once 'wpgrade-core/bootstrap' . EXT;

#
# Please perform any initialization via options in wpgrade-config and
# calls in wpgrade-core/bootstrap. Required for testing.
#

add_filter( 'use_default_gallery_style', '__return_false' );

function cc_mime_types($mimes) {
	$mimes['svg'] = 'image/svg+xml';
	return $mimes;
}
add_filter('upload_mimes', 'cc_mime_types');