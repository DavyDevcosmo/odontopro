---
name: PsicoPro
description: Online scheduling for self-employed psychologists, calm and orderly.
colors:
  accent-dark: "#1A3A4A"
  accent-primary: "#4BA3C3"
  status-chip-confirmed-text: "#1A7A9A"
  status-chip-confirmed-bg: "#E3F2F8"
  status-trial-bar-text: "#1A5A7A"
  status-delta-green-text: "#2E8B57"
  status-delta-green-bg: "#E8F5EE"
  destructive: "#EF4444"
  sidebar-bg: "#1A3A4A"
  sidebar-text-primary: "#E0EEF5"
  sidebar-text-secondary: "#7AAFC5"
  sidebar-text-muted-dark: "#4A7A90"
  sidebar-item-active: "rgba(75, 163, 195, 0.18)"
  sidebar-divider: "rgba(255, 255, 255, 0.08)"
  surface-page: "#EEF3F7"
  surface-card: "#FFFFFF"
  surface-card-header: "#FAFCFD"
  surface-slot-hover: "#F0F5F8"
  border: "#D4E3EC"
  border-trial-bar: "#C0DCEA"
  content-primary: "#1A3A4A"
  content-secondary: "#7A9FB5"
  content-muted: "#B0C8D5"
  surface-dark-page: "#0D1E26"
  surface-dark-card: "#112636"
  border-dark: "#1E3D50"
  content-dark-primary: "#E0EEF5"
  content-dark-secondary: "#7AAFC5"
typography:
  display:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
  headline:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  body-lg:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent-dark}"
    textColor: "{colors.surface-card}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.sidebar-text-muted-dark}"
  button-outline:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.status-chip-confirmed-text}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-outline-hover:
    backgroundColor: "{colors.surface-slot-hover}"
  button-secondary:
    backgroundColor: "{colors.surface-page}"
    textColor: "{colors.status-chip-confirmed-text}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-ghost:
    textColor: "{colors.content-primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-slot-hover}"
  button-link:
    textColor: "{colors.accent-primary}"
  input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.content-primary}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
    height: "36px"
  card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.content-primary}"
    rounded: "{rounded.xl}"
    padding: "24px"
  time-slot:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.status-chip-confirmed-text}"
    rounded: "{rounded.md}"
    height: "40px"
  time-slot-selected:
    backgroundColor: "{colors.status-chip-confirmed-bg}"
    textColor: "{colors.content-primary}"
  status-chip-confirmed:
    backgroundColor: "{colors.status-chip-confirmed-bg}"
    textColor: "{colors.status-chip-confirmed-text}"
    rounded: "{rounded.full}"
  sidebar:
    backgroundColor: "{colors.sidebar-bg}"
    textColor: "{colors.sidebar-text-secondary}"
    width: "256px"
  sidebar-item-active:
    backgroundColor: "{colors.sidebar-item-active}"
    textColor: "{colors.sidebar-text-primary}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
---

# Design System: PsicoPro

## Overview

**Creative North Star: "The Serene Consulting Room"**

PsicoPro should feel like a well-kept waiting room: quiet, orderly, welcoming, and with nothing raising its voice. The whole system lives in one family of blues. A deep petrol blue anchors the text, the primary action, and the panel's sidebar. A water blue marks focus, selection, and the brand's small accent. Very pale blue-gray surfaces form the page behind white cards. Nothing on the screen competes for attention with the psychologist's schedule or the patient's choice of time.

Density is moderate and the type is plain: a single sans family (Geist) carries the whole hierarchy through weight rather than contrast between typefaces. Depth comes from the tonal step between the pale page and the white card, plus a thin blue-gray border. Shadow is a whisper, used only for small lift. Components are discreet and reliable: soft corners, thin borders, minimal shadow. The interface fades back so the content (times, services, appointments) comes forward.

The light theme is the implemented system. A dark theme is **planned**: its tokens are already defined (`surface-dark`, `content-dark`, `border-dark`) and a `ThemeToggle` exists, but no screen uses them yet.

**Key Characteristics:**
- Monochromatic in blue: petrol, water, and blue-gray, with no warm second accent.
- White cards over a pale blue-gray page; depth comes from tone and border, not shadow.
- A single family, Geist, with hierarchy by weight (700 / 600 / 500 / 400).
- Soft corners (6px on controls, 12px on cards), 1px blue-gray borders.
- A dark petrol sidebar frames the professional's panel; the public area is light from edge to edge.

## Colors

One family of cool blues, from deep petrol to an almost-white blue-gray, with green and red reserved for status.

### Primary
- **Deep Petrol** (`accent-dark` / `content-primary` / `sidebar-bg`): the anchor of the system. It is the color of text, of the primary button, of the sidebar, and of the "Psico" in the wordmark. It plays three roles because the system is monochromatic: wherever there is weight, it is petrol.
- **Calm Water** (`accent-primary`): the light accent. It appears in the "Pro" of the wordmark, the focus ring, the selected time-slot border, links, and the Premium badge. It does not carry body text on white, where its contrast is too low.

