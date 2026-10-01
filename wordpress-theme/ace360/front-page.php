<?php
/**
 * Front page. A fixed three.js stage (a white architectural model of a Dutch
 * canal-house street) sits behind the chapters; each chapter's data-k is a
 * camera keyframe, and the centre house is built along with the process steps.
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
			'title' => get_the_title(),
			'type'  => get_post_meta( get_the_ID(), 'ace360_project_type', true ),
			'text'  => wp_strip_all_tags( get_the_excerpt() ),
			'url'   => get_permalink(),
			'image' => get_the_post_thumbnail_url( get_the_ID(), 'large' ),
		);
	}
	wp_reset_postdata();
}
if ( empty( $ace360_work ) ) {
	$ace360_work = ace360_work();
}
$ace360_est = ace360_estimator();
$ace360_est_js = array(
	'types'  => array_map(
		function ( $t ) {
			return array( 'id' => $t['id'], 'min' => $t['min'], 'max' => $t['max'], 'weeks' => $t['weeks'], 'en' => $t['label']['en'], 'nl' => $t['label']['nl'] );
		},
		$ace360_est['types']
	),
	'extras' => array_map(
		function ( $t ) {
			return array( 'id' => $t['id'], 'min' => $t['min'], 'max' => $t['max'], 'weeks' => $t['weeks'], 'en' => $t['label']['en'], 'nl' => $t['label']['nl'] );
		},
		$ace360_est['extras']
	),
	'care'   => $ace360_est['care'],
);
?>
<div class="bg" aria-hidden="true"></div>
<canvas id="stage" aria-hidden="true"></canvas>

<main id="main" class="film">

	<section class="ch hero" data-k="hero">
		<div class="wrap">
			<div class="copy">
				<p class="kicker"><?php ace360_e( $ace360_hero['kicker'] ); ?></p>
				<h1 class="hero-title"><?php ace360_e( $ace360_hero['title'] ); ?></h1>
				<p class="body"><?php ace360_e( $ace360_hero['text'] ); ?></p>
				<div class="actions">
					<a class="btn" href="<?php echo esc_url( ace360_tel() ); ?>"><?php ace360_e( $ace360_hero['call'] ); ?> <span aria-hidden="true">→</span></a>
					<a class="btn btn-ghost" href="#werkwijze"><?php ace360_e( $ace360_hero['how'] ); ?></a>
				</div>
				<ul class="checks">
					<?php foreach ( $ace360_hero['bullets'] as $ace360_b ) : ?>
						<li><?php ace360_e( $ace360_b ); ?></li>
					<?php endforeach; ?>
				</ul>
			</div>
		</div>
	</section>

	<section class="ch right" id="diensten" data-k="services">
		<div class="wrap">
			<div class="copy copy-wide">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Services', 'Diensten' ) ); ?></p>
				<h2><?php ace360_e( ace360_pair( 'Four things, done properly', 'Vier dingen, goed gedaan' ) ); ?></h2>
				<p class="body"><?php ace360_e( ace360_pair( 'Not a list of thirty services where five of them actually work. This is what I build and maintain.', 'Geen lijst met dertig diensten waarvan er vijf echt werken. Dit is wat ik bouw en onderhoud.' ) ); ?></p>
				<ol class="services">
					<?php foreach ( ace360_services() as $ace360_i => $ace360_s ) : ?>
						<li class="card">
							<div class="card-top">
								<span class="num tabular"><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?></span>
								<span class="price tabular"><?php ace360_e( $ace360_s['price'] ); ?></span>
							</div>
							<h3><?php ace360_e( $ace360_s['title'] ); ?></h3>
							<p><?php ace360_e( $ace360_s['text'] ); ?></p>
						</li>
					<?php endforeach; ?>
				</ol>
			</div>
		</div>
	</section>

	<section class="ch" id="prijs" data-k="estimate">
		<div class="wrap">
			<div class="copy copy-wide">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Price estimator', 'Prijsindicatie' ) ); ?></p>
				<h2><?php ace360_e( ace360_pair( 'What would yours cost?', 'Wat kost die van jou?' ) ); ?></h2>
				<p class="body"><?php ace360_e( ace360_pair( 'Pick what you need. You see the same range I would give you on the phone.', 'Kies wat je nodig hebt. Je ziet dezelfde bandbreedte die ik je aan de telefoon zou geven.' ) ); ?></p>

				<form class="card estimator" data-estimator="<?php echo esc_attr( wp_json_encode( $ace360_est_js ) ); ?>" onsubmit="return false">
					<fieldset>
						<legend><?php ace360_e( ace360_pair( 'What are we building?', 'Wat gaan we bouwen?' ) ); ?></legend>
						<div class="opts">
							<?php foreach ( $ace360_est['types'] as $ace360_i => $ace360_t ) : ?>
								<label class="opt">
									<input type="radio" name="est_type" id="est_type_<?php echo esc_attr( $ace360_t['id'] ); ?>" value="<?php echo esc_attr( $ace360_t['id'] ); ?>"<?php echo 1 === $ace360_i ? ' checked' : ''; ?>>
									<span><?php ace360_e( $ace360_t['label'] ); ?></span>
								</label>
							<?php endforeach; ?>
						</div>
					</fieldset>
					<fieldset>
						<legend><?php ace360_e( ace360_pair( 'Extras', 'Extra’s' ) ); ?></legend>
						<div class="opts">
							<?php foreach ( $ace360_est['extras'] as $ace360_x ) : ?>
								<label class="opt">
									<input type="checkbox" name="est_extra" id="est_extra_<?php echo esc_attr( $ace360_x['id'] ); ?>" value="<?php echo esc_attr( $ace360_x['id'] ); ?>">
									<span><?php ace360_e( $ace360_x['label'] ); ?></span>
								</label>
							<?php endforeach; ?>
						</div>
					</fieldset>
					<label class="switch">
						<input type="checkbox" name="est_care" id="est_care">
						<span class="switch-ui" aria-hidden="true"></span>
						<span><?php ace360_e( ace360_pair( 'Add maintenance and care', 'Onderhoud toevoegen' ) ); ?> <span class="muted tabular">+ € <?php echo esc_html( $ace360_est['care'] ); ?>/<?php ace360_e( ace360_pair( 'month', 'maand' ) ); ?></span></span>
					</label>
					<div class="est-result" aria-live="polite">
						<p class="est-range tabular" data-est-range>€ 1,200 – 2,400</p>
						<p class="est-meta" data-est-meta><?php ace360_e( ace360_pair( 'Launch in about 3 weeks · excl. VAT', 'Live in ongeveer 3 weken · excl. btw' ) ); ?></p>
						<button class="btn" type="button" data-est-send><?php ace360_e( ace360_pair( 'Ask for a fixed quote', 'Vraag een vaste offerte' ) ); ?> <span aria-hidden="true">→</span></button>
					</div>
					<p class="small"><?php ace360_e( ace360_pair( 'An indication, not a quote. Your fixed quote follows within 2 days.', 'Een indicatie, geen offerte. Je vaste offerte volgt binnen 2 dagen.' ) ); ?></p>
				</form>
			</div>
		</div>
	</section>

	<section class="ch right" id="werkwijze" data-k="process">
		<div class="wrap">
			<div class="copy">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Process', 'Werkwijze' ) ); ?></p>
				<h2><?php ace360_e( ace360_pair( 'Five steps, and you always know which one you are on', 'Vijf stappen, en je weet altijd bij welke je bent' ) ); ?></h2>
				<p class="body"><?php ace360_e( ace360_pair( 'Most projects run late because nobody agreed what finished means. That is why the schedule is written into the quote.', 'De meeste projecten lopen uit omdat niemand heeft afgesproken wat ‘af’ betekent. Daarom staat de planning in de offerte.' ) ); ?></p>
				<ol class="step-index">
					<?php foreach ( ace360_process() as $ace360_i => $ace360_p ) : ?>
						<li><span class="tabular"><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?></span> <?php ace360_e( $ace360_p[0] ); ?></li>
					<?php endforeach; ?>
				</ol>
			</div>
		</div>
	</section>

	<?php foreach ( ace360_process() as $ace360_i => $ace360_p ) : ?>
		<section class="ch step<?php echo 1 === $ace360_i % 2 ? ' right' : ''; ?>" data-k="<?php echo esc_attr( 's' . ( $ace360_i + 1 ) ); ?>">
			<div class="wrap">
				<div class="copy">
					<p class="kicker"><span class="tabular"><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?> / 05</span> · <?php ace360_e( $ace360_p[1] ); ?></p>
					<h2 class="step-title"><?php ace360_e( $ace360_p[0] ); ?></h2>
					<p class="body"><?php ace360_e( $ace360_p[2] ); ?></p>
					<div class="progress" aria-hidden="true"><i style="--p:<?php echo esc_attr( ( $ace360_i + 1 ) / 5 ); ?>"></i></div>
				</div>
			</div>
		</section>
	<?php endforeach; ?>

	<section class="ch tall right" id="werk" data-k="work" data-items="<?php echo esc_attr( count( $ace360_work ) ); ?>" style="--items:<?php echo esc_attr( count( $ace360_work ) ); ?>">
		<div class="sticky">
			<div class="wrap">
				<div class="copy">
					<p class="kicker"><?php ace360_e( ace360_pair( 'Work', 'Werk' ) ); ?> · <span class="tabular" data-count>1 / <?php echo esc_html( count( $ace360_work ) ); ?></span></p>
					<h2><?php ace360_e( ace360_pair( 'Recently built', 'Recent opgeleverd' ) ); ?></h2>
					<p class="body"><?php ace360_e( ace360_pair( 'A few of the projects that went live lately.', 'Een paar projecten die onlangs live gingen.' ) ); ?></p>
					<ol class="items">
						<?php foreach ( $ace360_work as $ace360_i => $ace360_w ) : ?>
							<li class="item card<?php echo 0 === $ace360_i ? ' is-on' : ''; ?>">
								<?php if ( ! empty( $ace360_w['image'] ) ) : ?>
									<img src="<?php echo esc_url( $ace360_w['image'] ); ?>" alt="" loading="lazy">
								<?php endif; ?>
								<p class="small"><?php ace360_e( $ace360_w['type'] ); ?></p>
								<h3>
									<?php if ( ! empty( $ace360_w['url'] ) ) : ?>
										<a href="<?php echo esc_url( $ace360_w['url'] ); ?>"><?php echo esc_html( $ace360_w['title'] ); ?></a>
									<?php else : ?>
										<?php echo esc_html( $ace360_w['title'] ); ?>
									<?php endif; ?>
								</h3>
								<p><?php ace360_e( $ace360_w['text'] ); ?></p>
							</li>
						<?php endforeach; ?>
					</ol>
					<div class="dots" role="group" aria-label="<?php esc_attr_e( 'Projects', 'ace360' ); ?>">
						<?php foreach ( $ace360_work as $ace360_i => $ace360_w ) : ?>
							<button type="button" data-go="<?php echo esc_attr( $ace360_i ); ?>" aria-label="<?php echo esc_attr( $ace360_w['title'] ); ?>"<?php echo 0 === $ace360_i ? ' class="on"' : ''; ?>></button>
						<?php endforeach; ?>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="band" id="vragen" data-k="faq">
		<div class="wrap band-grid">
			<div class="band-head">
				<p class="kicker"><?php ace360_e( ace360_pair( 'Questions', 'Vragen' ) ); ?></p>
				<h2><?php ace360_e( ace360_pair( 'What people ask first', 'Wat mensen als eerste vragen' ) ); ?></h2>
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
