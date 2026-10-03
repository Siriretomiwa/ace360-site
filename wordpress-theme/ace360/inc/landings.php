<?php
/**
 * Landing pages: one page per thing people search for ("website laten maken", "webshop laten maken",
 * "wat kost een website" …), in Dutch at /<slug>/ and in English at /en/<slug>/. Rendered by landing.php,
 * listed in the sitemap and described to search engines by inc/seo.php.
 *
 * Prices quoted here follow the estimator (ace360_estimator() in inc/content.php). Change both together.
 *
 * @package ace360
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * All landing pages.
 *
 * Each: slug (nl/en), service (schema serviceType, '' for a guide), est (estimator type to preselect),
 * extras (estimator extras to tick), show (blocks below the copy: process, estimator, faq, allfaq, contact;
 * default estimator + faq + contact),
 * price (from/to in euros ex VAT, null for none), title + desc (search result), kicker, h1, lede,
 * sections (h, p[], list[]), faq ([q, a]), related (keys).
 *
 * @return array
 */
function ace360_landings() {
	$p = 'ace360_pair';
	return apply_filters(
		'ace360_landings',
		array(
			'website'   => array(
				'slug'     => array( 'nl' => 'website-laten-maken', 'en' => 'web-design-netherlands' ),
				'service'  => 'Web design',
				'est'      => 'website',
				'price'    => array( 1000, 1300 ),
				'title'    => $p( 'Web design in the Netherlands, in English', 'Website laten maken? Indicatie vanaf € 1.000' ),
				'desc'     => $p( 'A professional website built in WordPress by an English-speaking designer in the Netherlands. See your estimate online and get a fixed launch date.', 'Website laten maken in WordPress: snel, zakelijk en van jou. Bekijk direct je prijsindicatie, een vaste lanceerdatum en één aanspreekpunt.' ),
				'kicker'   => $p( 'Web design · Netherlands & worldwide', 'Website laten maken · heel Nederland' ),
				'h1'       => $p( 'A website for your business, built *in English*', 'Website laten maken die *voor je werkt*' ),
				'lede'     => $p( 'For businesses in the Netherlands that would rather talk in English, and for companies abroad. One person designs and builds your site, you see an estimate before we talk, and the final price is fixed in writing before anything gets built.', 'Een website die laat zien wat je doet, voor wie, en wat de bezoeker nu moet doen: bellen, boeken of kopen. Je ziet vooraf een prijsindicatie, de definitieve prijs staat op papier vóór we beginnen, en je hebt één aanspreekpunt van kennismaking tot lancering.' ),
				'sections' => array(
					array(
						'h'    => $p( 'What you get', 'Wat je krijgt' ),
						'list' => array(
							$p( 'A site that works on every phone, tablet and screen', 'Een site die werkt op elke telefoon, tablet en elk scherm' ),
							$p( 'Five pages included (home, services, about, prices, contact, or your own mix)', 'Vijf pagina’s inbegrepen (home, diensten, over, prijzen, contact, of je eigen indeling)' ),
							$p( 'Built in WordPress, so you can change text, photos and prices yourself', 'Gebouwd in WordPress, zodat je zelf tekst, foto’s en prijzen aanpast' ),
							$p( 'Contact form, click-to-call and WhatsApp buttons', 'Contactformulier, bel-knop en WhatsApp-knop' ),
							$p( 'Fast loading, a clean code base and the technical SEO basics', 'Snelle laadtijd, nette code en de technische SEO-basis' ),
							$p( 'Two rounds of design feedback before the build', 'Twee feedbackrondes op het ontwerp vóór de bouw' ),
							$p( 'Domain, hosting and every login in your name', 'Domein, hosting en alle inloggegevens op jouw naam' ),
						),
					),
					array(
						'h' => $p( 'What a website costs', 'Wat kost een website laten maken?' ),
						'p' => array(
							$p( 'A website with up to five pages is estimated at €1,000 to €1,300 excluding VAT, with a proven layout styled to your brand. Every extra page adds about €50 to €65. A fully custom design adds around 40%. Copywriting, photography, a second language or a booking system are optional extras, each with its own estimate in the calculator below.', 'Een website tot vijf pagina’s heeft een indicatie van € 1.000 tot € 1.300 exclusief btw, met een bewezen opzet in jouw huisstijl. Elke extra pagina kost ongeveer € 50 tot € 65. Volledig maatwerk in het ontwerp komt er ongeveer 40% bij. Teksten, fotografie, een tweede taal of een boekingssysteem zijn losse opties, elk met een eigen indicatie in de calculator hieronder.' ),
							$p( 'Only need one page? A one-page website starts from €500.', 'Heb je maar één pagina nodig? Een one-page website begint vanaf € 500.' ),
						),
					),
					array(
						'h' => $p( 'From first call to launch in 2 to 3 weeks', 'Van kennismaking tot lancering in 2 tot 3 weken' ),
						'p' => array(
							$p( 'It starts with a free 20-minute call about what the site has to bring in. Within two days you get the final price, a launch date and a list of what is and is not included. You see the design before anything gets built, then watch the site come together on a test address. At launch you get the logins and a walkthrough, so you can run it yourself.', 'Het begint met een gratis kennismaking van 20 minuten over wat de site moet opleveren. Binnen twee dagen krijg je de definitieve prijs, een lanceerdatum en een lijst van wat wel en niet is inbegrepen. Je ziet het ontwerp voordat er iets gebouwd wordt en kijkt mee op een testadres. Bij de lancering krijg je de inloggegevens en een rondleiding, zodat je de site zelf kunt beheren.' ),
						),
					),
					array(
						'h' => $p( 'Who it is for', 'Voor wie' ),
						'p' => array(
							$p( 'Self-employed professionals, shops, salons, restaurants, practices, charities and international businesses with a Dutch presence. If you would rather discuss your website in English, that is the default here, not an exception. Dutch works just as well.', 'Zzp’ers, winkels, salons, restaurants, praktijken, goede doelen en internationale bedrijven in Nederland. Gesprekken gaan in het Nederlands of het Engels, net wat jij prettig vindt, en ik werk voor klanten in heel Nederland en daarbuiten.' ),
						),
					),
				),
				'faq'      => array(
					array( $p( 'How long does it take to build a website?', 'Hoe lang duurt het om een website te laten maken?' ), $p( 'A website of up to five pages usually goes live in 2 to 3 weeks after the design is approved. A one-pager takes 1 to 2 weeks. The launch date is in your quote.', 'Een website tot vijf pagina’s staat meestal 2 tot 3 weken na akkoord op het ontwerp live. Een one-pager duurt 1 tot 2 weken. De lanceerdatum staat in je offerte.' ) ),
					array( $p( 'Can I update the website myself?', 'Kan ik de website zelf aanpassen?' ), $p( 'Yes. It is built in WordPress, and you get a walkthrough and a short guide at handover. Text, photos, prices and job listings are yours to change.', 'Ja. De site is gebouwd in WordPress en bij de overdracht krijg je een rondleiding en een korte handleiding. Tekst, foto’s, prijzen en vacatures pas je zelf aan.' ) ),
					array( $p( 'Do you work with clients outside the Netherlands?', 'Werk je ook voor klanten buiten Nederland?' ), $p( 'Yes, fully remote. Calls are planned around your time zone and quotes are in euros. EU businesses with a VAT number are invoiced with VAT reverse-charged.', 'Ja, volledig op afstand. Gesprekken plan ik rond jouw tijdzone en offertes zijn in euro’s. EU-bedrijven met een btw-nummer factureer ik met btw verlegd.' ) ),
					array( $p( 'Who owns the website?', 'Van wie is de website?' ), $p( 'You do. Domain and hosting are registered in your name and you get every login.', 'Van jou. Domein en hosting staan op jouw naam en je krijgt alle inloggegevens.' ) ),
				),
				'related'  => array( 'kosten', 'onepage', 'onderhoud' ),
			),

			'onepage'   => array(
				'slug'     => array( 'nl' => 'one-page-website-laten-maken', 'en' => 'one-page-website' ),
				'service'  => 'One-page website',
				'est'      => 'onepager',
				'price'    => array( 500, 650 ),
				'title'    => $p( 'One-page website from €500, live in 1–2 weeks', 'One page website laten maken vanaf € 500' ),
				'desc'     => $p( 'An affordable one-page website: everything on one fast page, with contact form and WhatsApp button. Estimate from €500, live in 1 to 2 weeks.', 'Betaalbare one page website: alles op één snelle pagina, met contactformulier en WhatsApp-knop. Indicatie vanaf € 500, live in 1 tot 2 weken.' ),
				'kicker'   => $p( 'One-page website', 'One page website' ),
				'h1'       => $p( 'A one-page website, from *€500*', 'Een one page website, vanaf *€ 500*' ),
				'lede'     => $p( 'Not every business needs ten pages. A single, well-built page that says what you do, for whom, and how to reach you is often enough to start, and it can grow into a full site later.', 'Niet elk bedrijf heeft tien pagina’s nodig. Eén goed gebouwde pagina die zegt wat je doet, voor wie, en hoe mensen je bereiken, is vaak genoeg om mee te beginnen. Later kan hij uitgroeien tot een volledige website.' ),
				'sections' => array(
					array(
						'h'    => $p( 'What fits on one page', 'Wat er op één pagina past' ),
						'list' => array(
							$p( 'A clear headline: what you do, for whom and where', 'Een duidelijke kop: wat je doet, voor wie en waar' ),
							$p( 'Your services or menu, with “from” prices if you like', 'Je diensten of menukaart, eventueel met vanaf-prijzen' ),
							$p( 'A short introduction, photos and reviews you already have', 'Een korte introductie, foto’s en reviews die je al hebt' ),
							$p( 'Opening hours, location map, phone, WhatsApp and a contact form', 'Openingstijden, kaart, telefoon, WhatsApp en een contactformulier' ),
							$p( 'Works on every phone and loads fast', 'Werkt op elke telefoon en laadt snel' ),
						),
					),
					array(
						'h' => $p( 'Is a one-pager right for you?', 'Past een one-pager bij jou?' ),
						'p' => array(
							$p( 'A one-pager suits starters, self-employed professionals, events, single-product businesses and anyone who mainly needs to be found and contacted. If you need separate pages per service, a blog or an online store, a multi-page website or a webshop will serve you better; the estimate below shows the difference straight away.', 'Een one-pager past bij starters, zzp’ers, evenementen, bedrijven met één product en iedereen die vooral gevonden en gebeld wil worden. Wil je per dienst een eigen pagina, een blog of een webshop, dan past een website met meerdere pagina’s of een webshop beter; de indicatie hieronder laat het verschil meteen zien.' ),
						),
					),
					array(
						'h' => $p( 'Affordable without cutting corners', 'Betaalbaar zonder in te leveren' ),
						'p' => array(
							$p( 'The estimate is €500 to €650 excluding VAT for a one-pager in a proven layout styled to your brand. You still get the same things as a bigger project: a written quote, a launch date, your own domain and hosting, and the logins. Optional extras like copywriting or a logo are priced separately, so you only pay for what you need.', 'De indicatie is € 500 tot € 650 exclusief btw voor een one-pager in een bewezen opzet in jouw huisstijl. Je krijgt hetzelfde als bij een groter project: een offerte op papier, een lanceerdatum, je eigen domein en hosting, en de inloggegevens. Extra’s zoals teksten of een logo hebben een eigen prijs, zodat je alleen betaalt voor wat je nodig hebt.' ),
						),
					),
				),
				'faq'      => array(
					array( $p( 'Can a one-page website rank on Google?', 'Kan een one page website gevonden worden in Google?' ), $p( 'Yes, for your business name and a few closely related searches, especially combined with a Google Business Profile. To rank for many different services, separate pages per service work better.', 'Ja, op je bedrijfsnaam en een paar nauw verwante zoekwoorden, zeker samen met een Google Bedrijfsprofiel. Wil je op veel verschillende diensten gevonden worden, dan werken aparte pagina’s per dienst beter.' ) ),
					array( $p( 'Can it grow into a bigger website later?', 'Kan hij later groter worden?' ), $p( 'Yes. It is built in WordPress, so pages can be added later without starting over.', 'Ja. Hij is gebouwd in WordPress, dus pagina’s toevoegen kan later zonder opnieuw te beginnen.' ) ),
					array( $p( 'How fast can it be live?', 'Hoe snel staat hij online?' ), $p( 'Usually 1 to 2 weeks after the design is approved, depending on when text and photos are ready.', 'Meestal 1 tot 2 weken na akkoord op het ontwerp, afhankelijk van wanneer tekst en foto’s klaar zijn.' ) ),
				),
				'related'  => array( 'website', 'kosten', 'seo' ),
			),

			'webshop'   => array(
				'slug'     => array( 'nl' => 'webshop-laten-maken', 'en' => 'online-store' ),
				'service'  => 'E-commerce website development',
				'est'      => 'store',
				'price'    => array( 2150, 2750 ),
				'title'    => $p( 'Online store with iDEAL, est. from €2,150', 'Webshop laten maken met iDEAL vanaf € 2.150' ),
				'desc'     => $p( 'An online store in WooCommerce or Shopify, with iDEAL, shipping and VAT set up correctly. See an estimate online, live in 3 to 5 weeks.', 'Webshop laten maken in WooCommerce of Shopify, met iDEAL, verzendregels en btw goed ingesteld. Bekijk direct je prijsindicatie.' ),
				'kicker'   => $p( 'Online stores · WooCommerce & Shopify', 'Webshop laten maken · WooCommerce & Shopify' ),
				'h1'       => $p( 'An online store that is ready to *sell*', 'Een webshop die klaar is om te *verkopen*' ),
				'lede'     => $p( 'Products, payments, shipping and VAT set up properly before you go live, so your first order is not also your first support ticket. Built in WooCommerce or Shopify, whichever suits how you work.', 'Producten, betalingen, verzending en btw goed ingesteld voordat je live gaat, zodat je eerste bestelling niet ook je eerste probleem is. Gebouwd in WooCommerce of Shopify, net wat bij jouw manier van werken past.' ),
				'sections' => array(
					array(
						'h'    => $p( 'What is included', 'Wat er in zit' ),
						'list' => array(
							$p( 'Shop design in your brand, five content pages included', 'Webshopontwerp in jouw huisstijl, vijf contentpagina’s inbegrepen' ),
							$p( 'iDEAL, cards, Bancontact and more through Mollie (or Shopify Payments)', 'iDEAL, creditcard, Bancontact en meer via Mollie (of Shopify Payments)' ),
							$p( 'Shipping rules, free-shipping thresholds and pickup', 'Verzendregels, gratis verzending vanaf een bedrag en afhalen' ),
							$p( 'Dutch VAT (21% and 9%) and EU rules set correctly', 'Btw (21% en 9%) en EU-regels goed ingesteld' ),
							$p( 'Order emails, invoices and stock levels', 'Bestelmails, facturen en voorraadbeheer' ),
							$p( 'A short, mobile-friendly checkout', 'Een korte afrekenstap die goed werkt op mobiel' ),
						),
					),
					array(
						'h' => $p( 'WooCommerce or Shopify?', 'WooCommerce of Shopify?' ),
						'p' => array(
							$p( 'WooCommerce runs on WordPress: no monthly platform fee, full control and easy to combine with a content-rich website. Shopify is a hosted platform with a monthly subscription, very little maintenance and a strong app store. On the first call we pick the one that fits your products, budget and how much you want to manage yourself.', 'WooCommerce draait op WordPress: geen maandelijkse platformkosten, volledige controle en goed te combineren met een website vol content. Shopify is een gehost platform met een maandabonnement, weinig onderhoud en een sterke app store. In de kennismaking kiezen we wat past bij je producten, je budget en hoeveel je zelf wilt beheren.' ),
						),
					),
					array(
						'h' => $p( 'What a webshop costs', 'Wat kost een webshop laten maken?' ),
						'p' => array(
							$p( 'An online store is estimated from €2,150 to €2,750 excluding VAT, including five content pages and payment setup. Uploading up to 100 products is an optional extra (€175 to €250). Plan 3 to 5 weeks from approved design to launch. Use the calculator below for your own estimate.', 'Een webshop heeft een indicatie van € 2.150 tot € 2.750 exclusief btw, inclusief vijf contentpagina’s en het instellen van betalingen. Producten invoeren (tot 100) is een optie van € 175 tot € 250. Reken op 3 tot 5 weken van goedgekeurd ontwerp tot lancering. Bereken hieronder je eigen indicatie.' ),
						),
					),
				),
				'faq'      => array(
					array( $p( 'Can customers pay with iDEAL?', 'Kunnen klanten betalen met iDEAL?' ), $p( 'Yes. iDEAL is set up through Mollie (WooCommerce) or Shopify Payments, along with cards and other methods you choose.', 'Ja. iDEAL wordt ingesteld via Mollie (WooCommerce) of Shopify Payments, samen met creditcard en andere methodes die je kiest.' ) ),
					array( $p( 'Can I add products myself?', 'Kan ik zelf producten toevoegen?' ), $p( 'Yes. You get a walkthrough at handover. If you prefer, the first 100 products can be uploaded for you.', 'Ja. Je krijgt een rondleiding bij de overdracht. Wil je dat liever niet zelf doen, dan kunnen de eerste 100 producten voor je worden ingevoerd.' ) ),
					array( $p( 'Can you move my existing shop?', 'Kun je mijn bestaande webshop overzetten?' ), $p( 'Usually, yes: products, customers and orders can often be imported. What is possible depends on the current platform, so we check it on the first call.', 'Meestal wel: producten, klanten en bestellingen kunnen vaak worden geïmporteerd. Wat mogelijk is hangt af van het huidige platform, dus dat bekijken we in de kennismaking.' ) ),
				),
				'related'  => array( 'kosten', 'onderhoud', 'website' ),
			),

			'onderhoud' => array(
				'slug'     => array( 'nl' => 'website-onderhoud', 'en' => 'website-maintenance' ),
				'service'  => 'Website maintenance',
				'est'      => 'care',
				'price'    => array( 67.5, 67.5 ),
				'monthly'  => true,
				'title'    => $p( 'WordPress maintenance, est. €67.50 a month', 'Website onderhoud (WordPress) € 67,50 p/m' ),
				'desc'     => $p( 'WordPress maintenance for €67.50 a month: updates, daily backups, security checks and small changes. Monthly summary, cancel any month.', 'WordPress onderhoud voor € 67,50 per maand: updates, dagelijkse back-ups, beveiliging en kleine aanpassingen. Maandelijks opzegbaar.' ),
				'kicker'   => $p( 'Website maintenance', 'Website onderhoud' ),
				'h1'       => $p( 'Website maintenance, so you *don’t* have to think about it', 'Website onderhoud, zodat jij er *niet* aan hoeft te denken' ),
				'lede'     => $p( 'A website is not finished at launch. Plugins need updates, backups need checking and sooner or later something needs changing. The care plan takes all of that off your hands for a fixed monthly estimate.', 'Een website is niet af bij de lancering. Plug-ins hebben updates nodig, back-ups moeten werken en vroeg of laat moet er iets veranderen. Het onderhoudsplan neemt dat allemaal uit handen, voor een vaste maandelijkse indicatie.' ),
				'sections' => array(
					array(
						'h'    => $p( 'What the care plan covers', 'Wat het onderhoudsplan omvat' ),
						'list' => array(
							$p( 'WordPress, theme and plugin updates, tested before they go live', 'Updates van WordPress, thema en plug-ins, getest voordat ze live gaan' ),
							$p( 'Daily backups, kept off the server', 'Dagelijkse back-ups, buiten de server bewaard' ),
							$p( 'Security checks and uptime monitoring', 'Beveiligingscontroles en uptime-monitoring' ),
							$p( 'Half an hour of small changes every month', 'Elke maand een half uur kleine aanpassingen' ),
							$p( 'A short monthly summary of what was done', 'Een kort maandoverzicht van wat er is gedaan' ),
							$p( 'Cancel any month', 'Maandelijks opzegbaar' ),
						),
					),
					array(
						'h' => $p( 'Also for sites built by someone else', 'Ook voor sites die iemand anders bouwde' ),
						'p' => array(
							$p( 'For sites built by Ace 360 the care plan is estimated at €67.50 a month. For an existing WordPress site built elsewhere, the estimate is €95 to €150 a month, depending on the number of plugins and how the site was built; it starts with a short check of the site.', 'Voor sites die door Ace 360 zijn gebouwd is de indicatie € 67,50 per maand. Voor een bestaande WordPress-site die ergens anders is gebouwd is de indicatie € 95 tot € 150 per maand, afhankelijk van het aantal plug-ins en hoe de site in elkaar zit; we beginnen met een korte controle van de site.' ),
						),
					),
					array(
						'h' => $p( 'Why maintenance matters', 'Waarom onderhoud belangrijk is' ),
						'p' => array(
							$p( 'Outdated plugins are a common way into WordPress sites, and a broken contact form can go unnoticed for weeks. Regular updates, tested backups and monitoring keep the site safe, fast and working, and you hear about problems from a report, not from a customer.', 'Verouderde plug-ins zijn een veelvoorkomende ingang voor inbraak op WordPress-sites, en een kapot contactformulier kan weken onopgemerkt blijven. Regelmatige updates, geteste back-ups en monitoring houden de site veilig, snel en werkend, en je hoort het van een rapport, niet van een klant.' ),
						),
					),
				),
				'faq'      => array(
					array( $p( 'What counts as a small change?', 'Wat is een kleine aanpassing?' ), $p( 'Updating text, prices, photos, opening hours or a job listing; adding a page from an existing layout. Bigger work gets a separate estimate first.', 'Tekst, prijzen, foto’s, openingstijden of een vacature aanpassen; een pagina toevoegen op basis van een bestaande opzet. Groter werk krijgt eerst een aparte indicatie.' ) ),
					array( $p( 'Is there a minimum term?', 'Is er een minimale looptijd?' ), $p( 'No. The plan runs month to month and you can cancel any month.', 'Nee. Het plan loopt per maand en is maandelijks opzegbaar.' ) ),
					array( $p( 'Do you maintain Shopify stores?', 'Onderhoud je ook Shopify-winkels?' ), $p( 'Shopify handles its own updates and hosting, so a care plan there is about changes and checks. Ask on the call.', 'Shopify regelt zelf updates en hosting, dus onderhoud draait daar om aanpassingen en controles. Vraag ernaar in de kennismaking.' ) ),
				),
				'related'  => array( 'website', 'webshop', 'seo' ),
			),

			'boeken'    => array(
				'slug'     => array( 'nl' => 'website-met-online-boeken', 'en' => 'booking-website' ),
				'service'  => 'Booking website',
				'est'      => 'website',
				'price'    => array( 1250, 1650 ),
				'title'    => $p( 'Booking website for salons and practices', 'Website met online afspraken maken' ),
				'desc'     => $p( 'A website where customers book themselves, any hour, in your real free times, with confirmations and reminders. For salons, practices and studios.', 'Website met online boeken: klanten plannen zelf een afspraak in je echte vrije tijden, met bevestiging en herinnering. Voor salons en praktijken.' ),
				'kicker'   => $p( 'Booking websites', 'Online afspraken' ),
				'h1'       => $p( 'Let customers *book* while your hands are busy', 'Laat klanten *boeken* terwijl jij aan het werk bent' ),
				'lede'     => $p( 'If your phone rings while you are with a client, a missed call can mean a missed booking. A website with online booking shows your real free times, so people book themselves, day or night, without calling.', 'Gaat je telefoon terwijl je met een klant bezig bent, dan is een gemiste oproep vaak een gemiste afspraak. Een website met online boeken laat je echte vrije tijden zien, zodat mensen zelf boeken, overdag of ’s avonds, zonder te bellen.' ),
				'sections' => array(
					array(
						'h'    => $p( 'What a booking website does', 'Wat een website met online boeken doet' ),
						'list' => array(
							$p( 'Shows your services, prices and real free times', 'Laat je behandelingen, prijzen en echte vrije tijden zien' ),
							$p( 'Customers pick a time and get a confirmation email with a calendar invite', 'Klanten kiezen een tijd en krijgen een bevestiging met agenda-uitnodiging' ),
							$p( 'Automatic reminder emails before the appointment', 'Automatische herinneringsmails vóór de afspraak' ),
							$p( 'Customers can cancel or move it themselves, within your rules', 'Klanten verzetten of annuleren zelf, binnen jouw regels' ),
							$p( 'Optional deposit or payment with iDEAL', 'Optioneel een aanbetaling of betaling met iDEAL' ),
							$p( 'Every booking in one overview for you', 'Alle afspraken voor jou in één overzicht' ),
						),
					),
					array(
						'h' => $p( 'Who it is for', 'Voor wie' ),
						'p' => array(
							$p( 'Hair and beauty salons, barbers, physiotherapists and other practices, coaches, studios, tutors, photographers and trades that work by appointment. The booking system can also be added to an existing website.', 'Kappers, schoonheidssalons, barbers, fysiotherapeuten en andere praktijken, coaches, studio’s, bijlesdocenten, fotografen en vakmensen die op afspraak werken. Het boekingssysteem kan ook aan een bestaande website worden toegevoegd.' ),
						),
					),
					array(
						'h' => $p( 'What it costs', 'Wat het kost' ),
						'p' => array(
							$p( 'A website of up to five pages is estimated at €1,000 to €1,300 excluding VAT; the booking system adds €250 to €350. Already have a website? The booking system can be added as a separate project. Set the options in the calculator below for your own estimate.', 'Een website tot vijf pagina’s heeft een indicatie van € 1.000 tot € 1.300 exclusief btw; het boekingssysteem komt daar met € 250 tot € 350 bij. Heb je al een website? Dan kan het boekingssysteem als los project worden toegevoegd. Zet de opties in de calculator hieronder voor je eigen indicatie.' ),
						),
					),
				),
				'faq'      => array(
					array( $p( 'Do I need a separate booking app?', 'Heb ik een aparte boekingsapp nodig?' ), $p( 'Not necessarily. Booking can run inside your own website, so customers stay on your site and you avoid per-booking commission. If you already use a booking app you like, it can usually be connected instead.', 'Niet per se. Boeken kan in je eigen website, zodat klanten op jouw site blijven en je geen commissie per boeking betaalt. Gebruik je al een boekingsapp die bevalt, dan kan die meestal worden gekoppeld.' ) ),
					array( $p( 'Can I block out holidays and breaks?', 'Kan ik vrije dagen en pauzes blokkeren?' ), $p( 'Yes. You set your working hours, breaks and days off, and only those times can be booked.', 'Ja. Je stelt je werktijden, pauzes en vrije dagen in, en alleen die tijden kunnen geboekt worden.' ) ),
					array( $p( 'Can customers pay a deposit?', 'Kunnen klanten een aanbetaling doen?' ), $p( 'Yes, a deposit or full payment with iDEAL can be added.', 'Ja, een aanbetaling of volledige betaling met iDEAL kan worden toegevoegd.' ) ),
				),
				'related'  => array( 'website', 'onderhoud', 'kosten' ),
			),

			'kosten'    => array(
				'slug'     => array( 'nl' => 'wat-kost-een-website', 'en' => 'website-cost' ),
				'service'  => '',
				'est'      => 'website',
				'price'    => null,
				'title'    => $p( 'What does a website cost? Prices + calculator', 'Wat kost een website laten maken? + calculator' ),
				'desc'     => $p( 'What a website, one-pager or online store costs, what drives the price and which costs come on top. With an online calculator for your own estimate.', 'Wat kost een website, one-pager of webshop laten maken? Wat de prijs bepaalt, welke kosten erbij komen, en een calculator voor je eigen prijsindicatie.' ),
				'kicker'   => $p( 'Guide · website prices', 'Gids · website kosten' ),
				'h1'       => $p( 'What does a website *cost*?', 'Wat kost een website laten *maken*?' ),
				'lede'     => $p( 'It depends on what the site has to do. Here is what drives the price, what our estimates are, which costs come on top, and a calculator to see your own estimate in a minute.', 'Dat hangt af van wat de site moet doen. Hier lees je wat de prijs bepaalt, wat onze indicaties zijn, welke kosten erbij komen, en met de calculator zie je binnen een minuut je eigen prijsindicatie.' ),
				'sections' => array(
					array(
						'h'     => $p( 'Estimates at a glance', 'Prijsindicaties in één oogopslag' ),
						'table' => array(
							array( $p( 'One-page website', 'One page website' ), $p( '€500 – €650', '€ 500 – € 650' ), $p( '1–2 weeks', '1–2 weken' ) ),
							array( $p( 'Website, up to 5 pages', 'Website tot 5 pagina’s' ), $p( '€1,000 – €1,300', '€ 1.000 – € 1.300' ), $p( '2–3 weeks', '2–3 weken' ) ),
							array( $p( 'Online store', 'Webshop' ), $p( '€2,150 – €2,750', '€ 2.150 – € 2.750' ), $p( '3–5 weeks', '3–5 weken' ) ),
							array( $p( 'Maintenance', 'Onderhoud' ), $p( '€67.50 a month', '€ 67,50 per maand' ), $p( 'monthly', 'per maand' ) ),
						),
						'p'     => array(
							$p( 'Estimates exclude VAT. The final price follows after a short call, in writing, before anything gets built.', 'Indicaties zijn exclusief btw. De definitieve prijs volgt na een kort gesprek, op papier, voordat er iets gebouwd wordt.' ),
						),
					),
					array(
						'h'    => $p( 'What drives the price', 'Wat de prijs bepaalt' ),
						'list' => array(
							$p( 'The number of pages and how different they are from each other', 'Het aantal pagina’s en hoe verschillend ze zijn' ),
							$p( 'A proven layout in your style, or a fully custom design (about +40%)', 'Een bewezen opzet in jouw stijl, of volledig maatwerk (ongeveer +40%)' ),
							$p( 'Functions: online booking, payments, a second language, a member area', 'Functies: online boeken, betalen, een tweede taal, een ledengedeelte' ),
							$p( 'Content: do you supply text and photos, or should they be made?', 'Inhoud: lever je zelf tekst en foto’s aan, of moeten die gemaakt worden?' ),
							$p( 'Deadline: a rush job costs about 20% more and saves a week', 'Deadline: met spoed kost ongeveer 20% meer en scheelt een week' ),
						),
					),
					array(
						'h' => $p( 'Costs that come on top', 'Kosten die erbij komen' ),
						'p' => array(
							$p( 'A domain name costs roughly €10 to €20 a year and hosting roughly €5 to €25 a month, depending on the provider and the site. Both are in your own name. Shopify adds a monthly subscription; WooCommerce has no platform fee. Maintenance is optional: you can run the site yourself, or hand it off for €67.50 a month.', 'Een domeinnaam kost ongeveer € 10 tot € 20 per jaar en hosting ongeveer € 5 tot € 25 per maand, afhankelijk van de aanbieder en de site. Beide staan op jouw naam. Shopify heeft een maandabonnement; WooCommerce heeft geen platformkosten. Onderhoud is optioneel: je beheert de site zelf, of je besteedt het uit voor € 67,50 per maand.' ),
						),
					),
					array(
						'h' => $p( 'Cheap, expensive, or right?', 'Goedkoop, duur, of goed?' ),
						'p' => array(
							$p( 'A website builder is the cheapest start, but you build and maintain it yourself. A large agency brings a team and a bigger price. A freelancer or small studio sits in between: one person, a clear price and a direct line. Whatever you choose, ask what is included, whether you see the design first, whose name the domain is in, and who maintains the site after launch.', 'Een websitebouwer is de goedkoopste start, maar je bouwt en onderhoudt hem zelf. Een groot bureau brengt een team en een hogere prijs. Een freelancer of kleine studio zit daartussen: één persoon, een duidelijke prijs en korte lijnen. Wat je ook kiest: vraag wat er is inbegrepen, of je het ontwerp eerst ziet, op wiens naam het domein staat, en wie de site na de lancering onderhoudt.' ),
						),
					),
				),
				'faq'      => array(
					array( $p( 'Are the prices on this page final?', 'Zijn de prijzen op deze pagina definitief?' ), $p( 'No, they are estimates based on comparable projects. The final price is agreed in writing after a short call, before anything gets built.', 'Nee, het zijn indicaties op basis van vergelijkbare projecten. De definitieve prijs spreken we op papier af na een kort gesprek, voordat er iets gebouwd wordt.' ) ),
					array( $p( 'Do the prices include VAT?', 'Zijn de prijzen inclusief btw?' ), $p( 'No, all estimates exclude 21% Dutch VAT. Businesses outside the Netherlands may be invoiced without Dutch VAT.', 'Nee, alle indicaties zijn exclusief 21% btw. Bedrijven buiten Nederland kunnen zonder Nederlandse btw worden gefactureerd.' ) ),
					array( $p( 'Can I pay in instalments?', 'Kan ik in termijnen betalen?' ), $p( 'Usually the project is split into a deposit at the start and the rest at launch. Ask on the call if you need a different arrangement.', 'Meestal wordt het project verdeeld in een aanbetaling bij de start en de rest bij de lancering. Heb je een andere regeling nodig, vraag het in de kennismaking.' ) ),
				),
				'related'  => array( 'website', 'onepage', 'webshop' ),
			),

			'seo'       => array(
				'slug'     => array( 'nl' => 'seo-vindbaarheid', 'en' => 'seo-netherlands' ),
				'service'  => 'Search engine optimization',
				'est'      => 'website',
				'price'    => array( 175, 250 ),
				'priceNote' => true,
				'title'    => $p( 'SEO in the Netherlands: get found on Google', 'SEO en vindbaarheid in Google' ),
				'desc'     => $p( 'Technical SEO, local SEO and a Google Business Profile for small businesses in the Netherlands. Clear pages for what customers search, without empty promises.', 'Technische SEO, lokale vindbaarheid en een Google Bedrijfsprofiel voor kleine bedrijven. Pagina’s voor waar klanten op zoeken, zonder loze beloftes.' ),
				'kicker'   => $p( 'SEO · visibility', 'SEO · vindbaarheid' ),
				'h1'       => $p( 'Be *found* by the people already searching for you', 'Gevonden worden door mensen die al *zoeken*' ),
				'lede'     => $p( 'People search for what you offer every day. SEO makes sure your site is the clear, fast and trustworthy answer, starting with the technical basics and a page for every service.', 'Elke dag zoeken mensen naar wat jij aanbiedt. SEO zorgt dat jouw site het duidelijke, snelle en betrouwbare antwoord is, te beginnen met de technische basis en een pagina per dienst.' ),
				'sections' => array(
					array(
						'h'    => $p( 'What SEO work covers', 'Wat SEO-werk omvat' ),
						'list' => array(
							$p( 'Technical basics: speed, mobile, clean headings, titles and descriptions', 'Technische basis: snelheid, mobiel, nette koppen, titels en omschrijvingen' ),
							$p( 'Structured data, so search engines understand your business', 'Gestructureerde data, zodat zoekmachines je bedrijf begrijpen' ),
							$p( 'A page per service and place you want to be found for', 'Een pagina per dienst en plaats waarop je gevonden wilt worden' ),
							$p( 'Google Business Profile set up and filled in', 'Google Bedrijfsprofiel ingericht en ingevuld' ),
							$p( 'Google Search Console and Bing Webmaster Tools connected', 'Google Search Console en Bing Webmaster Tools gekoppeld' ),
							$p( 'Reporting on what people actually search to find you', 'Inzicht in waar mensen echt op zoeken om jou te vinden' ),
						),
					),
					array(
						'h' => $p( 'Honest about results', 'Eerlijk over resultaat' ),
						'p' => array(
							$p( 'Nobody can promise a number one position on Google, and anyone who does is guessing. SEO takes months, not days. What works is a fast site, clear pages that answer real questions, a complete Google Business Profile, reviews from real customers and links from other sites. That is what we build on.', 'Niemand kan een eerste plek in Google beloven, en wie dat doet gokt. SEO duurt maanden, geen dagen. Wat werkt is een snelle site, duidelijke pagina’s die echte vragen beantwoorden, een compleet Google Bedrijfsprofiel, reviews van echte klanten en links vanaf andere sites. Daarop bouwen we.' ),
						),
					),
					array(
						'h' => $p( 'What it costs', 'Wat het kost' ),
						'p' => array(
							$p( 'For a new website, the SEO groundwork is an option at €175 to €250. For an existing site, ongoing SEO and Google Business Profile work is priced on request, after a short look at where you stand now.', 'Bij een nieuwe website is de SEO-basis een optie van € 175 tot € 250. Voor een bestaande site is doorlopend SEO-werk en het Google Bedrijfsprofiel op aanvraag geprijsd, na een korte blik op waar je nu staat.' ),
						),
					),
				),
				'faq'      => array(
					array( $p( 'How long until I see results?', 'Hoe snel zie ik resultaat?' ), $p( 'Search engines usually need weeks to months to pick up changes. Searches for your business name and local searches tend to move first.', 'Zoekmachines hebben meestal weken tot maanden nodig om veranderingen op te pikken. Zoekopdrachten op je bedrijfsnaam en lokale zoekopdrachten bewegen meestal het eerst.' ) ),
					array( $p( 'Do I need a Google Business Profile?', 'Heb ik een Google Bedrijfsprofiel nodig?' ), $p( 'If customers search for you locally, yes. It is free, it appears in Google Maps and it is one of the strongest local signals.', 'Als klanten je lokaal zoeken, ja. Het is gratis, je verschijnt in Google Maps en het is een van de sterkste lokale signalen.' ) ),
					array( $p( 'Do you write blog posts?', 'Schrijf je ook blogs?' ), $p( 'Copywriting is available as an extra. Pages that answer the questions your customers really ask usually do more than frequent blog posts.', 'Teksten schrijven is mogelijk als extra. Pagina’s die de vragen beantwoorden die klanten echt stellen, doen meestal meer dan vaak bloggen.' ) ),
				),
				'related'  => array( 'website', 'onderhoud', 'kosten' ),
			),

			/* ---------- Pages split out of the front page ---------- */

			'werkwijze' => array(
				'slug'     => array( 'nl' => 'werkwijze', 'en' => 'process' ),
				'service'  => '',
				'est'      => 'website',
				'price'    => null,
				'show'     => array( 'process', 'estimator', 'contact' ),
				'title'    => $p( 'How it works: from first call to launch in 5 steps', 'Werkwijze: van kennismaking tot lancering in 5 stappen' ),
				'desc'     => $p( 'How a website gets built at Ace 360: a free call, a written quote within two days, design first, a test site you can watch, launch and handover.', 'Zo wordt je website gebouwd: gratis kennismaking, offerte binnen twee dagen, eerst het ontwerp, meekijken op een testsite, lancering en overdracht.' ),
				'kicker'   => $p( 'Process', 'Werkwijze' ),
				'h1'       => $p( 'Five steps, and you always know which one you are *on*', 'Vijf stappen, en je weet altijd waar je *staat*' ),
				'lede'     => $p( 'Most website projects run late because nobody agreed what “finished” means. Here the scope, the price and the launch date are written down before anything gets built, and you can watch the site come together.', 'De meeste websiteprojecten lopen uit omdat niemand heeft afgesproken wat ‘af’ betekent. Hier staan de inhoud, de prijs en de lanceerdatum op papier voordat er iets gebouwd wordt, en je kijkt mee terwijl de site ontstaat.' ),
				'sections' => array(
					array(
						'h' => $p( 'What you need to bring', 'Wat jij aanlevert' ),
						'list' => array(
							$p( 'Your logo and colours, if you have them (no logo yet? that can be designed too)', 'Je logo en kleuren, als je die hebt (nog geen logo? dat kan ook ontworpen worden)' ),
							$p( 'Text per page, or the key points so the copy can be written for you', 'Tekst per pagina, of de kernpunten zodat de tekst voor je geschreven kan worden' ),
							$p( 'Photos of your work, team or products', 'Foto’s van je werk, team of producten' ),
							$p( 'Access to your current domain and hosting, if you already have them', 'Toegang tot je huidige domein en hosting, als je die al hebt' ),
						),
					),
					array(
						'h' => $p( 'How we stay in touch', 'Hoe we contact houden' ),
						'p' => array(
							$p( 'You have one person to talk to, from first call to launch. Questions get an answer within one working day, by email, phone or WhatsApp, in English or Dutch. Every step ends with something you can see: a quote, a design, a test site, a live site.', 'Je hebt één aanspreekpunt, van kennismaking tot lancering. Vragen krijgen binnen één werkdag antwoord, per mail, telefoon of WhatsApp, in het Nederlands of Engels. Elke stap eindigt met iets wat je kunt zien: een offerte, een ontwerp, een testsite, een live site.' ),
						),
					),
				),
				'faq'      => array(),
				'related'  => array( 'kosten', 'website', 'vragen' ),
			),

			'vragen'    => array(
				'slug'     => array( 'nl' => 'veelgestelde-vragen', 'en' => 'faq' ),
				'service'  => '',
				'est'      => 'website',
				'price'    => null,
				'show'     => array( 'allfaq', 'contact' ),
				'title'    => $p( 'Questions about websites, prices and maintenance', 'Veelgestelde vragen over websites, prijzen en onderhoud' ),
				'desc'     => $p( 'Answers to what people ask first: prices, timelines, who owns the site, editing it yourself, maintenance, online stores, booking and working in English.', 'Antwoorden op wat mensen als eerste vragen: prijzen, doorlooptijd, van wie de site is, zelf aanpassen, onderhoud, webshops, online boeken en SEO.' ),
				'kicker'   => $p( 'Questions', 'Veelgestelde vragen' ),
				'h1'       => $p( 'What people ask *first*', 'Wat mensen als *eerste* vragen' ),
				'lede'     => $p( 'Every question that comes up on first calls, in one place. Something else? Call or send a WhatsApp, you get a straight answer.', 'Alle vragen die in kennismakingsgesprekken terugkomen, op één plek. Iets anders? Bel of stuur een WhatsApp, je krijgt een eerlijk antwoord.' ),
				'sections' => array(),
				'faq'      => array(),
				'related'  => array( 'kosten', 'werkwijze', 'contact' ),
			),

			'over'      => array(
				'slug'     => array( 'nl' => 'over-ace-360', 'en' => 'about' ),
				'service'  => '',
				'est'      => 'website',
				'price'    => null,
				'show'     => array( 'contact' ),
				'title'    => $p( 'About Ace 360: one person, start to finish', 'Over Ace 360: één aanspreekpunt van start tot finish' ),
				'desc'     => $p( 'Ace 360 Services builds websites, online stores and booking sites from the Netherlands, in English or Dutch. One person, and the site stays yours.', 'Ace 360 Services bouwt websites, webshops en boekingssites vanuit Nederland, in het Nederlands of Engels. Eén aanspreekpunt en de site blijft van jou.' ),
				'kicker'   => $p( 'About', 'Over Ace 360' ),
				'h1'       => $p( 'A website that *works*, built by one person you can call', 'Een website die *werkt*, gebouwd door één persoon die je kunt bellen' ),
				'lede'     => $p( 'Ace 360 Services is a web design studio in the Netherlands. No account managers and no hand-offs: the person you talk to on the first call designs, builds and looks after your site.', 'Ace 360 Services is een webdesignstudio in Nederland. Geen accountmanagers en geen overdrachten: degene die je in de kennismaking spreekt, ontwerpt, bouwt en onderhoudt je site.' ),
				'sections' => array(
					array(
						'h' => $p( 'What Ace 360 believes', 'Waar Ace 360 voor staat' ),
						'list' => array(
							$p( 'You see an estimate before the first call, and the final price before anything is built', 'Je ziet een prijsindicatie vóór het eerste gesprek, en de definitieve prijs voordat er iets gebouwd wordt' ),
							$p( 'A website is judged by what it brings in, not by how it looks in a portfolio', 'Een website beoordeel je op wat hij oplevert, niet op hoe hij eruitziet in een portfolio' ),
							$p( 'Domain, hosting and every login are in your name', 'Domein, hosting en alle inloggegevens staan op jouw naam' ),
							$p( 'Plain language: no jargon in the quote, no surprises on the invoice', 'Gewone taal: geen jargon in de offerte, geen verrassingen op de factuur' ),
							$p( 'No tracking cookies on this site, and none on yours unless you want them', 'Geen trackingcookies op deze site, en op de jouwe alleen als je dat wilt' ),
						),
					),
					array(
						'h' => $p( 'What gets built', 'Wat er gebouwd wordt' ),
						'p' => array(
							$p( 'Websites and one-pagers in WordPress, online stores in WooCommerce or Shopify with iDEAL through Mollie, booking systems, and the maintenance that keeps them running. Clients include shops, salons, restaurants, practices, charities and platforms, in the Netherlands and abroad.', 'Websites en one-pagers in WordPress, webshops in WooCommerce of Shopify met iDEAL via Mollie, boekingssystemen, en het onderhoud dat alles draaiende houdt. Voor winkels, salons, restaurants, praktijken, goede doelen en platforms, in Nederland en daarbuiten.' ),
						),
					),
					array(
						'h' => $p( 'Where and how', 'Waar en hoe' ),
						'p' => array(
							$p( 'Based in the Netherlands and working remotely for clients anywhere. Calls by phone, WhatsApp or video, in English or Dutch, planned around your time zone. Ace 360 Services is registered with the Dutch Chamber of Commerce (KvK).', 'Gevestigd in Nederland en op afstand werkend voor klanten overal. Gesprekken via telefoon, WhatsApp of video, in het Nederlands of Engels, gepland rond jouw tijdzone. Ace 360 Services staat ingeschreven bij de Kamer van Koophandel (KvK).' ),
						),
					),
				),
				'faq'      => array(),
				'related'  => array( 'werkwijze', 'website', 'kosten' ),
			),

			'contact'   => array(
				'slug'     => array( 'nl' => 'contact', 'en' => 'contact' ),
				'service'  => '',
				'est'      => 'website',
				'price'    => null,
				'show'     => array( 'contact' ),
				'title'    => $p( 'Contact: book a free 20-minute call', 'Contact: plan een gratis gesprek van 20 minuten' ),
				'desc'     => $p( 'Book a free 20-minute call by phone, WhatsApp or video, or send a message and get an answer within one working day. In English or Dutch.', 'Plan een gratis gesprek van 20 minuten via telefoon, WhatsApp of video, of stuur een bericht en krijg binnen één werkdag antwoord.' ),
				'kicker'   => $p( 'Contact', 'Contact' ),
				'h1'       => $p( 'Let’s *talk* about your website', 'Laten we het over je website *hebben*' ),
				'lede'     => $p( 'Pick a time in the calendar below, call, or send a WhatsApp. The first call is free and takes about twenty minutes.', 'Kies hieronder een tijd in de agenda, bel, of stuur een WhatsApp. Het eerste gesprek is gratis en duurt ongeveer twintig minuten.' ),
				'sections' => array(),
				'faq'      => array(),
				'related'  => array( 'kosten', 'werkwijze', 'vragen' ),
			),

			/* ---------- Industry pages ---------- */

			'kapper'    => array(
				'slug'     => array( 'nl' => 'website-kapper-salon', 'en' => 'salon-website' ),
				'service'  => 'Web design for hair and beauty salons',
				'est'      => 'website',
				'extras'   => array( 'booking' ),
				'price'    => array( 1250, 1650 ),
				'title'    => $p( 'Salon website with online booking · est. from €1,250', 'Website voor kapper of salon met online boeken' ),
				'desc'     => $p( 'A website for hair and beauty salons: treatments and prices, online booking in your real free times, reminders and your work in photos. See an estimate online.', 'Website voor kappers, barbers en schoonheidssalons: behandelingen en prijzen, online boeken in je echte vrije tijden, herinneringen en je werk in beeld.' ),
				'kicker'   => $p( 'Websites for salons', 'Website voor kapper en salon' ),
				'h1'       => $p( 'A salon website that books while you *cut*', 'Een salonwebsite die boekt terwijl jij *knipt*' ),
				'lede'     => $p( 'Your clients want three things from your website: what you do, what it costs and when they can come. Answer those, let them book themselves, and your phone stops interrupting appointments.', 'Klanten willen drie dingen van je website: wat je doet, wat het kost en wanneer ze kunnen komen. Beantwoord die, laat ze zelf boeken, en je telefoon onderbreekt geen afspraken meer.' ),
				'sections' => array(
					array(
						'h' => $p( 'What a salon website needs', 'Wat een salonwebsite nodig heeft' ),
						'list' => array(
							$p( 'Treatments with prices or “from” prices, grouped the way clients think (cut, colour, treatments)', 'Behandelingen met prijzen of vanaf-prijzen, ingedeeld zoals klanten denken (knippen, kleuren, behandelingen)' ),
							$p( 'Online booking per treatment, with the right length and your real free times', 'Online boeken per behandeling, met de juiste duur en je echte vrije tijden' ),
							$p( 'Reminder emails and a simple way to move an appointment', 'Herinneringsmails en een eenvoudige manier om te verzetten' ),
							$p( 'A gallery of your own work (not stock photos) and your team', 'Een galerij met je eigen werk (geen stockfoto’s) en je team' ),
							$p( 'Address, map, parking and opening hours on every phone', 'Adres, kaart, parkeren en openingstijden, goed leesbaar op elke telefoon' ),
							$p( 'Gift cards or products, if you sell them', 'Cadeaubonnen of producten, als je die verkoopt' ),
						),
					),
					array(
						'h' => $p( 'Booking: your own site or an app?', 'Boeken: via je eigen site of een app?' ),
						'p' => array(
							$p( 'Booking platforms bring visibility but often charge per booking and keep the client relationship. Booking on your own website keeps clients on your site and avoids commission. Already happy with a booking app? It can usually be connected to the new site instead.', 'Boekingsplatforms geven zichtbaarheid, maar rekenen vaak per boeking en houden de klantrelatie zelf. Boeken op je eigen website houdt klanten bij jou en scheelt commissie. Ben je tevreden over je boekingsapp? Die kan meestal aan de nieuwe site worden gekoppeld.' ),
						),
					),
					array(
						'h' => $p( 'Cost and timeline', 'Kosten en doorlooptijd' ),
						'p' => array(
							$p( 'A salon website of up to five pages with online booking is estimated at €1,250 to €1,650 excluding VAT, live in about 2 to 3 weeks after the design is approved. Maintenance is optional at €67.50 a month.', 'Een salonwebsite tot vijf pagina’s met online boeken heeft een indicatie van € 1.250 tot € 1.650 exclusief btw en staat ongeveer 2 tot 3 weken na akkoord op het ontwerp live. Onderhoud is optioneel voor € 67,50 per maand.' ),
						),
					),
				),
				'faq'      => array(
					array( $p( 'Can clients choose a specific stylist?', 'Kunnen klanten een vaste kapper kiezen?' ), $p( 'Yes, booking can be set up per staff member, each with their own hours.', 'Ja, boeken kan per medewerker worden ingericht, elk met eigen werktijden.' ) ),
					array( $p( 'Can I ask for a deposit to prevent no-shows?', 'Kan ik een aanbetaling vragen tegen no-shows?' ), $p( 'Yes, a deposit with iDEAL can be added to bookings.', 'Ja, een aanbetaling via iDEAL kan aan boekingen worden toegevoegd.' ) ),
					array( $p( 'Will it show up in Google Maps?', 'Kom ik dan in Google Maps?' ), $p( 'Google Maps comes from your Google Business Profile, which links to your website. Setting it up is part of the SEO option.', 'Google Maps komt uit je Google Bedrijfsprofiel, dat naar je website linkt. Het inrichten daarvan hoort bij de SEO-optie.' ) ),
				),
				'related'  => array( 'boeken', 'seo', 'onderhoud' ),
			),

			'restaurant' => array(
				'slug'     => array( 'nl' => 'website-restaurant', 'en' => 'restaurant-website' ),
				'service'  => 'Web design for restaurants',
				'est'      => 'website',
				'price'    => array( 1000, 1300 ),
				'title'    => $p( 'Restaurant website with menu and reservations', 'Website voor je restaurant met menukaart en reserveren' ),
				'desc'     => $p( 'A restaurant website with a menu that is easy to update, reservations or online orders, opening hours and directions that work on every phone.', 'Een restaurantwebsite met een menukaart die je zelf bijwerkt, reserveren of online bestellen, openingstijden en route, goed leesbaar op elke telefoon.' ),
				'kicker'   => $p( 'Websites for restaurants', 'Website voor horeca' ),
				'h1'       => $p( 'A restaurant website people *open* before they book', 'Een restaurantwebsite die gasten *openen* voordat ze boeken' ),
				'lede'     => $p( 'Guests check the menu, the prices and the opening hours on their phone before they choose where to eat. A fast site with a readable menu and a reservation button answers that in seconds.', 'Gasten bekijken op hun telefoon de menukaart, de prijzen en de openingstijden voordat ze kiezen waar ze eten. Een snelle site met een leesbare kaart en een reserveerknop beantwoordt dat in seconden.' ),
				'sections' => array(
					array(
						'h' => $p( 'What a restaurant website needs', 'Wat een restaurantwebsite nodig heeft' ),
						'list' => array(
							$p( 'A menu as real text, not a PDF, so it reads on phones and shows in Google', 'Een menukaart als echte tekst, geen pdf, zodat hij leesbaar is op mobiel en in Google verschijnt' ),
							$p( 'Prices, allergens and dietary labels you update yourself', 'Prijzen, allergenen en dieetlabels die je zelf bijwerkt' ),
							$p( 'Reservations: your own form, or a connection to your reservation system', 'Reserveren: een eigen formulier, of een koppeling met je reserveringssysteem' ),
							$p( 'Online orders for takeaway or catering, with iDEAL, if you offer them', 'Online bestellen voor afhaal of catering, met iDEAL, als je dat aanbiedt' ),
							$p( 'Opening hours, holidays, address, parking and a map', 'Openingstijden, vakanties, adres, parkeren en een kaart' ),
							$p( 'Photos of your own dishes and room', 'Foto’s van je eigen gerechten en zaak' ),
						),
					),
					array(
						'h' => $p( 'Menu as text, not a PDF', 'Menukaart als tekst, niet als pdf' ),
						'p' => array(
							$p( 'A PDF menu is hard to read on a phone, slow to load and invisible to search engines. A menu built as a page can be updated in a minute, shows dish names in Google results and works with screen readers.', 'Een pdf-menukaart is lastig te lezen op een telefoon, laadt traag en is onzichtbaar voor zoekmachines. Een menukaart als pagina pas je in een minuut aan, laat gerechten zien in Google en werkt met schermlezers.' ),
						),
					),
					array(
						'h' => $p( 'Cost and timeline', 'Kosten en doorlooptijd' ),
						'p' => array(
							$p( 'A restaurant website of up to five pages is estimated at €1,000 to €1,300 excluding VAT. Online ordering with payments is priced like a small online store; the calculator below shows both. Plan 2 to 3 weeks after the design is approved.', 'Een restaurantwebsite tot vijf pagina’s heeft een indicatie van € 1.000 tot € 1.300 exclusief btw. Online bestellen met betalen wordt geprijsd als een kleine webshop; de calculator hieronder laat beide zien. Reken op 2 tot 3 weken na akkoord op het ontwerp.' ),
						),
					),
				),
				'faq'      => array(
					array( $p( 'Can I change the menu myself?', 'Kan ik de menukaart zelf aanpassen?' ), $p( 'Yes. Dishes, prices and labels are edited like a simple list in WordPress.', 'Ja. Gerechten, prijzen en labels pas je aan als een eenvoudige lijst in WordPress.' ) ),
					array( $p( 'Can it connect to my reservation system?', 'Kan het gekoppeld worden aan mijn reserveringssysteem?' ), $p( 'Most reservation systems offer a widget or link that can be placed on the site. We check yours on the first call.', 'De meeste reserveringssystemen bieden een widget of link die op de site kan. We bekijken het jouwe in de kennismaking.' ) ),
					array( $p( 'Do you take the photos?', 'Maak je ook de foto’s?' ), $p( 'Photography can be arranged as an extra. Your own recent photos also work well.', 'Fotografie kan als extra worden geregeld. Je eigen recente foto’s werken ook goed.' ) ),
				),
				'related'  => array( 'webshop', 'seo', 'website' ),
			),

			'praktijk'  => array(
				'slug'     => array( 'nl' => 'website-praktijk-fysiotherapeut', 'en' => 'practice-website' ),
				'service'  => 'Web design for therapy and health practices',
				'est'      => 'website',
				'extras'   => array( 'booking' ),
				'price'    => array( 1250, 1650 ),
				'title'    => $p( 'Website for physiotherapists, therapists and practices', 'Website voor fysiotherapeut, therapeut of praktijk' ),
				'desc'     => $p( 'A practice website that explains treatments in plain words, shows prices and insurance information, and lets patients book an intake online.', 'Een praktijkwebsite die behandelingen helder uitlegt, tarieven en vergoedingen toont en patiënten online een intake laat plannen.' ),
				'kicker'   => $p( 'Websites for practices', 'Website voor praktijken' ),
				'h1'       => $p( 'A practice website that answers before patients *call*', 'Een praktijkwebsite die antwoord geeft voordat patiënten *bellen*' ),
				'lede'     => $p( 'Most calls to a practice ask the same things: do you treat this, is it covered, do I need a referral, when can I come? A clear website answers them, so the phone is free for the patients who really need it.', 'De meeste telefoontjes naar een praktijk gaan over hetzelfde: behandel je dit, wordt het vergoed, heb ik een verwijzing nodig, wanneer kan ik komen? Een duidelijke website beantwoordt dat, zodat de telefoon vrij is voor wie hem echt nodig heeft.' ),
				'sections' => array(
					array(
						'h' => $p( 'What a practice website needs', 'Wat een praktijkwebsite nodig heeft' ),
						'list' => array(
							$p( 'A page per complaint or treatment, in plain words', 'Een pagina per klacht of behandeling, in gewone taal' ),
							$p( 'Rates, insurance information and whether a referral is needed', 'Tarieven, informatie over vergoeding en of een verwijzing nodig is' ),
							$p( 'Online intake booking, or a clear callback request', 'Online een intake plannen, of een duidelijk terugbelverzoek' ),
							$p( 'Your therapists, their specialisms and registrations', 'Je therapeuten, hun specialisaties en registraties' ),
							$p( 'Accessibility: readable text, good contrast, works with screen readers', 'Toegankelijkheid: leesbare tekst, goed contrast, werkt met schermlezers' ),
							$p( 'A privacy statement that matches how you handle data', 'Een privacyverklaring die past bij hoe je met gegevens omgaat' ),
						),
					),
					array(
						'h' => $p( 'Privacy first', 'Privacy voorop' ),
						'p' => array(
							$p( 'A website form is not the place for medical details. Booking and contact forms ask only for what is needed to make an appointment; anything medical stays in your own patient system. No tracking cookies unless you choose to add them.', 'Een websiteformulier is niet de plek voor medische details. Boekings- en contactformulieren vragen alleen wat nodig is voor een afspraak; alles wat medisch is blijft in je eigen patiëntensysteem. Geen trackingcookies, tenzij je daar zelf voor kiest.' ),
						),
					),
					array(
						'h' => $p( 'Cost and timeline', 'Kosten en doorlooptijd' ),
						'p' => array(
							$p( 'A practice website of up to five pages with online intake booking is estimated at €1,250 to €1,650 excluding VAT; extra treatment pages are about €50 to €65 each. Live in 2 to 3 weeks after the design is approved.', 'Een praktijkwebsite tot vijf pagina’s met online intake plannen heeft een indicatie van € 1.250 tot € 1.650 exclusief btw; extra behandelpagina’s kosten ongeveer € 50 tot € 65 per stuk. Live in 2 tot 3 weken na akkoord op het ontwerp.' ),
						),
					),
				),
				'faq'      => array(
					array( $p( 'Can it link to my practice software?', 'Kan het gekoppeld worden aan mijn praktijksoftware?' ), $p( 'Many practice systems offer an online booking module or link that can be placed on the site. We check yours on the first call.', 'Veel praktijksystemen bieden een online boekingsmodule of link die op de site kan. We bekijken het jouwe in de kennismaking.' ) ),
					array( $p( 'Do I need a page for every treatment?', 'Heb ik een pagina per behandeling nodig?' ), $p( 'For being found on Google, yes: people search for their complaint, not for your practice name.', 'Om gevonden te worden in Google wel: mensen zoeken op hun klacht, niet op de naam van je praktijk.' ) ),
				),
				'related'  => array( 'boeken', 'seo', 'onderhoud' ),
			),

			'vakman'    => array(
				'slug'     => array( 'nl' => 'website-aannemer-vakman', 'en' => 'tradesperson-website' ),
				'service'  => 'Web design for contractors and trades',
				'est'      => 'website',
				'price'    => array( 1000, 1300 ),
				'title'    => $p( 'Website for builders, plumbers and other trades', 'Website voor aannemer, loodgieter of vakman' ),
				'desc'     => $p( 'A website for trades: your services and work area, photos of real jobs, reviews and a quote request that works on a phone. Estimate from €1,000.', 'Website voor aannemers, schilders, loodgieters en installateurs: diensten en werkgebied, foto’s van echte klussen, reviews en een offerteaanvraag op mobiel.' ),
				'kicker'   => $p( 'Websites for trades', 'Website voor vakmensen' ),
				'h1'       => $p( 'Get the *job*, not just the visit', 'Krijg de *klus*, niet alleen het bezoek' ),
				'lede'     => $p( 'People looking for a builder, painter or plumber compare two or three websites on their phone, often in a hurry. The one that shows real work, says where it works and makes calling easy gets the call.', 'Wie een aannemer, schilder of loodgieter zoekt, vergelijkt twee of drie websites op zijn telefoon, vaak met haast. Wie echt werk laat zien, zegt waar hij werkt en bellen makkelijk maakt, krijgt het telefoontje.' ),
				'sections' => array(
					array(
						'h' => $p( 'What a trades website needs', 'Wat een website voor vakmensen nodig heeft' ),
						'list' => array(
							$p( 'A big click-to-call and WhatsApp button on every phone screen', 'Een grote bel- en WhatsApp-knop op elk telefoonscherm' ),
							$p( 'Your services, each with its own page', 'Je diensten, elk met een eigen pagina' ),
							$p( 'Your work area: the towns and regions you cover', 'Je werkgebied: de plaatsen en regio’s waar je werkt' ),
							$p( 'Before-and-after photos of real jobs', 'Voor-en-na-foto’s van echte klussen' ),
							$p( 'Reviews from customers, with permission', 'Reviews van klanten, met toestemming' ),
							$p( 'A quote request form that accepts photos of the job', 'Een offerteformulier waarbij klanten foto’s van de klus kunnen meesturen' ),
							$p( 'Certifications and guarantees, if you have them', 'Certificeringen en garanties, als je die hebt' ),
						),
					),
					array(
						'h' => $p( 'Found in your own area', 'Gevonden in je eigen regio' ),
						'p' => array(
							$p( 'Most trade searches are local: “plumber Utrecht”, “roofer near me”. A Google Business Profile with photos and reviews, plus service pages that mention the area you really work in, do more than any trick. Copy-paste pages for fifty towns do not.', 'De meeste zoekopdrachten naar vakmensen zijn lokaal: ‘loodgieter Utrecht’, ‘dakdekker in de buurt’. Een Google Bedrijfsprofiel met foto’s en reviews, plus dienstpagina’s die het gebied noemen waar je echt werkt, doen meer dan welke truc ook. Kopieerpagina’s voor vijftig plaatsen niet.' ),
						),
					),
					array(
						'h' => $p( 'Cost and timeline', 'Kosten en doorlooptijd' ),
						'p' => array(
							$p( 'A trades website of up to five pages is estimated at €1,000 to €1,300 excluding VAT, live in 2 to 3 weeks after the design is approved. A one-page site starts from €500 if you mainly need to be found and called.', 'Een website voor vakmensen tot vijf pagina’s heeft een indicatie van € 1.000 tot € 1.300 exclusief btw en staat 2 tot 3 weken na akkoord op het ontwerp live. Een one-page website begint vanaf € 500 als je vooral gevonden en gebeld wilt worden.' ),
						),
					),
				),
				'faq'      => array(
					array( $p( 'I don’t have time to write texts. Can you?', 'Ik heb geen tijd voor teksten. Kun jij dat?' ), $p( 'Yes, copywriting is an option. A twenty-minute call about your work is usually enough to write from.', 'Ja, teksten schrijven is een optie. Een gesprek van twintig minuten over je werk is meestal genoeg om uit te schrijven.' ) ),
					array( $p( 'Can customers send photos with their request?', 'Kunnen klanten foto’s meesturen met hun aanvraag?' ), $p( 'Yes, the quote form can accept photos, so you can estimate before you drive out.', 'Ja, het offerteformulier kan foto’s ontvangen, zodat je een inschatting maakt voordat je langsrijdt.' ) ),
				),
				'related'  => array( 'onepage', 'seo', 'website' ),
			),
		)
	);
}