### Secondary
- **Deep Lake** (`status-chip-confirmed-text`): a mid blue that shows up as text in outline and secondary buttons and in the confirmed chip. It is the "readable blue" when Calm Water would be too faint.
- **Morning Mist** (`status-chip-confirmed-bg`): a very light blue fill for selected time slots, the confirmed chip, the active item in the mobile menu, and the trial bar.

### Tertiary
- **Clinical Green** (`status-delta-green-text` on `status-delta-green-bg`): positive change in indicators. Status only.
- **Alert Red** (`destructive`): destructive actions and invalid fields. The plan-expired banner uses a lighter red (Tailwind `red-400`, outside the tokens).

### Neutral
- **Waiting-Room Blue-Gray** (`surface-page`): the background of every page, public and panel alike.
- **Clean Sheet** (`surface-card`): cards, inputs, popovers, the public header.
- **Faint Light** (`surface-card-header`): card headers, one barely perceptible step above white.
- **Light Touch** (`surface-slot-hover`): the hover fill for ghost/outline buttons and slots.
- **Soft Rule** (`border`): the 1px border on cards, inputs, and dividers.
- **Foggy Blue** (`content-secondary`): secondary text and descriptions.
- **Mist** (`content-muted`): placeholders and very low-emphasis text.
- **Sidebar tones** (`sidebar-text-primary`, `sidebar-text-secondary`, `sidebar-text-muted-dark`, `sidebar-item-active`, `sidebar-divider`): the inverted palette of the dark petrol sidebar. `sidebar-text-muted-dark` also serves as the hover color of the primary button.

### Dark Theme (planned)
- **Deep Night** (`surface-dark-page`), **Night Card** (`surface-dark-card`), **Night Rule** (`border-dark`), **Moonlight Text** (`content-dark-primary`), **Moonlit Blue** (`content-dark-secondary`). Defined in `tailwind.config.ts` (along with `card-header`, `slot-hover`, `soft`, `muted` and the `*-dark` variants of the status chips), activated by the `.dark` class on `<html>`. Not used by any screen yet.

### Named Rules
**The One Family Rule.** Every interface color comes from the petrol/water/blue-gray family. Green and red exist only to report status, never to decorate.

**The Readable Blue Rule.** Foggy Blue (`content-secondary`) gives about 2.8:1 on white, and Calm Water (`accent-primary`) about 2.9:1, both below AA for small text. Essential text uses Deep Petrol or Deep Lake. Foggy Blue is reserved for descriptions that also have a strong title next to them.

## Typography

**Display Font:** Geist (with Arial, Helvetica, sans-serif)
**Body Font:** Geist (with Arial, Helvetica, sans-serif)
**Label/Mono Font:** Geist Mono, loaded but with no visible use yet

**Character:** A single neutral, contemporary sans. The hierarchy comes from weight and size, never from a second typeface, which keeps the tone sober and clinical without going cold.

### Hierarchy
- **Display** (700, 2.25rem → 3rem from `lg` up, line-height 1): landing hero headline only. Maximum width of about 42rem.
- **Headline** (700, 1.875rem, 1.2): public section titles, such as "Clínicas disponíveis".
- **Title** (600, 1.25–1.5rem, 1.4): page and card titles in the panel; the wordmark (700, 1.25rem in the sidebar, 1.875rem in the public header).
- **Body** (400, 0.875rem, 1.43): the panel's default text, descriptions, lists. The lead paragraph on the landing goes up to 1rem → 1.125rem.
- **Label** (500, 0.875rem): buttons, links, form labels. The sidebar group headings ("PAINEL", "CONFIGURAÇÕES") use the same label in uppercase, in `sidebar-text-secondary`.

### Named Rules
**The Weight Not Typeface Rule.** Hierarchy is resolved with 700/600/500/400 within Geist. Don't introduce a second family to "add personality".

## Layout

- **Public area:** a fixed header across the full width (white, bottom border) and a centered container (`container mx-auto`) with a side gutter of 16px → 24px (`sm`) → 32px (`lg`). Public sections breathe with 64px of vertical padding. The professionals grid goes 1 → 2 (`sm`) → 4 (`lg`) columns with a 24px gap.
- **Panel:** a fixed sidebar of 256px (collapsible to 80px, a 300ms transition) from `md` up. Below `md` the sidebar disappears and gives way to a sticky 56px header with a menu in a Sheet from the left. Content sits on the pale page with 32px of padding (8px/16px on mobile).
- **Rhythm:** a 4px base. The recurring steps are 8px (gap between controls), 16px (card padding in compact lists, gap between blocks), 24px (internal card padding and gap between cards), and 32px (page padding in the panel).
- **Time-slot grid:** 3 columns on mobile, 5 from `md` up, with an 8px gap. Uniform 40px buttons.
- **Breakpoints:** Tailwind defaults: `sm` 640px, `md` 768px (the panel layout switch), `lg` 1024px (hero image appears, 4-column grid).

## Elevation & Depth

The system is almost flat. Depth comes from the **tonal step**: a white card (`surface-card`) over the blue-gray page (`surface-page`), outlined by a 1px Soft Rule border. Shadows exist but are minimal and serve only to separate controls from the surface.

