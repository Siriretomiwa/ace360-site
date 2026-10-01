# ace360 WordPress theme

Cinematic, scroll-driven 3D studio theme for **ace360 services**, a web development studio for Dutch brands.

- `dist/ace360-theme.zip` – install this in WordPress (Appearance → Themes → Add New → Upload Theme).
- `preview/index.html` – static preview of the front page, rendered from the theme's own templates.
- `ace360/` – theme source.
- `tools/` – `build.py` rebuilds the preview and the zip (`python3 tools/build.py`); `render-preview.php` renders the front page outside WordPress.

## What's in it

| Area | Implementation |
| --- | --- |
| 3D film | The front page is one continuous three.js scene fixed behind the page (`assets/js/film.js`). Each chapter (`<section data-k>`) is a camera keyframe; scrolling blends between them. The scene: a floating browser window inside a ring of Delft tiles, a phone, the page's layers pulling apart in the Build step, and drifting dust. |
| Screen states | The browser window's screen is drawn on a canvas and flips to a new state per chapter (`data-screen`): a slow old site, wireframe, design, finished site, growth chart, iDEAL checkout, postcode autofill, cookie banner, accessibility checks, NL/EN, shipping label, and each project. Projects with a featured image show that image. |
| Sticky chapters | "Built for the Netherlands" (fades to a light scene) and "Work" stay pinned while their items cycle with scroll; the diamond dots jump to an item. |
| Motion | GSAP + ScrollTrigger reveals, stretching accent word in headlines (Archivo's width axis), Lenis smooth scrolling, scroll progress bar. |
| Accessibility | Skip link, visible focus, semantic sections, `prefers-reduced-motion` turns off smooth scroll and animation. Every chapter's text is in the HTML and readable with JavaScript or WebGL off. |
| Privacy (AVG) | Fonts and scripts are bundled in the theme. The site makes no third-party requests. |
| Performance | All scripts deferred; three.js only loads on the front page; no image or model files (everything is drawn in code); pixel ratio capped at 1.5; rendering pauses in background tabs. |

## After installing

1. **Logo** – Appearance → Customize → Site Identity → Logo. Until a logo is uploaded the header shows the built-in "ace360" wordmark.
2. **Texts and business details** – Appearance → Customize → ace360. Headlines use one line per row; wrap a word in `*asterisks*` for the stretching accent. Add your KvK number and BTW-id there; they appear in the footer.
3. **Contact form** – sends to the email set in the Customizer via `wp_mail()`. Install an SMTP plugin (e.g. WP Mail SMTP) so mail is delivered reliably.
4. **Projects** – Dashboard → Projects → Add project. Give each one a featured image, an excerpt and a "Project type". Published projects replace the example projects in the Work chapter, and each featured image appears on the 3D screen. Order them with the "Order" field.
5. **Menus** – Appearance → Menus. Assign "Primary menu" and "Footer menu". Without menus, both fall back to links to the front-page sections (`#process`, `#services`, `#nl`, `#work`).
6. **Front page** – the theme's `front-page.php` is used automatically. If Settings → Reading is set to a static page, that page is still rendered with the animated layout.

## Credits

three.js (MIT), GSAP 3.12.5 (GreenSock standard license, free for websites), Lenis (MIT), Archivo and Hanken Grotesk (SIL Open Font License).
