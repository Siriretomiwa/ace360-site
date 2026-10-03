<?php
/**
 * Search engines: page titles and descriptions, canonical and hreflang links, social sharing tags,
 * structured data (JSON-LD) and the landing pages in the XML sitemap (/wp-sitemap.xml).
 *
 * The theme does this itself, so no SEO plugin is needed. If Yoast, Rank Math, AIOSEO or SEOPress
 * is active, the theme leaves titles, descriptions, canonical and social tags to the plugin and
 * only adds hreflang and the business structured data.
 *
 * @package ace360
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Is an SEO plugin handling the head?
 *
 * @return bool
 */
function ace360_seo_plugin() {
	return defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) || defined( 'AIOSEO_VERSION' ) || defined( 'SEOPRESS_VERSION' );
}

/**
 * Title, description and URLs for the current page.
 *
 * @return array{title:string,desc:string,url:string,alts:array,type:string}
 */
function ace360_seo_meta() {
	$lang = ace360_lang();
	$en   = 'en' === $lang;
	$m    = array(
		'title' => '',
		'desc'  => '',
		'url'   => '',
		'alts'  => array(),
		'type'  => 'website',
	);
	$key = ace360_current_landing();
	if ( $key ) {
		$l          = ace360_landings()[ $key ];
		$m['title'] = $l['title'][ $lang ] . ' | Ace 360';
		$m['desc']  = $l['desc'][ $lang ];
		$m['type']  = 'article';
	} elseif ( is_front_page() ) {
		$m['title'] = $en ? 'Ace 360 Services · Websites with an estimate up front' : 'Ace 360 Services · Websites en webshops met prijs vooraf';
		$m['desc']  = $en
			? 'Websites, online stores and maintenance in the Netherlands, in English or Dutch. See an estimate online, a fixed launch date, one person to talk to.'
			: 'Website of webshop laten maken? Bekijk online je prijsindicatie, krijg een vaste lanceerdatum en één aanspreekpunt. In het Nederlands of Engels.';
	} elseif ( is_post_type_archive( 'ace_project' ) ) {
		$m['title'] = $en ? 'Portfolio: websites and online stores | Ace 360 Services' : 'Portfolio: websites en webshops | Ace 360 Services';
		$m['desc']  = $en
			? 'Websites, online stores and booking sites for shops, salons, restaurants, charities and platforms. Filter by sector and open any project.'
			: 'Websites, webshops en boekingssites voor winkels, salons, restaurants, goede doelen en platforms. Filter op sector en bekijk elk project van dichtbij.';
	} elseif ( is_singular() ) {
		$post       = get_queried_object();
		$m['desc']  = $post ? wp_trim_words( wp_strip_all_tags( has_excerpt( $post ) ? get_the_excerpt( $post ) : strip_shortcodes( $post->post_content ) ), 28, '…' ) : '';
		$m['url']   = wp_get_canonical_url();
		$m['type']  = 'article';
		return $m;
	} else {
		return $m;
	}
	$m['url']  = ace360_alt_url( $lang );
	$m['alts'] = array(
		'nl' => ace360_alt_url( 'nl' ),
		'en' => ace360_alt_url( 'en' ),
	);
	return $m;
}

/**
 * <title>.
 *
 * @param string $title Title from WordPress.
 * @return string
 */
function ace360_seo_title( $title ) {
	if ( ace360_seo_plugin() ) {
		return $title;
	}
	$m = ace360_seo_meta();
	return $m['title'] ? $m['title'] : $title;
}
add_filter( 'pre_get_document_title', 'ace360_seo_title', 20 );

/**
 * The theme prints its own canonical (WordPress would point /en/ at the Dutch front page).
 */
function ace360_seo_setup_head() {
	remove_action( 'wp_head', 'rel_canonical' );
}
add_action( 'wp', 'ace360_seo_setup_head' );

/**
 * Robots: keep thank-you, cancel and search URLs out of the index.
 *
 * @param array $robots Robots directives.
 * @return array
 */
function ace360_seo_robots( $robots ) {
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- display flags only.
	if ( isset( $_GET['ace360_sent'] ) || isset( $_GET['ace360_call'] ) || is_search() || is_404() ) {
		$robots['noindex'] = true;
		$robots['follow']  = true;
	}
	return $robots;
}
add_filter( 'wp_robots', 'ace360_seo_robots' );

