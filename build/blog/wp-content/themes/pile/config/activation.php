<?php
/**
 * ACTIVATION SETTINGS
 * These settings will be needed when the theme will get active
 * Careful with the first setup, most of them will go in the clients database and they will be stored there
 * This file will be included in inc/functions/callbacks/activation-hooks.php
 */

return array(
	'pixlikes-settings' => array(
		'show_on_post'         => false,
		'show_on_page'         => false,
		'show_on_hompage'      => false,
		'show_on_archive'      => false,
		'like_action'          => 'click',
		'hover_time'           => 1000,
		'free_votes'           => false,
		'load_likes_with_ajax' => false,
	),
	'pixtypes-settings' => array(
		'post_types' => array(
			wpgrade::shortname() . '_portfolio' => array(
				'labels'        => array(
					'name'               => __( 'Project', wpgrade::textdomain() ),
					'singular_name'      => __( 'Project', wpgrade::textdomain() ),
					'add_new'            => __( 'Add New', wpgrade::textdomain() ),
					'add_new_item'       => __( 'Add New Project', wpgrade::textdomain() ),
					'edit_item'          => __( 'Edit Project', wpgrade::textdomain() ),
					'new_item'           => __( 'New Project', wpgrade::textdomain() ),
					'all_items'          => __( 'All Projects', wpgrade::textdomain() ),
					'view_item'          => __( 'View Project', wpgrade::textdomain() ),
					'search_items'       => __( 'Search Projects', wpgrade::textdomain() ),
					'not_found'          => __( 'No Project found', wpgrade::textdomain() ),
					'not_found_in_trash' => __( 'No Project found in Trash', wpgrade::textdomain() ),
					'menu_name'          => __( 'Projects', wpgrade::textdomain() ),
				),
				'public'        => true,
				'rewrite'       => array(
					'slug'       => wpgrade::shortname() . '_portfolio',
					'with_front' => false,
				),
				'has_archive'   => 'portfolio-archive',
				'menu_icon'     => 'report.png',
				'menu_position' => null,
				'supports'      => array(
					'title',
					'thumbnail',
					'page-attributes',
				),
				'yarpp_support' => true,
			)
		),
		'taxonomies' => array(
			wpgrade::shortname() . '_portfolio_categories' => array(
				'hierarchical'      => true,
				'labels'            => array(
					'name'              => __( 'Project Categories', wpgrade::textdomain() ),
					'singular_name'     => __( 'Project Category', wpgrade::textdomain() ),
					'search_items'      => __( 'Search Project Categories', wpgrade::textdomain() ),
					'all_items'         => __( 'All Project Categories', wpgrade::textdomain() ),
					'parent_item'       => __( 'Parent Project Category', wpgrade::textdomain() ),
					'parent_item_colon' => __( 'Parent Project Category: ', wpgrade::textdomain() ),
					'edit_item'         => __( 'Edit Project Category', wpgrade::textdomain() ),
					'update_item'       => __( 'Update Project Category', wpgrade::textdomain() ),
					'add_new_item'      => __( 'Add New Project Category', wpgrade::textdomain() ),
					'new_item_name'     => __( 'New Project Category Name', wpgrade::textdomain() ),
					'menu_name'         => __( 'Portfolio Categories', wpgrade::textdomain() ),
				),
				'show_admin_column' => true,
				'rewrite'           => array( 'slug' => 'portfolio-category', 'with_front' => false ),
				'sort'              => true,
				'post_types'        => array( wpgrade::shortname() . '_portfolio' )
			),
		),
		'metaboxes'  => array(
			// Page Builder
			wpgrade::shortname() . '_page_builder'            => array(
				'id'         => wpgrade::shortname() .'page_builder',
				'title'      => __( 'Builder', wpgrade::textdomain() ),
				'pages'      => array( 'page' ), // Post type
				'context'    => 'normal',
				'priority'   => 'high',
				'hidden'     => true,
				'show_on'    => array( 'key' => 'page-template', 'value' => array( 'page-templates/page-builder.php' ), ),
				'show_names' => true, // Show field names on the left
				'fields'     => array(
					array(
						'name'            => __( 'Builder', wpgrade::textdomain() ),
						'id'              => wpgrade::prefix() . 'page_builder',
						'type'            => 'pix_builder',
						'hidden'          => true
					),
				)
			),

			//for the Page Header Covers
			wpgrade::shortname() . '_page_header_area_cover'     => array(
				'id'         => wpgrade::shortname() . '_page_header_area_cover',
				'title'      => __( 'Settings', 'pile_txtd' ),
				'pages'      => array( 'page' ), // Post type
				'context'    => 'normal',
				'priority'   => 'default',
				'hidden'     => true,
				'show_on'    => array(
					'key'   => 'page-template',
					'value' => array( 'default', 'page-templates/page-builder.php' ),
				),
				'show_names' => true, // Show field names on the left
				'fields'     => array(
					array(
						'name'    => __( 'Header Height', 'pile_txtd' ),
						'desc'    => '<p class="cmb_metabox_description">' . __( 'Select the height of the header area in relation to the browser window.', 'pile_txtd' ) . '</p>',
						'id'      => wpgrade::prefix() . 'page_header_height',
						'type'    => 'select',
						'options' => array(
							array(
								'name'  => __( '&#9673;&#9673;&#9673; Full Height', 'pile_txtd' ),
								'value' => 'full-height',
							),
							array(
								'name'  => __( '&#9673;&#9673;&#9711; Two Thirds', 'pile_txtd' ),
								'value' => 'two-thirds-height',
							),
							array(
								'name'  => __( '&nbsp; &#9673;&#9711; &nbsp;Half', 'pile_txtd' ),
								'value' => 'half-height',
							)
						),
						'std'     => 'full-height',
					),
					array(
						'name'    => __( 'Social Share', 'pile_txtd' ),
						'id'      => wpgrade::prefix() . 'page_enabled_social_share',
						'type'    => 'select',
						'options' => array(
							array(
								'name'  => __( 'Enabled', 'pile_txtd' ),
								'value' => true
							),
							array(
								'name'  => __( 'Disabled', 'pile_txtd' ),
								'value' => false
							)
						),
						'std'     => false
					),

				),
			),
			//for the Portfolio Archive
			wpgrade::shortname() . '_portfolio_archive_settings'     => array(
				'id'         => wpgrade::shortname() . '_portfolio_archive_settings',
				'title'      => __( 'Settings', 'pile_txtd' ),
				'pages'      => array( 'page' ), // Post type
				'context'    => 'normal',
				'priority'   => 'default',
				'hidden'     => true,
				'show_on'    => array(
					'key'   => 'page-template',
					'value' => array('page-templates/portfolio-archive.php' ),
				),
				'show_names' => true, // Show field names on the left
				'fields'     => array(
					array(
						'name'    => __( 'Featured Projects', 'pile_txtd' ),
						'id'      => wpgrade::prefix() . 'portfolio_featured_projects',
						'desc'    => __( 'Choose your featured projects. Drag and drop to reorder them to your liking. These projects will be excluded from the main projects list.', 'pile_txtd' ),
						'type'    => 'pw_multiselect_cpt',
						'options' => array(
							'args' => array(
								'post_type' => wpgrade::shortname() . '_portfolio',
								'post_status' => 'publish'
							),
						),
						'sanitization_cb' => 'pw_select2_sanitise',
					),
					array(
						'name'    => __( 'Exclude From List', 'pile_txtd' ),
						'id'      => wpgrade::prefix() . 'portfolio_exclude_featured',
						'desc'    => __( 'Enable this so your featured projects will not show in the main project list. If you want them there also, leave this disabled.', 'pile_txtd' ),
						'type'    => 'select',
						'options' => array(
							array(
								'name'  => __( 'Enabled', 'pile_txtd' ),
								'value' => true,
							),
							array(
								'name'  => __( 'Disabled', 'pile_txtd' ),
								'value' => false,
							),
						),
						'std'     => true,
					),
					array(
						'name'       => __( 'Projects Per Page', 'pile_txtd' ),
						'id'         => wpgrade::prefix() . 'portfolio_projects_per_page',
						'type'       => 'text_small',
						'std'        => '6',
					),
				),
			),
			wpgrade::shortname() . '_page_header_area_slideshow' => array(
				'id'         => wpgrade::shortname() . '_page_header_area_slideshow',
				'title'      => __( 'Slideshow Settings', 'pile_txtd' ),
				'pages'      => array( 'page' ), // Post type
				'context'    => 'normal',
				'priority'   => 'default',
				'hidden'     => true,
				'show_on'    => array(
					'key'   => 'page-template',
					'value' => array( 'page-templates/portfolio-archive.php' ),
				),
				'show_names' => true, // Show field names on the left
				'fields'     => array(
					array(
						'name'    => __( 'Slideshow Height', 'pile_txtd' ),
						'desc'    => '<p class="cmb_metabox_description">' . __( 'Select the height of the header area in relation to the browser window.', 'pile_txtd' ) . '</p>',
						'id'      => wpgrade::prefix() . 'slideshow_height',
						'type'    => 'select',
						'options' => array(
							array(
								'name'  => __( '&#9673;&#9673;&#9673; Full Height', 'pile_txtd' ),
								'value' => 'full-height',
							),
							array(
								'name'  => __( '&#9673;&#9673;&#9711; Two Thirds', 'pile_txtd' ),
								'value' => 'two-thirds-height',
							),
							array(
								'name'  => __( '&nbsp; &#9673;&#9711; &nbsp;Half', 'pile_txtd' ),
								'value' => 'half-height',
							)
						),
						'std'     => 'full-height',
					),
					array(
						'name'    => __( 'Image Scaling', 'pile_txtd' ),
						'desc'    => __( '<p class="cmb_metabox_description"><strong>Fill</strong> scales image to completely fill slider container (recommended for landscape images)</p>
<p class="cmb_metabox_description"><strong>Fit</strong> scales image to fit the container (recommended for portrait images)</p>
<p class="cmb_metabox_description"><strong>Fit if Smaller</strong> scales image to fit only if size of slider container is less than size of image.</p>
<p class="cmb_metabox_description"><strong>Auto Height</strong> scales the container to fit the full size image.</p>
<p class="cmb_metabox_description"><a target="_blank" href="http://bit.ly/slider-image-scaling">Visual explanation</a></p>', 'pile_txtd' ),
						'id'      => wpgrade::prefix() . 'post_slider_image_scale_mode',
						'type'    => 'select',
						'options' => array(
							array(
								'name'  => __( 'Fill', 'pile_txtd' ),
								'value' => 'fill'
							),
							array(
								'name'  => __( 'Fit', 'pile_txtd' ),
								'value' => 'fit'
							),
							array(
								'name' => __('Fit if Smaller', 'pile_txtd'),
								'value' => 'fit-if-smaller'
							),
							array(
								'name'  => __( 'Auto Height', 'pile_txtd' ),
								'value' => 'auto'
							),
						),
						'std'     => 'fill'
					),
					array(
						'name'       => __( 'Transition Speed', 'pile_txtd' ),
						'id'         => wpgrade::prefix() . 'post_slider_transition_speed',
						'type'       => 'text_small',
						'std'        => '600',
					),
					array(
						'name'    => __( 'Slider Autoplay', 'pile_txtd' ),
						'id'      => wpgrade::prefix() . 'post_slider_autoplay',
						'type'    => 'select',
						'options' => array(
							array(
								'name'  => __( 'Enabled', 'pile_txtd' ),
								'value' => true
							),
							array(
								'name'  => __( 'Disabled', 'pile_txtd' ),
								'value' => false
							)
						),
						'std'     => false
					),
					array(
						'name'       => __( 'Autoplay delay between slides (in milliseconds)', 'pile_txtd' ),
						'id'         => wpgrade::prefix() . 'post_slider_delay',
						'type'       => 'text_small',
						'std'        => '1000',
						'display_on' => array(
							'display' => true,
							'on'      => array(
								'field' => wpgrade::prefix() . 'post_slider_autoplay',
								'value' => true
							)
						),
					),
				)
			),
			//for the Contact Page template
			wpgrade::shortname() . '_gmap_settings'              => array(
				'id'         => wpgrade::shortname() . '_gmap_settings',
				'title'      => __( 'Map Coordinates & Display Options', 'pile_txtd' ),
				'pages'      => array( 'page' ), // Post type
				'context'    => 'normal',
				'priority'   => 'high',
				'hidden'     => true,
				'show_on'    => array(
					'key'   => 'page-template',
					'value' => array( 'page-templates/contact.php' ),
					//					'hide' => true, // make this true if you want to hide it
				),
				'show_names' => true, // Show field names on the left
				'fields'     => array(
					array(
						'name'    => __( 'Map Height', 'pile_txtd' ),
						'desc'    => __( '<p class="cmb_metabox_description">Select the height of the Google Map area in relation to the browser window.</p>', 'pile_txtd' ),
						'id'      => wpgrade::prefix() . 'contact_page_header_height',
						'type'    => 'select',
						'options' => array(
							array(
								'name'  => __( '&nbsp; &#9673;&#9711; &nbsp;Half', 'pile_txtd' ),
								'value' => 'half-height',
							),
							array(
								'name'  => __( '&#9673;&#9673;&#9711; Two Thirds', 'pile_txtd' ),
								'value' => 'two-thirds-height',
							),
							array(
								'name'  => __( '&#9673;&#9673;&#9673; Full Height', 'pile_txtd' ),
								'value' => 'full-height',
							)
						),
						'std'     => 'full-height',
					),
					array(
						'name' => __( 'Google Maps URL', 'pile_txtd' ),
						'desc' => __( 'Paste here the Share URL you have taken from <a href="http://www.google.com/maps" target="_blank">Google Maps</a>.', 'pile_txtd' ),
						'id'   => wpgrade::prefix() . 'gmap_url',
						'type' => 'textarea_small',
						'std'  => '',
					),
					array(
						'name' => __( 'Custom Colors', 'pile_txtd' ),
						'desc' => __( 'Allow us to change the map colors to better match your website.', 'pile_txtd' ),
						'id'   => wpgrade::prefix() . 'gmap_custom_style',
						'type' => 'checkbox',
						'std'  => 'on',
					),
					array(
						'name'    => __( 'Pin Content', 'pile_txtd' ),
						'desc'    => __( 'Insert here the content of the location marker - leave empty for no custom marker.', 'pile_txtd' ),
						'id'      => wpgrade::prefix() . 'gmap_marker_content',
						'type'    => 'wysiwyg',
						'std'     => '',
						'options' => array(
							'media_buttons' => true,
							'textarea_rows' => 3,
							'teeny'         => false,
							'tinymce'       => true,
							'quicktags'     => true,
						),
					),
					array(
						'name'    => __( 'Social Share', 'pile_txtd' ),
						'id'      => wpgrade::prefix() . 'gmap_enabled_social_share',
						'type'    => 'select',
						'options' => array(
							array(
								'name'  => __( 'Enabled', 'pile_txtd' ),
								'value' => true
							),
							array(
								'name'  => __( 'Disabled', 'pile_txtd' ),
								'value' => false
							)
						),
						'std'     => false
					),
				),
			),
			// Builder
			wpgrade::shortname() . '_project_builder'            => array(
				'id'         => 'project_builder',
				'title'      => __( 'Builder', wpgrade::textdomain() ),
				'pages'      => array( wpgrade::shortname() . '_portfolio' ), // Post type
				'context'    => 'normal',
				'priority'   => 'high',
				'show_names' => true, // Show field names on the left
				'fields'     => array(
					array(
						'name'            => __( 'Builder', wpgrade::textdomain() ),
						'id'              => wpgrade::prefix() . 'project_builder',
						'type'            => 'pix_builder',
						'hidden'          => true
					),
				)
			),
			// Project Slideshow Settings
			wpgrade::shortname() . '_project_header_area_slideshow' => array(
				'id'         => wpgrade::shortname() . '_project_header_area_slideshow',
				'title'      => __( 'Hero Area Settings', 'pile_txtd' ),
				'pages'      => array( wpgrade::shortname() . '_portfolio' ), // Post type
				'context'    => 'normal',
				'priority'   => 'default',
				'hidden'     => true,
				'show_names' => true, // Show field names on the left
				'fields'     => array(
					array(
						'name'    => __( 'Hero Area Height', 'pile_txtd' ),
						'desc'    => '<p class="cmb_metabox_description">' . __( 'Select the height of the header area in relation to the browser window.', 'pile_txtd' ) . '</p>',
						'id'      => wpgrade::prefix() . 'project_header_height',
						'type'    => 'select',
						'options' => array(
							array(
								'name'  => __( '&#9673;&#9673;&#9673; Full Height', 'pile_txtd' ),
								'value' => 'full-height',
							),
							array(
								'name'  => __( '&#9673;&#9673;&#9711; Two Thirds', 'pile_txtd' ),
								'value' => 'two-thirds-height',
							),
							array(
								'name'  => __( '&nbsp; &#9673;&#9711; &nbsp;Half', 'pile_txtd' ),
								'value' => 'half-height',
							)
						),
						'std'     => 'full-height',
					),
					array(
						'name'    => __( 'Slideshow Options:', 'pile_txtd' ),
						'id'      => wpgrade::prefix() . 'project_slideshow_options',
						'type'    => 'title',
					),
					array(
						'name'    => __( 'Image Scaling', 'pile_txtd' ),
						'desc'    => __( '<p class="cmb_metabox_description"><strong>Fill</strong> scales image to completely fill slider container (recommended for landscape images)</p>
										<p class="cmb_metabox_description"><strong>Fit</strong> scales image to fit the container (recommended for portrait images)</p>
										<p class="cmb_metabox_description"><strong>Fit if Smaller</strong> scales image to fit only if size of slider container is less than size of image.</p>
										<p class="cmb_metabox_description"><strong>Auto Height</strong> scales the container to fit the full size image.</p>
										<p class="cmb_metabox_description"><a target="_blank" href="http://bit.ly/slider-image-scaling">Visual explanation</a></p>', 'pile_txtd' ),
						'id'      => wpgrade::prefix() . 'post_slider_image_scale_mode',
						'type'    => 'select',
						'options' => array(
							array(
								'name'  => __( 'Fill', 'pile_txtd' ),
								'value' => 'fill'
							),
							array(
								'name'  => __( 'Fit', 'pile_txtd' ),
								'value' => 'fit'
							),
							array(
								'name' => __('Fit if Smaller', 'pile_txtd'),
								'value' => 'fit-if-smaller'
							),
							array(
								'name'  => __( 'Auto Height', 'pile_txtd' ),
								'value' => 'auto'
							),
						),
						'std'     => 'fill'
					),
					array(
						'name'       => __( 'Transition Speed', 'pile_txtd' ),
						'id'         => wpgrade::prefix() . 'post_slider_transition_speed',
						'type'       => 'text_small',
						'std'        => '600',
					),
					array(
						'name'    => __( 'Slider Autoplay', 'pile_txtd' ),
						'id'      => wpgrade::prefix() . 'post_slider_autoplay',
						'type'    => 'select',
						'options' => array(
							array(
								'name'  => __( 'Enabled', 'pile_txtd' ),
								'value' => true
							),
							array(
								'name'  => __( 'Disabled', 'pile_txtd' ),
								'value' => false
							)
						),
						'std'     => false
					),
					array(
						'name'       => __( 'Autoplay delay between slides (in milliseconds)', 'pile_txtd' ),
						'id'         => wpgrade::prefix() . 'post_slider_delay',
						'type'       => 'text_small',
						'std'        => '1000',
						'display_on' => array(
							'display' => true,
							'on'      => array(
								'field' => wpgrade::prefix() . 'post_slider_autoplay',
								'value' => true
							)
						),
					),

				)
			),
			// Accent Color
			wpgrade::shortname() . '_project_colors'             => array(
				'id'         => '_project_colors',
				'title'      => __( 'Accent Color <a class="tooltip" title="Used as a background color for pages transitions. <p>Tip: Choose a color to match the background of the Hero image.</p>"></a>', wpgrade::textdomain() ),
				'pages'      => array( wpgrade::shortname() . '_portfolio' ), // Post type
				'context'    => 'side',
				'priority'   => 'low',
				'show_names' => false, // Show field names on the left
				'fields'     => array(
					array(
						'name'    => __( 'Color', wpgrade::textdomain() ),
						'id'      => wpgrade::prefix() . 'project_color',
						'type'    => 'colorpicker',
						'std'     => '#262526'
					),
				)
			),
			// Hero Area
			wpgrade::shortname() . '_project_aside'              => array(
				'id'         => '_project_aside',
				'title'      => __( 'Hero Area <a class="tooltip" title="This image will be used for the top area in the project page.<p>Tip: Uploading <strong>multiple images</strong>, will transform them in a <strong>slider</strong>.</p>"></a>', wpgrade::textdomain() ),
				'pages'      => array( wpgrade::shortname() . '_portfolio' ), // Post type
				'context'    => 'side',
				'priority'   => 'low',
				'show_names' => true, // Show field names on the left
				'fields'     => array(
					array(
						'name' => __( 'Hero Image', wpgrade::textdomain() ),
						'id'   => wpgrade::prefix() . 'second_image',
						'type' => 'gallery',
					),
				)
			),
		),
	),
);