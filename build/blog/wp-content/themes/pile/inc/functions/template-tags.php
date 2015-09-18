<?php

/**
 * Display navigation to next/previous set of posts when applicable.
 */
function pile_the_next_prev_nav($the_query = null) {
	global $wp_query;

	//use a custom query if given
	if (! empty($the_query)) {
		$wp_query = $the_query;
	}

	// Don't print empty markup if there's only one page.
	if ( $wp_query->max_num_pages < 2 )
		return;
	?>
	<nav class="pagination  pagination--archive" role="navigation">
		<h2 class="screen-reader-text"><?php _e( 'Main navigation', wpgrade::textdomain() ); ?></h2>
		<div class="nav-links">

			<?php if ( get_previous_posts_link() ) : ?>
				<div class="nav-previous prev  nav-button"><?php previous_posts_link( __( '<span class="meta-nav">&larr;</span> Prev', wpgrade::textdomain() ) ); ?></div>
			<?php endif; ?>

			<?php if ( get_next_posts_link() ) : ?>
				<div class="nav-next next  nav-button"><?php next_posts_link( __( 'Next <span class="meta-nav">&rarr;</span> ', wpgrade::textdomain() ) ); ?></div>
			<?php endif; ?>

		</div><!-- .nav-links -->
	</nav><!-- .navigation -->
	<?php
	//cleanup
	if ( ! empty($the_query) ) {
		wp_reset_query();
	}
}

/**
 * Display navigation to next/previous set of posts when applicable.
 */
function pile_the_older_newer_nav($the_query = null) {
	global $wp_query;

	//use a custom query if given
	if (! empty($the_query)) {
		$wp_query = $the_query;
	}

	// Don't print empty markup if there's only one page.
	if ( $wp_query->max_num_pages < 2 )
		return;
	?>
	<nav class="pagination  pagination--archive blog-nav" role="navigation">
		<h2 class="screen-reader-text"><?php _e( 'Posts navigation', wpgrade::textdomain() ); ?></h2>
		<div class="nav-links">

			<?php if ( get_previous_posts_link() ) : ?>
				<div class="nav-previous prev nav-button"><?php previous_posts_link( __( '<span class="meta-nav">&larr;</span> Newer posts', wpgrade::textdomain() ) ); ?></div>
			<?php endif; ?>

			<?php if ( get_next_posts_link() ) : ?>
				<div class="nav-next next nav-button"><?php next_posts_link( __( 'Older posts <span class="meta-nav">&rarr;</span> ', wpgrade::textdomain() ) ); ?></div>
			<?php endif; ?>

		</div><!-- .nav-links -->
	</nav><!-- .navigation -->
	<?php
	//cleanup
	if ( ! empty($the_query) ) {
		wp_reset_query();
	}
}

/**
 * Display a hero single image, responsive or not
 *
 * @param int attachment ID
 * @param bool whether this image will be used in a slideshow or not
 */

