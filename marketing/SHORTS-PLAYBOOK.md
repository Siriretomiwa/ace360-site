# Ace 360 · YouTube Shorts playbook

**Strategy: teach first, demonstrate second, market naturally.**
From now on every Ace 360 video is a **vertical YouTube Short** (1080 × 1920, 9:16, ideally 25–60 s) unless explicitly asked otherwise. No horizontal videos.

The viewer should think *"I learned something useful"*, then *"these people clearly know websites"*, never *"they're just selling to me"*.

## Keep (visual identity: do not rebuild)
Same look and quality as Before/After, Three Reasons, Bakery Ep. 1, Sketch to Live, What a Premium Website Is Made Of, and the Journey film:
dark/black backgrounds · orange accent (#ff6a00 / #ff8a3d) · white type (Inter, EB Garamond italic accent word, JetBrains Mono labels) · smooth motion graphics · professional website mockups · modern UI animation · fast pacing · strong hooks · polished transitions.
Production tooling: `marketing/reels/` (`common.js` toolkit, `render.js`, `sound.py`).

## Structure (default)
| Time | Part | Rule |
|---|---|---|
| 0–3 s | **Hook** | A reason to stay: curiosity or a named problem. Never "Welcome to Ace 360", never a long logo intro. |
| 3–10 s | **Problem** | What is happening and why it matters. |
| 10–45 s | **Education / demonstration** | Teach the fix. *Show* it: mockups, before/after, cursor, zoom-ins, highlight boxes, arrows, diagrams, mobile examples. |
| last 5–10 s | **Takeaway + light CTA** | One clear action for the viewer, then optionally one short CTA. |

## Education-first test
Before making a Short: *"Would someone still benefit if Ace 360 did not exist?"* If not, rewrite the concept.
Not allowed as a Short on its own: "look at this website", "look what we built", "our services", "we make premium websites", logo + music montage, unexplained before/after.

## Voiceover
Every sentence teaches, explains, demonstrates, compares, corrects a misconception or gives an actionable tip.
✗ "Here is the button." → ✓ "We moved the booking button higher because visitors shouldn't have to search for the next step."

## Series (rotate)
1. Three reasons · 2. Website mistakes · 3. Before/after **with explanation** · 4. Website audit (concepts or authorised examples) · 5. If I built a website for… (industry-specific lessons, not swapped nouns) · 6. What a premium website is made of (one lesson each: speed, SEO, design, conversion, mobile, security, navigation, analytics, accessibility, CTAs, hosting, content hierarchy) · 7. Myth vs reality · 8. Quick explainers · 9. E-commerce (Shopify, WooCommerce, Mollie, iDEAL, checkout friction, product pages, cart abandonment, mobile checkout) · 10. Build process · 11. One-minute website clinic.

## Originality
Branding stays consistent; content must not feel mass-produced. Each Short needs a meaningfully different lesson, example, problem, demonstration and ending. Don't reuse the same script with new nouns, the same sequence, the same three tips, the same mockup or identical animations.

## Claims
Never invent revenue, conversion percentages, traffic, rankings, testimonials or client results. Label concepts ("Concept", "Example redesign", "Here's how I'd approach this…"). Fictional businesses are never presented as clients. No guarantees: prefer "can reduce friction", "makes the next step clearer", "can improve the mobile experience". Any statistic must have a citable source.

## CTA (short, light)
**YouTube Shorts end on like / share / subscribe** (from S03): one spoken line, e.g. "If this was useful, give it a like,
share it with someone who runs a ___, and subscribe for more", with the animated Like, Share and Subscribe buttons
(cursor taps Subscribe → "Subscribed"). Ace 360 stays in the small sign-off only.
"Follow for more website tips." · "Check your own site for this." · "If you want Ace 360 to look at yours, visit ace360services.nl." · "If you'd rather have this handled professionally, Ace 360 can help."

## Mobile & safe areas
Text readable on a phone; no walls of small text. Keep key text out of the YouTube UI: roughly the **bottom 380 px** (title, channel, music) and the **right 150 px** from y ≈ 900 down (like, comment, share buttons). Top 120 px stays clear too.

## Voiceover workflow
Every Short folder (`marketing/reels/<short>/`) gets two script files:
- **`voiceover-paste.txt`**: the exact text to paste into any voice tool (only needed for a manual recording). Lines are separated by
  `<break time="1.0s" />` tags; nothing else to edit. Export one MP3.
- **`voiceover.txt`**: the same lines with their start times, `[12.5] text`. Used by the pipeline.

Then `python3 marketing/reels/voiceover.py <short>` builds `out/<short>-vo.mp4`:
- a full recording dropped in `<short>/voiceover/full.mp3` is cut at its pauses and each line placed on its timestamp;
- or one file per line (`voiceover/01.mp3`, `02.mp3`, …);
- otherwise it generates the voice itself: the free local **Kokoro** engine by default (`setup-voice.sh`), or ElevenLabs
  when `voice.json` says `"engine": "elevenlabs"` and `ELEVENLABS_API_KEY` is set. Lines are cached per voice.
Music is ducked under the voice and mastered to -14 LUFS.
**Brand voices (locked):** `af_heart` (US female, warm) and `am_michael` (US male, calm). Nothing else; any other voice is refused.
Pick one per Short with a first line `# voice: am_michael` in `voiceover.txt`.
**Delivery: storyteller, not reader.** Speed 0.9 with a 0.35 s breath after every sentence (voice.json). Write in short
sentences, tell a small story where it fits (a moment, a problem, a turn, an ending), and leave room: ~2.3 words per second.
Only reels with fixed, tight scene timing keep the brisk pace (`# speed: 1.05` / `# pause: 0` in their script).
Upload setting: *Altered or synthetic content*: **No** for these videos. They are animated graphics narrated by a generic text-to-speech voice, which YouTube does not require a label for. It is **Yes** only if a video shows realistic people, places or events, or uses a cloned real person's voice. `render.js` runs this automatically after rendering
whenever a `voiceover.txt` exists. Brand voice, settings and pronunciation: `reels/voice.json`.
Setup steps: `marketing/VOICEOVER-SETUP.md`. `voiceover.py --check` tests the connection, `--voices` lists voices. Scripts are written to ~2.3 words per second (storyteller pace; ~2.8 for the brisk reels) and checked against
each slot before rendering; a line that runs long is sped up at most 12 % and otherwise reported.

## Output for every Short request
1. Short title · 2. Educational objective · 3. Target duration · 4. Hook · 5. Full voiceover · 6. Scene-by-scene visual plan with timestamps · 7. On-screen text · 8. Website/mockup/screen-recording requirements · 9. Main viewer takeaway · 10. CTA · 11. YouTube Shorts title · 12. Short description · 13. Thumbnail/cover text (if useful) · 14. Hashtags

## Final check (before generating)
Teaches something · hook is immediate · 9:16 · meaningfully different from recent Shorts · not merely an ad · CTA is short · claims are accurate · visuals demonstrate the lesson.

## Log of Shorts (avoid repeats)
| # | Title | Series | Lesson |
|---|---|---|---|
| — | 3 reasons your website gets visitors but no customers (reel 03, pre-playbook) | Three reasons | Clear next step, mobile speed, online booking/payment |
| — | Before → After (reel 02, pre-playbook) | Before/after | Needs re-cut with explanation to fit this playbook |
| — | If I built a website for a bakery, Ep. 1 (reel 04) | If I built… | Palette/type, pre-orders, pickup, iDEAL |
| — | From a napkin sketch to a live website (reel 05) | Build process | Brief → wireframe → design → live |
| — | What a premium website is made of (reel 06) | Premium website | Design, speed, SEO, conversion overview |
| S01 | Your homepage has 5 seconds to answer 3 questions (48 s) | One-minute clinic | 5-second test: what you do, who it's for, what to do next (concept: Loop Fysio) |
| S02 | 4 questions to ask before you pay a web designer (54.5 s, voice am_michael) | Quick explainers | Scope + total, design before build, ownership of domain/hosting/logins, care after launch (example quote) |
| S03 | She missed one call. Her website could have answered it (59.5 s, af_heart, storyteller) | Story | Salon (made-up): visible prices, online booking with real free times, automatic reminders; like/share/subscribe ending |
