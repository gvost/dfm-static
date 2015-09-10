<?php

$sections = array();
$debug    = '';

if ( isset( $_GET['debug_mod'] ) && $_GET['debug_mod'] === 'true' ) {
	$debug = 'debug_on';
}

// General Options
// ------------------------------------------------------------------------

$sections[] = array(
	'icon'       => 'icon-database-1',
	'icon_class' => '',
	'title'      => __( 'General', 'pile_txtd' ),
	'desc'       => sprintf( '<p class="description">' . __( 'General settings contains options that have a site-wide reach like defining your site dynamics or branding (including logo and other icons).', 'pile_txtd' ) . '</p>', wpgrade::themename() ),
	'fields'     => array(
		array(
			'id'       => 'use_smooth_scroll',
			'type'     => 'switch',
			'title'    => __( 'Smooth Scrolling', 'pile_txtd' ),
			'subtitle' => __( 'Enable / Disable smooth scrolling.', 'pile_txtd' ),
			'default'  => '1'
		),
		array(
			'id'       => 'use_ajax_loading',
			'type'     => 'switch',
			'title'    => __( 'AJAX Loading', 'pile_txtd' ),
			'subtitle' => __( 'Enable / Disable dynamic page content loading using AJAX.', 'pile_txtd' ),
			'default'  => '1'
		),
		array(
			'id'       => 'enable_copyright_overlay',
			'type'     => 'switch',
			'title'    => __( 'Right-Click Protected ?', 'pile_txtd' ),
			'subtitle' => __( 'Prevent right-click saving for images.', 'pile_txtd' ),
			'default'  => '0',
		),
		array(
			'id'       => 'copyright_overlay_text',
			'type'     => 'text',
			'required' => array( 'enable_copyright_overlay', '=', 1 ),
			'title'    => __( 'Right click protection text', 'pile_txtd' ),
			'default'  => 'This content is &copy; 2014 ' . wpgrade::themename() . ' | All rights reserved.',
		),
		array(
			'id'   => 'branding-header-90821',
			'desc' => '<h3>' . __( 'Branding', 'pile_txtd' ) . '</h3>',
			'type' => 'info'
		),
		array(
			'id'       => 'main_logo_light',
			'type'     => 'media',
			'title'    => __( 'Main Logo (Dark)', 'pile_txtd' ),
			'subtitle' => __( 'If there is no image uploaded, plain text will be used instead (generated from the site\'s name).', 'pile_txtd' ),
		),
		array(
			'id'    => 'main_logo_dark',
			'type'  => 'media',
			'title' => __( 'Logo Inversed (Light)', 'pile_txtd' ),
			'subtitle' => __( 'Upload an inverted color logo.', 'pile_txtd' )
		),
		array(
			'id'       => 'use_retina_logo',
			'type'     => 'switch',
			'title'    => __( '2x Retina Logo', 'pile_txtd' ),
			'subtitle' => __( 'To be Retina-ready you need to add a 2x size logo image.', 'pile_txtd' ),
		),
		array(
			'id'       => 'retina_main_logo_light',
			'type'     => 'media',
			'class'    => 'js-class-hook image--small',
			'title'    => __( '[Retina] Main Logo', 'pile_txtd' ),
			'required' => array( 'use_retina_logo', 'equals', 1 )
		),
		array(
			'id'       => 'retina_main_logo_dark',
			'type'     => 'media',
			'class'    => 'js-class-hook image--small',
			'title'    => __( '[Retina] Logo Inversed', 'pile_txtd' ),
			'required' => array( 'use_retina_logo', 'equals', 1 )
		),
		array(
			'id'       => 'favicon',
			'type'     => 'media',
			'class'    => 'js-class-hook image--small',
			'title'    => __( 'Favicon', 'pile_txtd' ),
			'subtitle' => __( 'Upload a 16 x 16px image that will be used as a favicon.', 'pile_txtd' ),
		),
		array(
			'id'       => 'apple_touch_icon',
			'type'     => 'media',
			'class'    => 'js-class-hook image--small',
			'title'    => __( 'Apple Touch Icon', 'pile_txtd' ),
			'subtitle' => __( 'You can customize the icon for the Apple touch shortcut to your website. The size of this icon must be 77x77px.', 'pile_txtd' )
		),
		array(
			'id'       => 'metro_icon',
			'type'     => 'media',
			'class'    => 'js-class-hook image--small',
			'title'    => __( 'Metro Icon', 'pile_txtd' ),
			'subtitle' => __( 'The size of this icon must be 144x144px.', 'pile_txtd' )
		),
	)
);

// The link to customizer
// ------------------------------------------------------------------------
$sections[] = array(
	'icon'            => "icon-params",
	'icon_class'      => '',
	'class'           => 'has-customizer',
	'title'           => __( 'Style', wpgrade::textdomain() ),
	'desc'            => '<p class="description">' . __( 'The style options control the general styling of the site, like accent color and Google Web Fonts. You can choose custom fonts for various typography elements with font weight, character set, size and/or line height. You also have a live preview for your chosen fonts.', wpgrade::textdomain() ) . '</p>',
	'customizer_only' => false,
	'fields'          => array(
		array(
			'id'         => 'live-customizer-button' . $debug,
			'title'      => '<a href="' . admin_url( "customize.php" ) . '" class="button button-primary" id="live-customizer-button">
							' . __( 'Access the Live Customizer', wpgrade::textdomain() ) . '
						</a>',
			'type'       => 'info',
		),
	)
);

// ------------------------------------------------------------------------
// CUSTOMIZER
// ------------------------------------------------------------------------

// Colors
// ------------------------------------------------------------------------
$sections[] = array(
	'icon'            => "icon-params",
	'icon_class'      => '',
	'class'           => 'has-customizer',
	'title'           => __( 'Colors', 'pile_txtd' ),
	'id'              => 'colors',
	'desc'            => '<p class="description">' . __( 'Using the color pickers you can change the colors of the most important elements. If you want to override the color of some elements you can always use Custom CSS code in Theme Options - Custom Code.', 'pile_txtd' ) . '</p>',
	'customizer_only' => true,
	'type'            => 'customizer_panel',
	'fields'          => array( array('id' => 'legacy', 'title' => '', 'type' => 'info' ) )
);
$sections[] = array(
	'icon'            => "icon-params",
	'icon_class'      => '',
	'class'           => 'has-customizer customizer-only',
	'title'           => __( 'Colors', 'pile_txtd' ),
	'desc'            => '<p class="description">' . __( 'The style options control the general styling of the site, like accent color and Google Web Fonts. You can choose custom fonts for various typography elements with font weight, character set, size and/or line height. You also have a live preview for your chosen fonts.', 'pile_txtd' ) . '</p>',
	'type' => 'customizer_section',
	'in_panel'        => 'colors',
	'fields'          => array(
		array(
			'id'         => 'main_color',
			'type'       => 'color',
			'title'      => __( 'Accent Color', 'pile_txtd' ),
			'subtitle'   => __( 'Use the color picker to change the main color of the site to match your brand color.', 'pile_txtd' ),
			'default'    => '#fa5264',
			'validate'   => 'color',
			'compiler'   => true,
			'customizer' => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'color'            => array(
						'selector' =>
							'h1 em, h2 em, .tabs__nav em, h3 em, h4 em, h5 em, h6 em,
							.tabs__nav a.current, .tabs__nav a:hover,
							a:hover > .pixcode--icon,
							.pixlikes-box.liked i,
							.widget a:hover,
							.widget_blog_subscription input[type="submit"],
							.site-navigation a:hover,
							.site-footer a:hover,
							.cart-widget-details a:hover'
					),
					'background-color' => array(
						'selector' =>
							'.btn:hover, input[type="submit"]:hover, .nav-button:hover,
							.btn--primary,
							.pixcode--icon.square:hover, .pixcode--icon.circle:hover,
							a:hover > .pixcode--icon.circle, a:hover > .pixcode--icon.square,
							.pixlikes-box .likes-text:after,
							.rsNavSelected',
					),
					'border-color'     => array(
						'selector' =>
							'.tabs__nav a.current, .tabs__nav a:hover,
							.widget_blog_subscription input[type="submit"]',
					),
					'border-left-color'     => array(
						'selector' =>
							'.cart-widget-details .wc-forward.checkout:hover:after',
					),
					'outline-color'    => array(
						'selector' =>
							'select:focus, textarea:focus, input[type="text"]:focus, input[type="password"]:focus, input[type="datetime"]:focus, input[type="datetime-local"]:focus, input[type="date"]:focus, input[type="month"]:focus, input[type="time"]:focus, input[type="week"]:focus, input[type="number"]:focus, input[type="email"]:focus, input[type="url"]:focus, input[type="search"]:focus, input[type="tel"]:focus, input[type="color"]:focus, .form-control:focus',
					),
				)
			)
		),
		array(
			'id'         => 'headings_color',
			'type'       => 'color',
			'title'      => __( 'Headings color', 'pile_txtd' ),
			'default'    => '#262526',
			'validate'   => 'color',
			'compiler'   => true,
			'customizer' => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'color' => array(
						'selector' => "h1, h2, h3, h4, h5, h6, h1 a, h2 a, h3 a, h4 a, h5 a, h6 a, .article-archive .article__title a, .article-archive .article__title a:hover"
					),
				)
			)
		),
	)
);