/**
 * @param null $id
 * @param bool $slide
 */
 function pile_the_hero_image ($id = null, $slide = false, $ignore_video = false) {
	 //if we have no ID then use the post thumbnail, if present
	 if ( empty($id) ) {
		 $id = get_post_thumbnail_id( get_the_ID() );
	 }

	 //do nothing if we have no ID
	 if ( empty($id) ) {
		 return;
	 }

	 $markup = '';

	 if ( $slide ) { //this image will be used in a slideshow so no need for responsive images
		 $attachment_fields = get_post_custom( $id );
		 $image_full_size = wp_get_attachment_image_src( $id, 'full-size' );

		 //prepare the attachment fields
		 if ( !isset($attachment_fields['_wp_attachment_image_alt']) ) {
			 $attachment_fields['_wp_attachment_image_alt'] = array('');
		 } else {
			 $attachment_fields['_wp_attachment_image_alt'][0] = trim( strip_tags($attachment_fields['_wp_attachment_image_alt'][0]));
		 }
		 if ( !isset($attachment_fields['_video_autoplay'][0]) ) {
			 $attachment_fields['_video_autoplay'] = array('');
		 }

		 // prepare the video url if there is one
		 $video_url = ( isset($attachment_fields['_link_media_to'][0]) && $attachment_fields['_link_media_to'][0] == 'custom_video_url' && isset($attachment_fields['_video_url'][0]) && !empty( $attachment_fields['_video_url'][0]) ) ? esc_url( $attachment_fields['_video_url'][0] ) : '';

		 if ( !$ignore_video && !empty($video_url) ) {

			 // should the video auto play?
			 $video_autoplay = ( $attachment_fields['_link_media_to'][0] == 'custom_video_url' && $attachment_fields['_video_autoplay'][0] === 'on' ) ? 'on' : '';

			 $markup .= '<div class="' . (!empty($video_url) ? ' video' : '' ) . ( $video_autoplay == 'on' ? ' video_autoplay' : '' ) .'" itemscope itemtype="http://schema.org/ImageObject" ' . (!empty($video_autoplay) ? 'data-video_autoplay="'.$video_autoplay.'"' : '') . '>' . PHP_EOL;
			 $markup .= '<img src="' . $image_full_size[0] . '" class="rsImg" alt="' . $attachment_fields['_wp_attachment_image_alt'][0] . '" itemprop="contentURL" ' . (!empty($video_url) ? ' data-rsVideo="'.$video_url.'"' : '') . ' />' . PHP_EOL;
			 $markup .= '</div>';

		 } else { //just a simple image, no video

			 $markup .= '<img class="rsImg" src="' . $image_full_size[0] . '" alt="' . $attachment_fields['_wp_attachment_image_alt'][0] .'" />' . PHP_EOL;

		 }

	 } elseif ( wpgrade::option('use_responsive_images') ) {
		 $markup .= '<picture>' . PHP_EOL;
		 $markup .= '<!--[if IE 9]><video style="display: none;"><![endif]-->' . PHP_EOL;

		 //get all the dimensions
		 $image_small_size  = wp_get_attachment_image_src( $id, 'small-size' );
		 $image_medium_size = wp_get_attachment_image_src( $id, 'medium-size' );
		 $image_large_size  = wp_get_attachment_image_src( $id, 'large-size' );
		 $image_full_size = wp_get_attachment_image_src( $id, 'full-size' );


		 //use the large size for regular displays and the full size for retina
		 if ( isset( $image_large_size[0] ) ) {
			 $markup .= '<source srcset="' . $image_large_size[0];
			 //large viewport - retina
			 if ( isset( $image_full_size[0] ) ) {
				 $markup .= ', ' . $image_full_size[0] . ' 2x';
			 }
			 $markup .= '" media="(min-width: 1024px)">' . PHP_EOL;
		 }

		 //mobile devices larger (tablets maybe)
		 if ( isset( $image_medium_size[0] ) ) {
			 $markup .= '<source srcset="' . $image_medium_size[0];
			 //large viewport - retina
			 if ( isset( $image_large_size[0] ) ) {
				 $markup .= ', ' . $image_large_size[0] . ' 2x';
			 }
			 $markup .= '" media="(min-width: 600px)">' . PHP_EOL;
		 }

		 //mobile devices
		 if ( isset( $image_small_size[0] ) ) {
			 $markup .= '<source srcset="' . $image_small_size[0];
			 //large viewport - retina
			 if ( isset( $image_medium_size[0] ) ) {
				 $markup .= ', ' . $image_medium_size[0] . ' 2x';
			 }
			 $markup .= '" media="(min-width: 320px)">' . PHP_EOL;
		 }

		 // default
		 if ( isset( $image_medium_size[0] ) ) {
			 $markup .= '<source srcset="' . $image_medium_size[0] . '">' . PHP_EOL;
		 }
		 $markup .= '<!--[if IE 9]></video><![endif]-->' . PHP_EOL;
		 // the fallback - full size
		 if ( isset( $image_full_size[0] ) ) {
			 $markup .= '<img class="hero-bg--image" itemprop="image" srcset="' . $image_full_size[0] . '" alt="' . pile::get_img_alt( $id ) . '">' . PHP_EOL;
		 }
		 $markup .= '</picture>' . PHP_EOL;
	 } else {
		 //just use a decent sized image
		 $image_full_size = wp_get_attachment_image_src( $id, 'full-size' );
		 $markup .= '<img class="hero-bg--image" itemprop="image" src="' . $image_full_size[0] . '" alt="' . pile::get_img_alt( $id ) . '">' . PHP_EOL;
	 }

	 echo $markup;
 }