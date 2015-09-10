<?php
/**
 * The template for the search form.
 * @package Pile
 * @since   Pile 1.0
 */
?>
<h5 class="screen-reader-text"><?php _e( 'Search form', wpgrade::textdomain() ); ?></h5>
<form class="form-search" method="get" action="<?php echo home_url( '/' ); ?>" role="search">
	<input class="search-query" type="text" name="s" id="s" placeholder="<?php esc_attr_e( 'Search...', wpgrade::textdomain() ) ?>" autocomplete="off" value="<?php the_search_query(); ?>"/>
	<button class="btn search-submit" id="searchsubmit"><i class="icon icon-search"></i></button>
</form>