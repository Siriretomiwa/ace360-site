<?php
/**
 * Contact (/contact/, /en/contact/): three direct channels, the booking calendar and form,
 * what happens next, and the questions people ask before they book.
 *
 * @package ace360
 */

$ace360_l    = $args['l'];
$ace360_lang = ace360_lang();
$ace360_ch   = array(
	array( 'call', ace360_tel(), ace360_pair( 'Call', 'Bellen' ), ace360_mod( 'phone' ), '' ),
	array( 'wa', ace360_wa(), ace360_pair( 'WhatsApp', 'WhatsApp' ), ace360_pair( 'Send a message, any time', 'Stuur een bericht, wanneer je wilt' ), ' target="_blank" rel="noopener"' ),
	array( 'mail', 'mailto:' . ace360_mod( 'email' ), ace360_pair( 'Email', 'Mailen' ), ace360_mod( 'email' ), '' ),
);
$ace360_next = array(
	ace360_pair( 'You get a confirmation with a calendar invite straight away.', 'Je krijgt meteen een bevestiging met agenda-uitnodiging.' ),
	ace360_pair( 'We talk for twenty minutes about what the site has to bring in.', 'We praten twintig minuten over wat de site moet opleveren.' ),
	ace360_pair( 'Within two days you get the price, a launch date and what is included.', 'Binnen twee dagen krijg je de prijs, een lanceerdatum en wat er is inbegrepen.' ),
);
?>
<main id="main" class="site-main page-designed contact-page">
	<header class="wrap contact-hero">
		<p class="kicker"><?php ace360_e( $ace360_l['kicker'] ); ?></p>
		<h1><?php echo ace360_hl( $ace360_l['h1'] ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h1>
		<p class="lede"><?php ace360_e( $ace360_l['lede'] ); ?></p>
		<div class="channels">
			<?php foreach ( $ace360_ch as $ace360_c ) : ?>
				<a class="channel reveal channel-<?php echo esc_attr( $ace360_c[0] ); ?>" href="<?php echo esc_url( $ace360_c[1] ); ?>"<?php echo $ace360_c[4]; // phpcs:ignore WordPress.Security.EscapeOutput -- static. ?>>
					<span class="channel-ico" aria-hidden="true">
						<?php if ( 'call' === $ace360_c[0] ) : ?><svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>
						<?php elseif ( 'wa' === $ace360_c[0] ) : ?><svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7a11 11 0 0 1-4.3-3.8 4.9 4.9 0 0 1-1-2.6 2.8 2.8 0 0 1 .9-2.1 1 1 0 0 1 .7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6a8 8 0 0 0 1.5 1.8 7.1 7.1 0 0 0 2.1 1.3c.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3a2.3 2.3 0 0 1-.2 1.2z"/></svg>
						<?php else : ?><svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4.6 7H4v.4l8 5.6 8-5.6V7h-.6z"/></svg>
						<?php endif; ?>
					</span>
					<b><?php ace360_e( $ace360_c[2] ); ?></b>
					<span><?php ace360_e( $ace360_c[3] ); ?></span>
				</a>
			<?php endforeach; ?>
		</div>
		<p class="small"><?php ace360_e( ace360_pair( ace360_mod( 'hours_en' ), ace360_mod( 'hours_nl' ) ) ); ?></p>
	</header>

	<?php get_template_part( 'template-parts/contact' ); ?>

	<section class="wrap pd-section next-steps">
		<div class="sec-head">
			<p class="kicker"><?php ace360_e( ace360_pair( 'After you book', 'Na je aanvraag' ) ); ?></p>
			<h2><?php echo ace360_hl( ace360_pair( 'What happens *next*', 'Wat er daarna *gebeurt*' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
		</div>
		<ol class="next-cards">
			<?php foreach ( $ace360_next as $ace360_i => $ace360_n ) : ?>
				<li class="reveal"><span class="mono"><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?></span><p><?php ace360_e( $ace360_n ); ?></p></li>
			<?php endforeach; ?>
		</ol>
	</section>

	<section class="wrap pd-section">
		<div class="faq-grid">
			<div class="sec-head">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Before you book', 'Voordat je boekt' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'Quick *answers*', 'Snelle *antwoorden*' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<a class="arrow-link" href="<?php echo esc_url( ace360_landing_url( 'vragen' ) ); ?>"><?php ace360_e( ace360_pair( 'All questions', 'Alle vragen' ) ); ?> <span aria-hidden="true">→</span></a>
			</div>
			<div class="faq">
				<?php foreach ( array_slice( ace360_faq(), 2, 4 ) as $ace360_i => $ace360_q ) : ?>
					<details<?php echo 0 === $ace360_i ? ' open' : ''; ?>><summary><?php ace360_e( $ace360_q[0] ); ?></summary><p><?php ace360_e( $ace360_q[1] ); ?></p></details>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
</main>
