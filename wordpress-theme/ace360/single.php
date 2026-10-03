<?php
/**
 * Single post or project. Posts use the article template (template-parts/post-article.php);
 * projects and other types get a simple page.
 *
 * @package ace360
 */

get_header();
?>
<main id="main" class="site-main<?php echo 'post' === get_post_type() ? ' post-main' : ' page-shell'; ?>">
	<?php
	while ( have_posts() ) :
		the_post();
		if ( 'post' === get_post_type() ) {
			get_template_part( 'template-parts/post-article', null, array( 'p' => ace360_post_data( get_post() ) ) );
			if ( comments_open() || get_comments_number() ) {
				echo '<div class="wrap">';
				comments_template();
				echo '</div>';
			}
			continue;
		}
		$ace360_type = 'ace_project' === get_post_type() ? get_post_meta( get_the_ID(), 'ace360_project_type', true ) : '';
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
		</article>
	<?php endwhile; ?>
</main>
<?php
get_footer();
