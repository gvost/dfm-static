<?php
/*
 * Register Widgets areas.
 */

function wpgrade_register_sidebars() {

	register_sidebar( array(
		'id'            => 'sidebar-main',
		'name'          => __( 'Main Sidebar', 'pile_txtd' ),
		'description'   => __( 'Main Sidebar', 'pile_txtd' ),
		'before_title'  => '<h4 class="widget__title widget--sidebar-blog__title">',
		'after_title'   => '</h4>',
		'before_widget' => '<div id="%1$s" class="widget widget--sidebar-blog %2$s">',
		'after_widget'  => '</div>',
	) );

	register_sidebar( array(
		'id'            => 'sidebar-footer',
		'name'          => __( 'Footer Area', 'pile_txtd' ),
		'description'   => __( 'Footer Area', 'pile_txtd' ),
		'before_title'  => '<h4 class="widget__title widget--menu__title">',
		'after_title'   => '</h4>',
		'before_widget' => '<div id="%1$s" class="widget widget--menu %2$s">',
		'after_widget'  => '</div>',
	) );

	//allow the Text Widgets to handle shortcodes
	add_filter( 'widget_text', 'shortcode_unautop');
	add_filter('widget_text', 'do_shortcode');

}

add_action( 'widgets_init', 'wpgrade_register_sidebars' );

add_action( 'customize_register', 'wpgrade_remove_widgets_area_from_customizer' );
function wpgrade_remove_widgets_area_from_customizer () {

	global $wp_customize;
	// remove these widgets areas from customizer
	$wp_customize->remove_section('sidebar-widgets-sidebar-main');
	$wp_customize->remove_section('sidebar-widgets-sidebar-footer');

}

/*
 * Extend the Custom Menu widget to add it a checkbox for transforming the widget into a Social Menu widget
 */

//Add the input fields
add_action('in_widget_form', 'wpgrade_custom_menu_widget_social',5,3);
//Update/save the fields
add_filter('widget_update_callback', 'wpgrade_custom_menu_widget_social_update',5,3);
//Process output
add_filter('dynamic_sidebar_params', 'wpgrade_custom_menu_widget_social_params');

function wpgrade_custom_menu_widget_social($t,$return,$instance){
	//only add the extra checkbox field to Custom Menu widgets
	if ( $t->id_base == 'nav_menu' ) {
		$instance = wp_parse_args( (array) $instance, array( 'title' => '', 'text' => '' ) );
		?>
		<p>
			<input id="<?php echo $t->get_field_id( 'social_menu' ); ?>" name="<?php echo $t->get_field_name( 'social_menu' ); ?>" type="checkbox" <?php checked( isset( $instance['social_menu'] ) ? $instance['social_menu'] : 0 ); ?> />
			<label for="<?php echo $t->get_field_id( 'social_menu' ); ?>"><?php _e( 'Social menu (attempt to make social icons from menu links)', wpgrade::textdomain() ); ?></label>
		</p>
		<?php
		$return = null;
	}

	return array($t,$return,$instance);
}

function wpgrade_custom_menu_widget_social_update($instance, $new_instance, $old_instance){
	$instance['social_menu'] = isset($new_instance['social_menu']);
	return $instance;
}

function wpgrade_custom_menu_widget_social_params($params){
	global $wp_registered_widgets;
	$widget_id = $params[0]['widget_id'];
	$widget_obj = $wp_registered_widgets[$widget_id];
	$widget_opt = get_option($widget_obj['callback'][0]->option_name);
	$widget_num = $widget_obj['params'][0]['number'];

	if (isset($widget_opt[$widget_num]['social_menu']) && $widget_opt[$widget_num]['social_menu']){
		$params[0]['before_widget'] = preg_replace('/class="/', 'class="nav--social-icons ',  $params[0]['before_widget'], 1);
    }
    return $params;
}