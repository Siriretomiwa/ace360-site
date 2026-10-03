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

require $theme . '/inc/template-helpers.php';
require $theme . '/inc/content.php';
require $theme . '/inc/lang.php';
require $theme . '/inc/landings.php';
require $theme . '/inc/blog.php';
require $theme . '/inc/blog-seed.php';

if ( 'blog' === $ace360_page || 'post' === $ace360_page ) {
	// The blog from the starter posts in content/blog/ (in WordPress these are real posts).
	$ace360_posts = ace360_seed_posts();
	$ace360_cover = function ( $slug ) { return '__THEME__/assets/img/blog/' . $slug . '.jpg'; };
	$ace360_words = function ( $p ) { return max( 1, (int) round( str_word_count( strip_tags( $p['body'] ) ) / 220 ) ); };
	get_header();
	if ( 'blog' === $ace360_page ) {
		echo '<main id="main" class="site-main page-shell blog-index"><div class="wrap"><header class="page-head"><p class="kicker">Blog</p><h1>' . ace360_hl( ace360_pair( 'Website tips you can *use*', 'Websitetips die je meteen kunt *gebruiken*' ) ) . '</h1><p class="lede">' . ace360_t( ace360_pair( 'Short, practical articles about websites, online stores, booking and being found on Google. In WordPress, Dutch posts are at /blog/ and English posts at /en/blog/.', 'Korte, praktische artikelen over websites, webshops, online boeken en gevonden worden in Google. In WordPress staan Nederlandse artikelen op /blog/ en Engelse op /en/blog/.' ) ) . '</p></header><ul class="blog-grid">';
		foreach ( array_reverse( $ace360_posts ) as $p ) {
			printf( '<li class="blog-card"><a href="%1$s.html"><span class="blog-thumb"><img src="%2$s" alt="" loading="lazy"></span><span class="blog-meta mono">%3$s · %4$s · %5$d min</span><span class="blog-title">%6$s</span><span class="blog-excerpt">%7$s</span></a></li>',
				esc_attr( $p['slug'] ), esc_attr( $ace360_cover( $p['slug'] ) ), esc_html( strtoupper( $p['lang'] ) ), esc_html( $p['category'] ), $ace360_words( $p ), esc_html( $p['title'] ), esc_html( $p['excerpt'] ) );
		}
		echo '</ul></div></main>';
	} else {
		foreach ( $ace360_posts as $p ) {
			if ( $p['slug'] !== $ace360_preview_post ) {
				continue;
			}
			$svc = isset( ace360_landings()[ $p['service'] ] ) ? $p['service'] : 'kosten';
			$sl  = ace360_landings()[ $svc ];
			$l   = 'en' === $p['lang'] ? 'en' : 'nl';
			echo '<main id="main" class="site-main page-shell"><article class="wrap entry"><header class="page-head"><nav class="crumbs mono"><a href="index.html">Ace 360</a> <span>/</span> <a href="blog.html">Blog</a></nav>';
			echo '<p class="eyebrow">' . esc_html( $p['category'] . ' · ' . $ace360_words( $p ) . ( 'en' === $l ? ' min read' : ' min lezen' ) ) . '</p>';
			echo '<h1 class="display h1">' . esc_html( $p['title'] ) . '</h1><p class="lede">' . esc_html( $p['excerpt'] ) . '</p></header>';
			echo '<figure class="entry-media"><img src="' . esc_attr( $ace360_cover( $p['slug'] ) ) . '" alt=""></figure><div class="entry-content prose">' . $p['body'] . '</div>'; // phpcs:ignore -- theme file.
			echo '<aside class="post-cta"><p class="kicker">Ace 360 Services</p><p class="post-cta-title">' . esc_html( str_replace( '*', '', $sl['h1'][ $l ] ) ) . '</p><p>' . esc_html( $sl['desc'][ $l ] ) . '</p><div class="actions"><a class="btn btn-orange" href="' . esc_attr( ace360_landing_url( $svc ) ) . '">' . ( 'en' === $l ? 'See an estimate' : 'Bekijk een prijsindicatie' ) . ' <span aria-hidden="true">→</span></a></div></aside></article></main>';
		}
	}
	get_footer();
	return;
}
include $theme . ( 'work' === $ace360_page ? '/archive-ace_project.php' : ( 'landing' === $ace360_page ? '/landing.php' : '/front-page.php' ) );
