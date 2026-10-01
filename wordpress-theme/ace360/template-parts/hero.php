<?php
/**
 * Hero with the three.js Delft-tile ring.
 *
 * @package ace360
 */

?>
<section class="hero" data-hero>
	<canvas class="hero-canvas" data-hero-canvas aria-hidden="true"></canvas>
	<div class="hero-copy wrap">
		<p class="eyebrow hero-eyebrow"><span class="tile-dot" aria-hidden="true"></span><?php echo esc_html( ace360_mod( 'hero_eyebrow' ) ); ?></p>
		<h1 class="display hero-title" data-reveal-lines>
			<?php echo ace360_headline( ace360_mod( 'hero_title' ) ); // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helper. ?>
		</h1>
		<div class="hero-bottom">
			<p class="lede hero-text"><?php echo esc_html( ace360_mod( 'hero_text' ) ); ?></p>
			<div class="hero-actions">
				<a class="btn magnetic" href="#contact"><span><?php echo esc_html( ace360_mod( 'cta_label' ) ); ?></span><span class="btn-arrow" aria-hidden="true">&rarr;</span></a>
				<a class="btn btn-ghost magnetic" href="#process"><span><?php esc_html_e( 'How we work', 'ace360' ); ?></span></a>
			</div>
		</div>
	</div>
	<ul class="hero-facts wrap" aria-label="<?php esc_attr_e( 'Standard on every site', 'ace360' ); ?>">
		<li><b>NL / EN</b><span><?php esc_html_e( 'Bilingual by default', 'ace360' ); ?></span></li>
		<li><b>iDEAL</b><span><?php esc_html_e( 'Checkout via Mollie', 'ace360' ); ?></span></li>
		<li><b>WCAG 2.2 AA</b><span><?php esc_html_e( 'Accessibility target', 'ace360' ); ?></span></li>
		<li><b>&lt; 2.5 s</b><span><?php esc_html_e( 'LCP target on 4G', 'ace360' ); ?></span></li>
	</ul>
</section>
