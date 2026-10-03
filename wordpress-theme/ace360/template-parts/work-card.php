<?php
/**
 * One project card: thumbnail, type, title and the details the close-up dialog shows.
 * Used by the front-page slider ($args['tag'] = 'li', compact) and the All work page
 * ($args['rich'] = true adds the sector, description and what was built).
 *
 * @package ace360
 */

$ace360_w     = $args['w'];
$ace360_rich  = ! empty( $args['rich'] );
$ace360_secs  = ace360_sectors();
$ace360_sec   = isset( $ace360_w['sector'] ) ? (string) $ace360_w['sector'] : '';
$ace360_class = 'wcard' . ( $ace360_rich ? ' wcard-rich' : '' ) . ( empty( $args['class'] ) ? '' : ' ' . $args['class'] );
?>
<li class="<?php echo esc_attr( $ace360_class ); ?>" data-sector="<?php echo esc_attr( $ace360_sec ); ?>">
	<button type="button" class="wcard-open" aria-haspopup="dialog">
		<span class="wcard-thumb">
			<?php if ( ! empty( $ace360_w['image'] ) ) : ?>
				<img src="<?php echo esc_url( $ace360_w['image'] ); ?>" alt="" loading="lazy">
			<?php else : ?>
				<canvas width="768" height="480" data-paint="<?php echo esc_attr( $ace360_w['mockup'] ? $ace360_w['mockup'] : 'generic' ); ?>" data-title="<?php echo esc_attr( $ace360_w['title'] ); ?>" aria-hidden="true"></canvas>
			<?php endif; ?>
			<?php if ( $ace360_rich && isset( $ace360_secs[ $ace360_sec ] ) ) : ?>
				<span class="wcard-sector mono"><?php ace360_e( $ace360_secs[ $ace360_sec ] ); ?></span>
			<?php endif; ?>
		</span>
		<span class="wcard-meta mono"><?php ace360_e( $ace360_w['type'] ); ?><?php if ( ! empty( $ace360_w['concept'] ) ) : ?> <span class="tag-concept"><?php ace360_e( ace360_pair( 'Concept', 'Concept' ) ); ?></span><?php endif; ?></span>
		<span class="wcard-title"><?php echo esc_html( $ace360_w['title'] ); ?> <span class="wcard-arrow" aria-hidden="true">↗</span></span>
		<?php if ( $ace360_rich ) : ?>
			<?php if ( ! empty( $ace360_w['text'] ) ) : ?>
				<span class="wcard-text"><?php ace360_e( $ace360_w['text'] ); ?></span>
			<?php endif; ?>
			<?php if ( ! empty( $ace360_w['built'] ) ) : ?>
				<span class="wcard-tags">
					<?php foreach ( array_slice( $ace360_w['built'], 0, 2 ) as $ace360_b ) : ?>
						<span><?php ace360_e( $ace360_b ); ?></span>
					<?php endforeach; ?>
				</span>
			<?php endif; ?>
		<?php endif; ?>
	</button>
	<div class="wcard-more" hidden>
		<p class="lede"><?php ace360_e( $ace360_w['text'] ); ?></p>
		<?php if ( ! empty( $ace360_w['built'] ) ) : ?>
			<ul class="work-built">
				<?php foreach ( $ace360_w['built'] as $ace360_b ) : ?>
					<li><?php ace360_e( $ace360_b ); ?></li>
				<?php endforeach; ?>
			</ul>
		<?php endif; ?>
		<?php if ( ! empty( $ace360_w['stack'] ) ) : ?>
			<p class="stack mono"><?php echo esc_html( implode( ' · ', $ace360_w['stack'] ) ); ?></p>
		<?php endif; ?>
		<?php if ( ! empty( $ace360_w['demo'] ) ) : ?>
			<a class="btn btn-orange btn-small" href="<?php echo esc_url( $ace360_w['demo'] ); ?>" target="_blank" rel="noopener"><?php ace360_e( ace360_pair( 'Open the live demo', 'Open de live demo' ) ); ?> <span aria-hidden="true">↗</span></a>
		<?php endif; ?>
		<?php if ( ! empty( $ace360_w['url'] ) ) : ?>
			<a class="arrow-link" href="<?php echo esc_url( $ace360_w['url'] ); ?>" target="_blank" rel="noopener"><?php ace360_e( ace360_pair( 'Visit the live site', 'Bekijk de live site' ) ); ?> <span aria-hidden="true">↗</span></a>
		<?php elseif ( ! empty( $ace360_w['link'] ) ) : ?>
			<a class="arrow-link" href="<?php echo esc_url( $ace360_w['link'] ); ?>"><?php ace360_e( ace360_pair( 'Read the case', 'Lees de case' ) ); ?> <span aria-hidden="true">→</span></a>
		<?php endif; ?>
	</div>
</li>
