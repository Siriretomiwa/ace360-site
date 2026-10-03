<?php
/**
 * Blog listing (/blog/ in Dutch, /en/blog/ in English): posts in the page language, newest first.
 *
 * @package ace360
 */

get_header();
$ace360_lang = ace360_lang();
?>
<main id="main" class="site-main page-shell blog-index">
	<div class="wrap">
		<header class="page-head">
			<p class="kicker"><?php ace360_e( ace360_pair( 'Blog', 'Blog' ) ); ?></p>
			<h1><?php echo ace360_hl( ace360_pair( 'Website tips you can *use*', 'Websitetips die je meteen kunt *gebruiken*' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h1>
			<p class="lede"><?php ace360_e( ace360_pair( 'Short, practical articles about websites, online stores, booking and being found on Google. Written for business owners, not developers.', 'Korte, praktische artikelen over websites, webshops, online boeken en gevonden worden in Google. Geschreven voor ondernemers, niet voor programmeurs.' ) ); ?></p>
		</header>

		<?php if ( have_posts() ) : ?>
			<ul class="blog-grid">
				<?php
				while ( have_posts() ) :
					the_post();
					$ace360_cat = get_the_category();
					?>
					<li <?php post_class( 'blog-card' ); ?>>
						<a href="<?php the_permalink(); ?>">
							<span class="blog-thumb">
								<?php
								if ( has_post_thumbnail() ) {
									the_post_thumbnail( 'medium_large', array( 'loading' => 'lazy', 'alt' => '' ) );
								}
								?>
							</span>
							<span class="blog-meta mono"><?php echo esc_html( ( $ace360_cat ? $ace360_cat[0]->name . ' · ' : '' ) . ace360_reading_minutes() . ' min' ); ?></span>
							<span class="blog-title"><?php the_title(); ?></span>
							<span class="blog-excerpt"><?php echo esc_html( wp_strip_all_tags( get_the_excerpt() ) ); ?></span>
						</a>
					</li>
				<?php endwhile; ?>
			</ul>
			<div class="pagination"><?php the_posts_pagination( array( 'prev_text' => '←', 'next_text' => '→' ) ); ?></div>
		<?php else : ?>
			<p class="lede"><?php ace360_e( ace360_pair( 'The first articles are on their way.', 'De eerste artikelen komen eraan.' ) ); ?></p>
		<?php endif; ?>
	</div>
</main>
<?php
get_footer();
