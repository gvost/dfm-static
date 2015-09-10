<?php
//post format specific
$post_format = get_post_format();
if ( empty( $post_format ) || $post_format == 'standard' ) {
	$post_format = '';
}
$post_format_class = '';
if ( ! empty( $post_format ) ) {
	$post_format_class = 'article-archive--' . $post_format;
};
?>

<a href="<?php the_permalink(); ?>" class="pile-item-wrap <?php echo $post_format_class; ?>">
	<?php if ( ! in_array( $post_format, array( 'quote' ) ) ): ?>
		<?php if ( has_post_thumbnail() ) : ?>
			<div class="entry__featured-image">
				<?php
				$id = get_post_thumbnail_id( get_the_ID() );
				$markup = '';

				if ( wpgrade::option('use_responsive_images') ) {
					$markup .= '<picture>' . PHP_EOL;
					$markup .= '<!--[if IE 9]><video style="display: none;"><![endif]-->' . PHP_EOL;

					$image_small_size  = wp_get_attachment_image_src( $id, 'small-size' );
					$image_medium_size = wp_get_attachment_image_src( $id, 'medium-size' );
					$image_large_size  = wp_get_attachment_image_src( $id, 'large-size' );
					//large viewport
					if ( isset( $image_small_size[0] ) ) {
						$markup .= '<source srcset="' . $image_small_size[0];
						//large viewport - retina
						if ( isset( $image_medium_size[0] ) ) {
							$markup .= ', ' . $image_medium_size[0] . ' 2x';
						}
						$markup .= '" media="(min-width: 999px)">' . PHP_EOL;
					}

					//mobile devices
					if ( isset( $image_medium_size[0] ) ) {
						$markup .= '<source srcset="' . $image_medium_size[0];
						//large viewport - retina
						if ( isset( $image_large_size[0] ) ) {
							$markup .= ', ' . $image_large_size[0] . ' 2x';
						}
						$markup .= '" media="(min-width: 385px)">' . PHP_EOL;
					}

					// default
					if ( isset( $image_small_size[0] ) ) {
						$markup .= '<source srcset="' . $image_small_size[0] . '">' . PHP_EOL;
					}
					$markup .= '<!--[if IE 9]></video><![endif]-->' . PHP_EOL;
					// the fallback - small size
					if ( isset( $image_small_size[0] ) ) {
						$markup .= '<img srcset="' . $image_small_size[0] . '" alt="' . pile::get_img_alt( $id ) . '">' . PHP_EOL;
					}
					$markup .= '</picture>' . PHP_EOL;
				} else {
					//just use a decent sized image
					$image_medium_size = wp_get_attachment_image_src( $id, 'medium-size' );
					$markup .= '<img src="' . $image_medium_size[0] . '" alt="' . pile::get_img_alt( $id ) . '">' . PHP_EOL;
				}

				echo $markup; ?>
			</div>
		<?php endif; ?>
		<h2 class="entry__title"><?php the_title(); ?></h2>
		<div class="entry__excerpt">
			<?php
			$allowed_tags = '<p><em><strong><i><br><h3><h4><h5><h6><blockquote><iframe><embed><object><script>';
			echo wpgrade_better_excerpt('', $allowed_tags);

			$read_more = wpgrade::option( 'blog_read_more_text' );
			if ( ! empty( $read_more ) ): ?>
				<span class="read-more-button"><?php echo $read_more ?></span>
			<?php endif; ?>
			<?php if ( wpgrade::option( 'blog_show_date' ) ) : ?>
				<span class="entry__date"><?php the_date( 'j F' ); ?></span>
			<?php endif; ?>
		</div>
	<?php else: /* we have a special post format */ { ?>
		<?php get_template_part( 'templates/post/post-formats-loop/' . $post_format ); ?>
	<?php } endif; ?>
	<div class="pile-item-border"></div>
</a>