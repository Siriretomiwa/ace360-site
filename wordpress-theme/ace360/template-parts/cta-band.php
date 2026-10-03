<?php
/**
 * Closing call-to-action band: one line, two buttons. $args: title (pair, optional), text (pair, optional).
 *
 * @package ace360
 */

$ace360_title = ! empty( $args['title'] ) ? $args['title'] : ace360_pair( 'Ready when you are. The first call is *free*.', 'Klaar als jij het bent. Het eerste gesprek is *gratis*.' );
$ace360_text  = ! empty( $args['text'] ) ? $args['text'] : ace360_pair( 'Twenty minutes, by phone, WhatsApp or video, in English or Dutch. You see an estimate before we even talk.', 'Twintig minuten, via telefoon, WhatsApp of video, in het Nederlands of Engels. Je ziet een prijsindicatie nog voordat we praten.' );
?>
<section class="cta-band" data-k="contact">
	<div class="wrap cta-band-in">
		<svg class="cta-ring" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="5.2 2.34"/><rect x="13.6" y="2.8" width="4.8" height="4.8" rx="1" fill="currentColor"/></svg>
		<div>
			<h2><?php echo ace360_hl( $ace360_title ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
			<p class="lede"><?php ace360_e( $ace360_text ); ?></p>
		</div>
		<div class="actions">
			<a class="btn btn-orange" href="<?php echo esc_url( ace360_contact_url( '#book' ) ); ?>"><?php ace360_e( ace360_pair( 'Book a free call', 'Plan een gratis gesprek' ) ); ?> <span aria-hidden="true">→</span></a>
			<a class="btn btn-line" href="<?php echo esc_url( ace360_prices_url() ); ?>"><?php ace360_e( ace360_pair( 'See my estimate', 'Bekijk mijn prijsindicatie' ) ); ?></a>
		</div>
	</div>
</section>
