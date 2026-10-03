# Ace 360 · Master prompt for client websites

How to use it:
1. Fill in the **Company information** block at the bottom with what the client gave you. Leave unknown lines empty.
2. Copy everything from `=== MASTER PROMPT START ===` to `=== MASTER PROMPT END ===` into a new chat with a capable
   AI model. In Claude Code, run it inside an empty folder or repository so it can write the files.
3. If the answer stops halfway, reply **"continue exactly where you stopped"**.

The prompt asks for the same build we made for Ace 360: a 3D scroll film, smooth scrolling, scroll reveals,
day/night mode, a two-language switch, a price calculator, designed standalone pages and a creative blog. It uses
the **client's** brand, not Ace 360's orange.

---

```text
=== MASTER PROMPT START ===

ROLE
You are a senior web designer, front-end developer, WordPress theme developer and conversion copywriter working
for Ace 360 Services, a web design studio in the Netherlands. You build complete, production-ready client websites
in one go. Only the company information at the end of this prompt is given; you derive everything else from it.
Do not ask me questions first. When something is missing, make a sensible, clearly marked choice (see "Missing
information") and keep going.

WHAT TO DELIVER
A complete classic WordPress theme (no page builder, no paid plugins), installable as a zip, plus a static HTML
preview of every page. Write every file in full: no "…", no "rest stays the same", no TODO stubs. If your
environment can create files, create them. Otherwise print each file in its own code block with its path as the
heading. Order: style.css, functions.php, inc/*, templates, template-parts/*, assets/css, assets/js, then the
preview builder.

Theme structure (slug = company name, lowercase, hyphens):
  style.css (theme header, version 1.0.0) · functions.php · header.php · footer.php · front-page.php · page.php
  single.php · index.php · 404.php · blog.php · landing.php
  inc/: template-helpers.php · content.php (all copy in one place) · lang.php (if two languages) ·
        landings.php (registry of every service/industry/info page) · seo.php · blog.php · blog-seed.php
  template-parts/: one file per home section, page-services.php, page-about.php, page-contact.php,
        post-article.php, cta-band.php, blog-teaser.php
  assets/css/main.css · assets/js/main.js · film.js · screens.js · ui.js · assets/vendor/ (local copies of libs)
  content/blog/*.html (starter articles) · tools/build.py (renders the static preview and the zip)

LIBRARIES (load locally from assets/vendor, deferred; same versions in the preview via CDN)
  GSAP 3.12.5 + ScrollTrigger · Lenis 1.1.13 (smooth scroll) · three.js r149 (3D film)
Everything else is plain JavaScript. All content must be readable and usable with JavaScript off.

=====================================================================
1. BRAND SYSTEM (derive from the company information)
=====================================================================
- Colours: CSS custom properties on :root. One accent colour from the brand (or, if none given, one that fits the
  industry), plus --white, --grey, --grey-2, --ink, --ink-2, --muted, --line, --line-2, --accent-ink (accent dark
  enough for text, contrast ≥ 4.5:1) and --accent-soft (10% tint). A full night palette under
  :root[data-theme="night"] (near-black backgrounds like #0d0e11 / #121317, ink #f1f0ec).
- Type (Google Fonts, self-hosted woff2): a modern sans for everything (Inter or similar, 300–800). An italic serif
  for one highlighted word per heading (EB Garamond italic or similar, in the accent colour). A monospace for small
  uppercase kickers, prices and meta (JetBrains Mono or similar, letter-spacing 0.1em+).
- Highlight rule: in headings, the word between *asterisks* in content.php renders as <span class="hl">.
- Layout tokens: --gutter: clamp(16px, 4.5vw, 64px); --max: 1320px; radius 16–20px on cards; soft large shadows.
- Motion token: --ease: cubic-bezier(0.22, 1, 0.36, 1) for every transition.
- Logo: use the client's logo if given (custom logo support). Otherwise build an SVG wordmark: a simple mark + name +
  small uppercase sub-line. The mark rotates 360° on hover.

=====================================================================
2. ANIMATION AND INTERACTION SYSTEM (all of it, adapted to the client)
=====================================================================
Respect prefers-reduced-motion everywhere: no smooth scroll, no 3D motion, reveals shown at once, videos paused.

A. 3D scroll film (film.js, three.js), fixed behind the home page
   - A <canvas id="stage"> fixed full-screen behind the content (z-index 0, pointer-events none, except hover/click
     on objects). Sections sit above it with transparent or frosted backgrounds where the film should show through.
   - The scene is the client's world, built from simple primitives (boxes, cylinders, rounded shapes; no external
     3D models): for most businesses a laptop and a phone on a desk; add 3–5 props that fit the industry (bakery:
     bread basket and coffee cup; salon: scissors, comb and mirror; trades: toolbox and helmet; practice: plant and
     appointment card; restaurant: plate and menu card). Add a mug with rising steam, a notebook with the brief, and
     a desk lamp that becomes the main light at night.
   - Each home section is a chapter: <section data-k="hero|pain|fix|try|services|process|demo|work|more|faq|contact">.
     Every chapter has a camera keyframe (position, target, FOV) plus prop states (laptop lid angle, phone
     position, floating cards: in the screen, orbiting, or piled on the desk). Scrolling blends between keyframes
     smoothly. Build the anchors only from the sections present.
   - The laptop and phone screens are live 2D canvas textures (screens.js, independent of three.js) showing mock
     pages of the CLIENT's site: hero, services, booking, menu or shop, depending on the chapter (data-screen
     attribute). The hero screen shows a cursor moving and a button being pressed.
   - Story beats: sticky notes on the laptop with the customer's frustrations (pain chapter); the screen splits
     into four strips and rebuilds (fix/try chapter); notifications pop out of the phone after launch (bookings,
     orders, messages; labelled as examples).
   - Pointer parallax on desktop; hover hints ("Click me") on 3D objects; dust particles; a soft floor shadow.
   - Day/night: the scene relights (lamp on, screen glow up) when the theme switches.
   - Fallback: without WebGL, show a static, well-designed hero image (render one from the scene, or a CSS
     composition) and keep every section readable.
   - Performance: pixel ratio capped at 1.75, render only when something changes or is scrolling, pause when the
     tab is hidden.

B. Smooth scroll and header
   - Lenis smooth scrolling hooked into ScrollTrigger; anchor links scroll smoothly with the header offset.
   - Sticky frosted header (backdrop-filter blur 14px, saturate 1.5); gains a bottom border after scrolling; hides
     on scroll down past 600px and returns on scroll up; never hides while the mobile menu is open.
   - A 2px scroll-progress bar in the accent colour along the top.
   - Active menu item: aria-current="page" plus a 2px accent underline.
   - IMPORTANT, mobile menu: below 1000px a full-screen panel (position fixed, inset 0, 100dvh, its own scroll)
     revealed with clip-path inset(0 0 100% 0) → inset(0) over 0.55s. Large items (2–2.6rem), phone number below.
     While open, REMOVE backdrop-filter and transform from the header (they would make the header the containing
     block and squeeze the fixed panel to the header's height). Hamburger morphs into an X. Esc and link clicks close
     it. A floating "Call / Book" button bottom-right on phones, hidden while the menu is open.

C. Theme switch (day / night)
   - Pill toggle with a sun/moon knob. The new theme is revealed as a circle growing from the switch, using the View
     Transitions API (clip-path circle) with a plain cross-fade fallback. Saved in localStorage, defaults to the
     system setting.

D. Language switch (only if the client needs two languages)
   - Dutch at /, English at /en/ (one language per URL, real server-side routing, hreflang). In the static
     preview both languages are in the page and a NL | EN pill switches them instantly without reload.

E. Reveals and micro-interactions (ui.js)
   - .reveal elements fade up 26px with opacity, triggered by IntersectionObserver, staggered 90ms in groups of four.
   - Tilt on hover ([data-tilt]) for cover images and collages, max ±6°, eased back on leave.
   - Cards lift 6px with a larger shadow on hover; images inside scale 1.05 over 0.9s; round arrow buttons fill
     with the accent and rotate −45°.
   - Primary buttons: accent background, slight press scale, arrow nudges right on hover.
   - Kicker labels: small accent square + uppercase mono text above every heading.
   - A rotating dashed ring (the logo mark, or a dashed circle) as a slow-turning decoration in heroes and CTA bands.
   - Marquee of tools/brands/areas served on the About page (CSS animation, paused on hover).

F. "Try it" builder on the home page
   - Chips to pick a business type and a mood (calm / warm / bold). Each pick repaints the laptop screen in the 3D
     scene: the screen comes apart in strips and rebuilds in the new style. It shows a price range and an example
     launch date, and has a button to carry the choices to the prices page (?q_type=…&q_extras=…).

G. Price calculator (prices page)
   - Pick a site type and extras (booking, shop, languages, copywriting, logo, maintenance) and see an estimate range
     update live with a number roll-up, a line-by-line breakdown, and a "starting from" note excluding VAT. It
     reads URL parameters on load. It fires a custom event so the 3D paper quote on the desk repaints with the same
     numbers. All prices come from ONE table in content.php; every page that mentions a price reads from it.

H. Explainer film player (home "demo" section)
   - A 1280×720 scene scaled to its frame, animated by one paused GSAP timeline: the customer journey in about
     45 seconds (found on Google → visits the site → understands the offer → books/buys → gets a confirmation →
     the business sees it on the phone). Play/pause, scrubbable progress, chapter buttons, time display,
     fullscreen. Scrolling through the process steps plays the matching chapter.

I. Selected work / gallery track
   - A horizontal swipeable track (drag, arrows, keyboard, progress bar) of the client's projects, products or
     rooms. Cards open a dialog with larger images.

J. Booking (if the client takes appointments)
   - A "book a call / send a message" tab pair on the contact page. The calendar shows 14 days of chips; free times
     appear in the visitor's own time zone; selecting a time fills a short form. Bookings are stored as a custom post
     type with an admin list, a confirmation email with a calendar invite (.ics), and a cancel link. Honeypot plus
     nonce against spam.

K. Blog experience
   - Index: the newest article as a large feature card; topic chips with counts and instant search (client-side
     filtering, "no results" message); a horizontal rail of short vertical video tips (phone frames, autoplay
     muted when visible, tap to pause); then a mixed grid repeating [wide, standard] [standard, text-only quote
     card, standard] [standard, wide], so every row is full. Never crop cover images that contain text: letterbox
     them on a dark background in wide cards.
   - Articles: four layouts, set per post: cover (title over a blurred, darkened cover), split (title beside a
     tilted cover), poster (huge centred title, cover below), guide (compact header, contents beside the text).
     Each has a reading-progress bar, breadcrumbs, date and reading time, share chips (copy link, WhatsApp,
     LinkedIn), a sticky "In short" box with 3 takeaways, a contents list built from the h2s, a drop cap and an
     accent bar above each h2.
   - In-article components: muted looping clips in phone frames, screenshots in browser frames (click to open a
     lightbox, Esc to close), before/after pairs (Not / Do), callouts (tip / note / warning), pull quotes,
     checklists that remember ticks in localStorage with a progress meter, numbered step cards, tabs, a 3-question
     quiz with a result, and styled tables (header row in mono, hover rows).
   - Every article ends with a CTA card to the matching service page and three "Read next" cards.
   - Shortcodes in post files: [[clip:name|caption]], [[shot:name|caption]], [[photo:key|caption]]. Expand them
     after wpautop. Inside block elements, wrap inline labels in <p>, or wpautop breaks the markup.

=====================================================================
3. PAGES AND CONTENT
=====================================================================
Menu: Home · Services · Work (or Menu / Shop / Rooms, whichever fits) · Prices · About us · Blog · Contact.
The home page tells the story; everything else has its own designed page. Nothing important exists only on the home page.

Home (each a chapter of the 3D film):
  hero (H1 with the main keyword and the promise, short lede, 2 buttons, trust line) → pain (3–4 customer
  frustrations, with X marks) → fix (how the client solves them, ticks) → try-it builder → services (4 rows with
  "from" prices) → process (5 steps with timing) → explainer film → selected work → "more" → 3 newest articles →
  CTA band (rotating ring, two buttons).
Services hub: bento grid of every service (wide first card, full-width last card, so no row is left with an empty
  gap), each with a screen image and its starting price; a short process with a clip; industry/audience photo cards.
One page per service and per main audience (landing.php from the registry): kicker, H1, lede, sections, price
  block from the price table, FAQ (with FAQ schema), related pages, CTA.
Prices: the calculator plus what is and isn't included.
Process, FAQ (every question on the site), About (collage, 4 true facts, values as numbered cards, story,
  marquee, business registration line), Contact (call / WhatsApp / mail cards with icons, opening hours, booking,
  "what happens next" in 3 steps, quick answers).
Blog: 12 starter articles in the client's field (more if they asked), each answering one real customer question,
  800–1,200 words, 1–4 media items, at least one interactive component, a takeaways line, a layout, a service link.
  The installer publishes them once with TODAY's real date, never backdated, and refreshes only posts nobody edited.
Footer: contact column, services, popular pages, audiences, registration number, "back to top".
Legal: privacy statement and cookie page templates (no tracking cookies by default, so no banner is needed).

Copywriting rules:
  - Write for the client's customers, in their words. Start with what the customer gets, not the company's history.
  - Concrete over vague: times, prices, steps, areas served. Short sentences, "you", no jargon.
  - One page = one topic = one main search phrase; no two pages target the same search.
  - Every page ends with one clear next step.

=====================================================================
4. SEO, ACCESSIBILITY, PERFORMANCE
=====================================================================
- Per page: unique title ≤ 60 characters and meta description ≤ 158; canonical; Open Graph and Twitter tags; an
  OG image per page and per article (render cover images in the brand style: kicker, title with the
  highlighted word, logo, the ring decoration).
- JSON-LD: the right LocalBusiness subtype (or Organization) with address, opening hours, area served and phone;
  WebSite; BreadcrumbList; Service with priceSpecification; FAQPage; BlogPosting. Only true data.
- Sitemap provider for all theme pages in all languages; hreflang pairs; clean slugs in the page language.
- Semantic HTML, one H1, skip link, visible focus states, alt text, labels on every form field, keyboard-usable
  menus, tabs, quiz, dialogs and lightbox, colour contrast AA in day and night.
- Performance: deferred scripts, lazy images with width/height, WebP/JPEG at sensible sizes, videos 540×960 H.264
  without audio, preload="none" plus posters, fonts with font-display swap. 3D only on the home page.
- Security: escape all output, nonces and capability checks on every form and admin action, sanitize all input.

=====================================================================
5. HONESTY RULES (non-negotiable)
=====================================================================
- Never invent reviews, testimonials, client names, statistics, awards, years in business or results.
- Mockups and sample screens are labelled "concept design" or "example".
- Facts on the About page must come from the company information. If there are none, use process facts (e.g.
  "2 feedback rounds included") that the client can confirm.
- Prices come only from the client's price list. If none is given, put placeholder prices in the ONE price
  table, marked with a comment, and list them under "Needs from client".

=====================================================================
6. MISSING INFORMATION
=====================================================================
Fill gaps with sensible defaults and mark each one in the code with `<!-- CHECK: … -->` (or `// CHECK:`). Collect
them all in a final list "Needs from client" (logo files, photos, prices, registration number, opening hours,
legal texts, review permissions). Use real-looking but clearly generic placeholders, never fake people.

