<?php
/**
 * Template Name: Portfolio Archive
 * @package Pile
 * @since   Pile 1.0
 */

get_header();

//get the featured projects list (comma separated string)
$featured_projects      = trim( get_post_meta( get_the_ID(), wpgrade::prefix() . 'portfolio_featured_projects', true ) );
$pile_3d_class          = wpgrade::option('pile_3d_effect') ? '' : 'pile--no-3d';
$large_no               = wpgrade::option('pile_large_columns');
$medium_no              = wpgrade::option('pile_medium_columns');
$small_no               = wpgrade::option('pile_small_columns');
$pile_columns_class     = 'pile-large-col-' . $large_no . ' pile-medium-col-' . $medium_no . ' pile-small-col-' . $small_no;

get_template_part( 'templates/portfolio/featured-hero' ); //let there be hero projects aka the bestest

do_action( 'pile_djax_container_start' ); ?>
	<div class="site-content  js-transition--single">
		<div class="container cf">

			<?php if ( empty ($featured_projects) || ! has_post_thumbnail() ): ?>
			<div class="title-wrapper mt0 pt0">
				<h1 class="archive-title"><?php the_title(); ?></h1>
			</div>
			<?php endif;?>

			<div class="entry-content clearfix">
				<?php the_content(); ?>
			</div>

			<?php
			//lets make sure we have the paging right
			global $paged;

			$paged = 1;
			if ( get_query_var('paged') ) $paged = get_query_var('paged');
			if ( get_query_var('page') ) $paged = get_query_var('page');

			$posts_per_page = intval( get_post_meta( get_the_ID(), wpgrade::prefix() . 'portfolio_projects_per_page', true ) );

			//set the query args
			$args = array(
				'post_type' => wpgrade::shortname() . '_portfolio',
				'paged' => $paged,
				'posts_per_page' => $posts_per_page,
				'orderby' => array('menu_order' => 'ASC', 'date' => 'DESC'),
			);

			//here we test to see if we need to exclude the featured projects
			$exclude_featured = get_post_meta( get_the_ID(), wpgrade::prefix() . 'portfolio_exclude_featured', true );
			if ( $exclude_featured ) {
				//get the featured posts so we can exclude them from the loop
				$featured_projects_IDs = explode( ',', $featured_projects );
				//make sure it is an array
				if ( ! empty($featured_projects_IDs) && ! is_array($featured_projects_IDs)) {
					$featured_projects_IDs = array($featured_projects_IDs);
				}
				$args['post__not_in'] = $featured_projects_IDs;
			}

	        // Fire up The Query
	        $the_query = new WP_Query( $args );

	        // The Loop
	        if ( $the_query->have_posts() ): ?>

            <div class="pile  pile--portfolio  <?php echo $pile_3d_class . ' ' . $pile_columns_class; ?>">

                <?php
                    $pile_item_index = 0;
                    while ( $the_query->have_posts() ): $the_query->the_post();
	                    $pile_item_3d_class = '';
		                $imageClass = '';
		                if (has_post_thumbnail()) {
			                $attachment = wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), 'full' );
			                if ($attachment[2] >= $attachment[1]) {
				                $imageClass = 'pile-item--portrait';
			                }
		                } else $imageClass = 'no-image';

	                    if ( ( floor( $pile_item_index / $large_no ) + $pile_item_index % $large_no ) % 2 ) {
		                    $pile_item_3d_class.= ' pile-item-large-3d';
	                    }

	                    if ( ( floor( $pile_item_index / $medium_no ) + $pile_item_index % $medium_no ) % 2 ) {
		                    $pile_item_3d_class.= ' pile-item-medium-3d';
	                    }

	                    if ( ( floor( $pile_item_index / $small_no ) + $pile_item_index % $small_no ) % 2 ) {
		                    $pile_item_3d_class.= ' pile-item-small-3d';
	                    }

	                    $pile_item_index++;
                ?>

                <div class="pile-item  pile-item--archive  one-whole lap-one-half desk-one-third <?php echo $imageClass . $pile_item_3d_class ?>">
                    <?php get_template_part('templates/portfolio/content-portfolio'); ?>
                </div>

                <?php endwhile; ?>

            </div>

	        <?php pile_the_next_prev_nav($the_query); ?>

	        <?php else: get_template_part('templates/no-results'); endif;
	        /* Restore original Post Data */
	        wp_reset_postdata();
	        ?>

	    </div>
	</div>
<?php

do_action('pile_djax_container_end' );

get_footer();