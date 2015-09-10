<?php
/**
 * Template Name: Page Builder
 * @package Pile
 * @since   Pile 1.0
 */

get_header();

global $post;

$builder_meta = get_post_meta( get_the_ID(), wpgrade::prefix() . 'page_builder', true );
$builder_meta = json_decode( $builder_meta );
$order        = 0;

get_template_part( 'templates/post/single-content/hero' );

$has_image = has_post_thumbnail();

do_action( 'pile_djax_container_start' ); ?>
	<div class="site-content">
		<div class="container cf">

			<?php if ( ! $has_image ): ?>
				<div class="title-wrapper">
					<h1 class="archive-title"><?php the_title(); ?></h1>
					<hr class="separator separator"/>
				</div>
			<?php endif;

			if ( post_password_required() ) :

				echo get_the_password_form();

			else :

			if ( ! empty( $builder_meta ) ) {

				$last_row = 1; ?>
				<div class="pile  pile--portfolio entry-content">
					<?php foreach ( $builder_meta as $i => $block ) {

						// force row markup
						if ( $block->row > $last_row ) {
							echo '<br />';
							$last_row = $block->row;
						}

						// just testing sizes
						switch ( $block->size_x ) {
							case 1:
								$test_class = 'one-fifth';
								break;
							case 2:
								$test_class = 'one-third';
								break;
							case 3:
								$test_class = 'one-half';
								break;
							case 4:
								$test_class = 'two-thirds';
								break;
							case 5:
								$test_class = 'four-fifths';
								break;
							case 6:
								$test_class = 'one-whole';
								break;
							default:
								$test_class = 'one-whole';
								break;
						} ?>
						<div class="pile-item  pile-item--single  size-<?php echo $block->size_x . ' ' .$test_class . ' block_order-' . ++$order ;  ?> type-<?php echo $block->type ?>">
							<?php if ( $block->type == 'image' ) {
								$id = $block->content;
								$markup = '';

								if ( wpgrade::option('use_responsive_images') ) {
									$markup .= '<picture>' . PHP_EOL;
									$markup .= '<!--[if IE 9]><video style="display: none;"><![endif]-->' . PHP_EOL;

									//get all the dimensions
									$image_small_size  = wp_get_attachment_image_src( $id, 'small-size' );
									$image_medium_size = wp_get_attachment_image_src( $id, 'medium-size' );
									$image_large_size  = wp_get_attachment_image_src( $id, 'large-size' );
									$image_full_size = wp_get_attachment_image_src( $id, 'full' );

									// and now for the sizes
									switch ( $block->size_x ) {
										case 1: //one fifth
										case 2: //one third
											//use the small size for regular displays and the medium for retina
											if ( isset( $image_small_size[0] ) ) {
												$markup .= '<source srcset="' . $image_small_size[0];
												//large viewport - retina
												if ( isset( $image_medium_size[0] ) ) {
													$markup .= ', ' . $image_medium_size[0] . ' 2x';
												}
												$markup .= '" media="(min-width: 999px)">' . PHP_EOL;
											}
											break;
										case 3: //one half
										case 4: // two thirds
											//use the medium size for regular displays and the large for retina
											if ( isset( $image_medium_size[0] ) ) {
												$markup .= '<source srcset="' . $image_medium_size[0];
												//large viewport - retina
												if ( isset( $image_large_size[0] ) ) {
													$markup .= ', ' . $image_large_size[0] . ' 2x';
												}
												$markup .= '" media="(min-width: 999px)">' . PHP_EOL;
											}
											break;
										case 5: //four fifths
										case 6: //one whole
										default:
											//use the large size for regular displays and the full size for retina
											if ( isset( $image_large_size[0] ) ) {
												$markup .= '<source srcset="' . $image_large_size[0];
												//large viewport - retina
												if ( isset( $image_full_size[0] ) ) {
													$markup .= ', ' . $image_full_size[0] . ' 2x';
												}
												$markup .= '" media="(min-width: 999px)">' . PHP_EOL;
											}
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
									// the fallback - full size
									if ( isset( $image_full_size[0] ) ) {
										$markup .= '<img srcset="' . $image_full_size[0] . '" alt="' . pile::get_img_alt( $id ) . '">' . PHP_EOL;
									}
									$markup .= '</picture>' . PHP_EOL;
								} else {
									//just use a decent sized image
									$image_full_size = wp_get_attachment_image_src( $id, 'full' );
									$markup .= '<img src="' . $image_full_size[0] . '" alt="' . pile::get_img_alt( $id ) . '">' . PHP_EOL;
								}

								echo $markup;
							} elseif ( $block->type == 'editor' ) {
								pile::display_content( $block->content );
							} ?>
						</div>
					<?php } /* endforeach */ ?>
				</div>
			<?php } else {

				get_template_part( 'templates/no-results' );
			}

			endif; // if ( post_password_required() )

			/* Restore original Post Data */
			wp_reset_postdata(); ?>

		</div>
	</div>
<?php

do_action('pile_djax_container_end' );

get_footer();
