<?php
/**
 * Template helpers: business details, translation output and small render functions.
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
		'phone'    => '+31 6 17 85 84 90',
		'whatsapp' => '31617858490',
		'email'    => 'info@ace360services.nl',
		'hours_en' => 'Mon–Fri 09:00–18:00 CET',
		'hours_nl' => 'Ma–vr 09:00–18:00',
		'kvk'      => '94618240',
		'btw'      => '',
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
 * Print-ready bilingual text: both languages, the EN/NL switch shows one.
 *
 * @param array|string $pair array( 'en' => ..., 'nl' => ... ) or a plain string.
 * @return string Safe HTML.
 */
function ace360_t( $pair ) {
	if ( ! is_array( $pair ) ) {
		return esc_html( $pair );
	}
	if ( $pair['en'] === $pair['nl'] ) {
		return esc_html( $pair['en'] );
	}
	return '<span data-l="en" lang="en">' . esc_html( $pair['en'] ) . '</span><span data-l="nl" lang="nl">' . esc_html( $pair['nl'] ) . '</span>';
}

/**
 * Bilingual text where *words* get the orange highlight.
 *
 * @param array $pair Pair.
 * @return string Safe HTML.
 */
function ace360_hl( $pair ) {
	$out = array();
	foreach ( array( 'en', 'nl' ) as $l ) {
		$html      = preg_replace( '/\*(.+?)\*/', '<em class="hl">$1</em>', esc_html( $pair[ $l ] ) );
		$out[ $l ] = '<span data-l="' . $l . '" lang="' . $l . '">' . $html . '</span>';
	}
	return $out['en'] . $out['nl'];
}

/**
 * Echo bilingual text.
 *
 * @param array|string $pair Pair or string.
 */
function ace360_e( $pair ) {
	echo ace360_t( $pair ); // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in ace360_t().
}

/**
 * tel: link for the phone number.
 */
function ace360_tel() {
	return 'tel:' . preg_replace( '/[^0-9+]/', '', ace360_mod( 'phone' ) );
}

/**
 * WhatsApp click-to-chat link.
 */
function ace360_wa() {
	return 'https://wa.me/' . preg_replace( '/[^0-9]/', '', ace360_mod( 'whatsapp' ) );
}

/**
 * Wordmark used when no custom logo is uploaded.
 */
function ace360_wordmark() {
	return '<span class="wordmark" aria-hidden="true">'
		. '<svg class="wordmark-ring" viewBox="0 0 32 32" width="26" height="26">'
		. '<circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-dasharray="5.2 2.34"/>'
		. '<rect x="13" y="1.5" width="6" height="6" rx="1" fill="currentColor"/>'
		. '</svg>'
		. '<span class="wordmark-text">Ace 360<span class="wordmark-sub">Services</span></span>'
		. '</span>';
}
