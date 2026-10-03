<?php
/**
 * Demo film: a 30-second, chaptered walkthrough of one project from first call to launch.
 * Drawn in HTML on a 1280×720 canvas and animated by assets/js/demo.js (GSAP timeline),
 * so it is scrubbable, chaptered and sharp at any size. Chapters match ace360_process().
 *
 * @package ace360
 */

$ace360_steps = ace360_process();
?>
<div class="demo" data-demo>
	<div class="demo-frame">
		<div class="demo-canvas" data-demo-canvas aria-hidden="true">

			<div class="dm-chapter"><span class="dm-dot"></span><span data-demo-label>01 · First call · Day 1</span></div>
			<div class="dm-brand">Ace 360 <span>Services</span></div>

			<!-- 1. First call -->
			<div class="dm-scene" data-scene="0">
				<div class="dm-call">
					<div class="dm-av">A</div>
					<p class="dm-call-name">Ace 360 Services</p>
					<p class="dm-call-time" data-demo-timer>00:00</p>
					<div class="dm-wave"><?php for ( $i = 0; $i < 22; $i++ ) : ?><i style="--i:<?php echo (int) $i; ?>"></i><?php endfor; ?></div>
					<div class="dm-call-btns"><span></span><span class="end"></span><span></span></div>
				</div>
				<div class="dm-notes">
					<p class="dm-notes-head">Project notes</p>
					<p class="dm-note"><b>Goal</b> 30 online bookings a month</p>
					<p class="dm-note"><b>Must</b> iDEAL · Dutch + English</p>
					<p class="dm-note"><b>Pages</b> Home · Services · Book · Contact</p>
					<p class="dm-note"><b>Live</b> before 1 June</p>
				</div>
			</div>

			<!-- 2. Quote -->
			<div class="dm-scene" data-scene="1">
				<div class="dm-quote">
					<div class="dm-q-head"><b>Your quote</b><span>Q-2026-041 · valid 30 days</span></div>
					<div class="dm-q-row"><span>Website, 6 pages</span><b>€1,290</b></div>
					<div class="dm-q-row"><span>Booking system</span><b>€500</b></div>
					<div class="dm-q-row"><span>Second language (EN)</span><b>€450</b></div>
					<div class="dm-q-total"><span>Total, excl. VAT</span><b>€2,240</b></div>
					<div class="dm-q-date"><span>Launch date</span><b>28 May</b></div>
					<div class="dm-q-cols">
						<div><p>Included</p><span>✓ 2 feedback rounds</span><span>✓ Hosting setup</span><span>✓ Walkthrough</span></div>
						<div><p>Not included</p><span>✕ Copywriting</span><span>✕ Photography</span></div>
					</div>
					<div class="dm-stamp">Accepted</div>
				</div>
			</div>

			<!-- 3. Design -->
			<div class="dm-scene" data-scene="2">
				<div class="dm-win dm-design">
					<div class="dm-win-bar"><i></i><i></i><i></i><span>figma · homepage v2</span></div>
					<div class="dm-wire">
						<span class="w-nav"></span><span class="w-h1"></span><span class="w-h2"></span><span class="w-btn"></span><span class="w-img"></span>
						<span class="w-card"></span><span class="w-card"></span><span class="w-card"></span>
					</div>
					<div class="dm-design-done">
						<div class="d-nav"><b>yourbrand</b><i></i><i></i><i></i><em>Book now</em></div>
						<div class="d-hero"><h6>Fresh every morning, booked in seconds.</h6><p></p><span>Book a table</span></div>
						<div class="d-img"></div>
						<div class="d-cards"><span></span><span></span><span></span></div>
					</div>
				</div>
				<div class="dm-pin p1"><b>1</b>Bigger photo?</div>
				<div class="dm-pin p2"><b>2</b>Button in orange</div>
				<div class="dm-rounds"><span>Round 1 ✓</span><span>Round 2 ✓</span></div>
			</div>

			<!-- 4. Build -->
			<div class="dm-scene" data-scene="3">
				<div class="dm-code">
					<div class="dm-win-bar"><i></i><i></i><i></i><span>front-page.php</span></div>
					<pre><span class="c1">&lt;section class="hero"&gt;</span>
