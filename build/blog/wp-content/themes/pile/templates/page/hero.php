<?php
/**
 * The template for the hero area (the top area) of the single post template.
 * @package Pile
 * @since   Pile 1.0
 */

$classes = '';
//first lets get to know this page a little better
$header_height = get_post_meta( wpgrade::lang_post_id( get_the_ID() ), wpgrade::prefix() . 'page_header_height', true );
if ( empty($header_height) ) {
	$header_height = 'full-height'; //the default
}
$classes .= ' ' . $header_height;

//to be or not to be a (visible) hero
$classes .= has_post_thumbnail() ? '' : ' djax--hidden'; ?>

<div id="djaxHero" class="djax-updatable <?php echo $classes; ?>">
	<?php if ( has_post_thumbnail() ): ?>

		<div class="hero">
			<div class="hero-container">
				<?php get_template_part('templates/hero-bg-color'); ?>

				<?php pile_the_hero_image() ?>

				<div class="hero-content">
					<h1 class="hero-title"><?php the_title(); ?></h1>

					<?php if (( wpgrade::option( 'hero_scroll_arrow' ) ) && ( $header_height == 'full-height' )) {
						get_template_part('templates/scroll-down-arrow');
					} ?>
				</div><!-- .hero-content -->
			</div><!-- .hero-container -->
		</div><!-- .hero -->

	<?php endif; ?>
</div><!-- #djaxHero -->