# Culpromark · concept website

A standalone site (no build step, no libraries) bundled with the Ace 360 theme as a live portfolio demo.
In WordPress it lives at `/wp-content/themes/ace360/demos/culpromark/index.html`.

## Change or add content
Open `content.js`. Everything on the page comes from there:
- **Services, line stations, sectors, readiness questions, steps, insights (articles), FAQ:** copy an item in the list, edit the text, keep the commas.
- `*word*` shows that word in the accent style.
- **Figures marked SAMPLE** (the stats) are placeholders for this concept.
- **Contact form:** set `contact.endpoint` to a form service URL (e.g. Formspree) to receive requests by email.

## Files
- `index.html`: page structure
- `style.css`: design
- `app.js`: builds the page from content.js; live monitor, processing line, readiness check, tabs, reader, form
