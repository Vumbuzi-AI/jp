Tailwindify.md

## Steps

### 1. Read and survey

- Read `index.html` and `tailwind.html` (if present) in full.
- `ls` the `images/`, `css/`, and `js/` folders to see what assets exist.
- Identify: page sections (hero, about, services, blog, footer, etc.), all interactive widgets (nav, dropdowns, modals, carousels, accordions), and which scripts are framework-bound (Webflow, jQuery, WebFont, lottie, BRIX badges, etc.).

### 2. Ask one clarifying question — only if ambiguous

The default approach is: keep `cdn.tailwindcss.com`, drop every other external/local JS dependency. Only ask the user if there's a genuine choice (e.g., the page has a complex JS-driven widget like a carousel where CSS-only fallback would visibly differ).

### 3. Head & external dependencies

- Remove `<script src="...">` tags pointing to `js/`, jQuery, Webflow, WebFont, lottie, analytics, BRIX badges.
- Remove the small inline IIFE that adds `w-mod-js` / `w-mod-touch` classes.
- Remove the `WebFont.load({...})` call.
- Replace `WebFont.load` with a `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=<Font>:wght@400;500;700&display=swap" />`. Match the font(s) the original requested.
- Keep `<script src="https://cdn.tailwindcss.com"></script>`.
- Replace local favicon `<link>` tags with a `data:image/svg+xml,...` inline SVG favicon.
- Update any `og:image` / `twitter:image` meta that points at `images/...` to a representative Unsplash URL.

### 4. Make interactive widgets work without JS

The Webflow/jQuery scripts you removed were driving the nav, dropdowns, fade-ins, and scroll buttons. Replace each with a CSS-only equivalent:

- **Dropdown menus** — Add `group` to the dropdown wrapper, change the dropdown list's `[&.w--open]:block` (or similar) to `group-hover:block group-focus-within:block`. Remove `data-w-id`, `data-hover`, `data-delay` attributes — they're harmless but noisy.
- **Mobile nav toggle** — Replace the hamburger `<div class="menu-icon">` with a `<label for="nav-toggle">`, add a sibling `<input type="checkbox" id="nav-toggle" class="peer hidden" />` _before_ the nav element in the same parent, and change the nav's `hidden ... lg:flex` to include `peer-checked:block`.
- **Fade-in animations** — Strip every `md:opacity-0` (and any `opacity-0` placed there for Webflow IX2 to animate from). Use `grep -c "md:opacity-0" tailwind.html` first to know how many you're affecting. Without the JS, these would stay invisible forever.
- **Back-to-top button** — Was hidden via `opacity-0` until scroll JS revealed it. Either remove it, or make it always visible with `flex` instead of `hidden ... opacity-0`.
- **Scroll-down arrow / smooth scroll** — `<a href="#section">` works natively if the html element has `scroll-smooth` (Tailwind utility) — add it if missing.

### 5. Replace all local images

- **Photos** (hero, about, why-us, blog cards, banner CTA): swap each `src="images/..."` for a stable Unsplash URL with `?w=1080&q=80` (or `1400` for hero/banner). Pick photos that match the section's purpose — medical for medical, food for food, etc. Strip `srcset` since you're now serving one size. Add `loading="lazy"` to below-the-fold images. Drop `sizes="100vw"`.
- **CSS background images** (look for `bg-[url('images/...')]`): same treatment — replace inline with an Unsplash URL.
- **Icons** (phone, email, social, location pin, arrows, service icons): replace each `<img src="images/...icon.svg" />` with an inline `<svg>`. Use **Feather Icons** style — `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"` (or a specific color), `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`. Carry over the original sizing/spacing classes (`mr-3`, `h-5 w-5`, etc.) and add `aria-hidden="true"` for decorative ones, `aria-label` for meaningful ones.
- **Logos**: replace the local logo image with a small inline SVG mark (e.g., a rounded rect with the brand initial or a glyph that matches the brand) plus the brand name in a `<span>` styled with `font-bold text-[#hex]`. Match colors from the existing palette.
- **Decorative background SVGs** that were positioned absolutely and faded in by the JS: just delete them. They added subtle visual texture that the user won't miss and would be invisible without the JS anyway.

### 6. Remove framework cruft

- Delete the BRIX promotional badges block and any inline `<script>` that drives it.
- Delete any "MutationObserver re-applying utility classes to webflow elements" script.
- Delete leftover `<div aria-hidden="true">` blocks that exist only to force Tailwind to include certain classes (the safelist hack).
- Remove `data-w-id`, `data-wf-page`, `data-wf-site` if you want to slim the file — they're harmless but pure noise.

### 7. Verify

- `grep -n "images/" tailwind.html` — must return nothing.
- `grep -nE 'src="js/|src="https://cdn\.prod' tailwind.html` — must return nothing.
- `grep -c "opacity-0" tailwind.html` — only matches that remain should be intentional (e.g., none, since fade-in animations are gone).
- `open tailwind.html` (macOS) — open in the browser to confirm the page actually renders. Check that the nav opens on mobile, dropdowns open on hover, images load, and there's no visible whitespace where hidden-by-opacity content used to be.

---

## Output

Briefly summarize what was removed, what was inlined, and any visible tradeoffs (e.g., "dropdowns now open on hover, not click"). Note that `cdn.tailwindcss.com` and `fonts.googleapis.com` remain — those are CDN dependencies the user agreed to keep.
