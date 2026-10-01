<?php
/**
 * Comments.
 *
 * @package ace360
 */

if ( post_password_required() ) {
	return;
}
?>
<section class="comments prose" id="comments">
	<?php if ( have_comments() ) : ?>
		<h2>
			<?php
			/* translators: %s: number of comments */
			printf( esc_html( _n( '%s comment', '%s comments', get_comments_number(), 'ace360' ) ), esc_html( number_format_i18n( get_comments_number() ) ) );
			?>
		</h2>
		<ol class="comment-list">
			<?php
			wp_list_comments(
				array(
					'style'      => 'ol',
					'short_ping' => true,
				)
			);
			?>
		</ol>
		<?php the_comments_navigation(); ?>
	<?php endif; ?>
	<?php comment_form(); ?>
</section>
