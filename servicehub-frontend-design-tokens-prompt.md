# Antigravity Prompt — ServiceHub Frontend Design Token Foundation

Paste this into Antigravity working in `service-hub-client` (Next.js + TypeScript).

---

## Role & Context

```
You are a senior frontend engineer setting up the design token foundation
for "ServiceHub", a Next.js 15 (App Router) + TypeScript + Tailwind CSS +
DaisyUI project. This is the FIRST frontend task — no UI screens yet, just
the token layer everything else will be built on: CSS custom properties for
light and dark mode, typography scale, spacing scale, radius scale, and the
theme switching mechanism. Do not build page UI in this task — only the
foundation files listed below. Be precise: every value below is final,
taken from an approved design system, not a suggestion to interpret.
```

---

## Reconciliation Notes (context for the agent, include verbatim)

```
This project has two Material-3-style token sets, one authored for light
mode and one for dark mode. Their color tokens are already a matched pair
(same token names, same structure) — use them as-is per theme. Their
typography and shape scales diverged during generation; standardize on the
light-mode file's typography (Manrope + Inter) and shape scale (16px cards,
12px inputs/buttons, pill badges) for BOTH themes. Do not use Hanken
Grotesk or JetBrains Mono anywhere. Do not use the dark file's 4px/8px
radius scale — override it with the 16px/12px/pill scale for consistency
between themes.
```

---

## 1. Install Missing Dependency

```
npm i next-themes
```
(Needed for class/data-attribute-based dark mode switching that persists across reloads and avoids flash-of-wrong-theme.)

---

## 2. `src/app/globals.css` — Full Token Specification

```
Create src/app/globals.css with Tailwind directives at the top, followed by
a CSS custom properties block for :root (light theme) and a
.dark selector (dark theme, toggled via next-themes class strategy).

Use these EXACT values, using kebab-case CSS variable names prefixed
--color- for colors, --font- for typography, --radius- for shape,
--space- for spacing.

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Surfaces */
  --color-background: #faf8ff;
  --color-surface: #faf8ff;
  --color-surface-dim: #d2d9f4;
  --color-surface-bright: #faf8ff;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f2f3ff;
  --color-surface-container: #eaedff;
  --color-surface-container-high: #e2e7ff;
  --color-surface-container-highest: #dae2fd;
  --color-surface-variant: #dae2fd;

  /* Text on surfaces */
  --color-on-background: #131b2e;
  --color-on-surface: #131b2e;
  --color-on-surface-variant: #464555;
  --color-inverse-surface: #283044;
  --color-inverse-on-surface: #eef0ff;

  /* Outlines */
  --color-outline: #777587;
  --color-outline-variant: #c7c4d8;

  /* Primary (Indigo) */
  --color-primary: #3525cd;
  --color-on-primary: #ffffff;
  --color-primary-container: #4f46e5;
  --color-on-primary-container: #dad7ff;
  --color-inverse-primary: #c3c0ff;
  --color-surface-tint: #4d44e3;
  --color-primary-fixed: #e2dfff;
  --color-primary-fixed-dim: #c3c0ff;
  --color-on-primary-fixed: #0f0069;
  --color-on-primary-fixed-variant: #3323cc;

  /* Secondary (Amber) */
  --color-secondary: #9d4300;
  --color-on-secondary: #ffffff;
  --color-secondary-container: #fd761a;
  --color-on-secondary-container: #5c2400;
  --color-secondary-fixed: #ffdbca;
  --color-secondary-fixed-dim: #ffb690;
  --color-on-secondary-fixed: #341100;
  --color-on-secondary-fixed-variant: #783200;

  /* Tertiary (Emerald) */
  --color-tertiary: #005338;
  --color-on-tertiary: #ffffff;
  --color-tertiary-container: #006e4b;
  --color-on-tertiary-container: #67f4b7;
  --color-tertiary-fixed: #6ffbbe;
  --color-tertiary-fixed-dim: #4edea3;
  --color-on-tertiary-fixed: #002113;
  --color-on-tertiary-fixed-variant: #005236;

  /* Error */
  --color-error: #ba1a1a;
  --color-on-error: #ffffff;
  --color-error-container: #ffdad6;
  --color-on-error-container: #93000a;

  /* Shape */
  --radius-sm: 0.25rem;
  --radius: 0.5rem;
  --radius-md: 0.75rem;   /* inputs, buttons */
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;    /* cards, modals -> use for 16px card radius */
  --radius-full: 9999px;  /* badges, pills, avatars */

  /* Spacing */
  --space-base: 4px;
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  --space-xxl: 80px;
  --container-max: 1280px;
  --gutter: 24px;
}

.dark {
  --color-background: #051424;
  --color-surface: #051424;
  --color-surface-dim: #051424;
  --color-surface-bright: #2c3a4c;
  --color-surface-container-lowest: #010f1f;
  --color-surface-container-low: #0d1c2d;
  --color-surface-container: #122131;
  --color-surface-container-high: #1c2b3c;
  --color-surface-container-highest: #273647;
  --color-surface-variant: #273647;

  --color-on-background: #d4e4fa;
  --color-on-surface: #d4e4fa;
  --color-on-surface-variant: #c6c5d5;
  --color-inverse-surface: #d4e4fa;
  --color-inverse-on-surface: #233143;

  --color-outline: #908f9e;
  --color-outline-variant: #454653;

  --color-primary: #bdc2ff;
  --color-on-primary: #131e8c;
  --color-primary-container: #818cf8;
  --color-on-primary-container: #101b8a;
  --color-inverse-primary: #4953bc;
  --color-surface-tint: #bdc2ff;
  --color-primary-fixed: #e0e0ff;
  --color-primary-fixed-dim: #bdc2ff;
  --color-on-primary-fixed: #000767;
  --color-on-primary-fixed-variant: #2f3aa3;

  --color-secondary: #ffc640;
  --color-on-secondary: #402d00;
  --color-secondary-container: #e3aa00;
  --color-on-secondary-container: #5a4100;
  --color-secondary-fixed: #ffdf9f;
  --color-secondary-fixed-dim: #f9bd22;
  --color-on-secondary-fixed: #261a00;
  --color-on-secondary-fixed-variant: #5c4300;

  --color-tertiary: #45dfa4;
  --color-on-tertiary: #003825;
  --color-tertiary-container: #00aa78;
  --color-on-tertiary-container: #003523;
  --color-tertiary-fixed: #68fcbf;
  --color-tertiary-fixed-dim: #45dfa4;
  --color-on-tertiary-fixed: #002114;
  --color-on-tertiary-fixed-variant: #005137;

  --color-error: #ffb4ab;
  --color-on-error: #690005;
  --color-error-container: #93000a;
  --color-on-error-container: #ffdad6;

  /* Radius and spacing stay IDENTICAL to :root — do not redefine them here */
}

@layer base {
  body {
    background-color: var(--color-background);
    color: var(--color-on-background);
    font-family: var(--font-inter), sans-serif;
  }
  h1, h2, h3, h4 {
    font-family: var(--font-manrope), sans-serif;
  }
}
```

