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
| **Sitemap** | `/wp-sitemap.xml` now includes `/wp-sitemap-acepages-1.xml` (all 18 theme URLs). Author sitemap removed; the static front page is not listed twice. |
| **Robots** | Thank-you, cancel and search URLs get `noindex`. |
| **Internal links** | Services on the home page link to their landing page ("Meer over …"); footer has Services + Popular columns; every landing page links to three related pages and the portfolio. |
| **Home H1** | Now contains the keyword: "Website laten maken? Zie de *prijs* vooraf." / "Need a website? See the *estimate* first." |
| **Settings** | Customizer → *ace360 search engines (SEO)*: city/address (optional), social profile URLs, Google Search Console and Bing verification codes. |

No SEO plugin is needed. If Yoast, Rank Math, AIOSEO or SEOPress is installed, the theme leaves titles, descriptions,
canonical and social tags to that plugin and only adds hreflang and the business data.

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
