<?php
/**
 * Site copy in English and Dutch, the self-quote price model and project data.
 *
 * Every string is a pair: array( 'en' => ..., 'nl' => ... ). Templates print
 * both with ace360_e(); the EN/NL switch in the header shows one of them.
 *
 * @package ace360
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Build a translation pair.
 *
 * @param string $en English.
 * @param string $nl Dutch.
 * @return array
 */
function ace360_pair( $en, $nl ) {
	return array(
		'en' => $en,
		'nl' => $nl,
	);
}

/**
 * Hero.
 */
function ace360_hero() {
	return array(
		'kicker'  => ace360_pair( 'Web design and digital growth · Netherlands & worldwide', 'Webdesign en digitale groei · Nederland & wereldwijd' ),
		'title'   => ace360_pair( 'See an *estimate* before we get on a call.', 'Je ziet een *prijsindicatie* al voordat we bellen.' ),
		'text'    => ace360_pair(
			'Ace 360 Services builds websites and online stores for businesses in the Netherlands and abroad. An honest estimate up front, a launch date that holds, and one person to talk to. No account manager, no surprise invoice at the end.',
			'Ace 360 Services bouwt websites en webshops voor bedrijven in Nederland en daarbuiten. Vooraf een eerlijke prijsindicatie, een lanceerdatum die klopt en één aanspreekpunt. Geen accountmanager, geen verrassingsfactuur achteraf.'
		),
		'quote'   => ace360_pair( 'Get my estimate', 'Bekijk mijn prijsindicatie' ),
		'call'    => ace360_pair( 'Book a free call', 'Plan een gratis gesprek' ),
		'bullets' => array(
			ace360_pair( 'Reply within 1 working day', 'Antwoord binnen 1 werkdag' ),
			ace360_pair( 'Estimate online, final price agreed before we start', 'Online indicatie, de prijs staat vast vóór we beginnen' ),
			ace360_pair( 'Domain and site stay yours', 'Domein en site blijven van jou' ),
			ace360_pair( 'English or Dutch, wherever you are', 'Nederlands of Engels, waar je ook zit' ),
		),
	);
}

/**
 * Services with prices. 'type' links the card to an estimator project type.
 */
function ace360_services() {
	return array(
		array(
			'icon'  => 'site',
			'type'  => 'website',
			'title' => ace360_pair( 'Website build', 'Website laten maken' ),
			'text'  => ace360_pair(
				'From a one-pager to a site with job listings, forms and a booking page. Built in WordPress, so you can get into it yourself without calling me.',
				'Van one-pager tot site met vacatures, formulieren en een boekingspagina. Gebouwd in WordPress, zodat je er zelf in kunt zonder mij te bellen.'
			),
			'price' => ace360_pair( 'est. from €269', 'indicatie vanaf € 269' ),
		),
		array(
			'icon'  => 'store',
			'type'  => 'store',
			'title' => ace360_pair( 'Online store', 'Webshop' ),
			'text'  => ace360_pair(
				'WooCommerce or Shopify, with iDEAL and the rest of Mollie wired up. Stock, shipping rules and VAT set correctly before you go live.',
				'WooCommerce of Shopify, met iDEAL en de rest van Mollie gekoppeld. Voorraad, verzendregels en btw goed ingesteld voordat je live gaat.'
			),
			'price' => ace360_pair( 'est. from €449', 'indicatie vanaf € 449' ),
		),
		array(
			'icon'  => 'care',
			'type'  => 'care',
			'title' => ace360_pair( 'Maintenance and care', 'Onderhoud' ),
			'text'  => ace360_pair(
				'Updates, backups, security and small changes. Every month you get a short summary of what was done. Cancel any month.',
				'Updates, back-ups, beveiliging en kleine aanpassingen. Elke maand krijg je een kort overzicht van wat er is gedaan. Maandelijks opzegbaar.'
			),
			'price' => ace360_pair( 'est. €13.50 per month', 'indicatie € 13,50 per maand' ),
		),
		array(
			'icon'  => 'grow',
			'type'  => '',
			'title' => ace360_pair( 'Visibility and growth', 'Vindbaarheid en groei' ),
			'text'  => ace360_pair(
				'Technical SEO, Google Business Profile and ads that chase revenue rather than clicks. Only worth doing once your site is solid.',
				'Technische SEO, Google Bedrijfsprofiel en advertenties die omzet najagen in plaats van klikken. Pas zinvol als je site goed staat.'
			),
			'price' => ace360_pair( 'Price on request', 'Prijs op aanvraag' ),
		),
	);
}

/**
 * Process steps. Each one is also a chapter of the demo film (same order).
 */
function ace360_process() {
	return array(
		array( ace360_pair( 'First call', 'Kennismaking' ), ace360_pair( 'Day 1', 'Dag 1' ), ace360_pair( 'Twenty minutes. I ask what the site has to bring in, not what colour it should be.', 'Twintig minuten. Ik vraag wat de site moet opleveren, niet welke kleur hij moet hebben.' ) ),
		array( ace360_pair( 'Your quote', 'Jouw offerte' ), ace360_pair( 'Within 2 days', 'Binnen 2 dagen' ), ace360_pair( 'After the call you get the final price, a launch date and a list of what is and is not included. On one page.', 'Na het gesprek krijg je de definitieve prijs, een lanceerdatum en een lijst van wat wel en niet is inbegrepen. Op één pagina.' ) ),
		array( ace360_pair( 'Design', 'Ontwerp' ), ace360_pair( 'Week 1', 'Week 1' ), ace360_pair( 'You see the layout before anything gets built. Two rounds of feedback are included.', 'Je ziet de opzet voordat er iets gebouwd wordt. Twee feedbackrondes zijn inbegrepen.' ) ),
		array( ace360_pair( 'Build', 'Bouw' ), ace360_pair( 'Week 2–3', 'Week 2–3' ), ace360_pair( 'I build on a staging site you can watch. Text and images get filled in as we go.', 'Ik bouw op een testomgeving waar je kunt meekijken. Tekst en beeld vullen we gaandeweg in.' ) ),
		array( ace360_pair( 'Launch and handover', 'Lancering en overdracht' ), ace360_pair( 'Launch', 'Lancering' ), ace360_pair( 'The site goes live, you get the logins and a walkthrough. After that you can run it yourself.', 'De site gaat live, je krijgt de inloggegevens en een rondleiding. Daarna kun je hem zelf beheren.' ) ),
	);
}

