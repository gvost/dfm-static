<?php

/* This file is property of Pixel Grade Media. You may NOT copy, or redistribute
 * it. Please see the license that came with your copy for more information.
 */

/**
 * Theme utility functions.
 * @package        wpgrade
 * @category       core
 * @author         Pixel Grade Team
 * @copyright  (c) 2013, Pixel Grade Media
 */
class pile {

	public static function display_content( $content = '' ) {
		$content = apply_filters( 'the_content', $content );

		// in case there is a shortcode
		echo do_shortcode( $content );
	}

	/**
	 * Display the comments number
	 */
	static function comments_number() {

		$num_comments = self::get_comments_number();

		echo (int) $num_comments;

	}

	/**
	 * Get the number of comments for the current posts
	 * This needs to be inside a loop
	 * @return int
	 */
	static function get_comments_number() {
		return get_comments_number(); // get_comments_number returns only a numeric value
	}


	/**
	 * get youtube video ID from URL
	 *
	 * @param string $url
	 *
	 * @return string Youtube video id or FALSE if none found.
	 */
	static function youtube_id_from_url( $url ) {
		$pattern = '#(?:https?://)?(?:www\.)?(?:youtu\.be/|youtube\.com(?:/embed/|/v/|/watch\?v=|/watch\?.+&v=))([\w-]{11})(?:.+)?#x';
		$result  = preg_match( $pattern, $url, $matches );

		if ( false != $result ) {
			return $matches[1];
		}

		return false;
	}

	static function vimeo_id_from_url( $url ) {
		$pattern = '/\/\/(www\.)?vimeo.com\/(\d+)($|\/)/';
		preg_match( $pattern, $url, $matches );
		if ( count( $matches ) ) {
			return $matches[2];
		}

		return '';
	}

	/**
	 * Get an array with all queued scripts
	 *
	 * @return array
	 */
	static function get_queued_scripts() {
		global $wp_scripts;

		$loading_scripts = array();
		foreach ( $wp_scripts->queue as $key => $handle ) {

			// ensure a proper script src ( highjacked from wordpress core )
			$src = $wp_scripts->registered[ $handle ]->src;

			if ( !preg_match('|^(https?:)?//|', $src) && ! ( $wp_scripts->content_url && 0 === strpos($src, $wp_scripts->content_url) ) ) {
				$src = $wp_scripts->base_url . $src;
			}

			$loading_scripts[ $handle ] = $src;
		}

		return $loading_scripts;
	}

	/**
	 * Get an array with all queued styles
	 *
	 * @return array
	 */
	static function get_queued_styles() {
		global $wp_styles;

		$loading_styles = array();
		foreach ( $wp_styles->queue as $key => $handle ) {

			// ensure a proper script src ( highjacked from wordpress core )
			$src = $wp_styles->registered[ $handle ]->src;

			if ( !preg_match('|^(https?:)?//|', $src) && ! ( $wp_styles->content_url && 0 === strpos($src, $wp_styles->content_url) ) ) {
				$src = $wp_styles->base_url . $src;
			}

			$loading_styles[ $handle ] = $src;
		}
		return $loading_styles;
	}

	/**
	 * Checks if a post type object needs password aproval
	 * @return if the form was submited it returns an array with the success status and a message
	 */

	static function is_password_protected() {
		global $post;
		$private_post = array( 'allowed' => false, 'error' => '' );

		if ( isset( $_POST['submit_password'] ) ) { // when we have a submision check the password and its submision
			if ( isset( $_POST['submit_password_nonce'] ) && wp_verify_nonce( $_POST['submit_password_nonce'], 'password_protection' ) ) {
				if ( isset ( $_POST['post_password'] ) && ! empty( $_POST['post_password'] ) ) { // some simple checks on password
					// finally test if the password submitted is correct
					if ( $post->post_password === $_POST['post_password'] ) {
						$private_post['allowed'] = true;

						// ok if we have a correct password we should inform wordpress too
						// otherwise the mad dog will put the password form again in the_content() and other filters
						global $wp_hasher;
						if ( empty( $wp_hasher ) ) {
							require_once( ABSPATH . 'wp-includes/class-phpass.php' );
							$wp_hasher = new PasswordHash( 8, true );
						}
						setcookie( 'wp-postpass_' . COOKIEHASH, $wp_hasher->HashPassword( stripslashes( $_POST['post_password'] ) ), 0, COOKIEPATH );

					} else {
						$private_post['error'] = '<h4 class="text--error">Wrong Password</h4>';
					}
				}
			}
		}

		if ( isset( $_COOKIE[ 'wp-postpass_' . COOKIEHASH ] ) && get_permalink() == wp_get_referer() ) {
			$private_post['error'] = '<h4 class="text--error">Wrong Password</h4>';
		}

		return $private_post;
	}


