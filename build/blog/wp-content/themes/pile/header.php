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
	<link rel="stylesheet" type="text/css" href="/stylesheets/blog-nav.css">
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

<div id="header">
    <a href="/" class="to-home"><img src="/images/logo.png" id="logo" alt=""></a>
  <div id="nav-toggle">Explore</div>
</div>
<div id="nav-page">
  <ul>
    <li class="nav-heading">Case Studies</li>
    <li><a class="page-links" href="/kavaldon">Kavaldon</a></li>
    <li><a class="page-links" href="/selvarey">Selvarey</a></li>
    <li><a class="page-links" href="/AVF">Alexandra Von Furstenburg</a></li>
    <li><a class="page-links" href="/velvet">Velvet by Graham and Spencer</a></li>
  </ul>
  <ul>
    <li class="nav-heading">Our Work</li>
    <li><a class="page-links" href="/strategy">Brand Strategy</a></li>
    <li><a class="page-links" href="/identity">Identity Design</a></li>
    <li><a class="page-links" href="/packaging">Packaging and Collateral</a></li>
    <li><a class="page-links" href="/imagery">Imagery</a></li>
    <li><a class="page-links" href="/interactive">Interactive</a></li>
    <li><a class="page-links" href="/environment">Environment</a></li>
  </ul>
  <ul>
    <li class="nav-heading">
      <a class="page-links" href="/about">About</a>
    </li>
  </ul>
  <ul>
    <li class="nav-heading">
      <a class="page-links no-prevent" href="/blog" target="_blank">Blog</a>
    </li>
  </ul>
  <ul>
    <li class="nav-heading">
      <a class="page-links" href="/contact">Contact</a>
    </li>
  </ul>
  <div class="social-links">
    <a class="page-links no-prevent" href="https://www.pinterest.com/dfmla/" target="_blank">Pinterest</a>
    <a class="page-links no-prevent" href="http://drawingfrommemory.com/we-made-this-instagram" target="_blank">Instagram</a>
  </div>
</div>



<div id="main-wrapper" class="wrapper">