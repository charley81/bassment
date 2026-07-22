# Figma-to-Code: Foundation & Typography Implementation

**What:** Set up the BASSMENT project with shadcn/ui, the exact Figma typography scale, brand colors, and the first page sections matching the design file at `figma.com/design/NxzFyuu5LPZEqjTLDlLmAm/BASSMENT`.

**How:** All design values (fonts, colors, sizes, spacing, weights, line-heights, text transforms) are extracted at implementation time from the Figma MCP server (`figma-developer-mcp`). The agent must not guess, hardcode, or approximate any design attribute — it queries Figma for every value.

## Context

We have an approved Figma-to-Code pipeline design doc (`docs/figma-to-code/design.md`) and a working Figma MCP server. The Figma file contains 5861 nodes across 9 pages. This spec implements the first phase: typography, theme, shadcn primitives, and the layout shell.

## Requirements

1. **Extract typography from Figma at implementation time.** Query the Figma MCP server for all text styles. Build CSS utility classes that are a 1:1 mapping of Figma text styles. Do not guess sizes, weights, or line-heights — read them from Figma.
2. **Extract colors from Figma at implementation time.** Query Figma for all color tokens visible in the design. Map them to shadcn CSS variables. Do not hardcode hex values based on memory or prior extraction.
3. **The agent queries Figma per-component.** When building a component (Header, Footer, Hero, EventCard), query Figma for that component's frame/node to extract: dimensions, padding, gap, font styles used, colors, backgrounds, borders, and text content.
4. **JetBrains Mono** is loaded via `next/font` as the primary typeface. The agent confirms this by querying Figma for which font family is used on text nodes.
5. **shadcn/ui** is initialized with CSS variables mapped to extracted Figma colors. No custom CSS beyond theme variables and typography utilities.
6. **Layout shell** (Header, Footer) and page sections match the Figma file pixel-for-pixel at the 1792px artboard width.
7. **Figma colors** are used via CSS custom properties, not hardcoded hex values in components.
8. **Lazy font loading** — `display=swap` with fallback to monospace.

## Design (Process, Not Values)

### 1. Figma Extraction Strategy

At implementation time, the agent queries Figma in this order:

```
Step 1: Get all text styles → build typography utility classes
Step 2: Get all color fills/strokes → build CSS color tokens
Step 3: Get top-level frames (pages) → understand layout structure
Step 4: Per component: query the specific Figma frame → extract dimensions, styles, content
Step 5: Build components matching extracted specs exactly
```

The agent uses the `figma-developer-mcp` server's tools to query nodes. The Figma file key is `NxzFyuu5LPZEqjTLDlLmAm`.

### 2. Font Configuration

The agent queries Figma to determine the primary font family. The expected result is JetBrains Mono. Configure via:

```typescript
import { JetBrains_Mono } from 'next/font/google'

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
})
```

Replace any default Next.js fonts (Geist, Inter) with the Figma-confirmed font.

### 3. Typography Scale

Build CSS utility classes in `app/globals.css` using `@layer utilities`. Each class maps 1:1 to a Figma text style. The agent:

1. Queries Figma for all text style definitions
2. For each style, creates a utility class with the exact: font-family, font-weight, font-size, line-height, letter-spacing, text-transform, text-align, text-decoration
3. Uses semantic class names based on the style's usage (e.g., `text-hero`, `text-body`, `text-label`)
4. Excludes styles that are Figma file section markers (very large decorative labels), not rendered UI
5. Uses `clamp()` for responsive font sizes, with the Figma value as the maximum

### 4. Color Tokens

The agent:

1. Queries Figma for all fill colors, stroke colors, and background colors used across the design
2. Maps them to shadcn/ui CSS variables: `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--muted-foreground`, `--border`, `--input`, `--ring`, `--card`, `--card-foreground`, etc.
3. Sets `--radius: 0rem` (the agent confirms this from Figma by checking corner radius values)
4. Converts hex to HSL for shadcn compatibility

### 5. Project Structure — Files to Create/Modify

