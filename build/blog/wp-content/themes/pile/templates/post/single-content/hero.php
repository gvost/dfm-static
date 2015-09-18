<?php
/**
 * The template for the hero area (the top area) of the single post template.
 * @package Pile
 * @since   Pile 1.0
 */

//all single post heroes are full-height
$classes = 'full-height';
$header_height = 'full-height';

//to be or not to be a (visible) hero
$classes .= has_post_thumbnail() ? '' : ' djax--hidden'; ?>

<div id="djaxHero" class="djax-updatable <?php echo $classes ?>">
	<?php if ( has_post_thumbnail() ): ?>

		<div class="hero">
			<div class="hero-container">
				<?php get_template_part('templates/hero-bg-color'); ?>

				<?php pile_the_hero_image() ?>

				<div class="hero-content">
					<h1 class="hero-title"><?php the_title(); ?></h1>
					<?php get_template_part('templates/post/single-content/meta-cat_and_date'); ?>

					<?php if (( wpgrade::option( 'hero_scroll_arrow' ) ) && ( $header_height == 'full-height' )) {
						get_template_part('templates/scroll-down-arrow');
					} ?>

				</div><!-- .hero-content -->
			</div><!-- .hero-container -->
		</div><!-- .hero -->

	<?php endif; ?>
</div><!-- #djaxHero -->