<?php
/**
 * The main template file.
 * This is the most generic template file in a WordPress theme and one of the
 * two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * For example, it puts together the home page when no home.php file exists.
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 * @package Pile
 * @since   Pile 1.0
 */

get_header();

get_template_part( 'templates/post/single-content/hero' ); //let there be heroes

// ensure we have the right postdata
wp_reset_postdata();

do_action( 'pile_djax_container_start' ); ?>

	<?php $imageClass = has_post_thumbnail() ? 'has-thumbnail' : 'has-no-thumbnail'; ?>
	<div class="site-content  js-transition--single  ">
		<div class="container">
			<article id="post-<?php the_ID(); ?>"  <?php post_class( 'entry--single  pr  clearfix ' . $imageClass ); ?>>
				<div id="primary" class="content-area">
					<div id="main" class="site-main" role="main">
						<?php if ( ! has_post_thumbnail() ): //it means we haven't outputed a hero area ?>
							<header class="entry-header  title-wrapper">
								<h1 class="entry-title" itemprop="name"><?php the_title(); ?></h1>
								<?php get_template_part('templates/post/single-content/meta-cat_and_date'); ?>
							</header>
						<?php endif; ?>
						<div class="entry-content  js-post-gallery  clearfix">

							<?php the_content();

							global $numpages;
							if ( $numpages > 1 ): ?>
								<div class="entry__meta-box  meta-box--pagination">
									<span class="meta-box__title"><?php _e( 'Pages', wpgrade::textdomain() ); ?></span>
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
							if ( function_exists( 'display_pixlikes' ) ) {
								display_pixlikes();
							}

							if ( wpgrade::option( 'blog_single_show_share_links' ) ): ?>
								<div class="metabox">
									<button class="share-button  js-popup-share js-share-source">
										<i class="icon icon-share-alt"></i> <?php _e( 'Share', wpgrade::textdomain() ) ?>
									</button>
								</div>
							<?php
							endif;

							$tags = get_the_tags();
							if ( ! is_wp_error( $tags ) && ! empty( $tags ) ):
								?>
								<div class="meta-list  meta-list--tags">
									<span class="meta-list__head"><?php _e( 'Tagged with ', wpgrade::textdomain() ); ?></span>
									<?php
									foreach ( $tags as $tag ) {
										echo '<a class="meta-list__item" href="' . get_tag_link( $tag->term_id ) . '" title="' . esc_attr( sprintf( __( "View all posts in %s", wpgrade::textdomain() ), $tag->name ) ) . '" rel="tag">' . $tag->name . '</a>';
									};
									?>
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

				<?php if ( is_active_sidebar( 'sidebar-main' ) && wpgrade::option( 'blog_single_show_sidebar' ) ) get_template_part( 'sidebar' ); ?>

			</article><!-- .entry--single -->
		</div><!-- .container +- .sidebar-wrapper -->
	</div><!-- .site-content -->

	<?php if ( wpgrade::option( 'blog_single_show_share_links' ) ) : ?>
		<div class="addthis_toolbox addthis_default_style addthis_32x32_style"
		     addthis:url="<?php echo wpgrade_get_current_canonical_url(); ?>"
		     addthis:title="<?php wp_title('|', true, 'right'); ?>"
		     addthis:description="<?php echo trim(strip_tags(get_the_excerpt())) ?>" >
			<?php get_template_part( 'templates/core/addthis-social-popup' ); ?>
		</div>
	<?php endif;

do_action('pile_djax_container_end' );

get_footer(); ?>