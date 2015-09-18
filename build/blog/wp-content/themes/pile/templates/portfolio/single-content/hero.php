<?php
/**
 * The template for the hero area (the top area) of the single project template.
 * @package Pile
 * @since   Pile 1.0
 */

$attachment_ids = get_post_meta( get_the_ID(), wpgrade::prefix() . 'second_image', true );

$classes = '';
//first lets get to know this page a little better
$header_height = get_post_meta( wpgrade::lang_post_id( get_the_ID() ), wpgrade::prefix() . 'project_header_height', true );
if ( empty($header_height) ) {
	$header_height = 'full-height'; //the default
}
$classes .= ' ' . $header_height;

$hero_needed        = ! empty( $attachment_ids );
$classes .= $hero_needed ? '' : ' djax--hidden';

//split the string by comma so we get only an array of attachment ids
$attachment_ids = explode( ',', $attachment_ids );

//get the data for each attachment
$gallery_attachments = array();
foreach ( $attachment_ids as $key => $attachment_id ) {
	$gallery_attachments[ $key ]['src'] = wp_get_attachment_image_src( $attachment_id, 'full' );
	$gallery_attachments[ $key ]['alt'] = get_post_meta( $attachment_id, '_wp_attachment_image_alt', true );
	$gallery_attachments[ $key ]['id'] = $attachment_id;
} ?>

<div id="djaxHero" class="djax-updatable <?php echo $classes; ?>">

	<?php if ( $hero_needed ): //no need for a hero if there is no lady in distress

		$do_slider = true; //we assume we need to do a slider

		//when we have a single image
		//if it has a video attached we still need to use a slider
		if ( count($gallery_attachments) == 1 ) {
			$attachment_fields = get_post_custom( $gallery_attachments[0]['id'] );
			// prepare the video url if there is one
			$video_url = ( isset($attachment_fields['_video_url'][0] ) && !empty( $attachment_fields['_video_url'][0]) ) ? esc_url( $attachment_fields['_video_url'][0] ) : '';

			if ( ! ( isset($attachment_fields['_video_url'][0] ) && !empty( $attachment_fields['_video_url'][0]) ) ) {
				$do_slider = false; //if there is no video URL attached then we don't need a slider
			}
		}
	?>

		<div class="hero <?php echo ($do_slider ? 'hero--slider-container' : ''); ?>">
			<div class="hero-container">
				<?php get_template_part('templates/hero-bg-color'); ?>

				<?php if ( $do_slider ) { //we have a slider on our hands

					//get to know the slider settings
					$image_scale_mode = get_post_meta( get_the_ID(), wpgrade::prefix() . 'post_slider_image_scale_mode', true );
					if ($image_scale_mode == '') { //default to fill
						$image_scale_mode = 'fill';
					}

					$slider_transitionSpeed     = get_post_meta( get_the_ID(), wpgrade::prefix() . 'post_slider_transition_speed', true );
					$slider_autoplay            = get_post_meta( get_the_ID(), wpgrade::prefix() . 'post_slider_autoplay', true );

					if ( $slider_autoplay ) {
						$slider_delay = get_post_meta( get_the_ID(), wpgrade::prefix() . 'post_slider_delay', true );
					}

					$data_scaling = ( $image_scale_mode == 'auto' ) ? 'data-autoheight' : 'data-imagealigncenter data-imagescale="' . $image_scale_mode.'"'; ?>

					<div class="hero-slider  js-pixslider"
						<?php echo $data_scaling . PHP_EOL; ?>
					     data-slidertransition="fade"
					     data-slidertransitionspeed="<?php echo $slider_transitionSpeed; ?>"
					     data-customArrows
						<?php
						if ( $slider_autoplay ) {
							echo 'data-sliderautoplay="" ' . PHP_EOL;
							echo 'data-sliderdelay="' . $slider_delay . '" ' . PHP_EOL;
						}

						if ( wpgrade::option( 'slideshow_arrows_style' ) == 'hover' ) {
							echo ' data-hoverarrows ';
						}
						echo '>'; //finish the slider settings

						//now go through all the attachments and add them as slides
						foreach ( $attachment_ids as $key => $attachment_id ) {

							pile_the_hero_image( $attachment_id, true );

						} ?>
					</div><!-- .hero-slider -->

				<?php } else { //only one image to play with

					pile_the_hero_image( $attachment_ids[0] );

				} ?>

				<div class="hero-content">
					<h1 class="hero-title"><?php the_title(); ?></h1>
					<?php if ( wpgrade::option('portfolio_single_show_meta') ) get_template_part('templates/portfolio/single-content/meta-categories'); ?>

					<?php if ( ( wpgrade::option( 'hero_scroll_arrow' ) ) && ( $header_height == 'full-height' ) ) {
						get_template_part('templates/scroll-down-arrow');
					} ?>
					
				</div><!-- .hero-content -->
			</div><!-- .hero-container -->
		</div><!-- .hero -->

	<?php endif; //we've had some form of hero image ?>
</div><!-- #djaxHero -->