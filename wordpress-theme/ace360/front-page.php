<?php
/**
 * Front page: a scroll-driven 3D film.
 *
 * One three.js stage (assets/js/film.js) is fixed behind the page: a laptop and a
 * phone on a white desk, with floating cards of website parts. Every chapter
 * (<section data-k="...">) is a camera keyframe; data-screen says what the laptop
 * shows. Short copy sits on one side of each chapter, the scene on the other.
 * All copy is in the HTML in English and Dutch and reads fine without WebGL.
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
			'mockup' => 'generic',
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
$ace360_steps   = ace360_process();
$ace360_screens = array( 'call', 'quote', 'design', 'build', 'live' );
?>
<canvas id="stage" aria-hidden="true"></canvas>
<main id="main" class="site-main film">

	<!-- 1 · Hero -->
	<section class="ch hero" data-k="hero" data-screen="ace">
		<div class="wrap">
			<div class="copy">
				<p class="kicker"><span class="nl-flag" aria-hidden="true"></span><?php ace360_e( $ace360_hero['kicker'] ); ?></p>
				<h1 class="hero-title"><?php echo ace360_hl( $ace360_hero['title'] ); // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helper. ?></h1>
				<p class="lede"><?php ace360_e( $ace360_hero['text'] ); ?></p>
				<div class="actions">
					<a class="btn btn-orange" href="#prijs"><?php ace360_e( $ace360_hero['quote'] ); ?> <span aria-hidden="true">→</span></a>
					<a class="btn btn-line" href="<?php echo esc_url( ace360_tel() ); ?>"><?php ace360_e( $ace360_hero['call'] ); ?></a>
				</div>
				<ul class="checks">
					<?php foreach ( $ace360_hero['bullets'] as $ace360_b ) : ?>
						<li><?php ace360_e( $ace360_b ); ?></li>
					<?php endforeach; ?>
				</ul>
			</div>
		</div>
		<p class="scroll-cue" aria-hidden="true"><span></span><?php ace360_e( ace360_pair( 'Scroll', 'Scroll' ) ); ?></p>
	</section>

	<!-- 2 · Services -->
	<section class="ch right" id="diensten" data-k="services" data-screen="ace">
		<div class="wrap">
			<div class="copy">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Services', 'Diensten' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'Four things, done *properly*', 'Vier dingen, *goed* gedaan' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<p class="lede"><?php ace360_e( ace360_pair( 'Not a list of thirty services where five of them actually work. This is what I build and maintain.', 'Geen lijst met dertig diensten waarvan er vijf echt werken. Dit is wat ik bouw en onderhoud.' ) ); ?></p>
				<ol class="svc">
					<?php foreach ( ace360_services() as $ace360_i => $ace360_s ) : ?>
						<li>
							<a href="<?php echo esc_url( $ace360_s['type'] ? '#prijs' : '#contact' ); ?>"<?php echo $ace360_s['type'] ? ' data-pick-type="' . esc_attr( $ace360_s['type'] ) . '"' : ''; ?>>
								<span class="svc-top"><b><?php ace360_e( $ace360_s['title'] ); ?></b><span class="price mono"><?php ace360_e( $ace360_s['price'] ); ?></span></span>
								<span class="svc-text"><?php ace360_e( $ace360_s['text'] ); ?></span>
							</a>
						</li>
					<?php endforeach; ?>
				</ol>
			</div>
		</div>
	</section>

	<!-- 3 · Self-quote -->
	<section class="ch quote-ch" id="prijs" data-k="quote" data-screen="ace">
		<div class="wrap">
			<div class="copy copy-quote">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Self-quote', 'Zelf berekenen' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'What will *your* website cost?', 'Wat kost *jouw* website?' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<p class="lede"><?php ace360_e( ace360_pair( 'Pick what you need and watch the quote on the desk change. The same range I would give you on the phone.', 'Kies wat je nodig hebt en zie de offerte op het bureau meteen veranderen. Dezelfde bandbreedte die ik je aan de telefoon zou geven.' ) ); ?></p>
				<?php get_template_part( 'template-parts/estimator' ); ?>
			</div>
		</div>
	</section>

	<!-- 4 · Process intro -->
	<section class="ch right" id="werkwijze" data-k="process" data-screen="blank">
		<div class="wrap">
			<div class="copy">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Process', 'Werkwijze' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'Five steps, and you always know which one you are *on*', 'Vijf stappen, en je weet altijd bij welke je *bent*' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<p class="lede"><?php ace360_e( ace360_pair( 'Most projects run late because nobody agreed what finished means. That is why the schedule is written into the quote. Keep scrolling and watch one site get built.', 'De meeste projecten lopen uit omdat niemand heeft afgesproken wat ‘af’ betekent. Daarom staat de planning in de offerte. Scroll verder en zie hoe één site gebouwd wordt.' ) ); ?></p>
				<ol class="step-index">
					<?php foreach ( $ace360_steps as $ace360_i => $ace360_p ) : ?>
						<li><span class="mono"><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?></span><?php ace360_e( $ace360_p[0] ); ?><span class="mono muted"><?php ace360_e( $ace360_p[1] ); ?></span></li>
					<?php endforeach; ?>
				</ol>
			</div>
		</div>
	</section>

	<!-- 5–9 · One chapter per step -->
	<?php foreach ( $ace360_steps as $ace360_i => $ace360_p ) : ?>
		<section class="ch step<?php echo 1 === $ace360_i % 2 ? ' right' : ''; ?>" data-k="<?php echo esc_attr( 's' . ( $ace360_i + 1 ) ); ?>" data-screen="<?php echo esc_attr( $ace360_screens[ $ace360_i ] ); ?>">
			<div class="wrap">
				<div class="copy">
					<p class="kicker"><span class="mono"><b><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?></b> / 05</span> · <?php ace360_e( $ace360_p[1] ); ?></p>
					<h2 class="step-word"><?php ace360_e( $ace360_p[0] ); ?></h2>
					<p class="lede"><?php ace360_e( $ace360_p[2] ); ?></p>
					<div class="progress" aria-hidden="true"><i style="--p:<?php echo esc_attr( ( $ace360_i + 1 ) / 5 ); ?>"></i></div>
				</div>
			</div>
		</section>
	<?php endforeach; ?>

	<!-- 10 · Demo film -->
	<section class="ch demo-ch" id="demo" data-k="demo" data-screen="live">
		<div class="wrap">
			<div class="copy copy-demo">
				<p class="kicker"><?php ace360_e( ace360_pair( 'The 30-second version', 'De versie van 30 seconden' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'From first call to *live*, start to finish', 'Van eerste gesprek tot *live*, van begin tot eind' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<?php get_template_part( 'template-parts/demo' ); ?>
			</div>
		</div>
	</section>

	<!-- 11 · Work: the laptop shows each project in turn -->
	<section class="ch tall" id="werk" data-k="work" data-items="<?php echo esc_attr( count( $ace360_work ) ); ?>" style="--items:<?php echo esc_attr( count( $ace360_work ) ); ?>">
		<div class="sticky">
			<div class="wrap">
				<div class="copy">
					<p class="kicker"><?php ace360_e( ace360_pair( 'Work · selected projects', 'Werk · geselecteerde projecten' ) ); ?> · <span class="mono" data-count>1 / <?php echo esc_html( count( $ace360_work ) ); ?></span></p>
					<ol class="items">
						<?php foreach ( $ace360_work as $ace360_i => $ace360_w ) : ?>
							<li class="item<?php echo 0 === $ace360_i ? ' is-on' : ''; ?>" data-screen="<?php echo esc_attr( 'work-' . ( $ace360_w['mockup'] ? $ace360_w['mockup'] : 'generic' ) ); ?>" data-title="<?php echo esc_attr( $ace360_w['title'] ); ?>"<?php echo ! empty( $ace360_w['image'] ) ? ' data-image="' . esc_url( $ace360_w['image'] ) . '"' : ''; ?>>
								<p class="mono muted"><?php ace360_e( $ace360_w['type'] ); ?><?php if ( ! empty( $ace360_w['concept'] ) ) : ?> <span class="tag-concept"><?php ace360_e( ace360_pair( 'Concept', 'Concept' ) ); ?></span><?php endif; ?></p>
								<h2>
									<?php if ( ! empty( $ace360_w['link'] ) ) : ?>
										<a href="<?php echo esc_url( $ace360_w['link'] ); ?>"><?php echo esc_html( $ace360_w['title'] ); ?></a>
									<?php else : ?>
										<?php echo esc_html( $ace360_w['title'] ); ?>
									<?php endif; ?>
								</h2>
								<p class="lede"><?php ace360_e( $ace360_w['text'] ); ?></p>
								<?php if ( ! empty( $ace360_w['built'] ) ) : ?>
									<ul class="work-built">
										<?php foreach ( $ace360_w['built'] as $ace360_b ) : ?>
											<li><?php ace360_e( $ace360_b ); ?></li>
										<?php endforeach; ?>
									</ul>
								<?php endif; ?>
								<?php if ( ! empty( $ace360_w['url'] ) ) : ?>
									<a class="arrow-link" href="<?php echo esc_url( $ace360_w['url'] ); ?>" target="_blank" rel="noopener"><?php ace360_e( ace360_pair( 'Visit the live site', 'Bekijk de live site' ) ); ?> <span aria-hidden="true">↗</span></a>
								<?php endif; ?>
							</li>
						<?php endforeach; ?>
					</ol>
					<div class="dots" role="group" aria-label="<?php esc_attr_e( 'Projects', 'ace360' ); ?>">
						<?php foreach ( $ace360_work as $ace360_i => $ace360_w ) : ?>
							<button type="button" data-go="<?php echo (int) $ace360_i; ?>" aria-label="<?php echo esc_attr( $ace360_w['title'] ); ?>"<?php echo 0 === $ace360_i ? ' class="on"' : ''; ?>></button>
						<?php endforeach; ?>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 12 · Questions -->
	<section class="band" id="vragen" data-k="faq" data-screen="live">
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

	<!-- 13 · Contact -->
	<?php get_template_part( 'template-parts/contact' ); ?>

</main>
<?php
get_footer();
