---
name: Chester Luke A. Maligaso — Portfolio
description: A precise, dark, spec-sheet developer portfolio. Grayscale ink, one amber annotation accent, flat surfaces separated by hairlines.
colors:
  brand-amber: "oklch(0.78 0.145 75)"
  brand-amber-deep: "oklch(0.70 0.15 70)"
  graphite-black: "oklch(0.145 0 0)"
  slate-panel: "oklch(0.205 0 0)"
  raised-graphite: "oklch(0.269 0 0)"
  chalk-white: "oklch(0.985 0 0)"
  chalk: "oklch(0.922 0 0)"
  pencil-gray: "oklch(0.708 0 0)"
  hairline: "oklch(1 0 0 / 10%)"
  field-line: "oklch(1 0 0 / 15%)"
  alert-red: "oklch(0.704 0.191 22.216)"
typography:
  display:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 2vw, 1.5rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Poppins, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.slate-panel}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.chalk-white}"
    textColor: "{colors.graphite-black}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.chalk-white}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-ghost-hover:
    backgroundColor: "{colors.raised-graphite}"
    textColor: "{colors.chalk-white}"
  card:
    backgroundColor: "{colors.slate-panel}"
    textColor: "{colors.chalk-white}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.chalk-white}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  badge-accent:
    backgroundColor: "transparent"
    textColor: "{colors.brand-amber}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
---

# Design System: Chester Luke A. Maligaso — Portfolio

## 1. Overview

**Creative North Star: "The Spec Sheet"**

This is a portfolio that reads like a well-typeset technical document. Information sits on a dark drafting surface, ordered by type hierarchy and separated by hairline rules rather than boxes, shadows, or decoration. Hierarchy is earned through scale and weight, not effects. The work is the subject; the page is the precise sheet it's printed on. The personality is **precise, polished, unpretentious**: senior-feeling restraint, not flash.

There is exactly one annotation color: a warm amber, used the way a draftsman marks up a spec, sparingly, to point at the thing that matters (an active link, a focused field, a key term). Everything else is graphite and chalk. The grayscale is committed and intentional, not an absence of color; the amber's rarity is what gives it authority.

This system explicitly rejects the look it is replacing: the generic AI / template portfolio (gradient text, floating blurred "orbs", glassmorphism as the default surface, a blue→cyan gradient on an untouched grayscale palette, and buzzword copy). It also rejects brutalism (minimal is not raw or crude), loud / over-animated surfaces, and corporate-agency stiffness. Linear and Vercel are the polish references: crisp dark surfaces, tight grid, deliberate motion, depth implied by hairlines instead of frost.

**Key Characteristics:**
- Dark-only, near-black graphite surface with chalk-white ink.
- One amber annotation accent, used on ≤10% of any screen.
- Flat by default: 1px hairline borders do the separating; shadows are reserved for floating UI.
- Single typeface (Poppins) carried by weight and scale contrast, with tracked small labels for a technical, spec-sheet cadence.
- Generous vertical rhythm; content capped to a readable measure, centered in a narrow column.

## 2. Colors

A committed grayscale ink palette on dark drafting stock, with a single warm amber as the only chromatic voice.

### Primary
- **Filament Amber** (`oklch(0.78 0.145 75)`): The sole brand accent. Used for active navigation, focused field rings, links, key inline terms, and the chat launcher's live state. It is an annotation, not a fill: reserved for the single most important mark in a view. Drives `--ring`.
- **Filament Amber Deep** (`oklch(0.70 0.15 70)`): Hover / pressed state for amber elements. Slightly darker and more saturated so the interaction reads without changing hue.

### Neutral
- **Chalk White** (`oklch(0.985 0 0)`): Primary text (`foreground`) and headings on the dark surface. The brightest ink in the system.
- **Chalk** (`oklch(0.922 0 0)`): The primary button fill. A near-white solid block that reads as the one high-contrast call to action; pairs with Slate Panel text.
- **Pencil Gray** (`oklch(0.708 0 0)`): Secondary / supporting text (`muted-foreground`). This is the floor for body text contrast (~6.5:1 on Graphite Black). Nothing dimmer is permitted for reading copy.
- **Graphite Black** (`oklch(0.145 0 0)`): The page surface (`background`). The dark drafting stock everything is printed on.
- **Slate Panel** (`oklch(0.205 0 0)`): Raised surfaces, cards, popovers, the nav pill (`card` / `popover`).
- **Raised Graphite** (`oklch(0.269 0 0)`): Hover surfaces and the neutral `secondary` / `accent` fills (ghost-button hover, muted chips). Note: this is shadcn's structural `accent` (a neutral hover tone), not the brand accent.
- **Hairline** (`oklch(1 0 0 / 10%)`): The default 1px border (`border`). The primary separator in a flat system.
- **Field Line** (`oklch(1 0 0 / 15%)`): Slightly stronger border for inputs (`input`), so fields read as interactive.

