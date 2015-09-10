<?php

add_action('pile_djax_container_start', 'pile_djax_container_start', 10);

function pile_djax_container_start(){
	/**
	 * Display static content like:
	 * - a serialized list with the enqueued resources on page load
	 */
	do_action( wpgrade::shortname() . '_before_dynamic_content' );

	// start container
	echo '<div id="djaxContent" class="djax-updatable">';
}

/**
 * The use of this hook is deprecated.
 * We could replace it with a simple markup like "</div><!-- #djaxContent -->".
 * But we'll keep it cuz it looks useful.
 */
add_action('pile_djax_container_end', 'pile_djax_container_end', 10);
function pile_djax_container_end(){

	//echo do_action( 'pile_generate_dynamic_scripts' );

	// end the container
	echo '</div><!-- #djaxContent -->';
}

add_action( 'pile_before_dynamic_content', 'pile_before_dynamic_content', 10 );

function pile_before_dynamic_content() {

	/**
	 * Localize a static list with resourses already loaded on the first page load this lists will be filled on
	 * each d-jax request which has new resources
	 *
	 * Note: make this dependent to wpgrade-main-scripts because we know for sure it is there
	 */
	wp_localize_script( 'wpgrade-main-scripts', 'pile_static_resources', array(
		'scripts' => pile::get_queued_scripts(),
		'styles'  => pile::get_queued_styles()
	) );
}

add_action('wp_footer', 'pile_last_function', 999999999);

/**
 * Display dynamic generated data while running dJax requests :
 *
 * a script which will load others scripts on the run
 */
function pile_last_function(){
	/**
	 * Display dynamic generated data while runing d-jax requests :
	 *
	 * a script which will load others scripts on the run
	 */
	// let's try a crazy shit
	$dynamic_scripts = pile::get_queued_scripts();
	$dynamic_styles  = pile::get_queued_styles();?>
	<div id="djax_list_scripts_and_styles">
		<div id="pile_list_scripts_and_styles" class="djax-updatable">

		<script>
			(function ($) {
				// wait for all dom elements
				$(document).ready(function () {
					// run this only if we have resources
					if (!window.hasOwnProperty('pile_static_resources')) return;
					window.pile_dynamic_loaded_scripts = <?php echo json_encode( $dynamic_scripts ); ?>;
					window.pile_dynamic_loaded_styles = <?php echo json_encode( $dynamic_styles ); ?>;

					// run this only if we have resources
					if (!window.hasOwnProperty('pile_static_resources')) return;

					// pile_dynamic_loaded_scripts is generated in footer when all the scripts should be already enqueued
					$.each( window.pile_dynamic_loaded_scripts, function (key, url) {

						if (key in pile_static_resources.scripts) return;

						if (globalDebug) {console.dir("Scripts loaded dynamic");}
						if (globalDebug) {console.dir(key);}
						if (globalDebug) {console.log(url);}

						// add this script to our global stack so we don't enqueue it again
						pile_static_resources.scripts[key] = url;

						$.ajaxSetup({
							cache: true,
							async: false
						});

						$.getScript(url)
							.done(function (script, textStatus) {
								//console.log(textStatus);
							})
							.fail(function (jqxhr, settings, exception) {
								//if (globalDebug) {console.log('I failed');}
							});

						if (globalDebug) {console.groupEnd();}

						$(document).trigger('pile:page_scripts:loaded');
					});

					$.each( window.pile_dynamic_loaded_styles, function (key, url) {

						if (key in pile_static_resources.styles) return;

						if (globalDebug) {console.dir("Styles loaded dynamic");}
						if (globalDebug) {console.dir(key);}
						if (globalDebug) {console.log(url);}

						// add this style to our global stack so we don't enqueue it again
						pile_static_resources.styles[key] = url;

						// sorry no cache this time
						$.ajax({
							cache: true,
							async: false,
							url: url,
							dataType: 'html',
							success: function (data) {
								$('<style type="text/css">\n' + data + '</style>').appendTo("head");
							}
						});

						if (globalDebug) {console.groupEnd();}

						$(document).trigger('pile:page_styles:loaded');
					});
				});
			})(jQuery);
		</script>
		</div>
	</div>
<?php
}