/**
 * Chapters of the demo film: the whole journey, from finding Ace 360 to care
 * after launch. The middle five are the process steps (ace360_process()).
 * Each: short name for the chapter bar, when, and the process step it shows (or -1).
 */
function ace360_journey() {
	return array(
		array( ace360_pair( 'Found', 'Gevonden' ), ace360_pair( 'Google or socials', 'Google of socials' ) ),
		array( ace360_pair( 'Book a call', 'Gesprek plannen' ), ace360_pair( 'One minute', 'Eén minuut' ) ),
		array( ace360_pair( 'First call', 'Kennismaking' ), ace360_pair( 'Day 1', 'Dag 1' ) ),
		array( ace360_pair( 'Quote', 'Offerte' ), ace360_pair( 'Within 2 days', 'Binnen 2 dagen' ) ),
		array( ace360_pair( 'Design', 'Ontwerp' ), ace360_pair( 'Week 1', 'Week 1' ) ),
		array( ace360_pair( 'Build', 'Bouw' ), ace360_pair( 'Week 2–3', 'Week 2–3' ) ),
		array( ace360_pair( 'Launch', 'Lancering' ), ace360_pair( 'Launch day', 'Lanceerdag' ) ),
		array( ace360_pair( 'Care', 'Onderhoud' ), ace360_pair( 'Every month', 'Elke maand' ) ),
	);
}

/**
 * "Sound familiar?": what a business owner says about their current website.
 * The 3D laptop shows an outdated site while this chapter is on screen.
 */
function ace360_pains() {
	return array(
		ace360_pair( 'It looks dated, and on a phone it falls apart.', 'Hij ziet er gedateerd uit en op een telefoon valt hij uit elkaar.' ),
		ace360_pair( 'People visit, but nobody calls, books or buys.', 'Er komen bezoekers, maar niemand belt, boekt of koopt.' ),
		ace360_pair( 'Changing one price means emailing someone and waiting a week.', 'Eén prijs aanpassen betekent iemand mailen en een week wachten.' ),
		ace360_pair( 'Google shows your competitors first.', 'Google laat eerst je concurrenten zien.' ),
	);
}

/**
 * "After launch": what changes once the new site is live. Each line answers
 * the matching pain above; the 3D phone fills with notifications.
 */
function ace360_outcomes() {
	return array(
		array( ace360_pair( 'Looks right everywhere', 'Klopt overal' ), ace360_pair( 'Fast and sharp on every phone, tablet and laptop.', 'Snel en scherp op elke telefoon, tablet en laptop.' ) ),
		array( ace360_pair( 'Turns visits into customers', 'Maakt van bezoekers klanten' ), ace360_pair( 'Enquiries, bookings and iDEAL payments land on your phone, even at 23:00.', 'Aanvragen, boekingen en iDEAL-betalingen komen binnen op je telefoon, ook om 23:00.' ) ),
		array( ace360_pair( 'Yours to change', 'Zelf aan te passen' ), ace360_pair( 'Prices, photos and opening hours, updated by you in a minute.', 'Prijzen, foto’s en openingstijden pas je zelf aan in een minuut.' ) ),
		array( ace360_pair( 'Found on Google', 'Gevonden op Google' ), ace360_pair( 'Built so search engines understand what you sell and where, in Dutch and English.', 'Zo gebouwd dat zoekmachines snappen wat je verkoopt en waar, in het Nederlands en Engels.' ) ),
	);
}

/**
 * Sectors used to filter the "All work" grid.
 */
function ace360_sectors() {
	return array(
		'store'    => ace360_pair( 'Stores', 'Webshops' ),
		'ngo'      => ace360_pair( 'Charity & church', 'Goede doelen & kerk' ),
		'beauty'   => ace360_pair( 'Beauty & skincare', 'Beauty & huidverzorging' ),
		'booking'  => ace360_pair( 'Bookings & hospitality', 'Boekingen & horeca' ),
		'platform' => ace360_pair( 'Platforms & services', 'Platforms & diensten' ),
		'b2b'      => ace360_pair( 'Industry & B2B', 'Industrie & B2B' ),
	);
}

/**
 * Work, shown until Projects are added in the dashboard.
 * 'mockup' picks the built-in screen design (assets/js/screens.js); 'url' adds a
 * "Visit live site" link; 'featured' puts it in the 3D showcase; 'concept' marks
 * a design study rather than client work.
 */