### Alert
- **Alert Red** (`oklch(0.704 0.191 22.216)`): `destructive` only. Errors, delete confirmations. Never decorative, and never used as a second accent alongside amber.

### Named Rules
**The One Voice Rule.** Filament Amber appears on no more than ~10% of any given screen. If two things are amber, one of them is wrong. Its rarity is the entire point; the moment it's used for decoration it stops meaning "look here."

**The Grayscale-Is-A-Choice Rule.** The neutrals are chroma 0 on purpose. Do not tint them warm or cool, and never reintroduce a second hue (no blue, no cyan, no violet). Color in this system means amber, or it means an error.

## 3. Typography

**Display Font:** Poppins (with `ui-sans-serif`, `system-ui` fallback)
**Body Font:** Poppins
**Label Font:** Poppins, tracked and small (a true monospace is currently aliased to Poppins via `--font-mono`; a real mono may be introduced later for code and metadata)

**Character:** One geometric sans doing all the work, differentiated by weight and scale rather than by mixing families. Headings are heavy and tight; body is regular and open; labels are small, medium-weight, and letter-spaced to read as technical annotations on the sheet. The discipline is restraint: a single well-tuned family with real weight contrast over a timid display/body pair.

### Hierarchy
- **Display** (700, `clamp(2.25rem, 6vw, 4.5rem)`, line-height 1.05, `-0.02em`): The hero name and top-of-page statements. Ceiling is 4.5rem; the page states, it does not shout. Use `text-wrap: balance`.
- **Headline** (700, `clamp(1.75rem, 4vw, 3rem)`, line-height 1.1): Section titles ("About Me", "Projects"). `text-wrap: balance`.
- **Title** (600, `clamp(1.125rem, 2vw, 1.5rem)`, line-height 1.25): Card titles, sub-section headings, project names.
- **Body** (400, `1rem`, line-height 1.6): Reading copy. Capped at 65–75ch measure. Minimum color is Pencil Gray; prefer Chalk White for primary copy. Use `text-wrap: pretty` on long prose.
- **Label** (500, `0.75rem`, `0.08em`, often uppercase): Metadata, tags, tech-stack chips, eyebrow-style annotations. Uppercase only for ≤4-word labels, never for sentences.

### Named Rules
**The Weight-Not-Family Rule.** Hierarchy comes from weight (400 → 600 → 700) and scale (≥1.25 between steps), not from adding typefaces. The cap is one display/body family plus an optional true mono. Three competing fonts read as indecision.

**The Tracked-Label Rule.** Small labels carry the spec-sheet voice: `0.08em` tracking, weight 500, Pencil Gray or Filament Amber. This is the one place tracking is allowed; body and headings stay at natural or negative tracking.

## 4. Elevation

This is a **flat-by-default** system. Surfaces sit on the page at rest with no shadow; separation is created by tonal shifts (Graphite Black → Slate Panel → Raised Graphite) and 1px Hairline borders. Depth is a property of *floating, transient* UI only: dialogs, dropdowns, popovers, toasts, the chat panel. The previous glassmorphism (backdrop-blur panels, `shadow-2xl` on cards and nav) is retired.

### Shadow Vocabulary
- **Overlay** (`box-shadow: 0 16px 48px -12px rgba(0,0,0,0.55)`): The only shadow in the resting design. Applied to floating layers that escape the document flow (dialog, dropdown, popover, toast, chat panel) so they read as lifted above the sheet.
- **Hairline-inset** (`box-shadow: inset 0 1px 0 0 oklch(1 0 0 / 6%)`): Optional, for the nav pill and elevated bars; a 1px top highlight that suggests a physical edge without a drop shadow.

### Named Rules
**The Flat Drafting-Table Rule.** Surfaces are flat at rest. A shadow on a card, section, or button is a bug. Shadows answer one question only: "is this element floating above the page right now?" If the answer is no, there is no shadow.

**The No-Frost Rule.** `backdrop-filter: blur()` is prohibited as a surface treatment. Translucency over content is not depth; it is the look this redesign removed. Use a solid Slate Panel with a Hairline border instead.

## 5. Components