```
Modified:
├── app/globals.css      # Figma tokens + typography utilities
├── app/layout.tsx       # Figma font (JetBrains Mono), metadata
├── app/page.tsx         # Home page with extracted sections

Created:
├── components/layout/
│   ├── header.tsx       # Per Figma nav frame query
│   └── footer.tsx       # Per Figma footer frame query
├── components/shared/
│   └── event-card.tsx   # Per Figma event card query
├── lib/
│   └── data.ts          # Temp mock data (shapes match future Sanity schemas)
```

### 6. shadcn/ui Initialization

```bash
npx shadcn@latest init --defaults --yes
```

Options:
- Style: Default
- CSS variables: Dark only
- Tailwind config: CSS (Tailwind v4)
- Components location: `@/components/ui`

Then add primitives:
```bash
npx shadcn@latest add button card input accordion
```

After init, the agent rewrites `app/globals.css` with the Figma-extracted tokens (shadcn init overwrites it with its Nova defaults).

### 7. Component Specs (Extracted, Not Hardcoded)

The agent queries Figma for each component frame and extracts:

**Header:** Frame dimensions, padding, background color, logo text (font style + content), nav items (font style + labels), button (font style + text).

**Footer:** Frame dimensions, sections in order, each row's font style and content, border properties.

**Hero Section:** Dimensions, background, heading text (font style + content + color), subtitle text (font style + content + color), featured event info, button (font style + text + colors).

**Upcoming Events Section:** Heading font style + text, event card grid layout (gap, columns), individual event card: title font style, date font style, description font style, lineup font style, ticket link font style.

**EventCard:** All typography and spacing extracted from the Figma event card node.

### 8. Image Handling

Background images and poster images are out of scope for this phase. Use placeholder divs with the correct background color from Figma. Images will be exported in a follow-up phase.

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| **Design source of truth** | Figma MCP server at implementation time | Pre-extracted tables go stale. Live queries guarantee accuracy. |
| **1792px artboard width** | `max-w-[1792px]` container | Match Figma frame width exactly. |
| **Radius** | `--radius: 0rem` | Confirm via Figma query. Industrial aesthetic if confirmed zero. |
| **Text utility classes** | Custom `@layer utilities` mapped 1:1 from Figma | Covers sizes Tailwind's scale doesn't (30px, 48px, 128px, etc.). |
| **CSS variables for colors** | `hsl(var(--*))` in shadcn, `var(--color-*hex)` for direct | Never hardcode hex in components. |

## Invariants

1. Every Figma text style must have exactly one corresponding CSS utility class. No orphan styles, no extra classes.
2. All colors in components reference `var(--color-*)` or `hsl(var(--*))` — never raw hex.
3. JetBrains Mono must be the only loaded font in production (Geist removed).
4. Before writing any component code, the agent must query Figma for that component's design values.
5. The agent must log which Figma nodes it queried and what values it extracted, so the designer can verify.

## Error Behavior

- **Figma MCP server unavailable:** The agent reports the error and stops. Does not fall back to hardcoded values.
- **Figma node not found:** The agent reports which node ID/path failed and asks for clarification.
- **Font fails to load:** `display: swap` means fallback to monospace. Layout may shift, content is readable.

## Testing Strategy

1. **Build check:** `npm run build` passes with no TypeScript or lint errors.
2. **Visual verification (per component):**
   - Open Figma file side by side with browser
   - Check every extracted value matches (DevTools Computed tab)
   - Check color hex values match exactly
   - Check font family, size, weight, line-height, letter-spacing
   - Check spacing and padding (DevTools box model)
3. **Font loading:** Confirm primary font renders in DevTools → Computed → font-family.
4. **Responsive:** Check at 1792px, 1440px, 768px, 375px. No horizontal overflow.

## Out of Scope

- Framer Motion animations
- GSAP scroll triggers
- Image exports from Figma
- Sanity CMS integration
- Ticket Fairy ticketing
- Pages beyond home (Events, Venue, Sound System, Gallery, FAQ, Contact)
