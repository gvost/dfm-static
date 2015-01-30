<?php get_header(); ?>
	<div class="content">
		<div class="top-container">
			<section id="content" role="main">
					<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
					<?php get_template_part( 'entry' ); ?>
					
					<?php endwhile; endif; ?>
				<footer class="footer">
					<?php get_template_part( 'nav', 'below-single' ); ?>
				</footer>
			</section>
<?php get_sidebar(); ?>
<?php get_footer(); ?>