// Backgrounds
// ------------------------------------------------------------------------
$sections[] = array(
	'icon'            => "icon-params",
	'icon_class'      => '',
	'class'           => 'has-customizer',
	'title'           => __( 'Backgrounds', 'pile_txtd' ),
	'id'              => 'backgrounds',
	'customizer_only' => true,
	'type' => 'customizer_panel',
	'fields'          => array( array('id' => 'legacy', 'title' => '', 'type' => 'info' ) )
);
$sections[] = array(
	'icon'            => "icon-params",
	'icon_class'      => '',
	'class'           => 'has-customizer customizer-only',
	'title'           => __( 'Backgrounds', 'pile_txtd' ),
	'type'            => 'customizer_section',
	'in_panel'        => 'backgrounds',
	'fields'          => array(
		array(
			'id'         => 'header_background_color',
			'type'       => 'color',
			'title'      => __( 'Header', 'pile_txtd' ),
			'default'    => '#ffffff',
			'validate'   => 'color',
			'compiler'   => true,
			'customizer' => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'background-color' => array(
						'selector' => ".site-navigation,
						.nav--main ul,
						.nav--main li"
					),
				)
			)
		),
		array(
			'id'               => 'header_image_pattern',
			'type'             => 'customizer_background',
			'title'            => '<button></button>',
			'subtitle'         => __( 'Container background with image.', 'pile_txtd' ),
			'customizer'       => array(
				'transport' => 'refresh',
			),
			'background-color' => false,
			'default'          => array(
				'background-repeat'     => '',
				'background-size'       => '',
				'background-attachment' => '',
				'background-position'   => '',
				'background-image'      => '',
				'media'                 => array(
					'id'        => '',
					'height'    => '',
					'width'     => '',
					'thumbnail' => '',
				)
			),
			'output'           => array( '.panel--navigation' ),
		),
		array(
			'id'         => 'content_background_color',
			'type'       => 'color',
			'title'      => __( 'Content', 'pile_txtd' ),
			'default'    => '#ffffff',
			'validate'   => 'color',
			'compiler'   => true,
			'customizer' => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'background-color' => array(
						'selector' => ".site-content"
					),
				)
			)
		),
		array(
			'id'               => 'container_image_pattern',
			'type'             => 'customizer_background',
			'output'           => array( '.site-content' ),
			'title'            => '<button></button>',
			'subtitle'         => __( 'Container background with image.', 'pile_txtd' ),
			'customizer'       => array(
				'transport' => 'refresh',
			),
			'background-color' => false,
			'default'          => array(
				'background-repeat'     => '',
				'background-size'       => '',
				'background-attachment' => '',
				'background-position'   => '',
				'background-image'      => '',
				'media'                 => array(
					'id'        => '',
					'height'    => '',
					'width'     => '',
					'thumbnail' => '',
				)
			),
		),
		array(
			'id'         => 'footer_background_color',
			'type'       => 'color',
			'title'      => __( 'Footer', 'pile_txtd' ),
			'default'    => '#f9f9f9',
			'validate'   => 'color',
			'compiler'   => true,
			'customizer' => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'background-color' => array(
						'selector' => ".site-footer"
					),
				)
			)
		),
	)
);

// Typography
// ------------------------------------------------------------------------
$sections[] = array(
	'icon'            => "icon-params",
	'icon_class'      => '',
	'class'           => 'has-customizer',
	'title'           => __( 'Typography', 'pile_txtd' ),
	'id'              => 'typography',
	'customizer_only' => true,
	'type' => 'customizer_panel',
	'fields'          => array( array('id' => 'legacy', 'title' => '', 'type' => 'info' ) )
);
$sections[] = array(
	'icon'            => "icon-params",
	'icon_class'      => '',
	'class'           => 'has-customizer customizer-only',
	'title'           => __( 'Typography', 'pile_txtd' ),
	'type'            => 'customizer_section',
	'in_panel'        => 'typography',
	'fields'          => array(
		array(
			'id'       => 'use_google_fonts',
			'type'     => 'switch',
			'title'    => __( 'Do you need custom web fonts?', 'pile_txtd' ),
			'subtitle' => __( 'Tap into the massive <a href="http://www.google.com/fonts/">Google Fonts</a> collection (with Live preview).', 'pile_txtd' ),
			'default'  => '1',
			'compiler' => true,
		),
		// $Titles Font
		array(
			'id'             => 'google_titles_font',
			'type'           => 'customizer_typography',
			'color'          => false,
			'font-size'      => false,
			'line-height'    => false,
			'text-transform' => false,
			'letter-spacing' => false,
			'text-align'     => false,
			'preview'        => false,
			'required'       => array( 'use_google_fonts', '=', 1 ),
			'title'          => '<button></button> ' . __( 'Titles', 'pile_txtd' ),
			'subtitle'       => __( 'Font for titles and headings.', 'pile_txtd' ),
			'compiler'       => true,
			'customizer'     => array(
				'transport' => 'refresh',
			),
			'default'        => array(
				'font-family' => 'Oswald',
				'font-style'  => '400',
				'subset'      => 'latin',
				'google'      => true
			),
			// 'output'         => array( 'h1, h2, h3, h4, h5, h6' ),

		),
		// $Descriptions Font
		array(
			'id'             => 'google_descriptions_font',
			'type'           => 'customizer_typography',
			'color'          => false,
			'font-size'      => false,
			'line-height'    => false,
			'text-transform' => false,
			'letter-spacing' => false,
			'text-align'     => false,
			'preview'        => false,
			'required'       => array( 'use_google_fonts', '=', 1 ),
			'title'          => '<button></button> ' . __( 'Descriptions', 'pile_txtd' ),
			'subtitle'       => __( 'Font for titles and headings.', 'pile_txtd' ),
			'compiler'       => true,
			'customizer'     => array(
				'transport' => 'refresh',
			),
			'default'        => array(
				'font-family' => 'Libre Baskerville',
				'font-style'  => '400',
				'subset'      => 'latin',
				'google'      => true,
			),
			//			'output'         => array( '.headline__secondary' ),
		),

		// $Navigation Font
		array(
			'id'             => 'google_nav_font',
			'type'           => 'customizer_typography',
			'color'          => false,
			'font-size'      => false,
			'line-height'    => false,
			'text-transform' => false,
			'letter-spacing' => false,
			'text-align'     => false,
			'preview'        => false,
			'required'       => array( 'use_google_fonts', '=', 1 ),
			'title'          => '<button></button> ' . __( 'Navigation', 'pile_txtd' ),
			'subtitle'       => __( 'Font for the navigation menu.', 'pile_txtd' ),
			'compiler'       => true,
			'customizer'     => array(
				'transport' => 'refresh',
			),
			'default'        => array(
				'font-family' => 'PT Sans',
				'font-style'  => '400',
				'subset'      => 'latin',
				'google'      => true,
			),
			//			'output'         => array( '.navigation--main' ),

		),
		array(
			'id'            => 'nav_font-size',
			'type'          => 'customizer_slider',
			'title'         => __( 'Font Size', 'pile_txtd' ),
			'validate'      => 'numeric',
			'default'       => '13',
			'min'           => 8,
			'step'          => 1,
			'max'           => 30,
			'display_value' => 'text',
			'customizer'    => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'font-size' => array(
						'selector' => '.nav--main a',
						'unit'     => 'px',
					)
				)
			),
			'compiler'      => true
		),
		array(
			'id'            => 'nav_letter-spacing',
			'type'          => 'customizer_slider',
			'title'         => __( 'Letter Spacing', 'pile_txtd' ),
			'validate'      => 'numeric',
			'default'       => '1',
			'min'           => - 5,
			'step'          => 1,
			'max'           => 20,
			'display_value' => 'text',
			'customizer'    => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'letter-spacing' => array(
						'selector' => '.nav--main a',
						'unit'     => 'px',
					)
				)
			),
			'compiler'      => true
		),
		array(
			'id'            => 'nav_text-transform',
			'type'          => 'select',
			'title'         => __( 'Text Transform', 'pile_txtd' ),
			'options'       => array(
				'none'       => 'None',
				'capitalize' => 'Capitalize',
				'uppercase'  => 'Uppercase',
				'lowercase'  => 'Lowercase',
			),
			'default'       => 'uppercase',
			'select2'       => array( // here you can provide params for the select2 jquery call
				'minimumResultsForSearch' => - 1, // this way the search box will be disabled
				'allowClear'              => false // don't allow a empty select
			),
			'display_value' => 'text',
			'customizer'    => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'text-transform' => array(
						'selector' => '.nav--main a',
					)
				)
			),
			'compiler'      => true
		),
		array(
			'id'            => 'nav_text-decoration',
			'type'          => 'select',
			'title'         => __( 'Text Decoration', 'pile_txtd' ),
			'options'       => array(
				'none'      => 'None',
				'underline' => 'Underline',
				'overline'  => 'Overline',
			),
			'default'       => 'none',
			'select2'       => array( // here you can provide params for the select2 jquery call
				'minimumResultsForSearch' => - 1, // this way the search box will be disabled
				'allowClear'              => true // don't allow a empty select
			),
			'display_value' => 'text',
			'customizer'    => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'text-decoration' => array(
						'selector' => '.nav--main a',
					)
				)
			),
			'compiler'      => true
		),

		// $Body Copy Font
		array(
			'id'             => 'google_body_font',
			'type'           => 'customizer_typography',
			'color'          => false,
			'font-size'      => false,
			'font-style'     => false,
			'font-weight'    => false,
			'line-height'    => false,
			'text-transform' => false,
			'letter-spacing' => false,
			'text-align'     => false,
			'all-styles'     => true,
			'preview'        => false,
			'required'       => array( 'use_google_fonts', '=', 1 ),
			'title'          => '<button></button> ' . __( 'Body Text', 'pile_txtd' ),
			'subtitle'       => __( 'Font for content and widget text.', 'pile_txtd' ),
			'compiler'       => true,
			'customizer'     => array(
				'transport' => 'refresh',
			),
			'default'        => array(
				'font-family' => 'PT Sans',
				'google'      => true,
			),
			//			'output'         => array( 'body' ),
		),
		array(
			'id'            => 'body-font-size',
			'type'          => 'customizer_slider',
			'title'         => __( 'Font Size', 'pile_txtd' ),
			'validate'      => 'numeric',
			'default'       => '16',
			'min'           => 8,
			'step'          => 1,
			'max'           => 72,
			'display_value' => 'text',
			'customizer'    => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'font-size' => array(
						'selector' => 'body, .pile-item',
						'unit'     => 'px',
					)
				)
			),
			'compiler'      => true
		),
		array(
			'id'            => 'body-line-height',
			'type'          => 'customizer_slider',
			'title'         => __( 'Line Height', 'pile_txtd' ),
			'validate'      => 'numeric',
			'default'       => '1.7',
			'min'           => 0,
			'max'           => 3,
			'step'          => .1,
			'resolution'    => 0.1,
			'display_value' => 'text',
			'customizer'    => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'line-height' => array(
						'selector' => 'body',
						'unit'     => '',
					)
				)
			),
			'compiler'      => true
		),
	)
);


