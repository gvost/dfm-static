<?php
/**
 * The template for the displaying the category list and the date.
 * @package Pile
 * @since   Pile 1.0
 */

$categories = get_the_category();
if ( ! is_wp_error( $categories ) && ! empty( $categories ) ):
	echo '<hr class="separator  separator--white" />' . PHP_EOL;
	echo '<div class="meta-list  meta-list--categories">' . PHP_EOL;
	foreach ( $categories as $category ) {
		echo '<a class="meta-list__item" href="' . get_category_link( $category->term_id ) . '" title="' . esc_attr( sprintf( __( "View all posts in %s", wpgrade::textdomain() ), $category->name ) ) . '" rel="tag">' . $category->name . '</a>' . PHP_EOL;
	};
	echo '</div>' . PHP_EOL;
endif; ?>
<span class="entry-time"><?php echo get_the_date(); ?></span>