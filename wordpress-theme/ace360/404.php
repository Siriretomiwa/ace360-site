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
		<h1 class="display h1"><?php echo ace360_headline( __( "This tile\nis *missing.*", 'ace360' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h1>
		<p class="lede"><?php esc_html_e( 'The page you were looking for has moved or never existed.', 'ace360' ); ?></p>
		<p><a class="btn" href="<?php echo esc_url( home_url( '/' ) ); ?>"><span><?php esc_html_e( 'Back to home', 'ace360' ); ?></span></a></p>
	</div>
</main>
<?php
get_footer();