// Sizes and Spacing
// ------------------------------------------------------------------------
$sections[] = array(
	'icon'            => "icon-params",
	'icon_class'      => '',
	'class'           => 'has-customizer',
	'title'           => __( 'Sizes and Spacing', 'pile_txtd' ),
	'id'              => 'size-and-pacing',
	'customizer_only' => true,
	'type'            => 'customizer_panel',
	'fields'          => array( array('id' => 'legacy', 'title' => '', 'type' => 'info' ) )
);
$sections[] = array(
	'icon'            => "icon-params",
	'icon_class'      => '',
	'class'           => 'has-customizer customizer-only',
	'title'           => __( 'Sizes and Spacing', 'pile_txtd' ),
	'type'            => 'customizer_section',
	'in_panel'        => 'size-and-pacing',
	'fields'          => array(
		array(
			'id'         => 'sizes_content',
			'title'      => '<label><span class="customize-control-title sizes_section"><button></button>' . __( 'Content', 'pile_txtd' ) . '</span></label>',
			'type'       => 'customizer_info',
			'customizer' => array()
		),
		array(
			'id'            => 'content_width',
			'type'          => 'customizer_slider',
			'title'         => __( 'Site Container Width', 'pile_txtd' ),
			'subtitle'      => __( 'Set the width of the container.', 'pile_txtd' ),
			'validate'      => 'numeric',
			'default'       => '1300',
			'min'           => 600,
			'step'          => 1,
			'max'           => 2700,
			'display_value' => 'text',
			'customizer'    => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'max-width' => array(
						'selector' => '.container',
						'unit'     => 'px',
					)
				)
			),
			'compiler'      => true
		),
//		array(
//			'id'            => 'sidebar_width',
//			'type'          => 'customizer_slider',
//			'title'         => __( 'Sidebar Width', 'pile_txtd' ),
//			'subtitle'      => __( 'Set the width of the sidebar.', 'pile_txtd' ),
//			'validate'      => 'numeric',
//			'default'       => '300',
//			'min'           => 140,
//			'step'          => 10,
//			'max'           => 500,
//			'display_value' => 'text',
//			'customizer'    => array(
//				'transport' => 'postMessage',
//				'css_rules' => array(
//					'width'        => array(
//						'selector' => '.sidebar--main',
//						'unit'     => 'px',
//						'media'    => 'only screen and (min-width: 900px)'
//					),
//					'right'        => array(
//						'selector' => '.page-content.has-sidebar:after',
//						'unit'     => 'px',
//						'media'    => 'only screen and (min-width: 900px)',
//					),
//					'margin-right' => array(
//						'selector'          => '.page-content.has-sidebar .page-content__wrapper',
//						'negative_selector' => '.page-content.has-sidebar',
//						'unit'              => 'px',
//						'media'             => 'only screen and (min-width: 900px)'
//					),
//
//				)
//			),
//			'compiler'      => true
//		),
		array(
			'id'         => 'sizes_header',
			'title'      => '<label><span class="customize-control-title sizes_section"><button></button>' . __( 'Header', 'pile_txtd' ) . '</span></label>',
			'type'       => 'customizer_info',
			'customizer' => array()
		),
		array(
			'id'            => 'header_logo_height',
			'type'          => 'customizer_slider',
			'title'         => __( 'Logo Height', 'pile_txtd' ),
			'validate'      => 'numeric',
			'default'       => '24',
			'min'           => 24,
			'step'          => 1,
			'max'           => 240,
			'display_value' => 'text',
			'class'         => 'small-text',
			'customizer'    => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'max-height' => array(
						'selector' => '.site-title--image img',
						'unit'     => 'px',
					)
				)
			),
			'compiler'      => true
		),
		array(
			'id'            => 'header_height',
			'type'          => 'customizer_slider',
			'title'         => __( 'Header Height', 'pile_txtd' ),
			'validate'      => 'numeric',
			'default'       => '200',
			'min'           => 72,
			'step'          => 1,
			'max'           => 288,
			'display_value' => 'text',
			'class'         => 'small-text',
			'customizer'    => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'height'    => array(
						'selector' => '.header-height',
						'unit'     => 'px'
					),
					'padding-top' => array(
						'selector' => '.title-wrapper',
						'unit'     => 'px'
					),
					'margin-top' => array(
						'selector' => '.has_sidebar .has-no-thumbnail',
						'unit'     => 'px'
					)
				)
			),
			'compiler'      => true
		),
		array(
			'id'            => 'header_offset',
			'type'          => 'customizer_slider',
			'title'         => __( 'Header Offset Width', 'pile_txtd' ),
			'subtitle'      => __( 'Set the horizontal offset of the header.', 'pile_txtd' ),
			'validate'      => 'numeric',
			'default'       => '0',
			'min'           => 0,
			'step'          => 1,
			'max'           => 400,
			'display_value' => 'text',
			'customizer'    => array()
		),
		array(
			'id'         => 'sizes_nav',
			'title'      => '<label><span class="customize-control-title sizes_section"><button></button>' . __( 'Navigation', 'pile_txtd' ) . '</span></label>',
			'type'       => 'customizer_info',
			'customizer' => array()
		),
		array(
			'id'            => 'navigation_menu_items_spacing',
			'type'          => 'customizer_slider',
			'title'         => __( 'Menu Items Spacing', 'pile_txtd' ),
			'validate'      => 'numeric',
			'default'       => 24,
			'min'           => 12,
			'step'          => 1,
			'max'           => 75,
			'display_value' => 'text',
			'customizer'    => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'padding-left'  => array(
						'selector' => '.nav--main > .menu-item > a',
						'unit'     => 'px',
						'media'    => 'screen and (min-width: 900px)'
					),
					'padding-right' => array(
						'selector' => '.nav--main > .menu-item > a',
						'unit'     => 'px',
						'media'    => 'screen and (min-width: 900px)'
					)
				)
			),
			'compiler'      => true
		),
		array(
			'id'         => 'grid_spacing',
			'title'      => '<label><span class="customize-control-title sizes_section"><button></button>' . __( 'Archive Grid', 'pile_txtd' ) . '</span></label>',
			'type'       => 'customizer_info',
			'customizer' => array(
				'transport' => 'postMessage',
			)
		),
		array(
			'id'            => 'pile_horizontal_spacing',
			'type'          => 'customizer_slider',
			'title'         => __( 'Items Horizontal Spacing', 'pile_txtd' ),
			'validate'      => 'numeric',
			'default'       => 36,
			'min'           => 0,
			'step'          => 6,
			'max'           => 75,
			'display_value' => 'text',
			'customizer'    => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'padding-left'  => array(
						'selector' =>
							'.pile-item,' .
							'.pile-item-small-3d .pile-item-even-spacing,' .
							'.pile-item-small-3d .pile-item-portrait-spacing,' .
							'.pile-item-medium-3d .pile-item-even-spacing,' .
							'.pile-item-medium-3d .pile-item-portrait-spacing,' .
							'.pile-item-large-3d .pile-item-even-spacing,' .
							'.pile-item-large-3d .pile-item-portrait-spacing',
						'unit'     => 'px'
					),
					'padding-right' => array(
						'selector' =>
							'.pile-item-small-3d .pile-item-even-spacing,' .
							'.pile-item-small-3d .pile-item-portrait-spacing,' .
							'.pile-item-medium-3d .pile-item-even-spacing,' .
							'.pile-item-medium-3d .pile-item-portrait-spacing,' .
							'.pile-item-large-3d .pile-item-even-spacing,' .
							'.pile-item-large-3d .pile-item-portrait-spacing',
						'unit'     => 'px'
					),

//					'media'    => 'only screen and (min-width: 900px)'
					'margin-left'  => array(
						'negative_selector'  => '.pile',
						'unit'				 => 'px'
					)
				)
			),
			'compiler'      => true
		),
		array(
			'id'            => 'pile_vertical_spacing',
			'type'          => 'customizer_slider',
			'title'         => __( 'Items Vertical Spacing', 'pile_txtd' ),
			'validate'      => 'numeric',
			'default'       => 0,
			'min'           => -100,
			'step'          => 6,
			'max'           => 75,
			'display_value' => 'text',
			'customizer'    => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'margin-bottom'  => array(
						'selector' => '.pile-item',
						'unit'     => 'px'
					),
					'margin-top'  => array(
						'selector' => '.pile',
						'unit'     => 'px'
					),
				)
			),
			'compiler'      => true
		),
		array(
			'id'            => 'parallax_amount',
			'type'          => 'customizer_slider',
			'title'         => __( 'Parallax Scrolling Range', 'pile_txtd' ),
			'subtitle'      => __( 'Set the distance traveled by items on scroll.', 'pile_txtd' ),
			'validate'      => 'numeric',
			'default'       => 35,
			'min'           => 0,
			'step'          => 1,
			'max'           => 100,
			'display_value' => 'text',
			'customizer'    => array()
		),
		array(
			'id'         => 'pile_3d_effect',
			'type'       => 'checkbox',
			'title'      => __( 'Enable 3D Grid', 'pile_txtd' ),
			'default'    => '1',
			'customizer' => array()
		),
		array(
			'id'          => 'pile_large_columns',
			'type'        => 'select',
			'title'       => __( 'Number of columns on big screens', 'pile_txtd' ),
			'subtitle'    => __( 'LARGE screen size', 'pile_txtd' ),
			'options'     => array(
				'1' => '1 column',
				'2' => '2 columns',
				'3' => '3 columns',
				'4' => '4 columns',
				'5' => '5 columns',
				'6' => '6 columns'
			),
			'default'     => '3',
			'customizer' => array()
		),
		array(
			'id'          => 'pile_medium_columns',
			'type'        => 'select',
			'title'       => __( 'Number of columns on medium screens', 'pile_txtd' ),
			'subtitle'    => __( 'MEDIUM screen size', 'pile_txtd' ),
			'options'     => array(
				'1' => '1 column',
				'2' => '2 columns',
				'3' => '3 columns',
				'4' => '4 columns',
				'5' => '5 columns'
			),
			'default'     => '2',
			'customizer' => array()
		),
		array(
			'id'          => 'pile_small_columns',
			'type'        => 'select',
			'title'       => __( 'Number of columns on small screens', 'pile_txtd' ),
			'subtitle'    => __( 'SMALL screen size', 'pile_txtd' ),
			'options'     => array(
				'1' => '1 column',
				'2' => '2 columns',
				'3' => '3 columns'
			),
			'default'     => '1',
			'customizer' => array()
		),
		array(
			'id'         => 'project_spacing',
			'title'      => '<label><span class="customize-control-title sizes_section"><button></button>' . __( 'Project Grid', 'pile_txtd' ) . '</span></label>',
			'type'       => 'customizer_info',
			'customizer' => array(
				'transport' => 'postMessage',
			)
		),
		array(
			'id'            => 'pile_single_horizontal_spacing',
			'type'          => 'customizer_slider',
			'title'         => __( 'Items Horizontal Spacing', 'pile_txtd' ),
			'validate'      => 'numeric',
			'default'       => 60,
			'min'           => 0,
			'step'          => 6,
			'max'           => 120,
			'display_value' => 'text',
			'customizer'    => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'padding-left'  => array(
						'selector' => '.pile--portfolio-single  .pile-item, .pile-item.pile-nav, .pile-item.pile-share',
						'unit'     => 'px'
					),
					'margin-left'  => array(
						'negative_selector'  => '.pile--portfolio-single',
						'unit'				 => 'px'
					)
				)
			),
			'compiler'      => true
		),
		array(
			'id'            => 'pile_single_vertical_spacing',
			'type'          => 'customizer_slider',
			'title'         => __( 'Items Vertical Spacing', 'pile_txtd' ),
			'validate'      => 'numeric',
			'default'       => 60,
			'min'           => 0,
			'step'          => 6,
			'max'           => 120,
			'display_value' => 'text',
			'customizer'    => array(
				'transport' => 'postMessage',
				'css_rules' => array(
					'margin-bottom'  => array(
						'selector' => '.pile--portfolio-single  .pile-item, .pile-item.pile-nav, .pile-item.pile-share',
						'unit'     => 'px'
					),
					'margin-top'  => array(
						'selector' => '.pile--portfolio-single',
						'unit'     => 'px'
					),
				)
			),
			'compiler'      => true
		),
	)
);

