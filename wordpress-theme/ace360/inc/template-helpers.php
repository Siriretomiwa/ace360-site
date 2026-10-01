<?php
/**
 * Template helpers: Customizer defaults and small render functions.
 *
 * @package ace360
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Default values for every Customizer setting the theme reads.
 */
function ace360_defaults() {
	return array(
		'hero_eyebrow'  => __( 'Web studio for Dutch brands', 'ace360' ),
		'hero_title'    => __( "Websites that\n*move*\nDutch brands.", 'ace360' ),
		'hero_text'     => __( 'We design and build fast, animated WordPress and WooCommerce sites for businesses in the Netherlands. Dutch and English, iDEAL checkout, AVG-proof and accessible from the first release.', 'ace360' ),
		'cta_label'     => __( 'Start a project', 'ace360' ),
		'contact_title' => __( "Let's build\n*yours.*", 'ace360' ),
		'contact_text'  => __( 'Tell us about your brand and what the site has to do. You get a reply within one working day, with a first plan and an honest estimate.', 'ace360' ),
		'contact_email' => 'hallo@ace360services.nl',
		'contact_phone' => '',
		'city'          => __( 'The Netherlands', 'ace360' ),
		'kvk'           => '',
		'btw'           => '',
	);
}

/**
 * Read a theme mod, falling back to the theme default.
 *
 * @param string $key Setting key.
 * @return string
 */
function ace360_mod( $key ) {
	$defaults = ace360_defaults();
	$default  = isset( $defaults[ $key ] ) ? $defaults[ $key ] : '';
	$value    = get_theme_mod( 'ace360_' . $key, $default );
	return ( '' === $value || null === $value ) ? $default : (string) $value;
}

/**
 * Render a display headline. Each line becomes a masked row for the reveal
 * animation; words wrapped in *asterisks* get the stretching accent style.
 *
 * @param string $text Headline with newlines between rows.
 * @return string Safe HTML.
 */
function ace360_headline( $text ) {
	$lines = preg_split( '/\r\n|\r|\n/', trim( $text ) );
	$out   = '';
	foreach ( $lines as $line ) {
		$line = trim( $line );
		if ( '' === $line ) {
			continue;
		}
		$html = esc_html( $line );
		$html = preg_replace( '/\*(.+?)\*/', '<em class="stretch">$1</em>', $html );
		$out .= '<span class="line"><span class="line-inner">' . $html . '</span></span>';
	}
	return $out;
}

/**
 * Wordmark used when no custom logo is uploaded: a small 360° tile ring plus "ace360".
 */
function ace360_wordmark() {
	return '<span class="wordmark" aria-hidden="true">'
		. '<svg class="wordmark-ring" viewBox="0 0 32 32" width="28" height="28">'
		. '<circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="5.2 2.34"/>'
		. '<rect x="13" y="1.5" width="6" height="6" rx="1" class="wordmark-tile"/>'
		. '</svg>'
		. '<span class="wordmark-text">ace<b>360</b></span>'
		. '</span>';
}

/**
 * Example projects shown until real Projects are published.
 */
function ace360_example_projects() {
	return array(
		array(
			'type'    => __( 'Webshop', 'ace360' ),
			'title'   => __( 'Specialty coffee roaster', 'ace360' ),
			'text'    => __( 'WooCommerce subscriptions, iDEAL via Mollie, PostNL label printing.', 'ace360' ),
			'variant' => 'roast',
		),
		array(
			'type'    => __( 'Portfolio', 'ace360' ),
			'title'   => __( 'Architecture studio', 'ace360' ),
			'text'    => __( 'Scroll-driven 3D model viewer, bilingual case studies.', 'ace360' ),
			'variant' => 'grid',
		),
		array(
			'type'    => __( 'Booking site', 'ace360' ),
			'title'   => __( 'City bike rental', 'ace360' ),
			'text'    => __( 'Live availability, postcode autofill, Dutch and English checkout.', 'ace360' ),
			'variant' => 'wheel',
		),
		array(
			'type'    => __( 'Lookbook', 'ace360' ),
			'title'   => __( 'Independent fashion label', 'ace360' ),
			'text'    => __( 'Motion-led product stories with GSAP and WebGL image effects.', 'ace360' ),
			'variant' => 'drape',
		),
	);
}

/**
 * Small inline icons for the Dutch-market grid. Paths are simple geometry.
 *
 * @param string $name Icon name.
 * @return string SVG markup.
 */
function ace360_tile_icon( $name ) {
	$icons = array(
		'pay'     => '<rect x="6" y="11" width="36" height="26" rx="4"/><path d="M6 19h36"/><path d="M13 29h8"/>',
		'pin'     => '<path d="M24 42s14-12.5 14-23a14 14 0 0 0-28 0c0 10.5 14 23 14 23z"/><circle cx="24" cy="19" r="5"/>',
		'shield'  => '<path d="M24 5l15 6v11c0 10-6.5 17-15 21-8.5-4-15-11-15-21V11z"/><path d="M17 24l5 5 9-10"/>',
		'access'  => '<circle cx="24" cy="10" r="4"/><path d="M10 17l14 3 14-3"/><path d="M24 20v9l-7 13"/><path d="M24 29l7 13"/>',
		'lang'    => '<path d="M6 10h20"/><path d="M16 6v4"/><path d="M22 10c-2 9-8 15-14 18"/><path d="M11 16c3 5 7 9 12 11"/><path d="M27 42l8-20 8 20"/><path d="M30 35h10"/>',
		'ship'    => '<path d="M5 14h24v18H5z"/><path d="M29 20h8l6 7v5H29z"/><circle cx="13" cy="35" r="4"/><circle cx="35" cy="35" r="4"/>',
	);
	$path = isset( $icons[ $name ] ) ? $icons[ $name ] : '';
	return '<svg class="tile-icon" viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . $path . '</svg>';
}
