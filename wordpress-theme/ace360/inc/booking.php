<?php
/**
 * Call booking: visitors pick a free time in the contact section and the call
 * lands in WP Admin → Calls, with an email (and calendar invite) to both sides.
 *
 * Free hours, call length and days off are set in Appearance → Customize →
 * ace360 call booking. Times are Europe/Amsterdam; visitors see their own time.
 *
 * Endpoints:
 *   GET  /wp-json/ace360/v1/slots  → { slots: [unix, ...], tz, len }
 *   POST /wp-json/ace360/v1/book   → { ok: true, start, id }
 *
 * @package ace360
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Bookings are a private post type: one post per call.
 */
function ace360_register_calls() {
	register_post_type(
		'ace360_call',
		array(
			'labels'          => array(
				'name'          => __( 'Calls', 'ace360' ),
				'singular_name' => __( 'Call', 'ace360' ),
				'edit_item'     => __( 'Call details', 'ace360' ),
				'not_found'     => __( 'No calls booked yet.', 'ace360' ),
				'all_items'     => __( 'Booked calls', 'ace360' ),
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => true,
			'menu_position'   => 3,
			'menu_icon'       => 'dashicons-calendar-alt',
			'supports'        => array( 'title' ),
			'capability_type' => 'post',
			'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
			'map_meta_cap'    => true,
		)
	);
}
add_action( 'init', 'ace360_register_calls' );

/**
 * Start times (Unix) of calls that are booked and not cancelled.
 *
 * @return int[]
 */
function ace360_book_taken() {
	$ids = get_posts(
		array(
			'post_type'        => 'ace360_call',
			'post_status'      => 'publish',
			'posts_per_page'   => -1,
			'fields'           => 'ids',
			'no_found_rows'    => true,
			'suppress_filters' => false,
			'meta_query'       => array( // phpcs:ignore WordPress.DB.SlowDBQuery -- small table.
				array(
					'key'     => '_ace360_start',
					'value'   => time() - DAY_IN_SECONDS,
					'compare' => '>=',
					'type'    => 'NUMERIC',
				),
			),
		)
	);
	return array_map(
		function ( $id ) {
			return (int) get_post_meta( $id, '_ace360_start', true );
		},
		$ids
	);
}

/**
 * Free start times: the schedule minus calls already booked.
 *
 * @return int[]
 */
function ace360_book_slots() {
	$r     = ace360_book_rules();
	$gap   = max( $r['len'], $r['step'] ) * 60;
	$taken = ace360_book_taken();
	return array_values(
		array_filter(
			ace360_book_all_slots(),
			function ( $ts ) use ( $taken, $gap ) {
				foreach ( $taken as $t ) {
					if ( abs( $ts - $t ) < $gap ) {
						return false;
					}
				}
				return true;
			}
		)
	);
}

/**
 * REST routes.
 */
function ace360_book_routes() {
	register_rest_route(
		'ace360/v1',
		'/slots',
		array(
			'methods'             => 'GET',
			'permission_callback' => '__return_true',
			'callback'            => function () {
				$r   = ace360_book_rules();
				$res = rest_ensure_response(
					array(
						'slots' => ace360_book_slots(),
						'tz'    => $r['tz'],
						'len'   => $r['len'],
					)
				);
				$res->header( 'Cache-Control', 'no-store, max-age=0' );
				return $res;
			},
		)
	);
	register_rest_route(
		'ace360/v1',
		'/book',
		array(
			'methods'             => 'POST',
			'permission_callback' => '__return_true',
			'callback'            => 'ace360_book_create',
		)
	);
}
add_action( 'rest_api_init', 'ace360_book_routes' );

/**
 * How the call happens.
 *
 * @return array
 */
function ace360_book_vias() {
	return array(
		'phone'    => ace360_pair( 'Phone call', 'Telefonisch' ),
		'whatsapp' => ace360_pair( 'WhatsApp call', 'WhatsApp-gesprek' ),
		'video'    => ace360_pair( 'Video call (Google Meet)', 'Videogesprek (Google Meet)' ),
	);
}

/**
 * Book a call.
 *
 * @param WP_REST_Request $req Request.
 * @return WP_REST_Response|WP_Error
 */
function ace360_book_create( WP_REST_Request $req ) {
	$p = $req->get_json_params();
	$p = is_array( $p ) ? $p : $req->get_body_params();

	// Honeypot: bots fill every field. Pretend it worked.
	if ( ! empty( $p['website'] ) ) {
		return rest_ensure_response( array( 'ok' => true ) );
	}

	// At most 5 bookings per hour from one address.
	$ip   = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
	$rate = 'ace360_book_rate_' . md5( $ip );
	$hits = (int) get_transient( $rate );
	if ( $hits >= 5 ) {
		return new WP_Error( 'ace360_rate', 'Too many bookings from this connection. Please email us instead.', array( 'status' => 429 ) );
	}

	$lang    = ( isset( $p['lang'] ) && 'nl' === $p['lang'] ) ? 'nl' : 'en';
	$start   = isset( $p['start'] ) ? (int) $p['start'] : 0;
	$name    = isset( $p['name'] ) ? sanitize_text_field( $p['name'] ) : '';
	$email   = isset( $p['email'] ) ? sanitize_email( $p['email'] ) : '';
	$phone   = isset( $p['phone'] ) ? sanitize_text_field( $p['phone'] ) : '';
	$company = isset( $p['company'] ) ? sanitize_text_field( $p['company'] ) : '';
	$via     = isset( $p['via'] ) ? sanitize_key( $p['via'] ) : 'phone';
	$note    = isset( $p['note'] ) ? sanitize_textarea_field( $p['note'] ) : '';
	$tz      = isset( $p['tz'] ) ? sanitize_text_field( $p['tz'] ) : '';
	$via     = array_key_exists( $via, ace360_book_vias() ) ? $via : 'phone';
	$tz      = in_array( $tz, timezone_identifiers_list(), true ) ? $tz : ace360_book_tz();

	if ( '' === $name || ! is_email( $email ) || empty( $p['consent'] ) || ( 'video' !== $via && strlen( preg_replace( '/\D/', '', $phone ) ) < 6 ) ) {
		return new WP_Error( 'ace360_invalid', 'Missing details.', array( 'status' => 400 ) );
	}

	// One booking at a time, so two people can never take the same slot.
	$lock = 'ace360_book_lock';
	$held = get_option( $lock );
	if ( $held && (int) $held > time() - 30 ) {
		return new WP_Error( 'ace360_busy', 'Busy, try again.', array( 'status' => 409 ) );
	}
	if ( ! add_option( $lock, time(), '', false ) ) {
		update_option( $lock, time(), false );
	}

	if ( ! in_array( $start, ace360_book_slots(), true ) ) {
		delete_option( $lock );
		return new WP_Error( 'ace360_taken', 'That time is no longer free.', array( 'status' => 409 ) );
	}

	$key = wp_generate_password( 24, false );
	$id  = wp_insert_post(
		array(
			'post_type'   => 'ace360_call',
			'post_status' => 'publish',
			'post_title'  => ace360_book_when( $start, ace360_book_tz(), 'en' ) . ' · ' . $name,
		),
		true
	);
	delete_option( $lock );
	if ( is_wp_error( $id ) ) {
		return new WP_Error( 'ace360_error', 'Could not save the booking.', array( 'status' => 500 ) );
	}

	$meta = compact( 'start', 'name', 'email', 'phone', 'company', 'via', 'note', 'tz', 'lang', 'key' );
	foreach ( $meta as $k => $v ) {
		update_post_meta( $id, '_ace360_' . $k, $v );
	}
	set_transient( $rate, $hits + 1, HOUR_IN_SECONDS );

	ace360_book_mail( $id, 'booked' );

	return rest_ensure_response(
		array(
			'ok'    => true,
			'uid'   => ace360_book_uid( $id ),
			'start' => $start,
		)
	);
}

/**
 * Read a booking's details.
 *
 * @param int $id Call post ID.
 * @return array
 */
function ace360_book_get( $id ) {
	$out = array( 'id' => (int) $id );
	foreach ( array( 'start', 'name', 'email', 'phone', 'company', 'via', 'note', 'tz', 'lang', 'key' ) as $k ) {
		$out[ $k ] = get_post_meta( $id, '_ace360_' . $k, true );
	}
	$out['start'] = (int) $out['start'];
	$out['lang']  = 'nl' === $out['lang'] ? 'nl' : 'en';
	$out['tz']    = $out['tz'] ? $out['tz'] : ace360_book_tz();
	return $out;
}

/**
 * "Thursday 9 October, 15:30" in the given language and time zone.
 *
 * @param int    $ts   Unix time.
 * @param string $tz   Time zone name.
 * @param string $lang en|nl.
 * @return string
 */
function ace360_book_when( $ts, $tz, $lang ) {
	$d    = ( new DateTimeImmutable( '@' . $ts ) )->setTimezone( new DateTimeZone( $tz ) );
	$days = 'nl' === $lang
		? array( 'zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag' )
		: array( 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' );
	$mons = 'nl' === $lang
		? array( 'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december' )
		: array( 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' );
	return $days[ (int) $d->format( 'w' ) ] . ' ' . $d->format( 'j' ) . ' ' . $mons[ (int) $d->format( 'n' ) - 1 ] . ', ' . $d->format( 'H:i' );
}

/**
 * Calendar UID, shared by the emailed invite and the "Add to calendar" button
 * so adding both never gives a duplicate.
 *
 * @param int $id Call post ID.
 * @return string
 */
function ace360_book_uid( $id ) {
	return 'ace360-call-' . (int) $id . '@' . wp_parse_url( home_url(), PHP_URL_HOST );
}

/**
 * Calendar invite for the call.
 *
 * @param array  $b      Booking.
 * @param string $method PUBLISH or CANCEL.
 * @return string
 */
function ace360_book_ics( $b, $method = 'PUBLISH' ) {
	$len  = ace360_book_rules()['len'];
	$esc  = function ( $s ) {
		return str_replace( array( '\\', ';', ',', "\r", "\n" ), array( '\\\\', '\\;', '\\,', '', '\\n' ), $s );
	};
	$desc = 'video' === $b['via']
		? 'Video call. The Google Meet link follows by email before the call.'
		: ( 'whatsapp' === $b['via'] ? 'WhatsApp call to ' : 'Phone call to ' ) . $b['phone'];
	$lines = array(
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Ace 360 Services//Call booking//EN',
		'CALSCALE:GREGORIAN',
		'METHOD:' . $method,
		'BEGIN:VEVENT',
		'UID:' . ace360_book_uid( $b['id'] ),
		'DTSTAMP:' . gmdate( 'Ymd\THis\Z' ),
		'DTSTART:' . gmdate( 'Ymd\THis\Z', $b['start'] ),
		'DTEND:' . gmdate( 'Ymd\THis\Z', $b['start'] + $len * 60 ),
		'SUMMARY:' . $esc( 'Ace 360 Services × ' . $b['name'] ),
		'DESCRIPTION:' . $esc( $desc ),
		'STATUS:' . ( 'CANCEL' === $method ? 'CANCELLED' : 'CONFIRMED' ),
		'SEQUENCE:' . ( 'CANCEL' === $method ? 1 : 0 ),
		'END:VEVENT',
		'END:VCALENDAR',
	);
	return implode( "\r\n", $lines ) . "\r\n";
}

/**
 * Emails to the owner and the visitor, for a new or cancelled call.
 *
 * @param int    $id   Call post ID.
 * @param string $what booked|cancelled.
 */
function ace360_book_mail( $id, $what ) {
	$b     = ace360_book_get( $id );
	$owner = ace360_mod( 'email' );
	$owner = is_email( $owner ) ? $owner : get_option( 'admin_email' );
	$l     = $b['lang'];
	$nl    = 'nl' === $l;
	$here  = ace360_book_when( $b['start'], ace360_book_tz(), 'en' );
	$there = ace360_book_when( $b['start'], $b['tz'], $l );
	$vias  = ace360_book_vias();
	$len   = ace360_book_rules()['len'];
	$same  = $b['tz'] === ace360_book_tz();

	$ics = trailingslashit( get_temp_dir() ) . 'ace360-call-' . $id . '-' . wp_generate_password( 6, false ) . '.ics';
	file_put_contents( $ics, ace360_book_ics( $b, 'cancelled' === $what ? 'CANCEL' : 'PUBLISH' ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	$files = file_exists( $ics ) ? array( $ics ) : array();

	// To the owner.
	$subject = ( 'cancelled' === $what ? 'Call cancelled: ' : 'New call: ' ) . $here . ' · ' . $b['name'];
	$body    = implode(
		"\n",
		array_filter(
			array(
				'cancelled' === $what ? 'This call was cancelled by the visitor.' : 'A call was booked on the website.',
				'',
				'When: ' . $here . ' (Amsterdam), ' . $len . ' min',
				$same ? null : 'Their time: ' . ace360_book_when( $b['start'], $b['tz'], 'en' ) . ' (' . $b['tz'] . ')',
				'How: ' . $vias[ $b['via'] ]['en'],
				'Name: ' . $b['name'],
				$b['company'] ? 'Company: ' . $b['company'] : null,
				'Email: ' . $b['email'],
				$b['phone'] ? 'Phone: ' . $b['phone'] : null,
				'Language: ' . ( $nl ? 'Nederlands' : 'English' ),
				$b['note'] ? "\nNote:\n" . $b['note'] : null,
				'',
				'All calls: ' . admin_url( 'edit.php?post_type=ace360_call' ),
			),
			function ( $line ) {
				return null !== $line;
			}
		)
	);
	wp_mail( $owner, $subject, $body, array( 'Reply-To: ' . $b['name'] . ' <' . $b['email'] . '>' ), $files );

	// To the visitor.
	$cancel = add_query_arg(
		array(
			'ace360_call' => $id,
			'key'         => $b['key'],
		),
		ace360_landing_url( 'contact', $nl ? 'nl' : 'en' )
	) . '#book';
	if ( 'cancelled' === $what ) {
		$subject = $nl ? 'Je gesprek is geannuleerd' : 'Your call is cancelled';
		$body    = $nl
			? "Hoi {$b['name']},\n\nJe gesprek op {$there} is geannuleerd. Wil je toch praten? Kies een nieuwe tijd op " . ace360_landing_url( 'contact', 'nl' ) . "#book\n\nAce 360 Services"
			: "Hi {$b['name']},\n\nYour call on {$there} is cancelled. Still want to talk? Pick a new time at " . ace360_landing_url( 'contact', 'en' ) . "#book\n\nAce 360 Services";
	} else {
		if ( 'video' === $b['via'] ) {
			$how = $nl ? 'We sturen je de Google Meet-link vóór het gesprek.' : 'We send you the Google Meet link before the call.';
		} elseif ( 'whatsapp' === $b['via'] ) {
			$how = ( $nl ? 'We bellen je via WhatsApp op ' : 'We call you on WhatsApp at ' ) . $b['phone'] . '.';
		} else {
			$how = ( $nl ? 'We bellen je op ' : 'We call you on ' ) . $b['phone'] . '.';
		}
		$subject = ( $nl ? 'Je gesprek met Ace 360 Services: ' : 'Your call with Ace 360 Services: ' ) . $there;
		$body    = $nl
			? "Hoi {$b['name']},\n\nJe gratis kennismakingsgesprek staat vast:\n\n{$there}" . ( $same ? '' : " (jouw tijd, {$b['tz']})" ) . ", {$len} minuten\n{$how}\n\nDe uitnodiging zit als bijlage bij deze mail, zodat je hem in je agenda kunt zetten.\n\nAndere tijd nodig? Antwoord op deze mail. Annuleren kan hier:\n{$cancel}\n\nTot dan,\nAce 360 Services\n" . $owner
			: "Hi {$b['name']},\n\nYour free intro call is booked:\n\n{$there}" . ( $same ? '' : " (your time, {$b['tz']})" ) . ", {$len} minutes\n{$how}\n\nThe invite is attached, so you can add it to your calendar.\n\nNeed another time? Just reply to this email. To cancel:\n{$cancel}\n\nTalk soon,\nAce 360 Services\n" . $owner;
	}
	wp_mail( $b['email'], $subject, $body, array( 'Reply-To: Ace 360 Services <' . $owner . '>' ), $files );

	if ( $files ) {
		wp_delete_file( $ics );
	}
}

/**
 * Cancel link from the confirmation email. The link itself only shows a
 * "Cancel this call?" button (mail scanners open links); the POST cancels.
 */
function ace360_book_cancel() {
	$id  = isset( $_POST['ace360_call'] ) ? absint( $_POST['ace360_call'] ) : 0;
	$key = isset( $_POST['key'] ) ? sanitize_text_field( wp_unslash( $_POST['key'] ) ) : '';
	$ok  = ace360_book_cancel_valid( $id, $key );
	if ( $ok ) {
		wp_trash_post( $id );
		ace360_book_mail( $id, 'cancelled' );
	}
	$back = wp_get_referer() ? strtok( wp_get_referer(), '?' ) : ace360_landing_url( 'contact', 'nl' );
	wp_safe_redirect( add_query_arg( 'ace360_call', $ok ? 'cancelled' : 'invalid', $back ) . '#book' );
	exit;
}
add_action( 'admin_post_nopriv_ace360_cancel_call', 'ace360_book_cancel' );
add_action( 'admin_post_ace360_cancel_call', 'ace360_book_cancel' );

/**
 * Is this a live, future call with the right key?
 *
 * @param int    $id  Call post ID.
 * @param string $key Secret from the email.
 * @return bool
 */
function ace360_book_cancel_valid( $id, $key ) {
	if ( ! $id || '' === $key || 'ace360_call' !== get_post_type( $id ) || 'publish' !== get_post_status( $id ) ) {
		return false;
	}
	$b = ace360_book_get( $id );
	return hash_equals( (string) $b['key'], $key ) && $b['start'] > time();
}

/**
 * Admin list: when, how, who; upcoming calls first.
 *
 * @param array $cols Columns.
 * @return array
 */
function ace360_call_columns( $cols ) {
	return array(
		'cb'           => $cols['cb'],
		'title'        => __( 'Call', 'ace360' ),
		'ace360_when'  => __( 'When (Amsterdam)', 'ace360' ),
		'ace360_via'   => __( 'How', 'ace360' ),
		'ace360_reach' => __( 'Contact', 'ace360' ),
		'ace360_note'  => __( 'Note', 'ace360' ),
	);
}
add_filter( 'manage_ace360_call_posts_columns', 'ace360_call_columns' );

/**
 * Column values.
 *
 * @param string $col Column.
 * @param int    $id  Post ID.
 */
function ace360_call_column( $col, $id ) {
	$b = ace360_book_get( $id );
	if ( 'ace360_when' === $col ) {
		echo esc_html( ace360_book_when( $b['start'], ace360_book_tz(), 'en' ) );
		if ( $b['start'] < time() ) {
			echo ' <span style="color:#888">(' . esc_html__( 'past', 'ace360' ) . ')</span>';
		}
	} elseif ( 'ace360_via' === $col ) {
		$v = ace360_book_vias();
		echo esc_html( isset( $v[ $b['via'] ] ) ? $v[ $b['via'] ]['en'] : '' );
	} elseif ( 'ace360_reach' === $col ) {
		printf( '<a href="%s">%s</a>', esc_url( 'mailto:' . $b['email'] ), esc_html( $b['email'] ) );
		if ( $b['phone'] ) {
			printf( '<br><a href="%s">%s</a>', esc_url( 'tel:' . preg_replace( '/[^0-9+]/', '', $b['phone'] ) ), esc_html( $b['phone'] ) );
		}
	} elseif ( 'ace360_note' === $col ) {
		echo esc_html( wp_trim_words( $b['note'], 16 ) );
	}
}
add_action( 'manage_ace360_call_posts_custom_column', 'ace360_call_column', 10, 2 );

/**
 * Sort the Calls list by call time, soonest first.
 *
 * @param WP_Query $q Query.
 */
function ace360_call_order( $q ) {
	if ( is_admin() && $q->is_main_query() && 'ace360_call' === $q->get( 'post_type' ) && ! $q->get( 'orderby' ) ) {
		$q->set( 'meta_key', '_ace360_start' );
		$q->set( 'orderby', 'meta_value_num' );
		$q->set( 'order', 'ASC' );
	}
}
add_action( 'pre_get_posts', 'ace360_call_order' );

/**
 * Details box on the call screen.
 */
function ace360_call_box() {
	add_meta_box(
		'ace360_call_details',
		__( 'Call details', 'ace360' ),
		function ( $post ) {
			$b    = ace360_book_get( $post->ID );
			$v    = ace360_book_vias();
			$rows = array(
				__( 'When (Amsterdam)', 'ace360' ) => ace360_book_when( $b['start'], ace360_book_tz(), 'en' ),
				__( 'Their time', 'ace360' )       => ace360_book_when( $b['start'], $b['tz'], 'en' ) . ' (' . $b['tz'] . ')',
				__( 'How', 'ace360' )              => isset( $v[ $b['via'] ] ) ? $v[ $b['via'] ]['en'] : '',
				__( 'Name', 'ace360' )             => $b['name'],
				__( 'Company', 'ace360' )          => $b['company'],
				__( 'Email', 'ace360' )            => $b['email'],
				__( 'Phone', 'ace360' )            => $b['phone'],
				__( 'Language', 'ace360' )         => 'nl' === $b['lang'] ? 'Nederlands' : 'English',
				__( 'Note', 'ace360' )             => $b['note'],
			);
			echo '<table class="widefat striped"><tbody>';
			foreach ( $rows as $k => $val ) {
				printf( '<tr><th style="width:180px">%s</th><td>%s</td></tr>', esc_html( $k ), nl2br( esc_html( $val ) ) );
			}
			echo '</tbody></table><p class="description">' . esc_html__( 'To cancel a call, move it to the Trash: the time becomes free again on the website. Email the client yourself if you cancel.', 'ace360' ) . '</p>';
		},
		'ace360_call',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes_ace360_call', 'ace360_call_box' );
