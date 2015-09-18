<?php
/**
 * The template for displaying each project in the portfolio archive.
 * @package Pile
 * @since   Pile 1.0
 */

global $post;

$border_color = get_post_meta( get_the_ID(), wpgrade::prefix() . 'project_color', true );
$image_is_portrait = false;
$imageClass = '';
if ( has_post_thumbnail() ) {
	$attachment = wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), 'full' );
	if ( $attachment[2] >= $attachment[1] ) {
		$image_is_portrait = true;
	}
} else {
	$imageClass = 'no-image';
}
?>

<div class="pile-item-even-spacing">

	<?php if ($image_is_portrait): ?>
	<div class="pile-item-portrait-spacing">
	<?php endif; ?>

		<a href="<?php the_permalink(); ?>" class="<?php the_ID() ?> pile-item-wrap <?php echo $imageClass ?>">

			<?php if ( has_post_thumbnail() ) {
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

				echo $markup;
			} ?>

			<div class="pile-item-content">
				<div class="flexbox">
					<div class="flexbox__item">
						<h2 class="pile-item-title"><?php the_title(); ?></h2>
						<hr class="separator"/>
						<div class="pile-item-meta">
							<?php
							$categories = get_the_terms( get_the_ID(), wpgrade::shortname() . '_portfolio_categories' );
							if ( ! is_wp_error( $categories ) && ! empty( $categories ) ):
								echo '<ul class="meta-list--categories">' . PHP_EOL;
								foreach ( $categories as $category ) {
									echo '<li class="meta-list__item">' . $category->name . '</li>' . PHP_EOL;
								};
								echo '</ul>' . PHP_EOL;
							endif ?>
						</div>
					</div>
				</div>
			</div>
			<div class="pile-item-border" style="border-color: <?php echo $border_color; ?>"></div>
		</a>

	<?php if ($image_is_portrait): ?>
	</div>
	<?php endif; ?>

</div>