// Other Options
// ------------------------------------------------------------------------
$sections[] = array(
	'icon'            => "icon-params",
	'icon_class'      => '',
	'class'           => 'has-customizer',
	'title'           => __( 'Other Options', 'pile_txtd' ),
	'id'              => 'general-options',
	'customizer_only' => true,
	'type' => 'customizer_panel',
	'fields'          => array( array('id' => 'legacy', 'title' => '', 'type' => 'info' ) )
);
$sections[] = array(
	'icon'            => "icon-params",
	'icon_class'      => '',
	'class'           => 'has-customizer customizer-only',
	'title'           => __( 'General Options', 'pile_txtd' ),
	'type'            => 'customizer_section',
	'in_panel'        => 'general-options',
	'fields'          => array(
		array(
			'id'              => 'options_elements',
			'title'           => '<label><span class="customize-control-title sizes_section"><button></button>' . __( 'Elements', 'pile_txtd' ) . '</span></label>',
			'type'            => 'customizer_info',
			//			'customizer_only' => true,
			'customizer'      => array()
		),
		array(
			'id'          => 'slideshow_arrows_style',
			'type'        => 'select',
			'title'       => __( 'Slideshow Arrows Style', 'pile_txtd' ),
			'subtitle'    => __( 'Select which type of arrows you want on page headers.', 'pile_txtd' ),
			'options'     => array(
				'static' => 'Always Show',
				'hover'  => 'On Hover'
			),
			'default'     => 'hover',
			'select2'    => array( // here you can provide params for the select2 jquery call
				'minimumResultsForSearch' => - 1, // this way the search box will be disabled
				'allowClear'              => false // don't allow a empty select
			),
			'customizer' => array()
		),
		array(
			'id'         => 'hero_scroll_arrow',
			'type'       => 'checkbox',
			'title'      => __( 'Show Scroll Down Arrows', 'pile_txtd' ),
			'default'    => 1,
			'customizer' => array()
		),
		array(
			'id'         => 'nav_bar',
			'title'      => '<label><span class="customize-control-title sizes_section"><button></button>' . __( 'Navigation Bar', 'pile_txtd' ) . '</span></label>',
			'type'       => 'customizer_info',
			//			'customizer_only' => true,
			'customizer' => array()
		),
		array(
			'id'         => 'nav_show_scroll',
			'type'       => 'checkbox',
			'title'      => __( 'Always Show on Scroll (Sticky)', 'pile_txtd' ),
			'default'    => 1,
			'customizer' => array()
		),
		array(
			'id'         => 'nav_show_always',
			'type'       => 'checkbox',
			'title'      => __( 'Always Show Menu Items', 'pile_txtd' ),
			'default'    => 0,
			'customizer' => array()
		),
		array(
			'id'         => 'nav_menu_layout',
			'type'       => 'select',
			'title'      => __( 'Menu Trigger Style', 'pile_txtd' ),
			'options'    => array(
				'icon' 		=> '☰ 		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Icon',
				'text-icon' => 'Menu ☰ 	&nbsp;&nbsp;&nbsp; Text + Icon',
				'text'  	=> 'Menu 	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Text'
			),
			'default'    => 'icon',
			'select2'    => array( // here you can provide params for the select2 jquery call
				'minimumResultsForSearch' => - 1, // this way the search box will be disabled
				'allowClear'              => false // don't allow a empty select
			),
			'required'   => array( 'nav_show_always', '=', 1 ),
			'customizer' => array()
		),
		array(
			'id'         => 'nav_menu_text',
			'type'       => 'text',
			'title'      => __( 'Menu Text', 'pile_txtd' ),
			'default'    => 'Menu',
			'required'   => array( 'nav_show_always', '=', 1 ),
			'customizer' => array()
		)
	)
);