---

## 3. Typography Scale

```
Set up next/font in src/lib/fonts.ts loading Manrope (weights 600, 700, 800)
and Inter (weights 400, 500, 600) as CSS variables, then apply them via
the --font-manrope and --font-inter custom properties referenced in
globals.css above.

src/lib/fonts.ts:

import { Manrope, Inter } from "next/font/google";

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

Apply both variable classes to the <html> or <body> tag in the root layout.

Then define this exact type scale as Tailwind utility classes via
tailwind.config.ts fontSize extension (see step 4) — do NOT hardcode these
inline in components, always use the Tailwind class:

| Token        | Size / Line-height | Weight | Font    | Tailwind class      |
|--------------|---------------------|--------|---------|----------------------|
| h1           | 48px / 1.1          | 800    | Manrope | text-h1              |
| h1-mobile    | 32px / 1.2          | 800    | Manrope | text-h1-mobile       |
| h2           | 40px / 1.2          | 700    | Manrope | text-h2              |
| h2-mobile    | 28px / 1.2          | 700    | Manrope | text-h2-mobile       |
| h3           | 32px / 1.2          | 600    | Manrope | text-h3               |
| h4           | 28px / 1.3          | 600    | Manrope | text-h4               |
| body-lg      | 18px / 1.6          | 400    | Inter   | text-body-lg          |
| body         | 16px / 1.5          | 400    | Inter   | text-body              |
| small        | 14px / 1.4          | 500    | Inter   | text-small             |
| micro        | 12px / 1.0          | 600    | Inter   | text-micro (+ tracking-wide, uppercase where used) |

h1/h2/h3/h4 use letter-spacing -0.02em (h1/h2) and -0.01em (h3/h4).
```

---

## 4. `tailwind.config.ts`

