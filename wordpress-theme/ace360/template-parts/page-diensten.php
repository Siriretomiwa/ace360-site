<?php
/**
 * Services hub (/diensten/, /en/services/): every service as a card with a screen and an estimate,
 * the industries, the process in one line, and a closing call-to-action.
 *
 * @package ace360
 */

$ace360_l    = $args['l'];
$ace360_lang = ace360_lang();
$ace360_ls   = ace360_landings();
$ace360_svcs = array(
	array( 'website', 'salon', ace360_pair( 'Business websites in WordPress, built to bring in calls and bookings.', 'Zakelijke websites in WordPress, gebouwd om telefoontjes en boekingen op te leveren.' ) ),
	array( 'onepage', 'bike', ace360_pair( 'Everything on one fast page. The affordable way to get online.', 'Alles op één snelle pagina. De betaalbare manier om online te staan.' ) ),
	array( 'webshop', 'checkout', ace360_pair( 'WooCommerce or Shopify, with iDEAL, shipping and VAT set up right.', 'WooCommerce of Shopify, met iDEAL, verzending en btw goed ingesteld.' ) ),
	array( 'boeken', 'practice', ace360_pair( 'Customers book themselves in your real free times, day or night.', 'Klanten boeken zelf in je echte vrije tijden, dag en nacht.' ) ),
	array( 'onderhoud', 'results', ace360_pair( 'Updates, backups, security and small changes, every month.', 'Updates, back-ups, beveiliging en kleine aanpassingen, elke maand.' ) ),
	array( 'seo', 'search', ace360_pair( 'Technical SEO, local SEO and your Google Business Profile.', 'Technische SEO, lokale vindbaarheid en je Google Bedrijfsprofiel.' ) ),
);
$ace360_inds = array(
	array( 'kapper', 'noor-hero' ),
	array( 'restaurant', 'zout-hero' ),
	array( 'praktijk', 'adem-hero' ),
	array( 'vakman', 'spaak-hero' ),
);
?>
<main id="main" class="site-main page-designed svc-page">
	<header class="wrap pd-hero">
		<p class="kicker"><?php ace360_e( $ace360_l['kicker'] ); ?></p>
		<h1><?php echo ace360_hl( $ace360_l['h1'] ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h1>
		<p class="lede"><?php ace360_e( $ace360_l['lede'] ); ?></p>
		<div class="actions">
			<a class="btn btn-orange" href="<?php echo esc_url( ace360_prices_url() ); ?>"><?php ace360_e( ace360_pair( 'See my estimate', 'Bekijk mijn prijsindicatie' ) ); ?> <span aria-hidden="true">→</span></a>
			<a class="btn btn-line" href="<?php echo esc_url( ace360_contact_url( '#book' ) ); ?>"><?php ace360_e( ace360_pair( 'Book a free call', 'Plan een gratis gesprek' ) ); ?></a>
		</div>
	</header>

	<section class="wrap svc-bento" aria-label="<?php echo esc_attr( 'en' === $ace360_lang ? 'Services' : 'Diensten' ); ?>">
		<?php
		foreach ( $ace360_svcs as $ace360_i => $ace360_s ) :
			$ace360_sl = $ace360_ls[ $ace360_s[0] ];
			$ace360_pr = $ace360_sl['price'];
			?>
			<a class="svc-card reveal <?php echo 0 === $ace360_i ? 'is-wide' : ( 5 === $ace360_i ? 'is-wide is-full' : '' ); ?>" href="<?php echo esc_url( ace360_landing_url( $ace360_s[0] ) ); ?>">
				<span class="svc-card-img"><img src="<?php echo esc_url( ace360_shot_url( $ace360_s[1] ) ); ?>" alt="" loading="lazy"></span>
				<span class="svc-card-body">
					<span class="mono svc-card-n"><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?></span>
					<b><?php ace360_e( $ace360_sl['kicker'] ); ?></b>
					<span class="svc-card-text"><?php ace360_e( $ace360_s[2] ); ?></span>
					<span class="svc-card-foot">
						<span class="mono svc-card-price">
							<?php
							if ( ! $ace360_pr || ! empty( $ace360_sl['priceNote'] ) ) {
								echo esc_html( 'en' === $ace360_lang ? 'Price on request' : 'Prijs op aanvraag' );
							} elseif ( ! empty( $ace360_sl['monthly'] ) ) {
								echo esc_html( ace360_money( $ace360_pr[0], $ace360_lang ) . ( 'en' === $ace360_lang ? ' a month' : ' per maand' ) );
							} else {
								echo esc_html( ( 'en' === $ace360_lang ? 'from ' : 'vanaf ' ) . ace360_money( $ace360_pr[0], $ace360_lang ) );
							}
							?>
						</span>
						<span class="svc-card-go" aria-hidden="true">→</span>
					</span>
				</span>
			</a>
		<?php endforeach; ?>
	</section>

	<section class="pd-split wrap">
		<?php echo ace360_clip_html( 'what-we-build', 'en' === $ace360_lang ? 'What gets built, in eleven seconds' : 'Wat er gebouwd wordt, in elf seconden' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
		<div class="pd-split-copy">
			<p class="kicker"><?php ace360_e( ace360_pair( 'One way of working', 'Eén manier van werken' ) ); ?></p>
			<h2><?php echo ace360_hl( ace360_pair( 'Whatever you need, it starts the *same* way', 'Wat je ook nodig hebt, het begint *hetzelfde*' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
			<ol class="mini-steps">
				<?php foreach ( ace360_process() as $ace360_i => $ace360_st ) : ?>
					<li><span class="mono"><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?></span><b><?php ace360_e( $ace360_st[0] ); ?></b><em class="mono"><?php ace360_e( $ace360_st[1] ); ?></em></li>
				<?php endforeach; ?>
			</ol>
			<a class="arrow-link" href="<?php echo esc_url( ace360_landing_url( 'werkwijze' ) ); ?>"><?php ace360_e( ace360_pair( 'How it works, step by step', 'De werkwijze, stap voor stap' ) ); ?> <span aria-hidden="true">→</span></a>
		</div>
	</section>

	<section class="wrap pd-section">
		<div class="sec-head">
			<p class="kicker"><?php ace360_e( ace360_pair( 'For your business', 'Voor jouw branche' ) ); ?></p>
			<h2><?php echo ace360_hl( ace360_pair( 'Built around how *your* customers book and buy', 'Gebouwd rond hoe *jouw* klanten boeken en kopen' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
		</div>
		<div class="ind-grid">
			<?php foreach ( $ace360_inds as $ace360_d ) : ?>
				<a class="ind-card reveal" href="<?php echo esc_url( ace360_landing_url( $ace360_d[0] ) ); ?>">
					<img src="<?php echo esc_url( ace360_asset( 'img/work/' . $ace360_d[1] . '.jpg' ) ); ?>" alt="" loading="lazy">
					<span class="ind-card-label"><b><?php ace360_e( $ace360_ls[ $ace360_d[0] ]['kicker'] ); ?></b><span aria-hidden="true">↗</span></span>
				</a>
			<?php endforeach; ?>
		</div>
	</section>

	<?php get_template_part( 'template-parts/cta-band' ); ?>
</main>
