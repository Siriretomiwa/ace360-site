# Ace 360 Services: WordPress theme

Bilingual (English / Dutch) WordPress theme for **Ace 360 Services**: websites, online stores and maintenance for businesses in the Netherlands and abroad.

- `dist/ace360-theme.zip`: install this in WordPress (Appearance → Themes → Add New → Upload Theme).
- `preview/index.html`: static preview of the front page, rendered from the theme's own templates.
- `../docs/`: the same page as a static site for GitHub Pages.
- `ace360/`: theme source.
- `tools/build.py`: rebuilds the preview, the zip and the Pages copy (`python3 tools/build.py`, `python3 tools/build.py pages ../docs`).

## What's on the front page

| Section | What it does |
| --- | --- |
| Hero | Headline, "Price my website" and "Call now", plus a 3D stack of live browser windows showing your projects. The windows scroll through their sites and tilt toward the mouse. |
| Services (`#diensten`) | Four cards with prices. "Estimate" opens the self-quote with that project type selected. |
| Self-quote (`#prijs`) | Visitors pick a project type, number of pages, design level, extras, rush and maintenance, and see a live price range, timeline and line-by-line breakdown. Optional "incl. 21% VAT" toggle. "Send this as an enquiry" carries everything into the contact form and your email. |
| Process + demo film (`#werkwijze`) | A 30-second film of one project from first call to launch, with play/pause, chapters, scrubbing and full screen. The five steps next to it jump to their chapter; scrolling through the steps plays them. |
| Work (`#werk`) | Your projects in real browser frames; hover (or scroll past on a phone) to scroll through the site. |
| Questions (`#vragen`) | Your FAQ plus one for clients outside the Netherlands. |
| Contact (`#contact`) | Form (name, company, email, phone, topic, message, consent) emailed via `wp_mail()`, plus call, WhatsApp, email, hours and coverage. |

Look: plain white and #F8F9FA, #111111 text, Inter with JetBrains Mono for labels and prices, and one Dutch orange (#FF6A00) for actions, prices and the live dot. All fonts and scripts are inside the theme; the site loads nothing from other servers and sets no tracking cookies.

## After installing

1. **Logo**: Appearance → Customize → Site Identity → Logo.
2. **Business details**: Appearance → Customize → *ace360 business details* (phone, WhatsApp, email, hours in both languages, KvK, BTW-id).
3. **Your real projects**: Dashboard → Projects → Add project. Fill in the title, excerpt, *Type* and *Live site URL*, and set a **full-page screenshot (1440px wide) as the featured image**: it appears inside the browser frame and scrolls on hover. Published projects replace the three built-in previews in Work and fill the hero stack first.
4. **Prices**: every number in the self-quote is in `ace360_estimator()` in `ace360/inc/content.php` (or override it with the `ace360_estimator` filter).
5. **Copy**: all page text, in English and Dutch, is in `ace360/inc/content.php`.
6. **Email delivery**: install an SMTP plugin (e.g. WP Mail SMTP).

### About the built-in project previews

Until real projects are added, Work shows HTML recreations of Hesed Impact Ministries, SIDWALK and Crea8or (`template-parts/browser.php`). Their headlines and details are placeholders written for the preview; replace them with real screenshots and live URLs as described above.

### About the demo film

The film is HTML animated with GSAP (`template-parts/demo.php`, `assets/js/demo.js`), not a video file, so it is sharp at any size, weighs a few kilobytes and can jump to chapters. Its on-screen text is in English. The example quote (€2,240, launch 28 May) and scores in it illustrate the process and are not a real client.

## Credits

GSAP 3.12.5 (GreenSock standard license, free for websites), Lenis (MIT), Inter and JetBrains Mono (SIL Open Font License).
