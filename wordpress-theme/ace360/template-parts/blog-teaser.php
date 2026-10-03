<?php
/**
 * Front page: the three newest articles in the page language, linking to the blog.
 *
 * @package ace360
 */

$ace360_items = ace360_blog_items( 3 );
if ( ! $ace360_items ) {
	return;
}
?>
<section class="band blog-teaser" id="blog" data-k="faq" data-screen="live">
	<div class="wrap">
		<div class="blog-teaser-head">
			<div class="sec-head">
				<p class="kicker"><?php ace360_e( ace360_pair( 'From the blog', 'Uit de blog' ) ); ?></p>
				<h2><?php echo ace360_hl( ace360_pair( 'Website tips you can use *today*', 'Websitetips die je *vandaag* kunt gebruiken' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
			</div>
			<a class="btn btn-line" href="<?php echo esc_url( ace360_blog_url() ); ?>"><?php ace360_e( ace360_pair( 'All articles', 'Alle artikelen' ) ); ?> <span aria-hidden="true">→</span></a>
		</div>
		<ul class="teaser-grid">
			<?php foreach ( $ace360_items as $ace360_i => $ace360_p ) : ?>
				<li class="teaser-card reveal<?php echo 0 === $ace360_i ? ' is-lead' : ''; ?>">
					<a href="<?php echo esc_url( $ace360_p['url'] ); ?>">
						<span class="teaser-img"><?php if ( $ace360_p['cover'] ) : ?><img src="<?php echo esc_url( $ace360_p['cover'] ); ?>" alt="" loading="lazy"><?php endif; ?></span>
						<span class="mono teaser-meta"><?php echo esc_html( $ace360_p['cat'] . ' · ' . $ace360_p['minutes'] . ' min' ); ?></span>
						<b><?php echo esc_html( $ace360_p['title'] ); ?></b>
					</a>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>
