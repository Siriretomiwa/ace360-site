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
 * The five build steps, shown as one chapter each.
 */
function ace360_steps() {
	return array(
		array(
			'word'   => __( 'Listen', 'ace360' ),
			'nl'     => 'Kennismaken',
			'time'   => __( 'Week 1', 'ace360' ),
			'text'   => __( 'Thirty minutes about your brand, your customers and what the site has to achieve. You get a sitemap and a fixed quote within a week.', 'ace360' ),
			'screen' => 'wire',
		),
		array(
			'word'   => __( 'Design', 'ace360' ),
			'nl'     => 'Ontwerpen',
			'time'   => __( 'Weeks 2–3', 'ace360' ),
			'text'   => __( 'A clickable design of the key pages, with the motion designed in from the start. You approve it before we write a line of code.', 'ace360' ),
			'screen' => 'design',
		),
		array(
			'word'   => __( 'Build', 'ace360' ),
			'nl'     => 'Bouwen',
			'time'   => __( 'Weeks 4–7', 'ace360' ),
			'text'   => __( 'Layer by layer on a staging site you can follow. Payments, translations and integrations are tested with real orders.', 'ace360' ),
			'screen' => 'wire',
		),
		array(
			'word'   => __( 'Launch', 'ace360' ),
			'nl'     => 'Lanceren',
			'time'   => __( 'Week 8', 'ace360' ),
			'text'   => __( 'Redirects, speed and accessibility checks, then go-live. Your team gets a short training on editing every page.', 'ace360' ),
			'screen' => 'live',
		),
		array(
			'word'   => __( 'Grow', 'ace360' ),
			'nl'     => 'Groeien',
			'time'   => __( 'Ongoing', 'ace360' ),
			'text'   => __( 'Updates, backups and a monthly report on speed, search and sales, with concrete proposals for what to improve next.', 'ace360' ),
			'screen' => 'chart',
		),
	);
}

/**
 * Dutch-market features, cycled in the sticky "Built for the Netherlands" chapter.
 */
function ace360_market() {
	return array(
		array( 'ideal', __( 'iDEAL checkout', 'ace360' ), __( 'iDEAL, Bancontact and Klarna through Mollie. The payment methods Dutch and Belgian customers expect, in a checkout that takes one screen.', 'ace360' ) ),
		array( 'postcode', __( 'Postcode autofill', 'ace360' ), __( 'Postcode plus house number fills in street and city. Fewer typos, fewer parcels returned to sender.', 'ace360' ) ),
		array( 'avg', __( 'AVG-proof', 'ace360' ), __( 'A cookie banner that actually blocks trackers until visitors agree. Fonts and scripts come from your own server.', 'ace360' ) ),
		array( 'access', __( 'Accessible', 'ace360' ), __( 'Built to WCAG 2.2 AA for the European Accessibility Act: keyboard navigation, contrast and screen-reader labels.', 'ace360' ) ),
		array( 'lang', __( 'Nederlands & English', 'ace360' ), __( 'Both languages with proper hreflang, so each version ranks in search on its own.', 'ace360' ) ),
		array( 'ship', __( 'PostNL, DHL, Sendcloud', 'ace360' ), __( 'Shipping labels and track-and-trace emails straight from your WooCommerce orders.', 'ace360' ) ),
	);
}

/**
 * Example projects, cycled in the sticky "Work" chapter until real Projects exist.
 */
function ace360_example_projects() {
	return array(
		array(
			'type'    => __( 'Webshop', 'ace360' ),
			'title'   => __( 'Specialty coffee roaster', 'ace360' ),
			'text'    => __( 'WooCommerce subscriptions, iDEAL via Mollie and PostNL label printing.', 'ace360' ),
			'variant' => 'roast',
		),
		array(
			'type'    => __( 'Portfolio', 'ace360' ),
			'title'   => __( 'Architecture studio', 'ace360' ),
			'text'    => __( 'A scroll-driven 3D model viewer with bilingual case studies.', 'ace360' ),
			'variant' => 'grid',
		),
		array(
			'type'    => __( 'Booking site', 'ace360' ),
			'title'   => __( 'City bike rental', 'ace360' ),
			'text'    => __( 'Live availability, postcode autofill and a Dutch and English checkout.', 'ace360' ),
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
