<?php
/**
 * Blog (/blog/ Dutch, /en/blog/ English): a featured article, topic filters and search, a rail of short
 * video tips, and the rest in a grid of mixed sizes. Filtering and search run in the browser (assets/js/ui.js).
 *
 * @package ace360
 */

get_header();
$ace360_lang  = ace360_lang();
$ace360_en    = 'en' === $ace360_lang;
$ace360_items = ace360_blog_items( 60 );
$ace360_lead  = $ace360_items ? array_shift( $ace360_items ) : null;
$ace360_cats  = array();
foreach ( array_merge( $ace360_lead ? array( $ace360_lead ) : array(), $ace360_items ) as $ace360_it ) {
	$ace360_cats[ $ace360_it['cat'] ] = isset( $ace360_cats[ $ace360_it['cat'] ] ) ? $ace360_cats[ $ace360_it['cat'] ] + 1 : 1;
}
// short video tips, each linking to the article it belongs to
$ace360_rail = $ace360_en
	? array( array( 'booking-flow', 'Booking in three taps', 'booking-website-vs-booking-app' ), array( 'vague-quote', 'A quote with a total', 'hire-web-designer-netherlands' ), array( 'ownership', 'Who owns your logins?', 'hire-web-designer-netherlands' ), array( 'missed-call', 'The missed call', 'booking-website-vs-booking-app' ), array( 'prices-booking', 'Let your site answer', 'booking-website-vs-booking-app' ), array( 'five-steps', 'Five steps to live', 'starting-a-business-netherlands-website' ) )
	: array( array( 'five-second-fail', 'De 5-secondentest', 'vijf-secondentest-homepage' ), array( 'vague-quote', 'Een offerte met totaal', 'vragen-voor-webdesigner' ), array( 'ownership', 'Van wie zijn je logins?', 'domein-en-hosting-op-eigen-naam' ), array( 'booking-flow', 'Boeken in drie tikken', 'boekingssysteem-kiezen-salon' ), array( 'after-launch', 'Na de lancering', 'wordpress-onderhoud-checklist' ), array( 'speed-score', 'Snel en vindbaar', 'snelle-website-laadtijd' ) );
