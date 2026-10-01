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
