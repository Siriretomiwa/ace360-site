<?php
/**
 * Front page.
 *
 * Hero with a 3D stack of live project windows, self-quote estimator, process
 * with a chaptered demo film, recent work in real browser frames, FAQ, contact.
 * All copy is in the HTML in English and Dutch.
 *
 * @package ace360
 */

get_header();

$ace360_hero = ace360_hero();

$ace360_projects = new WP_Query(
	array(
		'post_type'      => 'ace_project',
		'posts_per_page' => 6,
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
			'mockup' => '',
			'image'  => get_the_post_thumbnail_url( get_the_ID(), 'full' ),
			'url'    => get_post_meta( get_the_ID(), 'ace360_project_url', true ),
			'link'   => get_permalink(),
		);
	}
	wp_reset_postdata();
}
if ( empty( $ace360_work ) ) {
	$ace360_work = ace360_work();
}
// The hero stack always shows three windows: real projects first, then the built-in ones.
$ace360_hero_work = array_slice( array_merge( $ace360_work, ace360_work() ), 0, 3 );
?>
<canvas id="bg-stage" aria-hidden="true"></canvas>
<main id="main" class="site-main">

	<!-- Hero -->
	<section class="hero" data-bg="hero">
		<div class="wrap hero-grid">
			<div class="hero-copy">
				<p class="kicker"><span class="nl-flag" aria-hidden="true"></span><?php ace360_e( $ace360_hero['kicker'] ); ?></p>
				<h1 class="hero-title"><?php echo ace360_hl( $ace360_hero['title'] ); // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helper. ?></h1>
				<p class="lede"><?php ace360_e( $ace360_hero['text'] ); ?></p>
				<div class="actions">
					<a class="btn btn-orange" href="#prijs"><?php ace360_e( $ace360_hero['quote'] ); ?> <span aria-hidden="true">→</span></a>
					<a class="btn btn-line" href="<?php echo esc_url( ace360_tel() ); ?>"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1z" fill="currentColor"/></svg><?php ace360_e( $ace360_hero['call'] ); ?></a>
				</div>
				<ul class="checks">
					<?php foreach ( $ace360_hero['bullets'] as $ace360_b ) : ?>
						<li><?php ace360_e( $ace360_b ); ?></li>
					<?php endforeach; ?>
				</ul>
			</div>

			<div class="hero-stage" data-stage aria-hidden="true">
				<div class="stage-inner" data-stage-inner>
					<?php foreach ( $ace360_hero_work as $ace360_i => $ace360_w ) : ?>
						<div class="stage-win w<?php echo (int) $ace360_i; ?>">
							<?php get_template_part( 'template-parts/browser', null, array( 'mockup' => $ace360_w['mockup'], 'image' => isset( $ace360_w['image'] ) ? $ace360_w['image'] : '', 'url' => $ace360_w['url'], 'title' => $ace360_w['title'], 'class' => 'autoscroll' ) ); ?>
						</div>
					<?php endforeach; ?>
					<div class="stage-chip c-price"><span class="mono"><?php ace360_e( ace360_pair( 'Fixed price', 'Vaste prijs' ) ); ?></span><b>€2,240</b></div>
					<div class="stage-chip c-live"><span class="live-dot"></span><?php ace360_e( ace360_pair( 'Live on 28 May', 'Live op 28 mei' ) ); ?></div>
					<div class="stage-chip c-score"><b>98</b><span class="mono">Lighthouse</span></div>
				</div>
			</div>
		</div>
	</section>

	<!-- Recently live strip -->
	<section class="strip" aria-label="<?php esc_attr_e( 'Recently live', 'ace360' ); ?>">
		<div class="wrap strip-inner">
			<p class="mono"><?php ace360_e( ace360_pair( 'Recently live', 'Onlangs live' ) ); ?></p>
			<ul>
				<?php foreach ( $ace360_work as $ace360_w ) : ?>
					<li><a href="#werk"><?php echo esc_html( $ace360_w['title'] ); ?></a></li>
				<?php endforeach; ?>
			</ul>
			<p class="strip-note"><?php ace360_e( ace360_pair( 'Based in the Netherlands · working with clients across Europe and beyond', 'Gevestigd in Nederland · werkt met klanten in heel Europa en daarbuiten' ) ); ?></p>
		</div>
	</section>

	<!-- Services -->
	<section class="section" id="diensten" data-bg="services">
		<div class="wrap">
			<div class="sec-head">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Services', 'Diensten' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'Four things, done *properly*', 'Vier dingen, *goed* gedaan' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<p class="lede"><?php ace360_e( ace360_pair( 'Not a list of thirty services where five of them actually work. This is what I build and maintain.', 'Geen lijst met dertig diensten waarvan er vijf echt werken. Dit is wat ik bouw en onderhoud.' ) ); ?></p>
			</div>
			<ol class="services">
				<?php foreach ( ace360_services() as $ace360_i => $ace360_s ) : ?>
					<li class="card service" data-reveal>
						<div class="service-top">
							<span class="service-icon icon-<?php echo esc_attr( $ace360_s['icon'] ); ?>" aria-hidden="true"></span>
							<span class="mono muted"><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?></span>
						</div>
						<h3><?php ace360_e( $ace360_s['title'] ); ?></h3>
						<p><?php ace360_e( $ace360_s['text'] ); ?></p>
						<div class="service-foot">
							<span class="price mono"><?php ace360_e( $ace360_s['price'] ); ?></span>
							<?php if ( $ace360_s['type'] ) : ?>
								<a class="arrow-link" href="#prijs" data-pick-type="<?php echo esc_attr( $ace360_s['type'] ); ?>"><?php ace360_e( ace360_pair( 'Estimate', 'Bereken' ) ); ?> <span aria-hidden="true">→</span></a>
							<?php else : ?>
								<a class="arrow-link" href="#contact"><?php ace360_e( ace360_pair( 'Ask', 'Vraag aan' ) ); ?> <span aria-hidden="true">→</span></a>
							<?php endif; ?>
						</div>
					</li>
				<?php endforeach; ?>
			</ol>
		</div>
	</section>

	<!-- Self-quote -->
	<section class="section section-grey" id="prijs" data-bg="quote">
		<div class="wrap">
			<div class="sec-head">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Self-quote', 'Zelf berekenen' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'What will *your* website cost?', 'Wat kost *jouw* website?' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<p class="lede"><?php ace360_e( ace360_pair( 'Pick what you need and watch the price change. It’s the same range I would give you on the phone, without the phone call.', 'Kies wat je nodig hebt en zie de prijs meteen veranderen. Dezelfde bandbreedte die ik je aan de telefoon zou geven, zonder te bellen.' ) ); ?></p>
			</div>
			<?php get_template_part( 'template-parts/estimator' ); ?>
		</div>
	</section>

	<!-- Process + demo film -->
	<section class="section" id="werkwijze" data-bg="process">
		<div class="wrap">
			<div class="sec-head">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Process', 'Werkwijze' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'Five steps, and you always know which one you are *on*', 'Vijf stappen, en je weet altijd bij welke je *bent*' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<p class="lede"><?php ace360_e( ace360_pair( 'Most projects run late because nobody agreed what finished means. That is why the schedule is written into the quote. Watch one project go from first call to live site in 30 seconds.', 'De meeste projecten lopen uit omdat niemand heeft afgesproken wat ‘af’ betekent. Daarom staat de planning in de offerte. Bekijk in 30 seconden hoe een project van eerste gesprek naar live site gaat.' ) ); ?></p>
			</div>
			<div class="process">
				<div class="process-film">
					<?php get_template_part( 'template-parts/demo' ); ?>
				</div>
				<ol class="steps">
					<?php foreach ( ace360_process() as $ace360_i => $ace360_p ) : ?>
						<li class="step" data-step="<?php echo (int) $ace360_i; ?>">
							<button type="button" class="step-btn" data-demo-goto="<?php echo (int) $ace360_i; ?>">
								<span class="step-num mono"><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?></span>
								<span class="step-body">
									<span class="step-title"><?php ace360_e( $ace360_p[0] ); ?></span>
									<span class="step-text"><?php ace360_e( $ace360_p[2] ); ?></span>
									<span class="step-when mono"><?php ace360_e( $ace360_p[1] ); ?></span>
								</span>
							</button>
						</li>
					<?php endforeach; ?>
				</ol>
			</div>
		</div>
	</section>

	<!-- Work -->
	<section class="section section-grey" id="werk" data-bg="work">
		<div class="wrap">
			<div class="sec-head">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Work', 'Werk' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'Recently *built*', 'Recent *opgeleverd*' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<p class="lede"><?php ace360_e( ace360_pair( 'A few of the projects that went live lately. Hover a window to scroll through the site.', 'Een paar projecten die onlangs live gingen. Beweeg over een venster om door de site te scrollen.' ) ); ?></p>
			</div>
			<div class="work">
				<?php foreach ( $ace360_work as $ace360_i => $ace360_w ) : ?>
					<article class="work-item<?php echo 1 === $ace360_i % 2 ? ' flip' : ''; ?>" data-reveal>
						<div class="work-shot">
							<?php get_template_part( 'template-parts/browser', null, array( 'mockup' => $ace360_w['mockup'], 'image' => isset( $ace360_w['image'] ) ? $ace360_w['image'] : '', 'url' => $ace360_w['url'], 'title' => $ace360_w['title'], 'class' => 'hoverscroll' ) ); ?>
						</div>
						<div class="work-info">
							<p class="mono muted"><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?> · <?php ace360_e( $ace360_w['type'] ); ?></p>
							<h3>
								<?php if ( ! empty( $ace360_w['link'] ) ) : ?>
									<a href="<?php echo esc_url( $ace360_w['link'] ); ?>"><?php echo esc_html( $ace360_w['title'] ); ?></a>
								<?php else : ?>
									<?php echo esc_html( $ace360_w['title'] ); ?>
								<?php endif; ?>
							</h3>
							<p class="work-text"><?php ace360_e( $ace360_w['text'] ); ?></p>
							<?php if ( ! empty( $ace360_w['built'] ) ) : ?>
								<ul class="work-built">
									<?php foreach ( $ace360_w['built'] as $ace360_b ) : ?>
										<li><?php ace360_e( $ace360_b ); ?></li>
									<?php endforeach; ?>
								</ul>
							<?php endif; ?>
							<?php if ( ! empty( $ace360_w['stack'] ) ) : ?>
								<ul class="tags">
									<?php foreach ( $ace360_w['stack'] as $ace360_s ) : ?>
										<li class="mono"><?php echo esc_html( $ace360_s ); ?></li>
									<?php endforeach; ?>
								</ul>
							<?php endif; ?>
							<?php if ( ! empty( $ace360_w['url'] ) ) : ?>
								<a class="arrow-link" href="<?php echo esc_url( $ace360_w['url'] ); ?>" target="_blank" rel="noopener"><?php ace360_e( ace360_pair( 'Visit the live site', 'Bekijk de live site' ) ); ?> <span aria-hidden="true">↗</span></a>
							<?php endif; ?>
						</div>
					</article>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section class="section" id="vragen" data-bg="faq">
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

	<?php get_template_part( 'template-parts/contact' ); ?>

</main>
<?php
get_footer();
