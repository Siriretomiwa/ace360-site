<?php
/**
 * Renders the front page outside WordPress, with minimal stubs, so the theme
 * can be previewed as static HTML. Usage: php render-preview.php > out.html
 */

define( 'ABSPATH', __DIR__ );
$theme = dirname( __DIR__ ) . '/ace360';

function __( $s, $d = null ) { return $s; }
function esc_html__( $s, $d = null ) { return esc_html( $s ); }
function esc_attr__( $s, $d = null ) { return esc_attr( $s ); }
function esc_html_e( $s, $d = null ) { echo esc_html( $s ); }
function esc_attr_e( $s, $d = null ) { echo esc_attr( $s ); }
function esc_html( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' ); }
function esc_attr( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' ); }
function esc_url( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' ); }
function get_theme_mod( $k, $d = false ) { return $d; }
function home_url( $p = '' ) { return $p; }
function admin_url( $p = '' ) { return '#'; }
function get_bloginfo( $k = '' ) { return 'Ace 360 Services'; }
function bloginfo( $k = '' ) { echo 'charset' === $k ? 'UTF-8' : 'ace360 services'; }
function language_attributes() { echo 'lang="en"'; }
function body_class() { echo 'class="home"'; }
function wp_head() { echo "<!--wp_head-->\n"; }
function wp_footer() { echo "<!--wp_footer-->\n"; }
function wp_body_open() {}
function has_custom_logo() { return false; }
function has_nav_menu( $l ) { return false; }
function is_front_page() { return true; }
function wp_nonce_field() {}
function sanitize_key( $s ) { return $s; }
function wp_unslash( $s ) { return $s; }
function gmdate_stub() {}
function get_header() { global $theme; include $theme . '/header.php'; }
function get_footer() { global $theme; include $theme . '/footer.php'; }
function get_template_part( $slug ) { global $theme; include $theme . '/' . $slug . '.php'; }
function apply_filters( $t, $v ) { return $v; }
function wp_json_encode( $v ) { return json_encode( $v ); }
function wp_get_attachment_image() { return ''; }
function ace360_fallback_menu() {
	echo '<ul class="menu">';
	foreach ( array( '#diensten' => ace360_pair( 'Services', 'Diensten' ), '#werkwijze' => ace360_pair( 'Process', 'Werkwijze' ), '#werk' => ace360_pair( 'Work', 'Werk' ), '#vragen' => ace360_pair( 'Questions', 'Vragen' ) ) as $h => $l ) {
		printf( '<li><a href="%s">%s</a></li>', esc_url( $h ), ace360_t( $l ) );
	}
	echo '</ul>';
}
class WP_Query {
	public function __construct( $a ) {}
	public function have_posts() { return false; }
}
function wp_reset_postdata() {}

require $theme . '/inc/template-helpers.php';
require $theme . '/inc/content.php';
include $theme . '/front-page.php';
