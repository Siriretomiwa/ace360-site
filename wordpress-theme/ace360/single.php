<?php
/**
 * Single post or project.
 *
 * @package ace360
 */

get_header();
?>
<main id="main" class="site-main page-shell">
	<?php
	while ( have_posts() ) :
		the_post();
		$ace360_type = 'ace_project' === get_post_type() ? get_post_meta( get_the_ID(), 'ace360_project_type', true ) : get_the_date();
		?>
		<article <?php post_class( 'wrap entry' ); ?>>
			<header class="page-head">
				<?php if ( $ace360_type ) : ?>
					<p class="eyebrow"><?php echo esc_html( $ace360_type ); ?></p>
				<?php endif; ?>
				<h1 class="display h1"><?php the_title(); ?></h1>
			</header>
			<?php if ( has_post_thumbnail() ) : ?>
				<figure class="entry-media"><?php the_post_thumbnail( 'full' ); ?></figure>
			<?php endif; ?>
			<div class="entry-content prose">
				<?php
				the_content();
				wp_link_pages();
				?>
			</div>
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
