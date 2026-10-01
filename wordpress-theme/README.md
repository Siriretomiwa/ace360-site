# Ace 360 Services: WordPress theme

Bilingual (English / Dutch) WordPress theme for **Ace 360 Services**: websites, online stores and maintenance for businesses in the Netherlands and abroad.

- `dist/ace360-theme.zip`: install this in WordPress (Appearance → Themes → Add New → Upload Theme).
- `preview/index.html`: static preview of the front page, rendered from the theme's own templates.
- `../docs/`: the same preview as a static site for GitHub Pages.
- `ace360/`: theme source.
- `tools/build.py`: rebuilds the preview, the Pages copy and the zip (`python3 tools/build.py`, `python3 tools/build.py pages ../docs`).

## What's in it

| Area | Implementation |
| --- | --- |
| Look | White and soft grey (#FFFFFF / #F8F9FA), off-black text (#111111), monochrome cards with subtle borders and shadows, Inter (self-hosted). |
| 3D model | One three.js scene fixed behind the front page (`assets/js/film.js`): a white architectural model of a Dutch canal-house street. Each section is a camera keyframe and scrolling blends between them. Through the five process steps the centre house gets built: plot, wireframe drawing, ghost massing, construction under scaffolding, then glass in and a flag on the gable at launch. No image or model files; everything is drawn in code. |
| English and Dutch | Every text is in the HTML in both languages (`inc/content.php`). The EN/NL switch in the header shows one. First visit: Dutch for Dutch-language browsers, English for everyone else; the choice is remembered. Link straight to a language with `?lang=nl` or `?lang=en`. The contact form tells you which language the visitor used. |
| International clients | Copy says "Netherlands and abroad", hours show CET, a FAQ covers remote work in English, quotes in euros and EU VAT reverse charge. |
| Price estimator | Visitors pick a project type and extras and see a price range, build time and optional care plan. "Ask for a fixed quote" carries the selection into the contact form and the email you receive. |
| Contact | Call (tel: link), WhatsApp click-to-chat, email, hours, coverage, and a form that emails you via `wp_mail()`. Floating "Call now" button on phones. |
| Accessibility | Skip link, visible focus, real `<details>` FAQ, `prefers-reduced-motion` turns off smooth scroll and animation. All text is readable with JavaScript or WebGL off. |
| Privacy (AVG) | Fonts and scripts are bundled in the theme; the site makes no third-party requests. |

## After installing

1. **Logo**: Appearance → Customize → Site Identity → Logo. Until you upload one, the header shows the built-in "Ace 360 Services" wordmark.
2. **Business details**: Appearance → Customize → *ace360 business details*: phone, WhatsApp number, email (receives the form), opening hours in both languages, KvK number (shown in the footer) and BTW-id.
3. **Copy and prices**: all page text, in English and Dutch, is in `ace360/inc/content.php`. Estimator prices are in `ace360_estimator()` in the same file (or override them with the `ace360_estimator` filter from a child theme or plugin).
4. **Email delivery**: install an SMTP plugin (e.g. WP Mail SMTP) so the contact form's mail is delivered reliably.
5. **Projects**: Dashboard → Projects → Add project, with an excerpt, a "Project type" and optionally a featured image. Published projects replace the three default ones (Hesed Impact Ministries, SIDWALK, Crea8or) in the Work section. Order them with the "Order" field.
6. **Menus**: optional. Without a Primary menu, the header links to `#diensten`, `#werkwijze`, `#werk` and `#vragen` in both languages.

## Credits

three.js (MIT), GSAP 3.12.5 (GreenSock standard license, free for websites), Lenis (MIT), Inter (SIL Open Font License).