### Shadow Vocabulary
- **Thread** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): outline buttons and inputs.
- **Sheet** (`box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): cards at rest.
- **Hover Lift** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): only on hover over the clinic cards on the landing, a 300ms transition.

### Named Rules
**The Tone Before Shadow Rule.** Separate surfaces by tone and border first. A large shadow only appears as a response to hover, never at rest.

## Shapes

Soft corners, never pills on controls and never sharp edges. Buttons, inputs, slots, and sidebar items use 6px (`rounded.md`). Cards use 12px (`rounded.xl`). The theme toggle uses 8px. Full roundness (`rounded.full`) is reserved for avatars and chips. Borders are always 1px in Soft Rule. The one 2px exception is the selected time-slot border in Calm Water. The Premium badge is a 40×40 square with no rounding, set into the corner of the card's photo.

## Components

### Buttons
Discreet and reliable: a single weight of action, no gradients, no glow.
- **Shape:** soft corners (6px), height 36px (32px `sm`, 40px `lg`), label 500 at 0.875rem, 16px side padding.
- **Primary:** Deep Petrol fill with white text. **Hover:** lightens to `sidebar-text-muted-dark` (#4A7A90).
- **Focus:** a 3px ring in Calm Water at 50% opacity (`focus-visible`).
- **Outline:** white, Soft Rule border, Thread shadow, Deep Lake text. Hover fills with Light Touch.
- **Secondary:** like outline, but with a page-blue-gray fill.
- **Ghost:** transparent; hover fills with Light Touch and darkens the text to petrol.
- **Link:** text in Calm Water, underlined on hover.
- **Destructive:** Alert Red fill with white text.
- **Disabled:** 50% opacity, no pointer events.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** Clean Sheet; the header can use Faint Light.
- **Shadow Strategy:** Sheet at rest; Hover Lift only on the public clinic cards.
- **Border:** 1px Soft Rule.
- **Internal Padding:** 24px vertical and horizontal, 24px gap between header and content.

### Inputs / Fields
- **Style:** white, 1px Soft Rule border, 6px, height 36px, 12px side padding, Thread shadow. Text at 1rem on mobile (avoids zoom on iOS), 0.875rem from `md` up. Placeholder in Mist.
- **Focus:** the border switches to Calm Water, plus a 3px ring in Calm Water at 50%.
- **Error / Disabled:** red border and ring (`aria-invalid`); 50% opacity when disabled.

### Navigation
- **Public header:** fixed, white, Soft Rule bottom border. Wordmark at 1.875rem/700 on the left; plain links in petrol that turn Calm Water on hover, plus a primary "Portal da clínica" button on the right. Below `md`, a Sheet menu from the right.
- **Panel sidebar:** a Deep Petrol fill. Items have 8×12px padding and 6px corners, with a 24px icon and text in `sidebar-text-secondary`. Hover and active use a 18% Calm Water fill (`sidebar-item-active`), with the text in `sidebar-text-primary`. Groups get an uppercase label. Collapsed, it shows icons only.
- **Mobile panel menu:** a white Sheet with centered items. The active item uses Morning Mist with Deep Lake text.

### Time Slot (signature component)
The heart of the public booking page.
- **Rest:** an outline button 40px tall in a 3/5-column grid, with the time in Deep Lake.
- **Selected:** a 2px Calm Water border, Morning Mist fill, petrol text.
- **Unavailable / past:** 50% opacity with a `not-allowed` cursor. It stays visible so the shape of the day can still be read.

### Wordmark
"Psico" in Deep Petrol (or `sidebar-text-primary` over the sidebar) + "Pro" in Calm Water, Geist 700. There is no graphic logo.

### Status Chip
Morning Mist with Deep Lake text, full roundness. It marks confirmed appointments. The trial bar uses the same pair, with a `border-trial-bar` border and `status-trial-bar-text`.

## Do's and Don'ts

### Do:
- **Do** use Deep Petrol (`accent-dark`) for the primary action and lighten it to #4A7A90 on hover, as the system's button already does.
- **Do** separate surfaces with a white card over `surface-page` plus a 1px `border`, before reaching for any shadow.
- **Do** keep 6px corners on controls and 12px on cards.
- **Do** mark focus with the 3px Calm Water ring at 50%, on every interactive element.
- **Do** use the theme tokens (`surface-*`, `content-*`, `border`) instead of loose colors, so the planned dark theme can arrive without rework.
- **Do** keep unavailable time slots visible at 50% opacity rather than hiding them.

### Don't:
- **Don't** put essential text in `content-secondary` (#7A9FB5) or `accent-primary` (#4BA3C3) on white; both stay below 3:1.
- **Don't** introduce warm accents or a second decorative color family; green and red are status only.
- **Don't** use large shadows at rest; Hover Lift belongs to hover.
- **Don't** add a second typeface; hierarchy comes from Geist's weight.
- **Don't** use loose Tailwind colors (`bg-red-400`, `text-white/90`) where a token exists; the plan-expired banner is the current exception and should migrate to `destructive`.
