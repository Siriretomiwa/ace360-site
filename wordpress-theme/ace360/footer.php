<?php
/**
 * Site footer.
 *
 * @package ace360
 */

$ace360_email = ace360_mod( 'contact_email' );
$ace360_phone = ace360_mod( 'contact_phone' );
$ace360_kvk   = ace360_mod( 'kvk' );
$ace360_btw   = ace360_mod( 'btw' );
?>
<footer class="site-footer">
	<div class="footer-top">
		<div class="footer-col">
			<p class="label"><?php esc_html_e( 'Contact', 'ace360' ); ?></p>
			<p><a class="link-underline" href="<?php echo esc_url( 'mailto:' . $ace360_email ); ?>"><?php echo esc_html( $ace360_email ); ?></a></p>
			<?php if ( $ace360_phone ) : ?>
				<p><a class="link-underline" href="<?php echo esc_url( 'tel:' . preg_replace( '/[^0-9+]/', '', $ace360_phone ) ); ?>"><?php echo esc_html( $ace360_phone ); ?></a></p>
			<?php endif; ?>
			<p class="muted"><?php echo esc_html( ace360_mod( 'city' ) ); ?></p>
		</div>
		<div class="footer-col">
			<p class="label"><?php esc_html_e( 'Studio', 'ace360' ); ?></p>
			<?php
			if ( has_nav_menu( 'footer' ) ) {
				wp_nav_menu(
					array(
						'theme_location' => 'footer',
						'container'      => false,
						'menu_class'     => 'footer-menu',
						'depth'          => 1,
					)
				);
			} else {
				ace360_fallback_menu();
			}
			?>
		</div>
		<div class="footer-col">
			<p class="label"><?php esc_html_e( 'Business', 'ace360' ); ?></p>
			<?php if ( $ace360_kvk ) : ?>
				<p class="tabular">KvK <?php echo esc_html( $ace360_kvk ); ?></p>
			<?php endif; ?>
			<?php if ( $ace360_btw ) : ?>
				<p class="tabular">BTW <?php echo esc_html( $ace360_btw ); ?></p>
			<?php endif; ?>
			<p class="muted"><?php esc_html_e( 'Self-hosted fonts and scripts. No trackers on this site.', 'ace360' ); ?></p>
		</div>
	</div>
	<div class="footer-mark" aria-hidden="true">ace<b>360</b></div>
	<div class="footer-bottom">
		<p>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php echo esc_html( get_bloginfo( 'name' ) ); ?></p>
		<a class="to-top link-underline" href="#top"><?php esc_html_e( 'Back to top', 'ace360' ); ?> &uarr;</a>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
