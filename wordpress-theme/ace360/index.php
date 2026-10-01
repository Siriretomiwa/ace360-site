<?php
/**
 * Blog index, archives and search results.
 *
 * @package ace360
 */

get_header();
?>
<main id="main" class="site-main page-shell">
	<div class="wrap">
		<header class="page-head">
			<p class="eyebrow"><?php echo esc_html( is_search() ? __( 'Search', 'ace360' ) : __( 'Journal', 'ace360' ) ); ?></p>
			<h1 class="display h1">
				<?php
				if ( is_search() ) {
					/* translators: %s: search query */
					printf( esc_html__( 'Results for “%s”', 'ace360' ), esc_html( get_search_query() ) );
				} elseif ( is_archive() ) {
					echo esc_html( wp_strip_all_tags( get_the_archive_title() ) );
				} else {
					echo esc_html( single_post_title( '', false ) ? single_post_title( '', false ) : __( 'Journal', 'ace360' ) );
				}
				?>
			</h1>
		</header>

		<?php if ( have_posts() ) : ?>
			<ul class="post-list">
				<?php
				while ( have_posts() ) :
					the_post();
					?>
					<li <?php post_class( 'post-item' ); ?>>
						<a href="<?php the_permalink(); ?>">
							<p class="label tabular"><?php echo esc_html( get_the_date() ); ?></p>
							<h2><?php the_title(); ?></h2>
							<p class="muted"><?php echo esc_html( wp_strip_all_tags( get_the_excerpt() ) ); ?></p>
						</a>
					</li>
				<?php endwhile; ?>
			</ul>
			<div class="pagination"><?php the_posts_pagination(); ?></div>
		<?php else : ?>
			<p class="lede"><?php esc_html_e( 'Nothing here yet.', 'ace360' ); ?></p>
		<?php endif; ?>
	</div>
</main>
<?php
get_footer();
