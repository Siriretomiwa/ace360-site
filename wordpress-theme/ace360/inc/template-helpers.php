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
		'email'        => 'hello@ace360services.nl',
		'hours_en'     => 'Calls Mon–Fri 15:30–16:30 and 17:30–19:00, Sat 09:00–13:30 (Amsterdam time)',
		'hours_nl'     => 'Bellen ma–vr 15:30–16:30 en 17:30–19:00, za 09:00–13:30',
		'kvk'          => '94618240',
		'btw'          => '',
		'book_weekday' => '15:30-16:30, 17:30-19:00',
		'book_saturday' => '09:00-13:30',
		'book_sunday'  => '',
		'book_length'  => '20',
		'book_step'    => '30',
		'book_notice'  => '12',
		'book_days'    => '21',
		'book_off'     => '',
	);
}

/**
 * Time zone the call calendar runs in (the business is in the Netherlands).
 */
function ace360_book_tz() {
	return apply_filters( 'ace360_book_timezone', 'Europe/Amsterdam' );
}

/**
 * Parse "15:30-16:30, 17:30-19:00" into minute ranges: array( array( 930, 990 ), ... ).
 *
 * @param string $text Free-time windows.
 * @return array
 */
function ace360_book_windows( $text ) {
	$out = array();
	preg_match_all( '/(\d{1,2})[:.](\d{2})\s*[-–]\s*(\d{1,2})[:.](\d{2})/u', (string) $text, $m, PREG_SET_ORDER );
	foreach ( $m as $w ) {
		$a = min( 1440, (int) $w[1] * 60 + (int) $w[2] );
		$b = min( 1440, (int) $w[3] * 60 + (int) $w[4] );
		if ( $b > $a ) {
			$out[] = array( $a, $b );
		}
	}
	return $out;
}

/**
 * Call-booking rules, shared by the calendar (JS) and the booking endpoint.
 * 'week' is keyed by day of the week, 0 = Sunday.
 *
 * @return array
 */
function ace360_book_rules() {
	$weekday = ace360_book_windows( ace360_mod( 'book_weekday' ) );
	$sat     = ace360_book_windows( ace360_mod( 'book_saturday' ) );
	$sun     = ace360_book_windows( ace360_mod( 'book_sunday' ) );
	preg_match_all( '/\d{4}-\d{2}-\d{2}/', ace360_mod( 'book_off' ), $off );
	return array(
		'tz'     => ace360_book_tz(),
		'week'   => array( $sun, $weekday, $weekday, $weekday, $weekday, $weekday, $sat ),
		'len'    => max( 5, min( 240, (int) ace360_mod( 'book_length' ) ) ),
		'step'   => max( 5, min( 240, (int) ace360_mod( 'book_step' ) ) ),
		'notice' => max( 0, min( 720, (int) ace360_mod( 'book_notice' ) ) ),
		'days'   => max( 1, min( 90, (int) ace360_mod( 'book_days' ) ) ),
		'off'    => array_values( array_unique( $off[0] ) ),
	);
}

/**
 * Every bookable start time (Unix seconds) in the booking horizon, before
 * removing the ones already taken.
 *
 * @param int|null $now Current time, for testing.
 * @return int[]
 */
function ace360_book_all_slots( $now = null ) {
	$r   = ace360_book_rules();
	$tz  = new DateTimeZone( $r['tz'] );
	$now = null === $now ? time() : $now;
	$min = $now + $r['notice'] * 3600;
	$day = ( new DateTimeImmutable( '@' . $now ) )->setTimezone( $tz )->setTime( 0, 0 );
	$out = array();
	for ( $i = 0; $i < $r['days']; $i++ ) {
		$d = $day->modify( '+' . $i . ' day' );
		if ( in_array( $d->format( 'Y-m-d' ), $r['off'], true ) ) {
			continue;
		}
		foreach ( $r['week'][ (int) $d->format( 'w' ) ] as $w ) {
			for ( $m = $w[0]; $m + $r['len'] <= $w[1]; $m += $r['step'] ) {
				$ts = $d->setTime( intdiv( $m, 60 ), $m % 60 )->getTimestamp();
				if ( $ts >= $min ) {
					$out[] = $ts;
				}
			}
		}
	}
	return $out;
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
