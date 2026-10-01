<?php
/**
 * Single page.
 *
 * @package ace360
 */

get_header();
?>
<main id="main" class="site-main page-shell">
	<?php
	while ( have_posts() ) :
		the_post();
		?>
		<article <?php post_class( 'wrap entry' ); ?>>
			<header class="page-head">
				<h1 class="display h1"><?php the_title(); ?></h1>
			</header>
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
