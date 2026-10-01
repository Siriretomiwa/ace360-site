<?php
/**
 * Site header.
 *
 * @package ace360
 */

?><!doctype html>
<html <?php language_attributes(); ?> class="no-js">
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>document.documentElement.className = document.documentElement.className.replace('no-js', 'js');</script>
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main"><?php esc_html_e( 'Skip to content', 'ace360' ); ?></a>
<div class="scroll-progress" aria-hidden="true"><span></span></div>

<header class="site-header" id="top" data-header>
	<div class="header-inner">
		<a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
			<?php
			if ( has_custom_logo() ) {
				$logo_id = get_theme_mod( 'custom_logo' );
				echo wp_get_attachment_image( $logo_id, 'full', false, array( 'class' => 'custom-logo', 'alt' => get_bloginfo( 'name' ) ) );
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
		</nav>

		<a class="nav-cta" href="<?php echo esc_url( is_front_page() ? '#contact' : home_url( '/#contact' ) ); ?>">
			<span><?php echo esc_html( ace360_mod( 'cta_label' ) ); ?></span>
		</a>

		<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
			<span class="screen-reader-text"><?php esc_html_e( 'Menu', 'ace360' ); ?></span>
			<span class="nav-toggle-bars" aria-hidden="true"></span>
		</button>
	</div>
</header>