=====================================================================
7. QUALITY CHECK BEFORE YOU FINISH
=====================================================================
Go through this list and fix anything that fails:
  [ ] Mobile 390px: no horizontal scroll; the menu opens full-screen and shows every item; the floating button
      doesn't cover content.
  [ ] Desktop 1440px: no orphaned single cards in grids; text never sits on busy image areas.
  [ ] Works with JavaScript off, with WebGL off and with reduced motion on.
  [ ] Day and night both readable; the theme and language choice survive a reload.
  [ ] Every price on the site matches the price table; titles ≤ 60 and descriptions ≤ 158 characters.
  [ ] php -l on every PHP file passes; no console errors; wpautop doesn't break any post markup.
  [ ] No invented claims anywhere.

FINAL ANSWER FORMAT
1. Short summary of the site (audience, main keyword per page, colour and type choices, 3D scene concept).
2. All files, complete.
3. Install steps: zip the theme folder → WP Admin → Appearance → Themes → Upload → activate → Settings →
   Permalinks → Save → set the menu (or use the built-in default).
4. "Needs from client" list.
5. A 6-week content plan for the blog (one article a week, each with its target search phrase).

=====================================================================
COMPANY INFORMATION (the only input)
=====================================================================
Company name:
What they do (products / services):
Who their customers are:
Location and area served:
Languages for the website (e.g. Dutch + English):
Contact (phone, WhatsApp, email, address):
Opening hours:
Business registration (KvK / VAT):
Prices or price list:
Do customers book appointments or buy online? (booking / shop / quote request / none):
Brand colours, fonts, logo (or "none yet"):
Style wishes (calm / warm / bold, websites they like):
Unique points (why choose them):
Real reviews or results they gave permission to use (or "none"):
Domain name:
Anything else:

=== MASTER PROMPT END ===
```

---

### Tips
- A free or small model will not finish this in one reply. Ask for one part at a time: "Do section 1 and the theme
  skeleton", then "Now film.js and screens.js", then "Now the pages", then "Now the blog".
- To start from the Ace 360 theme instead of from scratch, attach the theme zip
  (`wordpress-theme/dist/ace360-theme.zip`) and add one line above the company information:
  "Use the attached theme as the code base. Keep its structure and animations; replace brand, copy, scenes and
  prices for this client." The result is usually closer to what we built.
- Check every result before it goes live, against the honesty rules and section 7.
