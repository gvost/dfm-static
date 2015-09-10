<?php
/**
 * The template for the hero area (the top area) of the contact page template - The GMap.
 * @package Pile
 * @since   Pile 1.0
 */

$classes = '';
//first lets get to know this page a little better
$header_height = get_post_meta( wpgrade::lang_post_id( get_the_ID() ), wpgrade::prefix() . 'contact_page_header_height', true );
if ( empty($header_height) ) {
	$header_height = 'full-height'; //the default
}
$classes .= ' ' . $header_height;

//get the Google Maps URL
$gmap_url = get_post_meta( wpgrade::lang_page_id( get_the_ID() ), wpgrade::prefix() . 'gmap_url', true );

$is_gmap = false;
if ( ! empty( $gmap_url ) ) {
	//set the global so everybody knows that we are in dire need of the Google Maps API
	$is_gmap             = true;
	$gmap_custom_style   = get_post_meta( wpgrade::lang_page_id( get_the_ID() ), wpgrade::prefix() . 'gmap_custom_style', true );
	$gmap_marker_content = get_post_meta( wpgrade::lang_page_id( get_the_ID() ), wpgrade::prefix() . 'gmap_marker_content', true );
}

//to be or not to be a (visible) hero
$classes .= $is_gmap ? '' : ' djax--hidden';
?>

<div id="djaxHero" class="djax-updatable <?php echo $classes; ?>">
	<?php if ( $is_gmap ): ?>

		<div class="hero">
			<div class="hero-container">
				<div id="gmap"
				     data-url="<?php esc_attr_e( $gmap_url ); ?>" <?php echo ( $gmap_custom_style == 'on' ) ? 'data-customstyle' : ''; ?>
				     data-markercontent="<?php echo esc_attr( $gmap_marker_content ); ?>"></div>
				<div class="hero-content">
					<h1 class="hero-title  hero-title--map"><?php the_title(); ?></h1>
				</div><!-- .hero-content -->
			</div><!-- .hero-container -->
		</div><!-- .hero -->

	<?php endif; ?>
</div><!-- #djaxHero -->