/**
 * Blocks a landing page shows below its copy.
 *
 * @param string $key Landing key.
 * @return array
 */
function ace360_landing_blocks( $key ) {
	$l = ace360_landings()[ $key ];
	return isset( $l['show'] ) ? $l['show'] : array( 'estimator', 'faq', 'contact' );
}

/**
 * Estimator extras a landing page ticks in advance.
 *
 * @param string $key Landing key.
 * @return array
 */
function ace360_landing_extras( $key ) {
	$l = ace360_landings()[ $key ];
	if ( isset( $l['extras'] ) ) {
		return $l['extras'];
	}
	return 'boeken' === $key ? array( 'booking' ) : ( 'seo' === $key ? array( 'seo' ) : array() );
}

/**
 * Every question on the site, once: the front page FAQ plus each landing page's.
 *
 * @return array
 */
function ace360_all_faq() {
	$all  = array();
	$seen = array();
	$sets = array( ace360_faq() );
	foreach ( ace360_landings() as $l ) {
		$sets[] = $l['faq'];
	}
	foreach ( $sets as $set ) {
		foreach ( $set as $q ) {
			$k = strtolower( $q[0]['en'] );
			if ( ! isset( $seen[ $k ] ) ) {
				$seen[ $k ] = true;
				$all[]      = $q;
			}
		}
	}
	return $all;
}

