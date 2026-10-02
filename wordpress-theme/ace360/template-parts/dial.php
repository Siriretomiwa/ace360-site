<?php
/**
 * The 360° quote: three questions on the left, a price dial on the right.
 *
 * Uses the same inputs (names and ids) as the classic estimator, so the maths in
 * assets/js/main.js drives it; assets/js/ring.js draws the dial, the launch date
 * and the receipt that follows the visitor down the page.
 * Without JavaScript every option and starting price is still readable.
 *
 * @package ace360
 */

$ace360_c = ace360_estimator();
?>
<form class="dial" data-quote="<?php echo esc_attr( wp_json_encode( ace360_estimator_js() ) ); ?>" onsubmit="return false">
	<div class="dial-ask">
		<fieldset class="ask">
			<legend class="ask-q"><span class="ask-n">1</span><?php ace360_e( ace360_pair( 'What do you need built?', 'Wat wil je laten bouwen?' ) ); ?></legend>
			<div class="seg">
				<?php foreach ( $ace360_c['types'] as $ace360_i => $ace360_t ) : ?>
					<label class="seg-opt">
						<input type="radio" name="q_type" id="q_type_<?php echo esc_attr( $ace360_t['id'] ); ?>" value="<?php echo esc_attr( $ace360_t['id'] ); ?>"<?php echo 1 === $ace360_i ? ' checked' : ''; ?>>
						<span class="seg-ui">
							<b><?php ace360_e( $ace360_t['label'] ); ?></b>
							<small><?php ace360_e( $ace360_t['hint'] ); ?></small>
							<em class="mono"><?php ace360_e( ace360_pair( 'from €' . number_format( $ace360_t['base'][0] ), 'vanaf € ' . number_format( $ace360_t['base'][0], 0, ',', '.' ) ) ); ?></em>
						</span>
					</label>
				<?php endforeach; ?>
			</div>
		</fieldset>

		<fieldset class="ask" data-q-pages>
			<legend class="ask-q"><span class="ask-n">2</span><?php ace360_e( ace360_pair( 'How many pages?', 'Hoeveel pagina’s?' ) ); ?> <output class="ask-out mono" for="q_pages" data-q-pages-out>5</output></legend>
			<input class="q-range" type="range" id="q_pages" name="q_pages" min="1" max="30" value="5" step="1" aria-describedby="q_pages_help">
			<p class="ask-help" id="q_pages_help"><?php ace360_e( ace360_pair( 'First 5 included. Blog posts, products and job listings don’t count.', 'Eerste 5 inbegrepen. Blogberichten, producten en vacatures tellen niet mee.' ) ); ?></p>
		</fieldset>

		<fieldset class="ask">
			<legend class="ask-q"><span class="ask-n">3</span><?php ace360_e( ace360_pair( 'What should it be able to do?', 'Wat moet hij kunnen?' ) ); ?></legend>
			<div class="toggles">
				<?php foreach ( $ace360_c['extras'] as $ace360_x ) : ?>
					<label class="tog"<?php echo ! empty( $ace360_x['only'] ) ? ' data-only="' . esc_attr( implode( ' ', $ace360_x['only'] ) ) . '"' : ''; ?>>
						<input type="checkbox" name="q_extra" id="q_extra_<?php echo esc_attr( $ace360_x['id'] ); ?>" value="<?php echo esc_attr( $ace360_x['id'] ); ?>">
						<span class="tog-ui"><span class="tog-plus" aria-hidden="true"></span><?php ace360_e( $ace360_x['label'] ); ?> <span class="mono tog-price">+€<?php echo esc_html( number_format( $ace360_x['price'][0], 0, ',', '.' ) ); ?></span></span>
					</label>
				<?php endforeach; ?>
			</div>
		</fieldset>

		<details class="ask-more">
			<summary><?php ace360_e( ace360_pair( 'More options: design, rush, maintenance, VAT', 'Meer opties: ontwerp, spoed, onderhoud, btw' ) ); ?></summary>
			<fieldset class="ask" data-q-design>
				<legend class="ask-q small"><?php ace360_e( ace360_pair( 'Design', 'Ontwerp' ) ); ?></legend>
				<div class="seg two">
					<?php foreach ( $ace360_c['design'] as $ace360_i => $ace360_d ) : ?>
						<label class="seg-opt">
							<input type="radio" name="q_design" id="q_design_<?php echo esc_attr( $ace360_d['id'] ); ?>" value="<?php echo esc_attr( $ace360_d['id'] ); ?>"<?php echo 0 === $ace360_i ? ' checked' : ''; ?>>
							<span class="seg-ui"><b><?php ace360_e( $ace360_d['label'] ); ?></b><small><?php ace360_e( $ace360_d['hint'] ); ?></small><em class="mono"><?php echo $ace360_d['pct'] ? '+' . (int) $ace360_d['pct'] . '%' : '—'; ?></em></span>
						</label>
					<?php endforeach; ?>
				</div>
			</fieldset>
			<div class="switches">
				<label class="q-switch"><input type="checkbox" id="q_rush" name="q_rush"><span class="q-switch-ui" aria-hidden="true"></span><span><?php ace360_e( ace360_pair( 'Rush: one week faster', 'Spoed: een week sneller' ) ); ?> <span class="mono muted">+<?php echo (int) round( ( $ace360_c['rush']['factor'] - 1 ) * 100 ); ?>%</span></span></label>
				<label class="q-switch"><input type="checkbox" id="q_care" name="q_care" checked><span class="q-switch-ui" aria-hidden="true"></span><span><?php ace360_e( ace360_pair( 'Maintenance and care', 'Onderhoud' ) ); ?> <span class="mono muted">€<?php echo (int) $ace360_c['care']; ?>/<?php ace360_e( ace360_pair( 'mo', 'mnd' ) ); ?></span></span></label>
				<label class="q-switch"><input type="checkbox" id="q_vat" name="q_vat"><span class="q-switch-ui" aria-hidden="true"></span><span><?php ace360_e( ace360_pair( 'Show incl. 21% VAT', 'Toon incl. 21% btw' ) ); ?></span></label>
			</div>
		</details>
	</div>

	<aside class="dial-out" aria-live="polite">
		<div class="ring" data-ring>
			<span class="ring-glow" aria-hidden="true"></span>
			<img class="ring-img" src="<?php echo esc_url( get_template_directory_uri() . '/assets/img/ring-hero.webp' ); ?>" alt="" width="800" height="800" decoding="async" fetchpriority="high">
			<svg class="ring-svg" viewBox="0 0 400 400" aria-hidden="true">
				<g class="ring-ticks" data-ring-ticks>
					<?php for ( $ace360_k = 0; $ace360_k < 72; $ace360_k++ ) : ?>
						<line x1="200" y1="<?php echo 0 === $ace360_k % 6 ? 8 : 14; ?>" x2="200" y2="24" transform="rotate(<?php echo (int) ( $ace360_k * 5 ); ?> 200 200)"/>
					<?php endfor; ?>
				</g>
				<defs><filter id="ring-bloom" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
				<circle class="ring-track" cx="200" cy="200" r="154"/>
				<circle class="ring-arc" cx="200" cy="200" r="154" pathLength="360" data-ring-arc transform="rotate(-90 200 200)" filter="url(#ring-bloom)"/>
				<g class="ring-knob" data-ring-knob><circle cx="200" cy="46" r="10"/><circle class="ring-knob-dot" cx="200" cy="46" r="3.5"/></g>
			</svg>
			<div class="ring-center">
				<p class="ring-label mono"><?php ace360_e( ace360_pair( 'Your price', 'Jouw prijs' ) ); ?></p>
				<p class="ring-price" data-q-range>€ 1.200 – € 1.600</p>
				<p class="ring-vat mono" data-ring-vat><?php ace360_e( ace360_pair( 'excl. VAT · fixed in the quote', 'excl. btw · vast in de offerte' ) ); ?></p>
			</div>
		</div>
		<dl class="ring-meta glass-cards">
			<div><dt class="mono"><?php ace360_e( ace360_pair( 'Live by', 'Live op' ) ); ?></dt><dd data-ring-date>—</dd></div>
			<div><dt class="mono"><?php ace360_e( ace360_pair( 'Build time', 'Bouwtijd' ) ); ?></dt><dd data-q-weeks>3–4 weken</dd></div>
			<div><dt class="mono"><?php ace360_e( ace360_pair( 'Care', 'Onderhoud' ) ); ?></dt><dd data-q-care>€ 95 /mnd</dd></div>
		</dl>
		<details class="ring-lines">
			<summary><?php ace360_e( ace360_pair( 'How this price is built up', 'Zo is deze prijs opgebouwd' ) ); ?></summary>
			<ul class="q-lines" data-q-lines></ul>
		</details>
		<button class="btn btn-orange btn-block" type="button" data-q-send><?php ace360_e( ace360_pair( 'Lock in this price', 'Leg deze prijs vast' ) ); ?> <span aria-hidden="true">→</span></button>
		<a class="ring-call" href="<?php echo esc_url( ace360_tel() ); ?>"><?php ace360_e( ace360_pair( 'Rather talk it through? Call', 'Liever even bellen?' ) ); ?> <span class="mono"><?php echo esc_html( ace360_mod( 'phone' ) ); ?></span></a>
	</aside>
</form>
