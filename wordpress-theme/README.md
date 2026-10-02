# Ace 360 Services: WordPress theme

Bilingual (English / Dutch) WordPress theme for **Ace 360 Services**: websites, online stores and maintenance for businesses in the Netherlands and abroad.

- `dist/ace360-theme.zip`: install this in WordPress (Appearance → Themes → Add New → Upload Theme).
- `preview/index.html`: static preview of the front page, rendered from the theme's own templates.
- `../docs/`: the same page as a static site for GitHub Pages.
- `ace360/`: theme source.
- `tools/build.py`: rebuilds the preview, the zip and the Pages copy (`python3 tools/build.py`, `python3 tools/build.py pages ../docs`).

## What's on the front page

The whole front page plays like one film. A 3D scene (`assets/js/film.js`, three.js) sits fixed behind every section: a laptop and phone on a white desk, website cards, a printed quote, soft shadows and Dutch orange light. Each section has its own camera position, and as you scroll the camera glides between them while the props change with the story. The scene steps aside to the opposite side from the text, follows the mouse, pauses in background tabs, is simplified on phones and holds still with reduced motion.

| Section | Copy | What the 3D scene does |
| --- | --- | --- |
| Hero | Headline, "Price my website", "Call now" | Wide shot of the desk; the laptop shows the Ace 360 site |
| Services (`#diensten`) | Four services with prices; "Estimate" opens the self-quote with that type selected | Website cards fly out and circle the laptop |
| Self-quote (`#prijs`) | Project type, pages, design, extras, rush, maintenance, optional 21% VAT; live price range, timeline and breakdown; "Send this as an enquiry" fills the contact form | The cards gather into a pile and a printed quote rises next to the laptop, **updating live with the visitor's choices** |
| Process (`#werkwijze`) + 5 steps | The five steps, one per screen | Top-down shot as the lid closes, then: first call (the phone lifts up with the call on screen), fixed quote (quote lands on the desk), design (lid opens on the design), build (the site splits into its layers), launch (cards circle the live site) |
| Demo film (`#demo`) | A 30-second film of one project from first call to launch, with chapters, scrubbing and full screen | Pulls back to a wide shot |
| Work (`#werk`) | Your projects, one at a time while the section is pinned | The laptop and phone show each project; with a featured image, that screenshot is what appears on the 3D screen |
| All work (`#projecten`) | Every project (20 built in) as a grid of screen thumbnails, with sector filters (Stores, Charity & church, Beauty & skincare, Bookings & hospitality, Platforms & services). Click a project for a close-up with its details | The cards circle above the desk, softened behind the grid |
| Questions (`#vragen`) | Your FAQ plus one for clients outside the Netherlands | Overhead shot, faded behind the answers |
| Contact (`#contact`) | Form (name, company, email, phone, topic, message, consent) sent with `wp_mail()`, plus call, WhatsApp, email and hours | Close-up of the live site with the cards circling |

Without WebGL the page shows a still, plain white background and everything else works.

Look: plain white and #F8F9FA, #111111 text, Inter with JetBrains Mono for labels and prices, and one Dutch orange (#FF6A00) for actions, prices and the live dot. All fonts and scripts are inside the theme; the site loads nothing from other servers and sets no tracking cookies.

## After installing

1. **Logo**: Appearance → Customize → Site Identity → Logo.
2. **Business details**: Appearance → Customize → *ace360 business details* (phone, WhatsApp, email, hours in both languages, KvK, BTW-id).
3. **Your real projects**: Dashboard → Projects → Add project. Fill in the title, excerpt, *Type*, *Live site URL* and *Sector*, tick *Show in the 3D showcase* for up to seven of them, and set a **screenshot (1440px wide) as the featured image**: it appears on the 3D laptop and in the All work grid. Once you publish any projects, they replace all the built-in examples.
4. **Prices**: every number in the self-quote is in `ace360_estimator()` in `ace360/inc/content.php` (or override it with the `ace360_estimator` filter).
5. **Copy**: all page text, in English and Dutch, is in `ace360/inc/content.php`.
6. **Email delivery**: install an SMTP plugin (e.g. WP Mail SMTP).

### About the built-in project previews

Until real projects are added, the theme shows 20 built-in examples. Hesed Impact Ministries, SIDWALK and Crea8or are recreations of real work; their headlines and details are placeholders. The other 17 are **concept designs** (made-up businesses such as Bright Wells Foundation, Velours Skin and Jollof House) and carry a *Concept* label. All of them are drawn in code (`assets/js/screens.js`), so they need no image files. To drop the label from a project, remove its `'concept' => true` line in `ace360_work()` (`inc/content.php`).

### About the demo film

The film is HTML animated with GSAP (`template-parts/demo.php`, `assets/js/demo.js`), not a video file, so it is sharp at any size, weighs a few kilobytes and can jump to chapters. Its on-screen text is in English. The example quote (€2,240, launch 28 May) and scores in it illustrate the process and are not a real client.

## Credits

three.js r149 (MIT), GSAP 3.12.5 (GreenSock standard license, free for websites), Lenis (MIT), Inter and JetBrains Mono (SIL Open Font License).
