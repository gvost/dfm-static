<?php
/**
 * The template for a single slide of the hero area of the portfolio archive page.
 *
 * @package Pile
 * @since   Pile 1.0
 */
global $post;

//get the presentation gallery if present
$gallery_ids         = get_post_meta( get_the_ID(), wpgrade::prefix() . 'second_image', true );

//now lets get the image (either from the presentation gallery or the featured image
// if there are second images, use them
if ( ! empty( $gallery_ids ) ) {
	$ids = explode(',', $gallery_ids);
	if ( ! empty($ids) ) {
		$thumbnail_ID = $ids[0];
	}
} else {
	// fallback to featured image
	$thumbnail_ID = get_post_thumbnail_id( get_the_ID() );
}

//and now the title and some other info ?>
<div class="rsContent">

	<?php pile_the_hero_image($thumbnail_ID, true, true); ?>

	<div class="hero-content">
		<h1 class="hero-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1>
		<?php get_template_part( 'templates/portfolio/single-content/meta-categories' ); ?>
	</div>
</div>