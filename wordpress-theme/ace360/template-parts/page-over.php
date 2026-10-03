<?php
/**
 * About (/over-ace-360/, /en/about/): who Ace 360 is, what it stands for, how it works, what it builds with.
 * Only facts the business commits to; no invented numbers or clients.
 *
 * @package ace360
 */

$ace360_l    = $args['l'];
$ace360_lang = ace360_lang();
$ace360_vals = $ace360_l['sections'][0]['list'];
$ace360_facts = array(
	array( '1', ace360_pair( 'person from first call to launch', 'aanspreekpunt van kennismaking tot lancering' ) ),
	array( '2', ace360_pair( 'design feedback rounds included', 'feedbackrondes op het ontwerp inbegrepen' ) ),
	array( '1', ace360_pair( 'working day to answer your message', 'werkdag om je bericht te beantwoorden' ) ),
	array( 'NL·EN', ace360_pair( 'calls, quotes and handover in your language', 'gesprekken, offerte en overdracht in jouw taal' ) ),
);
$ace360_tools = array( 'WordPress', 'WooCommerce', 'Shopify', 'Mollie · iDEAL', 'Google Business Profile', 'Search Console' );
?>
<main id="main" class="site-main page-designed about-page">
	<header class="wrap about-hero">
		<div class="about-hero-copy">
			<p class="kicker"><?php ace360_e( $ace360_l['kicker'] ); ?></p>
			<h1><?php echo ace360_hl( $ace360_l['h1'] ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h1>
			<p class="lede"><?php ace360_e( $ace360_l['lede'] ); ?></p>
			<div class="actions">
				<a class="btn btn-orange" href="<?php echo esc_url( ace360_contact_url( '#book' ) ); ?>"><?php ace360_e( ace360_pair( 'Book a free call', 'Plan een gratis gesprek' ) ); ?> <span aria-hidden="true">→</span></a>
				<a class="btn btn-line" href="<?php echo esc_url( ace360_work_url() ); ?>"><?php ace360_e( ace360_pair( 'See the work', 'Bekijk het werk' ) ); ?></a>
			</div>
		</div>
		<div class="about-collage" aria-hidden="true" data-tilt>
			<img class="c1" src="<?php echo esc_url( ace360_shot_url( 'salon' ) ); ?>" alt="">
			<img class="c2" src="<?php echo esc_url( ace360_shot_url( 'restaurant' ) ); ?>" alt="">
			<img class="c3" src="<?php echo esc_url( ace360_shot_url( 'checkout' ) ); ?>" alt="">
			<span class="about-badge mono"><?php ace360_e( ace360_pair( 'Concept designs', 'Conceptontwerpen' ) ); ?></span>
		</div>
	</header>

	<section class="wrap about-facts" aria-label="<?php echo esc_attr( 'en' === $ace360_lang ? 'In short' : 'In het kort' ); ?>">
		<?php foreach ( $ace360_facts as $ace360_f ) : ?>
			<div class="fact reveal"><b><?php echo esc_html( $ace360_f[0] ); ?></b><span><?php ace360_e( $ace360_f[1] ); ?></span></div>
		<?php endforeach; ?>
	</section>

	<section class="wrap pd-section">
		<div class="sec-head">
			<p class="kicker"><?php ace360_e( $ace360_l['sections'][0]['h'] ); ?></p>
			<h2><?php echo ace360_hl( ace360_pair( 'Five promises, written into every *quote*', 'Vijf beloftes, in elke *offerte*' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
		</div>
		<ol class="value-cards">
			<?php foreach ( $ace360_vals as $ace360_i => $ace360_v ) : ?>
				<li class="reveal"><span class="mono"><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?></span><p><?php ace360_e( $ace360_v ); ?></p></li>
			<?php endforeach; ?>
		</ol>
	</section>

	<section class="pd-split wrap is-flip">
		<?php echo ace360_clip_html( 'five-steps', 'en' === $ace360_lang ? 'From first call to launch' : 'Van kennismaking tot lancering' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
		<div class="pd-split-copy">
			<p class="kicker"><?php ace360_e( $ace360_l['sections'][1]['h'] ); ?></p>
			<h2><?php echo ace360_hl( ace360_pair( 'One person, *start* to finish', 'Eén persoon, van *start* tot finish' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
			<?php foreach ( $ace360_l['sections'][1]['p'] as $ace360_par ) : ?>
				<p><?php ace360_e( $ace360_par ); ?></p>
			<?php endforeach; ?>
			<?php foreach ( $ace360_l['sections'][2]['p'] as $ace360_par ) : ?>
				<p><?php ace360_e( $ace360_par ); ?></p>
			<?php endforeach; ?>
			<a class="arrow-link" href="<?php echo esc_url( ace360_landing_url( 'werkwijze' ) ); ?>"><?php ace360_e( ace360_pair( 'How it works', 'De werkwijze' ) ); ?> <span aria-hidden="true">→</span></a>
		</div>
	</section>

	<section class="wrap pd-section tools-strip">
		<p class="kicker"><?php ace360_e( ace360_pair( 'Built with', 'Gebouwd met' ) ); ?></p>
		<ul class="marquee" aria-label="Tools">
			<?php for ( $ace360_r = 0; $ace360_r < 2; $ace360_r++ ) : ?>
				<?php foreach ( $ace360_tools as $ace360_t ) : ?>
					<li<?php echo $ace360_r ? ' aria-hidden="true"' : ''; ?>><?php echo esc_html( $ace360_t ); ?></li>
				<?php endforeach; ?>
			<?php endfor; ?>
		</ul>
		<p class="small"><?php echo esc_html( 'Ace 360 Services · KvK ' . ace360_mod( 'kvk' ) . ( ace360_mod( 'btw' ) ? ' · BTW ' . ace360_mod( 'btw' ) : '' ) ); ?></p>
	</section>

	<?php get_template_part( 'template-parts/cta-band' ); ?>
</main>
