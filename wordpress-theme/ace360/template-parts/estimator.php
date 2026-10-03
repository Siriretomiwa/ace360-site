<?php
/**
 * Self-quote estimator. Choices on the left, live estimate on the right.
 * Prices come from ace360_estimator() in inc/content.php; assets/js/main.js does the maths.
 * Without JavaScript the form still shows every option and the starting prices.
 *
 * @package ace360
 */

$ace360_c = ace360_estimator();
?>
<form class="quote" data-quote="<?php echo esc_attr( wp_json_encode( ace360_estimator_js() ) ); ?>" onsubmit="return false">
	<div class="quote-opts">
		<fieldset class="q-step">
			<legend><span class="q-n">1</span><?php ace360_e( ace360_pair( 'What do you need built?', 'Wat moet er gebouwd worden?' ) ); ?></legend>
			<div class="q-tiles">
				<?php foreach ( $ace360_c['types'] as $ace360_i => $ace360_t ) : ?>
					<label class="q-tile">
						<input type="radio" name="q_type" id="q_type_<?php echo esc_attr( $ace360_t['id'] ); ?>" value="<?php echo esc_attr( $ace360_t['id'] ); ?>"<?php echo 1 === $ace360_i ? ' checked' : ''; ?>>
						<span class="q-tile-ui"><b><?php ace360_e( $ace360_t['label'] ); ?></b><small><?php ace360_e( $ace360_t['hint'] ); ?></small><em class="mono"><?php ace360_e( ace360_pair( 'from €' . number_format( $ace360_t['base'][0] ), 'vanaf € ' . number_format( $ace360_t['base'][0], 0, ',', '.' ) ) ); ?></em></span>
					</label>
				<?php endforeach; ?>
			</div>
		</fieldset>

		<fieldset class="q-step" data-q-pages>
			<legend><span class="q-n">2</span><?php ace360_e( ace360_pair( 'Number of pages', 'Aantal pagina’s' ) ); ?> <output class="q-out mono" for="q_pages" data-q-pages-out>5</output></legend>
			<input class="q-range" type="range" id="q_pages" name="q_pages" min="1" max="30" value="5" step="1">
			<p class="q-help"><?php ace360_e( ace360_pair( 'First 5 pages included. Blog posts, products and job listings don’t count as pages.', 'Eerste 5 pagina’s inbegrepen. Blogberichten, producten en vacatures tellen niet als pagina.' ) ); ?></p>
		</fieldset>

		<fieldset class="q-step" data-q-design>
			<legend><span class="q-n">3</span><?php ace360_e( ace360_pair( 'Design', 'Ontwerp' ) ); ?></legend>
			<div class="q-tiles two">
				<?php foreach ( $ace360_c['design'] as $ace360_i => $ace360_d ) : ?>
					<label class="q-tile">
						<input type="radio" name="q_design" id="q_design_<?php echo esc_attr( $ace360_d['id'] ); ?>" value="<?php echo esc_attr( $ace360_d['id'] ); ?>"<?php echo 0 === $ace360_i ? ' checked' : ''; ?>>
						<span class="q-tile-ui"><b><?php ace360_e( $ace360_d['label'] ); ?></b><small><?php ace360_e( $ace360_d['hint'] ); ?></small><em class="mono"><?php echo $ace360_d['pct'] ? '+' . (int) $ace360_d['pct'] . '%' : '—'; ?></em></span>
					</label>
				<?php endforeach; ?>
			</div>
		</fieldset>

		<fieldset class="q-step">
			<legend><span class="q-n" data-q-n-extras>4</span><?php ace360_e( ace360_pair( 'What do you need help with?', 'Waar heb je hulp bij nodig?' ) ); ?></legend>
			<div class="q-checks">
				<?php foreach ( $ace360_c['extras'] as $ace360_x ) : ?>
					<label class="q-check"<?php echo ! empty( $ace360_x['only'] ) ? ' data-only="' . esc_attr( implode( ' ', $ace360_x['only'] ) ) . '"' : ''; ?>>
						<input type="checkbox" name="q_extra" id="q_extra_<?php echo esc_attr( $ace360_x['id'] ); ?>" value="<?php echo esc_attr( $ace360_x['id'] ); ?>">
						<span class="q-box" aria-hidden="true"></span>
						<span class="q-check-label"><?php ace360_e( $ace360_x['label'] ); ?></span>
						<span class="mono q-price">+€<?php echo esc_html( number_format( $ace360_x['price'][0] ) ); ?></span>
					</label>
				<?php endforeach; ?>
			</div>
		</fieldset>

		<fieldset class="q-step">
			<legend><span class="q-n" data-q-n-speed>5</span><?php ace360_e( ace360_pair( 'Speed and aftercare', 'Snelheid en nazorg' ) ); ?></legend>
			<label class="q-switch">
				<input type="checkbox" id="q_rush" name="q_rush">
				<span class="q-switch-ui" aria-hidden="true"></span>
				<span><?php ace360_e( ace360_pair( 'Rush: one week faster', 'Spoed: een week sneller' ) ); ?> <span class="mono muted">+<?php echo (int) round( ( $ace360_c['rush']['factor'] - 1 ) * 100 ); ?>%</span></span>
			</label>
			<label class="q-switch">
				<input type="checkbox" id="q_care" name="q_care" checked>
				<span class="q-switch-ui" aria-hidden="true"></span>
				<span><?php ace360_e( ace360_pair( 'Maintenance and care', 'Onderhoud' ) ); ?> <span class="mono muted">€<?php echo (int) $ace360_c['care']; ?>/<?php ace360_e( ace360_pair( 'mo', 'mnd' ) ); ?></span></span>
			</label>
		</fieldset>
	</div>

	<aside class="quote-result" aria-live="polite">
		<p class="mono q-label"><?php ace360_e( ace360_pair( 'Your estimate', 'Jouw indicatie' ) ); ?></p>
		<p class="q-range-out" data-q-range>€1,200 – €1,600</p>
		<div class="q-meta">
			<div><span class="mono"><?php ace360_e( ace360_pair( 'Timeline', 'Doorlooptijd' ) ); ?></span><b data-q-weeks>3–4 weeks</b></div>
			<div><span class="mono"><?php ace360_e( ace360_pair( 'Maintenance', 'Onderhoud' ) ); ?></span><b data-q-care>€95 /mo</b></div>
		</div>
		<ul class="q-lines" data-q-lines></ul>
		<label class="q-vat"><input type="checkbox" id="q_vat" name="q_vat"> <span><?php ace360_e( ace360_pair( 'Show incl. 21% Dutch VAT', 'Toon incl. 21% btw' ) ); ?></span></label>
		<button class="btn btn-orange btn-block" type="button" data-q-send><?php ace360_e( ace360_pair( 'Send this as an enquiry', 'Stuur dit als aanvraag' ) ); ?> <span aria-hidden="true">→</span></button>
		<p class="q-note"><?php ace360_e( ace360_pair( 'An estimate, not a quote: based on comparable projects, excluding VAT. Your final price depends on the details and is agreed in writing after our call, before anything gets built. Outside the Netherlands? EU businesses pay no Dutch VAT (reverse charge).', 'Een indicatie, geen offerte: gebaseerd op vergelijkbare projecten, excl. btw. Je definitieve prijs hangt af van de details en spreken we na ons gesprek schriftelijk af, voordat er iets gebouwd wordt. Buiten Nederland? EU-bedrijven betalen geen Nederlandse btw (verlegd).' ) ); ?></p>
	</aside>
</form>
