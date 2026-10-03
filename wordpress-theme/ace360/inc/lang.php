<?php
/**
 * Languages on their own URLs, so search engines see one clean language per page:
 * Dutch at / (the default), English under /en/ (/en/, /en/work/, /en/<landing>/).
 * Templates print only the current language (ace360_t()); the EN/NL switch links
 * to the same page in the other language.
 *
 * @package ace360
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Current language: 'nl' or 'en'.
 *
 * @return string
 */
function ace360_lang() {
	global $ace360_force_lang;
	if ( ! empty( $ace360_force_lang ) ) {
		return $ace360_force_lang;
	}
	if ( function_exists( 'get_query_var' ) && 'en' === get_query_var( 'ace360_lang' ) ) {
		return 'en';
	}
	// Old ?lang=en links still work (and are redirected to /en/ where there is a clean URL).
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- language flag only.
	return ( isset( $_GET['lang'] ) && 'en' === $_GET['lang'] ) ? 'en' : 'nl';
}

/**
 * The theme previews (tools/render-preview.php) keep both languages in the page and switch in the browser.
 */
function ace360_both_langs() {
	return defined( 'ACE360_BOTH_LANGS' ) && ACE360_BOTH_LANGS;
}

/**
 * A theme URL in the given language: ace360_url( '/' ), ace360_url( '/work/' ), ace360_url( '/website-laten-maken/' ).
 *
 * @param string      $path Path for the Dutch site, starting with '/'.
 * @param string|null $lang 'nl' or 'en'; defaults to the current language.
 * @return string
 */
function ace360_url( $path = '/', $lang = null ) {
	$lang = $lang ? $lang : ace360_lang();
	if ( ace360_both_langs() ) {
		return home_url( $path );
	}
	return home_url( 'en' === $lang ? '/en' . $path : $path );
}

/**
 * Link to a section of the front page (#book, #prijs …), or just the hash on the front page itself.
 *
 * @param string $hash e.g. '#book'.
 * @return string
 */
function ace360_home_hash( $hash ) {
	// Landing pages carry their own estimator (#prijs) and booking/contact section (#book, #write).
	if ( is_front_page() || ( ace360_current_landing() && in_array( $hash, array( '#book', '#write', '#prijs', '#contact' ), true ) ) ) {
		return $hash;
	}
	return ace360_url( '/' ) . $hash;
}

/**
 * This page in the other language (or in $lang). Empty when there is no translated URL.
 *
 * @param string $lang 'nl' or 'en'.
 * @return string
 */
function ace360_alt_url( $lang ) {
	$landing = ace360_current_landing();
	if ( $landing ) {
		return ace360_landing_url( $landing, $lang );
	}
	if ( is_front_page() ) {
		return ace360_url( '/', $lang );
	}
	if ( is_post_type_archive( 'ace_project' ) ) {
		return ace360_url( '/work/', $lang );
	}
	return '';
}

/**
 * Rewrite rules for /en/… and the landing pages.
 */
function ace360_lang_rewrites() {
	add_rewrite_tag( '%ace360_lang%', '(en)' );
	add_rewrite_tag( '%ace360_front%', '(1)' );
	add_rewrite_tag( '%ace360_landing%', '([a-z0-9-]+)' );
	add_rewrite_rule( '^en/?$', 'index.php?ace360_lang=en&ace360_front=1', 'top' );
	add_rewrite_rule( '^en/work/?$', 'index.php?post_type=ace_project&ace360_lang=en', 'top' );
	foreach ( ace360_landings() as $key => $l ) {
		add_rewrite_rule( '^' . preg_quote( $l['slug']['nl'], '/' ) . '/?$', 'index.php?ace360_landing=' . $key, 'top' );
		add_rewrite_rule( '^en/' . preg_quote( $l['slug']['en'], '/' ) . '/?$', 'index.php?ace360_landing=' . $key . '&ace360_lang=en', 'top' );
	}
}
add_action( 'init', 'ace360_lang_rewrites' );

/**
 * /en/ shows the real front page (a static page or the latest posts).
 *
 * @param array $vars Query vars.
 * @return array
 */
function ace360_lang_request( $vars ) {
	if ( ! empty( $vars['ace360_front'] ) ) {
		unset( $vars['ace360_front'] );
		if ( 'page' === get_option( 'show_on_front' ) && get_option( 'page_on_front' ) ) {
			$vars['page_id'] = (int) get_option( 'page_on_front' );
		}
	}
	return $vars;
}
add_filter( 'request', 'ace360_lang_request' );

/**
 * A landing page is not the blog home or the front page.
 *
 * @param WP_Query $q Query.
 */
function ace360_landing_parse_query( $q ) {
	if ( $q->is_main_query() && $q->get( 'ace360_landing' ) ) {
		$q->is_home       = false;
		$q->set( 'posts_per_page', 1 );
		$q->set( 'no_found_rows', true );
	}
}
add_action( 'parse_query', 'ace360_landing_parse_query' );

/**
 * Keep /en/… and landing URLs as they are (WordPress would otherwise "correct" them to the Dutch URL),
 * send old ?lang=en links to their clean URL, and 404 unknown landing keys.
 *
 * @param string $redirect Redirect URL.
 * @return string|false
 */
function ace360_lang_redirect_canonical( $redirect ) {
	if ( 'en' === get_query_var( 'ace360_lang' ) || get_query_var( 'ace360_landing' ) ) {
		return false;
	}
	return $redirect;
}
add_filter( 'redirect_canonical', 'ace360_lang_redirect_canonical' );

/**
 * Redirect legacy ?lang=en URLs and handle unknown landing keys.
 */
function ace360_lang_template_redirect() {
	$key = get_query_var( 'ace360_landing' );
	if ( $key && ! isset( ace360_landings()[ $key ] ) ) {
		global $wp_query;
		$wp_query->set_404();
		status_header( 404 );
		return;
	}
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- language flag only.
	if ( isset( $_GET['lang'] ) && 'en' !== get_query_var( 'ace360_lang' ) && ! isset( $_GET['ace360_call'] ) ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$to = ace360_alt_url( 'en' === $_GET['lang'] ? 'en' : 'nl' );
		if ( $to ) {
			wp_safe_redirect( $to, 301 );
			exit;
		}
	}
}
add_action( 'template_redirect', 'ace360_lang_template_redirect', 1 );

/**
 * <html lang="…">: the page language, not the site locale.
 *
 * @return string
 */
function ace360_html_lang() {
	return 'en' === ace360_lang() ? 'en' : 'nl-NL';
}

/**
 * The language switch: links to this page in Dutch and English.
 */
function ace360_lang_switch() {
	$cur = ace360_lang();
	echo '<div class="lang-switch" role="group" aria-label="Language / Taal">';
	foreach ( array( 'nl' => 'NL', 'en' => 'EN' ) as $l => $label ) {
		$href = ace360_both_langs() ? '' : ace360_alt_url( $l );
		if ( ! $href ) {
			$href = ace360_url( '/', $l );
		}
		if ( ace360_both_langs() ) {
			printf( '<button type="button" data-set-lang="%1$s" aria-pressed="%2$s">%3$s</button>', esc_attr( $l ), $l === $cur ? 'true' : 'false', esc_html( $label ) );
		} else {
			printf( '<a href="%1$s" data-set-lang="%2$s" hreflang="%2$s" lang="%2$s" aria-current="%3$s">%4$s</a>', esc_url( $href ), esc_attr( $l ), $l === $cur ? 'true' : 'false', esc_html( $label ) );
		}
	}
	echo '</div>';
}
