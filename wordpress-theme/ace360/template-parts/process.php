<?php
/**
 * Process: the five steps of a project, in order.
 *
 * @package ace360
 */

$ace360_steps = array(
	array(
		'nl'    => 'Kennismaken',
		'title' => __( 'Intro call', 'ace360' ),
		'text'  => __( 'Thirty minutes about your brand, your customers and what the site has to achieve. You get a written plan and a fixed quote within a week.', 'ace360' ),
		'time'  => __( 'Week 1', 'ace360' ),
	),
	array(
		'nl'    => 'Ontwerpen',
		'title' => __( 'Strategy & design', 'ace360' ),
		'text'  => __( 'Sitemap, content plan and a clickable design of the key pages. Motion is designed here too, so nothing is bolted on later.', 'ace360' ),
		'time'  => __( 'Weeks 2–3', 'ace360' ),
	),
	array(
		'nl'    => 'Bouwen',
		'title' => __( 'Build', 'ace360' ),
		'text'  => __( 'We build on a staging site you can follow along on. Payments, translations and integrations are tested with real orders.', 'ace360' ),
		'time'  => __( 'Weeks 4–7', 'ace360' ),
	),
	array(
		'nl'    => 'Lanceren',
		'title' => __( 'Launch', 'ace360' ),
		'text'  => __( 'Redirects, search console, speed and accessibility checks, then go-live. Your team gets a short training on editing the site.', 'ace360' ),
		'time'  => __( 'Week 8', 'ace360' ),
	),
	array(
		'nl'    => 'Groeien',
		'title' => __( 'Care & growth', 'ace360' ),
		'text'  => __( 'Updates, backups and a monthly report. We propose improvements based on what visitors actually do.', 'ace360' ),
		'time'  => __( 'Ongoing', 'ace360' ),
	),
);
?>
<section class="section process" id="process" data-process>
	<div class="wrap process-grid">
		<div class="process-head">
			<p class="eyebrow"><?php esc_html_e( 'How we work', 'ace360' ); ?></p>
			<h2 class="display h2" data-reveal-lines><?php echo ace360_headline( __( "From first call\nto *launch*\nin 8 weeks.", 'ace360' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
			<p class="muted"><?php esc_html_e( 'Typical timeline for a brand website. Stores and 3D work take a little longer; we tell you up front.', 'ace360' ); ?></p>
		</div>
		<div class="steps-wrap">
		<span class="steps-line" aria-hidden="true"><span data-steps-fill></span></span>
		<ol class="steps">
			<?php foreach ( $ace360_steps as $ace360_index => $ace360_step ) : ?>
				<li class="step" data-reveal>
					<span class="step-num tabular"><?php echo esc_html( str_pad( (string) ( $ace360_index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span>
					<div class="step-body">
						<p class="label"><span lang="nl"><?php echo esc_html( $ace360_step['nl'] ); ?></span> · <?php echo esc_html( $ace360_step['time'] ); ?></p>
						<h3><?php echo esc_html( $ace360_step['title'] ); ?></h3>
						<p><?php echo esc_html( $ace360_step['text'] ); ?></p>
					</div>
				</li>
			<?php endforeach; ?>
		</ol>
		</div>
	</div>
</section>
