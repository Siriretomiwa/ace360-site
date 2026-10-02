<?php
/**
 * ace360 theme functions.
 *
 * @package ace360
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'ACE360_VERSION', '5.0.0' );

require get_template_directory() . '/inc/template-helpers.php';
require get_template_directory() . '/inc/content.php';
require get_template_directory() . '/inc/customizer.php';

/**
 * Theme supports and menus.
 */
function ace360_setup() {
	load_theme_textdomain( 'ace360', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 64,
			'width'       => 240,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);

	register_nav_menus(
		array(
			'primary' => __( 'Primary menu', 'ace360' ),
			'footer'  => __( 'Footer menu', 'ace360' ),
		)
	);
}
add_action( 'after_setup_theme', 'ace360_setup' );

/**
 * Styles and scripts. Everything is self-hosted: no font or script CDNs.
 */
function ace360_assets() {
	$uri = get_template_directory_uri() . '/assets';

	wp_enqueue_style( 'ace360-fonts', $uri . '/css/fonts.css', array(), ACE360_VERSION );
	wp_enqueue_style( 'ace360-main', $uri . '/css/main.css', array( 'ace360-fonts' ), ACE360_VERSION );

	wp_enqueue_script( 'gsap', $uri . '/vendor/gsap.min.js', array(), '3.12.5', true );
	wp_enqueue_script( 'gsap-scrolltrigger', $uri . '/vendor/ScrollTrigger.min.js', array( 'gsap' ), '3.12.5', true );
	wp_enqueue_script( 'lenis', $uri . '/vendor/lenis.min.js', array(), '1.1.13', true );

	$deps = array( 'gsap', 'gsap-scrolltrigger', 'lenis' );

	// The demo film only exists on the front page.
	if ( is_front_page() ) {
		wp_enqueue_script( 'ace360-demo', $uri . '/js/demo.js', array( 'gsap', 'gsap-scrolltrigger' ), ACE360_VERSION, true );
		wp_enqueue_script( 'three', $uri . '/vendor/three.min.js', array(), '0.149.0', true );
		wp_enqueue_script( 'ace360-film', $uri . '/js/film.js', array( 'three', 'gsap' ), ACE360_VERSION, true );
		$deps[] = 'ace360-demo';
		$deps[] = 'ace360-film';
	}

	wp_enqueue_script( 'ace360-main', $uri . '/js/main.js', $deps, ACE360_VERSION, true );
}
add_action( 'wp_enqueue_scripts', 'ace360_assets' );

/**
 * Add `defer` to theme scripts so they never block rendering.
 *
 * @param string $tag    Script tag.
 * @param string $handle Handle.
 * @return string
 */
function ace360_defer_scripts( $tag, $handle ) {
	$handles = array( 'gsap', 'gsap-scrolltrigger', 'lenis', 'ace360-demo', 'three', 'ace360-film', 'ace360-main' );
	if ( in_array( $handle, $handles, true ) && false === strpos( $tag, ' defer' ) ) {
		$tag = str_replace( ' src=', ' defer src=', $tag );
	}
	return $tag;
}
add_filter( 'script_loader_tag', 'ace360_defer_scripts', 10, 2 );

/**
 * Preload the display font used in the hero.
 */
function ace360_preload_fonts() {
	printf(
		'<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
		esc_url( get_template_directory_uri() . '/assets/fonts/inter-latin-wght-normal.woff2' )
	);
}
add_action( 'wp_head', 'ace360_preload_fonts', 1 );

/**
 * Projects post type, shown in the horizontal "Work" section on the front page.
 */
function ace360_register_projects() {
	register_post_type(
		'ace_project',
		array(
			'labels'       => array(
				'name'          => __( 'Projects', 'ace360' ),
				'singular_name' => __( 'Project', 'ace360' ),
				'add_new_item'  => __( 'Add project', 'ace360' ),
				'edit_item'     => __( 'Edit project', 'ace360' ),
			),
			'public'       => true,
			'has_archive'  => true,
			'menu_icon'    => 'dashicons-portfolio',
			'rewrite'      => array( 'slug' => 'work' ),
			'show_in_rest' => true,
			'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes' ),
		)
	);
}
add_action( 'init', 'ace360_register_projects' );

/**
 * Project meta: a short "type" label and the live site URL.
 */