function ace360_work() {
	return array(
		array(
			'title'    => 'Culpromark',
			'type'     => ace360_pair( 'Food safety consultancy · B2B site', 'Voedselveiligheidsadvies · B2B-site' ),
			'text'     => ace360_pair( 'Website for a food safety and processing consultancy: an interactive HACCP processing line, a two-minute audit-readiness check that brings in leads, and articles the team adds themselves.', 'Website voor een adviesbureau in voedselveiligheid en -verwerking: een interactieve HACCP-productielijn, een audit-check van twee minuten die leads oplevert, en artikelen die het team zelf toevoegt.' ),
			'built'    => array(
				ace360_pair( 'Interactive processing line with critical control points', 'Interactieve productielijn met kritische beheerspunten' ),
				ace360_pair( 'Audit-readiness check with score and top 3 fixes', 'Audit-check met score en de 3 belangrijkste verbeterpunten' ),
				ace360_pair( 'Live line monitor, sector guides and an article reader', 'Live lijnmonitor, sectorgidsen en een artikellezer' ),
				ace360_pair( 'All content editable in one file', 'Alle inhoud aan te passen in één bestand' ),
			),
			'stack'    => array( 'HTML', 'CSS', 'Vanilla JS', 'No dependencies' ),
			'mockup'   => 'culpromark',
			'sector'   => 'b2b',
			'featured' => true,
			'concept'  => true,
			'demo'     => ace360_demo_url( 'culpromark' ),
			'url'      => '',
		),
		array(
			'title'  => 'Hesed Impact Ministries',
			'type'   => ace360_pair( 'WordPress theme', 'WordPress-thema' ),
			'text'   => ace360_pair( 'Custom theme with events, a media archive and a donation page.', 'Maatwerkthema met evenementen, een media-archief en een donatiepagina.' ),
			'built'  => array(
				ace360_pair( 'Event calendar the team updates itself', 'Evenementenkalender die het team zelf bijhoudt' ),
				ace360_pair( 'Searchable archive of sermons and videos', 'Doorzoekbaar archief met preken en video’s' ),
				ace360_pair( 'Donation page with iDEAL and recurring gifts', 'Donatiepagina met iDEAL en periodieke giften' ),
			),
			'stack'  => array( 'WordPress', 'Custom theme', 'Mollie' ),
			'mockup' => 'hesed',
			'sector' => 'ngo',
			'featured' => true,
			'url'    => '',
		),
		array(
			'title'  => 'SIDWALK',
			'type'   => ace360_pair( 'Shopify + brand identity', 'Shopify + merkidentiteit' ),
			'text'   => ace360_pair( 'Streetwear store, from logo and identity through to the first campaign.', 'Streetwearwinkel, van logo en identiteit tot de eerste campagne.' ),
			'built'  => array(
				ace360_pair( 'Logo, type and visual identity', 'Logo, typografie en huisstijl' ),
				ace360_pair( 'Shopify store with drops and size guides', 'Shopify-winkel met drops en maattabellen' ),
				ace360_pair( 'Launch campaign assets', 'Materiaal voor de lanceercampagne' ),
			),
			'stack'  => array( 'Shopify', 'Brand identity', 'Campaign' ),
			'mockup' => 'sidwalk',
			'sector' => 'store',
			'featured' => true,
			'url'    => '',
		),
		array(
			'title'  => 'Crea8or',
			'type'   => ace360_pair( 'Platform', 'Platform' ),
			'text'   => ace360_pair( 'Marketplace for creators with Mollie payments and payouts.', 'Marktplaats voor makers met Mollie-betalingen en -uitbetalingen.' ),
			'built'  => array(
				ace360_pair( 'Creator profiles and listings', 'Profielen en aanbod van makers' ),
				ace360_pair( 'Checkout with Mollie Connect', 'Afrekenen met Mollie Connect' ),
				ace360_pair( 'Automatic payouts to creators', 'Automatische uitbetalingen aan makers' ),
			),
			'stack'  => array( 'Platform', 'Mollie Connect', 'Payouts' ),
			'mockup' => 'crea8or',
			'sector' => 'platform',
			'featured' => true,
			'url'    => '',
		),
		array(
			'title'   => 'The PR Kiosk',
			'type'    => ace360_pair( 'Platform · PR & press releases', 'Platform · PR & persberichten' ),
			'text'    => ace360_pair( 'Order a press release like you order a product: pick a package, upload your story, pay and follow the coverage.', 'Een persbericht bestellen zoals je een product bestelt: kies een pakket, upload je verhaal, betaal en volg de publicaties.' ),
			'built'   => array(
				ace360_pair( 'Press-release packages with checkout', 'Persberichtpakketten met afrekenen' ),
				ace360_pair( 'Upload and review flow for stories', 'Upload- en reviewflow voor verhalen' ),
				ace360_pair( 'Coverage dashboard for each client', 'Publicatiedashboard per klant' ),
			),
			'stack'   => array( 'WordPress', 'WooCommerce', 'Mollie' ),
			'mockup'  => 'prkiosk',
			'sector'  => 'platform',
			'featured' => true,
			'url'     => '',
			'concept' => true,
		),
		array(
			'title'   => 'Shop4likes',
			'type'    => ace360_pair( 'Online store · social media growth', 'Webshop · groei op social media' ),
			'text'    => ace360_pair( 'Growth packages for Instagram, TikTok and YouTube, with instant checkout and order tracking.', 'Groeipakketten voor Instagram, TikTok en YouTube, met direct afrekenen en ordertracking.' ),
			'built'   => array(
				ace360_pair( 'Package picker per platform', 'Pakketkiezer per platform' ),
				ace360_pair( 'Checkout with iDEAL, cards and PayPal', 'Afrekenen met iDEAL, kaart en PayPal' ),
				ace360_pair( 'Order status page and email updates', 'Orderstatuspagina en updates per e-mail' ),
			),
			'stack'   => array( 'WooCommerce', 'Mollie', 'Order tracking' ),
			'mockup'  => 'shop4likes',
			'sector'  => 'store',
			'featured' => true,
			'url'     => '',
			'concept' => true,
		),
		array(
			'title'   => 'Bright Wells Foundation',
			'type'    => ace360_pair( 'NGO · donations', 'Goed doel · donaties' ),
			'text'    => ace360_pair( 'Charity site for clean-water projects, built so a first-time visitor can give in under a minute.', 'Site voor een goed doel met schoonwaterprojecten, gebouwd zodat een nieuwe bezoeker binnen een minuut kan doneren.' ),
			'built'   => array(
				ace360_pair( 'One-off and monthly giving with iDEAL', 'Eenmalig en maandelijks geven met iDEAL' ),
				ace360_pair( 'Live impact counter and project map', 'Live impactteller en projectkaart' ),
				ace360_pair( 'ANBI page and yearly reports', 'ANBI-pagina en jaarverslagen' ),
			),
			'stack'   => array( 'WordPress', 'Mollie', 'ANBI' ),
			'mockup'  => 'ngo',
			'sector'  => 'ngo',
			'featured' => true,
			'url'     => '',
			'concept' => true,
		),
		array(
			'title'   => 'Velours Skin',
			'type'    => ace360_pair( 'Shopify · skincare', 'Shopify · huidverzorging' ),
			'text'    => ace360_pair( 'Clean skincare store with a skin quiz that builds a routine and a subscription for refills.', 'Webshop voor clean skincare met een huidtest die een routine samenstelt en een abonnement op navullingen.' ),
			'built'   => array(
				ace360_pair( 'Skin quiz that recommends a routine', 'Huidtest die een routine aanraadt' ),
				ace360_pair( 'Refill subscriptions every 4, 6 or 8 weeks', 'Abonnement op navullingen elke 4, 6 of 8 weken' ),
				ace360_pair( 'Ingredient glossary in Dutch and English', 'Ingrediëntenlijst in het Nederlands en Engels' ),
			),
			'stack'   => array( 'Shopify', 'Subscriptions', 'NL / EN' ),
			'mockup'  => 'skincare',
			'sector'  => 'beauty',
			'featured' => true,
			'url'     => '',
			'concept' => true,
		),
		array(
			'title'   => 'Bakkerij Korrel',
			'type'    => ace360_pair( 'Online store · bakery', 'Webshop · bakkerij' ),
			'text'    => ace360_pair( 'Neighbourhood bakery that takes pre-orders online, so the bread is waiting when the customer walks in.', 'Buurtbakkerij die online voorbestellingen aanneemt, zodat het brood klaarligt als de klant binnenloopt.' ),
			'built'   => array(
				ace360_pair( 'Order today, pick up tomorrow from 07:30', 'Vandaag bestellen, morgen vanaf 07:30 ophalen' ),
				ace360_pair( 'Pickup slots so the counter never queues', 'Ophaalmomenten zodat er geen rij staat' ),
				ace360_pair( 'Cake orders with photo upload', 'Taartbestellingen met foto-upload' ),
			),
			'stack'   => array( 'WooCommerce', 'Pickup slots', 'iDEAL' ),
			'mockup'  => 'korrel',
			'sector'  => 'store',
			'url'     => '',
			'concept' => true,
		),
		array(
			'title'   => 'Studio Noor Hair',
			'type'    => ace360_pair( 'Booking site · hair salon', 'Boekingssite · kapsalon' ),
			'text'    => ace360_pair( 'Salon site where clients book a stylist, a service and a time in three taps.', 'Salonsite waar klanten in drie tikken een stylist, behandeling en tijd boeken.' ),
			'built'   => array(
				ace360_pair( 'Online booking per stylist', 'Online boeken per stylist' ),
				ace360_pair( 'Deposit for long appointments', 'Aanbetaling bij lange afspraken' ),
				ace360_pair( 'Automatic WhatsApp reminders', 'Automatische herinneringen via WhatsApp' ),
			),
			'stack'   => array( 'WordPress', 'Booking', 'Reminders' ),
			'mockup'  => 'noor',
			'sector'  => 'beauty',
			'url'     => '',
			'concept' => true,
		),
		array(
			'title'   => 'Spaak Fietsherstel',
			'type'    => ace360_pair( 'Booking site · bike repair', 'Boekingssite · fietsenmaker' ),
			'text'    => ace360_pair( 'Bike repair shop where customers book a repair and see the price before they come in.', 'Fietsenmaker waar klanten een reparatie boeken en de prijs zien voordat ze langskomen.' ),
			'built'   => array(
				ace360_pair( 'Repair menu with fixed prices', 'Reparatielijst met vaste prijzen' ),
				ace360_pair( 'Same-day slots for flat tyres', 'Plekken op dezelfde dag voor lekke banden' ),
				ace360_pair( 'Text message when the bike is ready', 'Sms als de fiets klaar is' ),
			),
			'stack'   => array( 'WordPress', 'Booking', 'SMS' ),
			'mockup'  => 'spaak',
			'sector'  => 'booking',
			'url'     => '',
			'concept' => true,
		),
		array(
			'title'   => 'Zout & Zuur',
			'type'    => ace360_pair( 'Restaurant · reservations', 'Restaurant · reserveringen' ),
			'text'    => ace360_pair( 'Small-plates restaurant with the menu, table reservations and gift cards on one page.', 'Restaurant met kleine gerechten: menukaart, reserveringen en cadeaubonnen op één pagina.' ),
			'built'   => array(
				ace360_pair( 'Table reservations with live availability', 'Tafelreserveringen met live beschikbaarheid' ),
				ace360_pair( 'Menu the chef updates from a phone', 'Menukaart die de chef vanaf de telefoon bijwerkt' ),
				ace360_pair( 'Gift cards with iDEAL', 'Cadeaubonnen met iDEAL' ),
			),
			'stack'   => array( 'WordPress', 'Reservations', 'Gift cards' ),
			'mockup'  => 'zout',
			'sector'  => 'booking',
			'url'     => '',
			'concept' => true,
		),
		array(
			'title'   => 'Ademruimte Yoga',
			'type'    => ace360_pair( 'Studio · classes & memberships', 'Studio · lessen & abonnementen' ),
			'text'    => ace360_pair( 'Yoga studio with a live class schedule, class cards and memberships.', 'Yogastudio met een live lesrooster, rittenkaarten en abonnementen.' ),
			'built'   => array(
				ace360_pair( 'Class schedule with spots left', 'Lesrooster met vrije plekken' ),
				ace360_pair( 'Class cards and monthly memberships', 'Rittenkaarten en maandabonnementen' ),
				ace360_pair( 'Waiting list that fills itself', 'Wachtlijst die zichzelf vult' ),
			),
			'stack'   => array( 'WordPress', 'Memberships', 'Mollie' ),
			'mockup'  => 'adem',
			'sector'  => 'booking',
			'url'     => '',
			'concept' => true,
		),
		array(
			'title'   => 'Grachtzicht Stays',
			'type'    => ace360_pair( 'Booking site · short stays', 'Boekingssite · korte verblijven' ),
			'text'    => ace360_pair( 'Canal-side apartments in Amsterdam, booked direct instead of through the big platforms.', 'Appartementen aan de gracht in Amsterdam, direct geboekt in plaats van via de grote platforms.' ),
			'built'   => array(
				ace360_pair( 'Direct booking with calendar sync', 'Direct boeken met agendasynchronisatie' ),
				ace360_pair( 'Prices per night and per season', 'Prijzen per nacht en per seizoen' ),
				ace360_pair( 'Guest guide in four languages', 'Gastengids in vier talen' ),
			),
			'stack'   => array( 'WordPress', 'Booking', 'Multilingual' ),
			'mockup'  => 'gracht',
			'sector'  => 'booking',
			'url'     => '',
			'concept' => true,
		),
		array(
			'title'   => 'Molen Coffee Roasters',
			'type'    => ace360_pair( 'Online store · coffee', 'Webshop · koffie' ),
			'text'    => ace360_pair( 'Small-batch roaster selling beans online, with a subscription that ships every two weeks.', 'Kleine branderij die bonen online verkoopt, met een abonnement dat elke twee weken verstuurt.' ),
			'built'   => array(
				ace360_pair( 'Coffee subscriptions with skip and pause', 'Koffieabonnement met overslaan en pauzeren' ),
				ace360_pair( 'Brew guide for every bean', 'Zetgids voor elke boon' ),
				ace360_pair( 'Wholesale login for cafés', 'Groothandelslogin voor cafés' ),
			),
			'stack'   => array( 'Shopify', 'Subscriptions', 'Wholesale' ),
			'mockup'  => 'molen',
			'sector'  => 'store',
			'url'     => '',
			'concept' => true,
		),
		array(
			'title'   => 'Stichting Voedselbrug',
			'type'    => ace360_pair( 'Charity · food bank', 'Goed doel · voedselbank' ),
			'text'    => ace360_pair( 'Local food bank site that signs up volunteers and collects donations in the same place.', 'Site van een lokale voedselbank die op één plek vrijwilligers werft en donaties ophaalt.' ),
			'built'   => array(
				ace360_pair( 'Volunteer sign-up with shift picker', 'Vrijwilligersaanmelding met dienstenkiezer' ),
				ace360_pair( 'Donations with iDEAL, one-off or monthly', 'Donaties met iDEAL, eenmalig of maandelijks' ),
				ace360_pair( 'Drop-off points on a map', 'Inzamelpunten op een kaart' ),
			),
			'stack'   => array( 'WordPress', 'Mollie', 'Volunteers' ),
			'mockup'  => 'voedselbrug',
			'sector'  => 'ngo',
			'url'     => '',
			'concept' => true,
		),
		array(
			'title'   => 'Youth Rise Foundation',
			'type'    => ace360_pair( 'Charity · mentoring', 'Goed doel · mentoring' ),
			'text'    => ace360_pair( 'Mentoring programme that matches young people with a mentor and shows donors the results.', 'Mentorprogramma dat jongeren aan een mentor koppelt en donateurs de resultaten laat zien.' ),
			'built'   => array(
				ace360_pair( 'Mentor applications with screening steps', 'Mentoraanmelding met screeningsstappen' ),
				ace360_pair( 'Stories and results from each year', 'Verhalen en resultaten per jaar' ),
				ace360_pair( 'Sponsor-a-mentee monthly giving', 'Maandelijks een jongere sponsoren' ),
			),
			'stack'   => array( 'WordPress', 'Applications', 'Mollie' ),
			'mockup'  => 'youthrise',
			'sector'  => 'ngo',
			'url'     => '',
			'concept' => true,
		),
		array(
			'title'   => 'Ébène Skin',
			'type'    => ace360_pair( 'Shopify · skincare', 'Shopify · huidverzorging' ),
			'text'    => ace360_pair( 'Skincare made for melanin-rich skin, with routines by concern and shade-safe ingredients.', 'Huidverzorging voor een donkere huid, met routines per huidprobleem en veilige ingrediënten.' ),
			'built'   => array(
				ace360_pair( 'Shop by concern: dark spots, dryness, texture', 'Shoppen per huidprobleem: pigmentvlekken, droogte, textuur' ),
				ace360_pair( 'Before-and-after stories from customers', 'Voor-en-naverhalen van klanten' ),
				ace360_pair( 'Ships across the EU and to the UK', 'Verzending in de hele EU en naar het VK' ),
			),
			'stack'   => array( 'Shopify', 'Reviews', 'EU shipping' ),
			'mockup'  => 'ebene',
			'sector'  => 'beauty',
			'url'     => '',
			'concept' => true,
		),
		array(
			'title'   => 'Glow Ritual Studio',
			'type'    => ace360_pair( 'Booking site · lashes & brows', 'Boekingssite · wimpers & wenkbrauwen' ),
			'text'    => ace360_pair( 'Lash and brow studio with online booking, a deposit and aftercare tips by email.', 'Studio voor wimpers en wenkbrauwen met online boeken, aanbetaling en nazorgtips per e-mail.' ),
			'built'   => array(
				ace360_pair( 'Booking with deposit against no-shows', 'Boeken met aanbetaling tegen no-shows' ),
				ace360_pair( 'Before-and-after gallery', 'Galerij met voor-en-na' ),
				ace360_pair( 'Aftercare email after each visit', 'Nazorgmail na elk bezoek' ),
			),
			'stack'   => array( 'WordPress', 'Booking', 'Mollie' ),
			'mockup'  => 'glow',
			'sector'  => 'beauty',
			'url'     => '',
			'concept' => true,
		),
		array(
			'title'   => 'Jollof House',
			'type'    => ace360_pair( 'Online store · catering', 'Webshop · catering' ),
			'text'    => ace360_pair( 'West African kitchen in Rotterdam taking catering and party-tray orders online.', 'West-Afrikaanse keuken in Rotterdam die catering en partyschalen online aanneemt.' ),
			'built'   => array(
				ace360_pair( 'Party-tray builder with live total', 'Partyschaal samenstellen met live totaal' ),
				ace360_pair( 'Delivery date and time picker', 'Kiezen van bezorgdatum en -tijd' ),
				ace360_pair( 'Menu in English and Dutch', 'Menukaart in het Engels en Nederlands' ),
			),
			'stack'   => array( 'WooCommerce', 'Delivery slots', 'iDEAL' ),
			'mockup'  => 'jollof',
			'sector'  => 'store',
			'url'     => '',
			'concept' => true,
		),
		array(
			'title'   => 'Lens & Linen',
			'type'    => ace360_pair( 'Portfolio · wedding photography', 'Portfolio · trouwfotografie' ),
			'text'    => ace360_pair( 'Wedding photographer portfolio that lets couples check a date and get a quote straight away.', 'Portfolio van een trouwfotograaf waar stellen direct een datum checken en een prijs krijgen.' ),
			'built'   => array(
				ace360_pair( 'Full-screen galleries that load fast', 'Schermvullende galerijen die snel laden' ),
				ace360_pair( 'Date checker linked to the calendar', 'Datumcheck gekoppeld aan de agenda' ),
				ace360_pair( 'Packages with an instant quote', 'Pakketten met directe prijsopgave' ),
			),
			'stack'   => array( 'WordPress', 'Galleries', 'Calendar' ),
			'mockup'  => 'lens',
			'sector'  => 'platform',
			'url'     => '',
			'concept' => true,
		),
	);
}

