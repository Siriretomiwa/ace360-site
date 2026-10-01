<?php
/**
 * Contact: headline and enquiry form (handled by ace360_handle_contact()).
 *
 * @package ace360
 */

// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- display flag only.
$ace360_status   = isset( $_GET['ace360_sent'] ) ? sanitize_key( wp_unslash( $_GET['ace360_sent'] ) ) : '';
$ace360_messages = array(
	'ok'      => __( 'Thanks. Your message is in, and we reply within one working day.', 'ace360' ),
	'invalid' => __( 'Please fill in your name, a valid email address and a short message.', 'ace360' ),
	/* translators: %s: contact email address */
	'error'   => sprintf( __( 'The message could not be sent. Please email us directly at %s.', 'ace360' ), ace360_mod( 'contact_email' ) ),
);
?>
<section class="section contact" id="contact">
	<div class="wrap contact-grid">
		<div class="contact-head">
			<p class="eyebrow"><?php esc_html_e( 'Start a project', 'ace360' ); ?></p>
			<h2 class="display h1" data-reveal-lines><?php echo ace360_headline( ace360_mod( 'contact_title' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
			<p class="lede"><?php echo esc_html( ace360_mod( 'contact_text' ) ); ?></p>
			<p class="contact-direct"><?php esc_html_e( 'Or email', 'ace360' ); ?> <span class="selectable"><?php echo esc_html( ace360_mod( 'contact_email' ) ); ?></span></p>
		</div>

		<form class="contact-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" data-contact-form>
			<input type="hidden" name="action" value="ace360_contact">
			<?php wp_nonce_field( 'ace360_contact', 'ace360_contact_nonce' ); ?>
			<p class="hp" aria-hidden="true">
				<label for="ace360_website">Website</label>
				<input type="text" id="ace360_website" name="ace360_website" tabindex="-1" autocomplete="off">
			</p>

			<?php if ( isset( $ace360_messages[ $ace360_status ] ) ) : ?>
				<p class="form-status <?php echo 'ok' === $ace360_status ? 'is-ok' : 'is-error'; ?>" role="status"><?php echo esc_html( $ace360_messages[ $ace360_status ] ); ?></p>
			<?php endif; ?>
			<p class="form-status is-ok" role="status" data-form-preview hidden></p>

			<div class="field-row">
				<p class="field">
					<label for="ace360_name"><?php esc_html_e( 'Name', 'ace360' ); ?></label>
					<input type="text" id="ace360_name" name="ace360_name" autocomplete="name" required>
				</p>
				<p class="field">
					<label for="ace360_company"><?php esc_html_e( 'Company', 'ace360' ); ?></label>
					<input type="text" id="ace360_company" name="ace360_company" autocomplete="organization">
				</p>
			</div>
			<p class="field">
				<label for="ace360_email"><?php esc_html_e( 'Email', 'ace360' ); ?></label>
				<input type="email" id="ace360_email" name="ace360_email" autocomplete="email" required>
			</p>
			<fieldset class="field budget">
				<legend><?php esc_html_e( 'Budget', 'ace360' ); ?></legend>
				<div class="chips">
					<?php
					$ace360_budgets = array( '€ 3k – 6k', '€ 6k – 12k', '€ 12k – 25k', '€ 25k +' );
					foreach ( $ace360_budgets as $ace360_b_index => $ace360_budget ) :
						?>
						<label class="chip">
							<input type="radio" id="ace360_budget_<?php echo esc_attr( $ace360_b_index ); ?>" name="ace360_budget" value="<?php echo esc_attr( $ace360_budget ); ?>" <?php echo 1 === $ace360_b_index ? 'checked' : ''; ?>>
							<span class="tabular"><?php echo esc_html( $ace360_budget ); ?></span>
						</label>
					<?php endforeach; ?>
				</div>
			</fieldset>
			<p class="field">
				<label for="ace360_message"><?php esc_html_e( 'What should the site do?', 'ace360' ); ?></label>
				<textarea id="ace360_message" name="ace360_message" rows="4" required></textarea>
			</p>
			<button class="btn btn-invert magnetic" type="submit"><span><?php esc_html_e( 'Send enquiry', 'ace360' ); ?></span><span class="btn-arrow" aria-hidden="true">&rarr;</span></button>
		</form>
	</div>
</section>
