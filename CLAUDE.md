# Ace 360 Services: project notes

- `wordpress-theme/`: the Ace 360 WordPress theme (`ace360/`), preview builder (`tools/build.py`) and theme zip (`dist/`).
- `marketing/`: logo pack, reels and Shorts tooling (`reels/`), journey film, YouTube banner.

## Video content
All Ace 360 video requests are **vertical YouTube Shorts** unless the user explicitly says otherwise.
Follow `marketing/SHORTS-PLAYBOOK.md` (teach first, demonstrate second, market naturally; keep the existing visual identity;
use its 14-part output format; no invented results). Add every new Short to the log at the bottom of the playbook.

## SEO
The site is built to rank: Dutch at `/`, English at `/en/` (one language per URL), keyword landing pages in
`wordpress-theme/ace360/inc/landings.php`, head tags/structured data/sitemap in `inc/seo.php`. Plan and keyword map:
`marketing/SEO-PLAN.md`. New pages: one topic each, no two pages targeting the same search; keep prices in step with
the estimator; titles ≤ 60 and descriptions ≤ 158 characters; no invented results or reviews.
Designed pages use `tpl` in the landings registry (`template-parts/page-{tpl}.php`: diensten, over, contact). Blog posts
(`ace360/content/blog/*.html`) take `layout:` and `takeaways:` headers and media shortcodes `[[clip:name|caption]]`,
`[[shot:base|caption]]`, `[[photo:work-key|caption]]`; wrap inline labels in `<p>` inside block elements (wpautop).
Check pages in local WordPress and with `python3 wordpress-theme/tools/build.py` before shipping.