/**
 * FAQ.
 */
function ace360_faq() {
	return array(
		array(
			ace360_pair( 'I already have a design. Can you build it?', 'Ik heb al een ontwerp. Kun je dat bouwen?' ),
			ace360_pair( 'Yes, and it is usually the fastest route. Send it as Figma, XD or a PDF with the image files. I convert it to WordPress, sort out the theme, plugins and hosting, and put it live. A finished design normally saves a week.', 'Ja, en meestal is dat de snelste route. Stuur het als Figma, XD of pdf met de beeldbestanden. Ik zet het om naar WordPress, regel thema, plug-ins en hosting en zet het live. Een af ontwerp scheelt meestal een week.' ),
		),
		array(
			ace360_pair( 'Can I edit the site myself afterwards?', 'Kan ik de site daarna zelf aanpassen?' ),
			ace360_pair( 'Yes. Everything you would normally want to change — text, photos, job listings, products — you can do yourself. At handover you get a half-hour walkthrough and a short guide. Prefer to hand it off? That falls under the maintenance plan.', 'Ja. Alles wat je normaal wilt aanpassen — tekst, foto’s, vacatures, producten — doe je zelf. Bij de overdracht krijg je een rondleiding van een half uur en een korte handleiding. Liever uitbesteden? Dat valt onder het onderhoudsplan.' ),
		),
		array(
			ace360_pair( 'Who owns the domain, the hosting and the site?', 'Van wie zijn het domein, de hosting en de site?' ),
			ace360_pair( 'You do. Domain and hosting are registered in your name, not mine. You get every login. If you ever want to work with someone else, you take the whole thing with you.', 'Van jou. Domein en hosting staan op jouw naam, niet op de mijne. Je krijgt alle inloggegevens. Wil je ooit met iemand anders verder, dan neem je alles mee.' ),
		),
		array(
			ace360_pair( 'I’m outside the Netherlands. Can we still work together?', 'Ik zit buiten Nederland. Kunnen we toch samenwerken?' ),
			ace360_pair( 'Yes. I work fully remote and in English with clients across the EU and beyond. Calls are planned around your time zone and quotes are in euros. EU businesses with a VAT number are invoiced with VAT reverse-charged; outside the EU no Dutch VAT is charged.', 'Ja. Ik werk volledig op afstand en in het Engels met klanten in de EU en daarbuiten. Gesprekken plan ik rond jouw tijdzone en offertes zijn in euro’s. EU-bedrijven met een btw-nummer factureer ik met btw verlegd; buiten de EU reken ik geen Nederlandse btw.' ),
		),
		array(
			ace360_pair( 'Are the prices on the site final?', 'Zijn de prijzen op de site definitief?' ),
			ace360_pair( 'No, they are estimates, based on comparable projects. They show whether you are in the right bracket without requesting three quotes first. What your site really costs depends on the details, so the final price follows after a short call, in writing, before anything gets built.', 'Nee, het zijn prijsindicaties op basis van vergelijkbare projecten. Je ziet zo of je in de goede prijsklasse zit, zonder eerst drie offertes aan te vragen. Wat jouw site echt kost hangt af van de details, dus de definitieve prijs volgt na een kort gesprek, op papier, voordat er iets gebouwd wordt.' ),
		),
		array(
			ace360_pair( 'What happens if it runs late?', 'Wat als het uitloopt?' ),
			ace360_pair( 'The launch date is in the quote. If it slips because of me, you do not pay extra. If it slips because text or images are not ready, we move the date together — and you hear that straight away, not afterwards.', 'De lanceerdatum staat in de offerte. Loopt het uit door mij, dan betaal je niets extra. Loopt het uit omdat tekst of beeld nog niet klaar is, dan verzetten we de datum samen — en dat hoor je meteen, niet achteraf.' ),
		),
		array(
			ace360_pair( 'What is in the maintenance plan?', 'Wat zit er in het onderhoudsplan?' ),
			ace360_pair( 'WordPress and plugin updates, daily backups, security checks, monitoring and half an hour of small changes a month. You get a monthly summary. Cancel any month.', 'WordPress- en plug-in-updates, dagelijkse back-ups, beveiligingscontroles, monitoring en een half uur kleine aanpassingen per maand. Je krijgt een maandelijks overzicht. Maandelijks opzegbaar.' ),
		),
	);
}

