<?php
/**
 * The template for the branding of the header area (logo, site title, etc).
 * @package Pile
 * @since   Pile 1.0
 */
?>
<div class="site-branding">
	<?php if ( wpgrade::image_src( 'main_logo_light' ) ):
		$retina_logo_light = wpgrade::image_src( 'retina_main_logo_light' ); ?>
		<div class="site-title site-title--image">
			<a class="site-logo  site-logo--image<?php if ( wpgrade::option( 'use_retina_logo' ) && ! empty( $retina_logo_light ) ) {
				echo "  site-logo--image-2x";
			} ?>" href="<?php echo home_url(); ?>" title="<?php echo get_bloginfo('name') . ' | ' . get_bloginfo('description') ?>" rel="home">
				<?php $data_retina_logo_light = ( wpgrade::option( 'use_retina_logo' ) && ! empty( $retina_logo_light ) ) ? 'data-logo2x="' . $retina_logo_light . '"' : ''; ?>
				<img class="site-logo-img--dark" src="<?php echo wpgrade::image_src( 'main_logo_light' ); ?>" <?php echo $data_retina_logo_light; ?> rel="logo" alt="<?php echo get_bloginfo('name') . ' | ' . get_bloginfo('description') ?>"/>

				<?php if ( wpgrade::image_src( 'main_logo_dark' ) ):
					$retina_logo_dark      = wpgrade::image_src( 'retina_main_logo_dark' );
					$data_retina_logo_dark = ( wpgrade::option( 'use_retina_logo' ) && ! empty( $retina_logo_dark ) ) ? 'data-logo2x="' . $retina_logo_dark . '"' : ''; ?>
					<img class="site-logo-img--light" src="<?php echo wpgrade::image_src( 'main_logo_dark' ); ?>" <?php echo $data_retina_logo_dark; ?> rel="logo" alt="<?php echo get_bloginfo('name') . ' | ' . get_bloginfo('description') ?>"/>
				<?php endif; ?>
			</a>
		</div>
	<?php else: ?>
		<h1 class="site-title site-title--text">
			<a class="site-logo  site-logo--text" href="<?php echo home_url() ?>" rel="home">
				<?php bloginfo( 'name' ) ?>
			</a>
		</h1>
	<?php endif; ?>
</div>