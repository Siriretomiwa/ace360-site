<?php
/**
 * Customizer: Appearance → Customize → ace360.
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

	$wp_customize->add_panel(
		'ace360',
		array(
			'title'    => __( 'ace360', 'ace360' ),
			'priority' => 30,
		)
	);

	$sections = array(
		'ace360_hero'    => __( 'Hero', 'ace360' ),
		'ace360_contact' => __( 'Contact & business details', 'ace360' ),
	);
	foreach ( $sections as $id => $title ) {
		$wp_customize->add_section(
			$id,
			array(
				'title' => $title,
				'panel' => 'ace360',
			)
		);
	}

	$fields = array(
		'hero_eyebrow'  => array( 'ace360_hero', __( 'Eyebrow', 'ace360' ), 'text', '' ),
		'hero_title'    => array( 'ace360_hero', __( 'Headline', 'ace360' ), 'textarea', __( 'One row per line. Wrap a word in *asterisks* for the stretching accent.', 'ace360' ) ),
		'hero_text'     => array( 'ace360_hero', __( 'Intro text', 'ace360' ), 'textarea', '' ),
		'cta_label'     => array( 'ace360_hero', __( 'Button label', 'ace360' ), 'text', '' ),
		'contact_title' => array( 'ace360_contact', __( 'Contact headline', 'ace360' ), 'textarea', __( 'One row per line. *Asterisks* mark the accent.', 'ace360' ) ),
		'contact_text'  => array( 'ace360_contact', __( 'Contact text', 'ace360' ), 'textarea', '' ),
		'contact_email' => array( 'ace360_contact', __( 'Email (receives the contact form)', 'ace360' ), 'email', '' ),
		'contact_phone' => array( 'ace360_contact', __( 'Phone', 'ace360' ), 'text', '' ),
		'city'          => array( 'ace360_contact', __( 'City / region', 'ace360' ), 'text', '' ),
		'kvk'           => array( 'ace360_contact', __( 'KvK number', 'ace360' ), 'text', __( 'Shown in the footer. Dutch law requires your KvK number on your website.', 'ace360' ) ),
		'btw'           => array( 'ace360_contact', __( 'BTW-id', 'ace360' ), 'text', '' ),
	);

	foreach ( $fields as $key => $field ) {
		list( $section, $label, $type, $description ) = $field;

		$sanitize = 'sanitize_text_field';
		if ( 'textarea' === $type ) {
			$sanitize = 'sanitize_textarea_field';
		} elseif ( 'email' === $type ) {
			$sanitize = 'sanitize_email';
		}

		$wp_customize->add_setting(
			'ace360_' . $key,
			array(
				'default'           => $defaults[ $key ],
				'sanitize_callback' => $sanitize,
			)
		);
		$wp_customize->add_control(
			'ace360_' . $key,
			array(
				'label'       => $label,
				'description' => $description,
				'section'     => $section,
				'type'        => $type,
			)
		);
	}
}
add_action( 'customize_register', 'ace360_customize_register' );
