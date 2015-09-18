<?php



return array(
	# Commented values are optional properties. Many properties are
	# automatically deduced from others (eg. textdomain is deduced from
	# name, unless a custom value is provided)
	# ---------------------------------------------------------------------

	'name'                         => 'Pile',
	'shortname'                    => 'pile',
	'prefix'                       => '_pile_',
	'textdomain'                   => 'pile_txtd',
	'language-path'                => 'languages',
	'update-notifier'              => array(
		'xml-source'       => 'http://pixelgrade.com/updates/',
		//		'xml-file' => 'rosa.xml',
		'cache-interval'   => 10800, # 3 hours
		'update-page-name' => 'theme-update-notifier',
	),
	'theme-adminpanel-path'        => 'config/admin-panel',
	// additional file includes (classes, functions, etc), files are loaded
	// via wpgrade::require_all and entries should be directories; if the
	// path does not exist it is automatically ignored
	'include-paths'                => array(
		'inc/classes',
		'inc/functions',
	),
	// same as include-paths only instead of files you specify files, to be
	// used with vendor dependencies to avoid multiple include/requires
	// happening due to the files in question adding subfiles relative to
	// their directory (also avoids problems with php configuration files)
	'include-files'                => array(
		// main theme class
		'inc/required-plugins/required-plugins.php',
	),
	// the path where overwrites on the core partials are stored, any files
	// placed in the partial overwrites will be loaded instead of the core
	// equivalent view files
	'core-partials-overwrite-path' => 'templates/core',
	// the directory where css and other media files are located; used by
	// wpgrade::resourceuri; utility allows for easy migration of files to
	// new structures
	'resource-path'                => '/assets',
	// use theme-options to add any non-customizable options with out going
	// though any of the backend code; all options added here are available
	// though the WPGradeOptions driver manager. ie. the  wpgrade::option
	// shorthand. Support for backend customization may be added at any
	// time later with out requiring any alterations; the options you add
	// here will have the lowest priority
	'theme-options'                => array( // empty
	),
	// Usage: body_class(wpgrade::body_class()) in header-classic.php
	// Syntax: class => callback or boolean; eg. 'myclass' => true,
	// 'myclass' => false, 'myclass' => 'class_check_function'. All
	// callbacks are executed once if more classes refer the same callback.
	'body-classes'                 => array( // empty
	),
	// overwrites the inline css class to allow for full control; you may
	// also leave this null, which will invoke an internal handler and work
	// with the core partial inline-custom-css
	'custom-css-handler'           => null,
	// filter functions will recieve content as a parameter and must return
	// content; all functions are ordered by priority and executed from
	// lowest to highest. If a filter is assigned false as a priority it
	// will be ignored in processing
	'content-filters'              => array(
		'default' => array(
			'wpgrade_callback_theme_general_filters' => 100,
			'wpgrade_callback_shortcode_filters'     => 200,
			'wpgrade_callback_attachment_filters'    => 300,
			'wpgrade_callback_paragraph_filters'     => 400,
		),
	),
	'post-formats'                 => array( // empty - see functions.php
	),
	'shortcodes'                   => array(
		'Columns',
		'Button',
		'Icon',
		'Tabs',
		'Separator',
		'Slider',
	),
	// importer
	'import_homepage_name'         => 'Work',
	'import_blogpage_name'         => 'Journal',
	// decide which menus should be imported
	'import_nav_menu'              => array(
		'main_menu'   => 'Header Menu',
		'social_menu' => 'Social Menu',
		'footer_menu' => 'Footer Menu',
	),
	'resources'                    => array(
		// script declarations; scripts must be enqueue'ed to appear
		'register'                => array(
			'head-scripts'   => array(
				'modernizr'      => array(
					'path'    => get_template_directory_uri() . '/assets/js/modernizr.min.js',
					'require' => array(
						'jquery'
					),
				),
				'picturefill'      => array(
					'path'    => get_template_directory_uri() . '/assets/js/picturefill.min.js',
					'require' => array(
					),
				),
				'webfont-script' => array(
					'path'    => '//ajax.googleapis.com/ajax/libs/webfont/1.5.3/webfont.js',
					'require' => array(
						'jquery'
					),
				),
			),
			'footer-scripts' => array(
				'wpgrade-main-scripts' => array(
					'path'    => get_template_directory_uri() . '/assets/js/main.js',
					//					'cache_bust' => wpgrade::cachebust_string( wpgrade::themefilepath( 'assets/js/main.js' ) ),
					'require' => array(),
				),
				'addthis-api'          => array(
					'path'    => '//s7.addthis.com/js/250/addthis_widget.js#async=1',
					'require' => array(
						'jquery'
					),
				),
				'google-maps-api'      => array(
					'path'    => '//maps.google.com/maps/api/js?sensor=false&amp;language=en&callback=gmapInit',
					'require' => array(
						'jquery'
					),
				),
			),
			'styles'         => array(
				'wpgrade-main-style' => array(
					'path'       => get_template_directory_uri() . '/assets/css/style.css',
					'cache_bust' => wpgrade::cachebust_string( wpgrade::themefilepath( 'assets/css/style.css' ) ),
				),
			)

		), # end register

		// auto invoke scripts previously registered on theme setup
		'auto-enqueue-scripts'    => array(
			'wpgrade-main-scripts',
		),
		// enqueue's script and localizes
		'auto-localize-scripts'   => array(
			'wpgrade-main-scripts' => array(
				'ajaxurl'    => admin_url( 'admin-ajax.php' ),
				'objectl10n' => array(
					'tPrev'             => __( 'Previous (Left arrow key)', 'pile_txtd' ),
					'tNext'             => __( 'Next (Right arrow key)', 'pile_txtd' ),
					'tCounter'          => __( 'of', 'pile_txtd' ),
					'infscrLoadingText' => "",
					'infscrReachedEnd'  => "",
				),
			),
		),
		// calls function to perform extra enqueue's on theme setup
		// handlers should be placed in theme's functions.php
		'script-enqueue-handlers' => array(
			'google-web-fonts' => 'wpgrade_callback_enqueue_google_fonts_pile',
			'thread-comments'  => 'wpgrade_callback_thread_comments_scripts',
			'addthis'          => 'wpgrade_callback_addthis',
			'picturefill'      => 'wpgrade_callback_picturefill',
		),
		// auto invoke styles previously registered on theme setup
		'auto-enqueue-styles'     => array(
			'wpgrade-main-style',
		),
		// calls function to perform extra enqueue's on theme setup
		// handlers should be placed in theme's functions.php
		'style-enqueue-handlers'  => array(
			'dynamic-css' => array(
				'handler'  => 'wpgrade_callback_enqueue_dynamic_css_pile',
				'priority' => 9999,
			),
			'rtl-support' => 'wpgrade_callback_enqueue_rtl_support',
			'404-page'    => 'wpgrade_callback_enqueue_404_css',
		),

	), # end resource

	// defaults for pagination; you may customize the values at any time
	// when invoking a pagination formatter, the following defaults will be
	// in effect if not overwritten
	'pagination'                   => array(
		// formatter to process the links; null if none needed
		// the formatter should return a string and accept links and
		// the resulting configuration
		'formatter'     => 'wpgrade_callback_pagination_formatter',
		// show prev/next links?
		'prev_next'     => true,
		// pagination text
		'prev_text'     => __( 'Prev', 'pile_txtd' ),
		'next_text'     => __( 'Next', 'pile_txtd' ),
		// are the terms used for paging relative to the sort order?
		// ie. older/newer instead of sorting agnostic previous/next
		'sorted_paging' => false,
		// the order of the posts (asc or desc); if asc is passed and
		// sorted_paging is true the values of prev_text and next_text
		// will be flipped
		'order'         => 'desc',
		// show all pages? (ie. no cutoffs)
		'show_all'      => false,
		// how many numbers on either the start and the end list edges
		'end_size'      => 1,
		// how many numbers to either side of current page
		// not including current page
		'mid_size'      => 2,
		// an array of query args to add
		'add_args'      => false,
		// a string to append to each link
		'add_fragment'  => null,
	),
	// allows you to create special pagination instances by providing a key
	// to wpgrade::pagination; the settings defined in the key will be used
	// to overwrite the defaults defined in pagination above; if the key
	// is not viable the pagination system will ignore the request so you
	// can use the template names while developing and customize at any
	// time later
	'pagination-targets'           => array(
		// the following is an example
		//				'gallery' => array
		//					(
		//						'formatter' => null,
		//						'prev_text' => __('Prev Images', 'pile_txtd'),
		//						'next_text' => __('Next Images', 'pile_txtd'),
		//					)
	),
	// setup here your thumbnails sizes
	'thumbnails_sizes'             => array(

		/**
		 * MAXIMUM SIZE
		 * Maximum Full Image Size
		 * - Sliders
		 * - Lightbox
		 */
		'full-size' => array(
			'width' => 2048
		),
		/**
		 * LARGE SIZE
		 * - Single post without sidebar
		 */
		'large-size'     => array(
			'width' => 1200
		),
		/**
		 * MEDIUM SIZE
		 * - Tablet Sliders
		 * - Archive Featured Image
		 * - Single Featured Image
		 */
		'medium-size'    => array(
			'width' => 700,
		),
		/**
		 * SMALL SIZE
		 * - Masonry Grid
		 * - Mobile Sliders
		 */
		'small-size'     => array(
			'width' => 385,
		),

	),

	'google_fonts_keys' => array(
		'google_titles_font',
		'google_descriptions_font',
		'google_nav_font',
		'google_body_font'
	),

	// gridster params ... yolo
	'gridster_params'              => array(
		'widget_margins'          => array( 30, 30 ),
		'widget_base_dimensions'  => array( 120, 40 ),
		'min_cols'                => 6,
		'max_cols'                => 6,
		'resize'                  => array(
			'enabled'  => true,
			'axes'     => array( 'x' ),
			'min_size' => array( 2, 2 ),
			'max_size' => array( 6, 2 )
		),
		'draggable'               => array(
			'handle' => '.drag_handler'
		),
		'on_resize_callback'      => array(
			'el',
			'ui',
			'$widget',
			'var size_x = this.resize_wgd.size_x;
			if ( size_x == 5 ) {
				// get the closest widget size
				var cws = this.resize_last_sizex;
				// force the widget size to 6
				jQuery(this.resize_wgd.el).attr("data-sizex", cws);
				this.resize_wgd.size_x = cws;
				// now the widget preview
				var preview = jQuery(this.resize_wgd.el).find(".preview-holder");
				preview.attr("data-sizex", cws);
				this.$resize_preview_holder.attr("data-sizex", cws);
				jQuery(document).trigger("pix_builder:serialize");
			};'
		),
		'serialize_params'        => array(
			'$w',
			'wgd',
			'var type = $w.data("type"),
			content = $w.find(".block_content").text();
			if (type == "text") {
				content = $w.find(".block_content textarea").val();
			} else if (type == "image") {
				content = $w.find(".open_media").attr("data-attachment_id");
			} else if (type == "editor") {
				content = $w.find(".to_send").text();
			}
			return {
				id: $w.prop("id").replace("block_", ""),
				type: type,
				content: content,
				col: wgd.col,
				row: wgd.row,
				size_x: wgd.size_x,
				size_y: wgd.size_y
			};'
		)
	)

); # end theme configuration