/**
 * Head tags.
 */
function ace360_seo_head() {
	$m      = ace360_seo_meta();
	$plugin = ace360_seo_plugin();
	$lang   = ace360_lang();
	$out    = array();

	if ( ! $plugin ) {
		if ( $m['desc'] ) {
			$out[] = '<meta name="description" content="' . esc_attr( $m['desc'] ) . '">';
		}
		if ( $m['url'] ) {
			$out[] = '<link rel="canonical" href="' . esc_url( $m['url'] ) . '">';
		}
	}
	// hreflang: the same page in Dutch and English, Dutch as the default.
	if ( ! empty( $m['alts']['nl'] ) && ! empty( $m['alts']['en'] ) ) {
		$out[] = '<link rel="alternate" hreflang="nl" href="' . esc_url( $m['alts']['nl'] ) . '">';
		$out[] = '<link rel="alternate" hreflang="en" href="' . esc_url( $m['alts']['en'] ) . '">';
		$out[] = '<link rel="alternate" hreflang="x-default" href="' . esc_url( $m['alts']['nl'] ) . '">';
	}
	if ( ! $plugin ) {
		$title = $m['title'] ? $m['title'] : wp_get_document_title();
		$image = ace360_seo_image();
		$out[] = '<meta property="og:site_name" content="Ace 360 Services">';
		$out[] = '<meta property="og:type" content="' . esc_attr( $m['type'] ) . '">';
		$out[] = '<meta property="og:title" content="' . esc_attr( $title ) . '">';
		if ( $m['desc'] ) {
			$out[] = '<meta property="og:description" content="' . esc_attr( $m['desc'] ) . '">';
		}
		if ( $m['url'] ) {
			$out[] = '<meta property="og:url" content="' . esc_url( $m['url'] ) . '">';
		}
		$out[] = '<meta property="og:locale" content="' . ( 'en' === $lang ? 'en_GB' : 'nl_NL' ) . '">';
		$out[] = '<meta property="og:locale:alternate" content="' . ( 'en' === $lang ? 'nl_NL' : 'en_GB' ) . '">';
		$out[] = '<meta property="og:image" content="' . esc_url( $image ) . '">';
		$out[] = '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">';
		$out[] = '<meta property="og:image:alt" content="' . esc_attr( 'en' === $lang ? 'Ace 360 Services: websites, online stores and maintenance' : 'Ace 360 Services: websites, webshops en onderhoud' ) . '">';
		$out[] = '<meta name="twitter:card" content="summary_large_image">';
	}
	foreach ( array( 'gsc' => 'google-site-verification', 'bing' => 'msvalidate.01' ) as $k => $name ) {
		$v = ace360_mod( $k );
		if ( $v ) {
			$out[] = '<meta name="' . esc_attr( $name ) . '" content="' . esc_attr( $v ) . '">';
		}
	}
	$out[] = '<meta name="theme-color" content="#0d0a08">';
	echo implode( "\n", $out ) . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped above.

	$graph = ace360_seo_graph( $m );
	if ( $graph ) {
		echo '<script type="application/ld+json">' . wp_json_encode( array( '@context' => 'https://schema.org', '@graph' => $graph ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . "</script>\n";
	}
}
add_action( 'wp_head', 'ace360_seo_head', 2 );

/**
 * Social sharing image: the featured image on posts and projects, otherwise the theme's own.
 *
 * @return string
 */
function ace360_seo_image() {
	if ( is_singular() && has_post_thumbnail() ) {
		$src = wp_get_attachment_image_src( get_post_thumbnail_id(), 'large' );
		if ( $src ) {
			return $src[0];
		}
	}
	return get_template_directory_uri() . '/assets/img/og-image.jpg';
}

/**
 * Structured data for the current page.
 *
 * @param array $m From ace360_seo_meta().
 * @return array
 */
function ace360_seo_graph( $m ) {
	$lang  = ace360_lang();
	$en    = 'en' === $lang;
	$home  = ace360_url( '/', 'nl' );
	$biz   = $home . '#business';
	$graph = array();

	// The business, on every page.
	$address = array(
		'@type'          => 'PostalAddress',
		'addressCountry' => 'NL',
	);
	foreach ( array( 'street' => 'streetAddress', 'postcode' => 'postalCode', 'city' => 'addressLocality' ) as $k => $prop ) {
		if ( ace360_mod( $k ) ) {
			$address[ $prop ] = ace360_mod( $k );
		}
	}
	$same = array_values( array_filter( array_map( 'ace360_mod', array( 'instagram', 'youtube', 'tiktok', 'linkedin', 'facebook' ) ) ) );
	$offers = array();
	foreach ( array( 'onepage', 'website', 'webshop', 'onderhoud', 'boeken', 'seo' ) as $k ) {
		$offers[] = array(
			'@type'       => 'Offer',
			'itemOffered' => array(
				'@type' => 'Service',
				'name'  => wp_strip_all_tags( str_replace( '*', '', ace360_landings()[ $k ]['kicker'][ $lang ] ) ),
				'url'   => ace360_landing_url( $k, $lang ),
			),
		);
	}
	$business = array(
		'@type'              => 'ProfessionalService',
		'@id'                => $biz,
		'name'               => 'Ace 360 Services',
		'url'                => $home,
		'logo'               => get_template_directory_uri() . '/assets/img/logo-512.png',
		'image'              => get_template_directory_uri() . '/assets/img/og-image.jpg',
		'description'        => $en ? 'Websites, online stores and website maintenance for businesses in the Netherlands and abroad, in English or Dutch.' : 'Websites, webshops en website onderhoud voor bedrijven in Nederland en daarbuiten, in het Nederlands of Engels.',
		'email'              => ace360_mod( 'email' ),
		'telephone'          => preg_replace( '/[^0-9+]/', '', ace360_mod( 'phone' ) ),
		'priceRange'         => '€€',
		'currenciesAccepted' => 'EUR',
		'address'            => $address,
		'areaServed'         => array(
			array( '@type' => 'Country', 'name' => 'Netherlands' ),
			array( '@type' => 'Place', 'name' => 'Europe' ),
		),
		'knowsLanguage'      => array( 'nl', 'en' ),
		'contactPoint'       => array(
			'@type'             => 'ContactPoint',
			'contactType'       => 'sales',
			'telephone'         => preg_replace( '/[^0-9+]/', '', ace360_mod( 'phone' ) ),
			'email'             => ace360_mod( 'email' ),
			'availableLanguage' => array( 'Dutch', 'English' ),
		),
		'hasOfferCatalog'    => array(
			'@type'           => 'OfferCatalog',
			'name'            => $en ? 'Services' : 'Diensten',
			'itemListElement' => $offers,
		),
	);
	if ( ace360_mod( 'kvk' ) ) {
		$business['identifier'] = array(
			'@type'      => 'PropertyValue',
			'propertyID' => 'KvK',
			'value'      => ace360_mod( 'kvk' ),
		);
	}
	if ( ace360_mod( 'btw' ) ) {
		$business['vatID'] = ace360_mod( 'btw' );
	}
	if ( $same ) {
		$business['sameAs'] = $same;
	}
	$graph[] = $business;
	$graph[] = array(
		'@type'      => 'WebSite',
		'@id'        => $home . '#website',
		'url'        => $home,
		'name'       => 'Ace 360 Services',
		'inLanguage' => array( 'nl-NL', 'en' ),
		'publisher'  => array( '@id' => $biz ),
	);

	if ( ! $m['url'] || is_singular() ) {
		return $graph;
	}

	$page = array(
		'@type'      => 'WebPage',
		'@id'        => $m['url'] . '#webpage',
		'url'        => $m['url'],
		'name'       => $m['title'],
		'description' => $m['desc'],
		'inLanguage' => $en ? 'en' : 'nl-NL',
		'isPartOf'   => array( '@id' => $home . '#website' ),
		'about'      => array( '@id' => $biz ),
	);

	$key = ace360_current_landing();
	$faq = array();
	if ( $key ) {
		$l     = ace360_landings()[ $key ];
		$faq   = $l['faq'];
		$page['breadcrumb'] = array( '@id' => $m['url'] . '#breadcrumb' );
		$graph[] = array(
			'@type'           => 'BreadcrumbList',
			'@id'             => $m['url'] . '#breadcrumb',
			'itemListElement' => array(
				array( '@type' => 'ListItem', 'position' => 1, 'name' => 'Ace 360 Services', 'item' => ace360_url( '/' ) ),
				array( '@type' => 'ListItem', 'position' => 2, 'name' => wp_strip_all_tags( $l['kicker'][ $lang ] ), 'item' => $m['url'] ),
			),
		);
		if ( $l['service'] ) {
			$service = array(
				'@type'       => 'Service',
				'@id'         => $m['url'] . '#service',
				'name'        => wp_strip_all_tags( str_replace( '*', '', $l['h1'][ $lang ] ) ),
				'serviceType' => $l['service'],
				'description' => $l['desc'][ $lang ],
				'url'         => $m['url'],
				'provider'    => array( '@id' => $biz ),
				'areaServed'  => array( '@type' => 'Country', 'name' => 'Netherlands' ),
			);
			if ( ! empty( $l['price'] ) ) {
				$service['offers'] = array(
					'@type'              => 'Offer',
					'priceCurrency'      => 'EUR',
					'price'              => $l['price'][0],
					'priceSpecification' => array(
						'@type'                 => 'PriceSpecification',
						'priceCurrency'         => 'EUR',
						'minPrice'              => $l['price'][0],
						'maxPrice'              => $l['price'][1],
						'valueAddedTaxIncluded' => false,
					),
					'description'        => $en ? 'Estimate; the final price is agreed in writing after a short call.' : 'Prijsindicatie; de definitieve prijs volgt schriftelijk na een kort gesprek.',
				);
				if ( ! empty( $l['monthly'] ) ) {
					$service['offers']['priceSpecification']['@type']         = 'UnitPriceSpecification';
					$service['offers']['priceSpecification']['unitCode']      = 'MON';
					$service['offers']['priceSpecification']['referenceQuantity'] = array( '@type' => 'QuantitativeValue', 'value' => 1, 'unitCode' => 'MON' );
				}
			}
			$graph[]          = $service;
			$page['mainEntity'] = array( '@id' => $m['url'] . '#service' );
		}
	} elseif ( is_front_page() ) {
		$faq = ace360_faq();
	}

	if ( $faq ) {
		$page['@type'] = array( 'WebPage', 'FAQPage' );
		unset( $page['mainEntity'] );
		$page['mainEntity'] = array_map(
			function ( $q ) use ( $lang ) {
				return array(
					'@type'          => 'Question',
					'name'           => $q[0][ $lang ],
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => $q[1][ $lang ],
					),
				);
			},
			$faq
		);
	}
	$graph[] = $page;
	return $graph;
}

/**
 * Sitemap: the front page and All work in both languages, and every landing page in both languages.
 * Registered with WordPress core sitemaps (/wp-sitemap.xml); the author sitemap is left out.
 */
function ace360_seo_sitemaps() {
	if ( ! class_exists( 'WP_Sitemaps_Provider' ) ) {
		return;
	}
	require_once get_template_directory() . '/inc/sitemap-provider.php';
	wp_register_sitemap_provider( 'acepages', new Ace360_Sitemap_Provider() );
}
add_action( 'init', 'ace360_seo_sitemaps' );

/**
 * Leave the author sitemap out (a one-person site has nothing useful there).
 *
 * @param WP_Sitemaps_Provider $provider Provider.
 * @param string               $name     Name.
 * @return WP_Sitemaps_Provider|false
 */
function ace360_seo_sitemap_users( $provider, $name ) {
	return 'users' === $name ? false : $provider;
}
add_filter( 'wp_sitemaps_add_provider', 'ace360_seo_sitemap_users', 10, 2 );

/**
 * Leave the static front page out of the pages sitemap; the theme sitemap lists it in both languages.
 *
 * @param array $args Query args.
 * @return array
 */
function ace360_seo_sitemap_pages( $args ) {
	if ( 'page' === get_option( 'show_on_front' ) && get_option( 'page_on_front' ) ) {
		$args['post__not_in'] = array_merge( isset( $args['post__not_in'] ) ? (array) $args['post__not_in'] : array(), array( (int) get_option( 'page_on_front' ) ) );
	}
	return $args;
}
add_filter( 'wp_sitemaps_posts_query_args', 'ace360_seo_sitemap_pages' );
