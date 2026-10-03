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

$ace360_work = ace360_get_work();
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
					<a class="btn btn-orange" href="<?php echo esc_url( ace360_prices_url() ); ?>"><?php ace360_e( $ace360_hero['quote'] ); ?> <span aria-hidden="true">→</span></a>
					<a class="btn btn-line" href="<?php echo esc_url( ace360_contact_url( '#book' ) ); ?>"><?php ace360_e( $ace360_hero['call'] ); ?></a>
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
					<a class="btn btn-orange" href="<?php echo esc_url( ace360_prices_url() ); ?>"><?php ace360_e( ace360_pair( 'What could mine cost?', 'Wat kan de mijne kosten?' ) ); ?> <span aria-hidden="true">→</span></a>
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
				<p class="lede"><?php ace360_e( ace360_pair( 'Pick a business and a mood. Watch the site on the laptop take itself apart and rebuild, then see an estimate of what a site like that could cost.', 'Kies een bedrijf en een sfeer. Zie de site op de laptop uit elkaar vallen en opnieuw opbouwen, en zie wat zo’n site ongeveer kost.' ) ); ?></p>
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
					<p class="try-price"><span class="mono"><?php ace360_e( ace360_pair( 'Estimate for a site like this', 'Indicatie voor zo’n site' ) ); ?></span> <b data-try-price>—</b></p>
					<p class="try-date mono" data-try-date></p>
				</div>
				<div class="actions">
					<button type="button" class="btn btn-orange" data-try-build><?php ace360_e( ace360_pair( 'Build it again', 'Bouw opnieuw' ) ); ?> <span aria-hidden="true">↻</span></button>
					<a class="btn btn-line" href="<?php echo esc_url( ace360_prices_url() ); ?>" data-try-use><?php ace360_e( ace360_pair( 'Estimate mine like this', 'Bereken de mijne zo' ) ); ?></a>
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
							<a href="<?php echo esc_url( ace360_service_url( $ace360_s ) ); ?>">
								<span class="svc-top"><b><?php ace360_e( $ace360_s['title'] ); ?></b><span class="price mono"><?php ace360_e( $ace360_s['price'] ); ?></span></span>
								<span class="svc-text"><?php ace360_e( $ace360_s['text'] ); ?></span>
							</a>
						</li>
					<?php endforeach; ?>
				</ol>
				<a class="arrow-link" href="<?php echo esc_url( ace360_landing_url( 'diensten' ) ); ?>"><?php ace360_e( ace360_pair( 'All services', 'Alle diensten' ) ); ?> <span aria-hidden="true">→</span></a>
			</div>
		</div>
	</section>

	<!-- 4 · Process intro -->
	<section class="ch right" id="werkwijze" data-k="process" data-screen="blank">
		<div class="wrap">
			<div class="copy">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Process', 'Werkwijze' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'Five steps, and you always know which one you are *on*', 'Vijf stappen, en je weet altijd bij welke je *bent*' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<p class="lede"><?php ace360_e( ace360_pair( 'Most projects run late because nobody agreed what finished means. That is why the schedule is written into the quote. Five steps, every one ending with something you can see.', 'De meeste projecten lopen uit omdat niemand heeft afgesproken wat ‘af’ betekent. Daarom staat de planning in de offerte. Vijf stappen, en elke stap eindigt met iets wat je kunt zien.' ) ); ?></p>
				<ol class="step-index">
					<?php foreach ( $ace360_steps as $ace360_i => $ace360_p ) : ?>
						<li><span class="mono"><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?></span><?php ace360_e( $ace360_p[0] ); ?><span class="mono muted"><?php ace360_e( $ace360_p[1] ); ?></span></li>
					<?php endforeach; ?>
				</ol>
				<a class="btn btn-line" href="<?php echo esc_url( ace360_landing_url( 'werkwijze' ) ); ?>"><?php ace360_e( ace360_pair( 'See every step', 'Bekijk elke stap' ) ); ?> <span aria-hidden="true">→</span></a>
			</div>
		</div>
	</section>

	<!-- 10 · Demo film -->
	<section class="ch demo-ch" id="demo" data-k="demo" data-screen="live">
		<div class="wrap">
			<div class="copy copy-demo">
				<p class="kicker"><?php ace360_e( ace360_pair( 'The whole journey in under a minute', 'De hele route in minder dan een minuut' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'From finding us to *live*, and after', 'Van ons vinden tot *live*, en daarna' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
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

	<!-- 11b · All work: a swipeable highlight of the projects; /work/ shows them all -->
	<?php
	$ace360_hi     = ace360_work_highlights( $ace360_work, 8 );
	$ace360_counts = ace360_work_counts( $ace360_work );
	$ace360_wurl   = ace360_work_url();
	?>
	<section class="band all-work" id="projecten" data-k="more" data-screen="live">
		<div class="wrap work-head">
			<div class="sec-head">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Selected work', 'Uitgelicht werk' ) ); ?> · <span class="mono"><?php echo esc_html( count( $ace360_hi ) . ' / ' . count( $ace360_work ) ); ?></span></p>
				<h2><?php echo ace360_hl( ace360_pair( 'Every kind of business, *one* way of working', 'Elk soort bedrijf, *één* manier van werken' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<p class="lede"><?php ace360_e( ace360_pair( 'Stores, charities, salons, restaurants and platforms. Swipe through a few highlights, open any project to see it up close, or see all the work on one page.', 'Webshops, goede doelen, salons, restaurants en platforms. Swipe door een paar hoogtepunten, open een project om het van dichtbij te zien, of bekijk al het werk op één pagina.' ) ); ?></p>
			</div>
			<div class="slider-nav">
				<button type="button" class="slider-btn" data-slide="-1" aria-label="<?php echo esc_attr( 'Previous' ); ?>"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
				<button type="button" class="slider-btn" data-slide="1" aria-label="<?php echo esc_attr( 'Next' ); ?>"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
			</div>
		</div>
		<div class="work-slider" data-slider>
			<ul class="work-track work-grid" data-track aria-label="<?php echo esc_attr( 'Projects' ); ?>">
				<?php
				foreach ( $ace360_hi as $ace360_w ) {
					get_template_part( 'template-parts/work-card', null, array( 'w' => $ace360_w, 'class' => 'slide' ) );
				}
				?>
				<li class="slide slide-more">
					<div class="slide-more-in">
						<span class="mono"><?php ace360_e( ace360_pair( 'All work', 'Al het werk' ) ); ?></span>
						<a class="slide-more-link" href="<?php echo esc_url( $ace360_wurl ); ?>"><?php ace360_e( ace360_pair( 'See all ' . count( $ace360_work ) . ' projects', 'Bekijk alle ' . count( $ace360_work ) . ' projecten' ) ); ?> <span aria-hidden="true">→</span></a>
						<span class="slide-more-sectors">
							<?php foreach ( $ace360_sectors as $ace360_key => $ace360_label ) : ?>
								<?php if ( ! empty( $ace360_counts[ $ace360_key ] ) ) : ?>
									<a href="<?php echo esc_url( $ace360_wurl . ( false === strpos( $ace360_wurl, '?' ) ? '?' : '&' ) . 'sector=' . rawurlencode( $ace360_key ) ); ?>"><?php ace360_e( $ace360_label ); ?> <i><?php echo esc_html( $ace360_counts[ $ace360_key ] ); ?></i></a>
								<?php endif; ?>
							<?php endforeach; ?>
						</span>
					</div>
				</li>
			</ul>
			<div class="wrap slider-foot">
				<div class="slider-bar" aria-hidden="true"><i data-slider-bar></i></div>
				<a class="btn btn-line" href="<?php echo esc_url( $ace360_wurl ); ?>"><?php ace360_e( ace360_pair( 'See all work', 'Bekijk al het werk' ) ); ?> <span class="mono">· <?php echo esc_html( count( $ace360_work ) ); ?></span> <span aria-hidden="true">→</span></a>
			</div>
		</div>
		<div class="wrap">
			<p class="all-work-cta"><?php ace360_e( ace360_pair( 'Your business not in the list?', 'Staat jouw soort bedrijf er niet bij?' ) ); ?> <a class="arrow-link" href="<?php echo esc_url( ace360_prices_url() ); ?>"><?php ace360_e( ace360_pair( 'Estimate your website', 'Bekijk je prijsindicatie' ) ); ?> <span aria-hidden="true">→</span></a></p>
		</div>
		<?php get_template_part( 'template-parts/work-dialog' ); ?>
	</section>

	<!-- 12 · From the blog (the camera rises over the desk) -->
	<?php get_template_part( 'template-parts/blog-teaser' ); ?>

	<!-- 13 · Closing call-to-action; booking, the form and the questions have their own pages -->
	<?php get_template_part( 'template-parts/cta-band' ); ?>

</main>
<?php
get_footer();
