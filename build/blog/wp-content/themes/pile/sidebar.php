<?php
/**
 * The template for the sidebar containing the main widget area..
 * @package Pile
 * @since   Pile 1.0
 */

if( ! is_active_sidebar( 'sidebar-main' ) ) {
	return;
}
?>

<div id="secondary" class="sidebar  sidebar--main" role="complementary">
	<?php dynamic_sidebar( 'sidebar-main' ); ?>
</div><!-- #secondary -->