/**
 * Self-quote price model. Amounts in euros excluding VAT.
 *
 * types:  base = [low, high] including 'incl' pages; perPage = [low, high] per extra page.
 * design: custom design adds a percentage of the base.
 * extras: flat [low, high]; 'only' limits an extra to some project types.
 * rush:   multiplier and weeks saved.
 *
 * Change the numbers here, or override them with the 'ace360_estimator' filter.
 */
function ace360_estimator() {
	$config = array(
		'types'   => array(
			array( 'id' => 'onepager', 'label' => ace360_pair( 'One-pager', 'One-pager' ), 'hint' => ace360_pair( '1 page', '1 pagina' ), 'base' => array( 269, 349 ), 'incl' => 1, 'perPage' => array( 0, 0 ), 'pages' => false, 'weeks' => array( 1, 2 ) ),
			array( 'id' => 'website', 'label' => ace360_pair( 'Website', 'Website' ), 'hint' => ace360_pair( 'several pages', 'meerdere pagina’s' ), 'base' => array( 449, 549 ), 'incl' => 5, 'perPage' => array( 29, 39 ), 'pages' => true, 'weeks' => array( 2, 3 ) ),
			array( 'id' => 'store', 'label' => ace360_pair( 'Online store', 'Webshop' ), 'hint' => ace360_pair( 'with payments', 'met betalingen' ), 'base' => array( 449, 599 ), 'incl' => 5, 'perPage' => array( 29, 39 ), 'pages' => true, 'weeks' => array( 3, 4 ) ),
			array( 'id' => 'care', 'label' => ace360_pair( 'Maintenance', 'Onderhoud' ), 'hint' => ace360_pair( 'existing site', 'bestaande site' ), 'base' => array( 49, 99 ), 'incl' => 0, 'perPage' => array( 0, 0 ), 'pages' => false, 'weeks' => array( 0, 1 ) ),
		),
		'design'  => array(
			array( 'id' => 'tailored', 'label' => ace360_pair( 'Tailored', 'Op maat gestyled' ), 'hint' => ace360_pair( 'proven layout, your brand', 'bewezen opzet, jouw merk' ), 'pct' => 0 ),
			array( 'id' => 'custom', 'label' => ace360_pair( 'Fully custom', 'Volledig maatwerk' ), 'hint' => ace360_pair( 'designed from scratch', 'vanaf nul ontworpen' ), 'pct' => 40 ),
		),
		'extras'  => array(
			array( 'id' => 'copy', 'label' => ace360_pair( 'Copywriting', 'Teksten schrijven' ), 'price' => array( 99, 149 ) ),
			array( 'id' => 'images', 'label' => ace360_pair( 'Images and photography', 'Beeld en fotografie' ), 'price' => array( 79, 129 ) ),
			array( 'id' => 'seo', 'label' => ace360_pair( 'SEO groundwork', 'SEO-basis' ), 'price' => array( 79, 119 ) ),
			array( 'id' => 'lang', 'label' => ace360_pair( 'Second language', 'Tweede taal' ), 'price' => array( 149, 199 ) ),
			array( 'id' => 'booking', 'label' => ace360_pair( 'Booking or sign-up system', 'Boekings- of inschrijfsysteem' ), 'price' => array( 149, 199 ) ),
			array( 'id' => 'brand', 'label' => ace360_pair( 'Logo and identity', 'Logo en huisstijl' ), 'price' => array( 199, 299 ) ),
			array( 'id' => 'motion', 'label' => ace360_pair( 'Animation and 3D', 'Animatie en 3D' ), 'price' => array( 299, 499 ) ),
			array( 'id' => 'products', 'label' => ace360_pair( 'Product upload (up to 100)', 'Producten invoeren (tot 100)' ), 'price' => array( 99, 149 ), 'only' => array( 'store' ) ),
		),
		'rush'    => array( 'factor' => 1.2, 'weeks' => 1 ),
		'care'    => 13.5,
		'vat'     => 21,
	);
	/**
	 * Filter the self-quote price model.
	 *
	 * @param array $config Price model.
	 */
	return apply_filters( 'ace360_estimator', $config );
}

