<?php
/**
 * Woocommerce support
 * If woocommerce is active and is required woo support then load tehm all
 */
if ( !in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) return;

add_theme_support( 'woocommerce' );

/**
 * Assets
 */
function wpgrade_callback_load_woocommerce_assets(){

	// enqueue this script on all pages
	if ( !wpgrade::option('enable_woocommerce_support', '0') ) return;

	global $woocommerce;

	wp_enqueue_style( 'woocommerce_chosen_styles', WC()->plugin_url() . '/assets/css/chosen.css' );
	$lightbox_en          = get_option( 'woocommerce_enable_lightbox' ) == 'yes' ? true : false;

	if ($lightbox_en) {
		wp_enqueue_style('woocommerce_prettyPhoto_css');
	}

	wp_enqueue_style('wpgrade-woocommerce', get_template_directory_uri() . '/assets/css/woocommerce.css', array('wpgrade-main-style', 'woocommerce_chosen_styles'), wpgrade::cachebust_string(wpgrade::themefilepath('assets/css/woocommerce.css')) );
	wp_enqueue_script('wpgrade-woocommerce', get_template_directory_uri() . '/assets/js/woocommerce.js', array('jquery', 'jquery-cookie', 'chosen'), wpgrade::cachebust_string(wpgrade::themefilepath('assets/js/woocommerce.js')), true );

	$assets_path          = str_replace( array( 'http:', 'https:' ), '', WC()->plugin_url() ) . '/assets/';

	$woocommerce_params['locale'] = json_encode( WC()->countries->get_country_locale() );

	// Variables for JS scripts
	wp_localize_script( 'wpgrade-woocommerce', 'woocommerce_params', apply_filters( 'woocommerce_params', array(
		'ajax_url'        => WC()->ajax_url(),
		'ajax_loader_url' => apply_filters( 'woocommerce_ajax_loader_url', $assets_path . 'images/ajax-loader@2x.gif' ),
	) ) );

	wp_localize_script( 'wpgrade-woocommerce', 'wc_single_product_params', apply_filters( 'wc_single_product_params', array(
		'i18n_required_rating_text' => esc_attr__( 'Please select a rating', 'woocommerce' ),
		'review_rating_required'    => get_option( 'woocommerce_review_rating_required' ),
	) ) );

	wp_localize_script( 'wpgrade-woocommerce', 'wc_checkout_params', apply_filters( 'wc_checkout_params', array(
		'ajax_url'                  => WC()->ajax_url(),
		'ajax_loader_url'           => apply_filters( 'woocommerce_ajax_loader_url', $assets_path . 'images/ajax-loader@2x.gif' ),
		'update_order_review_nonce' => wp_create_nonce( "update-order-review" ),
		'apply_coupon_nonce'        => wp_create_nonce( "apply-coupon" ),
		'option_guest_checkout'     => get_option( 'woocommerce_enable_guest_checkout' ),
		'checkout_url'              => esc_url( add_query_arg( 'action', 'woocommerce_checkout', WC()->ajax_url() ) ),
		'is_checkout'               => is_page( wc_get_page_id( 'checkout' ) ) && empty( $wp->query_vars['order-pay'] ) && ! isset( $wp->query_vars['order-received'] ) ? 1 : 0
	) ) );

	wp_localize_script( 'wpgrade-woocommerce', 'wc_address_i18n_params', apply_filters( 'wc_address_i18n_params', array(
		'locale'                    => json_encode( WC()->countries->get_country_locale() ),
		'locale_fields'             => json_encode( WC()->countries->get_country_locale_field_selectors() ),
		'i18n_required_text'        => esc_attr__( 'required', 'woocommerce' ),
	) ) );

	wp_localize_script( 'wpgrade-woocommerce', 'wc_cart_params', apply_filters( 'wc_cart_params', array(
		'ajax_url'                     => WC()->ajax_url(),
		'ajax_loader_url'              => apply_filters( 'woocommerce_ajax_loader_url', $assets_path . 'images/ajax-loader@2x.gif' ),
		'update_shipping_method_nonce' => wp_create_nonce( "update-shipping-method" ),
	) ) );

	wp_localize_script( 'wpgrade-woocommerce', 'wc_cart_fragments_params', apply_filters( 'wc_cart_fragments_params', array(
		'ajax_url'      => WC()->ajax_url(),
		'fragment_name' => apply_filters( 'woocommerce_cart_fragment_name', 'wc_fragments' )
	) ) );

	wp_localize_script( 'wpgrade-woocommerce', 'wc_add_to_cart_params', apply_filters( 'wc_add_to_cart_params', array(
		'ajax_url'                => WC()->ajax_url(),
		'ajax_loader_url'         => apply_filters( 'woocommerce_ajax_loader_url', $assets_path . 'images/ajax-loader@2x.gif' ),
		'i18n_view_cart'          => esc_attr__( 'View Cart', 'woocommerce' ),
		'cart_url'                => get_permalink( wc_get_page_id( 'cart' ) ),
		'is_cart'                 => is_cart(),
		'cart_redirect_after_add' => get_option( 'woocommerce_cart_redirect_after_add' )
	) ) );

	wp_localize_script( 'wpgrade-woocommerce', 'wc_add_to_cart_variation_params', apply_filters( 'wc_add_to_cart_variation_params', array(
		'i18n_no_matching_variations_text' => esc_attr__( 'Sorry, no products matched your selection. Please choose a different combination.', 'woocommerce' ),
		'i18n_unavailable_text'            => esc_attr__( 'Sorry, this product is unavailable. Please choose a different combination.', 'woocommerce' ),
	) ) );

	wp_localize_script( 'wpgrade-woocommerce', 'wc_country_select_params', apply_filters( 'wc_country_select_params', array(
		'countries'              => json_encode( array_merge( WC()->countries->get_allowed_country_states(), WC()->countries->get_shipping_country_states() ) ),
		'i18n_select_state_text' => esc_attr__( 'Select an option&hellip;', 'woocommerce' ),
	) ) );

	wp_localize_script( 'wpgrade-woocommerce', 'woopix_params',  $woocommerce_params);
}

