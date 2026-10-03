<?php
/**
 * Customizer: Appearance → Customize → ace360 business details.
 * Page copy lives in inc/content.php (English and Dutch).
 *
 * @package ace360
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register theme settings.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function ace360_customize_register( $wp_customize ) {
	$defaults = ace360_defaults();

	$wp_customize->add_section(
		'ace360_business',
		array(
			'title'    => __( 'ace360 business details', 'ace360' ),
			'priority' => 30,
		)
	);

	$fields = array(
		'phone'    => array( __( 'Phone (shown and used for “Call now”)', 'ace360' ), 'text', '' ),
		'whatsapp' => array( __( 'WhatsApp number, digits only with country code', 'ace360' ), 'text', __( 'e.g. 31617858490', 'ace360' ) ),
		'email'    => array( __( 'Email (also receives the contact form)', 'ace360' ), 'email', '' ),
		'hours_en' => array( __( 'Opening hours (English)', 'ace360' ), 'text', '' ),
		'hours_nl' => array( __( 'Opening hours (Dutch)', 'ace360' ), 'text', '' ),
		'kvk'      => array( __( 'KvK number', 'ace360' ), 'text', __( 'Shown in the footer. Dutch law requires it on your website.', 'ace360' ) ),
		'btw'      => array( __( 'BTW-id', 'ace360' ), 'text', '' ),
	);

	// Search engines: the address (optional) and profiles go into the structured data, the codes verify the site.
	$wp_customize->add_section(
		'ace360_seo',
		array(
			'title'       => __( 'ace360 search engines (SEO)', 'ace360' ),
			'description' => __( 'Used in the structured data search engines read. Leave the address empty if you work from home and do not want it shown; the country (Netherlands) is always included.', 'ace360' ),
			'priority'    => 32,
		)
	);
	$seo = array(
		'street'    => array( __( 'Street and number (optional)', 'ace360' ), 'text', '' ),
		'postcode'  => array( __( 'Postcode (optional)', 'ace360' ), 'text', '' ),
		'city'      => array( __( 'City', 'ace360' ), 'text', __( 'Helps local searches, e.g. “website laten maken Rotterdam”.', 'ace360' ) ),
		'instagram' => array( __( 'Instagram URL', 'ace360' ), 'url', '' ),
		'youtube'   => array( __( 'YouTube channel URL', 'ace360' ), 'url', '' ),
		'tiktok'    => array( __( 'TikTok URL', 'ace360' ), 'url', '' ),
		'linkedin'  => array( __( 'LinkedIn URL', 'ace360' ), 'url', '' ),
		'facebook'  => array( __( 'Facebook URL', 'ace360' ), 'url', '' ),
		'gsc'       => array( __( 'Google Search Console verification code', 'ace360' ), 'text', __( 'Only the code from content="…" of the HTML-tag method.', 'ace360' ) ),
		'bing'      => array( __( 'Bing Webmaster Tools verification code', 'ace360' ), 'text', __( 'Only the code from content="…" of the meta-tag method.', 'ace360' ) ),
	);
	foreach ( $seo as $key => $field ) {
		list( $label, $type, $description ) = $field;
		$wp_customize->add_setting(
			'ace360_' . $key,
			array(
				'default'           => $defaults[ $key ],
				'sanitize_callback' => 'url' === $type ? 'esc_url_raw' : 'sanitize_text_field',
			)
		);
		$wp_customize->add_control(
			'ace360_' . $key,
			array(
				'label'       => $label,
				'description' => $description,
				'section'     => 'ace360_seo',
				'type'        => $type,
			)
		);
	}

	$wp_customize->add_section(
		'ace360_booking',
		array(
			'title'       => __( 'ace360 call booking', 'ace360' ),
			'description' => __( 'The times visitors can book a free call, in Amsterdam time. Booked calls appear under WP Admin → Calls; trash a call to free its time again.', 'ace360' ),
			'priority'    => 31,
		)
	);
	$booking = array(
		'book_weekday' => array( __( 'Free for calls, Monday to Friday', 'ace360' ), 'text', __( 'Time windows, e.g. 15:30-16:30, 17:30-19:00', 'ace360' ) ),
		'book_saturday' => array( __( 'Free for calls, Saturday', 'ace360' ), 'text', __( 'e.g. 09:00-13:30. Leave empty for no calls on Saturday.', 'ace360' ) ),
		'book_sunday'  => array( __( 'Free for calls, Sunday', 'ace360' ), 'text', __( 'Empty means no calls on Sunday.', 'ace360' ) ),
		'book_length'  => array( __( 'Call length (minutes)', 'ace360' ), 'number', '' ),
		'book_step'    => array( __( 'Start a call every … minutes', 'ace360' ), 'number', __( '30 gives 15:30, 16:00, …', 'ace360' ) ),
		'book_notice'  => array( __( 'Minimum notice (hours)', 'ace360' ), 'number', __( 'Nobody can book a call sooner than this.', 'ace360' ) ),
		'book_days'    => array( __( 'Days ahead that can be booked', 'ace360' ), 'number', '' ),
		'book_off'     => array( __( 'Days off (no calls)', 'ace360' ), 'textarea', __( 'Dates as YYYY-MM-DD, separated by commas or new lines, e.g. 2026-12-25, 2026-12-26', 'ace360' ) ),
	);
	foreach ( $booking as $key => $field ) {
		list( $label, $type, $description ) = $field;
		$wp_customize->add_setting(
			'ace360_' . $key,
			array(
				'default'           => $defaults[ $key ],
				'sanitize_callback' => 'textarea' === $type ? 'sanitize_textarea_field' : 'sanitize_text_field',
			)
		);
		$wp_customize->add_control(
			'ace360_' . $key,
			array(
				'label'       => $label,
				'description' => $description,
				'section'     => 'ace360_booking',
				'type'        => $type,
			)
		);
	}

	foreach ( $fields as $key => $field ) {
		list( $label, $type, $description ) = $field;
		$wp_customize->add_setting(
			'ace360_' . $key,
			array(
				'default'           => $defaults[ $key ],
				'sanitize_callback' => 'email' === $type ? 'sanitize_email' : 'sanitize_text_field',
			)
		);
		$wp_customize->add_control(
			'ace360_' . $key,
			array(
				'label'       => $label,
				'description' => $description,
				'section'     => 'ace360_business',
				'type'        => $type,
			)
		);
	}
}
add_action( 'customize_register', 'ace360_customize_register' );
