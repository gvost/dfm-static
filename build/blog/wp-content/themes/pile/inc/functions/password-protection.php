<?php

add_action( 'the_password_form', 'wpgrade_callback_the_password_form' );

function wpgrade_callback_the_password_form( $form ) {
	global $post;
	$post   = get_post( $post );
	$postID = wpgrade::lang_post_id( $post->ID );
	$label  = 'pwbox-' . ( empty( $postID ) ? rand() : $postID );
	$form   = '<form action="' . esc_url( site_url( 'wp-login.php?action=postpass', 'login_post' ) ) . '" method="post" class="password-protection-form">
		<p>' . __( "This post is password protected. To view it please enter your password below:", wpgrade::textdomain() ) . '</p>
		<div class="grid">
			<div class="grid__item  one-whole">
				<input name="post_password" id="' . $label . '" type="password" size="20" placeholder="' . __( "Password", wpgrade::textdomain() ) . '"/>
			</div>
			<div class="grid__item  one-whole">
				<input type="submit" name="Access" value="' . esc_attr__( "Access", wpgrade::textdomain() ) . '" class="btn post-password-submit"/>
			</div>
		</div>
	</form>';

	// on form submit put a wrong passwordp msg.
	if ( get_permalink() != wp_get_referer() ) {
		return $form;
	}

	// No cookie, the user has not sent anything until now.
	if ( ! isset ( $_COOKIE[ 'wp-postpass_' . COOKIEHASH ] ) ) {
		return $form;
	}

	require_once ABSPATH . 'wp-includes/class-phpass.php';
	$hasher = new PasswordHash( 8, true );

	$hash = wp_unslash( $_COOKIE[ 'wp-postpass_' . COOKIEHASH ] );
	if ( 0 !== strpos( $hash, '$P$B' ) ) {
		return $form;
	}

	if ( ! $hasher->CheckPassword( $post->post_password, $hash ) ) {

		// We have a cookie, but it does not match the password.
		$msg  = '<span class="wrong-password-message">' . __( 'Sorry, your password did not match', wpgrade::textdomain() ) . '</span>';
		$form = $msg . $form;
	}

	return $form;

}
