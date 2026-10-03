# Ace 360 · SEO plan (practise what we teach)

Goal: clients find Ace 360 on Google and Bing for what they already search, and land on a page that answers it,
shows an estimate and lets them book a call.

Honest expectation: a new site does not rank in days. Business-name searches and long, specific searches
("one page website laten maken", "website met online afspraken") come first, usually within weeks to a few months.
Broad terms like "website laten maken" are very competitive and take longer, plus reviews and links from other sites.
Nobody can promise a #1 position; this plan does the things that work.

## 1. What the theme now does (v5.11.0)

| Area | What changed |
|---|---|
| **Languages** | Dutch at `/`, English at `/en/` (`/en/work/`, `/en/<page>/`). Each URL contains one language only (was: both languages in one page, one hidden by JavaScript). The NL/EN switch links to the same page in the other language; a visitor who chose English is taken to `/en/` automatically. Old `?lang=en` links 301-redirect. |
| **Landing pages** | 7 topics × 2 languages = 14 pages (below), each with unique copy, prices from the estimator, the estimator preset for that service, an FAQ, related links and the booking calendar. |
| **Titles & descriptions** | Written per page, all within Google's limits (titles ≤ 56, descriptions ≤ 158 characters). |
| **Canonical + hreflang** | Every theme page says which URL is the original and where its other-language version is (`nl`, `en`, `x-default`). |
| **Structured data** | ProfessionalService (name, phone, email, KvK, languages, area served, service catalogue), WebSite, BreadcrumbList, Service with price range per landing page, FAQ on the home and landing pages. |
| **Social sharing** | Open Graph + Twitter card with `assets/img/og-image.jpg` (1200 × 630, from `marketing/og/`). |
| **Sitemap** | `/wp-sitemap.xml` now includes `/wp-sitemap-acepages-1.xml` (every theme page in both languages, plus /blog/ and /en/blog/; posts are in the posts sitemap). Author sitemap removed; the static front page is not listed twice. |
| **Robots** | Thank-you, cancel and search URLs get `noindex`. |
| **Internal links** | Services on the home page link to their landing page ("Meer over …"); footer has Services + Popular columns; every landing page links to three related pages and the portfolio. |
| **Home H1** | Now contains the keyword: "Website laten maken? Zie de *prijs* vooraf." / "Need a website? See the *estimate* first." |
| **Settings** | Customizer → *ace360 search engines (SEO)*: city/address (optional), social profile URLs, Google Search Console and Bing verification codes. |

No SEO plugin is needed. If Yoast, Rank Math, AIOSEO or SEOPress is installed, the theme leaves titles, descriptions,
canonical and social tags to that plugin and only adds hreflang and the business data.

## 1b. Added in v5.12.0: more pages and a blog

| Area | What changed |
|---|---|
| **Pages split out of the home page** | `/werkwijze/` (process), `/veelgestelde-vragen/` (every question on the site, with FAQ markup), `/over-ace-360/` (about), `/contact/`, each with an English version (`/en/process/`, `/en/faq/`, `/en/about/`, `/en/contact/`). The menu now links to real pages: Diensten · Werkwijze · Werk · Blog · Vragen. |
| **Industry pages** | `/website-kapper-salon/`, `/website-restaurant/`, `/website-praktijk-fysiotherapeut/`, `/website-aannemer-vakman/` (+ English). Each is written for that trade (not the same text with a new noun), with the estimator preset (booking ticked for salons and practices). |
| **Blog** | `/blog/` (Dutch posts) and `/en/blog/` (English posts), 12 per page, with BlogPosting and breadcrumb markup, a call-to-action to the matching service page and three related posts. Each post has a language and a service (editor sidebar → *Language and service*). |
| **20 starter posts** | In `wordpress-theme/ace360/content/blog/` (14 Dutch, 6 English), each with its own cover image (`assets/img/blog/`, made by `marketing/og/render-blog-covers.js`). They are **published automatically** the first time the site loads after installing the theme, with today's real date (a minute apart, to keep the order). Each is added once; a post you delete or edit is left alone. Comments are closed on them. |

**Dates are real, not backdated.** Search engines judge freshness by when they first find a page, so earlier dates give
no advantage, and Google's guidelines ask for accurate dates. If you prefer a steadier rhythm, publish the posts
over a few weeks instead: after installing, set some of them to *Scheduled* in WP Admin → Posts (Quick Edit → date in
the future), for example two a week.

### The 20 posts → the page each one supports

