<?php
/**
 * Content wrappers
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     1.6.4
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

if ( is_shop() || is_cart() || is_checkout() || is_checkout_pay_page() || is_account_page() || is_order_received_page() ) {
	get_template_part( 'templates/page/hero' );
	wp_reset_postdata();
}

do_action( 'pile_djax_container_start' );

$transition_class = '';

if ( is_archive( ) ) {
	$transition_class = 'js-transition--archive';
} elseif ( is_singular() ) {
	$transition_class = 'js-transition--single';
}
?>

<div class="site-content <?php echo $transition_class; ?>">
	<div class="container">