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
// The 3D showcase takes the featured projects (or the first seven); the grid shows them all.
$ace360_featured = array_values(
	array_filter(
		$ace360_work,
		function ( $w ) {
			return ! empty( $w['featured'] );
		}
	)
);
if ( empty( $ace360_featured ) ) {
	$ace360_featured = $ace360_work;
}
$ace360_featured = array_slice( $ace360_featured, 0, 7 );
$ace360_sectors  = ace360_sectors();
$ace360_steps   = ace360_process();
$ace360_screens = array( 'call', 'quote', 'design', 'build', 'live' );
?>
<canvas id="stage" aria-hidden="true"></canvas>
<main id="main" class="site-main film">

	<!-- 1 · Hero -->
	<section class="ch hero" data-k="hero" data-screen="story">
		<div class="wrap">
			<div class="copy">
				<p class="kicker"><span class="nl-flag" aria-hidden="true"></span><?php ace360_e( $ace360_hero['kicker'] ); ?></p>
				<h1 class="hero-title"><?php echo ace360_hl( $ace360_hero['title'] ); // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helper. ?></h1>
				<p class="lede"><?php ace360_e( $ace360_hero['text'] ); ?></p>
				<div class="actions">
					<a class="btn btn-orange" href="#prijs"><?php ace360_e( $ace360_hero['quote'] ); ?> <span aria-hidden="true">→</span></a>
					<a class="btn btn-line" href="#book"><?php ace360_e( $ace360_hero['call'] ); ?></a>
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

	<!-- 1b · Sound familiar? The laptop shows the site the visitor has now -->
	<section class="ch right pain-ch" id="herkenbaar" data-k="pain" data-screen="old">
		<div class="wrap">
			<div class="copy">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Sound familiar?', 'Herkenbaar?' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'Your website should be *working* for you', 'Je website hoort voor je te *werken*' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<ul class="pains">
					<?php foreach ( ace360_pains() as $ace360_p ) : ?>
						<li><span class="x" aria-hidden="true"></span><?php ace360_e( $ace360_p ); ?></li>
					<?php endforeach; ?>
				</ul>
				<p class="lede"><?php ace360_e( ace360_pair( 'Most of the businesses I work with started here. Keep scrolling.', 'De meeste bedrijven waarmee ik werk begonnen hier. Scroll verder.' ) ); ?></p>
			</div>
		</div>
	</section>

	<!-- 1c · After launch: the new site goes live and the phone starts buzzing -->
	<section class="ch fix-ch" id="resultaat" data-k="fix" data-screen="results">
		<div class="wrap">
			<div class="copy">
				<p class="kicker"><?php ace360_e( ace360_pair( 'After launch', 'Na de lancering' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'Then your phone starts *buzzing*', 'Dan gaat je telefoon *trillen*' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<ol class="outcomes">
					<?php foreach ( ace360_outcomes() as $ace360_i => $ace360_o ) : ?>
						<li><span class="tick" aria-hidden="true"></span><b><?php ace360_e( $ace360_o[0] ); ?></b><span><?php ace360_e( $ace360_o[1] ); ?></span></li>
					<?php endforeach; ?>
				</ol>
				<div class="actions">
					<a class="btn btn-orange" href="#prijs"><?php ace360_e( ace360_pair( 'What would mine cost?', 'Wat kost de mijne?' ) ); ?> <span aria-hidden="true">→</span></a>
				</div>
			</div>
		</div>
	</section>

	<!-- 1d · Try it: pick a business and a mood, the site on the laptop rebuilds itself -->
	<?php $ace360_try = ace360_try(); ?>
	<section class="ch try-ch" id="probeer" data-k="try" data-screen="try">
		<div class="wrap">
			<div class="copy" data-try>
				<p class="kicker"><?php ace360_e( ace360_pair( 'Try it now', 'Probeer het nu' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'Build a homepage in *one* tap', 'Bouw een homepage in *één* tik' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<p class="lede"><?php ace360_e( ace360_pair( 'Pick a business and a mood. Watch the site on the laptop take itself apart and rebuild, then see what a site like that costs.', 'Kies een bedrijf en een sfeer. Zie de site op de laptop uit elkaar vallen en opnieuw opbouwen, en zie wat zo’n site kost.' ) ); ?></p>
				<fieldset class="try-set">
					<legend class="mono"><?php ace360_e( ace360_pair( 'Which business?', 'Welk bedrijf?' ) ); ?></legend>
					<div class="chips">
						<?php foreach ( $ace360_try['sectors'] as $ace360_i => $ace360_t ) : ?>
							<?php $ace360_q = ace360_work_quote( $ace360_t[0] ); ?>
							<label class="chip"><input type="radio" name="try_sector" value="<?php echo esc_attr( $ace360_t[0] ); ?>" data-quote="<?php echo esc_attr( wp_json_encode( $ace360_q ) ); ?>"<?php echo 0 === $ace360_i ? ' checked' : ''; ?>><span><?php ace360_e( $ace360_t[1] ); ?></span></label>
						<?php endforeach; ?>
					</div>
				</fieldset>
				<fieldset class="try-set">
					<legend class="mono"><?php ace360_e( ace360_pair( 'Which mood?', 'Welke sfeer?' ) ); ?></legend>
					<div class="chips">
						<?php foreach ( $ace360_try['moods'] as $ace360_i => $ace360_m ) : ?>
							<label class="chip" title="<?php echo esc_attr( $ace360_m[2]['nl'] ); ?>"><input type="radio" name="try_mood" value="<?php echo esc_attr( $ace360_m[0] ); ?>"<?php echo 1 === $ace360_i ? ' checked' : ''; ?>><span><?php ace360_e( $ace360_m[1] ); ?></span></label>
						<?php endforeach; ?>
					</div>
				</fieldset>
				<div class="try-out" aria-live="polite">
					<p class="try-price"><span class="mono"><?php ace360_e( ace360_pair( 'A site like this', 'Zo’n site' ) ); ?></span> <b data-try-price>—</b></p>
					<p class="try-date mono" data-try-date></p>
				</div>
				<div class="actions">
					<button type="button" class="btn btn-orange" data-try-build><?php ace360_e( ace360_pair( 'Build it again', 'Bouw opnieuw' ) ); ?> <span aria-hidden="true">↻</span></button>
					<a class="btn btn-line" href="#prijs" data-try-use><?php ace360_e( ace360_pair( 'Price mine like this', 'Bereken de mijne zo' ) ); ?></a>
				</div>
			</div>
		</div>
	</section>

	<!-- 2 · Services -->
	<section class="ch right" id="diensten" data-k="services" data-screen="live">
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
	<section class="ch quote-ch" id="prijs" data-k="quote" data-screen="quote">
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
	<section class="ch tall" id="werk" data-k="work" data-items="<?php echo esc_attr( count( $ace360_featured ) ); ?>" style="--items:<?php echo esc_attr( count( $ace360_featured ) ); ?>">
		<div class="sticky">
			<div class="wrap">
				<div class="copy">
					<p class="kicker"><?php ace360_e( ace360_pair( 'Work · selected projects', 'Werk · geselecteerde projecten' ) ); ?> · <span class="mono" data-count>1 / <?php echo esc_html( count( $ace360_featured ) ); ?></span></p>
					<ol class="items">
						<?php foreach ( $ace360_featured as $ace360_i => $ace360_w ) : ?>
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
						<?php foreach ( $ace360_featured as $ace360_i => $ace360_w ) : ?>
							<button type="button" data-go="<?php echo (int) $ace360_i; ?>" aria-label="<?php echo esc_attr( $ace360_w['title'] ); ?>"<?php echo 0 === $ace360_i ? ' class="on"' : ''; ?>></button>
						<?php endforeach; ?>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 11b · All work: every project as a filterable grid -->
	<section class="band all-work" id="projecten" data-k="more" data-screen="live">
		<div class="wrap">
			<div class="sec-head">
				<p class="kicker"><?php ace360_e( ace360_pair( 'All work', 'Al het werk' ) ); ?> · <span class="mono"><?php echo esc_html( count( $ace360_work ) ); ?></span></p>
				<h2><?php echo ace360_hl( ace360_pair( 'Every kind of business, *one* way of working', 'Elk soort bedrijf, *één* manier van werken' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<p class="lede"><?php ace360_e( ace360_pair( 'Stores, charities, salons, restaurants and platforms. Filter by sector and open any project to see it up close.', 'Webshops, goede doelen, salons, restaurants en platforms. Filter op sector en open een project om het van dichtbij te zien.' ) ); ?></p>
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
					<li class="wcard" data-sector="<?php echo esc_attr( isset( $ace360_w['sector'] ) ? $ace360_w['sector'] : '' ); ?>">
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
