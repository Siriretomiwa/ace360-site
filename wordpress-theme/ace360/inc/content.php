<?php
/**
 * Site copy in English and Dutch, plus the price estimator table.
 *
 * Every string is a pair: array( 'en' => ..., 'nl' => ... ). Templates print
 * both with ace360_t(); the EN/NL switch in the header shows one of them.
 * To change copy, edit it here. Prices live in ace360_estimator().
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
		'kicker'  => ace360_pair( 'Web design and digital growth · Netherlands', 'Webdesign en digitale groei · Nederland' ),
		'title'   => ace360_pair( 'You know the price before we get on a call.', 'Je weet de prijs al voordat we bellen.' ),
		'text'    => ace360_pair(
			'Ace 360 Services builds websites and online stores for businesses in the Netherlands and abroad. Fixed price up front, a launch date that holds, and one person to talk to. No account manager, no surprise invoice at the end.',
			'Ace 360 Services bouwt websites en webshops voor bedrijven in Nederland en daarbuiten. Vaste prijs vooraf, een lanceerdatum die klopt en één aanspreekpunt. Geen accountmanager, geen verrassingsfactuur achteraf.'
		),
		'call'    => ace360_pair( 'Call now', 'Bel nu' ),
		'how'     => ace360_pair( 'How I work', 'Zo werk ik' ),
		'bullets' => array(
			ace360_pair( 'Reply within 1 working day', 'Antwoord binnen 1 werkdag' ),
			ace360_pair( 'Fixed price, no overruns billed', 'Vaste prijs, geen meerwerk achteraf' ),
			ace360_pair( 'Domain and site stay yours', 'Domein en site blijven van jou' ),
			ace360_pair( 'Working in English and Dutch', 'Werkt in het Nederlands en Engels' ),
		),
	);
}

/**
 * Services with prices.
 */
