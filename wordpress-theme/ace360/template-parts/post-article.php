<?php
/**
 * One article. $args['p'] from ace360_post_data() (or the preview). Layouts (post meta ace360_post_layout):
 * cover (title over a full-width cover), split (title beside a tilted cover), poster (huge title, cover below)
 * and guide (compact header, contents beside the text).
 *
 * @package ace360
 */

$p      = $args['p'];
$lang   = $p['lang'];
$en     = 'en' === $lang;
$svc    = ( $p['service'] && isset( ace360_landings()[ $p['service'] ] ) ) ? $p['service'] : 'kosten';
$sl     = ace360_landings()[ $svc ];
$more   = array_values( array_filter( ace360_blog_items( 4, $lang ), function ( $m ) use ( $p ) { return $m['slug'] !== $p['slug']; } ) );
$more   = array_slice( $more, 0, 3 );
$share  = rawurlencode( $p['url'] );
$layout = in_array( $p['layout'], array( 'cover', 'split', 'poster', 'guide' ), true ) ? $p['layout'] : 'cover';
?>
<article class="post layout-<?php echo esc_attr( $layout ); ?>" data-post="<?php echo esc_attr( $p['slug'] ); ?>" lang="<?php echo esc_attr( $en ? 'en' : 'nl' ); ?>">
	<div class="read-progress" aria-hidden="true"><span></span></div>

	<header class="post-hero">
		<?php if ( $p['cover'] && in_array( $layout, array( 'cover' ), true ) ) : ?>
			<div class="post-hero-bg" style="background-image:url('<?php echo esc_url( $p['cover'] ); ?>')" aria-hidden="true"></div>
		<?php endif; ?>
		<div class="wrap post-hero-in">
			<div class="post-hero-copy">
				<nav class="crumbs mono" aria-label="<?php echo esc_attr( $en ? 'Breadcrumb' : 'Kruimelpad' ); ?>">
					<a href="<?php echo esc_url( ace360_url( '/', $lang ) ); ?>">Ace 360</a> <span aria-hidden="true">/</span> <a href="<?php echo esc_url( ace360_blog_url( $lang ) ); ?>">Blog</a> <span aria-hidden="true">/</span> <span><?php echo esc_html( $p['cat'] ); ?></span>
				</nav>
				<p class="post-meta mono"><span class="post-cat"><?php echo esc_html( $p['cat'] ); ?></span><?php echo esc_html( ( $p['date'] ? ' · ' . $p['date'] : '' ) . ' · ' . $p['minutes'] . ( $en ? ' min read' : ' min lezen' ) ); ?></p>
				<h1><?php echo esc_html( $p['title'] ); ?></h1>
				<?php if ( $p['excerpt'] ) : ?>
					<p class="lede"><?php echo esc_html( $p['excerpt'] ); ?></p>
				<?php endif; ?>
				<div class="post-share">
					<button type="button" class="chip" data-share-copy><?php echo esc_html( $en ? 'Copy link' : 'Link kopiëren' ); ?></button>
					<a class="chip" href="https://wa.me/?text=<?php echo esc_attr( $share ); ?>" target="_blank" rel="noopener">WhatsApp</a>
					<a class="chip" href="https://www.linkedin.com/sharing/share-offsite/?url=<?php echo esc_attr( $share ); ?>" target="_blank" rel="noopener">LinkedIn</a>
				</div>
			</div>
			<?php if ( $p['cover'] && 'cover' !== $layout ) : ?>
				<figure class="post-cover" data-tilt><img src="<?php echo esc_url( $p['cover'] ); ?>" alt=""></figure>
			<?php endif; ?>
		</div>
	</header>

	<div class="wrap post-grid">
		<aside class="post-side">
			<?php if ( $p['takeaways'] ) : ?>
				<div class="takeaways">
					<p class="mono"><?php echo esc_html( $en ? 'In short' : 'In het kort' ); ?></p>
					<ul>
						<?php foreach ( $p['takeaways'] as $t ) : ?>
							<li><?php echo esc_html( $t ); ?></li>
						<?php endforeach; ?>
					</ul>
				</div>
			<?php endif; ?>
			<nav class="post-toc" data-toc hidden aria-label="<?php echo esc_attr( $en ? 'Contents' : 'Inhoud' ); ?>">
				<p class="mono"><?php echo esc_html( $en ? 'Contents' : 'Inhoud' ); ?></p>
			</nav>
		</aside>
		<div class="post-body prose">
			<?php echo $p['body']; // phpcs:ignore WordPress.Security.EscapeOutput -- post content. ?>
		</div>
	</div>

	<div class="wrap post-after">
		<aside class="post-cta">
			<div>
				<p class="kicker">Ace 360 Services</p>
				<p class="post-cta-title"><?php echo esc_html( wp_strip_all_tags( str_replace( '*', '', $sl['h1'][ $lang ] ) ) ); ?></p>
				<p><?php echo esc_html( $sl['desc'][ $lang ] ); ?></p>
			</div>
			<div class="actions">
				<a class="btn btn-orange" href="<?php echo esc_url( ace360_landing_url( $svc, $lang ) . ( in_array( 'estimator', ace360_landing_blocks( $svc ), true ) ? '#prijs' : '' ) ); ?>"><?php echo esc_html( $en ? 'See an estimate' : 'Bekijk een prijsindicatie' ); ?> <span aria-hidden="true">→</span></a>
				<a class="btn btn-line" href="<?php echo esc_url( ace360_landing_url( 'contact', $lang ) . '#book' ); ?>"><?php echo esc_html( $en ? 'Book a free call' : 'Plan een gratis gesprek' ); ?></a>
			</div>
		</aside>

		<?php if ( $more ) : ?>
			<nav class="post-more" aria-label="<?php echo esc_attr( $en ? 'More articles' : 'Meer artikelen' ); ?>">
				<p class="kicker"><?php echo esc_html( $en ? 'Read next' : 'Lees ook' ); ?></p>
				<ul class="teaser-grid">
					<?php foreach ( $more as $m ) : ?>
						<li class="teaser-card reveal">
							<a href="<?php echo esc_url( $m['url'] ); ?>">
								<span class="teaser-img"><?php if ( $m['cover'] ) : ?><img src="<?php echo esc_url( $m['cover'] ); ?>" alt="" loading="lazy"><?php endif; ?></span>
								<span class="mono teaser-meta"><?php echo esc_html( $m['cat'] . ' · ' . $m['minutes'] . ' min' ); ?></span>
								<b><?php echo esc_html( $m['title'] ); ?></b>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			</nav>
		<?php endif; ?>
	</div>
</article>
