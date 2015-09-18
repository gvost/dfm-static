<?php
/**
 * The template for displaying the Quote Post Format on archives.
 * @package Pile
 * @since   Pile 1.0
 */

$content = get_the_content( __( 'Continue reading <span class="meta-nav">&rarr;</span>', 'pile_txtd' ) );

//test if there is a </blockquote> tag in here
if ( strpos($content,'</blockquote>') !== false ) {
	echo strip_tags($content,'<p><em><strong><i><br><h3><h4><h5><h6><blockquote><iframe><embed><object><script>');
} else {
	//we will wrap the whole content in blockquote since this is definitely intended as a quote
	echo '<blockquote>' . strip_tags($content,'<p><em><strong><i><br><h3><h4><h5><h6><blockquote><iframe><embed><object><script>') . '</blockquote>';
} ?>