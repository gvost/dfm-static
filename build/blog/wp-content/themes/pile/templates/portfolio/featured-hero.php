<?php
/**
 * The template for the hero area (the top area) of portfolio archive page.
 *
 * Here we will show the projects that have been chosen as featured from the archive page edit
 * We will show the Hero image for each project or the first image in the Hero gallery if that is the case.
 *
 * @package Pile
 * @since   Pile 1.0
 */
global $post;

$classes = '';
//first lets get to know this page a little better
$header_height = get_post_meta( wpgrade::lang_post_id( get_the_ID() ), wpgrade::prefix() . 'slideshow_height', true );
if ( empty($header_height) ) {
	$header_height = 'full-height'; //the default
}
$classes .= ' ' . $header_height;

//get the featured projects list (comma separated string)
$featured_projects = trim( get_post_meta( get_the_ID(), wpgrade::prefix() . 'portfolio_featured_projects', true ) );

$has_thumbnail = has_post_thumbnail();
$classes .= ( ! empty($featured_projects) || has_post_thumbnail() ) ? '' : ' djax--hidden'; ?>

<div id="djaxHero" class="djax-updatable <?php echo $classes; ?>">

	<?php if ( ! empty($featured_projects) || $has_thumbnail ) :

		$featured_projects_IDs = explode( ',', $featured_projects );

		$do_slider = true; //we assume we need a slider

		//but we need to check for special cases when there is only one image needed but it has a video URL
		if ( $has_thumbnail && empty( $featured_projects ) ) { //we only have the featured image

			$attachment_fields = get_post_custom( get_post_thumbnail_id( get_the_ID() ) );
			// prepare the video url if there is one
			$video_url = ( isset($attachment_fields['_video_url'][0] ) && !empty( $attachment_fields['_video_url'][0]) ) ? esc_url( $attachment_fields['_video_url'][0] ) : '';

			if ( ! ( isset($attachment_fields['_video_url'][0] ) && !empty( $attachment_fields['_video_url'][0]) ) ) {
				$do_slider = false; //if there is no video URL attached then we don't need a slider
			}
		} elseif ( ! $has_thumbnail && count( $featured_projects_IDs ) == 1 ) { //we have only one featured project
			$attachment_fields = get_post_custom( $featured_projects_IDs[0] );
			// prepare the video url if there is one
			$video_url = ( isset($attachment_fields['_video_url'][0] ) && !empty( $attachment_fields['_video_url'][0]) ) ? esc_url( $attachment_fields['_video_url'][0] ) : '';

			if ( ! ( isset($attachment_fields['_video_url'][0] ) && !empty( $attachment_fields['_video_url'][0]) ) ) {
				$do_slider = false; //if there is no video URL attached then we don't need a slider
			}
		} ?>

		<div class="hero  <?php echo ($do_slider ? 'hero-container--slider' : ''); ?>">
			<div class="hero-container">

				<?php if ( ( wpgrade::option( 'hero_scroll_arrow' )) && ( $header_height == 'full-height' ) ) {
					get_template_part('templates/scroll-down-arrow');
				}

				if ( ! $do_slider ) { //no slider is needed

					if ( $has_thumbnail && empty( $featured_projects ) ) { //we only have the featured image

						get_template_part( 'templates/hero-bg-color' );

						pile_the_hero_image(); ?>

						<div class="hero-content">
							<h1 class="hero-title"><?php the_title(); ?></h1>
						</div>

					<?php
					} elseif ( ! $has_thumbnail && count( $featured_projects_IDs ) == 1 ) { //we have only one featured project so no need for a slider

						//hijack the global variable
						$post = get_post( $featured_projects_IDs[0] );
						setup_postdata( $post );

						get_template_part( 'templates/hero-bg-color' );

						pile_the_hero_image(); ?>

						<div class="hero-content">
							<h1 class="hero-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1>
							<?php get_template_part( 'templates/portfolio/single-content/meta-categories' ); ?>
						</div>

						<?php
						//return the regular post to it's previous state
						wp_reset_postdata();
					}
				} else { //so we need a slider after all

					//first the global slider settings
					$image_scale_mode     = get_post_meta( get_the_ID(), wpgrade::prefix() . 'post_slider_image_scale_mode', true );

					$slider_transitionSpeed    = get_post_meta( get_the_ID(), wpgrade::prefix() . 'post_slider_transition_speed', true );
					$slider_autoplay      = get_post_meta( get_the_ID(), wpgrade::prefix() . 'post_slider_autoplay', true );

					if ( $slider_autoplay ) {
						$slider_delay = get_post_meta( get_the_ID(), wpgrade::prefix() . 'post_slider_delay', true );
					}

					if ($image_scale_mode == '') {
						$image_scale_mode = 'fill';
					}
					$data_scaling = $image_scale_mode == 'auto' ? 'data-autoheight' : 'data-imagealigncenter data-imagescale="'.$image_scale_mode.'"'; ?>

					<div class="hero-slider  js-pixslider"
						<?php echo $data_scaling; ?>
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
						} ?>>
						<?php

						//the featured image if present as first slide
						if ( $has_thumbnail ) : ?>
						<div class="rsContent"><!-- open slide -->

							<?php
							$ignore_video = true;
							//by default we ignore videos on the portfolio archive, but if there is only one slide we don't ignore them anymore
							if ( empty( $featured_projects ) ) {
								$ignore_video = false;
							}

							pile_the_hero_image(null, true, $ignore_video); ?>

							<div class="hero-content">
								<h1 class="hero-title"><?php the_title(); ?></h1>
							</div>
						</div><!-- close slide -->
						<?php endif;

						if ( ! empty($featured_projects) ) {
							//get rid of the action added by Simple Custom Post Order - naughty naughty
							//it breaks our ordering
							global $scporder;
							if ( isset( $scporder ) ) {
								remove_action( 'pre_get_posts', array( $scporder, 'scporder_pre_get_posts' ) );
							}

							$query_args  = array(
								'post_type'      => wpgrade::shortname() . '_portfolio',
								'post__in'       => $featured_projects_IDs, // pass array of ids into `include` parameter
								'orderby'        => 'post__in',
								'posts_per_page' => - 1, //get all featured projects
							);
							$query_posts = get_posts( $query_args );
							foreach ( $query_posts as $post ) : setup_postdata( $post );

								get_template_part( 'templates/portfolio/featured-hero-slide' );

							endforeach;

							wp_reset_postdata();
						} ?>
					</div><!-- .hero-slider -->

				<?php } ?>

			</div><!-- .hero-container -->
		</div><!-- .hero -->

	<?php endif; ?>
</div><!-- #djaxHero -->