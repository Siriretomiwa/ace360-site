<?php
/**
 * A browser window showing a project.
 *
 * $args: 'mockup' (hesed | sidwalk | crea8or), 'image' (screenshot URL, overrides
 * the mockup), 'url' (shown in the address bar), 'title', 'class'.
 * Built-in mockups are plain HTML scaled with container query units, so they stay
 * sharp at any size. The page inside scrolls on hover, like a real visit.
 *
 * @package ace360
 */

$ace360_m     = isset( $args['mockup'] ) ? $args['mockup'] : '';
$ace360_img   = isset( $args['image'] ) ? $args['image'] : '';
$ace360_title = isset( $args['title'] ) ? $args['title'] : '';
$ace360_host  = ! empty( $args['url'] ) ? wp_parse_url( $args['url'], PHP_URL_HOST ) : strtolower( preg_replace( '/[^a-z0-9]+/i', '', $ace360_title ) ) . '.com';
$ace360_cls   = isset( $args['class'] ) ? ' ' . $args['class'] : '';
?>
<div class="browser<?php echo esc_attr( $ace360_cls ); ?>">
	<div class="browser-bar" aria-hidden="true">
		<span class="dots"><i></i><i></i><i></i></span>
		<span class="addr"><svg viewBox="0 0 12 12" width="9" height="9"><path d="M3.5 5V3.8a2.5 2.5 0 015 0V5M2.5 5h7v5h-7z" fill="none" stroke="currentColor" stroke-width="1.3"/></svg><?php echo esc_html( $ace360_host ); ?></span>
	</div>
	<div class="browser-view">
		<?php if ( $ace360_img ) : ?>
			<div class="mock-page"><img src="<?php echo esc_url( $ace360_img ); ?>" alt="<?php echo esc_attr( $ace360_title ); ?>" loading="lazy"></div>
		<?php elseif ( 'hesed' === $ace360_m ) : ?>
			<div class="mock-page mk-hesed" aria-hidden="true">
				<div class="mk-nav"><b>Hesed<span>Impact Ministries</span></b><i>Events</i><i>Media</i><i>About</i><em>Give</em></div>
				<div class="mk-hero"><small>Sunday 10:30 · All welcome</small><h4>A church that shows up for its city.</h4><span class="mk-btn">Plan a visit</span><span class="mk-btn ghost">Watch online</span></div>
				<div class="mk-sec"><h5>Upcoming events</h5>
					<div class="mk-ev"><b>SUN<br>14</b><p>Sunday service<small>10:30 · Main hall</small></p><i>RSVP</i></div>
					<div class="mk-ev"><b>WED<br>17</b><p>Bible study<small>19:30 · Online & on site</small></p><i>RSVP</i></div>
					<div class="mk-ev"><b>SAT<br>20</b><p>Community meal<small>17:00 · Family hall</small></p><i>RSVP</i></div>
				</div>
				<div class="mk-sec"><h5>Media archive</h5><div class="mk-media"><span><i></i>Hope that holds</span><span><i></i>Faith at work</span><span><i></i>Rooted</span></div></div>
				<div class="mk-give"><h5>Support the mission</h5><div><span>€10</span><span class="on">€25</span><span>€50</span><span>Other</span></div><p><span class="mk-btn">Give with iDEAL</span><small>Monthly · One-off</small></p></div>
			</div>
		<?php elseif ( 'sidwalk' === $ace360_m ) : ?>
			<div class="mock-page mk-sid" aria-hidden="true">
				<div class="mk-nav"><b>SIDWALK</b><i>Shop</i><i>Drop 01</i><i>Lookbook</i><em>Bag (2)</em></div>
				<div class="mk-hero"><h4>SIDWALK</h4><p>DROP 01 — OUT NOW</p><span class="mk-btn">Shop the drop</span></div>
				<div class="mk-grid">
					<?php
					$ace360_items = array( array( 'Logo Tee', '€45', 'tee' ), array( 'Heavy Hoodie', '€89', 'hood' ), array( 'Cargo Pant', '€95', 'pant' ), array( 'Crew Cap', '€35', 'cap' ) );
					foreach ( $ace360_items as $ace360_it ) :
						?>
						<div class="mk-prod"><span class="mk-shape <?php echo esc_attr( $ace360_it[2] ); ?>"></span><p><?php echo esc_html( $ace360_it[0] ); ?><b><?php echo esc_html( $ace360_it[1] ); ?></b></p></div>
					<?php endforeach; ?>
				</div>
				<div class="mk-band"><p>FREE SHIPPING NL & BE · 14 DAY RETURNS</p></div>
				<div class="mk-campaign"><h5>WALK YOUR OWN WAY</h5><span class="mk-btn">See the campaign</span></div>
			</div>
		<?php elseif ( 'crea8or' === $ace360_m ) : ?>
			<div class="mock-page mk-cre" aria-hidden="true">
				<div class="mk-nav"><b>Crea8or</b><i>Explore</i><i>How it works</i><i>Sell</i><em>Sign in</em></div>
				<div class="mk-hero"><h4>Hire creators who make things happen.</h4><div class="mk-search"><span>Video editors, illustrators…</span><b>Search</b></div><small>Secure payments by Mollie · Paid out to creators automatically</small></div>
				<div class="mk-cards">
					<?php
					$ace360_people = array( array( 'AV', 'Video editing', '4.9', '€120' ), array( 'MK', 'Illustration', '5.0', '€90' ), array( 'JD', 'Motion design', '4.8', '€150' ) );
					foreach ( $ace360_people as $ace360_p ) :
						?>
						<div class="mk-card"><span class="mk-av"><?php echo esc_html( $ace360_p[0] ); ?></span><p><?php echo esc_html( $ace360_p[1] ); ?><small>★ <?php echo esc_html( $ace360_p[2] ); ?> · from <?php echo esc_html( $ace360_p[3] ); ?></small></p></div>
					<?php endforeach; ?>
				</div>
				<div class="mk-payout"><div><small>Payout</small><b>€ 1.240,00</b><p>Sent to NL91 •••• 4410</p></div><span>Paid</span></div>
				<div class="mk-sec"><h5>Top categories</h5><div class="mk-tags"><span>Video</span><span>Design</span><span>Writing</span><span>Music</span><span>3D</span></div></div>
			</div>
		<?php else : ?>
			<div class="mock-page mk-blank" aria-hidden="true">
				<div class="mk-nav"><b><?php echo esc_html( $ace360_title ); ?></b><i></i><i></i><i></i></div>
				<div class="mk-hero"><h4><?php echo esc_html( $ace360_title ); ?></h4><span class="mk-btn">→</span></div>
			</div>
		<?php endif; ?>
	</div>
</div>
