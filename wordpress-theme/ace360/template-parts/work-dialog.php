<?php
/**
 * Close-up of a project, filled from the card that opened it (assets/js/main.js).
 *
 * @package ace360
 */

?>
<dialog class="work-dialog" aria-labelledby="work-dialog-title">
	<div class="work-dialog-inner">
		<button type="button" class="work-dialog-close" data-close aria-label="<?php esc_attr_e( 'Close', 'ace360' ); ?>">×</button>
		<div class="work-dialog-shot"></div>
		<div class="work-dialog-copy">
			<p class="mono muted" data-d-type></p>
			<h3 id="work-dialog-title" data-d-title></h3>
			<div data-d-more></div>
		</div>
	</div>
</dialog>
