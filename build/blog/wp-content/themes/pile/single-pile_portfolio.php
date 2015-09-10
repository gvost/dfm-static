<?php
/**
 * The template for the single project view.
 * @package Pile
 * @since   Pile 1.0
 */

global $post;

get_header();

$builder_meta = get_post_meta( get_the_ID(), wpgrade::prefix() . 'project_builder', true );
$builder_meta = json_decode( $builder_meta );
$gallery_ids  = get_post_meta(get_the_ID(), wpgrade::prefix() . 'second_image', true);
$has_image    = ! empty($gallery_ids);
$order        = 0;

get_template_part( 'templates/portfolio/single-content/hero' ); //let there be heroes

	do_action( 'pile_djax_container_start' ); ?>

		<div class="site-content  js-transition--single">
			<div class="container cf">

			<?php if ( ! $has_image ): ?>
				<div class="title-wrapper">
					<h1><?php the_title(); ?></h1>
					<?php if ( wpgrade::option('portfolio_single_show_meta') ) get_template_part('templates/portfolio/single-content/meta-categories'); ?>
				</div>
			<?php endif;

			if ( ! empty( $builder_meta ) ) {

				$last_row = 1; ?>
				<div class="pile  pile--portfolio  js-gallery  pile--portfolio-single entry-content">

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

						<div class="pile-item  pile-item--single  size-<?php echo $block->size_x . ' one-whole  desk-' .$test_class . ' block_order-' . ++$order . ' pile-col-' . $block->col ;  ?> type-<?php echo $block->type ?>">
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
									$image_full_size = wp_get_attachment_image_src( $id, 'full-size' );
									$markup .= '<img src="' . $image_full_size[0] . '" alt="' . pile::get_img_alt( $id ) . '">' . PHP_EOL;
								}

								$link_media_to_value = get_post_meta( $id, "_link_media_to", true );

								// init some vars
								$link_class = $the_link = $link_target = $data_autoplay = '';

								switch ( $link_media_to_value ) {

									case 'media_file':
										$link_class = 'pile-item-link  mfp-image';
										$the_link = $image_full_size[0];
										break;

									case 'custom_image_url':
										$link_class = 'pile-item-link  mfp-image';
										$the_link =  get_post_meta( $id, "_custom_image_url", true );
										break;

									case 'custom_video_url':

										$video_autoplay = get_post_meta( $id, "_video_autoplay", true );
										$link_class = 'pile-item-link  mfp-video  mfp-iframe';
										$the_link =  get_post_meta( $id, "_video_url", true );

										if ( $video_autoplay == 'on' ) {
											$data_autoplay = 'data-autoplay="on"';
											$the_link .= '?autoplay=1';
										}

										break;

									case 'external':
										$link_class = 'pile-item-link external';
										$the_link =  get_post_meta( $id, "_external_url", true );
										$link_target = 'target="_blank"';
										break;

									default:
										break;
								}

								if ( empty( $the_link ) ) {
									echo $markup;
								} else {
									$attachment = get_post( $id );
									$title = $attachment->post_title;
									$description = $attachment->post_content;

									echo '<a href="' . $the_link . '" class="'. $link_class .'" ' . $link_target . ' data-title="' . $title . '" data-caption="' . $description . '" ' . $data_autoplay . '>' . $markup . '</a>';
								}

							} elseif ( $block->type == 'editor' ) {
								pile::display_content( $block->content );
							} ?>
						</div>
					<?php } /* endforeach */ ?>
				</div>
			<?php } /* endif */

			if ( wpgrade::option( 'portfolio_single_show_next_prev' ) || wpgrade::option( 'portfolio_single_show_share_links' ) ) : ?>

				<div class="pile  pile--portfolio  pile--portfolio-single">
					<?php if ( wpgrade::option( 'portfolio_single_show_next_prev' ) ) : $prev_post = get_next_post(); ?>
					<div class="pile-item  pile-item--single  pile-nav  pile-nav--prev  one-whole lap-one-third">
						<?php
						if ( empty( $prev_post ) ) {
							//it seems we are at the first project
							//then link to the last project so we go round and round
							$prev_post = pile::get_boundary_post(false,'',true);
						}

						if ( ! empty( $prev_post ) ) {
							$post = $prev_post;
							setup_postdata( $post );
							get_template_part( 'templates/portfolio/content-portfolio' );
							wp_reset_postdata();
						} ?>
					</div>

					<?php
					$share_class = '';
					if ( wpgrade::option( 'portfolio_single_show_share_links' ) ) {
							$share_class = "js-popup-share";
					} ?>
					<div class="pile-item  pile-item--single  pile-share <?php echo $share_class; ?> one-whole lap-one-third">

						<?php if ( wpgrade::option( 'portfolio_single_show_share_links' ) ) : ?>

						<div class="pile-item-wrap <?php if (!has_post_thumbnail()) { echo 'no-image'; } ?>">
							<?php if ( has_post_thumbnail() ) {
								the_post_thumbnail();
							} ?>
							<div class="pile-item-content">
								<div class="flexbox">
									<div class="flexbox__item">
										<h2 class="pile-item-title  js-share-source"><?php _e( 'Share', wpgrade::textdomain() ) ?></h2>
									</div>
								</div>
							</div>
						</div>

						<?php endif; ?>

					</div>
					<?php endif;
					if ( wpgrade::option(( 'portfolio_single_show_next_prev' )) ) : $next_post = get_previous_post(); ?>
					<div class="pile-item  pile-item--single  pile-nav  pile-nav--next  one-whole lap-one-third">
						<?php
						if ( empty( $next_post ) ) {
							//it seems we are at the first project
							//then link to the first project so we go round and round
							$next_post = pile::get_boundary_post(false,'',false);
						}

						if ( ! empty($next_post) ) {
							$post = $next_post;
							setup_postdata( $post );
							get_template_part( 'templates/portfolio/content-portfolio' );
							wp_reset_postdata();
						} ?>
					</div>

					<?php endif; ?>

				</div>

			<?php endif; ?>

			</div>
		</div>
		<?php if ( wpgrade::option( 'portfolio_single_show_share_links' ) ) : ?>
			<div class="addthis_toolbox addthis_default_style addthis_32x32_style"
			     addthis:url="<?php echo wpgrade_get_current_canonical_url(); ?>"
			     addthis:title="<?php wp_title('|', true, 'right'); ?>"
			     addthis:description="<?php echo trim(strip_tags(get_the_excerpt())) ?>" >
				<?php get_template_part('templates/core/addthis-social-popup'); ?>
			</div>
		<?php endif; ?>
	</div>

<?php get_footer();