$ace360_bento = array( 'is-wide', '', '', 'is-tall', '', '', '', 'is-wide', '', 'is-tall' );
?>
<main id="main" class="site-main blog-index" data-blog-index>
	<header class="wrap blog-hero">
		<svg class="blog-hero-ring" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="5.2 2.34"/><rect x="13.6" y="2.8" width="4.8" height="4.8" rx="1" fill="currentColor"/></svg>
		<p class="kicker"><?php ace360_e( ace360_pair( 'Blog', 'Blog' ) ); ?></p>
		<h1><?php echo ace360_hl( ace360_pair( 'Website tips you can *use*', 'Websitetips die je meteen kunt *gebruiken*' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h1>
		<p class="lede"><?php ace360_e( ace360_pair( 'Short, practical articles about websites, online stores, booking and being found on Google. Written for business owners, not developers.', 'Korte, praktische artikelen over websites, webshops, online boeken en gevonden worden in Google. Geschreven voor ondernemers, niet voor programmeurs.' ) ); ?></p>
		<div class="blog-tools">
			<label class="blog-search">
				<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
				<span class="screen-reader-text"><?php echo esc_html( $ace360_en ? 'Search articles' : 'Zoek in artikelen' ); ?></span>
				<input type="search" data-blog-search placeholder="<?php echo esc_attr( $ace360_en ? 'Search articles…' : 'Zoek een artikel…' ); ?>">
			</label>
			<div class="blog-chips" role="group" aria-label="<?php echo esc_attr( $ace360_en ? 'Topics' : 'Onderwerpen' ); ?>">
				<button type="button" class="chip" data-cat="all" aria-pressed="true"><?php echo esc_html( $ace360_en ? 'All' : 'Alles' ); ?> <i><?php echo esc_html( array_sum( $ace360_cats ) ); ?></i></button>
				<?php foreach ( $ace360_cats as $ace360_c => $ace360_n ) : ?>
					<button type="button" class="chip" data-cat="<?php echo esc_attr( sanitize_title( $ace360_c ) ); ?>" aria-pressed="false"><?php echo esc_html( $ace360_c ); ?> <i><?php echo esc_html( $ace360_n ); ?></i></button>
				<?php endforeach; ?>
			</div>
		</div>
	</header>

	<?php if ( $ace360_lead ) : ?>
		<section class="wrap blog-lead-wrap">
			<a class="blog-lead reveal" href="<?php echo esc_url( $ace360_lead['url'] ); ?>" data-card="<?php echo esc_attr( sanitize_title( $ace360_lead['cat'] ) ); ?>">
				<span class="blog-lead-img"><?php if ( $ace360_lead['cover'] ) : ?><img src="<?php echo esc_url( $ace360_lead['cover'] ); ?>" alt=""><?php endif; ?></span>
				<span class="blog-lead-copy">
					<span class="mono blog-flag"><?php echo esc_html( $ace360_en ? 'Newest' : 'Nieuwste' ); ?></span>
					<span class="mono blog-meta"><?php echo esc_html( $ace360_lead['cat'] . ' · ' . $ace360_lead['minutes'] . ' min' ); ?></span>
					<b><?php echo esc_html( $ace360_lead['title'] ); ?></b>
					<span class="blog-excerpt"><?php echo esc_html( $ace360_lead['excerpt'] ); ?></span>
					<span class="arrow-link"><?php echo esc_html( $ace360_en ? 'Read the article' : 'Lees het artikel' ); ?> <span aria-hidden="true">→</span></span>
				</span>
			</a>
		</section>
	<?php endif; ?>

	<section class="clip-rail-wrap" aria-label="<?php echo esc_attr( $ace360_en ? 'Video tips' : 'Videotips' ); ?>">
		<div class="wrap clip-rail-head">
			<p class="kicker"><?php echo esc_html( $ace360_en ? 'Watch · 10-second tips' : 'Kijk · tips van 10 seconden' ); ?></p>
		</div>
		<ul class="clip-rail">
			<?php foreach ( $ace360_rail as $ace360_r ) : ?>
				<li>
					<?php echo ace360_clip_html( $ace360_r[0], $ace360_r[1] ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
					<a class="arrow-link" href="<?php echo esc_url( ace360_post_url( $ace360_r[2] ) ); ?>"><?php echo esc_html( $ace360_en ? 'Read more' : 'Lees meer' ); ?> <span aria-hidden="true">→</span></a>
				</li>
			<?php endforeach; ?>
		</ul>
	</section>

	<section class="wrap">
		<ul class="blog-bento">
			<?php foreach ( $ace360_items as $ace360_i => $ace360_p ) : ?>
				<li class="bcard reveal <?php echo esc_attr( $ace360_bento[ $ace360_i % count( $ace360_bento ) ] ); ?>" data-card="<?php echo esc_attr( sanitize_title( $ace360_p['cat'] ) ); ?>">
					<a href="<?php echo esc_url( $ace360_p['url'] ); ?>">
						<span class="bcard-img"><?php if ( $ace360_p['cover'] ) : ?><img src="<?php echo esc_url( $ace360_p['cover'] ); ?>" alt="" loading="lazy"><?php endif; ?></span>
						<span class="bcard-copy">
							<span class="mono blog-meta"><?php echo esc_html( $ace360_p['cat'] . ' · ' . $ace360_p['minutes'] . ' min' ); ?></span>
							<b><?php echo esc_html( $ace360_p['title'] ); ?></b>
							<span class="blog-excerpt"><?php echo esc_html( $ace360_p['excerpt'] ); ?></span>
						</span>
						<span class="bcard-go" aria-hidden="true">↗</span>
					</a>
				</li>
			<?php endforeach; ?>
		</ul>
		<p class="blog-none" data-blog-none hidden><?php echo esc_html( $ace360_en ? 'No articles match. Try another word or topic.' : 'Geen artikelen gevonden. Probeer een ander woord of onderwerp.' ); ?></p>
	</section>

	<?php get_template_part( 'template-parts/cta-band', null, array( 'title' => ace360_pair( 'Rather have it *done* for you?', 'Liever dat het voor je *gedaan* wordt?' ) ) ); ?>
</main>
<?php
get_footer();
