(function($){

	$(document).ready(function(){
		$(".woocommerce").on("change", "input.qty", function() {
			$(this.form).find("button[data-quantity]").attr("data-quantity", this.value);
		});

		$(document.body).on("adding_to_cart", function(event, element) {
			
		});
	});

	/**
	 * Remove items from cart with ajax
	 */
	$(document).on('click','.product-remove .remove', function(e) {
		e.preventDefault();

		var $thisbutton = $(this);

		$.ajax({
			url: woocommerce_params.ajax_url,
			type: 'POST',
			data: {
				action: 		'woopix_remove_from_cart',
				remove_item: 	$thisbutton.data('item_key'),
				remove_nonce:   $thisbutton.data('remove_nonce')
			},
			success: function( response ) {

				$result = JSON.parse(response);

				if ( $result.success == true ) {

					var item_title = ' ' + $thisbutton.parent().siblings('.product-name').children('a').html();
//					var message = '</br><i class="pixcode--icon  icon-info  square  small"></i>'+ l10n.item_label + item_title + l10n.remove_msg;
					var message = '<div><i class="pixcode--icon  icon-info  square  small"></i>Item <b>'+ item_title +'</b> has been removed!</div>';
					if ( $('.woocommerce-message').length > 0 ){
						$('.woocommerce-message').append(message);
					} else {
						$('.woocommerce .cart-form').before('<div class="woocommerce-message">'+ message +'</div>');
					}

					$thisbutton.parents('.cart_item').remove();

					// update total
					$('select.shipping_method, input[name^=shipping_method]').trigger('change');
				}
			}
		});

	});

	/**
	 * Update cart with ajax
	 */
	$(document).on('change', '.cart_item .qty', function(e){
		e.preventDefault();

		var $thisbutton = $(this);
		$.ajax({
			url: woocommerce_params.ajax_url,
			type: 'POST',
			data: {
				action: 		'woopix_update_cart',
				update_item: 	$thisbutton.data('item_key'),
				qty: 			$thisbutton.val()
			},
			success: function( response ) {

				var result = JSON.parse( response );

				if ( result.success == true ) {

					var message = '<i class="pixcode--icon  icon-info  square  small"></i>Cart updated!';
					if ( $('.woocommerce-message').length > 0 ){
						$('.woocommerce-message').html(message);
					} else {
						$('.woocommerce .cart-form').before('<div class="woocommerce-message">'+ message +'</div>');
					}

					if ( typeof result.cart_items !== 'undefined' ) {
						$('.woocommerce .shop_table.cart tbody .cart_item').remove();
						$('.woocommerce .shop_table.cart tbody').prepend(result.cart_items);
					}

					if ( typeof result.totals !== 'undefined' ) {
						$('.cart-subtotal.cart-totals, .shipping.cart-totals, .total.total-row.cart-totals').remove();
						$('.woocommerce .cart-buttons').before(result.totals);

					}

				}

				$(document).trigger('change');
				// update total
				$('select.shipping_method, input[name^=shipping_method]').trigger('change');
			}
		});

	});

	woocommerce_events_handlers = function () {

		// tell woocommerce if this is a cart page or not
		if ( $('body' ).hasClass('woocommerce-cart') ) {
			wc_add_to_cart_params.is_cart = 1;
		} else {
			wc_add_to_cart_params.is_cart = 0;
		}

		// needed for the floating ajax cart
		$('body').trigger('added_to_cart');

	}

})(jQuery);