// Reset Button
// ------------------------------------------------------------------------
$sections[] = array(
	'icon'            => "icon-params",
	'icon_class'      => '',
	'class'           => 'has-customizer',
	'title'           => __( 'Reset Options', 'pile_txtd' ),
	'customizer_only' => true,
	'priority'		  => 9999,
	'fields'          => array(
		array(
			'id'         => 'customizer_reset_button_section',
			'title'      => '<a class="btn" id="reset-style-defaults" href="#" data-ajax_nonce="' . wp_create_nonce( "reset-style-section" ) . '">' . __( 'Reset to Defaults', 'pile_txtd' ) . '</a>',
			'type'       => 'customizer_info',
			'customizer' => array()
		)
	)
);

// Header/Footer Options
// ------------------------------------------------------------------------

$sections[] = array(
	'icon'   => 'icon-note-1',
	'title'  => __( 'Footer', 'pile_txtd' ),
	'desc'   => '<p class="description">' . __( 'Footer options allow you to control both the visual and functional aspects of the page footer area.', 'pile_txtd' ) . '</p>',
	'fields' => array(
		array(
			'id'          => 'footer_number_of_columns',
			'type'        => 'select',
			'title'       => __( 'Widget Area Number of Columns', 'pile_txtd' ),
			'subtitle'    => __( 'Select how many number of columns should the Footer widget area have.', 'pile_txtd' ),
			'options'     => array(
				'1' => '1',
				'2' => '2',
				'3' => '3',
				'4' => '4',
				'6' => '6',
			),
			'default'     => '2',
			'placeholder' => __( 'Select the number of columns', 'pile_txtd' ),
			'select2'     => array( // here you can provide params for the select2 jquery call
				'minimumResultsForSearch' => - 1, // this way the search box will be disabled
				'allowClear'              => false // don't allow a empty select
			),
		),
		array(
			'id'          => 'footer_column_width',
			'type'        => 'select',
			'title'       => __( 'Widget Column width', 'pile_txtd' ),
			'options'     => array(
				'one-third'  => 'One third',
				'two-thirds' => 'Two thirds',
				'one-whole'  => 'Whole',
			),
			'default'     => 'one_third',
			'placeholder' => __( 'Select the widget width', 'pile_txtd' ),
			'select2'     => array( // here you can provide params for the select2 jquery call
				'minimumResultsForSearch' => - 1, // this way the search box will be disabled
				'allowClear'              => false // don't allow a empty select
			),
			'required'    => array( 'footer_number_of_columns', '=', 1 ),
		),
		array(
			'id'       => 'copyright_text',
			'type'     => 'editor',
			'title'    => __( 'Copyright Text', 'pile_txtd' ),
			'subtitle' => sprintf( __( 'Text that will appear in bottom left area (eg. Copyright 2014 %s | All Rights Reserved).', 'pile_txtd' ), wpgrade::themename() ),
			'default'  => '2014 &copy; Handcrafted with love by <a href="#">PixelGrade</a> Team',
			'rows'     => 3,
		)

	)
);

$sections[] = array(
	'type' => 'divide',
);

// Single Project Options
// ------------------------------------------------------------------------

$sections[] = array(
	'icon'   => 'icon-note-1',
	'title'  => __( 'Portfolio', 'pile_txtd' ),
	'desc'   => '<p class="description">' . __( 'Project options control the various aspects related to the your single project view.', 'pile_txtd' ) . '</p>',
	'fields' => array(
		array(
			'id'   => 'project-page-title',
			'desc' => '<h3>' . __( 'Project Page') . '</h3>',
			'type' => 'info'
		),
		array(
			'id'       => 'portfolio_single_show_meta',
			'type'     => 'checkbox',
			'title'    => __( 'Meta', 'pile_txtd' ),
			'subtitle' => __( 'Show project categories under the title.', 'pile_txtd' ),
			'default'  => '1',
		),
		array(
			'id'       => 'portfolio_single_show_next_prev',
			'type'     => 'checkbox',
			'title'    => __( 'Show Next/Prev', 'pile_txtd' ),
			'subtitle' => __( 'Do you want to show the next and previous project links?', 'pile_txtd' ),
			'default'  => '1',
		),
		array(
			'id'       => 'portfolio_single_show_share_links',
			'type'     => 'checkbox',
			'title'    => __( 'Show Share Link', 'pile_txtd' ),
			'subtitle' => __( 'Do you want to show share icon popup for your projects?', 'pile_txtd' ),
			'default'  => '1',
		),
	)
);

// Blog Archives Options
// ------------------------------------------------------------------------

$sections[] = array(
	'icon'   => 'icon-pencil-1',
	'title'  => __( 'Blog - Archive', 'pile_txtd' ),
	'desc'   => '<p class="description">' . __( 'Archive options control the various aspects related to displaying posts in blog archives. You can control things like excerpt length and various layout aspects.', 'pile_txtd' ) . '</p>',
	'fields' => array(
		array(
			'id'       => 'blog_read_more_text',
			'type'     => 'text',
			'title'    => __( 'Read More Text', 'pile_txtd' ),
			'subtitle' => __( 'Set the read more link text.', 'pile_txtd' ),
			'default'  => 'Read more',
		),
		array(
			'id'       => 'blog_excerpt_more_text',
			'type'     => 'text',
			'title'    => __( 'Excerpt "More" Text', 'pile_txtd' ),
			'subtitle' => __( 'Change the default [...] with something else.', 'pile_txtd' ),
			'default'  => '..',
		),
		array(
			'id'       => 'blog_excerpt_length',
			'type'     => 'text',
			'title'    => __( 'Excerpt Length', 'pile_txtd' ),
			'subtitle' => __( 'Set the number of characters for posts excerpt.', 'pile_txtd' ),
			'default'  => '105',
		),
		array(
			'id'   => 'posts_meta_data-218293204',
			'desc' => '<h4>' . __( 'Posts Meta Informations', 'pile_txtd' ) . '</h4>',
			'type' => 'info'
		),
		array(
			'id'       => 'blog_show_date',
			'type'     => 'checkbox',
			'title'    => __( 'Date', 'pile_txtd' ),
			'subtitle' => __( 'Display the post publish date.', 'pile_txtd' ),
			'default'  => '1',
		),
	)
);

$sections[] = array(
	'icon'   => 'icon-pencil-1',
	'title'  => __( 'Blog - Single', 'pile_txtd' ),
	'desc'   => '<p class="description">' . __( 'Post options control the various aspects related to the <b>single post page</b>.', 'pile_txtd' ) . '</p>',
	'fields' => array(
		// array(
		// 	'id'       => 'blog_single_show_author_box',
		// 	'type'     => 'switch',
		// 	'title'    => __( 'Show Author Info Box', 'pile_txtd' ),
		// 	'subtitle' => __( 'Do you want to show author info box with avatar and description bellow the post?', 'pile_txtd' ),
		// 	'default'  => true,
		// ),
		array(
			'id'   => 'posts_share-links-812329384',
			'desc' => '<h4>' . __( 'Share Links', 'pile_txtd' ) . '</h4>',
			'type' => 'info'
		),
		array(
			'id'       => 'blog_single_show_share_links',
			'type'     => 'switch',
			'title'    => __( 'Show Share Links', 'pile_txtd' ),
			'subtitle' => __( 'Do you want to show share icon links for your articles?', 'pile_txtd' ),
			'default'  => true,
		),
		array(
			'id'   => 'posts_comments-812329384',
			'desc' => '<h4>' . __( 'Comments', 'pile_txtd' ) . '</h4>',
			'type' => 'info'
		),
		array(
			'id'       => 'comments_show_avatar',
			'type'     => 'switch',
			'title'    => __( 'Show Comments Avatars', 'pile_txtd' ),
			'subtitle' => __( 'Do you want to show avatars in comments?', 'pile_txtd' ),
			'default'  => false,
		),
		array(
			'id'       => 'comments_show_numbering',
			'type'     => 'switch',
			'title'    => __( 'Show Comments Numbers', 'pile_txtd' ),
			'subtitle' => __( 'Do you want to show numbers beside each comment?', 'pile_txtd' ),
			'default'  => true,
		),
		array(
			'id'   => 'posts_sidebar-812329384',
			'desc' => '<h4>' . __( 'Sidebar', 'pile_txtd' ) . '</h4>',
			'type' => 'info'
		),
		array(
			'id'       => 'blog_single_show_sidebar',
			'type'     => 'switch',
			'title'    => __( 'Show Sidebar', 'pile_txtd' ),
			'subtitle' => __( 'Show the main sidebar in the single post pages.', 'pile_txtd' ),
			'default'  => '0',
			'switch'   => true,
		),
	)
);

$sections[] = array(
	'type' => 'divide',
);

// Social and SEO options
// ------------------------------------------------------------------------

