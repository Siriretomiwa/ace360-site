<?php
/**
 * Front page: "De 360°-offerte".
 *
 * One idea carries the page: the ring in the Ace 360 logo is a price dial. The
 * hero asks three questions and the dial shows a real price and launch date;
 * a receipt follows the visitor down the page and collects what is included.
 * Every project shows what a site like it costs and can be put into the quote,
 * and the process dates move with the dial. Motion only explains something.
 * Copy is in Dutch and English (Dutch first).
 *
 * @package ace360
 */

get_header();

$ace360_projects = new WP_Query(
	array(
		'post_type'      => 'ace_project',
		'posts_per_page' => 40,
		'orderby'        => array(
			'menu_order' => 'ASC',
			'date'       => 'DESC',
		),
		'no_found_rows'  => true,
	)
);
$ace360_work = array();
if ( $ace360_projects->have_posts() ) {
	while ( $ace360_projects->have_posts() ) {
		$ace360_projects->the_post();
		$ace360_work[] = array(
			'title'  => get_the_title(),
			'type'   => get_post_meta( get_the_ID(), 'ace360_project_type', true ),
			'text'   => wp_strip_all_tags( get_the_excerpt() ),
			'built'  => array(),
			'stack'  => array(),
			'mockup' => 'generic',
			'image'  => get_the_post_thumbnail_url( get_the_ID(), 'full' ),
			'sector'   => get_post_meta( get_the_ID(), 'ace360_project_sector', true ),
			'featured' => '1' === get_post_meta( get_the_ID(), 'ace360_project_featured', true ),
			'url'    => get_post_meta( get_the_ID(), 'ace360_project_url', true ),
			'link'   => get_permalink(),
		);
	}
	wp_reset_postdata();
}
if ( empty( $ace360_work ) ) {
	$ace360_work = ace360_work();
}
$ace360_sectors = ace360_sectors();
$ace360_steps   = ace360_process();
?>
<main id="main" class="site-main ring-page">

	<!-- 1 · The 360° quote -->
	<section class="sec hero-dial" id="prijs">
		<div class="wrap">
			<div class="hero-head">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Websites for businesses in the Netherlands and beyond · fixed price', 'Websites voor bedrijven in Nederland en daarbuiten · vaste prijs' ) ); ?></p>
				<h1 class="hero-title"><?php echo ace360_hl( ace360_pair( 'What will your website cost? *Know* in ten seconds.', 'Wat kost jouw website? *Weet het* in tien seconden.' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h1>
				<p class="lede"><?php ace360_e( ace360_pair( 'Three questions, and you see the same price and launch date you would get on the phone. Then we talk, if you want to.', 'Drie vragen, en je ziet dezelfde prijs en lanceerdatum die je aan de telefoon zou krijgen. Daarna praten we, als jij dat wilt.' ) ); ?></p>
			</div>
			<?php get_template_part( 'template-parts/dial' ); ?>
			<ul class="facts" aria-label="<?php esc_attr_e( 'Guarantees', 'ace360' ); ?>">
				<?php foreach ( ace360_guarantees() as $ace360_g ) : ?>
					<li><span class="tick" aria-hidden="true"></span><?php ace360_e( $ace360_g[0] ); ?></li>
				<?php endforeach; ?>
			</ul>
		</div>
	</section>

	<!-- 2 · Services, and what every price already includes -->
	<section class="sec" id="diensten">
		<div class="wrap">
			<div class="sec-head">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Services', 'Diensten' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'Four things, done *properly*', 'Vier dingen, *goed* gedaan' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
			</div>
			<ol class="services">
				<?php foreach ( ace360_services() as $ace360_i => $ace360_s ) : ?>
					<li class="service">
						<span class="service-n mono"><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?></span>
						<h3><?php ace360_e( $ace360_s['title'] ); ?></h3>
						<p class="service-price mono"><?php ace360_e( $ace360_s['price'] ); ?></p>
						<p class="service-text"><?php ace360_e( $ace360_s['text'] ); ?></p>
						<?php if ( $ace360_s['type'] ) : ?>
							<button type="button" class="service-use" data-use-quote="<?php echo esc_attr( wp_json_encode( array( 'type' => $ace360_s['type'] ) ) ); ?>"><?php ace360_e( ace360_pair( 'Price this', 'Bereken dit' ) ); ?> <span aria-hidden="true">↑</span></button>
						<?php else : ?>
							<a class="service-use" href="#contact"><?php ace360_e( ace360_pair( 'Ask me', 'Vraag het me' ) ); ?> <span aria-hidden="true">→</span></a>
						<?php endif; ?>
					</li>
				<?php endforeach; ?>
			</ol>
			<div class="included" id="inbegrepen">
				<div class="included-head">
					<h3><?php ace360_e( ace360_pair( 'Already in every price above', 'Zit al in elke prijs hierboven' ) ); ?></h3>
					<p><?php ace360_e( ace360_pair( 'Watch your receipt: these land on it at €0.', 'Kijk naar je bonnetje: deze komen erop voor € 0.' ) ); ?></p>
				</div>
				<ul class="incl-list">
					<?php foreach ( ace360_included() as $ace360_n ) : ?>
						<li data-incl><span class="incl-tick" aria-hidden="true"></span><span class="incl-text"><?php ace360_e( $ace360_n ); ?></span><span class="mono incl-zero">€ 0</span></li>
					<?php endforeach; ?>
				</ul>
			</div>
		</div>
	</section>

	<!-- 4 · Work: every project with what a site like it costs -->
	<section class="sec all-work" id="werk">
		<div class="wrap">
			<div class="sec-head">
				<p class="kicker"><?php ace360_e( ace360_pair( 'All work', 'Al het werk' ) ); ?> · <span class="mono"><?php echo esc_html( count( $ace360_work ) ); ?></span></p>
				<h2><?php echo ace360_hl( ace360_pair( 'What it cost. How long it *took*.', 'Wat het kost. Hoe lang het *duurt*.' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<p class="lede"><?php ace360_e( ace360_pair( 'Every project shows what a site like it costs and how long it takes, worked out with the same price model as the dial above. Like one? Put it straight into your quote.', 'Bij elk project zie je wat zo’n site kost en hoe lang het duurt, berekend met hetzelfde prijsmodel als de draaiknop hierboven. Zie je iets wat je wilt? Zet het direct in je offerte.' ) ); ?></p>
			</div>
			<?php
			$ace360_counts = array_count_values(
				array_filter(
					array_map(
						function ( $w ) {
							return isset( $w['sector'] ) ? (string) $w['sector'] : '';
						},
						$ace360_work
					)
				)
			);
			?>
			<div class="filters" role="group" aria-label="<?php esc_attr_e( 'Filter projects', 'ace360' ); ?>">
				<button type="button" class="chip is-on" data-filter="all" aria-pressed="true"><span><?php ace360_e( ace360_pair( 'All', 'Alles' ) ); ?></span> <i class="mono"><?php echo esc_html( count( $ace360_work ) ); ?></i></button>
				<?php foreach ( $ace360_sectors as $ace360_key => $ace360_label ) : ?>
					<?php if ( ! empty( $ace360_counts[ $ace360_key ] ) ) : ?>
						<button type="button" class="chip" data-filter="<?php echo esc_attr( $ace360_key ); ?>" aria-pressed="false"><span><?php ace360_e( $ace360_label ); ?></span> <i class="mono"><?php echo esc_html( $ace360_counts[ $ace360_key ] ); ?></i></button>
					<?php endif; ?>
				<?php endforeach; ?>
			</div>
			<ul class="work-grid">
				<?php foreach ( $ace360_work as $ace360_i => $ace360_w ) : ?>
					<?php $ace360_wq = ace360_work_quote( isset( $ace360_w['mockup'] ) ? $ace360_w['mockup'] : '' ); ?>
					<li class="wcard<?php echo $ace360_i >= 6 ? ' is-extra' : ''; ?>" data-sector="<?php echo esc_attr( isset( $ace360_w['sector'] ) ? $ace360_w['sector'] : '' ); ?>">
						<button type="button" class="wcard-open" aria-haspopup="dialog">
							<span class="wcard-thumb">
								<?php if ( ! empty( $ace360_w['image'] ) ) : ?>
									<img src="<?php echo esc_url( $ace360_w['image'] ); ?>" alt="" loading="lazy">
								<?php else : ?>
									<canvas width="768" height="480" data-paint="<?php echo esc_attr( $ace360_w['mockup'] ? $ace360_w['mockup'] : 'generic' ); ?>" data-title="<?php echo esc_attr( $ace360_w['title'] ); ?>" aria-hidden="true"></canvas>
								<?php endif; ?>
							</span>
							<span class="wcard-meta mono"><?php ace360_e( $ace360_w['type'] ); ?><?php if ( ! empty( $ace360_w['concept'] ) ) : ?> <span class="tag-concept"><?php ace360_e( ace360_pair( 'Concept', 'Concept' ) ); ?></span><?php endif; ?></span>
							<span class="wcard-title"><?php echo esc_html( $ace360_w['title'] ); ?> <span class="wcard-arrow" aria-hidden="true">↗</span></span>
						</button>
						<div class="wcard-price">
							<?php if ( $ace360_wq ) : ?>
								<span class="mono"><?php ace360_e( ace360_pair( 'A site like this', 'Zo’n site' ) ); ?></span>
								<b>€ <?php echo esc_html( number_format( $ace360_wq['lo'], 0, ',', '.' ) ); ?> – <?php echo esc_html( number_format( $ace360_wq['hi'], 0, ',', '.' ) ); ?></b>
								<span class="mono"><?php echo esc_html( $ace360_wq['w0'] . '–' . $ace360_wq['w1'] ); ?> <?php ace360_e( ace360_pair( 'weeks', 'weken' ) ); ?></span>
								<button type="button" class="wcard-use" data-use-quote="<?php echo esc_attr( wp_json_encode( array( 'type' => $ace360_wq['type'], 'extras' => $ace360_wq['extras'] ) ) ); ?>"><?php ace360_e( ace360_pair( 'Put in my quote', 'Zet in mijn offerte' ) ); ?> <span aria-hidden="true">↑</span></button>
							<?php else : ?>
								<span class="mono"><?php ace360_e( ace360_pair( 'Custom platform', 'Maatwerkplatform' ) ); ?></span>
								<b><?php ace360_e( ace360_pair( 'Price on request', 'Prijs op aanvraag' ) ); ?></b>
							<?php endif; ?>
						</div>
						<div class="wcard-more" hidden>
							<p class="lede"><?php ace360_e( $ace360_w['text'] ); ?></p>
							<?php if ( ! empty( $ace360_w['built'] ) ) : ?>
								<ul class="work-built">
									<?php foreach ( $ace360_w['built'] as $ace360_b ) : ?>
										<li><?php ace360_e( $ace360_b ); ?></li>
									<?php endforeach; ?>
								</ul>
							<?php endif; ?>
							<?php if ( ! empty( $ace360_w['stack'] ) ) : ?>
								<p class="stack mono"><?php echo esc_html( implode( ' · ', $ace360_w['stack'] ) ); ?></p>
							<?php endif; ?>
							<?php if ( ! empty( $ace360_w['url'] ) ) : ?>
								<a class="arrow-link" href="<?php echo esc_url( $ace360_w['url'] ); ?>" target="_blank" rel="noopener"><?php ace360_e( ace360_pair( 'Visit the live site', 'Bekijk de live site' ) ); ?> <span aria-hidden="true">↗</span></a>
							<?php elseif ( ! empty( $ace360_w['link'] ) ) : ?>
								<a class="arrow-link" href="<?php echo esc_url( $ace360_w['link'] ); ?>"><?php ace360_e( ace360_pair( 'Read the case', 'Lees de case' ) ); ?> <span aria-hidden="true">→</span></a>
							<?php endif; ?>
						</div>
					</li>
				<?php endforeach; ?>
			</ul>
			<p class="more-work"><button type="button" class="btn btn-line" data-more-work><?php ace360_e( ace360_pair( 'Show all ' . count( $ace360_work ) . ' projects', 'Toon alle ' . count( $ace360_work ) . ' projecten' ) ); ?></button></p>
			<p class="all-work-cta"><?php ace360_e( ace360_pair( 'Your business not in the list?', 'Staat jouw soort bedrijf er niet bij?' ) ); ?> <a class="arrow-link" href="#prijs"><?php ace360_e( ace360_pair( 'Price your website', 'Bereken je prijs' ) ); ?> <span aria-hidden="true">→</span></a></p>
		</div>
		<dialog class="work-dialog" aria-labelledby="work-dialog-title">
			<div class="work-dialog-inner">
				<button type="button" class="work-dialog-close" data-close aria-label="<?php esc_attr_e( 'Close', 'ace360' ); ?>">×</button>
				<div class="work-dialog-shot"></div>
				<div class="work-dialog-copy">
					<p class="mono muted" data-d-type></p>
					<h3 id="work-dialog-title" data-d-title></h3>
					<div data-d-more></div>
				</div>
			</div>
		</dialog>
	</section>

	<!-- 5 · Process: the dates move with the dial -->
	<section class="sec" id="werkwijze">
		<div class="wrap">
			<div class="sec-head">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Process', 'Werkwijze' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'Your project, with *dates*', 'Jouw project, met *data*' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<p class="lede"><?php ace360_e( ace360_pair( 'These dates come from your dial. Change the questions at the top and the plan moves with them.', 'Deze data komen uit jouw draaiknop. Verander de vragen bovenaan en de planning schuift mee.' ) ); ?></p>
			</div>
			<ol class="plan" data-plan>
				<?php foreach ( $ace360_steps as $ace360_i => $ace360_p ) : ?>
					<li class="plan-step">
						<span class="plan-date mono" data-plan-date="<?php echo (int) $ace360_i; ?>">—</span>
						<span class="plan-dot" aria-hidden="true"></span>
						<h3><?php ace360_e( $ace360_p[0] ); ?></h3>
						<p><?php ace360_e( $ace360_p[2] ); ?></p>
					</li>
				<?php endforeach; ?>
			</ol>
		</div>
	</section>

	<!-- 6 · Who builds it, and what is guaranteed -->
	<section class="sec" id="garanties">
		<div class="wrap who">
			<div class="who-card">
				<div class="who-ring" aria-hidden="true"><?php echo ace360_wordmark_ring(); // phpcs:ignore WordPress.Security.EscapeOutput ?></div>
				<p class="kicker"><?php ace360_e( ace360_pair( 'Who builds it', 'Wie het bouwt' ) ); ?></p>
				<h2><?php ace360_e( ace360_pair( 'One maker. No account manager.', 'Eén maker. Geen accountmanager.' ) ); ?></h2>
				<p class="lede"><?php ace360_e( ace360_hero()['text'] ); ?></p>
				<dl class="who-facts">
					<div><dt class="mono">KvK</dt><dd><?php echo esc_html( ace360_mod( 'kvk' ) ); ?></dd></div>
					<div><dt class="mono"><?php ace360_e( ace360_pair( 'Reply', 'Antwoord' ) ); ?></dt><dd><?php ace360_e( ace360_pair( 'within 1 working day', 'binnen 1 werkdag' ) ); ?></dd></div>
					<div><dt class="mono"><?php ace360_e( ace360_pair( 'Hours', 'Bereikbaar' ) ); ?></dt><dd><?php ace360_e( ace360_pair( ace360_mod( 'hours_en' ), ace360_mod( 'hours_nl' ) ) ); ?></dd></div>
				</dl>
			</div>
			<ol class="guarantees">
				<?php foreach ( ace360_guarantees() as $ace360_i => $ace360_g ) : ?>
					<li>
						<span class="g-n mono"><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?></span>
						<h3><?php ace360_e( $ace360_g[0] ); ?></h3>
						<p><?php ace360_e( $ace360_g[1] ); ?></p>
					</li>
				<?php endforeach; ?>
			</ol>
		</div>
	</section>

	<!-- 7 · Questions -->
	<section class="sec band" id="vragen">
		<div class="wrap faq-grid">
			<div class="sec-head sticky-head">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Questions', 'Vragen' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'What people ask *first*', 'Wat mensen als *eerste* vragen' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<p class="lede"><?php ace360_e( ace360_pair( 'Something else? Call or send a WhatsApp, you get a straight answer.', 'Iets anders? Bel of stuur een WhatsApp, je krijgt een eerlijk antwoord.' ) ); ?></p>
				<div class="actions">
					<a class="btn btn-line" href="<?php echo esc_url( ace360_wa() ); ?>" target="_blank" rel="noopener">WhatsApp</a>
					<a class="btn btn-line" href="<?php echo esc_url( ace360_tel() ); ?>"><?php echo esc_html( ace360_mod( 'phone' ) ); ?></a>
				</div>
			</div>
			<div class="faq">
				<?php foreach ( ace360_faq() as $ace360_i => $ace360_q ) : ?>
					<details<?php echo 0 === $ace360_i ? ' open' : ''; ?>>
						<summary><?php ace360_e( $ace360_q[0] ); ?></summary>
						<p><?php ace360_e( $ace360_q[1] ); ?></p>
					</details>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<!-- 8 · Contact -->
	<?php get_template_part( 'template-parts/contact' ); ?>

</main>

<aside class="receipt" data-receipt aria-label="<?php esc_attr_e( 'Your quote', 'ace360' ); ?>">
	<button type="button" class="receipt-pill" data-receipt-toggle aria-expanded="false">
		<svg class="receipt-ring" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16" class="rr-track"/><circle cx="20" cy="20" r="16" class="rr-arc" pathLength="360" data-receipt-arc transform="rotate(-90 20 20)"/></svg>
		<span class="receipt-sum"><b data-receipt-price>—</b><span class="mono" data-receipt-date></span></span>
		<span class="receipt-incl mono" data-receipt-incl hidden></span>
	</button>
	<div class="receipt-panel" data-receipt-panel hidden>
		<p class="receipt-title"><?php ace360_e( ace360_pair( 'Your quote', 'Jouw offerte' ) ); ?></p>
		<ul class="receipt-lines" data-receipt-lines></ul>
		<ul class="receipt-lines incl" data-receipt-included></ul>
		<p class="receipt-total"><span><?php ace360_e( ace360_pair( 'Total', 'Totaal' ) ); ?></span><b data-receipt-total>—</b></p>
		<div class="receipt-actions">
			<a class="btn btn-line" href="#prijs"><?php ace360_e( ace360_pair( 'Change', 'Aanpassen' ) ); ?></a>
			<button type="button" class="btn btn-orange" data-receipt-send><?php ace360_e( ace360_pair( 'Lock in', 'Vastleggen' ) ); ?> <span aria-hidden="true">→</span></button>
		</div>
	</div>
</aside>
<?php
get_footer();
