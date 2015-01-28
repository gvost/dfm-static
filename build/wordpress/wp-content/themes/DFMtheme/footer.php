		<div class="clear"></div>
		</div>
		<footer id="footer" class="the-footer" role="contentinfo">
				<div class="inner-footer">
					<div class="col-left">
						<div class="social-links">
							<div class="instagram">
								<a class="social-anchor" href="http://instagram.com/drawingfrommemory" target="_blank"><span>INSTAGRAM</span> #dfmla</a>
							</div>
							<div class="pinterest">
								<a class="social-anchor" href="http://www.pinterest.com/dfmla" target="_blank"><span>PINTEREST</span> dfmla</a>
							</div>
						</div>
					</div>
					<div class="col-right">
					<h3 class="tag-headline">Tags</h3>
					<ul>
						<?php
							$tags = get_tags();
							$html = '';
							foreach ( $tags as $tag ) {
								$tag_link = get_tag_link( $tag->term_id );
								$html .= '<li class="post_tags">';
								$html .= "<a href='{$tag_link}' title='{$tag->name} Tag' class='{$tag->slug}'>{$tag->name} ($tag->count)</a>";
								$html .= '</li>';
							}
							echo $html;
						?>
					</ul>
					</div>
				</div>
		</footer>
		</div>
		<?php wp_footer(); ?>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>
		<script src="/javascripts/application.js"></script>
		<script>
		var pinButton = $('[data-pin-href^="http"]');
			pinButton.attr('style', 'background-image:url("/images/pinit.png")!important;background-color:transparent!important;');
		</script>
	</body>
</html>