<?php
/**
 * Site header: wordmark, section links, EN/NL switch, phone and call button.
 *
 * @package ace360
 */

?><!doctype html>
<html <?php language_attributes(); ?> class="no-js">
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>
/* Pick the language and day/night theme before first paint. Language: ?lang= → saved choice → Dutch. */
(function (d) {
	var l = null;
	try { l = new URLSearchParams(location.search).get('lang'); } catch (e) {}
	if (l !== 'nl' && l !== 'en') { try { l = localStorage.getItem('ace360-lang'); } catch (e) {} }
	if (l !== 'nl' && l !== 'en') { l = 'nl'; }
	d.setAttribute('data-lang', l);
	d.setAttribute('lang', l);
	d.className = d.className.replace('no-js', 'js');
	/* Evening (night) first, like a lamp-lit desk; ?theme=day or the switch for daylight. */
	var t = null;
	try { t = new URLSearchParams(location.search).get('theme'); } catch (e) {}
	if (t !== 'night' && t !== 'day') { try { t = localStorage.getItem('ace360-theme'); } catch (e) {} }
	d.setAttribute('data-theme', t === 'day' ? 'day' : 'night');
})(document.documentElement);
</script>
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main"><?php ace360_e( ace360_pair( 'Skip to content', 'Naar de inhoud' ) ); ?></a>
<div class="scroll-progress" aria-hidden="true"><span></span></div>

<header class="site-header" id="top" data-header>
	<div class="header-inner">
		<a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
			<?php
			if ( has_custom_logo() ) {
				echo wp_get_attachment_image( get_theme_mod( 'custom_logo' ), 'full', false, array( 'class' => 'custom-logo', 'alt' => get_bloginfo( 'name' ) ) );
			} else {
				echo ace360_wordmark(); // phpcs:ignore WordPress.Security.EscapeOutput -- static markup.
			}
			?>
		</a>

		<nav class="primary-nav" id="primary-nav" aria-label="<?php esc_attr_e( 'Primary', 'ace360' ); ?>">
			<?php
			if ( has_nav_menu( 'primary' ) ) {
				wp_nav_menu(
					array(
						'theme_location' => 'primary',
						'container'      => false,
						'menu_class'     => 'menu',
						'depth'          => 1,
					)
				);
			} else {
				ace360_fallback_menu();
			}
			?>
			<a class="nav-phone" href="<?php echo esc_url( ace360_tel() ); ?>"><?php echo esc_html( ace360_mod( 'phone' ) ); ?></a>
		</nav>

		<div class="lang-switch" role="group" aria-label="Language / Taal">
			<button type="button" data-set-lang="nl" aria-pressed="true">NL</button>
			<button type="button" data-set-lang="en" aria-pressed="false">EN</button>
		</div>

		<button class="theme-switch" type="button" data-theme-toggle aria-pressed="false">
			<span class="screen-reader-text"><?php ace360_e( ace360_pair( 'Night mode', 'Nachtmodus' ) ); ?></span>
			<span class="theme-knob" aria-hidden="true">
				<svg class="ico-sun" viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></g></svg>
				<svg class="ico-moon" viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M20.2 14.6A8.5 8.5 0 0 1 9.4 3.8a8.5 8.5 0 1 0 10.8 10.8z"/></svg>
			</span>
		</button>

		<a class="btn btn-orange btn-small" href="<?php echo esc_url( ace360_tel() ); ?>"><?php ace360_e( ace360_pair( 'Call now', 'Bel nu' ) ); ?></a>

		<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
			<span class="screen-reader-text">Menu</span>
			<span class="nav-toggle-bars" aria-hidden="true"></span>
		</button>
	</div>
</header>
<a class="btn btn-orange fab-call" href="<?php echo esc_url( ace360_tel() ); ?>"><?php ace360_e( ace360_pair( 'Call now', 'Bel nu' ) ); ?></a>
