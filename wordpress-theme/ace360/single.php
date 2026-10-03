<?php
/**
 * Single post or project. Posts get category, date and reading time, a call-to-action that points
 * to their service page (inc/blog.php) and three more posts in the same language.
 *
 * @package ace360
 */

get_header();
?>
<main id="main" class="site-main page-shell">
	<?php
	while ( have_posts() ) :
		the_post();
		$ace360_is_post = 'post' === get_post_type();
		$ace360_type    = 'ace_project' === get_post_type() ? get_post_meta( get_the_ID(), 'ace360_project_type', true ) : '';
		$ace360_lang    = ace360_lang();
		?>
		<article <?php post_class( 'wrap entry' ); ?>>
			<header class="page-head">
				<?php if ( $ace360_is_post ) : ?>
					<nav class="crumbs mono" aria-label="<?php echo esc_attr( 'en' === $ace360_lang ? 'Breadcrumb' : 'Kruimelpad' ); ?>">
						<a href="<?php echo esc_url( ace360_url( '/' ) ); ?>">Ace 360</a> <span aria-hidden="true">/</span> <a href="<?php echo esc_url( ace360_blog_url() ); ?>">Blog</a>
					</nav>
					<?php $ace360_cat = get_the_category(); ?>
					<p class="eyebrow"><?php echo esc_html( ( $ace360_cat ? $ace360_cat[0]->name . ' · ' : '' ) . ace360_post_date() . ' · ' . ace360_reading_minutes() . ( 'en' === $ace360_lang ? ' min read' : ' min lezen' ) ); ?></p>
				<?php elseif ( $ace360_type ) : ?>
					<p class="eyebrow"><?php echo esc_html( $ace360_type ); ?></p>
				<?php endif; ?>
				<h1 class="display h1"><?php the_title(); ?></h1>
				<?php if ( $ace360_is_post && has_excerpt() ) : ?>
					<p class="lede"><?php echo esc_html( get_the_excerpt() ); ?></p>
				<?php endif; ?>
			</header>
			<?php if ( has_post_thumbnail() ) : ?>
				<figure class="entry-media"><?php the_post_thumbnail( 'full', array( 'alt' => '' ) ); ?></figure>
			<?php endif; ?>
			<div class="entry-content prose">
				<?php
				the_content();
				wp_link_pages();
				?>
			</div>

			<?php
			if ( $ace360_is_post ) :
				$ace360_svc = get_post_meta( get_the_ID(), 'ace360_post_service', true );
				$ace360_svc = ( $ace360_svc && isset( ace360_landings()[ $ace360_svc ] ) ) ? $ace360_svc : 'kosten';
				$ace360_sl  = ace360_landings()[ $ace360_svc ];
				?>
				<aside class="post-cta">
					<p class="kicker"><?php ace360_e( ace360_pair( 'Ace 360 Services', 'Ace 360 Services' ) ); ?></p>
					<p class="post-cta-title"><?php echo esc_html( wp_strip_all_tags( str_replace( '*', '', $ace360_sl['h1'][ $ace360_lang ] ) ) ); ?></p>
					<p><?php echo esc_html( $ace360_sl['desc'][ $ace360_lang ] ); ?></p>
					<div class="actions">
						<a class="btn btn-orange" href="<?php echo esc_url( ace360_landing_url( $ace360_svc ) . ( in_array( 'estimator', ace360_landing_blocks( $ace360_svc ), true ) ? '#prijs' : '' ) ); ?>"><?php ace360_e( ace360_pair( 'See an estimate', 'Bekijk een prijsindicatie' ) ); ?> <span aria-hidden="true">→</span></a>
						<a class="btn btn-line" href="<?php echo esc_url( ace360_landing_url( 'contact' ) ); ?>"><?php ace360_e( ace360_pair( 'Book a free call', 'Plan een gratis gesprek' ) ); ?></a>
					</div>
				</aside>
				<?php
				$ace360_more = get_posts(
					array(
						'post_type'      => 'post',
						'posts_per_page' => 3,
						'post__not_in'   => array( get_the_ID() ),
						'meta_query'     => 'en' === $ace360_lang
							? array( array( 'key' => 'ace360_post_lang', 'value' => 'en' ) )
							: array( 'relation' => 'OR', array( 'key' => 'ace360_post_lang', 'compare' => 'NOT EXISTS' ), array( 'key' => 'ace360_post_lang', 'value' => 'en', 'compare' => '!=' ) ), // phpcs:ignore WordPress.DB.SlowDBQuery
						'category__in'   => wp_list_pluck( get_the_category(), 'term_id' ),
					)
				);
				if ( $ace360_more ) :
					?>
					<nav class="post-more" aria-label="<?php echo esc_attr( 'en' === $ace360_lang ? 'More articles' : 'Meer artikelen' ); ?>">
						<p class="mono"><?php ace360_e( ace360_pair( 'Read next', 'Lees ook' ) ); ?></p>
						<ul>
							<?php foreach ( $ace360_more as $ace360_m ) : ?>
								<li><a class="arrow-link" href="<?php echo esc_url( get_permalink( $ace360_m ) ); ?>"><?php echo esc_html( get_the_title( $ace360_m ) ); ?> <span aria-hidden="true">→</span></a></li>
							<?php endforeach; ?>
						</ul>
					</nav>
				<?php endif; ?>
			<?php endif; ?>

			<?php
			if ( comments_open() || get_comments_number() ) {
				comments_template();
			}
			?>
		</article>
	<?php endwhile; ?>
</main>
<?php
get_footer();
