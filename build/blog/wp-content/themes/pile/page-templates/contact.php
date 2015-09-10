<?php
/**
 * Template Name: Contact
 *
 * @package Pile
 * @since   Pile 1.0
 */

get_header();

global $is_gmap;

$gmap_url = get_post_meta( wpgrade::lang_page_id( get_the_ID() ), wpgrade::prefix() . 'gmap_url', true );

if ( get_page_template_slug( get_the_ID() ) == 'page-templates/contact.php' ) {
	if ( ! empty( $gmap_url ) ) {
		//set the global so everybody knows that we are in dire need of the Google Maps API
		$is_gmap = true;
		// enqueue only on this page
		wp_enqueue_script('google-maps-api');
	}
}

get_template_part( 'templates/page/hero-gmap' ); //let there be heroes

// ensure we have the right postdata
wp_reset_postdata();

do_action( 'pile_djax_container_start' ); ?>

	<div class="site-content  js-transition--single">
		<div class="container">
			<article id="post-<?php the_ID(); ?>"  <?php post_class( 'entry--page  pr  clearfix' ); ?>>
				<div id="primary" class="content-area">
					<div id="main" class="site-main" role="main">
						<?php if ( ! has_post_thumbnail() && ! $is_gmap ): //it means we haven't outputed a hero area ?>
							<header class="entry-header">
								<h1 class="entry-title"><?php the_title(); ?></h1>
								<hr class="separator  title-meta-sep"/>
								<span class="entry-time"><?php the_date( ); ?></span>
							</header>
						<?php endif; ?>
						<div class="entry-content  js-post-gallery  clearfix">

							<?php
							the_content();

							global $numpages;
							if ( $numpages > 1 ): ?>
								<div class="entry__meta-box  meta-box--pagination">
									<span class="meta-box__title"><?php _e( 'Pages', wpgrade::textdomain() ) ?></span>
									<?php
									$args = array(
										'before'           => '<ol class="nav  pagination--single">',
										'after'            => '</ol>',
										'next_or_number'   => 'next_and_number',
										'previouspagelink' => __( '&laquo;', wpgrade::textdomain() ),
										'nextpagelink'     => __( '&raquo;', wpgrade::textdomain() )
									);
									wp_link_pages( $args ); ?>
								</div>
							<?php endif; ?>
						</div>

						<div class="entry-footer">
							<?php
							if ( get_post_meta( get_the_ID(), wpgrade::prefix() . 'gmap_enabled_social_share', true ) ): ?>
								<div class="metabox">
									<button class="share-button  js-popup-share">
										<i class="icon icon-share-alt"></i> <?php _e( 'Share', wpgrade::textdomain() ) ?>
									</button>
								</div>
							<?php endif; ?>

						</div><!--entry-footer-->
						<?php

						if ( comments_open() || '0' != get_comments_number() ) {
							comments_template();
						}
						?>
					</div><!-- .site-main -->
				</div><!-- .content-area -->

			</article><!-- .entry--single -->
		</div><!-- .container +- .sidebar-wrapper -->
	</div><!-- .site-content -->

	<?php if ( get_post_meta( get_the_ID(), wpgrade::prefix() . 'gmap_enabled_social_share', true ) ) get_template_part( 'templates/core/addthis-social-popup' );

do_action('pile_djax_container_end' );

get_footer(); ?>