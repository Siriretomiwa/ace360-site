<?php
/**
 * Sitemap of the theme's own pages (/wp-sitemap-acepages-1.xml; letters only, WordPress requires it): front page, All work and every
 * landing page, each in Dutch and English. Loaded by ace360_seo_sitemaps() in inc/seo.php.
 *
 * @package ace360
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Theme pages provider.
 */
class Ace360_Sitemap_Provider extends WP_Sitemaps_Provider {

	/**
	 * Set name and object type.
	 */
	public function __construct() {
		$this->name        = 'acepages';
		$this->object_type = 'acepages';
	}

	/**
	 * URLs.
	 *
	 * @param int    $page_num Page number.
	 * @param string $object_subtype Unused.
	 * @return array
	 */
	public function get_url_list( $page_num, $object_subtype = '' ) {
		$urls = array();
		foreach ( array( 'nl', 'en' ) as $lang ) {
			$urls[] = array( 'loc' => ace360_url( '/', $lang ) );
			$urls[] = array( 'loc' => ace360_url( '/work/', $lang ) );
			foreach ( array_keys( ace360_landings() ) as $key ) {
				$urls[] = array( 'loc' => ace360_landing_url( $key, $lang ) );
			}
		}
		return $urls;
	}

	/**
	 * One page is enough.
	 *
	 * @param string $object_subtype Unused.
	 * @return int
	 */
	public function get_max_num_pages( $object_subtype = '' ) {
		return 1;
	}
}
