<?php
/**
 * Not found.
 *
 * @package ace360
 */

get_header();
?>
<main id="main" class="site-main page-shell">
	<div class="wrap page-head">
		<p class="eyebrow">404</p>
		<h1><?php ace360_e( ace360_pair( 'This page does not exist.', 'Deze pagina bestaat niet.' ) ); ?></h1>
		<p class="lede"><?php ace360_e( ace360_pair( 'It may have moved, or the link was mistyped.', 'Misschien is hij verplaatst, of is de link verkeerd getypt.' ) ); ?></p>
		<p><a class="btn" href="<?php echo esc_url( ace360_url( '/' ) ); ?>"><?php ace360_e( ace360_pair( 'Back to home', 'Terug naar home' ) ); ?></a></p>
	</div>
</main>
<?php
get_footer();