| # | Post | Lang | Links to |
|---|---|---|---|
| 1 | Website laten maken? Stel deze 6 vragen voordat je betaalt | NL | wat kost een website |
| 2 | One page website of meerdere pagina’s: wat past bij jou? | NL | one page website |
| 3 | WooCommerce of Shopify: welke webshop past bij jouw bedrijf? | NL | webshop laten maken |
| 4 | iDEAL op je webshop: zo werkt het en hierop let je | NL | webshop laten maken |
| 5 | Google Bedrijfsprofiel aanmaken: stap voor stap | NL | SEO en vindbaarheid |
| 6 | Website niet gevonden in Google? 8 oorzaken en oplossingen | NL | SEO en vindbaarheid |
| 7 | De 5-secondentest: werkt jouw homepage? (Short S01 as an article) | NL | website laten maken |
| 8 | Boekingssysteem kiezen voor je salon: 7 aandachtspunten | NL | website voor kapper en salon |
| 9 | WordPress onderhoud: checklist per week, maand en jaar | NL | website onderhoud |
| 10 | Domeinnaam en hosting: waarom ze op jouw naam moeten staan | NL | website laten maken |
| 11 | Websiteteksten schrijven die klanten overtuigen: 7 regels | NL | website laten maken |
| 12 | Website voor zzp’ers: wat moet erop staan? | NL | one page website |
| 13 | Hoe snel moet je website zijn? Laadtijd meten en verbeteren | NL | website onderhoud |
| 14 | Wat moet er wettelijk op je website? KvK, privacy en cookies | NL | website laten maken |
| 15 | New business in the Netherlands? Your website checklist | EN | web design Netherlands |
| 16 | Dutch, English or both? Choosing your website language | EN | web design Netherlands |
| 17 | iDEAL explained: taking payments from Dutch customers | EN | online store |
| 18 | Hiring a web designer in the Netherlands: 7 questions to ask | EN | web design Netherlands |
| 19 | Google Business Profile in the Netherlands: step by step | EN | SEO Netherlands |
| 20 | Booking on your own website or via an app: which is best? | EN | booking website |

Posts 4 and 17 mention the iDEAL → Wero transition (co-branding since January 2026, full move planned to the end of
2027); check it once a year. Posts 12, 14, 15 and 17 contain general legal information with a "not legal advice" note.

**Before they go live, read them once** (WP Admin → Posts): they are written in the Ace 360 voice ("ik/we"), make no
claims about results or clients, and are yours to adjust.

## 1c. Added in v5.13.0: real menu, designed pages, a richer blog

| What | Details |
|---|---|
| **Menu** | Home · Diensten · Werk · Prijzen · Over ons · Blog · Contact (EN: Home · Services · Work · Prices · About us · Blog · Contact), with the current page underlined. Set your own in WP Admin → Appearance → Menus if you prefer. |
| **Slimmer home page** | Keeps the story (hero, problem, fix, try-it, services, process, film, work) and ends with the three newest posts and a call-to-action. The price calculator moved to `/wat-kost-een-website/` (the "use these choices" button carries your picks there), the booking calendar to `/contact/`, the questions to `/veelgestelde-vragen/`. |
| **New hub page** | `/diensten/` · `/en/services/`: every service with a screenshot and its starting price, the process in short, and the four industry pages. It links down to the service pages; it does not target their searches itself. |
| **Designed pages** | `/over-ace-360/` (collage, facts, values, process clip) and `/contact/` (call / WhatsApp / mail cards, the booking calendar, what happens next, quick answers). |
| **Blog index** | Newest article as a feature, topic chips and instant search, a rail of short video tips, then a mixed grid (wide, standard and text cards). |
| **Articles** | Four layouts (cover, split, poster, guide) set per post, "in short" box, contents list, reading progress, share buttons. Inside the text: muted looping video clips (play when scrolled into view), concept-design screenshots (click to enlarge), checklists that remember ticks, step cards, before/after pairs, tips, tabs and a quiz. Every post has 1–4 media items. |
| **Media** | `assets/video/blog/` (18 clips cut from our own reels and Shorts, 540×960, no sound) and `assets/img/blog-media/` (23 screenshots of the concept sites). Made with `marketing/blog-media/` (clips.txt, shots.txt, render-shots.js). All screenshots are labelled as concepts or examples. |
| **Existing installs** | Starter posts that were not edited are refreshed to the new version automatically on the first visit after updating the theme. Posts you edited are left alone. |

## 2. Keyword map (one main topic per page, no two pages competing)

