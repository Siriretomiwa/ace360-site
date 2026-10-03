/**
 * Culpromark Limited · all website content.
 *
 * Everything the site shows comes from this file: edit a line, add an item to a
 * list, save, and the page updates. No build step.
 *
 *  - Lists (services, line, sectors, check, steps, standards, insights, faq) can
 *    grow or shrink: copy an item, change the text, keep the commas.
 *  - Words between *stars* are shown in the accent style.
 *  - Figures marked SAMPLE are placeholders for this concept. Replace them with
 *    real figures before the site goes live.
 *  - Critical limits in "line" are typical examples to explain HACCP. A client's
 *    own HACCP plan sets the real limits for their product.
 */
window.CULPROMARK = {
  company: {
    name: 'Culpromark',
    legal: 'Culpromark Limited',
    tagline: 'Food safety & processing',
    email: 'info@culpromark.com',        // replace with the real address
    phone: '',                           // optional, e.g. '+44 20 0000 0000'
    hours: 'Mon–Fri · 08:00–17:00',
    area: 'On site and remote, across the region and for exporters'
  },

  nav: [
    ['Services', '#services'],
    ['The line', '#line'],
    ['Readiness check', '#check'],
    ['Sectors', '#sectors'],
    ['Insights', '#insights'],
    ['Contact', '#contact']
  ],
  cta: 'Book a site audit',

  hero: {
    kicker: 'Food safety & processing consultancy',
    title: 'Safe food, made *provable*.',
    lede: 'Culpromark helps food processors build safe lines, pass audits and prove it every single day, with HACCP plans, audits, lab testing, hygienic line design and training that sticks.',
    primary: 'Book a site audit',
    secondary: 'Take the 2-minute readiness check',
    proof: ['HACCP · ISO 22000 · FSSC 22000 · BRCGS', 'Plans written for your line, not a template'],
    // the live monitor beside the headline: [label, unit, value, limit text, min, max, ok-check]
    monitor: [
      { label: 'Chiller 2', unit: '°C', value: 3.1, jitter: 0.25, limit: '≤ 5.0 °C', max: 5 },
      { label: 'Pasteuriser · hold', unit: '°C', value: 72.6, jitter: 0.3, limit: '≥ 72.0 °C / 15 s', min: 72 },
      { label: 'Blast chiller core', unit: '°C', value: 4.4, jitter: 0.3, limit: '< 5 °C in 90 min', max: 5 },
      { label: 'Wash water', unit: 'ppm', value: 78, jitter: 4, limit: '50–100 ppm free Cl', min: 50, max: 100 }
    ],
    checks: ['Metal detector test · 14:00 · pass', 'Allergen changeover · Line B · verified']
  },

  services: [
    { icon: 'plan', title: 'HACCP & food safety plans', text: 'Hazard analysis, CCPs, critical limits and the records behind them, written for your products and your line.', points: ['Hazard analysis & flow diagrams', 'CCP decision tree & limits', 'Monitoring and verification records'] },
    { icon: 'audit', title: 'Audits & certification readiness', text: 'Gap analysis and mock audits so the real one is a formality. We prepare you for the standard your buyers ask for.', points: ['ISO 22000 · FSSC 22000 · BRCGS · SQF', 'Mock audits with a scored report', 'Corrective-action plans'] },
    { icon: 'lab', title: 'Lab testing & microbiology', text: 'Sampling plans, environmental swabbing and shelf-life studies, with results you can actually act on.', points: ['Listeria & environmental monitoring', 'Shelf-life and challenge testing', 'Water and surface testing'] },
    { icon: 'line', title: 'Processing line design', text: 'Hygienic layout and equipment choices from day one, so cleaning works and product flows from raw to ready without crossing back.', points: ['Hygienic design & zoning', 'Commissioning & validation', 'Cleaning (CIP/COP) validation'] },
    { icon: 'train', title: 'Training that sticks', text: 'Short, practical sessions on the floor and in the classroom, for operators, supervisors and HACCP teams.', points: ['Food handler & hygiene', 'HACCP for teams and leads', 'Allergen & changeover drills'] },
    { icon: 'label', title: 'Regulatory & labelling', text: 'Labels, allergen declarations and export paperwork checked before they cost you a recall.', points: ['Label & allergen review', 'Traceability & recall plans', 'Export and buyer requirements'] }
  ],

  // "Follow the line": every station of a typical processing line.
  // ccp: a number makes it a Critical Control Point (shown in yellow).
  line: {
    title: 'Follow the *line*',
    lede: 'Every product passes the same stations. At each one something can go wrong, and at the critical ones we set a limit, a check and a fix. Click a station, or let it run.',
    note: 'Example limits for illustration. Your HACCP plan sets the limits for your product.',
    stages: [
      { icon: 'truck', name: 'Receiving', hazard: 'Pathogens or chemical residues on raw materials; warm deliveries.', control: 'Approved suppliers, certificates of analysis, temperature checked on arrival.', limit: 'Chilled goods ≤ 5 °C on arrival', monitor: 'Probe every delivery, record on the goods-in log', we: 'Supplier approval programme and a goods-in check that takes 2 minutes.' },
      { icon: 'wash', name: 'Washing', hazard: 'Soil, pests and foreign matter; pathogens spread by dirty wash water.', control: 'Potable water with controlled sanitiser; water changed on schedule.', limit: '50–100 ppm free chlorine', monitor: 'Test strips every hour', we: 'Wash-water validation and a simple hourly check sheet.' },
      { icon: 'mix', name: 'Processing', hazard: 'Allergen cross-contact; physical contamination from tools.', control: 'Allergen production order, colour-coded tools, validated changeover cleans.', limit: 'No allergen-free run after an allergen run without a verified clean', monitor: 'Changeover checklist and swab before restart', we: 'Allergen matrix, changeover procedure and staff drills.' },
      { icon: 'heat', name: 'Cooking', ccp: 1, hazard: 'Survival of vegetative pathogens (Salmonella, Listeria, E. coli).', control: 'Time and temperature, monitored continuously.', limit: 'Core ≥ 72 °C for at least 15 s', monitor: 'Continuous probe and chart recorder, checked each batch', we: 'Validation study, set-point alarms and a divert-and-reprocess procedure.' },
      { icon: 'cool', name: 'Rapid cooling', ccp: 2, hazard: 'Growth of spore-formers (C. perfringens) while product cools.', control: 'Blast chilling with a timed core-temperature check.', limit: 'Core < 5 °C within 90 minutes', monitor: 'Core probe at start and end of every chill cycle', we: 'Chill-curve validation and loading rules your team can follow.' },
      { icon: 'pack', name: 'Packing & labelling', hazard: 'Wrong label or missing allergen declaration; poor seals.', control: 'Label verification at start-up and every changeover; seal checks.', limit: 'Label matches recipe and allergen matrix, every run', monitor: 'Start-up sign-off with label retained on the record', we: 'Label review and a start-up check that catches the wrong reel.' },
      { icon: 'metal', name: 'Metal detection', ccp: 3, hazard: 'Metal fragments from equipment wear or packaging.', control: 'In-line metal detector with automatic reject.', limit: 'Reject Fe 1.5 mm · non-Fe 2.0 mm · stainless 2.5 mm', monitor: 'Test pieces at start, hourly and at the end of each run', we: 'Detector validation, test routine and a reject-bin procedure.' },
      { icon: 'store', name: 'Cold store & dispatch', hazard: 'Growth during storage; temperature abuse in transport.', control: 'Chilled storage, first-in first-out, vehicle checks.', limit: 'Store and vehicles ≤ 5 °C', monitor: 'Continuous loggers with alarms, vehicle check before loading', we: 'Logger set-up, alarm rules and a dispatch checklist.' }
    ]
  },

  // The readiness check: answers Yes = 2, Partly = 1, No = 0.
  check: {
    title: 'How *audit-ready* are you?',
    lede: 'Eight questions, two minutes. You get a score and the three things to fix first.',
    questions: [
      { q: 'Is your HACCP plan written down and reviewed in the last 12 months?', fix: 'Review your hazard analysis and HACCP plan against the current line and recipes.' },
      { q: 'Are your critical control points monitored and recorded every shift?', fix: 'Set up CCP monitoring records with sign-off and a weekly verification.' },
      { q: 'Are thermometers and probes calibrated, with records?', fix: 'Start a calibration schedule for every probe, thermometer and detector.' },
      { q: 'Do you have an allergen matrix and validated changeover cleaning?', fix: 'Build an allergen matrix and validate changeover cleans with swabs.' },
      { q: 'Are all suppliers approved, with certificates on file?', fix: 'Run a supplier approval programme and collect certificates.' },
      { q: 'Does everyone who handles food have training records?', fix: 'Create a training and competency matrix for every role.' },
      { q: 'Do you swab the environment for Listeria or other organisms?', fix: 'Start an environmental monitoring programme with zones and frequencies.' },
      { q: 'Could you trace one batch, back and forward, within 4 hours?', fix: 'Run a mock recall and fix the gaps in your traceability.' }
    ],
    tiers: [
      { min: 80, name: 'Audit-ready', text: 'Strong foundations. A mock audit would confirm it and tidy up the last details.' },
      { min: 50, name: 'Nearly there', text: 'The basics are in place, but an auditor would find gaps. Fix the three points below first.' },
      { min: 0, name: 'At risk', text: 'An audit or a customer complaint would expose real gaps. Start with the three points below.' }
    ],
    cta: 'Get the full report on a site visit'
  },

  sectors: [
    { name: 'Dairy', hazards: ['Listeria in the environment', 'Pasteurisation failure', 'Antibiotic residues in milk'], ccps: 'Pasteurisation, cooling, metal detection', line: 'Raw milk intake to filled and chilled packs.' },
    { name: 'Meat & poultry', hazards: ['Salmonella and Campylobacter', 'Undercooking', 'Bone and metal fragments'], ccps: 'Cooking, cooling, metal/X-ray detection', line: 'Carcass or primal to cooked, sliced and packed.' },
    { name: 'Bakery & cereals', hazards: ['Allergens (gluten, nuts, sesame)', 'Mould and mycotoxins', 'Foreign bodies'], ccps: 'Baking, metal detection, label check', line: 'Flour intake to baked, cooled and wrapped.' },
    { name: 'Beverages & juices', hazards: ['Patulin and spoilage yeasts', 'Under-pasteurisation', 'Glass fragments'], ccps: 'Pasteurisation, filling hygiene, glass control', line: 'Fruit or concentrate to filled and capped bottles.' },
    { name: 'Fresh produce', hazards: ['E. coli and Listeria on leaves', 'Pesticide residues', 'Dirty wash water'], ccps: 'Wash water sanitiser, cold chain', line: 'Field to washed, cut and bagged produce.' },
    { name: 'Ready meals', hazards: ['Cross-contamination raw/cooked', 'Slow cooling', 'Undeclared allergens'], ccps: 'Cooking, rapid cooling, label check', line: 'Ingredients to cooked, assembled and sealed meals.' }
  ],

  steps: [
    { name: 'Assess', time: 'Week 1', text: 'A site visit: we walk the line, read your records and test what matters.' },
    { name: 'Plan', time: 'Week 2', text: 'A clear report: what to fix, in what order, and what it costs. No jargon.' },
    { name: 'Implement', time: 'Weeks 3–8', text: 'We write the plans, set up records, validate controls and train your team.' },
    { name: 'Verify', time: 'Ongoing', text: 'Mock audits, swabbing and record reviews, so you stay ready, not just get ready.' }
  ],

  // SAMPLE figures for this concept: replace with real ones.
  stats: [
    { value: 140, suffix: '+', label: 'audits and inspections supported' },
    { value: 98, suffix: '%', label: 'of clients passed first time' },
    { value: 48, suffix: ' h', label: 'typical lab turnaround' },
    { value: 2300, suffix: '', label: 'food handlers trained' }
  ],
  statsNote: 'Sample figures for this concept.',

  standards: ['HACCP (Codex)', 'ISO 22000', 'FSSC 22000', 'BRCGS Food', 'SQF', 'GMP / GHP'],

  // Insights: add an article by copying one block. "body" is a list of paragraphs.
  insights: [
    {
      tag: 'Allergens', minutes: 4, title: 'Five checks before every allergen changeover',
      body: [
        'Most allergen recalls start on the line, not on the label. A changeover from a product with milk, egg or nuts to one without is the riskiest ten minutes of the shift.',
        'Before restarting, check five things: every surface and tool in the product zone has been cleaned with the validated method; hidden spots (hoppers, under guards, filler nozzles) have been opened and cleaned; a swab or rapid allergen test has passed; the next product\'s ingredients have been checked against the allergen matrix; and a second person has signed it off.',
        'Write the order of production so allergen-containing products run last, and keep the checklist on the line, not in an office drawer.'
      ]
    },
    {
      tag: 'Audits', minutes: 5, title: 'What auditors look for in your CCP records',
      body: [
        'An auditor reads your records to see whether your HACCP plan is real. Blank lines, values written in advance, or records signed at the end of the week are the quickest way to a non-conformity.',
        'Good records show the actual measured value (not just a tick), the time, the person, and what happened when a limit was missed. A deviation with a clear corrective action is better than a perfect record nobody believes.',
        'Add a weekly verification: a supervisor reviews the records, signs them and follows up anything odd. That one habit answers half of an auditor\'s questions.'
      ]
    },
    {
      tag: 'Shelf life', minutes: 4, title: 'Shelf-life testing: when, and how much',
      body: [
        'You need a shelf-life study whenever you launch a product, change the recipe, the packaging or the process, or extend the date on pack.',
        'A study stores product as a customer would (and a little worse), then tests it at intervals for the organisms that matter, plus taste, smell and appearance. For chilled ready-to-eat foods, Listeria growth decides the date.',
        'Keep the results with your HACCP plan. When a buyer or an auditor asks why the date is 10 days, you show them.'
      ]
    }
  ],

  faq: [
    ['Do you certify us?', 'No. Certification bodies certify. We prepare you, run mock audits and stand next to you during the real one.'],
    ['We already have a HACCP plan. Can you just check it?', 'Yes. A plan review with a site visit is often the best first step. You get a list of gaps in order of risk.'],
    ['How long does it take to get audit-ready?', 'For most sites 6 to 12 weeks, depending on how much is already in place and how fast changes can be made on the line.'],
    ['Can you train our staff in their own language?', 'Yes. Training is practical and on the floor, and we can work with interpreters or translated materials.'],
    ['Do you work with small producers?', 'Yes. From a single kitchen to multi-line factories. The plan is sized to your operation, not the other way round.']
  ],

  contact: {
    title: 'Book a *site audit*',
    lede: 'Tell us what you make and what you need. We reply within one working day with a date and a clear price.',
    needs: ['HACCP plan', 'Audit readiness', 'Lab testing', 'Line design', 'Training', 'Labelling', 'Not sure yet'],
    thanks: 'Thank you. We have your request and will reply within one working day.'
  },

  footer: {
    blurb: 'Food safety and processing consultancy: HACCP, audits, lab testing, hygienic line design and training.',
    concept: 'Concept website designed and built by Ace 360 Services',
    conceptUrl: 'https://www.ace360services.nl'
  }
};
