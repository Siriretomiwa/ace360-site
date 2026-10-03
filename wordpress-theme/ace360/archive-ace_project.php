<?php
/**
 * All work page (/work/): every project, filterable by sector, each one opens
 * up close. Shows the Projects posts, or the sample work until there are any.
 *
 * @package ace360
 */

get_header();

$ace360_work    = ace360_get_work();
$ace360_counts  = ace360_work_counts( $ace360_work );
$ace360_sectors = ace360_sectors();
$ace360_home    = home_url( '/' );
?>
<main id="main" class="site-main work-page">
	<header class="wrap work-hero">
		<div class="work-hero-copy">
		<p class="kicker"><?php ace360_e( ace360_pair( 'All work', 'Al het werk' ) ); ?> · <span class="mono"><?php echo esc_html( count( $ace360_work ) ); ?></span></p>
		<h1><?php echo ace360_hl( ace360_pair( 'Every kind of business, *one* way of working', 'Elk soort bedrijf, *één* manier van werken' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h1>
		<p class="lede"><?php ace360_e( ace360_pair( 'Stores, charities, salons, restaurants and platforms, in the Netherlands and abroad. Filter by sector and open any project to see what was built.', 'Webshops, goede doelen, salons, restaurants en platforms, in Nederland en daarbuiten. Filter op sector en open een project om te zien wat er gebouwd is.' ) ); ?></p>
		</div>
		<div class="work-hero-fan" aria-hidden="true">
			<?php
			$ace360_fan = array_slice(
				array_values(
					array_filter(
						$ace360_work,
						function ( $w ) {
							return ! empty( $w['image'] ) || ( ! empty( $w['mockup'] ) && 'generic' !== $w['mockup'] );
						}
					)
				),
				0,
				3
			);
			foreach ( $ace360_fan as $ace360_f ) :
				?>
				<span class="fan-card">
					<?php if ( ! empty( $ace360_f['image'] ) ) : ?>
						<img src="<?php echo esc_url( $ace360_f['image'] ); ?>" alt="">
					<?php else : ?>
						<canvas width="768" height="480" data-paint="<?php echo esc_attr( $ace360_f['mockup'] ); ?>" data-title="<?php echo esc_attr( $ace360_f['title'] ); ?>"></canvas>
					<?php endif; ?>
				</span>
			<?php endforeach; ?>
		</div>
		<dl class="work-stats">
			<div><dt class="mono"><?php ace360_e( ace360_pair( 'Projects', 'Projecten' ) ); ?></dt><dd><?php echo esc_html( count( $ace360_work ) ); ?></dd></div>
			<div><dt class="mono"><?php ace360_e( ace360_pair( 'Sectors', 'Sectoren' ) ); ?></dt><dd><?php echo esc_html( count( $ace360_counts ) ); ?></dd></div>
			<div><dt class="mono"><?php ace360_e( ace360_pair( 'Where', 'Waar' ) ); ?></dt><dd><?php ace360_e( ace360_pair( 'NL & worldwide', 'NL & wereldwijd' ) ); ?></dd></div>
		</dl>
	</header>

	<div class="work-filterbar">
		<div class="wrap">
			<div class="filters" role="group" aria-label="<?php esc_attr_e( 'Filter projects', 'ace360' ); ?>">
				<button type="button" class="chip is-on" data-filter="all" aria-pressed="true"><span><?php ace360_e( ace360_pair( 'All', 'Alles' ) ); ?></span> <i class="mono"><?php echo esc_html( count( $ace360_work ) ); ?></i></button>
				<?php foreach ( $ace360_sectors as $ace360_key => $ace360_label ) : ?>
					<?php if ( ! empty( $ace360_counts[ $ace360_key ] ) ) : ?>
						<button type="button" class="chip" data-filter="<?php echo esc_attr( $ace360_key ); ?>" aria-pressed="false"><span><?php ace360_e( $ace360_label ); ?></span> <i class="mono"><?php echo esc_html( $ace360_counts[ $ace360_key ] ); ?></i></button>
					<?php endif; ?>
				<?php endforeach; ?>
			</div>
		</div>
	</div>

	<section class="wrap work-list">
		<ul class="work-grid work-grid-rich">
			<?php
			foreach ( $ace360_work as $ace360_w ) {
				get_template_part( 'template-parts/work-card', null, array( 'w' => $ace360_w, 'rich' => true ) );
			}
			?>
		</ul>
	</section>

	<section class="wrap">
		<div class="work-cta">
			<div>
				<h2><?php echo ace360_hl( ace360_pair( 'Your business *next*?', 'Jouw bedrijf *de volgende*?' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
				<p class="lede"><?php ace360_e( ace360_pair( 'Tell me what your site has to bring in. A free 20-minute call, no strings attached.', 'Vertel wat je site moet opleveren. Een gratis gesprek van 20 minuten, vrijblijvend.' ) ); ?></p>
			</div>
			<div class="actions">
				<a class="btn btn-orange" href="<?php echo esc_url( $ace360_home . '#book' ); ?>"><?php ace360_e( ace360_pair( 'Book a free call', 'Plan een gratis gesprek' ) ); ?> <span aria-hidden="true">→</span></a>
				<a class="btn btn-line" href="<?php echo esc_url( $ace360_home . '#prijs' ); ?>"><?php ace360_e( ace360_pair( 'Get my estimate', 'Bekijk mijn prijsindicatie' ) ); ?></a>
			</div>
		</div>
	</section>

	<?php get_template_part( 'template-parts/work-dialog' ); ?>
</main>
<?php
get_footer();