/**
 * The landing page being shown, or ''.
 *
 * @return string
 */
function ace360_current_landing() {
	global $ace360_preview_landing;
	if ( ! empty( $ace360_preview_landing ) ) {
		return $ace360_preview_landing;
	}
	if ( ! function_exists( 'get_query_var' ) ) {
		return '';
	}
	$key = (string) get_query_var( 'ace360_landing' );
	return ( $key && isset( ace360_landings()[ $key ] ) ) ? $key : '';
}

/**
 * URL of a landing page.
 *
 * @param string      $key  Landing key.
 * @param string|null $lang 'nl' or 'en'.
 * @return string
 */
function ace360_landing_url( $key, $lang = null ) {
	$lang = $lang ? $lang : ace360_lang();
	$l    = ace360_landings()[ $key ];
	if ( ace360_both_langs() ) {
		return $l['slug']['nl'] . '.html';
	}
	return ace360_url( '/' . $l['slug'][ $lang ] . '/', $lang );
}

/**
 * Where a service card links to: its landing page.
 *
 * @param array $service From ace360_services().
 * @return string
 */
function ace360_service_url( $service ) {
	$map = array(
		'website' => 'website',
		'store'   => 'webshop',
		'care'    => 'onderhoud',
		''        => 'seo',
	);
	$type = isset( $service['type'] ) ? $service['type'] : '';
	return isset( $map[ $type ] ) ? ace360_landing_url( $map[ $type ] ) : ace360_home_hash( '#diensten' );
}

/**
 * Landing pages use landing.php.
 *
 * @param string $template Template path.
 * @return string
 */
function ace360_landing_template( $template ) {
	if ( ace360_current_landing() ) {
		$t = locate_template( 'landing.php' );
		if ( $t ) {
			return $t;
		}
	}
	return $template;
}
add_filter( 'template_include', 'ace360_landing_template' );

/**
 * Format a price for the page language: €1,000 / € 1.000, with decimals for small amounts (€67.50).
 *
 * @param float  $n    Amount.
 * @param string $lang 'nl' or 'en'.
 * @return string
 */
function ace360_money( $n, $lang ) {
	$dec = ( floor( $n ) != $n ) ? 2 : 0; // phpcs:ignore Universal.Operators.StrictComparisons -- float compare.
	return 'en' === $lang ? '€' . number_format( $n, $dec, '.', ',' ) : '€ ' . number_format( $n, $dec, ',', '.' );
}
