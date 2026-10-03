<?php
/**
 * Renders the front page outside WordPress, with minimal stubs, so the theme
 * can be previewed as static HTML. Usage: php render-preview.php [work] > out.html
 * ("work" renders the All work page instead of the front page).
 */

define( 'ABSPATH', __DIR__ );
define( 'ACE360_BOTH_LANGS', true ); // the preview keeps both languages and switches in the browser
$theme = dirname( __DIR__ ) . '/ace360';
$ace360_page = isset( $argv[1] ) && in_array( $argv[1], array( 'work', 'landing', 'blog', 'post' ), true ) ? $argv[1] : 'front';
$ace360_preview_landing = 'landing' === $ace360_page && isset( $argv[2] ) ? $argv[2] : '';
$ace360_preview_post    = 'post' === $ace360_page && isset( $argv[2] ) ? $argv[2] : '';

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
function body_class() { global $ace360_page; echo 'work' === $ace360_page ? 'class="post-type-archive"' : ( 'front' !== $ace360_page ? 'class="page"' : 'class="home"' ); }
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
	echo '<ul class="menu">';
	foreach ( ace360_nav_items() as $item ) {
		printf( '<li><a href="%s"%s>%s</a></li>', esc_url( $item[0] ), ace360_nav_current() === $item[2] ? ' aria-current="page"' : '', ace360_t( $item[1] ) );
	}
	echo '</ul>';
}
function get_template_directory() { global $theme; return $theme; }
function locate_template( $t ) { global $theme; return file_exists( $theme . '/' . $t ) ? $theme . '/' . $t : ''; }
class WP_Query {
	public function __construct( $a ) {}
	public function have_posts() { return false; }
}
function wp_reset_postdata() {}
function add_action() {}
function add_filter() {}
function get_query_var( $k ) { return ''; }
function wp_strip_all_tags( $s ) { return trim( strip_tags( $s ) ); }
function sanitize_title( $s ) { $s = strtolower( strtr( $s, array( '’' => '', "'" => '' ) ) ); return trim( preg_replace( '/[^a-z0-9]+/', '-', $s ), '-' ); }

require $theme . '/inc/template-helpers.php';
require $theme . '/inc/content.php';
require $theme . '/inc/lang.php';
require $theme . '/inc/landings.php';
require $theme . '/inc/blog.php';
require $theme . '/inc/blog-seed.php';

if ( 'blog' === $ace360_page ) {
	include $theme . '/blog.php'; // the starter posts in content/blog/ (in WordPress these are real posts)
	return;
}
if ( 'post' === $ace360_page ) {
	foreach ( ace360_seed_posts() as $sp ) {
		if ( $sp['slug'] !== $ace360_preview_post ) {
			continue;
		}
		$l      = 'en' === $sp['lang'] ? 'en' : 'nl';
		$months = 'en' === $l ? array( 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ) : array( 'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december' );
		$ace360_p = array(
			'slug'      => $sp['slug'],
			'title'     => $sp['title'],
			'excerpt'   => $sp['excerpt'],
			'cover'     => ace360_asset( 'img/blog/' . $sp['slug'] . '.jpg' ),
			'cat'       => $sp['category'],
			'date'      => date( 'j ' ) . $months[ date( 'n' ) - 1 ] . date( ' Y' ),
			'minutes'   => max( 1, (int) round( str_word_count( strip_tags( $sp['body'] ) ) / 220 ) ),
			'lang'      => $l,
			'layout'    => isset( $sp['layout'] ) ? $sp['layout'] : 'cover',
			'takeaways' => isset( $sp['takeaways'] ) ? array_values( array_filter( array_map( 'trim', explode( '|', $sp['takeaways'] ) ) ) ) : array(),
			'service'   => isset( $sp['service'] ) ? $sp['service'] : '',
			'body'      => ace360_post_media( $sp['body'], $l ),
			'url'       => $sp['slug'] . '.html',
		);
		get_header();
		echo '<main id="main" class="site-main post-main">';
		get_template_part( 'template-parts/post-article', null, array( 'p' => $ace360_p ) );
		echo '</main>';
		get_footer();
	}
	return;
}
include $theme . ( 'work' === $ace360_page ? '/archive-ace_project.php' : ( 'landing' === $ace360_page ? '/landing.php' : '/front-page.php' ) );
