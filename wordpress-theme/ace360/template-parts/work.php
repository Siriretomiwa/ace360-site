<?php
/**
 * Work: horizontal scroll of projects. Shows published Projects, or labelled
 * example cards until the first Project exists.
 *
 * @package ace360
 */

$ace360_query = new WP_Query(
	array(
		'post_type'      => 'ace_project',
		'posts_per_page' => 8,
		'orderby'        => array(
			'menu_order' => 'ASC',
			'date'       => 'DESC',
		),
		'no_found_rows'  => true,
	)
);
$ace360_has_projects = $ace360_query->have_posts();
?>
<section class="section work" id="work" data-work>
	<div class="work-pin" data-work-pin>
		<div class="wrap work-head">
			<p class="eyebrow"><?php esc_html_e( 'Work', 'ace360' ); ?></p>
			<h2 class="display h2" data-reveal-lines><?php echo ace360_headline( __( "Sites with\na *pulse.*", 'ace360' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h2>
			<?php if ( ! $ace360_has_projects ) : ?>
				<p class="muted small"><?php esc_html_e( 'Example projects. Add your own under Projects in the dashboard and they replace these cards.', 'ace360' ); ?></p>
			<?php endif; ?>
		</div>
		<div class="work-viewport">
			<ul class="work-track" data-work-track>
				<?php if ( $ace360_has_projects ) : ?>
					<?php
					while ( $ace360_query->have_posts() ) :
						$ace360_query->the_post();
						$ace360_type = get_post_meta( get_the_ID(), 'ace360_project_type', true );
						?>
						<li class="work-card">
							<a href="<?php the_permalink(); ?>" class="work-link">
								<div class="work-visual">
									<?php
									if ( has_post_thumbnail() ) {
										the_post_thumbnail( 'large', array( 'loading' => 'lazy' ) );
									} else {
										echo '<span class="work-art" data-variant="grid"></span>';
									}
									?>
								</div>
								<div class="work-meta">
									<?php if ( $ace360_type ) : ?>
										<p class="label"><?php echo esc_html( $ace360_type ); ?></p>
									<?php endif; ?>
									<h3><?php the_title(); ?></h3>
									<p class="muted"><?php echo esc_html( wp_strip_all_tags( get_the_excerpt() ) ); ?></p>
								</div>
							</a>
						</li>
					<?php endwhile; ?>
					<?php wp_reset_postdata(); ?>
				<?php else : ?>
					<?php foreach ( ace360_example_projects() as $ace360_project ) : ?>
						<li class="work-card">
							<div class="work-link">
								<div class="work-visual">
									<span class="work-art" data-variant="<?php echo esc_attr( $ace360_project['variant'] ); ?>"></span>
									<span class="example-badge"><?php esc_html_e( 'Example', 'ace360' ); ?></span>
								</div>
								<div class="work-meta">
									<p class="label"><?php echo esc_html( $ace360_project['type'] ); ?></p>
									<h3><?php echo esc_html( $ace360_project['title'] ); ?></h3>
									<p class="muted"><?php echo esc_html( $ace360_project['text'] ); ?></p>
								</div>
							</div>
						</li>
					<?php endforeach; ?>
				<?php endif; ?>
				<li class="work-card work-card-cta">
					<a href="#contact" class="work-link">
						<span class="display"><?php esc_html_e( 'Yours next?', 'ace360' ); ?></span>
						<span class="btn-arrow" aria-hidden="true">&rarr;</span>
					</a>
				</li>
			</ul>
		</div>
	</div>
</section>
