<?php
/**
 * Contact: call booking (inc/booking.php), enquiry form (ace360_handle_contact())
 * and direct details.
 *
 * @package ace360
 */

// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- display flag only.
$ace360_status   = isset( $_GET['ace360_sent'] ) ? sanitize_key( wp_unslash( $_GET['ace360_sent'] ) ) : '';
$ace360_messages = array(
	'ok'      => ace360_pair( 'Thanks. Your message is in, and you get an answer within one working day.', 'Bedankt. Je bericht is binnen en je krijgt binnen één werkdag antwoord.' ),
	'invalid' => ace360_pair( 'Please fill in your name, a valid email address and a short message, and tick the consent box.', 'Vul je naam, een geldig e-mailadres en een kort bericht in en vink de toestemming aan.' ),
	'error'   => ace360_pair( 'The message could not be sent. Please email ' . ace360_mod( 'email' ) . ' directly.', 'Het bericht kon niet worden verstuurd. Mail direct naar ' . ace360_mod( 'email' ) . '.' ),
);
// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- cancel links from the confirmation email; the cancel itself is a POST.
$ace360_call     = isset( $_GET['ace360_call'] ) ? sanitize_key( wp_unslash( $_GET['ace360_call'] ) ) : '';
$ace360_call_key = isset( $_GET['key'] ) ? sanitize_text_field( wp_unslash( $_GET['key'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
$ace360_cancel   = ctype_digit( $ace360_call ) && function_exists( 'ace360_book_cancel_valid' ) && ace360_book_cancel_valid( (int) $ace360_call, $ace360_call_key );
$ace360_rules    = ace360_book_rules();
$ace360_vias     = array(
	'phone'    => ace360_pair( 'Phone', 'Telefoon' ),
	'whatsapp' => ace360_pair( 'WhatsApp', 'WhatsApp' ),
	'video'    => ace360_pair( 'Video call', 'Videogesprek' ),
);
$ace360_needs    = array(
	ace360_pair( 'Website', 'Website' ),
	ace360_pair( 'Online store', 'Webshop' ),
	ace360_pair( 'Maintenance', 'Onderhoud' ),
	ace360_pair( 'Growth', 'Groei' ),
	ace360_pair( 'Not sure yet', 'Weet ik nog niet' ),
);
?>
<section class="ch contact-ch" id="contact" data-k="contact" data-screen="live" data-tabs="<?php echo $ace360_status ? 'write' : 'book'; ?>">
	<div class="wrap">
		<div class="copy copy-contact">
		<div class="sec-head">
			<p class="kicker"><?php ace360_e( ace360_pair( 'Contact', 'Contact' ) ); ?></p>
			<h2><?php echo ace360_hl( ace360_pair( 'Book a *free call*', 'Plan een *gratis gesprek*' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
			<p class="lede"><?php ace360_e( ace360_pair( 'Pick a time that suits you: ' . $ace360_rules['len'] . ' minutes by phone, WhatsApp or video, no strings attached. Rather write? Send a message and you get an answer within one working day.', 'Kies een tijd die jou uitkomt: ' . $ace360_rules['len'] . ' minuten via telefoon, WhatsApp of video, zonder verplichtingen. Liever schrijven? Stuur een bericht en je krijgt binnen één werkdag antwoord.' ) ); ?></p>
		</div>
		<div class="contact-tabs" role="tablist" aria-label="<?php echo esc_attr( 'Contact' ); ?>">
			<button type="button" role="tab" id="tab-book" aria-controls="book" data-tab="book"><?php ace360_e( ace360_pair( 'Book a call', 'Plan een gesprek' ) ); ?></button>
			<button type="button" role="tab" id="tab-write" aria-controls="write" data-tab="write"><?php ace360_e( ace360_pair( 'Send a message', 'Stuur een bericht' ) ); ?></button>
		</div>
		<div class="contact-grid">
			<div class="card book" id="book" role="tabpanel" aria-labelledby="tab-book" data-panel="book" data-book
				data-rules="<?php echo esc_attr( wp_json_encode( $ace360_rules ) ); ?>"
				data-api="<?php echo esc_url( function_exists( 'rest_url' ) ? rest_url( 'ace360/v1' ) : '' ); ?>"
				data-mail="<?php echo esc_attr( ace360_mod( 'email' ) ); ?>">
				<?php if ( $ace360_cancel ) : ?>
					<form class="book-cancel" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
						<input type="hidden" name="action" value="ace360_cancel_call">
						<input type="hidden" name="ace360_call" value="<?php echo esc_attr( $ace360_call ); ?>">
						<input type="hidden" name="key" value="<?php echo esc_attr( $ace360_call_key ); ?>">
						<p><b><?php ace360_e( ace360_pair( 'Cancel your call on ' . ace360_book_when( ace360_book_get( (int) $ace360_call )['start'], ace360_book_tz(), 'en' ) . ' (Amsterdam time)?', 'Je gesprek op ' . ace360_book_when( ace360_book_get( (int) $ace360_call )['start'], ace360_book_tz(), 'nl' ) . ' annuleren?' ) ); ?></b></p>
						<button class="btn btn-line btn-small" type="submit"><?php ace360_e( ace360_pair( 'Yes, cancel it', 'Ja, annuleer' ) ); ?></button>
					</form>
				<?php elseif ( 'cancelled' === $ace360_call ) : ?>
					<p class="form-status is-ok" role="status"><?php ace360_e( ace360_pair( 'Your call is cancelled. Pick a new time below whenever it suits you.', 'Je gesprek is geannuleerd. Kies hieronder een nieuwe tijd wanneer het je uitkomt.' ) ); ?></p>
				<?php elseif ( 'invalid' === $ace360_call || ( $ace360_call && ! $ace360_cancel ) ) : ?>
					<p class="form-status is-error" role="status"><?php ace360_e( ace360_pair( 'This cancel link no longer works: the call has passed or was already cancelled.', 'Deze annuleerlink werkt niet meer: het gesprek is voorbij of al geannuleerd.' ) ); ?></p>
				<?php endif; ?>

				<div class="book-head">
					<p class="mono book-meta"><span class="book-dot" aria-hidden="true"></span><?php ace360_e( ace360_pair( 'Free · ' . $ace360_rules['len'] . ' min · no strings attached', 'Gratis · ' . $ace360_rules['len'] . ' min · vrijblijvend' ) ); ?></p>
					<p class="mono muted book-tz" data-book-tz></p>
				</div>
				<div class="book-days" data-book-days role="group" aria-label="<?php echo esc_attr( 'Day' ); ?>"></div>
				<div class="book-times" data-book-times role="group" aria-label="<?php echo esc_attr( 'Time' ); ?>"></div>
				<p class="book-msg muted" data-book-msg hidden></p>
				<noscript><p class="book-msg"><?php ace360_e( ace360_pair( 'The calendar needs JavaScript. Email ' . ace360_mod( 'email' ) . ' and we plan a call by email.', 'De agenda heeft JavaScript nodig. Mail ' . ace360_mod( 'email' ) . ' en we plannen het gesprek per mail.' ) ); ?></p></noscript>

				<form class="book-form" data-book-form hidden>
					<p class="book-picked"><span class="mono muted"><?php ace360_e( ace360_pair( 'Your call', 'Jouw gesprek' ) ); ?></span><b data-book-picked></b></p>
					<p class="hp" aria-hidden="true"><label for="book_website">Website</label><input type="text" id="book_website" name="website" tabindex="-1" autocomplete="off"></p>
					<div class="field-row">
						<p class="field">
							<label for="book_name"><?php ace360_e( ace360_pair( 'Name', 'Naam' ) ); ?></label>
							<input type="text" id="book_name" name="name" autocomplete="name" required>
						</p>
						<p class="field">
							<label for="book_email"><?php ace360_e( ace360_pair( 'Email', 'E-mail' ) ); ?></label>
							<input type="email" id="book_email" name="email" autocomplete="email" required>
						</p>
					</div>
					<fieldset class="field">
						<legend><?php ace360_e( ace360_pair( 'How do we talk?', 'Hoe spreken we?' ) ); ?></legend>
						<div class="pills">
							<?php $ace360_v_i = 0; foreach ( $ace360_vias as $ace360_v => $ace360_v_label ) : ?>
								<label class="pill">
									<input type="radio" name="via" value="<?php echo esc_attr( $ace360_v ); ?>"<?php echo 0 === $ace360_v_i++ ? ' checked' : ''; ?>>
									<span><?php ace360_e( $ace360_v_label ); ?></span>
								</label>
							<?php endforeach; ?>
						</div>
					</fieldset>
					<div class="field-row">
						<p class="field" data-book-phone>
							<label for="book_phone"><?php ace360_e( ace360_pair( 'Phone number', 'Telefoonnummer' ) ); ?></label>
							<input type="tel" id="book_phone" name="phone" autocomplete="tel" placeholder="+31 6 …" required>
						</p>
						<p class="field">
							<label for="book_company"><?php ace360_e( ace360_pair( 'Company (optional)', 'Bedrijf (optioneel)' ) ); ?></label>
							<input type="text" id="book_company" name="company" autocomplete="organization">
						</p>
					</div>
					<p class="field">
						<label for="book_note"><?php ace360_e( ace360_pair( 'What would you like to talk about? (optional)', 'Waar wil je het over hebben? (optioneel)' ) ); ?></label>
						<textarea id="book_note" name="note" rows="3"></textarea>
					</p>
					<label class="consent">
						<input type="checkbox" name="consent" value="1" required>
						<span><?php ace360_e( ace360_pair( 'I agree to my details being used to plan and hold this call.', 'Ik ga akkoord dat mijn gegevens worden gebruikt om dit gesprek te plannen en te voeren.' ) ); ?></span>
					</label>
					<p class="form-status is-error" role="alert" data-book-error hidden></p>
					<button class="btn btn-orange" type="submit" data-book-submit><?php ace360_e( ace360_pair( 'Confirm my call', 'Bevestig mijn gesprek' ) ); ?> <span aria-hidden="true">→</span></button>
				</form>

				<div class="book-done" data-book-done hidden tabindex="-1">
					<span class="book-check" aria-hidden="true">✓</span>
					<p class="book-done-title" data-book-done-title></p>
					<p class="muted" data-book-done-text></p>
					<p class="book-done-actions"><a class="btn btn-line btn-small" href="#" data-book-ics download="ace360-call.ics"><?php ace360_e( ace360_pair( 'Add to calendar', 'Zet in agenda' ) ); ?></a></p>
				</div>
			</div>

			<form class="card contact-form" id="write" role="tabpanel" aria-labelledby="tab-write" data-panel="write" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" data-contact-form>
				<input type="hidden" name="action" value="ace360_contact">
				<input type="hidden" name="ace360_estimate" value="" data-estimate-field>
				<input type="hidden" name="ace360_lang" value="en" data-lang-field>
				<?php wp_nonce_field( 'ace360_contact', 'ace360_contact_nonce' ); ?>
				<p class="hp" aria-hidden="true">
					<label for="ace360_website">Website</label>
					<input type="text" id="ace360_website" name="ace360_website" tabindex="-1" autocomplete="off">
				</p>

				<?php if ( isset( $ace360_messages[ $ace360_status ] ) ) : ?>
					<p class="form-status <?php echo 'ok' === $ace360_status ? 'is-ok' : 'is-error'; ?>" role="status"><?php ace360_e( $ace360_messages[ $ace360_status ] ); ?></p>
				<?php endif; ?>
				<p class="form-status is-ok" role="status" data-form-preview hidden></p>

				<div class="est-chip" data-estimate-chip hidden>
					<span class="mono"><?php ace360_e( ace360_pair( 'Your estimate', 'Jouw indicatie' ) ); ?></span>
					<b data-estimate-chip-text></b>
					<a href="#prijs" class="arrow-link"><?php ace360_e( ace360_pair( 'Change', 'Wijzig' ) ); ?></a>
				</div>

				<div class="field-row">
					<p class="field">
						<label for="ace360_name"><?php ace360_e( ace360_pair( 'Name', 'Naam' ) ); ?></label>
						<input type="text" id="ace360_name" name="ace360_name" autocomplete="name" required>
					</p>
					<p class="field">
						<label for="ace360_company"><?php ace360_e( ace360_pair( 'Company', 'Bedrijf' ) ); ?></label>
						<input type="text" id="ace360_company" name="ace360_company" autocomplete="organization">
					</p>
				</div>
				<div class="field-row">
					<p class="field">
						<label for="ace360_email"><?php ace360_e( ace360_pair( 'Email', 'E-mail' ) ); ?></label>
						<input type="email" id="ace360_email" name="ace360_email" autocomplete="email" required>
					</p>
					<p class="field">
						<label for="ace360_phone"><?php ace360_e( ace360_pair( 'Phone (optional)', 'Telefoon (optioneel)' ) ); ?></label>
						<input type="tel" id="ace360_phone" name="ace360_phone" autocomplete="tel">
					</p>
				</div>
				<fieldset class="field">
					<legend><?php ace360_e( ace360_pair( 'What is it about?', 'Waar gaat het over?' ) ); ?></legend>
					<div class="pills">
						<?php foreach ( $ace360_needs as $ace360_n_i => $ace360_need ) : ?>
							<label class="pill">
								<input type="radio" id="ace360_need_<?php echo esc_attr( $ace360_n_i ); ?>" name="ace360_need" value="<?php echo esc_attr( $ace360_need['en'] ); ?>"<?php echo 0 === $ace360_n_i ? ' checked' : ''; ?>>
								<span><?php ace360_e( $ace360_need ); ?></span>
							</label>
						<?php endforeach; ?>
					</div>
				</fieldset>
				<p class="field">
					<label for="ace360_message"><?php ace360_e( ace360_pair( 'What kind of site do you need, and when do you want to be live?', 'Wat voor site heb je nodig, en wanneer wil je live?' ) ); ?></label>
					<textarea id="ace360_message" name="ace360_message" rows="4" required></textarea>
				</p>
				<label class="consent">
					<input type="checkbox" id="ace360_consent" name="ace360_consent" value="1" required>
					<span><?php ace360_e( ace360_pair( 'I agree to my details being used to respond to this enquiry.', 'Ik ga akkoord dat mijn gegevens worden gebruikt om op deze aanvraag te reageren.' ) ); ?></span>
				</label>
				<button class="btn btn-orange" type="submit"><?php ace360_e( ace360_pair( 'Send enquiry', 'Verstuur aanvraag' ) ); ?> <span aria-hidden="true">→</span></button>
			</form>

			<aside class="card direct">
				<p class="mono muted"><?php ace360_e( ace360_pair( 'Prefer direct', 'Liever direct' ) ); ?></p>
				<dl>
					<div><dt class="mono"><?php ace360_e( ace360_pair( 'Call', 'Bellen' ) ); ?></dt><dd><a href="<?php echo esc_url( ace360_tel() ); ?>"><?php echo esc_html( ace360_mod( 'phone' ) ); ?></a></dd></div>
					<div><dt class="mono">WhatsApp</dt><dd><a href="<?php echo esc_url( ace360_wa() ); ?>" target="_blank" rel="noopener"><?php ace360_e( ace360_pair( 'Send a message', 'Stuur een bericht' ) ); ?> ↗</a></dd></div>
					<div><dt class="mono">Email</dt><dd><a href="<?php echo esc_url( 'mailto:' . ace360_mod( 'email' ) ); ?>"><?php echo esc_html( ace360_mod( 'email' ) ); ?></a></dd></div>
					<div><dt class="mono"><?php ace360_e( ace360_pair( 'Available', 'Bereikbaar' ) ); ?></dt><dd><?php ace360_e( ace360_pair( ace360_mod( 'hours_en' ), ace360_mod( 'hours_nl' ) ) ); ?></dd></div>
					<div><dt class="mono"><?php ace360_e( ace360_pair( 'Coverage', 'Werkgebied' ) ); ?></dt><dd><?php ace360_e( ace360_pair( 'All of the Netherlands, and remote worldwide', 'Heel Nederland, en op afstand wereldwijd' ) ); ?></dd></div>
				</dl>
			</aside>
		</div>
		</div>
	</div>
</section>
