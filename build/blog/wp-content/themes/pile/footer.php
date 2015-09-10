<?php
/**
 * The template for displaying the footer widget areas.
 * @package Pile
 * @since   Pile 1.0
 **/ ?>

	<footer class="site-footer">
		<aside class="sidebar  sidebar--footer">
			<div class="container">
				<?php get_template_part( 'sidebar-footer' ); ?>
			</div>
		</aside><!-- .sidebar.sidebar--footer -->
		<div class="copyright-area">
			<div class="container">
				<div class="footer-container">
					<?php $copyright_text = wpgrade::option( 'copyright_text' );
					if ( ! empty( $copyright_text ) ) : ?>
						<div class="copyright-text">
							<?php echo do_shortcode(wpgrade::option( 'copyright_text' )) ?>
						</div>
					<?php endif; ?>
				</div>
			</div>
		</div><!-- .copyright-area -->
	</footer><!-- .site--footer -->

</div><!-- .wrapper -->

<div class="pile-item-border"></div>

<?php wp_footer(); ?>
<script>
	jQuery('.icon-bars').on('click', function(e) {
		e.preventDefault();
		console.log('clicked menu');
	}
</script>
</body>
</html>