add_action('wp_enqueue_scripts','wpgrade_callback_load_woocommerce_assets',9999991);

// Ensure cart contents update when products are added to the cart via AJAX
add_filter('add_to_cart_fragments', 'woopgrade_header_add_to_cart_fragment');
function woopgrade_header_add_to_cart_fragment( $fragments ) {
	global $woocommerce;

	ob_start(); ?>
	<a class="cart-contents" href="<?php echo WC()->cart->get_cart_url(); ?>" title="<?php _e('View your shopping cart', 'woothemes'); ?>">
		<?php echo sprintf(_n('%d item', '%d items', WC()->cart->cart_contents_count, 'woothemes'), WC()->cart->cart_contents_count);?> - <?php echo WC()->cart->get_cart_total(); ?>
	</a>
	<?php $fragments['a.cart-contents'] = ob_get_clean();

	return $fragments;

}

add_filter( 'woocommerce_add_to_cart_message', 'wpgrade_add_to_cart_button', 999);
function wpgrade_add_to_cart_button( $message )
{
	// Here you should modify $message as you want, and then return it.
	$newButtonString = 'View cart';
	$replaceString = '<p><a$1class="btn btn--medium">' . $newButtonString .'</a>';
	$message = preg_replace('#<a(.*?)class="button">(.*?)</a>#', $replaceString, $message);
	return $message.'</p>';
}

/* This snippet removes the action that inserts thumbnails to products in teh loop
 * and re-adds the function customized with our wrapper in it.
 * It applies to all archives with products.
 *
 * @original plugin: WooCommerce
 * @author of snippet: Brian Krogsard
 */

/**
 * WooCommerce Loop Product Thumbs
 **/
