<?php
/**
 * The template for displaying Portfolio Category Archive pages.
 *
 * @package Pile
 * @since   Pile 1.0
 */

$pile_3d_class = wpgrade::option('pile_3d_effect') ? '' : 'pile--no-3d';

get_header(); ?>

<div id="djaxHero" class="djax-updatable  djax--hidden"></div>

<?php do_action( 'pile_djax_container_start' ); ?>

	<div class="site-content  js-transition--single">

		<div class="container cf">

			<div class="title-wrapper">
				<?php pile::the_archive_title(); ?>
				<hr class="separator"/>
			</div>

			<?php // The Loop
			if ( have_posts() ): ?>

				<div class="pile  pile--portfolio <?php echo $pile_3d_class; ?>">

					<?php while ( have_posts() ): the_post(); ?>

						<div class="pile-item  pile-item--archive  one-whole  lap-one-half  desk-one-third  <?php echo $imageClass ?>">
							<?php get_template_part( 'templates/portfolio/content-portfolio' ); ?>
						</div>

					<?php endwhile; ?>

				</div>

				<?php pile_the_next_prev_nav(); ?>

			<?php
			else:
				get_template_part( 'templates/no-results' );
			endif; ?>

		</div>

	</div>
<?php

do_action('pile_djax_container_end' );

get_footer();