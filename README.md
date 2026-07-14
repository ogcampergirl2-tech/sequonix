# Sequonix — merged site

The **finalized design** from [sequonix.com](https://sequonix.com/) carrying the **full content**
from [the GitHub Pages site](https://ogcampergirl2-tech.github.io/sequonix/).

Open `index.html` in a browser. No build step, no dependencies to install.

## What came from where

| Piece | Source |
|---|---|
| Black + purple theme, Clash Display / Satoshi type, GSAP + Lenis scroll engine | sequonix.com |
| Video hero (hands + flower, freeze-frame trick), nav pill, mobile menu | sequonix.com |
| Pinned horizontal service scroller, manifesto, scrollytelling process, stats strip, CTA band, footer | sequonix.com |
| Hero copy, About + 4 pillars, capability lists, 8 industries | GitHub Pages |
| Selected work carousel + the 3 animated product mockups | GitHub Pages |
| Partnership models, The Sequonix Signal newsletter, contact copy | GitHub Pages |

Every design component was kept. Where copy conflicted, the GitHub Pages wording won — the
positioning is now **AI-native technology partner**, not "websites & automations".

## Files

```
index.html
assets/css/refresh.css   design system (unchanged from sequonix.com)
assets/css/style.css     black theme + video hero (unchanged)
assets/css/content.css   NEW — the merged-in sections, styled in the design's language
assets/js/main.js        from sequonix.com + work carousel, newsletter, new manifesto words
assets/img/, assets/video/   hero video, freeze frame, logo
```

`content.css` re-tokenizes the content site's components onto the design's variables, so the
orange accent became the design's purple (`--emerald`) and the flat panels picked up the
design's radii and hover lifts. Nothing in `refresh.css` or `style.css` was modified — the
finalized design is intact underneath.

## Decisions worth a second look

- **Contact email is `info@sequonix.com`** — that's what the live sequonix.com uses (its address is
  Cloudflare-obfuscated in the page source). The GitHub site said `hello@sequonix.ai`. Swap if you prefer.
- **Stats are the honest ones** from the content site — 3+ products, 12+ industries, 100% partner-first —
  not the old "200+ projects / 98% satisfaction / 3× ROI" placeholders.
- **The newsletter form is front-end only.** It validates and shows a success state; no mailer is wired up.
- **Social links in the footer are `#` placeholders.**
- The manifesto's purple words are matched verbatim in `main.js` (`var emphasis`). If you reword the
  manifesto, update that array or the highlight silently stops working.

## Deploying

It's a static site — copy the folder's contents to whatever serves sequonix.com, or push it to the
`sequonix` GitHub Pages repo to replace what's there now.
