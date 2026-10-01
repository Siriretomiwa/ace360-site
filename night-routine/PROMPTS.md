# Goodnight, Ella: image prompts

The video needs 12 scene images. Make them in ChatGPT Image (or another image generator with commercial rights), **uploading
`reference/my_turn.jpg` and `reference/after_school.jpg` with every prompt** so Ella, Mommy and Daddy stay on-model.
Save each result as `images/scene_XX.png` (16:9, 1920×1080 or larger) and run `python3 build_video.py`. Any scene
you haven't made yet keeps its placeholder, so you can add them a few at a time.

## Character lock (paste into every prompt, unchanged)

> **Ella**: the same toddler girl as in the attached reference image, about 2 years old, deep warm-brown skin, big round
> brown eyes with long lashes, chubby rosy cheeks, small pearl stud earrings. Curly dark-brown hair in two high puffs with
> white satin bows, small cornrow braids at the front with pink, yellow and white beads.
> Bedtime outfit (keep identical in every night scene): soft lavender two-piece pajamas with small yellow stars.
>
> **Mommy**: same woman as the reference, long voluminous dark-brown curly hair, warm brown skin, pearl earrings, coral sweater.
> **Daddy**: same man as the reference, short dark curly hair, neat beard, navy button shirt over a white T-shirt.

## Style lock (paste into every prompt, unchanged)

> 3D animated children's film style, soft and rounded, matching the reference image exactly. Calm night-time lighting:
> warm lamp glow, deep navy and lavender shadows, gentle moonlight. Cosy, low-contrast, soothing, nothing scary.
> Wide 16:9 frame. Keep the bottom quarter of the image simple and uncluttered (song lyrics go there) and the top-right
> corner clear (logo goes there). No text, no letters, no logos, no watermarks.

## Scenes

| File | Section | Prompt (after the two locks) |
|---|---|---|
| `scene_00.png` | Intro (title) | Ella in her pajamas kneeling at a bedroom window, looking up at a big crescent moon and stars, her face lit softly by moonlight. Leave open space in the lower centre for the title. |
| `scene_01.png` | Chorus 1 | Ella waving goodnight to the moon through the window, a soft smile, star-shaped night-light glowing on the windowsill. |
| `scene_02.png` | Bath time | Ella in a white bathtub full of soft bubbles, a yellow rubber duck, Mommy kneeling beside the tub smiling. Warm bathroom light, bubbles floating up. |
| `scene_03.png` | Pajamas on | Ella in her bedroom just after the bath, pulling on the lavender star pajama top with a big grin, Mommy helping with the buttons. |
| `scene_04.png` | Chorus 2 | Ella sitting on her bed hugging a soft teddy bear, yawning gently, moon visible through the window. |
| `scene_05.png` | Brush your teeth | Ella standing on a small step stool at the bathroom sink, brushing her teeth with a pink toothbrush, small foam smile, Daddy beside her showing how. |
| `scene_06.png` | Story time | Ella tucked into bed snuggled against Mommy, who reads an open picture book; warm bedside lamp light. |
| `scene_07.png` | Chorus 3 | Mommy gently rocking Ella in a cosy armchair by the window, Ella's eyes getting heavy. |
| `scene_08.png` | Goodnight hugs | Ella in bed giving Mommy a hug while Daddy kisses her forehead, teddy bear tucked beside her. |
| `scene_09.png` | Lights off | Dim bedroom, the big light off, a soft moon-shaped night-light glowing, curtains closed, Ella under the blanket with her teddy, peaceful. |
| `scene_10.png` | Final chorus | Ella fast asleep in bed hugging her teddy, peaceful smile, moonlight across the blanket, a few soft stars glowing on the ceiling. |
| `scene_11.png` | Outro | Wide view of a quiet house at night under a big moon and twinkling stars, one window glowing softly. Leave open space in the lower centre for the closing title. |

### Optional: satin bonnet
Many families put a satin bonnet on at bedtime. If you want that, add *"wearing a lavender satin bonnet over her puffs"*
to scenes 09–10 only, and keep the bows in every other scene.

## Checks before you use an image
- Ella's face, skin tone, hair and beads match the reference. Regenerate if anything drifts.
- Pajamas are the same lavender star set in every scene from 03 onwards.
- Hands, fingers and teeth look normal; nothing odd or scary for a toddler.
- No text or watermark in the picture.
