<?php
/**
 * Front page: the animated studio landing page.
 *
 * @package ace360
 */

get_header();
?>
<main id="main" class="site-main">

	<?php get_template_part( 'template-parts/hero' ); ?>

	<div class="marquee" aria-hidden="true">
		<div class="marquee-track">
			<?php
			$ace360_words = array( 'Webdesign', 'WordPress', 'WooCommerce', '3D & motion', 'iDEAL', 'SEO', 'NL / EN', 'Hosting & care' );
			for ( $ace360_i = 0; $ace360_i < 2; $ace360_i++ ) :
				foreach ( $ace360_words as $ace360_word ) :
					?>
					<span><?php echo esc_html( $ace360_word ); ?></span><i class="marquee-tile"></i>
					<?php
				endforeach;
			endfor;
			?>
		</div>
	</div>

	<?php
	get_template_part( 'template-parts/services' );
	get_template_part( 'template-parts/work' );
	get_template_part( 'template-parts/process' );
	get_template_part( 'template-parts/dutch' );
	get_template_part( 'template-parts/contact' );
	?>

</main>
<?php
get_footer();
