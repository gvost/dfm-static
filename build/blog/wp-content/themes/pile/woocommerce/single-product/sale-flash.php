<?php
/**
 * Single Product Sale Flash
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     1.6.4
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

global $post, $product;

if ( $product->is_on_sale() )
	echo apply_filters( 'woocommerce_sale_flash', '<span class="product__badge  on-sale" data-content="'.  __( 'Sale', 'woocommerce' ) . '"></span>', $post, $product );
elseif( ! $product->is_in_stock() )
	echo apply_filters( 'woocommerce_sale_flash', '<span class="product__badge is--out-of-stock" data-content="'.  __( 'Out of stock', 'woocommerce' ) . '"></span>', $post, $product ); ?>