/**
 * Turn the price model into the plain array the estimator script reads.
 */
function ace360_estimator_js() {
	$c    = ace360_estimator();
	$flat = function ( $list ) {
		return array_map(
			function ( $item ) {
				foreach ( array( 'label', 'hint' ) as $k ) {
					if ( isset( $item[ $k ] ) ) {
						$item[ $k . '_en' ] = $item[ $k ]['en'];
						$item[ $k . '_nl' ] = $item[ $k ]['nl'];
						unset( $item[ $k ] );
					}
				}
				return $item;
			},
			$list
		);
	};
	return array(
		'types'  => $flat( $c['types'] ),
		'design' => $flat( $c['design'] ),
		'extras' => $flat( $c['extras'] ),
		'rush'   => $c['rush'],
		'care'   => $c['care'],
		'vat'    => $c['vat'],
	);
}

/**
 * What a site like a portfolio project would cost, straight from the price
 * model: [ type, extras ] → [ lo, hi, weeks_lo, weeks_hi ] (excl. VAT).
 *
 * @param string $mockup Project key from ace360_work().
 * @return array|null Null when the project is beyond the self-quote (custom platforms).
 */
function ace360_work_quote( $mockup ) {
	$map = array(
		'culpromark'  => array( 'website', array( 'seo', 'copy' ) ),
		'hesed'       => array( 'website', array( 'booking' ) ),
		'sidwalk'     => array( 'store', array( 'brand', 'images' ) ),
		'prkiosk'     => array( 'store', array( 'copy' ) ),
		'shop4likes'  => array( 'store', array() ),
		'ngo'         => array( 'website', array( 'copy' ) ),
		'skincare'    => array( 'store', array( 'products' ) ),
		'korrel'      => array( 'store', array() ),
		'noor'        => array( 'website', array( 'booking' ) ),
		'spaak'       => array( 'website', array( 'booking' ) ),
		'zout'        => array( 'website', array( 'booking' ) ),
		'adem'        => array( 'website', array( 'booking' ) ),
		'gracht'      => array( 'website', array( 'booking', 'lang' ) ),
		'molen'       => array( 'store', array( 'products' ) ),
		'voedselbrug' => array( 'website', array( 'booking' ) ),
		'youthrise'   => array( 'website', array( 'booking' ) ),
		'ebene'       => array( 'store', array( 'products', 'lang' ) ),
		'glow'        => array( 'website', array( 'booking' ) ),
		'jollof'      => array( 'store', array( 'lang' ) ),
		'lens'        => array( 'website', array( 'booking', 'images' ) ),
	);
	if ( ! isset( $map[ $mockup ] ) ) {
		return null;
	}
	$c    = ace360_estimator();
	$type = null;
	foreach ( $c['types'] as $t ) {
		if ( $t['id'] === $map[ $mockup ][0] ) {
			$type = $t;
		}
	}
	if ( ! $type ) {
		return null;
	}
	$lo = $type['base'][0];
	$hi = $type['base'][1];
	$w0 = $type['weeks'][0];
	$w1 = $type['weeks'][1];
	foreach ( $c['extras'] as $x ) {
		if ( in_array( $x['id'], $map[ $mockup ][1], true ) ) {
			$lo += $x['price'][0];
			$hi += $x['price'][1];
			if ( 'brand' === $x['id'] ) {
				++$w0;
				++$w1;
			}
		}
	}
	return array(
		'lo'     => $lo,
		'hi'     => $hi,
		'w0'     => $w0,
		'w1'     => $w1,
		'type'   => $type['id'],
		'extras' => $map[ $mockup ][1],
	);
}

