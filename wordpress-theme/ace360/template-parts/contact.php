<?php
/**
 * Contact chapter: direct details and the enquiry form (handled by ace360_handle_contact()).
 *
 * @package ace360
 */

// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- display flag only.
$ace360_status   = isset( $_GET['ace360_sent'] ) ? sanitize_key( wp_unslash( $_GET['ace360_sent'] ) ) : '';
$ace360_messages = array(
	'ok'      => ace360_pair( 'Thanks. Your message is in, and you get an answer within one working day.', 'Bedankt. Je bericht is binnen en je krijgt binnen één werkdag antwoord.' ),
	'invalid' => ace360_pair( 'Please fill in your name, a valid email address and a short message.', 'Vul je naam, een geldig e-mailadres en een kort bericht in.' ),
	'error'   => ace360_pair( 'The message could not be sent. Please email ' . ace360_mod( 'email' ) . ' directly.', 'Het bericht kon niet worden verstuurd. Mail direct naar ' . ace360_mod( 'email' ) . '.' ),
);
$ace360_needs    = array(
	ace360_pair( 'Website', 'Website' ),
	ace360_pair( 'Online store', 'Webshop' ),
	ace360_pair( 'Maintenance', 'Onderhoud' ),
	ace360_pair( 'Growth', 'Groei' ),
	ace360_pair( 'Not sure yet', 'Weet ik nog niet' ),
);
?>
<section class="ch contact" id="contact" data-k="contact">
	<div class="wrap contact-grid">
		<div class="copy">
			<p class="kicker"><?php ace360_e( ace360_pair( 'Contact', 'Contact' ) ); ?></p>
			<h2><?php ace360_e( ace360_pair( 'Tell me what you need', 'Vertel wat je nodig hebt' ) ); ?></h2>
			<p class="body"><?php ace360_e( ace360_pair( 'You get an answer within one working day, with either a concrete price or a concrete question back. No automated confirmation email that says nothing.', 'Je krijgt binnen één werkdag antwoord, met een concrete prijs of een concrete vraag terug. Geen automatische bevestigingsmail die niets zegt.' ) ); ?></p>
			<dl class="details card">
				<div><dt><?php ace360_e( ace360_pair( 'Call', 'Bellen' ) ); ?></dt><dd><a href="<?php echo esc_url( ace360_tel() ); ?>"><?php echo esc_html( ace360_mod( 'phone' ) ); ?></a></dd></div>
				<div><dt>WhatsApp</dt><dd><a href="<?php echo esc_url( ace360_wa() ); ?>" target="_blank" rel="noopener"><?php ace360_e( ace360_pair( 'Send a message', 'Stuur een bericht' ) ); ?> ↗</a></dd></div>
				<div><dt>Email</dt><dd><a href="<?php echo esc_url( 'mailto:' . ace360_mod( 'email' ) ); ?>"><?php echo esc_html( ace360_mod( 'email' ) ); ?></a></dd></div>
				<div><dt><?php ace360_e( ace360_pair( 'Available', 'Bereikbaar' ) ); ?></dt><dd><?php ace360_e( ace360_pair( ace360_mod( 'hours_en' ), ace360_mod( 'hours_nl' ) ) ); ?></dd></div>
				<div><dt><?php ace360_e( ace360_pair( 'Coverage', 'Werkgebied' ) ); ?></dt><dd><?php ace360_e( ace360_pair( 'All of the Netherlands · international clients remotely', 'Heel Nederland · internationale klanten op afstand' ) ); ?></dd></div>
			</dl>
		</div>

		<form class="card contact-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" data-contact-form>
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
			<p class="field">
				<label for="ace360_email"><?php ace360_e( ace360_pair( 'Email', 'E-mail' ) ); ?></label>
				<input type="email" id="ace360_email" name="ace360_email" autocomplete="email" required>
			</p>
			<fieldset class="field">
				<legend><?php ace360_e( ace360_pair( 'What do you need?', 'Wat heb je nodig?' ) ); ?></legend>
				<div class="opts">
					<?php foreach ( $ace360_needs as $ace360_n_i => $ace360_need ) : ?>
						<label class="opt">
							<input type="radio" id="ace360_need_<?php echo esc_attr( $ace360_n_i ); ?>" name="ace360_need" value="<?php echo esc_attr( $ace360_need['en'] ); ?>"<?php echo 0 === $ace360_n_i ? ' checked' : ''; ?>>
							<span><?php ace360_e( $ace360_need ); ?></span>
						</label>
					<?php endforeach; ?>
				</div>
			</fieldset>
			<p class="est-chip" data-estimate-chip hidden></p>
			<p class="field">
				<label for="ace360_message"><?php ace360_e( ace360_pair( 'Tell me about the project', 'Vertel over het project' ) ); ?></label>
				<textarea id="ace360_message" name="ace360_message" rows="4" required></textarea>
			</p>
			<button class="btn" type="submit"><?php ace360_e( ace360_pair( 'Send', 'Versturen' ) ); ?> <span aria-hidden="true">→</span></button>
		</form>
	</div>
</section>
