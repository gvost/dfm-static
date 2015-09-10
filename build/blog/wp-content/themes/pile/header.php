<?php
/**
 * The Header for our theme
 *
 * Displays all of the <head> section and everything up till the main content
 *
 * @package Pile
 * @since   Pile 1.0
 */


//detect what type of content are we displaying
$schema_org = '';
if ( is_singular( wpgrade::shortname() . '_portfolio' ) ) {
	$schema_org .= ' itemscope itemtype="http://schema.org/CreativeWork"';
} elseif ( is_single() ) {
	$schema_org .= ' itemscope itemtype="http://schema.org/Article"';
} else {
	$schema_org .= ' itemscope itemtype="http://schema.org/WebPage"';
}

?><!DOCTYPE html>
<!--[if lt IE 7]>
<html class="lt-ie9 lt-ie8 lt-ie7" <?php language_attributes(); echo $schema_org; ?>> <![endif]-->
<!--[if IE 7]>
<html class="lt-ie9 lt-ie8" <?php language_attributes(); echo $schema_org; ?>> <![endif]-->
<!--[if IE 8]>
<html class="lt-ie9" <?php language_attributes(); echo $schema_org; ?>> <![endif]-->
<!--[if IE 9]>
<html class="ie9" <?php language_attributes(); echo $schema_org; ?>> <![endif]-->
<!--[if gt IE 9]><!-->
<html <?php language_attributes(); echo $schema_org; ?>> <!--<![endif]-->
<head>
	<meta http-equiv="content-type" content="text/html; charset=<?php bloginfo( 'charset' ); ?>">
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="HandheldFriendly" content="True">
	<meta name="apple-touch-fullscreen" content="yes"/>
	<meta name="MobileOptimized" content="320">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php wp_title( '|', true, 'right' ); ?></title>
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<![if IE]>
	<script type='text/javascript'>
		if (/*@cc_on!@*/false) var is_ie = 1;
	</script>
	<![endif]>
	<?php
	/**
	 * One does not simply remove this and walk away alive!
	 */
	wp_head(); ?>
</head>
<?php

$data_ajaxloading     = ( wpgrade::option( 'use_ajax_loading' ) == 1 ) ? 'data-ajaxloading' : '';
$data_smoothscrolling = ( wpgrade::option( 'use_smooth_scroll' ) == 1 ) ? 'data-smoothscrolling' : '';
$data_main_color      = ( wpgrade::option( 'main_color' ) ) ? 'data-color="' . wpgrade::option( 'main_color' ) . '"' : '';
$data_parallax_amount = 'data-parallax="' . wpgrade::option( 'parallax_amount' ) . '"';

//we use this so we can generate links with post id
//right now we use it to change the Edit Post link in the admin bar
$data_currentID         = '';
$data_currentEditString = '';
$data_currentTaxonomy   = '';
if ( ( wpgrade::option( 'use_ajax_loading' ) == 1 ) ) {
	global $wp_the_query;
	$current_object = $wp_the_query->get_queried_object();

	if ( ! empty( $current_object->post_type )
	     && ( $post_type_object = get_post_type_object( $current_object->post_type ) )
	     && current_user_can( 'edit_post', $current_object->ID )
	     && $post_type_object->show_ui && $post_type_object->show_in_admin_bar ) {

		$data_currentID = 'data-curpostid="' . $current_object->ID . '"';
		if ( isset( $post_type_object->labels ) && isset( $post_type_object->labels->edit_item ) ) {
			$data_currentEditString = 'data-curpostedit="' . $post_type_object->labels->edit_item . '"';
		}
	} elseif ( ! empty( $current_object->taxonomy )
	           && ( $tax = get_taxonomy( $current_object->taxonomy ) )
	           && current_user_can( $tax->cap->edit_terms )
	           && $tax->show_ui ) {

		$data_currentID       = 'data-curpostid="' . $current_object->term_id . '"';
		$data_currentTaxonomy = 'data-curtaxonomy="' . $current_object->taxonomy . '"';
		if ( isset( $tax->labels ) && isset( $tax->labels->edit_item ) ) {
			$data_currentEditString = 'data-curpostedit="' . $tax->labels->edit_item . '"';
		}
	}
}

