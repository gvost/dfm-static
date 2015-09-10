<?php
/**
 * The template for displaying product content within loops.
 *
 * Override this template by copying it to yourtheme/woocommerce/content-product.php
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     1.6.4
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

global $product, $woocommerce_loop;

// Store loop count we're currently on
if ( empty( $woocommerce_loop['loop'] ) )
	$woocommerce_loop['loop'] = 0;

// Store column count for displaying the grid
if ( empty( $woocommerce_loop['columns'] ) )
	$woocommerce_loop['columns'] = apply_filters( 'loop_shop_columns', 4 );

// Ensure visibility
if ( ! $product || ! $product->is_visible() )
	return;

$pile_item_3d_class     = '';
$large_no               = wpgrade::option('pile_large_columns');
$medium_no              = wpgrade::option('pile_medium_columns');
$small_no               = wpgrade::option('pile_small_columns');

if ( ( floor( $woocommerce_loop['loop'] / $large_no ) + $woocommerce_loop['loop'] % $large_no ) % 2 ) {
	$pile_item_3d_class.= ' pile-item-large-3d';
}

if ( ( floor( $woocommerce_loop['loop'] / $medium_no ) + $woocommerce_loop['loop'] % $medium_no ) % 2 ) {
	$pile_item_3d_class.= ' pile-item-medium-3d';
}

if ( ( floor( $woocommerce_loop['loop'] / $small_no ) + $woocommerce_loop['loop'] % $small_no ) % 2 ) {
	$pile_item_3d_class.= ' pile-item-small-3d';
}

// Increase loop count
$woocommerce_loop['loop']++;

// Extra post classes
$classes = '';

	$imageClass = '';
	if (has_post_thumbnail()) {
		$attachment = wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), 'full' );

		if ($attachment[2] >= $attachment[1]) {
			$imageClass = 'pile-item--portrait';
		}
	} else $imageClass = 'no-image';

	$classes .= ' pile-item  pile-item--archive  one-whole  lap-one-half  desk-one-third  pile-item--product  ' . $imageClass . $pile_item_3d_class;
?>

<div <?php post_class($classes); ?>>
	<?php
//		$border_color = get_post_meta( get_the_ID(), wpgrade::prefix() . 'project_color', true );
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

			<?php do_action( 'woocommerce_before_shop_loop_item' ); ?>
			<a href="<?php the_permalink(); ?>" class="<?php the_ID(); ?>  pile-item-wrap <?php echo $imageClass ?>">

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

				<?php do_action( 'woocommerce_before_shop_loop_item_title' ); ?>
				<div class="pile-item-content">
					<div class="flexbox">
						<div class="flexbox__item">
							<h2 class="pile-item-title"><?php the_title(); ?></h2>
							<hr class="separator"/>
							<div class="pile-item-meta">
								<?php do_action( 'woocommerce_after_shop_loop_item_title' ); ?>
							</div>
						</div>
					</div>
				</div>
				<div class="pile-item-border" style="border-color: #ffffff;"></div>
			</a>
			<?php do_action( 'woocommerce_after_shop_loop_item' ); ?>

		<?php if ($image_is_portrait): ?>
		</div>
		<?php endif; ?>

	</div>

</div>