### Buttons
- **Shape:** Gently squared (8px radius, `rounded-md`). Consistent across sizes.
- **Primary:** Chalk fill (`oklch(0.922 0 0)`) with Slate Panel text. The single high-contrast block in a view; this is the "do the main thing" button (View work, Send message). No gradient, no shadow.
- **Hover / Focus:** Primary brightens to Chalk White on hover; all buttons take a 3px Filament Amber focus ring (`ring-ring/50`) on `:focus-visible`. Transitions are ~150ms, ease-out.
- **Outline:** Transparent fill, 1px Hairline border, Chalk White text. Hover fills with Raised Graphite. The default secondary action (Download CV).
- **Ghost:** No border, transparent; hover fills Raised Graphite. For low-emphasis and icon actions.
- **Accent usage:** Buttons are not amber. Amber is for links and active states, not fills (see The One Voice Rule).

### Cards / Containers
- **Corner Style:** 14px radius (`rounded-xl`).
- **Background:** Slate Panel (`oklch(0.205 0 0)`) on the Graphite Black page.
- **Shadow Strategy:** None at rest (see Elevation). Separation comes from the Hairline border and the tonal step up from the page.
- **Border:** 1px Hairline (`oklch(1 0 0 / 10%)`).
- **Internal Padding:** 24px default (`p-6`), up to 48px (`p-12`) for feature panels. Never nest a card inside a card.

### Inputs / Fields
- **Style:** Transparent fill, 1px Field Line border (`oklch(1 0 0 / 15%)`), 8px radius.
- **Focus:** Border shifts toward Filament Amber and a 3px amber ring appears. No glow, no blur.
- **Error / Disabled:** Error border and ring use Alert Red; disabled drops to 50% opacity and removes pointer events.
- **Placeholder:** Pencil Gray minimum (must clear 4.5:1); never dimmer.

### Navigation
- **Style:** A floating, centered pill fixed near the top of the viewport (14–16px radius). Slate Panel surface with a 1px Hairline border and the optional Hairline-inset top highlight. No backdrop-blur, no `shadow-2xl`.
- **Typography:** Name wordmark in title weight; social/nav icons at 20px.
- **States:** Links and icons rest at Chalk White 80%, brighten to full Chalk White on hover; the active route/section is marked Filament Amber. On scroll, the pill may gain the Overlay shadow to separate from content beneath.
- **Mobile:** Pill spans 95% width near the top; touch targets ≥44px.

### Tech / Tag Chips (Signature)
- **Style:** Pill (`rounded-full`), transparent fill, 1px Hairline border, Label typography (tracked, small). Tech-stack and project tags.
- **State:** Default chips are Pencil Gray text on Hairline border. A single "current focus" or active filter chip may use Filament Amber text and an amber border, one per group.

## 6. Do's and Don'ts

### Do:
- **Do** keep the surface dark graphite (`oklch(0.145 0 0)`) with chalk-white ink and one amber accent.
- **Do** separate surfaces with 1px Hairline borders and tonal steps, not shadows. Reserve the Overlay shadow for floating UI only.
- **Do** earn hierarchy through Poppins weight (400/600/700) and a ≥1.25 scale ratio.
- **Do** keep Filament Amber on ≤10% of any screen (The One Voice Rule), for active states, focus rings, links, and key terms.
- **Do** cap reading copy at a 65–75ch measure and keep body text at Pencil Gray or brighter.
- **Do** use tracked, small uppercase only for ≤4-word labels and chips.
- **Do** keep motion deliberate: ease-out transitions ~150–300ms, with a `prefers-reduced-motion` fallback on every animation.

### Don't:
- **Don't** use gradient text (`background-clip: text` over a gradient). Emphasis comes from weight and size, in a single solid color.
- **Don't** ship the blue→cyan gradient anywhere, as text, dividers, or fills. There is no second hue; color means amber or error.
- **Don't** use glassmorphism / `backdrop-filter: blur()` as a surface (The No-Frost Rule). Use solid Slate Panel + Hairline.
- **Don't** add floating blurred "orbs" or ambient background animation behind sections.
- **Don't** use buzzword copy ("cutting-edge", "transforming ideas", "elegant, scalable", "seamless"). Name the real technology and the real outcome.
- **Don't** drift into brutalism: no raw exposed structure, crude layout, or monospace-everything as an aesthetic.
- **Don't** put a shadow on a card, section, or button at rest. If it isn't floating, it's flat.
- **Don't** use text dimmer than Pencil Gray (`oklch(0.708 0 0)`) for body copy; the old `text-gray-500` lines fail AA.
- **Don't** nest cards, or repeat identical icon-heading-text card grids as a layout reflex.
