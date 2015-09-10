<?php

/*
 * Register custom menus.
 * This works on 3.1+
 */
function wpgrade_register_custom_menus() {

	add_theme_support( 'menus' );
	$menus = wpgrade::confoption( 'import_nav_menu' );
	foreach ( $menus as $key => $value ) {
		register_nav_menu( $key, $value );
	}
}

add_action( "after_setup_theme", "wpgrade_register_custom_menus" );


/*
 * Function for displaying The Main Header Menu
 */
function wpgrade_main_nav() {

    $args = array(
        'theme_location' => 'main_menu',
        'menu'           => '',
        'container'      => '',
        'container_id'   => '',
        'menu_class'     => 'nav  nav--main  text--center',
        'menu_id'        => '',
	    'link_after'     => '<span class="sub-menu-toggle"></span>',
        'fallback_cb'    => 'wpgrade_please_select_a_menu',
        'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
    );

    wp_nav_menu( $args );
}

/*
 * Function for displaying The Social Menu in the header area
 */
function wpgrade_social_nav() {

    $theme_locations = get_nav_menu_locations();

    if ( isset( $theme_locations["social_menu"] ) && ( $theme_locations["social_menu"] != 0 ) ) {
        $args = array(
            'theme_location' => 'social_menu',
            'menu'           => '',
            'container'      => '',
            'container_id'   => '',
            'menu_class'     => 'nav  nav--social-icons',
            'menu_id'        => '',
            'fallback_cb'    => 'wpgrade_please_select_a_menu',
            'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
        );

        wp_nav_menu( $args );
    }
}

function wpgrade_please_select_a_menu() {
	echo '<ul class="nav  nav--main sub-menu" >' . PHP_EOL;
	echo '<li><a href="' . admin_url( 'nav-menus.php?action=locations' ) . '">' . __( 'Please select a menu in this location', wpgrade::textdomain() ) . '</a></li>' . PHP_EOL;
	echo '</ul>' . PHP_EOL;
}