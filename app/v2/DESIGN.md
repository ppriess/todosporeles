# Design System Specification: Institutional Animal Protection

## 1. Overview & Creative North Star
This design system is engineered to represent a formal, civic authority on animal welfare in Santa Catarina. Moving away from the "playful pet shop" or "tech startup" aesthetic, this system adopts a **Creative North Star** we call **"The Civic Guardian."**

The Civic Guardian balances the rigid structure of a governmental institution with the warmth of humanitarian work. It breaks the traditional "template" look by utilizing intentional asymmetry, wide editorial margins, and a sophisticated layering of warm neutrals. The goal is to create a digital environment that feels as permanent and trustworthy as a physical institution, using "High-End Editorial" layouts to present animal welfare data and initiatives with grave importance.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The color palette is rooted in a deep institutional blue, contrasted by a warm, paper-like background. We use color not just for branding, but to define the architecture of the page without the clutter of lines.

### Palette Highlights
- **Primary (`#004293`):** The authoritative anchor. Used for high-level navigation and primary calls to action.
- **Secondary (`#775a00`):** A sophisticated gold. Use sparingly for critical highlights, verification badges, or "Impact" metrics.
- **Surface (`#fff8f1`):** A warm, light beige that prevents the "clinical" feel of pure white, providing a more humane, tactile experience.

### Layering Rules
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning content. Boundaries must be defined by background shifts. For example, a main content area (`surface`) transitions into a footer or sidebar using `surface-container-low` or `surface-container-high`.
*   **Surface Hierarchy:** Treat the UI as stacked sheets of fine paper. 
    *   **Level 0:** `surface` (Base)
    *   **Level 1:** `surface-container-low` (Secondary content)
    *   **Level 2:** `surface-container-highest` (Prominent cards or interactive modules)
*   **Signature Texture:** Primary CTAs should use a subtle vertical gradient from `primary` (`#004293`) to `primary_container` (`#0059c1`). This creates a "sculpted" look that suggests a physical, tactile button rather than a flat digital shape.

---

## 3. Typography: Editorial Authority
The typography system uses a pairing of **Manrope** for structural impact and **Public Sans** for high-readability data and body text.

*   **Display & Headlines (Manrope):** These are the "voice" of the institution. Use `display-lg` for heroic impact statements. High contrast between large headlines and small labels creates an editorial feel.
*   **Body & Titles (Public Sans):** Chosen for its neutral, civic character. It conveys information without "flavour," allowing the animal protection data to remain the focus.
*   **Hierarchy as Identity:** Use `label-md` in all-caps with increased letter-spacing for category tags (e.g., "PROTOCOL," "REGION: FLORIANÓPOLIS") to evoke a sense of official documentation.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows and borders are replaced by **Tonal Layering** to maintain a clean, institutional profile.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` card placed atop a `surface-container-low` background creates a soft, natural lift that is felt rather than seen.
*   **Ambient Shadows:** When a floating element (like a modal or dropdown) is necessary, use a highly diffused shadow: `box-shadow: 0 20px 40px rgba(29, 27, 23, 0.06);`. The shadow color is a tint of the `on-surface` color, not pure black.
*   **The "Ghost Border":** If accessibility requires a stroke, use `outline-variant` at 15% opacity. It should act as a whisper of a boundary, not a hard stop.
*   **Glassmorphism:** For global navigation bars, use a backdrop-blur (12px) with a semi-transparent `surface` color (85% opacity). This integrates the UI into the content, making the platform feel like a cohesive single entity.

---

## 5. Components

### Buttons
- **Primary:** Manrope SemiBold, `rounded-md`, gradient fill (Primary to Primary-Container).
- **Secondary:** Surface-tint text on `surface-container-high` background. No border.
- **Interaction:** On hover, the surface should "deepen" (shift one tier higher in the surface-container scale).

### Cards & Lists
- **Rule:** Forbid divider lines.
- **Structure:** Separate list items with 24px of vertical space (Spacing Scale). 
- **Institutional Cards:** Use `surface-container-lowest` with a `rounded-lg` corner. Content should have generous internal padding (32px) to signify "Breathing Room" and importance.

### Input Fields
- **Style:** Background `surface-container-low`, `rounded-sm`. 
- **States:** The "Ghost Border" becomes 100% opaque `primary` only on focus.
- **Serious Tone:** Label text (`label-md`) must always be visible; never use placeholder text as a substitute for labels.

### Signature Component: The "Verification Chip"
- A small, `secondary` (gold) tinted chip using `secondary_container` background. Used to signify official government approval or verified animal health records.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts (e.g., a headline offset to the left with body text pushed to a narrow right column) to break the "SaaS" feel.
*   **Do** prioritize "Breathing Room." Institutional trust is built through clarity, not density.
*   **Do** use the `secondary_fixed_dim` color for icons that require a "warm" or "humane" touch.

### Don't
*   **Don't** use 1px solid black or dark grey borders. This creates "visual noise" that contradicts the clean, professional tone.
*   **Don't** use standard "vibrant" blue. Stick strictly to the `primary` token (`#004293`) to maintain the "Civic" gravity.
*   **Don't** use sharp 0px corners. The `DEFAULT` (0.5rem) or `lg` (1rem) roundedness is essential to remain "humane."
*   **Don't** use generic stock photography. If photography is used, it should be high-contrast, editorial style, or documentary-style to match the "Serious" tone.