$sections[] = array(
	'icon'       => "icon-thumbs-up-1",
	'icon_class' => '',
	'title'      => __( 'Social and SEO', 'pile_txtd' ),
	'desc'       => '<p class="description">' . __( 'Social and SEO options allow you to display your social links and choose where to display them. Then you can set the social SEO related info added in the meta tags or used in various widgets.', 'pile_txtd' ) . '</p>',
	'fields'     => array(
		array(
			'id'   => 'header_layout-218293203',
			'desc' => '<h3>' . __( 'Sharing', 'pile_txtd' ) . '</h3>',
			'type' => 'info'
		),
		//		array(
		//			'id' => 'share_buttons_settings',
		//			'type' => 'select',
		//			'title' => __('Share Services', 'pile_txtd'),
		//			'subtitle' => __('Add here the share services you want to use, single comma delimited (no spaces). You can find the full list of services here: <a href="http://www.addthis.com/services/list">http://www.addthis.com/services/list</a>. Also you can use the <strong>more</strong> tag to show the plus sign and the <strong>counter</strong> tag to show a global share counter.<br/><br/>Important: If you want to allow AddThis to show your visitors personalized lists of share buttons you can use the <strong>preferred</strong> tag. More about this here: <a href="http://bit.ly/1fLP69i">http://bit.ly/1fLP69i</a>.', 'pile_txtd'),
		//			'default' => 'more,preferred,preferred,preferred,preferred',
		//			'options'  => array(
		//				'more' => 'More Button',
		//				'preferred' => 'Preferred',
		//				'facebook' => 'Facebook',
		//				'twitter' => 'Twitter',
		//				'google_plusone_share' => 'Google+',
		//				'google' => 'Google Bookmarks',
		//				'pinterest_share' => 'Pinterest',
		//				'linkedin' => 'LinkedIn',
		//				'sinaweibo' => 'Sina Weibo',
		//				'baidu' => 'Baidu',
		//				'chimein' => 'Chime.In',
		//				'classicalplace' => 'ClassicalPlace',
		//				'cndig' => 'Cndig',
		//				'technerd' => 'TechNerd',
		//				'delicious' => 'Delicious',
		//				'digg' => 'Digg',
		//				'diigo' => 'Diigo',
		//				'dosti' => 'Dosti',
		//				'douban' => 'Douban',
		//				'draugiem' => 'Draugiem.lv',
		//				'dudu' => 'dudu',
		//				'dzone' => 'dzone',
		//				'efactor' => 'EFactor',
		//				'ekudos' => 'eKudos',
		//				'elefantapl' => 'elefanta.pl',
		//				'email' => 'Email',
		//				'mailto' => 'Email App',
		//				'embarkons' => 'Embarkons',
		//				'evernote' => 'Evernote',
		//				'extraplay' => 'extraplay',
		//				'fabulously40' => 'Fabulously40',
		//				'farkinda' => 'Farkinda',
		//				'favable' => 'FAVable',
		//				'faves' => 'Fave',
		//				'favlogde' => 'favlog',
		//				'favoritende' => 'Favoriten.de',
		//				'favorites' => 'Favorites',
		//				'favoritus' => 'Favoritus',
		//				'financialjuice' => 'financialjuice',
		//				'flaker' => 'Flaker',
		//				'folkd' => 'Folkd',
		//				'formspring' => 'Formspring',
		//				'fresqui' => 'Fresqui',
		//				'friendfeed' => 'FriendFeed',
		//				'funp' => 'funP',
		//				'fwisp' => 'fwisp',
		//				'gabbr' => 'Gabbr',
		//				'gamekicker' => 'Gamekicker',
		//				'gg' => 'GG',
		//				'givealink' => 'GiveALink',
		//				'gmail' => 'Gmail',
		//				'govn' => 'Go.vn',
		//				'goodnoows' => 'Good Noows',
		//				'greaterdebater' => 'GreaterDebater',
		//				'hackernews' => 'Hacker News',
		//				'gluvsnap' => 'Healthimize',
		//				'hedgehogs' => 'Hedgehogs.net',
		//				'historious' => 'Historious',
		//				'hotklix' => 'Hotklix',
		//				'hotmail' => 'Hotmail',
		//				'identica' => 'Identica',
		//				'ihavegot' => 'ihavegot',
		//				'index4' => 'Index4',
		//				'instapaper' => 'Instapaper',
		//				'iorbix' => 'iOrbix',
		//				'irepeater' => 'IRepeater.Share',
		//				'isociety' => 'iSociety',
		//				'iwiw' => 'iWiW',
		//				'jamespot' => 'Jamespot',
		//				'jappy' => 'Jappy Ticker',
		//				'jolly' => 'Jolly',
		//				'jumptags' => 'Jumptags',
		//				'kaevur' => 'Kaevur',
		//				'kaixin' => 'Kaixin Repaste',
		//				'ketnooi' => 'Ketnooi',
		//				'kledy' => 'Kledy',
		//				'kommenting' => 'Kommenting',
		//				'latafaneracat' => 'La tafanera',
		//				'librerio' => 'Librerio',
		//				'lidar' => 'LiDAR Online',
		//				'linksgutter' => 'Links Gutter',
		//				'linkshares' => 'LinkShares',
		//				'linkuj' => 'Linkuj.cz',
		//				'lockerblogger' => 'LockerBlogger',
		//				'logger24' => 'Logger24.com',
		//				'mymailru' => 'Mail.ru',
		//				'margarin' => 'mar.gar.in',
		//				'markme' => 'Markme',
		//				'mashant' => 'Mashant',
		//				'mashbord' => 'Mashbord',
		//				'me2day' => 'me2day',
		//				'meinvz' => 'meinVZ',
		//				'mekusharim' => 'Mekusharim',
		//				'memori' => 'Memori.ru',
		//				'meneame' => 'Menéame',
		//				'live' => 'Messenger',
		//				'misterwong' => 'Mister Wong',
		//				'misterwong_de' => 'Mister Wong DE',
		//				'mixi' => 'Mixi',
		//				'moemesto' => 'Moemesto.ru',
		//				'moikrug' => 'Moikrug',
		//				'mrcnetworkit' => 'mRcNEtwORK',
		//				'myspace' => 'Myspace',
		//				'myvidster' => 'myVidster',
		//				'n4g' => 'N4G',
		//				'naszaklasa' => 'Nasza-klasa',
		//				'netlog' => 'NetLog',
		//				'netvibes' => 'Netvibes',
		//				'netvouz' => 'Netvouz',
		//				'newsmeback' => 'NewsMeBack',
		//				'newstrust' => 'NewsTrust',
		//				'newsvine' => 'Newsvine',
		//				'nujij' => 'Nujij',
		//				'odnoklassniki_ru' => 'Odnoklassniki',
		//				'oknotizie' => 'OKNOtizie',
		//				'openthedoor' => 'OpenTheDoor',
		//				'orkut' => 'orkut',
		//				'oyyla' => 'Oyyla',
		//				'packg' => 'Packg',
		//				'pafnetde' => 'pafnet.de',
		//				'phonefavs' => 'PhoneFavs',
		//				'plaxo' => 'Plaxo',
		//				'plurk' => 'Plurk',
		//				'pocket' => 'Pocket',
		//				'posteezy' => 'Posteezy',
		//				'posterous' => 'Posterous',
		//				'print' => 'Print',
		//				'printfriendly' => 'PrintFriendly',
		//				'pusha' => 'Pusha',
		//				'qrfin' => 'QRF.in',
		//				'qrsrc' => 'QRSrc.com',
		//				'qzone' => 'Qzone',
		//				'reddit' => 'Reddit',
		//				'rediff' => 'Rediff MyPage',
		//				'redkum' => 'RedKum',
		//				'researchgate' => 'ResearchGate',
		//				'scoopat' => 'Scoop.at',
		//				'scoopit' => 'Scoop.it',
		//				'sekoman' => 'Sekoman',
		//				'select2gether' => 'Select2Gether',
		//				'shaveh' => 'Shaveh',
		//				'shetoldme' => 'SheToldMe',
		//				'smiru' => 'SMI',
		//				'sonico' => 'Sonico',
		//				'spinsnap' => 'SpinSnap',
		//				'yiid' => 'Spread.ly',
		//				'springpad' => 'springpad',
		//				'startaid' => 'Startaid',
		//				'startlap' => 'Startlap',
		//				'storyfollower' => 'Story Follower',
		//				'studivz' => 'studiVZ',
		//				'stumbleupon' => 'StumbleUpon',
		//				'sulia' => 'Sulia',
		//				'sunlize' => 'Sunlize',
		//				'surfingbird' => 'Surfingbird',
		//				'svejo' => 'Svejo',
		//				'taaza' => 'Taaza',
		//				'tagza' => 'Tagza',
		//				'taringa' => 'Taringa!',
		//				'textme' => 'Textme SMS',
		//				'thewebblend' => 'The Web Blend',
		//				'thinkfinity' => 'Thinkfinity',
		//				'topsitelernet' => 'TopSiteler',
		//				'tuenti' => 'Tuenti',
		//				'tulinq' => 'Tulinq',
		//				'tumblr' => 'Tumblr',
		//				'tvinx' => 'Tvinx',
		//				'typepad' => 'Typepad',
		//				'upnews' => 'Upnews.it',
		//				'urlaubswerkde' => 'Urlaubswerk',
		//				'visitezmonsite' => 'Visitez Mon Site',
		//				'vk' => 'Vkontakte',
		//				'vkrugudruzei' => 'vKruguDruzei',
		//				'vybralisme' => 'vybrali SME',
		//				'wanelo' => 'Wanelo',
		//				'sharer' => 'WebMoney.Events',
		//				'webnews' => 'Webnews',
		//				'webshare' => 'WebShare',
		//				'werkenntwen' => 'Wer Kennt Wen',
		//				'wirefan' => 'WireFan',
		//				'wowbored' => 'WowBored',
		//				'wykop' => 'Wykop',
		//				'xanga' => 'Xanga',
		//				'xing' => 'Xing',
		//				'yahoobkm' => 'Y! Bookmarks',
		//				'yahoomail' => 'Y! Mail',
		//				'yammer' => 'Yammer',
		//				'yardbarker' => 'Yardbarker',
		//				'yigg' => 'Yigg',
		//				'yookos' => 'Yookos',
		//				'yoolink' => 'Yoolink',
		//				'yorumcuyum' => 'Yorumcuyum',
		//				'youmob' => 'YouMob',
		//				'yuuby' => 'Yuuby',
		//				'zakladoknet' => 'Zakladok.net',
		//				'ziczac' => 'ZicZac',
		//				'zingme' => 'ZingMe',
		//
		//
		//			),
		////			'sortable' => true,
		//			'multi' => true,
		//			'select2' => array( // here you can provide params for the select2 jquery call
		//				'minimumResultsForSearch' => 1,
		//				'allowClear' => true, // don't allow a empty select
		//				//'separator' => ','
		//			)
		//		),
		array(
			'id'       => 'share_buttons_settings',
			'type'     => 'text',
			'title'    => __( 'Share Services', 'pile_txtd' ),
			'subtitle' => __( 'Add here the share services you want to use, single comma delimited (no spaces). You can find the full list of services here: <a href="http://www.addthis.com/services/list">http://www.addthis.com/services/list</a>. Also you can use the <strong>more</strong> tag to show the plus sign and the <strong>counter</strong> tag to show a global share counter.<br/><br/>Important: If you want to allow AddThis to show your visitors personalized lists of share buttons you can use the <strong>preferred</strong> tag. More about this here: <a href="http://bit.ly/1fLP69i">http://bit.ly/1fLP69i</a>.', 'pile_txtd' ),
			'default'  => 'preferred,preferred,preferred,preferred,more',
		),
		array(
			'id'       => 'share_buttons_enable_tracking',
			'type'     => 'switch',
			'title'    => __( 'Sharing Analytics', 'pile_txtd' ),
			'subtitle' => __( 'Do you want to get analytics for your social shares?', 'pile_txtd' ),
			'default'  => '0',
		),
		array(
			'id'       => 'share_buttons_enable_addthis_tracking',
			'type'     => 'switch',
			'title'    => __( 'AddThis Tracking', 'pile_txtd' ),
			'subtitle' => __( 'Do you want to enable AddThis tracking? This will all you to see sharing analytics in your AddThis account (see more here: <a href="http://bit.ly/1oe5zad">bit.ly/1oe5zad</a>)', 'pile_txtd' ),
			'default'  => '0',
			'required' => array( 'share_buttons_enable_tracking', '=', 1 ),
		),
		array(
			'id'       => 'share_buttons_addthis_username',
			'type'     => 'text',
			'title'    => __( 'AddThis Username', 'pile_txtd' ),
			'subtitle' => __( 'Enter here your AddThis username so you will receive analytics data.', 'pile_txtd' ),
			'default'  => '',
			'required' => array( 'share_buttons_enable_addthis_tracking', '=', 1 ),
		),
		array(
			'id'       => 'share_buttons_enable_ga_tracking',
			'type'     => 'switch',
			'title'    => __( 'Google Analytics Tracking', 'pile_txtd' ),
			'subtitle' => __( 'Do you want to enable the AddThis - Google Analytics tracking integration? See more about this here: <a href="http://bit.ly/1kxPg7K">bit.ly/1kxPg7K</a>', 'pile_txtd' ),
			'default'  => '0',
			'required' => array( 'share_buttons_enable_tracking', '=', 1 ),
		),
		array(
			'id'       => 'share_buttons_ga_id',
			'type'     => 'text',
			'title'    => __( 'GA Property ID', 'pile_txtd' ),
			'subtitle' => __( 'Enter here your GA property ID (generally a serial number of the form UA-xxxxxx-x).', 'pile_txtd' ),
			'default'  => '',
			'required' => array( 'share_buttons_enable_ga_tracking', '=', 1 ),
		),
		array(
			'id'       => 'share_buttons_enable_ga_social_tracking',
			'type'     => 'switch',
			'title'    => __( 'GA Social Tracking', 'pile_txtd' ),
			'subtitle' => __( 'If you are using the latest version of GA code, you can take advantage of Google\'s new <a href="http://bit.ly/1iVvkbk">social interaction analytics</a>.', 'pile_txtd' ),
			'default'  => '0',
			'required' => array( 'share_buttons_enable_ga_tracking', '=', 1 ),
		),
		array(
			'id'   => 'header_layout-218293203',
			'desc' => '<h3>' . __( 'Social Metas', 'pile_txtd' ) . '</h3>',
			'type' => 'info'
		),
		array(
			'id'       => 'prepare_for_social_share',
			'type'     => 'switch',
			'title'    => __( 'Add Social Meta Tags', 'pile_txtd' ),
			'subtitle' => __( 'Let us properly prepare your theme for the social sharing and discovery by adding the needed metatags in the <head> section. These include Open Graph (Facebook), Google+ and Twitter metas.', 'pile_txtd' ),
			'default'  => '1',
		),
		array(
			'id'       => 'facebook_id_app',
			'type'     => 'text',
			'title'    => __( 'Facebook Application ID', 'pile_txtd' ),
			'subtitle' => __( 'Enter the Facebook Application ID of the Fan Page which is associated with this website. You can create one <a href="https://developers.facebook.com/apps">here</a>.', 'pile_txtd' ),
			'required' => array( 'prepare_for_social_share', '=', 1 )
		),
		array(
			'id'       => 'facebook_admin_id',
			'type'     => 'text',
			'title'    => __( 'Facebook Admin ID', 'pile_txtd' ),
			'subtitle' => __( 'The id of the user that has administrative privileges to your Facebook App so you can access the <a href="https://www.facebook.com/insights/">Facebook Insights</a>.', 'pile_txtd' ),
			'required' => array( 'prepare_for_social_share', '=', 1 )
		),
		array(
			'id'       => 'google_page_url',
			'type'     => 'text',
			'title'    => __( 'Google+ Publisher', 'pile_txtd' ),
			'subtitle' => __( 'Enter your Google Plus page ID (example: https://plus.google.com/<b>105345678532237339285</b>) here if you have set up a "Google+ Page".', 'pile_txtd' ),
			'required' => array( 'prepare_for_social_share', '=', 1 )
		),
		array(
			'id'                => 'twitter_card_site',
			'type'              => 'text',
			'title'             => __( 'Twitter Site Username', 'pile_txtd' ),
			'subtitle'          => __( 'The Twitter username of the entire site. The username for the author will be taken from the author\'s profile', 'pile_txtd' ),
			'required'          => array( 'prepare_for_social_share', '=', 1 ),
			'validate_callback' => 'wpgrade_trim_twitter_username'
		),
		array(
			'id'    => 'social_share_default_image',
			'type'  => 'media',
			'title' => __( 'Default Social Share Image', 'pile_txtd' ),
			'desc'  => __( 'If an image is uploaded, this will be used for content sharing if you don\'t upload a custom image with your content (at least 200px wide recommended).', 'pile_txtd' ),
		),
		array(
			'id'       => 'remove_parameters_from_static_res',
			'type'     => 'switch',
			'title'    => __( 'Clean Static Files URL', 'pile_txtd' ),
			'subtitle' => __( 'Do you want us to remove the version parameters from static resources so they can be cached better?', 'pile_txtd' ),
			'default'  => '0',
		),
		//		array(
		//			'id' => 'move_jquery_to_footer',
		//			'type' => 'switch',
		//			'title' => __('Move JS Files To Footer', 'pile_txtd'),
		//			'subtitle' => __('This will force jQuery and all other files to be included just before the body closing tag. Please note that this can break some plugins so use it wisely.', 'pile_txtd'),
		//			'default' => '0',
		//		),
	)
);

