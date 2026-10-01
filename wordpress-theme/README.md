# ace360 WordPress theme

Animated studio theme for **ace360 services**, a web development studio for Dutch brands.

- `dist/ace360-theme.zip` – install this in WordPress (Appearance → Themes → Add New → Upload Theme).
- `preview/index.html` – static preview of the front page, rendered from the theme's own templates.
- `ace360/` – theme source.
- `tools/` – `build.py` rebuilds the preview and the zip (`python3 tools/build.py`); `render-preview.php` renders the front page outside WordPress.

## What's in it

| Area | Implementation |
| --- | --- |
| 3D hero | three.js ring of Delft-style tiles (texture drawn on a canvas, no image files). Assembles on load, turns with scroll, tilts toward the pointer, pauses when off screen. |
| Motion | GSAP + ScrollTrigger: line-by-line headline reveals, stretching accent words (Archivo's width axis), pinned horizontal Work gallery, process timeline that fills as you scroll. |
| Smooth scroll | Lenis, wired to ScrollTrigger. |
| Micro-interactions | Magnetic buttons, cursor follower (mouse only), scroll progress bar, marquee that leans with scroll speed, service titles that widen on hover. |
| Accessibility | Skip link, visible focus, semantic sections, `prefers-reduced-motion` turns off smooth scroll and all animation. Everything is readable with JavaScript off. |
| Privacy (AVG) | Fonts and scripts are bundled in the theme. The site makes no third-party requests. |
| Performance | All scripts deferred; three.js only loads on the front page; WebGL pixel ratio capped at 1.75. |

## After installing

1. **Logo** – Appearance → Customize → Site Identity → Logo. Until a logo is uploaded the header shows the built-in "ace360" wordmark.
2. **Texts and business details** – Appearance → Customize → ace360. Headlines use one line per row; wrap a word in `*asterisks*` for the stretching accent. Add your KvK number and BTW-id there; they appear in the footer.
3. **Contact form** – sends to the email set in the Customizer via `wp_mail()`. Install an SMTP plugin (e.g. WP Mail SMTP) so mail is delivered reliably.
4. **Projects** – Dashboard → Projects → Add project. Give each one a featured image, an excerpt and a "Project type". Published projects replace the example cards in the Work section. Order them with the "Order" field.
5. **Menus** – Appearance → Menus. Assign "Primary menu" and "Footer menu". Without menus, both fall back to links to the front-page sections (`#services`, `#work`, `#process`, `#nl`).
6. **Front page** – the theme's `front-page.php` is used automatically. If Settings → Reading is set to a static page, that page is still rendered with the animated layout.

## Credits

three.js (MIT), GSAP 3.12.5 (GreenSock standard license, free for websites), Lenis (MIT), Archivo and Hanken Grotesk (SIL Open Font License).
