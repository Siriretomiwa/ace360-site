<?php
/**
 * Blog: Dutch posts at /blog/, English posts at /en/blog/. Each post has a language
 * (post meta ace360_post_lang, 'nl' by default, set in the editor sidebar) and can point to the
 * service page it belongs to (ace360_post_service, a landing key), which the post's call-to-action uses.
 *
 * @package ace360
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Blog URL in a language.
 *
 * @param string|null $lang 'nl' or 'en'.
 * @return string
 */
function ace360_blog_url( $lang = null ) {
	if ( ace360_both_langs() ) {
		return 'blog.html';
	}
	return ace360_url( '/blog/', $lang );
}

/**
 * Language of a post.
 *
 * @param int|WP_Post|null $post Post.
 * @return string
 */
function ace360_post_lang( $post = null ) {
	$post = get_post( $post );
	return ( $post && 'en' === get_post_meta( $post->ID, 'ace360_post_lang', true ) ) ? 'en' : 'nl';
}

/**
 * Is this the theme's blog listing?
 */
function ace360_is_blog() {
	return function_exists( 'get_query_var' ) && (bool) get_query_var( 'ace360_blog' );
}

/**
 * Post meta for language and service.
 */
function ace360_register_post_lang() {
	foreach ( array( 'ace360_post_lang' => 'sanitize_key', 'ace360_post_service' => 'sanitize_key' ) as $key => $cb ) {
		register_post_meta(
			'post',
			$key,
			array(
				'type'              => 'string',
				'single'            => true,
				'show_in_rest'      => true,
				'sanitize_callback' => $cb,
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
}
add_action( 'init', 'ace360_register_post_lang' );

/**
 * Rewrites for /blog/ and /en/blog/.
 */
function ace360_blog_rewrites() {
	add_rewrite_tag( '%ace360_blog%', '(1)' );
	add_rewrite_rule( '^blog/?$', 'index.php?ace360_blog=1', 'top' );
	add_rewrite_rule( '^blog/page/([0-9]+)/?$', 'index.php?ace360_blog=1&paged=$matches[1]', 'top' );
	add_rewrite_rule( '^en/blog/?$', 'index.php?ace360_blog=1&ace360_lang=en', 'top' );
	add_rewrite_rule( '^en/blog/page/([0-9]+)/?$', 'index.php?ace360_blog=1&ace360_lang=en&paged=$matches[1]', 'top' );
}
add_action( 'init', 'ace360_blog_rewrites' );

/**
 * The blog listing shows posts in the page language only.
 *
 * @param WP_Query $q Query.
 */
function ace360_blog_query( $q ) {
	if ( ! $q->is_main_query() || ! $q->get( 'ace360_blog' ) ) {
		return;
	}
	$q->is_home = false;
	$q->set( 'post_type', 'post' );
	$q->set( 'posts_per_page', 12 );
	$q->set( 'ignore_sticky_posts', true );
	$q->set(
		'meta_query',
		'en' === $q->get( 'ace360_lang' )
			? array( array( 'key' => 'ace360_post_lang', 'value' => 'en' ) )
			: array(
				'relation' => 'OR',
				array( 'key' => 'ace360_post_lang', 'compare' => 'NOT EXISTS' ),
				array( 'key' => 'ace360_post_lang', 'value' => 'en', 'compare' => '!=' ),
			)
	);
}
add_action( 'parse_query', 'ace360_blog_query' );

/**
 * blog.php for the listing.
 *
 * @param string $template Template.
 * @return string
 */
function ace360_blog_template( $template ) {
	if ( ace360_is_blog() ) {
		$t = locate_template( 'blog.php' );
		if ( $t ) {
			return $t;
		}
	}
	return $template;
}
add_filter( 'template_include', 'ace360_blog_template' );

/**
 * Keep /blog/ and /en/blog/ as they are.
 *
 * @param string $redirect Redirect.
 * @return string|false
 */
function ace360_blog_redirect_canonical( $redirect ) {
	return ace360_is_blog() ? false : $redirect;
}
add_filter( 'redirect_canonical', 'ace360_blog_redirect_canonical' );

/**
 * Reading time in minutes.
 *
 * @param WP_Post|null $post Post.
 * @return int
 */
function ace360_reading_minutes( $post = null ) {
	$post  = get_post( $post );
	$words = $post ? str_word_count( wp_strip_all_tags( $post->post_content ) ) : 0;
	return max( 1, (int) round( $words / 220 ) );
}

/**
 * Language and service fields in the post editor.
 */
function ace360_post_lang_box() {
	add_meta_box( 'ace360_post_lang', __( 'Language and service', 'ace360' ), 'ace360_post_lang_box_html', 'post', 'side' );
}
add_action( 'add_meta_boxes', 'ace360_post_lang_box' );

/**
 * Render the fields.
 *
 * @param WP_Post $post Post.
 */
function ace360_post_lang_box_html( $post ) {
	wp_nonce_field( 'ace360_post_lang', 'ace360_post_lang_nonce' );
	$lang = ace360_post_lang( $post );
	$svc  = get_post_meta( $post->ID, 'ace360_post_service', true );
	echo '<p><label for="ace360_post_lang_f">' . esc_html__( 'Language of this post', 'ace360' ) . '</label><select id="ace360_post_lang_f" name="ace360_post_lang" class="widefat">';
	foreach ( array( 'nl' => 'Nederlands (/blog/)', 'en' => 'English (/en/blog/)' ) as $k => $label ) {
		printf( '<option value="%s"%s>%s</option>', esc_attr( $k ), selected( $lang, $k, false ), esc_html( $label ) );
	}
	echo '</select></p><p><label for="ace360_post_service_f">' . esc_html__( 'Service page for the call-to-action', 'ace360' ) . '</label><select id="ace360_post_service_f" name="ace360_post_service" class="widefat"><option value="">—</option>';
	foreach ( ace360_landings() as $k => $l ) {
		printf( '<option value="%s"%s>%s</option>', esc_attr( $k ), selected( $svc, $k, false ), esc_html( $l['kicker']['nl'] ) );
	}
	echo '</select></p>';
}

/**
 * Save the fields.
 *
 * @param int $post_id Post ID.
 */
function ace360_post_lang_save( $post_id ) {
	if ( ! isset( $_POST['ace360_post_lang_nonce'] ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $_POST['ace360_post_lang_nonce'] ) ), 'ace360_post_lang' ) ) {
		return;
	}
	if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	$lang = isset( $_POST['ace360_post_lang'] ) && 'en' === $_POST['ace360_post_lang'] ? 'en' : 'nl';
	update_post_meta( $post_id, 'ace360_post_lang', $lang );
	$svc = isset( $_POST['ace360_post_service'] ) ? sanitize_key( wp_unslash( $_POST['ace360_post_service'] ) ) : '';
	if ( $svc && isset( ace360_landings()[ $svc ] ) ) {
		update_post_meta( $post_id, 'ace360_post_service', $svc );
	} else {
		delete_post_meta( $post_id, 'ace360_post_service' );
	}
}
add_action( 'save_post_post', 'ace360_post_lang_save' );

/**
 * Post date in the post's language, whatever the site language: "3 oktober 2026" / "3 October 2026".
 *
 * @param WP_Post|null $post Post.
 * @param string|null  $lang 'nl' or 'en'.
 * @return string
 */
function ace360_post_date( $post = null, $lang = null ) {
	$post   = get_post( $post );
	$lang   = $lang ? $lang : ace360_post_lang( $post );
	$t      = get_post_timestamp( $post );
	$months = 'en' === $lang
		? array( 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' )
		: array( 'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december' );
	return wp_date( 'j', $t ) . ' ' . $months[ (int) wp_date( 'n', $t ) - 1 ] . ' ' . wp_date( 'Y', $t );
}