// Custom Code
// ------------------------------------------------------------------------

$sections[] = array(
	'icon'       => "icon-database-1",
	'icon_class' => '',
	'title'      => __( 'Custom Code', 'pile_txtd' ),
	'desc'       => '<p class="description">' . __( 'You can change the site style and behaviour by adding custom scripts to all pages within your site using the custom code areas below.', 'pile_txtd' ) . '</p>',
	'fields'     => array(
		array(
			'id'       => 'custom_css',
			'type'     => 'ace_editor',
			'title'    => __( 'Custom CSS', 'pile_txtd' ),
			'subtitle' => __( 'Enter your custom CSS code. It will be included in the head section of the page and will overwrite the main CSS styling.', 'pile_txtd' ),
			'desc'     => __( '', 'pile_txtd' ),
			'mode'     => 'css',
			'theme'    => 'chrome',
			//'validate' => 'html',
			'compiler' => true
		),
		array(
			'id'       => 'inject_custom_css',
			'type'     => 'select',
			'title'    => __( 'Apply Custom CSS', 'pile_txtd' ),
			'subtitle' => sprintf( __( 'Select how to insert the custom CSS into your pages.', 'pile_txtd' ), wpgrade::themename() ),
			'default'  => 'inline',
			'options'  => array(
				'inline' => __( 'Inline <em>(recommended)</em>', 'pile_txtd' ),
				'file'   => __( 'Write To File (might require file permissions)', 'pile_txtd' )
			),
			'select2'  => array( // here you can provide params for the select2 jquery call
				'minimumResultsForSearch' => - 1, // this way the search box will be disabled
				'allowClear'              => false // don't allow a empty select
			),
			'compiler' => true
		),
		array(
			'id'       => 'custom_js',
			'type'     => 'ace_editor',
			'title'    => __( 'Custom JavaScript (header)', 'pile_txtd' ),
			'subtitle' => __( 'Enter your custom Javascript code. This code will be loaded in the head section of your pages.', 'pile_txtd' ),
			'mode'     => 'text',
			'theme'    => 'chrome'
		),
		array(
			'id'       => 'custom_js_footer',
			'type'     => 'ace_editor',
			'title'    => __( 'Custom JavaScript (footer)', 'pile_txtd' ),
			'subtitle' => __( 'This javascript code will be loaded in the footer. You can paste here your <strong>Google Analytics tracking code</strong> (or for what matters any tracking code) and we will put it on every page.', 'pile_txtd' ),
			'mode'     => 'text',
			'theme'    => 'chrome'
		),
	)
);