//first let's test if we are in woocommerce
if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {
	//we need to setup post data
	if ( is_shop() ) {

	$shop_page_id = wc_get_page_id( 'shop' );

	if ( ! empty( $shop_page_id ) && $shop_page_id != 0 ) {

			global $post;
			$post = get_post( $shop_page_id );

			setup_postdata( $post );

			$make_transparent_menu_bar = get_post_meta( wpgrade::lang_page_id( get_the_ID() ), wpgrade::prefix() . 'header_transparent_menu_bar', true );

			if ( $make_transparent_menu_bar == 'on' ) {
				$class_name .= '  header--transparent';
			}
		}
	}
}
$class_name = '';
if ( wpgrade::option( 'enable_copyright_overlay' ) ) {
	$class_name .= '  is--copyright-protected  ';
}

?>

<body <?php body_class($class_name);
echo ' ' . $data_smoothscrolling . ' ' . $data_parallax_amount . ' ' . $data_ajaxloading . ' ' . $data_currentID . ' ' . $data_currentEditString . ' ' . $data_currentTaxonomy . ' ' . $data_main_color ?>>

<!--[if lt IE 7]>
<p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade
	your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to
	improve your experience.</p>
<![endif]-->

<?php
	$header_width   = wpgrade::option('content_width') + wpgrade::option('header_offset') . 'px';
	$header_static  = wpgrade::option('nav_show_scroll') ? '' : 'site-header--static';
	$header_show    = wpgrade::option('nav_show_always') ? 'site-header--show' : '';
?>

<header class="site-header <?php echo $header_static . ' ' . $header_show ?>">
	<div class="panel  panel--logo">
		<div class="container" style="max-width: <?php echo $header_width; ?>">
			<div class="flag  header-height">
				<div class="flag__body">
					<?php get_template_part( 'templates/branding' ); ?>
				</div>
			</div>
		</div>
	</div>
	<div class="panel  panel--hamburger">
		<div class="flag  header-height  container" style="max-width: <?php echo $header_width; ?>">
			<div class="flag__body">
				<?php
				if (!wpgrade::option('nav_show_always')) {
					if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) && wpgrade::option( 'show_cart_menu' ) ) {
					global $woocommerce; ?>
					<div class="cart-widget">
						<div class="widget_shopping_cart_content"></div>
					</div>
					<?php }
				} ?>
				<a class="navigation-toggle">
					<?php if ( wpgrade::option('nav_menu_layout') == 'text' || wpgrade::option('nav_menu_layout') == 'text-icon' ) {
						echo '<span>'.wpgrade::option('nav_menu_text').'</span>';
					}
					if ( wpgrade::option('nav_menu_layout') == 'icon' || wpgrade::option('nav_menu_layout') == 'text-icon' ) { ?>
						<i class="icon icon-bars"></i>
					<?php } ?>
				</a>
			</div>
		</div>
	</div>
</header>

<div class="panel  panel--navigation  site-navigation <?php echo $header_static . ' ' . $header_show; ?>">
	<div class="container" style="max-width: <?php echo $header_width; ?>">
		<div class="flexbox  header-height  cover">
			<div class="flexbox__item">
				<?php wpgrade_main_nav(); ?>
			</div>
		</div>
		<div class="flexbox  header-height  social-container">
			<div class="flexbox__item">
				<?php
				wpgrade_social_nav();
				if (wpgrade::option('nav_show_always')) {
					if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) && wpgrade::option( 'show_cart_menu' ) ) {
						global $woocommerce; ?>
						<div class="cart-widget">
							<div class="widget_shopping_cart_content"></div>
						</div>
					<?php }
				} ?>
			</div>
		</div>
	</div>
</div>
<?php if ( wpgrade::option( 'enable_copyright_overlay' ) ) { ?>
	<div class="copyright-overlay">
		<div class="copyright-overlay__container">
			<div class="copyright-overlay__content">
				<?php echo wpgrade::option( 'copyright_overlay_text' ) ?>
			</div>
		</div>
	</div>
<?php } ?>
<div id="main-wrapper" class="wrapper">