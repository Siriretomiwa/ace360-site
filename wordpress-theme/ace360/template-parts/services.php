<?php
/**
 * Services: four rows whose titles stretch on hover.
 *
 * @package ace360
 */

$ace360_services = array(
	array(
		'title' => __( 'Brand websites', 'ace360' ),
		'text'  => __( 'Custom WordPress sites designed around your brand, not a template. Your team edits every page in the block editor without calling us.', 'ace360' ),
		'tags'  => array( 'WordPress', 'Design system', 'Copy NL/EN' ),
	),
	array(
		'title' => __( 'Online stores', 'ace360' ),
		'text'  => __( 'WooCommerce shops set up for Dutch buyers: iDEAL, Bancontact and Klarna through Mollie, postcode lookup, PostNL and DHL shipping labels.', 'ace360' ),
		'tags'  => array( 'WooCommerce', 'Mollie', 'Sendcloud' ),
	),
	array(
		'title' => __( '3D & motion', 'ace360' ),
		'text'  => __( 'Scroll-driven stories, product viewers and interactive heroes built with Three.js and GSAP. Used where it explains the product, and tested on mid-range phones.', 'ace360' ),
		'tags'  => array( 'Three.js', 'GSAP', 'WebGL' ),
	),
	array(
		'title' => __( 'Care & growth', 'ace360' ),
		'text'  => __( 'Managed hosting in EU data centres, updates, backups and monthly reports on speed, search rankings and conversions.', 'ace360' ),
		'tags'  => array( 'Hosting', 'SEO', 'Analytics' ),
	),
);
?>
<section class="section services" id="services">
	<div class="wrap">
		<div class="section-head">
			<p class="eyebrow"><?php esc_html_e( 'What we build', 'ace360' ); ?></p>
			<h2 class="display h2" data-reveal-lines><?php echo ace360_headline( __( "Four things,\ndone *properly.*", 'ace360' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
		</div>
		<ul class="service-list">
			<?php foreach ( $ace360_services as $ace360_service ) : ?>
				<li class="service" data-reveal>
					<h3 class="service-title"><?php echo esc_html( $ace360_service['title'] ); ?></h3>
					<div class="service-body">
						<p><?php echo esc_html( $ace360_service['text'] ); ?></p>
						<ul class="tags">
							<?php foreach ( $ace360_service['tags'] as $ace360_tag ) : ?>
								<li><?php echo esc_html( $ace360_tag ); ?></li>
							<?php endforeach; ?>
						</ul>
					</div>
					<span class="service-tile" aria-hidden="true"></span>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>