| Page (NL / EN) | Main search terms (NL) | Main search terms (EN) |
|---|---|---|
| `/` · `/en/` | Ace 360 Services, webdesign, websites en webshops | Ace 360, web design Netherlands, websites |
| `/website-laten-maken/` · `/en/web-design-netherlands/` | website laten maken, wordpress website laten maken, website laten maken zzp | web designer Netherlands, English speaking web designer, website design Netherlands |
| `/one-page-website-laten-maken/` · `/en/one-page-website/` | one page website laten maken, goedkope website laten maken, simpele website | one page website, affordable website Netherlands |
| `/webshop-laten-maken/` · `/en/online-store/` | webshop laten maken, woocommerce webshop, shopify webshop, webshop met iDEAL | online store Netherlands, Shopify developer Netherlands, WooCommerce |
| `/website-onderhoud/` · `/en/website-maintenance/` | website onderhoud, wordpress onderhoud, onderhoudscontract website | WordPress maintenance, website care plan |
| `/website-met-online-boeken/` · `/en/booking-website/` | website met online afspraken, boekingssysteem website, online afspraken maken kapper / salon | booking website, appointment booking website salon |
| `/wat-kost-een-website/` · `/en/website-cost/` | wat kost een website, website laten maken kosten, webshop kosten | how much does a website cost Netherlands |
| `/seo-vindbaarheid/` · `/en/seo-netherlands/` | seo, vindbaarheid google, google bedrijfsprofiel | SEO Netherlands, local SEO |
| `/work/` · `/en/work/` | portfolio webdesign, voorbeelden websites | web design portfolio |
| `/website-kapper-salon/` · `/en/salon-website/` | website kapper, website kapsalon, website schoonheidssalon | salon website |
| `/website-restaurant/` · `/en/restaurant-website/` | website restaurant, menukaart website, horeca website | restaurant website Netherlands |
| `/website-praktijk-fysiotherapeut/` · `/en/practice-website/` | website fysiotherapeut, website praktijk, website therapeut | practice website, therapist website |
| `/website-aannemer-vakman/` · `/en/tradesperson-website/` | website aannemer, website loodgieter, website schilder | tradesperson website |
| `/diensten/` · `/en/services/` | hub: website laten maken diensten, webdesign diensten (links down to the service pages) | web design services Netherlands |
| `/werkwijze/`, `/veelgestelde-vragen/`, `/over-ace-360/`, `/contact/` | supporting pages (process, FAQ, about, contact) | |
| `/blog/` · `/en/blog/` | informational searches (see the post table) | |

Search volumes were not measured (no keyword tool in this setup). After launch, Search Console shows the real
searches; use them to adjust titles and add pages (see section 5).

## 3. Launch checklist (once, in this order)

1. Install the new theme zip (`wordpress-theme/dist/ace360-theme.zip`) and open the site once; the new URLs are
   registered automatically (no permalink save needed). Check `/en/`, `/website-laten-maken/`, `/wp-sitemap.xml`.
2. **Settings → Reading:** "Discourage search engines" must be **off**. **Settings → Permalinks:** "Post name".
3. **Customizer → ace360 search engines (SEO):** fill in the city (and address if you want it public) and the
   Instagram, YouTube, TikTok and LinkedIn URLs.
4. **Google Search Console** (search.google.com/search-console): add `https://www.ace360services.nl` as a
   URL-prefix property, choose *HTML tag*, paste only the code into the Customizer field, verify. Then
   *Sitemaps* → submit `wp-sitemap.xml`. Use *URL inspection* → *Request indexing* for `/`, `/en/` and the 7 Dutch landing pages.
5. **Bing Webmaster Tools** (bing.com/webmasters): *Import from Google Search Console* (fastest), or the meta-tag
   code in the Customizer. Bing also feeds DuckDuckGo, Ecosia and Yahoo.
6. **Google Business Profile** (business.google.com): category *Website designer*, service area Netherlands
   (hide the address if you work from home), phone, website, hours, the services with "from" prices, photos
   (logo, cover, work). Ask the first clients for a review.
7. Check the rich results: search.google.com/test/rich-results with a landing-page URL (should show
   Organization/LocalBusiness, Breadcrumbs, FAQ).

## 4. Off-site (what makes Google trust the site)

- **Reviews:** a Google review from every finished client (send the direct review link from the Business Profile).
- **Profiles that link back:** LinkedIn company page, YouTube channel *About* + every Short's description,
  Instagram/TikTok bio, KvK listing, Trustoo, Werkspot, Bedrijvenpagina.nl, Google Business Profile.
  Same name, phone and website everywhere.
- **Client sites:** a small "Website: Ace 360 Services" credit in the footer of sites you build (with permission).
- **Shorts ↔ pages:** link each Short to the page that teaches the same thing, e.g.
  S03 *The missed call* → `/website-met-online-boeken/`, S02 *4 questions* → `/wat-kost-een-website/`,
  S01 *5-second test* → `/website-laten-maken/`.

## 5. Every month (30 minutes)

1. Search Console → *Performance*: which searches show the site, which pages get clicks. A page with many
   impressions but few clicks needs a better title/description (`inc/landings.php`).
2. New page ideas come from real searches. Good next candidates: industry pages that teach something specific
   ("website voor kapsalon", "website voor restaurant", "website voor fysiotherapeut"), not city-name copies.
3. Keep prices in `inc/landings.php` in step with the estimator (`ace360_estimator()` in `inc/content.php`).
4. One new Short a week, linked from the matching page and linking back to it.

## Files

- `wordpress-theme/ace360/inc/lang.php`: language routing (`/en/`), switch, URL helpers
- `wordpress-theme/ace360/inc/landings.php`: the landing pages' copy, prices, FAQ, slugs (edit text here)
- `wordpress-theme/ace360/landing.php`: landing page template
- `wordpress-theme/ace360/inc/seo.php` + `inc/sitemap-provider.php`: head tags, structured data, sitemap
- `marketing/og/og.html` + `render-og.js`: the social sharing image