/**
 * "Build your homepage": the businesses and moods a visitor can try.
 * Each business is one of the sample sites (assets/js/screens.js).
 */
function ace360_try() {
	return array(
		'sectors' => array(
			array( 'korrel', ace360_pair( 'Bakery', 'Bakkerij' ) ),
			array( 'noor', ace360_pair( 'Hair salon', 'Kapsalon' ) ),
			array( 'zout', ace360_pair( 'Restaurant', 'Restaurant' ) ),
			array( 'molen', ace360_pair( 'Online store', 'Webshop' ) ),
			array( 'voedselbrug', ace360_pair( 'Charity', 'Goed doel' ) ),
			array( 'adem', ace360_pair( 'Studio', 'Studio' ) ),
		),
		'moods'   => array(
			array( 'calm', ace360_pair( 'Calm', 'Rustig' ), ace360_pair( 'Light, lots of air, soft colour.', 'Licht, veel ruimte, zachte kleur.' ) ),
			array( 'warm', ace360_pair( 'Warm', 'Warm' ), ace360_pair( 'The brand colours, as the owner would pick them.', 'De merkkleuren, zoals de eigenaar ze kiest.' ) ),
			array( 'bold', ace360_pair( 'Bold', 'Gedurfd' ), ace360_pair( 'Dark, high contrast, one loud colour.', 'Donker, veel contrast, één harde kleur.' ) ),
		),
	);
}
