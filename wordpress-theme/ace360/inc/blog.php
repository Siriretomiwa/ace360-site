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

/**
 * Latest posts in a language, as plain arrays (title, url, cover, category, excerpt, minutes, slug).
 * Reads real posts in WordPress, and the starter post files in the static previews.
 *
 * @param int         $n    How many.
 * @param string|null $lang 'nl' or 'en'.
 * @return array
 */
function ace360_blog_items( $n = 3, $lang = null ) {
	$lang = $lang ? $lang : ace360_lang();
	$out  = array();
	if ( ace360_both_langs() || ! function_exists( 'get_posts' ) ) {
		foreach ( array_reverse( ace360_seed_posts() ) as $p ) {
			if ( ( 'en' === $p['lang'] ) !== ( 'en' === $lang ) ) {
				continue;
			}
			$out[] = array(
				'title'   => $p['title'],
				'url'     => $p['slug'] . '.html',
				'cover'   => ace360_asset( 'img/blog/' . $p['slug'] . '.jpg' ),
				'cat'     => $p['category'],
				'excerpt' => $p['excerpt'],
				'minutes' => max( 1, (int) round( str_word_count( wp_strip_all_tags( $p['body'] ) ) / 220 ) ),
				'slug'    => $p['slug'],
			);
		}
		return array_slice( $out, 0, $n );
	}
	$q = get_posts(
		array(
			'post_type'      => 'post',
			'posts_per_page' => $n,
			'meta_query'     => 'en' === $lang // phpcs:ignore WordPress.DB.SlowDBQuery
				? array( array( 'key' => 'ace360_post_lang', 'value' => 'en' ) )
				: array( 'relation' => 'OR', array( 'key' => 'ace360_post_lang', 'compare' => 'NOT EXISTS' ), array( 'key' => 'ace360_post_lang', 'value' => 'en', 'compare' => '!=' ) ),
		)
	);
	foreach ( $q as $p ) {
		$cat   = get_the_category( $p->ID );
		$out[] = array(
			'title'   => get_the_title( $p ),
			'url'     => get_permalink( $p ),
			'cover'   => has_post_thumbnail( $p ) ? get_the_post_thumbnail_url( $p, 'medium_large' ) : '',
			'cat'     => $cat ? $cat[0]->name : '',
			'excerpt' => wp_strip_all_tags( get_the_excerpt( $p ) ),
			'minutes' => ace360_reading_minutes( $p ),
			'slug'    => $p->post_name,
		);
	}
	return $out;
}

/**
 * Turn the media shortcuts in a post into markup (posts stay plain HTML in the editor):
 *   [[clip:booking-flow|Caption]]  a looping phone clip (assets/video/blog/)
 *   [[shot:checkout|Caption]]      a framed screenshot in the post language (assets/img/blog-media/)
 *   [[photo:noor-hero|Caption]]    a product photo (assets/img/work/)
 *   {{theme}}                      the theme URL
 *
 * @param string $html Post content.
 * @param string $lang 'nl' or 'en'.
 * @return string
 */
function ace360_post_media( $html, $lang ) {
	$html = str_replace( '{{theme}}', get_template_directory_uri(), $html );
	return preg_replace_callback(
		'#(?:<p>\s*)?\[\[(clip|shot|photo):([a-z0-9-]+)(?:\|([^\]]*))?\]\](?:\s*</p>)?#',
		function ( $m ) use ( $lang ) {
			$cap = isset( $m[3] ) ? trim( $m[3] ) : '';
			if ( 'clip' === $m[1] ) {
				return ace360_clip_html( $m[2], $cap, 'in-post' );
			}
			if ( 'shot' === $m[1] ) {
				$file = $m[2] . '-' . $lang . '.jpg';
				if ( ! file_exists( get_template_directory() . '/assets/img/blog-media/' . $file ) ) {
					$file = $m[2] . '-nl.jpg';
				}
				$src = ace360_asset( 'img/blog-media/' . $file );
				return '<figure class="shot"><img src="' . esc_url( $src ) . '" alt="' . esc_attr( $cap ) . '" loading="lazy" width="1600" height="1000">' . ( $cap ? '<figcaption>' . esc_html( $cap ) . '</figcaption>' : '' ) . '</figure>';
			}
			return '<figure class="photo"><img src="' . esc_url( ace360_asset( 'img/work/' . $m[2] . '.jpg' ) ) . '" alt="' . esc_attr( $cap ) . '" loading="lazy">' . ( $cap ? '<figcaption>' . esc_html( $cap ) . '</figcaption>' : '' ) . '</figure>';
		},
		$html
	);
}

/**
 * Everything the article template needs about a post (WordPress post or starter file in the preview).
 *
 * @param WP_Post $post Post.
 * @return array
 */
function ace360_post_data( $post ) {
	$cat  = get_the_category( $post->ID );
	$lang = ace360_post_lang( $post );
	$take = (string) get_post_meta( $post->ID, 'ace360_post_takeaways', true );
	return array(
		'slug'      => $post->post_name,
		'title'     => get_the_title( $post ),
		'excerpt'   => has_excerpt( $post ) ? get_the_excerpt( $post ) : '',
		'cover'     => has_post_thumbnail( $post ) ? get_the_post_thumbnail_url( $post, 'full' ) : '',
		'cat'       => $cat ? $cat[0]->name : '',
		'date'      => ace360_post_date( $post, $lang ),
		'minutes'   => ace360_reading_minutes( $post ),
		'lang'      => $lang,
		'layout'    => get_post_meta( $post->ID, 'ace360_post_layout', true ) ? get_post_meta( $post->ID, 'ace360_post_layout', true ) : 'cover',
		'takeaways' => array_values( array_filter( array_map( 'trim', explode( '|', $take ) ) ) ),
		'service'   => (string) get_post_meta( $post->ID, 'ace360_post_service', true ),
		'body'      => ace360_post_media( apply_filters( 'the_content', $post->post_content ), $lang ), // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- core filter.
		'url'       => get_permalink( $post ),
	);
}

/**
 * URL of a post by its slug (the .html page in the static previews).
 *
 * @param string $slug Post slug.
 * @return string
 */
function ace360_post_url( $slug ) {
	if ( ace360_both_langs() || ! function_exists( 'get_page_by_path' ) ) {
		return $slug . '.html';
	}
	$p = get_page_by_path( $slug, OBJECT, 'post' );
	return $p ? get_permalink( $p ) : ace360_blog_url();
}