<span class="c2">  &lt;h1&gt;&lt;?php the_title(); ?&gt;&lt;/h1&gt;</span>
<span class="c3">  &lt;a class="btn" href="/book"&gt;</span>
<span class="c4">&lt;/section&gt;</span>
<span class="c5">mollie()-&gt;payments-&gt;create([</span>
<span class="c6">  'method' =&gt; 'ideal',</span>
<span class="c7">]);</span></pre>
				</div>
				<div class="dm-win dm-staging">
					<div class="dm-win-bar"><i></i><i></i><i></i><span>staging.yourbrand.nl</span></div>
					<div class="dm-build">
						<div class="b-nav"><b>yourbrand</b><i></i><i></i><em>NL · EN</em></div>
						<div class="b-hero"><h6>Fresh every morning, booked in seconds.</h6><span>Book a table</span></div>
						<div class="b-form"><span>Date</span><span>Time</span><span>Guests</span><em>Pay with iDEAL</em></div>
						<div class="b-cards"><span></span><span></span><span></span></div>
					</div>
				</div>
				<div class="dm-checks">
					<span>iDEAL payments</span><span>Dutch + English</span><span>Booking form</span><span>Mobile</span>
				</div>
			</div>

			<!-- 5. Launch -->
			<div class="dm-scene" data-scene="4">
				<div class="dm-win dm-live">
					<div class="dm-win-bar"><i></i><i></i><i></i><span class="dm-url"><b class="lock">●</b> <span data-demo-url>staging.yourbrand.nl</span></span><em class="dm-live-pill">Live</em></div>
					<div class="dm-build done">
						<div class="b-nav"><b>yourbrand</b><i></i><i></i><em>NL · EN</em></div>
						<div class="b-hero"><h6>Fresh every morning, booked in seconds.</h6><span>Book a table</span></div>
						<div class="b-cards"><span></span><span></span><span></span></div>
					</div>
				</div>
				<div class="dm-scores">
					<?php foreach ( array( array( 98, 'Performance' ), array( 100, 'Accessibility' ), array( 100, 'Best practices' ), array( 100, 'SEO' ) ) as $ace360_sc ) : ?>
						<div class="dm-score" data-score="<?php echo (int) $ace360_sc[0]; ?>">
							<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="27"/><circle class="arc" cx="32" cy="32" r="27"/></svg>
							<b>0</b><span><?php echo esc_html( $ace360_sc[1] ); ?></span>
						</div>
					<?php endforeach; ?>
				</div>
				<div class="dm-toast t1"><i>✓</i><p>iDEAL payment received<small>€65.00 · booking for Saturday</small></p></div>
				<div class="dm-toast t2"><i>✓</i><p>Handover done<small>Logins sent · walkthrough recorded</small></p></div>
			</div>

		</div>
		<button class="demo-big-play" type="button" data-demo-bigplay><span class="screen-reader-text">Play</span><svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></button>
	</div>

	<div class="demo-controls">
		<button class="demo-btn" type="button" data-demo-play aria-label="Play / pause">
			<svg class="i-play" viewBox="0 0 24 24" width="18" height="18"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
			<svg class="i-pause" viewBox="0 0 24 24" width="18" height="18"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg>
		</button>
		<div class="demo-chapters" role="group" aria-label="<?php esc_attr_e( 'Chapters', 'ace360' ); ?>">
			<?php foreach ( $ace360_steps as $ace360_i => $ace360_s ) : ?>
				<button type="button" class="demo-ch" data-demo-chapter="<?php echo (int) $ace360_i; ?>" data-label-en="<?php echo esc_attr( sprintf( '%02d · %s · %s', $ace360_i + 1, $ace360_s[0]['en'], $ace360_s[1]['en'] ) ); ?>" data-label-nl="<?php echo esc_attr( sprintf( '%02d · %s · %s', $ace360_i + 1, $ace360_s[0]['nl'], $ace360_s[1]['nl'] ) ); ?>">
					<span class="demo-ch-track"><i></i></span>
					<span class="demo-ch-name"><?php ace360_e( $ace360_s[0] ); ?></span>
				</button>
			<?php endforeach; ?>
		</div>
		<span class="demo-time tabular" data-demo-time>0:00 / 0:30</span>
		<button class="demo-btn" type="button" data-demo-full aria-label="<?php esc_attr_e( 'Full screen', 'ace360' ); ?>"><svg viewBox="0 0 24 24" width="17" height="17"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
	</div>
	<noscript><p class="small"><?php ace360_e( ace360_pair( 'Turn on JavaScript to play the demo.', 'Zet JavaScript aan om de demo af te spelen.' ) ); ?></p></noscript>
</div>