	/** Limit words for a string */

	static function limit_words( $string, $word_limit, $more_text = ' [&hellip;]' ) {
		$words  = explode( " ", $string );
		$output = implode( " ", array_splice( $words, 0, $word_limit ) );

		//check fi we actually cut something
		if ( count( $words ) > $word_limit ) {
			$output .= $more_text;
		}

		return $output;
	}


	static function get_post_format_first_image_src() {
		global $post;
		$first_img = '';
		ob_start();
		ob_end_clean();
		$output    = preg_match_all( '/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post->post_content, $matches );
		$first_img = $matches[1][0];

		if ( empty( $first_img ) ) { //Defines a default image
			$first_img = wpgrade::uri( "/assets/img/default.jpg" );
		}

		return $first_img;
	}


	/**
	 * Returns the URL from the post.
	 * Falls back to the post permalink if no URL is found in the post.
	 * @return string The Link format URL.
	 */
	static function get_content_link_url() {
		$content = get_the_content();
		$has_url = get_url_in_content( $content );

		return ( $has_url ) ? $has_url : apply_filters( 'the_permalink', get_permalink() );
	}

	static function featured_image_as_style_bg( $size = 'full', $additional_css = '' ) {

		global $post;

		if ( has_post_thumbnail( $post->ID ) ) {
			$image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), $size );
			if ( ! empty( $image[0] ) ) {
				$style = ' style="background-image: url(' . $image[0] . '); ' . $additional_css . '"';

				return $style;
			}
		}