if ( ! function_exists( 'woocommerce_template_loop_product_thumbnail' ) ) {
	remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10);
	add_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10);
	function woocommerce_template_loop_product_thumbnail() {

		global $post;

		$image = wp_get_attachment_image_src(get_post_thumbnail_id(), 'blog-big');
		$image_ratio = 70; //some default aspect ratio in case something has gone wrong and the image has no dimensions - it happens
		if (isset($image[1]) && isset($image[2]) && $image[1] > 0) {
			$image_ratio = $image[2] * 100/$image[1];
		}

		// echo '<div class="product__image-wrapper" style="padding-top: '. $image_ratio .'%;">';
		echo '<div class="mosaic__image" style="padding-top: '. $image_ratio .'%;">';
		echo woocommerce_get_product_thumbnail('small-size');
		echo '</div>';
	}
}


/**
 * WooCommerce Product Thumbnail
 **/
if ( ! function_exists( 'woocommerce_get_product_thumbnail' ) ) {

	function woocommerce_get_product_thumbnail( $size = 'blog-big', $placeholder_width = 0, $placeholder_height = 0  ) {
		global $post;
		if ( has_post_thumbnail() ) {
			return get_the_post_thumbnail( $post->ID, $size );
		} else {
			return '<img src="'. wc_placeholder_img_src() .'" alt="Placeholder"/>';
		}
	}
}
add_filter('single_product_small_thumbnail_size', 'wpgrade_woo_change_cat_thumb_size', 9999);

function wpgrade_woo_change_cat_thumb_size(){
	return "post-big";
}


/**
 * WooCommerce Loop Product Thumbs
 **/
if ( ! function_exists( 'woocommerce_subcategory_thumbnail' ) ) {
	remove_action( 'woocommerce_before_subcategory_title', 'woocommerce_subcategory_thumbnail', 10 );
	add_action( 'woocommerce_before_subcategory_title', 'woocommerce_subcategory_thumbnail', 10 );
	function woocommerce_subcategory_thumbnail($category) {

		$small_thumbnail_size  	= apply_filters( 'single_product_small_thumbnail_size', 'shop_catalog' );
		$thumbnail_id  			= get_woocommerce_term_meta( $category->term_id, 'thumbnail_id', true  );

		if ( $thumbnail_id ) {
			$image = wp_get_attachment_image_src( $thumbnail_id, $small_thumbnail_size  );
		} else {
			$image[0] = wc_placeholder_img_src();
		}

//        $image = wp_get_attachment_image_src(get_post_thumbnail_id(), 'blog-big');
		$image_ratio = 100; //some default aspect ratio in case something has gone wrong and the image has no dimensions - it happens
		if (isset($image[1]) && isset($image[2]) && $image[1] > 0) {
			$image_ratio = $image[2] * 100/$image[1];
		}

		// echo '<div class="product__image-wrapper" style="padding-top: '. $image_ratio .'%;">';
		echo '<div class="mosaic__image" style="padding-top: '. $image_ratio .'%;">';
		if ( $image ) {
			// Prevent esc_url from breaking spaces in urls for image embeds
			// Ref: http://core.trac.wordpress.org/ticket/23605
			$image[0] = str_replace( ' ', '%20', $image[0] );

			echo '<img src="' . esc_url( $image[0] ) . '" alt="' . esc_attr( $category->name ) . '" />';
		}
		echo '</div>';
	}
}

add_action('wp_ajax_woopix_remove_from_cart', 'woopix_remove_from_cart');
add_action('wp_ajax_nopriv_woopix_remove_from_cart', 'woopix_remove_from_cart');
function woopix_remove_from_cart() {
	global $woocommerce;
	$result = array('success' => false);

	check_ajax_referer( 'woo_remove_' . $_POST['remove_item'], 'remove_nonce' );

	WC()->cart->set_quantity( $_POST['remove_item'], 0 );
	$result['success'] = true;
	$result['removed_item'] = $_POST['remove_item'];
	echo json_encode($result);

	die();
}