// Utilities - Theme Auto Update + Import Demo Data
// ------------------------------------------------------------------------

$sections[] = array(
	'icon'       => "icon-truck",
	'icon_class' => '',
	'title'      => __( 'Utilities', 'pile_txtd' ),
	'desc'       => '<p class="description">' . __( 'Utilities help you keep up-to-date with new versions of the theme. Also you can import the demo data from here.', 'pile_txtd' ) . '</p>',
	'fields'     => array(
		array(
			'id'   => 'theme-one-click-update-info',
			'desc' => __( '<h3>Theme One-Click Update</h3>
				<p class="description">' . __( 'Let us notify you when new versions of this theme are live on ThemeForest! Update with just one button click and forget about manual updates!</p><p> If you have any troubles with this system please refer to <a href="http://bit.ly/backend-update">Updating a theme</a> article.', 'pile_txtd' ) . '</p>', 'pile_txtd' ),
			'type' => 'info'
		),
		array(
			'id'       => 'themeforest_upgrade',
			'type'     => 'switch',
			'title'    => __( 'One-Click Update', 'pile_txtd' ),
			'subtitle' => __( 'Activate this to enter the info needed for the theme\'s one-click update to work.', 'pile_txtd' ),
			'default'  => true,
		),
		array(
			'id'       => 'marketplace_username',
			'type'     => 'text',
			'title'    => __( 'ThemeForest Username', 'pile_txtd' ),
			'subtitle' => __( 'Enter here your ThemeForest (or Envato) username account (i.e. pixelgrade).', 'pile_txtd' ),
			'required' => array( 'themeforest_upgrade', '=', 1 )
		),
		array(
			'id'       => 'marketplace_api_key',
			'type'     => 'text',
			'title'    => __( 'ThemeForest Secret API Key', 'pile_txtd' ),
			'subtitle' => __( 'Enter here the secret api key you\'ve created on ThemeForest. You can create a new one in the Settings > API Keys section of your profile.', 'pile_txtd' ),
			'required' => array( 'themeforest_upgrade', '=', 1 )
		),
		array(
			'id'       => 'themeforest_upgrade_backup',
			'type'     => 'switch',
			'title'    => __( 'Backup Theme Before Upgrade?', 'pile_txtd' ),
			'subtitle' => __( 'Check this if you want us to automatically save your theme as a ZIP archive before an upgrade. The directory those backups get saved to is <code>wp-content/envato-backups</code>. However, if you\'re experiencing problems while attempting to upgrade, it\'s likely to be a permissions issue and you may want to manually backup your theme before upgrading. Alternatively, if you don\'t want to backup your theme you can disable this.', 'pile_txtd' ),
			'default'  => '0',
			'required' => array( 'themeforest_upgrade', '=', 1 )
		),
		array(
			'id'   => 'import-demo-data-info',
			'desc' => __( '<h3>Import Demo Data</h3>
				<p class="description">' . __( 'Here you can import the demo data and get on your way of setting up the site like the theme demo (images not included due to copyright).', 'pile_txtd' ) . '</p>', 'pile_txtd' ),
			'type' => 'info'
		),
		array(
			'id'   => 'wpGrade_import_demodata_button',
			'type' => 'info',
			'desc' => '
                    <input type="hidden" name="wpGrade-nonce-import-posts-pages" value="' . wp_create_nonce( 'wpGrade_nonce_import_demo_posts_pages' ) . '" />
						<input type="hidden" name="wpGrade-nonce-import-theme-options" value="' . wp_create_nonce( 'wpGrade_nonce_import_demo_theme_options' ) . '" />
						<input type="hidden" name="wpGrade-nonce-import-widgets" value="' . wp_create_nonce( 'wpGrade_nonce_import_demo_widgets' ) . '" />
						<input type="hidden" name="wpGrade_import_ajax_url" value="' . admin_url( "admin-ajax.php" ) . '" />

						<a href="#" class="button button-primary" id="wpGrade_import_demodata_button">
							' . __( 'Import demo data', 'pile_txtd' ) . '
						</a>

						<div class="wpGrade-loading-wrap hidden">
							<span class="wpGrade-loading wpGrade-import-loading"></span>
							<div class="wpGrade-import-wait">
								' . __( 'Please wait a few minutes (between 1 and 3 minutes usually, but depending on your hosting it can take longer) and <strong>don\'t reload the page</strong>. You will be notified as soon as the import has finished!', 'pile_txtd' ) . '
							</div>
						</div>

						<div class="wpGrade-import-results hidden"></div>
						<div class="hr"><div class="inner"><span>&nbsp;</span></div></div>
					',
		),
		array(
			'id'   => 'other_utilities-info',
			'desc' => __( '<h3>Other</h3>', 'pile_txtd' ),
			'type' => 'info'
		),
		array(
			'id'       => 'use_responsive_images',
			'type'     => 'switch',
			'title'    => __( 'Use Responsive Images', 'pile_txtd' ),
			'subtitle' => __( 'Activate this if you would like to use the latest trends in responsive images (the <picture> HTML element and the PictureFill polyfill', 'pile_txtd' ),
			'default'  => '0',
		),
		array(
			'id'       => 'admin_panel_options',
			'type'     => 'switch',
			'title'    => __( 'Admin Panel Options', 'pile_txtd' ),
			'subtitle' => __( 'Here you can copy/download your current admin option settings. Keep this safe as you can use it as a backup should anything go wrong, or you can use it to restore your settings on this site (or any other site).', 'pile_txtd' ),
		),
		array(
			'id'       => 'theme_options_import',
			'type'     => 'import_export',
			'required' => array( 'admin_panel_options', '=', 1 )
		)
	)
);

/**
 * Check if WooCommerce is active
 **/
if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {

	// WooCommerce
	// ------------------------------------------------------------------------
	$sections[] = array(
		'icon'       => "icon-money",
		'icon_class' => '',
		'title'      => __( 'WooCommerce', 'pile_txtd' ),
		'desc'       => '<p class="description">' . __( 'WooCommerce options!', 'pile_txtd' ) . '</p>',
		'fields'     => array(
			array(
				'id'       => 'enable_woocommerce_support',
				'type'     => 'switch',
				'title'    => __( 'Enable WooCommerce Support', 'pile_txtd' ),
				'subtitle' => __( 'Turn this off to avoid loading the WooCommerce assets (CSS and JS).', 'pile_txtd' ),
				'default'  => '1',
			),
			array(
				'id'      => 'show_cart_menu',
				'type'    => 'switch',
				'title'   => __( 'Show cart menu in main navigation', 'pile_txtd' ),
				'default' => '1',
			),
		)
	);
}

// Help and Support
// ------------------------------------------------------------------------

$sections[] = array(
	'icon'       => "icon-cd-1",
	'icon_class' => '',
	'title'      => __( 'Help and Support', 'pile_txtd' ),
	'desc'       => '<p class="description">' . __( 'If you had anything less than a great experience with this theme please contact us now. You can also find answers in our community site, or official articles and tutorials in our knowledge base.', 'pile_txtd' ) . '</p>
		<ul class="help-and-support">
			<li>
				<a href="http://bit.ly/19G56H1">
					<span class="community-img"></span>
					<h4>Community Answers</h4>
					<span class="description">Get Help from other people that are using this theme.</span>
				</a>
			</li>
			<li>
				<a href="http://bit.ly/19G5cyl">
					<span class="knowledge-img"></span>
					<h4>Knowledge Base</h4>
					<span class="description">Getting started guides and useful articles to better help you with this theme.</span>
				</a>
			</li>
			<li>
				<a href="http://bit.ly/new-ticket">
					<span class="community-img"></span>
					<h4>Submit a Ticket</h4>
					<span class="description">File a ticket for a personal response from our support team.</span>
				</a>
			</li>
		</ul>
	',
	'fields'     => array()
);

return $sections;
