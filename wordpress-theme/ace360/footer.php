<?php
/**
 * Site footer.
 *
 * @package ace360
 */

$ace360_kvk = ace360_mod( 'kvk' );
$ace360_btw = ace360_mod( 'btw' );
?>
<footer class="site-footer">
	<div class="footer-inner">
		<div class="footer-brand">
			<?php echo ace360_wordmark(); // phpcs:ignore WordPress.Security.EscapeOutput -- static markup. ?>
			<p><?php ace360_e( ace360_pair( 'Websites, online stores and maintenance for businesses in the Netherlands and abroad. Fixed price, fixed launch date, one person to talk to.', 'Websites, webshops en onderhoud voor bedrijven in Nederland en daarbuiten. Vaste prijs, vaste lanceerdatum, één aanspreekpunt.' ) ); ?></p>
		</div>
		<div class="footer-col">
			<p class="label"><?php ace360_e( ace360_pair( 'Direct', 'Direct' ) ); ?></p>
			<ul>
				<li><a href="<?php echo esc_url( ace360_tel() ); ?>"><?php ace360_e( ace360_pair( 'Phone', 'Telefoon' ) ); ?> · <?php echo esc_html( ace360_mod( 'phone' ) ); ?></a></li>
				<li><a href="<?php echo esc_url( 'mailto:' . ace360_mod( 'email' ) ); ?>"><?php echo esc_html( ace360_mod( 'email' ) ); ?></a></li>
				<li><a href="<?php echo esc_url( ace360_wa() ); ?>" rel="noopener" target="_blank">WhatsApp</a></li>
				<li class="muted"><?php ace360_e( ace360_pair( ace360_mod( 'hours_en' ), ace360_mod( 'hours_nl' ) ) ); ?></li>
			</ul>
		</div>
		<div class="footer-col">
			<p class="label"><?php ace360_e( ace360_pair( 'Services', 'Diensten' ) ); ?></p>
			<ul>
				<?php foreach ( ace360_services() as $ace360_service ) : ?>
					<li><a href="<?php echo esc_url( ( is_front_page() ? '' : home_url( '/' ) ) . '#diensten' ); ?>"><?php ace360_e( $ace360_service['title'] ); ?></a></li>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>
	<div class="footer-bottom">
		<p>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> Ace 360 Services<?php echo $ace360_kvk ? ' · KvK ' . esc_html( $ace360_kvk ) : ''; ?><?php echo $ace360_btw ? ' · BTW ' . esc_html( $ace360_btw ) : ''; ?></p>
		<p><?php ace360_e( ace360_pair( 'Based in the Netherlands · working worldwide · no tracking cookies', 'Gevestigd in Nederland · werkt wereldwijd · geen trackingcookies' ) ); ?></p>
		<a class="to-top" href="#top"><?php ace360_e( ace360_pair( 'Back to top', 'Naar boven' ) ); ?> &uarr;</a>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
