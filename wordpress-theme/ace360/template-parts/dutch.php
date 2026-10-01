<?php
/**
 * Dutch market: a wall of tiles listing what every site ships with.
 *
 * @package ace360
 */

$ace360_tiles = array(
	array( 'pay', __( 'iDEAL, Bancontact, Klarna', 'ace360' ), __( 'Checkout through Mollie, with the payment methods Dutch and Belgian customers expect.', 'ace360' ) ),
	array( 'pin', __( 'Postcode + huisnummer', 'ace360' ), __( 'Address autofill from postcode and house number. Fewer typos, fewer failed deliveries.', 'ace360' ) ),
	array( 'shield', __( 'AVG-proof', 'ace360' ), __( 'Cookie consent that blocks trackers until visitors agree. Fonts and scripts served from your own server.', 'ace360' ) ),
	array( 'access', __( 'European Accessibility Act', 'ace360' ), __( 'Built to WCAG 2.2 AA: keyboard navigation, contrast, screen readers and reduced motion.', 'ace360' ) ),
	array( 'lang', __( 'Nederlands & English', 'ace360' ), __( 'Bilingual content with proper hreflang, so both versions rank in search.', 'ace360' ) ),
	array( 'ship', __( 'PostNL, DHL, Sendcloud', 'ace360' ), __( 'Shipping labels and track-and-trace emails straight from your WooCommerce orders.', 'ace360' ) ),
);
?>
<section class="section dutch" id="nl">
	<div class="wrap">
		<div class="section-head">
			<p class="eyebrow"><?php esc_html_e( 'Built for the Netherlands', 'ace360' ); ?></p>
			<h2 class="display h2" data-reveal-lines><?php echo ace360_headline( __( "Made for how\nthe Dutch *buy.*", 'ace360' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
		</div>
		<ul class="tile-wall">
			<?php foreach ( $ace360_tiles as $ace360_tile ) : ?>
				<li class="tile" data-reveal>
					<span class="tile-corner tl" aria-hidden="true"></span>
					<span class="tile-corner br" aria-hidden="true"></span>
					<?php echo ace360_tile_icon( $ace360_tile[0] ); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
					<h3><?php echo esc_html( $ace360_tile[1] ); ?></h3>
					<p><?php echo esc_html( $ace360_tile[2] ); ?></p>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>
