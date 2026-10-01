<?php
/**
 * Front page: a scroll-driven 3D film. One fixed WebGL stage sits behind every
 * chapter; each chapter's data-k names the camera pose, data-screen names what
 * the floating browser window shows. Everything reads fine without WebGL.
 *
 * @package ace360
 */

get_header();

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
			'type'    => get_post_meta( get_the_ID(), 'ace360_project_type', true ),
			'title'   => get_the_title(),
			'text'    => wp_strip_all_tags( get_the_excerpt() ),
			'variant' => 'grid',
			'image'   => get_the_post_thumbnail_url( get_the_ID(), 'large' ),
			'url'     => get_permalink(),
		);
	}
	wp_reset_postdata();
}
$ace360_is_example = empty( $ace360_work );
if ( $ace360_is_example ) {
	$ace360_work = ace360_example_projects();
}
$ace360_market = ace360_market();
?>
<div class="bg" id="bg-night" aria-hidden="true"></div>
<div class="bg" id="bg-light" aria-hidden="true"></div>
<canvas id="stage" aria-hidden="true"></canvas>

<main id="main" class="film">

	<section class="ch hero" data-k="hero" data-screen="live">
		<div class="wrap">
			<div class="copy">
				<p class="kicker"><span class="tile-dot" aria-hidden="true"></span><?php echo esc_html( ace360_mod( 'hero_eyebrow' ) ); ?></p>
				<h1 class="hero-title" data-split><?php echo ace360_headline( ace360_mod( 'hero_title' ) ); // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helper. ?></h1>
				<p class="body"><?php echo esc_html( ace360_mod( 'hero_text' ) ); ?></p>
				<div class="actions">
					<a class="btn" href="#contact"><?php echo esc_html( ace360_mod( 'cta_label' ) ); ?></a>
					<a class="link" href="#why"><?php esc_html_e( 'Watch how we build', 'ace360' ); ?> &darr;</a>
				</div>
			</div>
		</div>
		<p class="scroll-cue" aria-hidden="true"><span></span><?php esc_html_e( 'Scroll', 'ace360' ); ?></p>
	</section>

	<section class="ch" id="why" data-k="why" data-screen="loading">
		<div class="wrap">
			<div class="copy">
				<p class="kicker"><?php esc_html_e( 'The problem', 'ace360' ); ?></p>
				<h2><?php esc_html_e( 'Most sites are slow, generic and hard to change.', 'ace360' ); ?></h2>
				<ul class="lines">
					<li><?php esc_html_e( 'Six seconds before anything appears on a phone', 'ace360' ); ?></li>
					<li><?php esc_html_e( 'No iDEAL, so Dutch carts get abandoned', 'ace360' ); ?></li>
					<li><?php esc_html_e( 'A template that looks like everyone else', 'ace360' ); ?></li>
					<li><?php esc_html_e( 'Nobody on the team dares to edit it', 'ace360' ); ?></li>
				</ul>
			</div>
		</div>
	</section>

	<section class="ch right" id="believe" data-k="believe" data-screen="live">
		<div class="wrap">
			<div class="copy">
				<p class="kicker"><?php esc_html_e( 'What we believe', 'ace360' ); ?></p>
				<p class="q"><?php esc_html_e( 'Your website is the hardest-working employee your brand has. It should look the part.', 'ace360' ); ?></p>
				<ol class="rules">
					<li><span><b><?php esc_html_e( 'Fast first.', 'ace360' ); ?></b> <?php esc_html_e( 'Every effect earns its weight in kilobytes.', 'ace360' ); ?></span></li>
					<li><span><b><?php esc_html_e( 'Dutch by design.', 'ace360' ); ?></b> <?php esc_html_e( 'iDEAL, postcodes, AVG and two languages from day one.', 'ace360' ); ?></span></li>
					<li><span><b><?php esc_html_e( 'Yours to edit.', 'ace360' ); ?></b> <?php esc_html_e( 'Your team changes any page without calling us.', 'ace360' ); ?></span></li>
					<li><span><b><?php esc_html_e( 'Motion with a reason.', 'ace360' ); ?></b> <?php esc_html_e( '3D where it explains, stillness where it doesn’t.', 'ace360' ); ?></span></li>
				</ol>
			</div>
		</div>
	</section>

	<section class="ch" id="process" data-k="process" data-screen="wire">
		<div class="wrap">
			<div class="copy">
				<p class="kicker"><?php esc_html_e( 'How we build', 'ace360' ); ?></p>
				<h2><?php esc_html_e( 'Five steps. Eight weeks.', 'ace360' ); ?></h2>
				<p class="body"><?php esc_html_e( 'The typical timeline for a brand website. Stores and 3D work take a little longer, and we tell you that up front.', 'ace360' ); ?></p>
			</div>
		</div>
	</section>

	<?php foreach ( ace360_steps() as $ace360_i => $ace360_step ) : ?>
		<section class="ch step" data-k="<?php echo esc_attr( 's' . ( $ace360_i + 1 ) ); ?>" data-screen="<?php echo esc_attr( $ace360_step['screen'] ); ?>">
			<div class="wrap">
				<div class="copy">
					<p class="kicker tabular"><b><?php echo esc_html( sprintf( '%02d', $ace360_i + 1 ) ); ?></b> / 05 · <span lang="nl"><?php echo esc_html( $ace360_step['nl'] ); ?></span> · <?php echo esc_html( $ace360_step['time'] ); ?></p>
					<h2 class="step-word"><?php echo esc_html( $ace360_step['word'] ); ?></h2>
					<p class="body"><?php echo esc_html( $ace360_step['text'] ); ?></p>
				</div>
			</div>
		</section>
	<?php endforeach; ?>

	<section class="ch right" id="services" data-k="services" data-screen="live">
		<div class="wrap">
			<div class="copy">
				<p class="kicker"><?php esc_html_e( 'What we make', 'ace360' ); ?></p>
				<h2><?php esc_html_e( 'Four things, done properly.', 'ace360' ); ?></h2>
				<ul class="services">
					<li><b><?php esc_html_e( 'Brand websites', 'ace360' ); ?></b><span><?php esc_html_e( 'Custom WordPress, editable in the block editor.', 'ace360' ); ?></span></li>
					<li><b><?php esc_html_e( 'Online stores', 'ace360' ); ?></b><span><?php esc_html_e( 'WooCommerce with Mollie, Sendcloud and PostNL.', 'ace360' ); ?></span></li>
					<li><b><?php esc_html_e( '3D & motion', 'ace360' ); ?></b><span><?php esc_html_e( 'Three.js and GSAP scenes like the one behind this text.', 'ace360' ); ?></span></li>
					<li><b><?php esc_html_e( 'Care & growth', 'ace360' ); ?></b><span><?php esc_html_e( 'EU hosting, updates and monthly reports.', 'ace360' ); ?></span></li>
				</ul>
			</div>
		</div>
	</section>

	<section class="ch tall tone-l" id="nl" data-k="market" data-tone="light" data-items="<?php echo esc_attr( count( $ace360_market ) ); ?>" style="--items:<?php echo esc_attr( count( $ace360_market ) ); ?>">
		<div class="sticky">
			<div class="wrap">
				<div class="copy">
					<p class="kicker"><?php esc_html_e( 'Built for the Netherlands', 'ace360' ); ?> · <span class="tabular" data-count>1 / <?php echo esc_html( count( $ace360_market ) ); ?></span></p>
					<ol class="items">
						<?php foreach ( $ace360_market as $ace360_m_i => $ace360_m ) : ?>
							<li class="item<?php echo 0 === $ace360_m_i ? ' is-on' : ''; ?>" data-screen="<?php echo esc_attr( 'nl-' . $ace360_m[0] ); ?>">
								<h2><?php echo esc_html( $ace360_m[1] ); ?></h2>
								<p class="body"><?php echo esc_html( $ace360_m[2] ); ?></p>
							</li>
						<?php endforeach; ?>
					</ol>
					<div class="dots" role="group" aria-label="<?php esc_attr_e( 'Features', 'ace360' ); ?>">
						<?php foreach ( $ace360_market as $ace360_m_i => $ace360_m ) : ?>
							<button type="button" data-go="<?php echo esc_attr( $ace360_m_i ); ?>" aria-label="<?php echo esc_attr( $ace360_m[1] ); ?>"<?php echo 0 === $ace360_m_i ? ' class="on"' : ''; ?>></button>
						<?php endforeach; ?>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="ch tall right" id="work" data-k="work" data-items="<?php echo esc_attr( count( $ace360_work ) ); ?>" style="--items:<?php echo esc_attr( count( $ace360_work ) ); ?>">
		<div class="sticky">
			<div class="wrap">
				<div class="copy">
					<p class="kicker"><?php echo esc_html( $ace360_is_example ? __( 'Example projects', 'ace360' ) : __( 'Work', 'ace360' ) ); ?> · <span class="tabular" data-count>1 / <?php echo esc_html( count( $ace360_work ) ); ?></span></p>
					<ol class="items">
						<?php foreach ( $ace360_work as $ace360_w_i => $ace360_w ) : ?>
							<li class="item<?php echo 0 === $ace360_w_i ? ' is-on' : ''; ?>" data-screen="<?php echo esc_attr( 'work-' . $ace360_w['variant'] ); ?>" data-title="<?php echo esc_attr( $ace360_w['title'] ); ?>"<?php echo ! empty( $ace360_w['image'] ) ? ' data-image="' . esc_url( $ace360_w['image'] ) . '"' : ''; ?>>
								<?php if ( $ace360_w['type'] ) : ?>
									<p class="small"><?php echo esc_html( $ace360_w['type'] ); ?></p>
								<?php endif; ?>
								<h2>
									<?php if ( ! empty( $ace360_w['url'] ) ) : ?>
										<a href="<?php echo esc_url( $ace360_w['url'] ); ?>"><?php echo esc_html( $ace360_w['title'] ); ?></a>
									<?php else : ?>
										<?php echo esc_html( $ace360_w['title'] ); ?>
									<?php endif; ?>
								</h2>
								<p class="body"><?php echo esc_html( $ace360_w['text'] ); ?></p>
							</li>
						<?php endforeach; ?>
					</ol>
					<div class="bar" aria-hidden="true"><i data-bar></i></div>
					<?php if ( $ace360_is_example ) : ?>
						<p class="small"><?php esc_html_e( 'Examples of what we build. Add your own under Projects in the dashboard.', 'ace360' ); ?></p>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</section>

	<section class="ch" id="care" data-k="care" data-screen="live">
		<div class="wrap">
			<div class="copy">
				<p class="kicker"><?php esc_html_e( 'After launch', 'ace360' ); ?></p>
				<h2><?php esc_html_e( 'We stay.', 'ace360' ); ?></h2>
				<p class="body"><?php esc_html_e( 'Managed hosting in EU data centres, updates and daily backups. Every month a short report on speed, search rankings and sales, with what we would improve next.', 'ace360' ); ?></p>
			</div>
		</div>
	</section>

	<?php get_template_part( 'template-parts/contact' ); ?>

</main>
<?php
get_footer();
