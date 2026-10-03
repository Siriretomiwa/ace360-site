<?php
/**
 * Landing page for one search topic (inc/landings.php): hero, the topic in plain sections,
 * the estimator preset for this service, FAQ, related pages and the booking/contact section.
 *
 * @package ace360
 */

get_header();

$ace360_key  = ace360_current_landing();
$ace360_l    = ace360_landings()[ $ace360_key ];
$ace360_lang = ace360_lang();
$ace360_show = ace360_landing_blocks( $ace360_key );
$ace360_faq  = in_array( 'allfaq', $ace360_show, true ) ? ace360_all_faq() : ( in_array( 'faq', $ace360_show, true ) ? $ace360_l['faq'] : array() );
?>
<main id="main" class="site-main landing">
	<header class="wrap landing-hero">
		<nav class="crumbs mono" aria-label="<?php echo esc_attr( 'en' === $ace360_lang ? 'Breadcrumb' : 'Kruimelpad' ); ?>">
			<a href="<?php echo esc_url( ace360_url( '/' ) ); ?>">Ace 360</a> <span aria-hidden="true">/</span> <span><?php ace360_e( $ace360_l['kicker'] ); ?></span>
		</nav>
		<p class="kicker"><?php ace360_e( $ace360_l['kicker'] ); ?></p>
		<h1><?php echo ace360_hl( $ace360_l['h1'] ); // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helper. ?></h1>
		<p class="lede"><?php ace360_e( $ace360_l['lede'] ); ?></p>
		<?php if ( ! empty( $ace360_l['price'] ) && empty( $ace360_l['priceNote'] ) ) : ?>
			<p class="landing-price mono">
				<?php
				$ace360_from = ace360_money( $ace360_l['price'][0], $ace360_lang );
				if ( ! empty( $ace360_l['monthly'] ) ) {
					echo esc_html( ( 'en' === $ace360_lang ? 'Estimate ' : 'Indicatie ' ) . $ace360_from . ( 'en' === $ace360_lang ? ' a month' : ' per maand' ) );
				} else {
					echo esc_html( ( 'en' === $ace360_lang ? 'Estimate ' : 'Indicatie ' ) . $ace360_from . ' – ' . ace360_money( $ace360_l['price'][1], $ace360_lang ) . ( 'en' === $ace360_lang ? ' excl. VAT' : ' excl. btw' ) );
				}
				?>
			</p>
		<?php endif; ?>
		<div class="actions">
			<?php if ( in_array( 'estimator', $ace360_show, true ) ) : ?>
				<a class="btn btn-orange" href="#prijs"><?php ace360_e( ace360_pair( 'See my estimate', 'Bekijk mijn prijsindicatie' ) ); ?> <span aria-hidden="true">→</span></a>
				<a class="btn btn-line" href="#book"><?php ace360_e( ace360_pair( 'Book a free call', 'Plan een gratis gesprek' ) ); ?></a>
			<?php else : ?>
				<a class="btn btn-orange" href="#book"><?php ace360_e( ace360_pair( 'Book a free call', 'Plan een gratis gesprek' ) ); ?> <span aria-hidden="true">→</span></a>
				<a class="btn btn-line" href="<?php echo esc_url( ace360_landing_url( 'kosten' ) ); ?>"><?php ace360_e( ace360_pair( 'See prices', 'Bekijk de prijzen' ) ); ?></a>
			<?php endif; ?>
		</div>
		<ul class="checks">
			<?php foreach ( ace360_hero()['bullets'] as $ace360_b ) : ?>
				<li><?php ace360_e( $ace360_b ); ?></li>
			<?php endforeach; ?>
		</ul>
	</header>

	<?php if ( in_array( 'process', $ace360_show, true ) ) : ?>
		<section class="wrap landing-process" aria-label="<?php echo esc_attr( 'en' === $ace360_lang ? 'The five steps' : 'De vijf stappen' ); ?>">
			<ol class="process-list">
				<?php foreach ( ace360_process() as $ace360_i => $ace360_st ) : ?>
					<li>
						<span class="mono process-n"><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?></span>
						<div>
							<h2><?php ace360_e( $ace360_st[0] ); ?> <span class="mono muted"><?php ace360_e( $ace360_st[1] ); ?></span></h2>
							<p><?php ace360_e( $ace360_st[2] ); ?></p>
						</div>
					</li>
				<?php endforeach; ?>
			</ol>
		</section>
	<?php endif; ?>

	<?php if ( $ace360_l['sections'] ) : ?>
	<div class="wrap landing-body">
		<?php foreach ( $ace360_l['sections'] as $ace360_s ) : ?>
			<section class="landing-sec">
				<h2><?php ace360_e( $ace360_s['h'] ); ?></h2>
				<?php if ( ! empty( $ace360_s['table'] ) ) : ?>
					<table class="landing-table">
						<thead><tr><th><?php ace360_e( ace360_pair( 'What', 'Wat' ) ); ?></th><th><?php ace360_e( ace360_pair( 'Estimate (excl. VAT)', 'Indicatie (excl. btw)' ) ); ?></th><th><?php ace360_e( ace360_pair( 'Time', 'Doorlooptijd' ) ); ?></th></tr></thead>
						<tbody>
							<?php foreach ( $ace360_s['table'] as $ace360_r ) : ?>
								<tr><td><?php ace360_e( $ace360_r[0] ); ?></td><td class="mono"><?php ace360_e( $ace360_r[1] ); ?></td><td><?php ace360_e( $ace360_r[2] ); ?></td></tr>
							<?php endforeach; ?>
						</tbody>
					</table>
				<?php endif; ?>
				<?php if ( ! empty( $ace360_s['list'] ) ) : ?>
					<ul class="checks landing-checks">
						<?php foreach ( $ace360_s['list'] as $ace360_i ) : ?>
							<li><?php ace360_e( $ace360_i ); ?></li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>
				<?php foreach ( ( isset( $ace360_s['p'] ) ? $ace360_s['p'] : array() ) as $ace360_par ) : ?>
					<p><?php ace360_e( $ace360_par ); ?></p>
				<?php endforeach; ?>
			</section>
		<?php endforeach; ?>
	</div>
	<?php endif; ?>

	<?php if ( in_array( 'estimator', $ace360_show, true ) ) : ?>
	<section class="band landing-quote" id="prijs">
		<div class="wrap">
			<div class="sec-head">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Estimate', 'Prijsindicatie' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'What could *yours* cost?', 'Wat kost *de jouwe*?' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<p class="lede"><?php ace360_e( ace360_pair( 'Pick what you need and see a realistic range straight away. The final price follows after a short call, in writing.', 'Kies wat je nodig hebt en zie meteen een realistische bandbreedte. De definitieve prijs volgt na een kort gesprek, op papier.' ) ); ?></p>
			</div>
			<?php get_template_part( 'template-parts/estimator', null, array( 'type' => $ace360_l['est'], 'extras' => ace360_landing_extras( $ace360_key ) ) ); ?>
		</div>
	</section>
	<?php endif; ?>

	<section class="wrap landing-faq">
		<?php if ( $ace360_faq ) : ?>
		<div class="faq-grid">
			<div class="sec-head">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Questions', 'Vragen' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'What people *ask*', 'Wat mensen *vragen*' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
			</div>
			<div class="faq">
				<?php foreach ( $ace360_faq as $ace360_i => $ace360_q ) : ?>
					<details<?php echo 0 === $ace360_i ? ' open' : ''; ?>>
						<summary><?php ace360_e( $ace360_q[0] ); ?></summary>
						<p><?php ace360_e( $ace360_q[1] ); ?></p>
					</details>
				<?php endforeach; ?>
			</div>
		</div>
		<?php endif; ?>
		<nav class="landing-related" aria-label="<?php echo esc_attr( 'en' === $ace360_lang ? 'Related' : 'Gerelateerd' ); ?>">
			<p class="mono"><?php ace360_e( ace360_pair( 'Also useful', 'Ook handig' ) ); ?></p>
			<ul>
				<?php foreach ( $ace360_l['related'] as $ace360_rk ) : ?>
					<li><a class="arrow-link" href="<?php echo esc_url( ace360_landing_url( $ace360_rk ) ); ?>"><?php echo esc_html( wp_strip_all_tags( str_replace( '*', '', ace360_landings()[ $ace360_rk ]['h1'][ $ace360_lang ] ) ) ); ?> <span aria-hidden="true">→</span></a></li>
				<?php endforeach; ?>
				<li><a class="arrow-link" href="<?php echo esc_url( ace360_work_url() ); ?>"><?php ace360_e( ace360_pair( 'See the work', 'Bekijk het werk' ) ); ?> <span aria-hidden="true">→</span></a></li>
			</ul>
		</nav>
	</section>

	<?php if ( in_array( 'contact', $ace360_show, true ) ) : ?>
		<?php get_template_part( 'template-parts/contact' ); ?>
	<?php endif; ?>
</main>
<?php
get_footer();
