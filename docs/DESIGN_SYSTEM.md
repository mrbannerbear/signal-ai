# Signal AI Design System (2026)

> **Philosophy:** Calm, Analytical, Trustworthy.
> A tool for professionals, not a toy. "Engineered precision."

---

## 🎨 Token System

### Palette: "Stone & Emerald"
We use a grounded, terrestrial palette to avoid generic "AI Blue/Indigo" tropes.

| Token | Tailwind | Purpose |
| :--- | :--- | :--- |
| **Neutral** | `Stone (Warm Gray)` | Backgrounds, text, borders. Avoids clinical `slate`. |
| **Accent** | `Emerald-600` | Primary actions, success signals, high confidence. |
| **Warning** | `Amber-600` | Medium risks, "missing keywords". |
| **Error** | `Red-600` | Critical failures, high risk. |

### Color Usage
- **Backgrounds**: `bg-background` (#fafaf9) for main areas. `bg-card` (#ffffff) for surfaces.
- **Dark Mode**: Deep warm charcoal (#0c0a09), **not pure black**.
- **Accents**: Use sparingly. 80% of the UI should be monochrome.

---

## 🔤 Typography

**Font**: `Geist Sans` + `Geist Mono`

| Scale | Usage |
| :--- | :--- |
| `text-xs` | Metadata, tags, timestamps |
| `text-sm` | Secondary body, table rows, button labels |
| `text-base` | Primary body, inputs |
| `text-lg` | Section intros, large stats |
| `text-xl+` | Headings (Tracking: tight) |

**Rules:**
- **Headings**: `font-semibold tracking-tight`
- **Numbers/Data**: `font-mono` for precision
- **Body**: `leading-relaxed` for readability

---

## 📐 Layout & Spacing

- **Container**: `max-w-[1100px]` (Narrow/Focused) -> `.container-narrow`
- **Grid**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- **Gap**: `gap-4` (tight) or `gap-8` (distinct sections)
- **Radius**: `rounded-lg` (0.5rem) or `rounded-xl` (0.75rem). Avoid `rounded-3xl`.

---

## 🧱 Component Patterns

### 1. Cards (The Atomic Unit)
- **Style**: `bg-card border border-border shadow-sm`
- **Interaction**: `hover:border-primary/20 transition-colors`
- **Content**: Title (strong) -> Description (muted) -> Action (bottom)

### 2. Buttons
- **Primary**: `bg-zinc-900 text-white` (Solid, authoritative)
- **Accent**: `bg-emerald-600 text-white` (Conversion/Success)
- **Ghost**: `hover:bg-zinc-100` (Navigation, secondary)
- **Size**: Default `h-9 px-4`, but use `size="xl"` (`h-11`) for major CTAs.

### 3. Data Visualization
- **Charts**: Minimal. Thin lines.
- **Colors**: Use the semantic palette (Emerald/Amber/Red).
- **Tooltips**: `bg-zinc-900 text-white p-2 text-xs rounded`.

---

## 🚫 Anti-Patterns

- **Gradient Text**: Avoid. Reduces readability.
- **Glassmorphism**: Avoid. Feels 2021.
- **Drop Shadows**: Keep distinct and minimal. No colorful glows.
- **Motion**: No "bouncy" animations. Use `ease-out duration-200` fade/slide.

---

## 🛠 Implementation Guide

When refactoring a page:

1. **Strip**: Remove custom colors (`text-indigo-600`) and replace with token vars (`text-primary`, `text-muted-foreground`).
2. **Flatten**: Remove nested unnecessary divs.
3. **Tighten**: Reduce border-radius (`3xl` -> `xl`) and font tracking.
4. **Semantics**: Ensure `<h1>` -> `<h2>` hierarchy is rigorous.
