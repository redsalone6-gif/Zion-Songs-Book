# Design System Strategy: The Tactile Manuscript

## 1. Overview & Creative North Star
**Creative North Star: "The Modern Archivist"**
This design system rejects the "app-like" sterility of generic songbooks in favor of a sophisticated, editorial experience. It is inspired by high-end music journals and premium stationery. We move beyond the "template" look by utilizing intentional asymmetry, expansive negative space, and a dual-typeface strategy that separates functional utility from lyrical soul.

The goal is to eliminate "visual noise." By prioritizing "The Tactile Manuscript" approach, we treat the screen as a living piece of paper—layered, textured, and deeply focused. We break the grid by using large, off-center display headings and allowing lyrics to breathe within generous, unconventional margins.

## 2. Colors & Surface Philosophy
The palette is a curated selection of "eye-care" neutrals. We avoid pure white (#FFFFFF) for backgrounds and pure black (#000000) for text to prevent the high-contrast "shimmer" effect that causes fatigue during long sessions.

### The "No-Line" Rule
**Borders are prohibited for sectioning.** To define the architecture of a page, you must use background color shifts. 
- Use `surface-container-low` (#f5f4ed) for the main page body.
- Use `surface-container` (#efeee6) to define a sidebar or a "song info" header.
- Use `surface-container-high` (#e8e9e0) for active modal elements.
Boundaries are felt through tonal transitions, not drawn with lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked sheets of fine paper. 
- **Base Layer:** `surface` (#fbf9f4)
- **Content Blocks:** `surface-container-low` (#f5f4ed)
- **Interactive Cards:** `surface-container-lowest` (#ffffff) sitting atop a darker container.
This "nested" depth creates an organic, physical presence that feels premium and intentional.

### The Glass & Signature Texture
For floating elements like "Now Playing" controllers or "Transpose" overlays, use **Glassmorphism**. Apply a background blur (16px–24px) to `surface-container-highest` at 80% opacity. 
**Signature Polish:** For primary CTA backgrounds, use a subtle linear gradient from `primary` (#5f5e5e) to `primary-dim` (#535252). This adds a "weighted" feel to buttons that flat hex codes cannot replicate.

## 3. Typography: The Editorial Engine
Typography is the core of this system. We use a three-family approach to distinguish between navigation, information, and performance.

*   **Performance (Lyrics & Chords):** `newsreader`. This serif typeface provides the "soul." Use `title-lg` for lyrics to ensure high legibility at a distance. Chords should be set in `label-md` using the `tertiary` (#695e47) color, positioned directly above the serif lyrics for a clear, high-contrast functional distinction.
*   **Organizational (Headings):** `manrope`. A modern, geometric sans-serif. Use `display-md` for song titles, often left-aligned with a significant `20` (7rem) top margin to create an editorial, "asymmetric" look.
*   **System Utility (Labels & Metadata):** `inter`. Used for technical data like BPM, Key, and Duration.

| Role | Token | Family | Size | Intent |
| :--- | :--- | :--- | :--- | :--- |
| **Song Title** | `display-md` | Manrope | 2.75rem | Grand, authoritative entry. |
| **Lyrics** | `title-lg` | Newsreader | 1.375rem | High-readability performance text. |
| **Chords** | `label-md` | Inter | 0.75rem | Functional, distinct from lyrics. |
| **Metadata** | `label-sm` | Inter | 0.6875rem | Secondary technical details. |

## 4. Elevation & Depth
We eschew traditional drop shadows for **Tonal Layering**.

*   **The Layering Principle:** To lift a "Setlist Card," do not add a shadow. Instead, place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f5f4ed) background. The 2% shift in brightness is enough for the human eye to perceive depth without adding visual clutter.
*   **Ambient Shadows:** If an element must float (e.g., a floating action button), use an extra-diffused shadow: `box-shadow: 0 10px 30px rgba(49, 51, 44, 0.05)`. Notice the shadow color is a low-opacity version of `on-surface`, not pure black.
*   **Ghost Borders:** If an input field requires a boundary, use a "Ghost Border": `outline-variant` (#b1b3a9) at 20% opacity.

## 5. Components & Layout Patterns

### Performance Cards (Lyrics/Chords)
**Forbid the use of divider lines.** Separate verses and choruses using the Spacing Scale `8` (2.75rem) or `10` (3.5rem). 
- Use a background shift (`surface-container-highest`) to highlight the "Chorus" section, giving the musician a non-verbal cue that the song structure has changed.

### Buttons (The Tactile Press)
- **Primary:** `primary` (#5f5e5e) background with `on-primary` (#faf7f6) text. Radius: `md` (0.375rem).
- **Secondary:** `secondary-container` (#e5e2de) background with `on-secondary-container` (#52524f) text. No border.
- **Tertiary:** Text-only using `primary` color, with a `surface-container-lowest` background only on hover/active states.

### Inputs (The Search & Metronome)
Input fields should be styled as "Underlined Editorial" fields. Use the `outline-variant` as a bottom border only (1px). When active, transition the background to `surface-container-highest`.

### The "Chord Chip"
A specialized component for chord diagrams. Use `surface-container-lowest` with a `sm` (0.125rem) radius. Chords should be rendered in `tertiary` (#695e47) to differentiate them from the primary text flow.

## 6. Do's and Don'ts

### Do
- **Do** use `20` (7rem) and `24` (8.5rem) spacing for top-of-page margins to create a high-end, relaxed feel.
- **Do** use `newsreader` (Serif) for any content the user needs to *feel* (lyrics, notes).
- **Do** use `surface-dim` for inactive or "past" verses in a scroll-sync view to keep the focus on the current line.

### Don't
- **Don't** use 1px solid borders to separate list items. Use a `1.5` (0.5rem) vertical gap instead.
- **Don't** use pure black text. Always use `on-surface` (#31332c) to maintain the soft, cream-and-charcoal aesthetic.
- **Don't** center-align long blocks of lyrics. Left-align them to maintain a consistent "eye-anchor" for the musician.