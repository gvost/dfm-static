<!--<?php global $wp_query; if ( $wp_query->max_num_pages > 1 ) { ?>
<nav id="nav-below" class="navigation" role="navigation">
<div class="nav-previous"><?php next_posts_link(sprintf( __( '%s older', 'blankslate' ), '<span class="meta-nav">&larr;</span>' ) ) ?></div>
<div class="nav-next"><?php previous_posts_link(sprintf( __( 'newer %s', 'blankslate' ), '<span class="meta-nav">&rarr;</span>' ) ) ?></div>
</nav>
<?php } ?>-->


<div class="paginate">
		<?php
			$big = 1000000000000; 

			echo paginate_links( array(
				'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
				'format' => '?paged=%#%',
				'current' => max( 1, get_query_var('paged') ),
				'total' => $the_query->max_num_pages,
				'prev_next' => false
			) );
			?>
			<?php echo paginate_links(); ?>
</div>