add_action('wp_ajax_woopix_update_cart', 'woopix_update_cart');
add_action('wp_ajax_nopriv_woopix_update_cart', 'woopix_update_cart');
function woopix_update_cart() {
	global $woocommerce;
	$result = array('success' => false);

	WC()->cart->set_quantity( $_POST['update_item'], $_POST['qty'] );
	ob_start();

	wc_get_template_part('woocommerce/cart/cart-loop');

	$result['cart_items'] = ob_get_clean();

	ob_start();

	if ( ! defined('WOOCOMMERCE_CART') ) define( 'WOOCOMMERCE_CART', true );

	if ( isset( $_POST['shipping_method'] ) )
		WC()->session->chosen_shipping_method = $_POST['shipping_method'];

	WC()->cart->calculate_totals();

	$result['totals'] = ob_get_clean();
	$result['success'] = true;
	echo json_encode($result);
	die();
}

/**
 * Custom Add To Cart Messages
 * Add this to your theme functions.php file
 **/
//add_filter( 'wc_add_to_cart_message', 'custom_add_to_cart_message' );
function custom_add_to_cart_message( $product_id) {

	global $woocommerce;

	if ( is_array( $product_id ) ) {

		$titles = array();

		foreach ( $product_id as $id ) {
			$titles[] = get_the_title( $id );
		}

		$added_text = sprintf( __( 'Added &quot;%s&quot; to your cart.', 'woocommerce' ), join( __( '&quot; and &quot;', 'woocommerce' ), array_filter( array_merge( array( join( '&quot;, &quot;', array_slice( $titles, 0, -1 ) ) ), array_slice( $titles, -1 ) ) ) ) );

	} else {
		$added_text = sprintf( __( '&quot;%s&quot; was successfully added to your cart.', 'woocommerce' ), get_the_title( $product_id ) );
	}

	// Output success messages
	if ( get_option( 'woocommerce_cart_redirect_after_add' ) == 'yes' ) :

		$return_to 	= apply_filters( 'woocommerce_continue_shopping_redirect', wp_get_referer() ? wp_get_referer() : home_url() );

		$message 	= sprintf('<a href="%s" class="button test wc-forward">%s</a> %s', $return_to, __( 'Continue Shopping', 'woocommerce' ), $added_text );

	else :

		$message 	= sprintf('<a href="%s" class="button test wc-forward">%s</a> %s', get_permalink( wc_get_page_id( 'cart' ) ), __( 'View Cart', 'woocommerce' ), $added_text );

	endif;

	return $message;
}

/**
 * Override the number of products with our theme option
 */
add_filter( 'loop_shop_per_page', 'add_woocommerce_products_per_page', 20 );
function add_woocommerce_products_per_page($cols) {
	return wpgrade::option('woocommerce_products_numbers', 12);
}

/**
 * Removing the output of product thumbnail on shop archive
 * because we manually output it
 * @hooked woocommerce_template_loop_product_thumbnail - 10
 */
remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail' );


// customize breadcrumb howevah
add_filter( 'woocommerce_breadcrumb_defaults', 'wpgrade_woocommerce_breadcrumbs' );
function wpgrade_woocommerce_breadcrumbs() {
	return array(
		'delimiter'   => '',
		'wrap_before' => '<nav class="woocommerce-breadcrumb" itemprop="breadcrumb">',
		'wrap_after'  => '</nav>',
		'before'      => '',
		'after'       => '',
		'home'        => _x( 'Back to shopping', 'breadcrumb', wpgrade::textdomain() )
	);
}

// change the "Home" url into the shop's one
add_filter( 'woocommerce_breadcrumb_home_url', 'wpgrade_custom_breadrumb_home_url' );
function wpgrade_custom_breadrumb_home_url() {
	$shop_page_url = get_permalink( wc_get_page_id( 'shop' ) );
	if ( !empty($shop_page_url) ) {
		return $shop_page_url;
	}
	return get_home_url();
}

// move the breadcrumb before title
remove_action('woocommerce_before_main_content', 'woocommerce_breadcrumb', 20);
add_action('woocommerce_single_product_summary', 'woocommerce_breadcrumb', 3, 0 );


/**
 * Custom Add To Cart Messages
 * Add this to your theme functions.php file
 **/
add_filter( 'wc_add_to_cart_params', 'custom_archive_add_to_cart_message' );
function custom_archive_add_to_cart_message( $params ) {
	$params['i18n_view_cart'] = esc_attr__( 'Product Added', wpgrade::textdomain() );

	return $params;
}