function ace360_services() {
	return array(
		array(
			'title' => ace360_pair( 'Website build', 'Website laten maken' ),
			'text'  => ace360_pair(
				'From a one-pager to a site with job listings, forms and a booking page. Built in WordPress, so you can get into it yourself without calling me.',
				'Van one-pager tot site met vacatures, formulieren en een boekingspagina. Gebouwd in WordPress, zodat je er zelf in kunt zonder mij te bellen.'
			),
			'price' => ace360_pair( 'from €550', 'vanaf € 550' ),
		),
		array(
			'title' => ace360_pair( 'Online store', 'Webshop' ),
			'text'  => ace360_pair(
				'WooCommerce or Shopify, with iDEAL and the rest of Mollie wired up. Stock, shipping rules and VAT set correctly before you go live.',
				'WooCommerce of Shopify, met iDEAL en de rest van Mollie gekoppeld. Voorraad, verzendregels en btw goed ingesteld voordat je live gaat.'
			),
			'price' => ace360_pair( 'from €2,900', 'vanaf € 2.900' ),
		),
		array(
			'title' => ace360_pair( 'Maintenance and care', 'Onderhoud' ),
			'text'  => ace360_pair(
				'Updates, backups, security and small changes. Every month you get a short summary of what was done. Cancel any month.',
				'Updates, back-ups, beveiliging en kleine aanpassingen. Elke maand krijg je een kort overzicht van wat er is gedaan. Maandelijks opzegbaar.'
			),
			'price' => ace360_pair( '€95 per month', '€ 95 per maand' ),
		),
		array(
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
 * Process steps. Each one is a chapter; the 3D house is built along with it.
 */
function ace360_process() {
	return array(
		array( ace360_pair( 'First call', 'Kennismaking' ), ace360_pair( 'Day 1', 'Dag 1' ), ace360_pair( 'Twenty minutes. I ask what the site has to bring in, not what colour it should be.', 'Twintig minuten. Ik vraag wat de site moet opleveren, niet welke kleur hij moet hebben.' ) ),
		array( ace360_pair( 'Fixed quote', 'Vaste offerte' ), ace360_pair( 'Within 2 days', 'Binnen 2 dagen' ), ace360_pair( 'You get a price, a launch date and a list of what is and is not included. On one page.', 'Je krijgt een prijs, een lanceerdatum en een lijst van wat wel en niet is inbegrepen. Op één pagina.' ) ),
		array( ace360_pair( 'Design', 'Ontwerp' ), ace360_pair( 'Week 1', 'Week 1' ), ace360_pair( 'You see the layout before anything gets built. Two rounds of feedback are included.', 'Je ziet de opzet voordat er iets gebouwd wordt. Twee feedbackrondes zijn inbegrepen.' ) ),
		array( ace360_pair( 'Build', 'Bouw' ), ace360_pair( 'Week 2–3', 'Week 2–3' ), ace360_pair( 'I build on a staging site you can watch. Text and images get filled in as we go.', 'Ik bouw op een testomgeving waar je kunt meekijken. Tekst en beeld vullen we gaandeweg in.' ) ),
		array( ace360_pair( 'Launch and handover', 'Lancering en overdracht' ), ace360_pair( 'Launch', 'Lancering' ), ace360_pair( 'The site goes live, you get the logins and a walkthrough. After that you can run it yourself.', 'De site gaat live, je krijgt de inloggegevens en een rondleiding. Daarna kun je hem zelf beheren.' ) ),
	);
}

/**
 * Recent work, shown until Projects are added in the dashboard.
 */
function ace360_work() {
	return array(
		array(
			'title' => 'Hesed Impact Ministries',
			'type'  => ace360_pair( 'WordPress theme', 'WordPress-thema' ),
			'text'  => ace360_pair( 'Custom theme with events, a media archive and a donation page.', 'Maatwerkthema met evenementen, een media-archief en een donatiepagina.' ),
		),
		array(
			'title' => 'SIDWALK',
			'type'  => ace360_pair( 'Shopify + brand identity', 'Shopify + merkidentiteit' ),
			'text'  => ace360_pair( 'Streetwear store, from logo and identity through to the first campaign.', 'Streetwearwinkel, van logo en identiteit tot de eerste campagne.' ),
		),
		array(
			'title' => 'Crea8or',
			'type'  => ace360_pair( 'Platform', 'Platform' ),
			'text'  => ace360_pair( 'Marketplace for creators with Mollie payments and payouts.', 'Marktplaats voor makers met Mollie-betalingen en -uitbetalingen.' ),
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
			ace360_pair(
				'Yes, and it is usually the fastest route. Send it as Figma, XD or a PDF with the image files. I convert it to WordPress, sort out the theme, plugins and hosting, and put it live. A finished design normally saves a week.',
				'Ja, en meestal is dat de snelste route. Stuur het als Figma, XD of pdf met de beeldbestanden. Ik zet het om naar WordPress, regel thema, plug-ins en hosting en zet het live. Een af ontwerp scheelt meestal een week.'
			),
		),
		array(
			ace360_pair( 'Can I edit the site myself afterwards?', 'Kan ik de site daarna zelf aanpassen?' ),
			ace360_pair(
				'Yes. Everything you would normally want to change — text, photos, job listings, products — you can do yourself. At handover you get a half-hour walkthrough and a short guide. Prefer to hand it off? That falls under the maintenance plan.',
				'Ja. Alles wat je normaal wilt aanpassen — tekst, foto’s, vacatures, producten — doe je zelf. Bij de overdracht krijg je een rondleiding van een half uur en een korte handleiding. Liever uitbesteden? Dat valt onder het onderhoudsplan.'
			),
		),
		array(
			ace360_pair( 'Who owns the domain, the hosting and the site?', 'Van wie zijn het domein, de hosting en de site?' ),
			ace360_pair(
				'You do. Domain and hosting are registered in your name, not mine. You get every login. If you ever want to work with someone else, you take the whole thing with you.',
				'Van jou. Domein en hosting staan op jouw naam, niet op de mijne. Je krijgt alle inloggegevens. Wil je ooit met iemand anders verder, dan neem je alles mee.'
			),
		),
		array(
			ace360_pair( 'I’m not based in the Netherlands. Can we still work together?', 'Ik zit niet in Nederland. Kunnen we toch samenwerken?' ),
			ace360_pair(
				'Yes. I work with clients across Europe and beyond, fully remote and in English. Calls are planned around your time zone and quotes are in euros. Businesses in other EU countries with a VAT number are invoiced with VAT reverse-charged.',
				'Ja. Ik werk met klanten in heel Europa en daarbuiten, volledig op afstand en in het Engels. Gesprekken plan ik rond jouw tijdzone en offertes zijn in euro’s. Bedrijven in andere EU-landen met een btw-nummer factureer ik met btw verlegd.'
			),
		),
		array(
			ace360_pair( 'Why are the prices on the site?', 'Waarom staan de prijzen op de site?' ),
			ace360_pair(
				'Because otherwise you have to request three quotes just to find out whether you are in the right bracket. That costs you a week. The estimator above gives the same range I would give you on the phone.',
				'Omdat je anders drie offertes moet aanvragen om te weten of je in de goede prijsklasse zit. Dat kost je een week. De prijsindicatie hierboven geeft dezelfde bandbreedte die ik je aan de telefoon zou geven.'
			),
		),
		array(
			ace360_pair( 'What happens if it runs late?', 'Wat als het uitloopt?' ),
			ace360_pair(
				'The launch date is in the quote. If it slips because of me, you do not pay extra. If it slips because text or images are not ready, we move the date together — and you hear that straight away, not afterwards.',
				'De lanceerdatum staat in de offerte. Loopt het uit door mij, dan betaal je niets extra. Loopt het uit omdat tekst of beeld nog niet klaar is, dan verzetten we de datum samen — en dat hoor je meteen, niet achteraf.'
			),
		),
		array(
			ace360_pair( 'What is in the maintenance plan?', 'Wat zit er in het onderhoudsplan?' ),
			ace360_pair(
				'WordPress and plugin updates, daily backups, security checks, monitoring and half an hour of small changes a month. You get a monthly summary. Cancel any month.',
				'WordPress- en plug-in-updates, dagelijkse back-ups, beveiligingscontroles, monitoring en een half uur kleine aanpassingen per maand. Je krijgt een maandelijks overzicht. Maandelijks opzegbaar.'
			),
		),
	);
}

/**
 * Price estimator. Amounts are in euros excluding VAT; weeks are build time.
 * Edit these numbers to match your own pricing.
 */
function ace360_estimator() {
	$config = array(
		'types'  => array(
			array( 'id' => 'onepager', 'label' => ace360_pair( 'One-pager', 'One-pager' ), 'min' => 550, 'max' => 900, 'weeks' => 1 ),
			array( 'id' => 'website', 'label' => ace360_pair( 'Website, 5–10 pages', 'Website, 5–10 pagina’s' ), 'min' => 1200, 'max' => 2400, 'weeks' => 3 ),
			array( 'id' => 'store', 'label' => ace360_pair( 'Online store', 'Webshop' ), 'min' => 2900, 'max' => 5500, 'weeks' => 4 ),
			array( 'id' => 'platform', 'label' => ace360_pair( 'Platform or custom build', 'Platform of maatwerk' ), 'min' => 6000, 'max' => 0, 'weeks' => 8 ),
		),
		'extras' => array(
			array( 'id' => 'lang', 'label' => ace360_pair( 'Second language', 'Tweede taal' ), 'min' => 250, 'max' => 600, 'weeks' => 0 ),
			array( 'id' => 'booking', 'label' => ace360_pair( 'Bookings or appointments', 'Boekingen of afspraken' ), 'min' => 300, 'max' => 700, 'weeks' => 0 ),
			array( 'id' => 'copy', 'label' => ace360_pair( 'Copywriting', 'Teksten schrijven' ), 'min' => 200, 'max' => 600, 'weeks' => 0 ),
			array( 'id' => 'brand', 'label' => ace360_pair( 'Logo and identity', 'Logo en huisstijl' ), 'min' => 450, 'max' => 1200, 'weeks' => 1 ),
			array( 'id' => 'move', 'label' => ace360_pair( 'Move my old site', 'Oude site overzetten' ), 'min' => 200, 'max' => 500, 'weeks' => 0 ),
		),
		'care'   => 95,
	);
	/**
	 * Filter the estimator prices.
	 *
	 * @param array $config Types, extras and monthly care price.
	 */
	return apply_filters( 'ace360_estimator', $config );
}