		return '';
	}

	static function get_gallery_type( $post_id ) {

		$template = get_post_meta( $post_id, wpgrade::prefix() . 'gallery_template', true );

		if ( $template == 'slideshow' ) {
			return $template;
		} else {
			return get_post_meta( $post_id, wpgrade::prefix() . 'grid_thumbnails', true );
		}

		return '';
	}

	static function the_archive_title() {

		$object = get_queried_object();

		if ( is_home() ) { ?>
			<h1 class="archive-title">
				<?php  if ( isset( $object->post_title ) ) {
					echo $object->post_title;
				} else {
					_e( 'News', wpgrade::textdomain() );
				} ?>
			</h1>
		<?php } elseif ( is_search() ) { ?>
			<h1 class="archive-title"><?php _e( 'Search Results for: ', wpgrade::textdomain() );
				echo get_search_query(); ?></h1>
		<?php } elseif ( is_tag() ) { ?>
			<h1 class="archive-title"><?php echo single_tag_title( 'Tag: ', false ); ?></h1>
		<?php } elseif ( ! empty( $object ) && isset( $object->term_id ) ) { ?>
			<h1 class="archive-title"><?php _e( 'Category: ', wpgrade::textdomain() );
				echo $object->name; ?></h1>
		<?php } elseif ( is_day() ) { ?>
			<h1 class="archive-title"><?php _e( 'Daily Archives: ', wpgrade::textdomain() );
				echo get_the_date(); ?></h1>
		<?php } elseif ( is_month() ) { ?>
			<h1 class="archive-title"><?php _e( 'Monthly Archives: ', wpgrade::textdomain() );
				echo get_the_date( _x( 'F Y', 'monthly archives date format', wpgrade::textdomain() ) ); ?></h1>
		<?php } elseif ( is_year() ) { ?>
			<h1 class="archive-title"><?php _e( 'Yearly Archives: ', wpgrade::textdomain() );
				echo get_the_date( _x( 'Y', 'yearly archives date format', wpgrade::textdomain() ) ); ?></h1>
		<?php } else { ?>
			<h1 class="archive-title"><?php _e( 'Archives', wpgrade::textdomain() ) ?></h1>
		<?php
		}
	}

	/**
	 * Display a filter box for the given taxonomy
	 *
	 * @param $taxonomy_name string
	 */

	static function display_filter_box( $taxonomy_name, $style = 'horizontal' ) {

		// Custom post archive Filter Button
		$filter_categories = get_terms( $taxonomy_name );
		if ( ! empty( $filter_categories ) && ! is_wp_error( $filter_categories ) ) {
			?>
			<div class="flexbox  archive-categories-wrapper">
				<div class="flexbox__item">
					<?php if ( $style == 'dropdown' ) : ?>
						<div class="pix-dropdown  up  border-menu">
							<a class="dropdown__trigger" href="#"><?php echo __( 'Filter', wpgrade::textdomain() ) ?>
								<span class="arrow"></span></a>
							<ul class="dropdown__menu  nav  nav--banner  archive-categories-list  border-menu">
								<?php foreach ( $filter_categories as $key => $category ) { ?>
									<li class="category-item archive__filter-item">
										<a href="#" title="<?php echo sprintf( __( "View all in %s", wpgrade::textdomain() ), $category->name ); ?>" data-filter="<?php echo '.cat-' . $category->slug; ?>"><?php echo $category->name; ?></a>
									</li>
								<?php } ?>
								<li class="category-item archive__filter-item" data-filter="all">
									<a href="#" title="<?php echo __( 'View all', wpgrade::textdomain() ) ?>" data-filter="*"><?php _e( 'View All', wpgrade::textdomain() ); ?></a>
								</li>
							</ul>
						</div>
					<?php else: ?>
						<ul class="dropdown__menu  nav  nav--banner  archive-categories-list  border-menu">
							<?php foreach ( $filter_categories as $key => $category ) { ?>
								<li class="category-item archive__filter-item">
									<a href="#" title="<?php echo sprintf( __( "View all in %s", wpgrade::textdomain() ), $category->name ); ?>" data-filter="<?php echo '.cat-' . $category->slug; ?>"><?php echo $category->name; ?></a>
								</li>
							<?php } ?>
							<li class="category-item archive__filter-item" data-filter="all">
								<a href="#" title="<?php echo __( 'View all', wpgrade::textdomain() ) ?>" data-filter="*"><?php _e( 'View All', wpgrade::textdomain() ); ?></a>
							</li>
						</ul>
					<?php endif; ?>
				</div>
			</div>
		<?php
		}
	}

	static function get_terms_as_string( $taxonomy_name, $field = 'name', $separator = ' ' ) {

		$return = '';
		$terms  = get_terms( $taxonomy_name );
		$last   = count( $terms );

		if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
			foreach ( $terms as $key => $term ) {

				if ( $field == 'name' ) {
					$return .= $term->name;
				} elseif ( $field == 'slug' ) {
					$return .= $term->slug;
				} else {
					continue;
				}

				if ( $last != $key ) {
					$return .= $separator;
				}
			}
		}

		return $return;
	}

	static function get_edit_url() {
		global $wp_the_query;
		$current_object = $wp_the_query->get_queried_object();

		$theID = false;
		if ( ! empty( $current_object->post_type ) && ( $post_type_object = get_post_type_object( $current_object->post_type ) ) && current_user_can( 'edit_post', $current_object->ID ) && $post_type_object->show_ui && $post_type_object->show_in_admin_bar ) {
			$theID = $current_object->ID;
		} elseif ( ! empty( $current_object->taxonomy ) && ( $tax = get_taxonomy( $current_object->taxonomy ) ) && current_user_can( $tax->cap->edit_terms ) && $tax->show_ui ) {
			$theID = $current_object->term_id;
		}

		if ( $theID ) {
			return get_edit_post_link( $theID );
		}

		return '';
	}


	/**
	 * We check if there is a gallery meta data, then a gallery shortcode in the content, extract it and
	 * display it in the form of a slideshow.
	 */
	static function gallery_slideshow( $current_post, $template = null, $size = 'medium-size' ) {
		if ( $template === null ) {

			$image_scale_mode     = get_post_meta( $current_post->ID, wpgrade::prefix() . 'post_image_scale_mode', true );
			$slider_transitionSpeed   = get_post_meta( $current_post->ID, wpgrade::prefix() . 'post_slider_transition_speed', true );
			$slider_autoplay      = get_post_meta( $current_post->ID, wpgrade::prefix() . 'post_slider_autoplay', true );
			if ( $slider_autoplay ) {
				$slider_delay = get_post_meta( $current_post->ID, wpgrade::prefix() . 'post_slider_delay', true );
			}
			$template = '<div class="wp-gallery" data-royalslider data-autoHeight data-customarrows data-sliderpauseonhover data-slidertransition="fade" data-slidertransitionspeed="' . $slider_transitionSpeed . '" ';
			$template .= ' data-imagescale="' . $image_scale_mode . '" ';

			if ( $slider_autoplay ) {
				$template .= ' data-sliderautoplay="" ';
				$template .= ' data-sliderdelay="' . $slider_delay . '" ';
			}
			if ( $image_scale_mode != 'fill' ) {
				$template .= ' data-imagealigncenter ';
			}
			if ( wpgrade::option( 'show_title_caption_popup' ) == 1 ) {
				$template .= ' data-enable_caption=""';
			}
			$template .= '>:gallery</div>';
		}

		// first check if we have a meta with a gallery
		$gallery_ids = get_post_meta( $current_post->ID, wpgrade::prefix() . 'main_gallery', true );

		if ( ! empty( $gallery_ids ) ) {
			//recreate the gallery shortcode
			$gallery = '[gallery ids="' . $gallery_ids . '"]';

			if ( strpos( $gallery, 'style' ) === false ) {
				$gallery = str_replace( "]", " style='big_thumb' size='" . $size . "' link='file']", $gallery );
			}

			$shrtcode = do_shortcode( $gallery );
			//var_dump( $template, $shrtcode );
			//			$shrtcode = preg_replace('/(<dd class="wp-caption-text gallery-caption">.+?)+(<\/dd>)/i', '', $shrtcode);
			if ( ! empty( $shrtcode ) ) {

				return strtr( $template, array( ':gallery' => $shrtcode ) );
			} else {
				return null;
			}
		} else { // empty gallery_ids
			// search for the first gallery shortcode
			$gallery_matches = null;
			preg_match( "!\[gallery.+?\]!", $current_post->post_content, $gallery_matches );

			if ( ! empty( $gallery_matches ) ) {
				$gallery = $gallery_matches[0];

				if ( strpos( $gallery, 'style' ) === false ) {
					$gallery = str_replace( "]", " style='big_thumb' size='" . $size . "' link='file']", $gallery );
				}
				$shrtcode = do_shortcode( $gallery );
				if ( ! empty( $shrtcode ) ) {
					return strtr( $template, array( ':gallery' => $shrtcode ) );
				} else {
					return null;
				}
			} else { // gallery_matches is empty
				return null;
			}
		}
	}

	//our version supports a second parameter
	static function get_sidebar( $name = null, $require_once = true ) {
		do_action( 'get_sidebar', $name );

		$templates = array();
		$name      = (string) $name;
		if ( '' !== $name ) {
			$templates[] = "sidebar-{$name}.php";
		}

		$templates[] = 'sidebar-menu.php';

		// Backward compat code will be removed in a future release
		if ( '' == locate_template( $templates, true, $require_once ) ) {
			load_template( ABSPATH . WPINC . '/theme-compat/sidebar-menu.php' );
		}
	}

	/**
	 * Echo author page link
	 * @return bool|string
	 */
	static function the_author_posts_link() {
		global $authordata;
		if ( ! is_object( $authordata ) ) {
			return false;
		}
		$link = sprintf( '<a href="%1$s" title="%2$s">%3$s</a>', esc_url( get_author_posts_url( $authordata->ID, $authordata->user_nicename ) ), esc_attr( sprintf( __( 'Posts by %s', wpgrade::textdomain() ), get_the_author() ) ), get_the_author() );

		/**
		 * Filter the link to the author page of the author of the current post.
		 * @since 2.9.0
		 *
		 * @param string $link HTML link.
		 */
		echo apply_filters( 'the_author_posts_link', $link );
	}

	static function page_has_children() {
		global $post;

		$pages = get_pages( 'child_of=' . $post->ID );

		return count( $pages );
	}
	/**
	 * Retrieve boundary post. - Extended by us to also keep notice of the current post post type
	 *
	 * Boundary being either the first or last post by publish date within the constraints specified
	 * by $in_same_term or $excluded_terms.
	 *
	 * @since 2.8.0
	 *
	 * @param bool         $in_same_term   Optional. Whether returned post should be in a same taxonomy term.
	 * @param array|string $excluded_terms Optional. Array or comma-separated list of excluded term IDs.
	 * @param bool         $start          Optional. Whether to retrieve first or last post.
	 * @param string       $taxonomy       Optional. Taxonomy, if $in_same_term is true. Default 'category'.
	 * @return mixed Array containing the boundary post object if successful, null otherwise.
	 */
	static function get_boundary_post( $in_same_term = false, $excluded_terms = '', $start = true, $taxonomy = 'category' ) {
		//get rid of the action added by Simple Custom Post Order - naughty naughty
		//it breaks our ordering
		global $scporder;
		if ( isset($scporder) ) {
			remove_action( 'pre_get_posts', array ($scporder, 'scporder_pre_get_posts') );
		}

		$post = get_post();
		if ( ! $post || ! is_single() || is_attachment() || ! taxonomy_exists( $taxonomy ) )
			return null;

		$query_args = array(
			'posts_per_page' => 1,
			'update_post_term_cache' => false,
			'update_post_meta_cache' => false,
			'post_type' => $post->post_type,
			'orderby' => array ('menu_order' => $start ? 'DESC' : 'ASC', 'date' => $start ? 'ASC' : 'DESC')
		);

		$term_array = array();

		if ( ! is_array( $excluded_terms ) ) {
			if ( ! empty( $excluded_terms ) )
				$excluded_terms = explode( ',', $excluded_terms );
			else
				$excluded_terms = array();
		}

		if ( $in_same_term || ! empty( $excluded_terms ) ) {
			if ( $in_same_term )
				$term_array = wp_get_object_terms( $post->ID, $taxonomy, array( 'fields' => 'ids' ) );

			if ( ! empty( $excluded_terms ) ) {
				$excluded_terms = array_map( 'intval', $excluded_terms );
				$excluded_terms = array_diff( $excluded_terms, $term_array );

				$inverse_terms = array();
				foreach ( $excluded_terms as $excluded_term )
					$inverse_terms[] = $excluded_term * -1;
				$excluded_terms = $inverse_terms;
			}

			$query_args[ 'tax_query' ] = array( array(
				'taxonomy' => $taxonomy,
				'terms' => array_merge( $term_array, $excluded_terms )
			) );
		}

		$result = get_posts( $query_args );

		//we don't want an array
		if ( isset($result[0]) ) return $result[0];

		return $result;
	}
	
	static function add_srcset_element($image) {

		$sizes = array('small-size', 'medium-size', 'large-size', 'full-size');
		$arr = array();
		$get_sizes = wp_get_attachment_metadata($image);

		foreach($sizes as $size) {
			$image_src = wp_get_attachment_image_src($image, $size);

			if(array_key_exists($size, $get_sizes['sizes'])) {
				$image_size = $get_sizes['sizes'][$size]['width'];
				$arr[] = $image_src[0] . ' ' . $image_size . 'w';
			}
		}

		return implode(', ', $arr);
	}

	// Get Image Alt - Used for Picturefill
	static function get_img_alt( $image ) {
		$img_alt = trim( strip_tags( get_post_meta( $image, '_wp_attachment_image_alt', true ) ) );
		return $img_alt;
	}

} // class pile

function custom_warning_handler( $errno, $errstr ) {
	// do something - nothing right now
}
