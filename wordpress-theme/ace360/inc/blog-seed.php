<?php
/**
 * Starter blog posts that ship with the theme (content/blog/*.html). On the first page load after the
 * theme is installed or updated, every post that has not been added before is published, with today's
 * date, its category, language, service link, excerpt and cover image (assets/img/blog/<slug>.jpg).
 * Each post is added once: a post you delete or edit is left alone. Turn it off with
 * add_filter( 'ace360_seed_blog', '__return_false' ).
 *
 * File format: an HTML comment with "key: value" lines (title, slug, lang, category, service, excerpt),
 * then the post body as HTML.
 *
 * @package ace360
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Parse one post file.
 *
 * @param string $file Path.
 * @return array|null
 */
function ace360_seed_parse( $file ) {
	$raw = file_get_contents( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- local theme file.
	if ( ! preg_match( '/^\s*<!--(.*?)-->(.*)$/s', $raw, $m ) ) {
		return null;
	}
	$meta = array();
	foreach ( preg_split( '/\R/', trim( $m[1] ) ) as $line ) {
		if ( preg_match( '/^\s*([a-z]+):\s*(.*)$/', $line, $kv ) ) {
			$meta[ $kv[1] ] = trim( $kv[2] );
		}
	}
	if ( empty( $meta['title'] ) || empty( $meta['slug'] ) ) {
		return null;
	}
	$meta['body'] = trim( $m[2] );
	return $meta;
}

/**
 * All starter posts, in publishing order.
 *
 * @return array
 */
function ace360_seed_posts() {
	$files = glob( get_template_directory() . '/content/blog/*.html' );
	sort( $files );
	return array_values( array_filter( array_map( 'ace360_seed_parse', $files ) ) );
}

/**
 * Publish the starter posts that have not been added yet.
 */
function ace360_seed_blog() {
	if ( get_option( 'ace360_blog_seed_version' ) === ACE360_VERSION || ! apply_filters( 'ace360_seed_blog', true ) ) {
		return;
	}
	update_option( 'ace360_blog_seed_version', ACE360_VERSION, true ); // set first, so a slow request never runs it twice
	$done   = (array) get_option( 'ace360_blog_seeded', array() );
	$posts  = ace360_seed_posts();
	$author = get_users( array( 'role' => 'administrator', 'number' => 1, 'fields' => 'ID' ) );
	$author = $author ? (int) $author[0] : 1;
	$now    = current_time( 'timestamp' ); // phpcs:ignore WordPress.DateTime.CurrentTimeTimestamp.Requested -- local time for post_date.
	$n      = count( $posts );

	foreach ( $posts as $i => $p ) {
		if ( in_array( $p['slug'], $done, true ) ) {
			continue;
		}
		$done[] = $p['slug'];
		if ( get_page_by_path( $p['slug'], OBJECT, 'post' ) ) {
			continue;
		}
		$cat = 0;
		if ( ! empty( $p['category'] ) ) {
			$term = term_exists( $p['category'], 'category' );
			if ( ! $term ) {
				$term = wp_insert_term( $p['category'], 'category' );
			}
			$cat = is_array( $term ) ? (int) $term['term_id'] : (int) $term;
		}
		// Real dates: all today, a minute apart, so the list keeps the intended order.
		$when = $now - ( $n - $i ) * 60;
		$id   = wp_insert_post(
			array(
				'post_type'     => 'post',
				'post_status'   => 'publish',
				'comment_status' => 'closed',
				'ping_status'   => 'closed',
				'post_title'    => $p['title'],
				'post_name'     => $p['slug'],
				'post_content'  => $p['body'],
				'post_excerpt'  => isset( $p['excerpt'] ) ? $p['excerpt'] : '',
				'post_author'   => $author,
				'post_date'     => gmdate( 'Y-m-d H:i:s', $when ),
				'post_category' => $cat ? array( $cat ) : array(),
				'meta_input'    => array(
					'ace360_post_lang'    => isset( $p['lang'] ) && 'en' === $p['lang'] ? 'en' : 'nl',
					'ace360_post_service' => isset( $p['service'] ) ? sanitize_key( $p['service'] ) : '',
				),
			),
			true
		);
		if ( ! is_wp_error( $id ) ) {
			ace360_seed_cover( $id, $p['slug'], $p['title'] );
		}
	}
	update_option( 'ace360_blog_seeded', $done, false );
	ace360_seed_fix_links( wp_list_pluck( $posts, 'slug' ) );
}

/**
 * The post files link with root paths ("/wat-kost-een-website/", "/other-post/"). Point links to other
 * starter posts at their real permalink and the rest at this site's home URL.
 *
 * @param array $slugs Starter post slugs.
 */
function ace360_seed_fix_links( $slugs ) {
	$ids = array();
	foreach ( $slugs as $slug ) {
		$p = get_page_by_path( $slug, OBJECT, 'post' );
		if ( $p ) {
			$ids[ $slug ] = $p;
		}
	}
	foreach ( $ids as $post ) {
		$content = preg_replace_callback(
			'#href="/([a-z0-9/-]*)"#',
			function ( $m ) use ( $ids ) {
				$path = trim( $m[1], '/' );
				return 'href="' . esc_url( isset( $ids[ $path ] ) ? get_permalink( $ids[ $path ] ) : home_url( '/' . $m[1] ) ) . '"';
			},
			$post->post_content
		);
		if ( $content !== $post->post_content ) {
			wp_update_post( array( 'ID' => $post->ID, 'post_content' => $content ) );
		}
	}
}
add_action( 'init', 'ace360_seed_blog', 30 );

/**
 * Copy the post's cover image into the media library and set it as the featured image.
 *
 * @param int    $post_id Post.
 * @param string $slug    Slug.
 * @param string $title   Title (alt text).
 */
function ace360_seed_cover( $post_id, $slug, $title ) {
	$src = get_template_directory() . '/assets/img/blog/' . $slug . '.jpg';
	if ( ! file_exists( $src ) ) {
		return;
	}
	$up = wp_upload_bits( $slug . '.jpg', null, file_get_contents( $src ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( ! empty( $up['error'] ) ) {
		return;
	}
	$att = wp_insert_attachment(
		array(
			'post_mime_type' => 'image/jpeg',
			'post_title'     => $title,
			'post_status'    => 'inherit',
		),
		$up['file'],
		$post_id
	);
	if ( is_wp_error( $att ) || ! $att ) {
		return;
	}
	require_once ABSPATH . 'wp-admin/includes/image.php';
	wp_update_attachment_metadata( $att, wp_generate_attachment_metadata( $att, $up['file'] ) );
	update_post_meta( $att, '_wp_attachment_image_alt', $title );
	set_post_thumbnail( $post_id, $att );
}
