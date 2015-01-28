<?php get_header(); ?>
<div id="main" class="hfeed">
		
	<div class="top-background"></div>
	<div class="content">
	<div class="top-container">
    <div class="top-insert-outline">
      <div class="top-insert">
        <h1>Blog</h1>
        <h4>Art, Design, Dreams, Fashion, Inspireation, Interiors, Installation, Photography: <br>A visual journal of what we are influenced by and what inspires us as creatives. </h4>
      </div>
    </div>
	
	<section id="posts" role="main">
		<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
		<?php get_template_part( 'entry' ); ?>
		<?php endwhile; endif; ?>
		<?php get_template_part( 'nav', 'below' ); ?>
	</section>
	
<?php get_footer(); ?>