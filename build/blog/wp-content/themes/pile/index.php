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

get_header(); ?>

<div id="djaxHero" class="djax-updatable  djax--hidden"></div>

<?php do_action( 'pile_djax_container_start' ); ?>

	<div class="site-content  site-content--journal  js-transition--archive">
		<div class="container cf">

			<div class="title-wrapper">
				<?php pile::the_archive_title(); ?>
			</div>
			<div class="pile  pile--blog">
				<?php //first the sticky posts
				// get current page we are on. If not set we can assume we are on page 1.
				$current_page = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
				if ( is_front_page() && $current_page == 1 ) {
					$sticky = get_option( 'sticky_posts' );
					// check if there are any
					if ( ! empty( $sticky ) ) {
						// optional: sort the newest IDs first
						rsort( $sticky );
						// override the query
						$args = array(
							'post__in' => $sticky
						);
						query_posts( $args );
						// the loop
						if ( have_posts() ):
							while ( have_posts() ) : the_post(); ?>
								<article <?php post_class( 'pile-item  pile-item--archive  pile-item--single  one-whole lap-one-half desk-one-third' ); ?>>
									<?php get_template_part( 'templates/post/content-blog' ); ?>
								</article>
							<?php endwhile;
						endif;

						wp_reset_postdata();
						wp_reset_query();
					}
				}

				if ( have_posts() ) :
					while ( have_posts() ) : the_post(); ?>
						<article <?php post_class( 'pile-item  pile-item--archive  pile-item--single  one-whole lap-one-half desk-one-third' ); ?>>
							<?php get_template_part( 'templates/post/content-blog' ); ?>
						</article>
					<?php
					endwhile;

					pile_the_older_newer_nav();

				else:
					get_template_part( 'templates/no-results' );
				endif; // end if have_posts()
				?>
			</div>
		</div>
	</div>
<?php
do_action( 'pile_djax_container_end' );

get_footer();