```
Configure tailwind.config.ts to:

1. Set darkMode: 'class' (required for next-themes class strategy).
2. Extend theme.colors so every CSS variable above is usable as a Tailwind
   utility, e.g. bg-surface-container, text-on-surface-variant,
   border-outline-variant, bg-primary-container, text-on-primary-container.
   Map every --color-* variable from globals.css to a matching Tailwind
   color key using the var() function, e.g.:
     colors: {
       background: 'var(--color-background)',
       surface: 'var(--color-surface)',
       'surface-container': 'var(--color-surface-container)',
       'surface-container-high': 'var(--color-surface-container-high)',
       'on-surface': 'var(--color-on-surface)',
       'on-surface-variant': 'var(--color-on-surface-variant)',
       outline: 'var(--color-outline)',
       'outline-variant': 'var(--color-outline-variant)',
       primary: 'var(--color-primary)',
       'on-primary': 'var(--color-on-primary)',
       'primary-container': 'var(--color-primary-container)',
       'on-primary-container': 'var(--color-on-primary-container)',
       secondary: 'var(--color-secondary)',
       'on-secondary': 'var(--color-on-secondary)',
       'secondary-container': 'var(--color-secondary-container)',
       'on-secondary-container': 'var(--color-on-secondary-container)',
       tertiary: 'var(--color-tertiary)',
       'on-tertiary': 'var(--color-on-tertiary)',
       'tertiary-container': 'var(--color-tertiary-container)',
       'on-tertiary-container': 'var(--color-on-tertiary-container)',
       error: 'var(--color-error)',
       'on-error': 'var(--color-on-error)',
       'error-container': 'var(--color-error-container)',
       'on-error-container': 'var(--color-on-error-container)',
       // include the remaining -fixed/-fixed-dim/inverse-* tokens the same way
     }
   (Map every token defined in globals.css — do not skip any.)

3. Extend theme.borderRadius with: sm: 'var(--radius-sm)', DEFAULT: 'var(--radius)',
   md: 'var(--radius-md)', lg: 'var(--radius-lg)', xl: 'var(--radius-xl)',
   full: 'var(--radius-full)'.

4. Extend theme.spacing with the --space-* tokens (xs, sm, md, lg, xl, xxl)
   as additional spacing scale values, keep Tailwind's default scale intact
   alongside these named additions.

5. Extend theme.fontSize with the full type scale table from step 3,
   each entry as [size, { lineHeight, fontWeight, letterSpacing }].

6. Extend theme.fontFamily: manrope: ['var(--font-manrope)'], inter:
   ['var(--font-inter)'].

7. Add the daisyui plugin with TWO custom themes named "servicehub" (light,
   default) and "servicehub-dark", mapping daisyui's semantic slots to the
   SAME hex values as the CSS variables above (daisyui requires static
   values per theme, not var() references):
     servicehub: { primary: '#3525cd', secondary: '#fd761a', accent: '#006e4b',
       neutral: '#464555', 'base-100': '#faf8ff', 'base-200': '#f2f3ff',
       'base-300': '#eaedff', 'base-content': '#131b2e', error: '#ba1a1a' }
     servicehub-dark: { primary: '#bdc2ff', secondary: '#ffc640', accent: '#45dfa4',
       neutral: '#c6c5d5', 'base-100': '#051424', 'base-200': '#0d1c2d',
       'base-300': '#122131', 'base-content': '#d4e4fa', error: '#ffb4ab' }
   Set daisyui.darkTheme to "servicehub-dark".
   This lets DaisyUI structural components (btn, modal, drawer, table) theme
   correctly while our own components use the explicit Tailwind color
   utilities from step 2 for anything DaisyUI doesn't cover.
```

---

## 5. Theme Switching

```
Create src/components/theme-provider.tsx wrapping next-themes'
ThemeProvider with attribute="class" (to match darkMode:'class' in
Tailwind) AND make sure it also sets data-theme="servicehub" /
data-theme="servicehub-dark" on <html> so DaisyUI's theme system picks it
up simultaneously. Use next-themes' `attribute={["class", "data-theme"]}`
multi-attribute support if available in the installed version; otherwise
sync data-theme manually via a useEffect keyed on the resolved theme.

defaultTheme="system", enableSystem=true.

Create src/components/theme-toggle.tsx: a button using lucide-react's Sun
and Moon icons, toggling between themes, accessible (aria-label="Toggle
theme"), styled with our token classes (bg-surface-container-high on
hover, rounded-full, 40px square).

Wrap the root layout's <body> children with <ThemeProvider>. Apply
`className={`${manrope.variable} ${inter.variable}`}` to the <html> tag so
the font CSS variables are available globally.
```

---

## 6. Definition of Done

```
- npm run dev renders a blank page with correct background/text color in
  both light and system-dark mode, no flash of unstyled/wrong theme on load.
- Toggling ThemeToggle switches both Tailwind's dark: variants and
  DaisyUI's theme-dependent components simultaneously.
- Every color token from both design files exists as a usable Tailwind
  class (spot-check: bg-surface-container-highest, text-on-primary-container,
  border-outline-variant all resolve to real colors, not black/undefined).
- text-h1 through text-micro all render at Manrope/Inter with correct
  size/weight/line-height/letter-spacing per the table in step 3.
- rounded-xl on a test div renders 16px (0.5rem confirmed wrong — must be
  1.5rem per --radius-xl), rounded-md renders 12px equivalent per
  --radius-md, rounded-full renders a pill.
- No hardcoded hex colors, px font sizes, or arbitrary Tailwind values
  ([16px], [#4f46e5], etc.) anywhere in this task's output — everything
  routes through the token system above.
```