function ace360_register_project_meta() {
	$fields = array(
		'ace360_project_type' => 'sanitize_text_field',
		'ace360_project_url'  => 'esc_url_raw',
	);
	foreach ( $fields as $key => $sanitize ) {
		register_post_meta(
			'ace_project',
			$key,
			array(
				'type'              => 'string',
				'single'            => true,
				'show_in_rest'      => true,
				'sanitize_callback' => $sanitize,
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
}
add_action( 'init', 'ace360_register_project_meta' );

/**
 * Meta box for the project details (works in both editors).
 */
function ace360_project_meta_box() {
	add_meta_box( 'ace360_project_details', __( 'Project details', 'ace360' ), 'ace360_project_meta_box_html', 'ace_project', 'side' );
}
add_action( 'add_meta_boxes', 'ace360_project_meta_box' );

/**
 * Render the project fields.
 *
 * @param WP_Post $post Current post.
 */
function ace360_project_meta_box_html( $post ) {
	wp_nonce_field( 'ace360_project_details', 'ace360_project_nonce' );
	printf(
		'<p><label for="ace360_project_type">%s</label><input type="text" class="widefat" id="ace360_project_type" name="ace360_project_type" value="%s" placeholder="%s"></p>',
		esc_html__( 'Type', 'ace360' ),
		esc_attr( get_post_meta( $post->ID, 'ace360_project_type', true ) ),
		esc_attr__( 'e.g. Shopify + brand identity', 'ace360' )
	);
	printf(
		'<p><label for="ace360_project_url">%s</label><input type="url" class="widefat" id="ace360_project_url" name="ace360_project_url" value="%s" placeholder="https://"></p><p class="description">%s</p>',
		esc_html__( 'Live site URL', 'ace360' ),
		esc_attr( get_post_meta( $post->ID, 'ace360_project_url', true ) ),
		esc_html__( 'The featured image is shown inside the browser frame on the front page. Use a full-page screenshot (1440px wide) so it can scroll.', 'ace360' )
	);
}

/**
 * Save the project fields.
 *
 * @param int $post_id Post ID.
 */
function ace360_save_project_meta( $post_id ) {
	if ( ! isset( $_POST['ace360_project_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['ace360_project_nonce'] ) ), 'ace360_project_details' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	if ( isset( $_POST['ace360_project_type'] ) ) {
		update_post_meta( $post_id, 'ace360_project_type', sanitize_text_field( wp_unslash( $_POST['ace360_project_type'] ) ) );
	}
	if ( isset( $_POST['ace360_project_url'] ) ) {
		update_post_meta( $post_id, 'ace360_project_url', esc_url_raw( wp_unslash( $_POST['ace360_project_url'] ) ) );
	}
}
add_action( 'save_post_ace_project', 'ace360_save_project_meta' );

/**
 * Contact form handler. Sends the enquiry with wp_mail() to the address set
 * in the Customizer, then redirects back to the form with a status flag.
 */
function ace360_handle_contact() {
	$back = wp_get_referer() ? wp_get_referer() : home_url( '/' );
	$back = remove_query_arg( 'ace360_sent', $back );

	if ( ! isset( $_POST['ace360_contact_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['ace360_contact_nonce'] ) ), 'ace360_contact' ) ) {
		wp_safe_redirect( add_query_arg( 'ace360_sent', 'error', $back ) . '#contact' );
		exit;
	}

	// Honeypot: real visitors never fill this field.
	if ( ! empty( $_POST['ace360_website'] ) ) {
		wp_safe_redirect( add_query_arg( 'ace360_sent', 'ok', $back ) . '#contact' );
		exit;
	}

	$name     = isset( $_POST['ace360_name'] ) ? sanitize_text_field( wp_unslash( $_POST['ace360_name'] ) ) : '';
	$company  = isset( $_POST['ace360_company'] ) ? sanitize_text_field( wp_unslash( $_POST['ace360_company'] ) ) : '';
	$email    = isset( $_POST['ace360_email'] ) ? sanitize_email( wp_unslash( $_POST['ace360_email'] ) ) : '';
	$phone    = isset( $_POST['ace360_phone'] ) ? sanitize_text_field( wp_unslash( $_POST['ace360_phone'] ) ) : '';
	$need     = isset( $_POST['ace360_need'] ) ? sanitize_text_field( wp_unslash( $_POST['ace360_need'] ) ) : '';
	$estimate = isset( $_POST['ace360_estimate'] ) ? sanitize_text_field( wp_unslash( $_POST['ace360_estimate'] ) ) : '';
	$lang     = isset( $_POST['ace360_lang'] ) ? sanitize_key( wp_unslash( $_POST['ace360_lang'] ) ) : '';
	$message  = isset( $_POST['ace360_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['ace360_message'] ) ) : '';

	if ( '' === $name || ! is_email( $email ) || '' === $message || empty( $_POST['ace360_consent'] ) ) {
		wp_safe_redirect( add_query_arg( 'ace360_sent', 'invalid', $back ) . '#contact' );
		exit;
	}

	$to      = ace360_mod( 'email' );
	$to      = is_email( $to ) ? $to : get_option( 'admin_email' );
	/* translators: %s: sender name */
	$subject = sprintf( __( 'New project enquiry from %s', 'ace360' ), $name );
	$body    = sprintf(
		"%s: %s\n%s: %s\n%s: %s\n%s: %s\n%s: %s\n%s: %s\n%s: %s\n\n%s",
		__( 'Name', 'ace360' ),
		$name,
		__( 'Phone', 'ace360' ),
		$phone,
		__( 'Company', 'ace360' ),
		$company,
		__( 'Email', 'ace360' ),
		$email,
		__( 'Needs', 'ace360' ),
		$need,
		__( 'Estimate', 'ace360' ),
		$estimate,
		__( 'Language', 'ace360' ),
		'nl' === $lang ? 'Nederlands' : 'English',
		$message
	);
	$headers = array( 'Reply-To: ' . $name . ' <' . $email . '>' );

	$sent = wp_mail( $to, $subject, $body, $headers );

	wp_safe_redirect( add_query_arg( 'ace360_sent', $sent ? 'ok' : 'error', $back ) . '#contact' );
	exit;
}
add_action( 'admin_post_nopriv_ace360_contact', 'ace360_handle_contact' );
add_action( 'admin_post_ace360_contact', 'ace360_handle_contact' );

/**
 * Fallback menu used before a Primary menu is assigned: links to front-page sections.
 */
function ace360_fallback_menu() {
	$base  = is_front_page() ? '' : home_url( '/' );
	$items = array(
		'#diensten'  => ace360_pair( 'Services', 'Diensten' ),
		'#werkwijze' => ace360_pair( 'Process', 'Werkwijze' ),
		'#werk'      => ace360_pair( 'Work', 'Werk' ),
		'#vragen'    => ace360_pair( 'Questions', 'Vragen' ),
	);
	echo '<ul class="menu">';
	foreach ( $items as $hash => $label ) {
		printf( '<li><a href="%s">%s</a></li>', esc_url( $base . $hash ), ace360_t( $label ) ); // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in ace360_t().
	}
	echo '</ul>';
}
