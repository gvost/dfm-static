<?php
/**
 * The template for the background color of the hero
 * @package Pile
 * @since   Pile 1.2.1
 */

$hero_color = get_post_meta( get_the_ID(), wpgrade::prefix() . 'project_color', true );
if ( ! empty( $hero_color ) && '#' !== $hero_color ) : ?>
	<div class="hero-bg  hero-bg--color" style="background-color: <?php echo $hero_color; ?>"></div>
<?php endif; ?>