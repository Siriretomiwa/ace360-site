<?php
/**
 * Renders the front page outside WordPress, with minimal stubs, so the theme
 * can be previewed as static HTML. Usage: php render-preview.php [work] > out.html
 * ("work" renders the All work page instead of the front page).
 */

define( 'ABSPATH', __DIR__ );
$theme = dirname( __DIR__ ) . '/ace360';
$ace360_page = isset( $argv[1] ) && 'work' === $argv[1] ? 'work' : 'front';

function __( $s, $d = null ) { return $s; }
function esc_html__( $s, $d = null ) { return esc_html( $s ); }
function esc_attr__( $s, $d = null ) { return esc_attr( $s ); }
function esc_html_e( $s, $d = null ) { echo esc_html( $s ); }
function esc_attr_e( $s, $d = null ) { echo esc_attr( $s ); }
function esc_html( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' ); }
function esc_attr( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' ); }
function esc_url( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' ); }
function get_theme_mod( $k, $d = false ) { return $d; }
function get_template_directory_uri() { return '__THEME__'; }
function home_url( $p = '' ) { return ( '' === $p || '/' === $p ) ? 'index.html' : ( '/' === $p[0] ? 'index.html' . substr( $p, 1 ) : $p ); }
function admin_url( $p = '' ) { return '#'; }
function get_bloginfo( $k = '' ) { return 'Ace 360 Services'; }
function bloginfo( $k = '' ) { echo 'charset' === $k ? 'UTF-8' : 'ace360 services'; }
function language_attributes() { echo 'lang="en"'; }
function body_class() { global $ace360_page; echo 'work' === $ace360_page ? 'class="post-type-archive"' : 'class="home"'; }
function wp_head() { echo "<!--wp_head-->\n"; }
function wp_footer() { echo "<!--wp_footer-->\n"; }
function wp_body_open() {}
function has_custom_logo() { return false; }
function has_nav_menu( $l ) { return false; }
function is_front_page() { global $ace360_page; return 'front' === $ace360_page; }
function is_post_type_archive( $t = '' ) { global $ace360_page; return 'work' === $ace360_page; }
function get_post_type_archive_link( $t ) { return 'work.html'; }
function wp_nonce_field() {}
function sanitize_key( $s ) { return $s; }
function sanitize_text_field( $s ) { return $s; }
function wp_unslash( $s ) { return $s; }
function gmdate_stub() {}
function get_header() { global $theme; include $theme . '/header.php'; }
function get_footer() { global $theme; include $theme . '/footer.php'; }
function get_template_part( $slug, $name = null, $args = array() ) { global $theme; include $theme . '/' . $slug . '.php'; }
function wp_parse_url( $u, $c = -1 ) { return parse_url( $u, $c ); }
function get_the_post_thumbnail_url() { return ''; }
function apply_filters( $t, $v ) { return $v; }
function wp_json_encode( $v ) { return json_encode( $v ); }
function wp_get_attachment_image() { return ''; }
function ace360_fallback_menu() {
	$base = is_front_page() ? '' : 'index.html';
	echo '<ul class="menu">';
	foreach ( array( '#diensten' => ace360_pair( 'Services', 'Diensten' ), '#werkwijze' => ace360_pair( 'Process', 'Werkwijze' ), '#werk' => ace360_pair( 'Work', 'Werk' ), '#vragen' => ace360_pair( 'Questions', 'Vragen' ) ) as $h => $l ) {
		printf( '<li><a href="%s">%s</a></li>', esc_url( $base . $h ), ace360_t( $l ) );
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
include $theme . ( 'work' === $ace360_page ? '/archive-ace_project.php' : '/front-page.php' );
