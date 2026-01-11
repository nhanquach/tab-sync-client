# Design System: Glassmorphic Expressive

This document defines the "Glassmorphic Expressive" (or "Premium Modern") design style used in the TabSync application, specifically for Authentication and High-Level container views.

It blends three design trends:
1.  **Glassmorphism:** Premium depth via translucency and blur.
2.  **MD3 Expressive:** Modern asymmetric shapes and pill buttons.
3.  **Modernist Print:** Bold typography and large abstract textures (watermarks).

---

## 1. Container Shape & Material

Containers (Cards, Dialogs) should feel like "slices of glass" floating on the background.

### Shape (Asymmetric)
We use a specific asymmetric curvature to add character while maintaining a professional structure.
*   **Desktop:** Large top-left curve (`48px`), standard corners elsewhere (`16px`).
*   **Mobile:** Moderate top-left curve (`32px`), square or standard elsewhere.

**Tailwind Classes:**
```css
/* Base */
rounded-none
/* Mobile */
rounded-tl-[32px]
/* Desktop */
md:rounded-tl-[48px] md:rounded-tr-[16px] md:rounded-bl-[16px] md:rounded-br-[16px]
```

### Material (Glass)
We use a high-blur, low-opacity white (or black) background to create the glass effect. Borders are subtle and translucent.

**Tailwind Classes:**
```css
/* Blur */
backdrop-blur-xl
/* Light Mode */
bg-white/40 border-0 md:border md:border-white/40
/* Dark Mode */
dark:bg-black/40 dark:border-0 md:dark:border md:dark:border-white/10
```

---

## 2. Atmosphere & Gradient

Hero sections (e.g., the left panel of a split view) use a rich, subtle gradient based on the **Primary** brand color. This replaces solid colors to enhance the glass effect.

**Gradient Definition:**
*   Start: `primary/20` (Top-Left)
*   Middle: `primary/5`
*   End: `transparent` (Bottom-Right)

**Tailwind Classes:**
```css
bg-gradient-to-br from-primary/20 via-primary/5 to-transparent
```

---

## 3. Texture (Watermarks)

To prevent large empty spaces from feeling "dead," we use massive, extremely subtle vector icons as background watermarks. This mimics high-end print design (watermarking).

**Specification:**
*   **Icon:** Relevant Material UI Icon (e.g., `LoginOutlined`, `PersonAddOutlined`).
*   **Size:** Massive (`~400px`).
*   **Opacity:** Extremely low (`3%` - `5%`).
*   **Position:** Absolute, usually bottom-left or off-center.
*   **Rotation:** Slight tilt (`12deg`) to add dynamism.

**Implementation:**
```tsx
<div className="absolute -left-12 -bottom-12 opacity-[0.03] dark:opacity-[0.05] pointer-events-none transform rotate-12">
    <Icon style={{ fontSize: '400px' }} />
</div>
```

---

## 4. Components

### Buttons
All buttons should be **Pill-shaped** to contrast with the more structured glass cards.
*   Class: `rounded-full`

### Inputs
Inputs should blend into the glass container.
*   Background: `bg-background/50` (Semi-transparent)
*   Effect: `backdrop-blur-sm`

### Typography
Headings should be strong and confident to anchor the airy glass design.
*   Style: `font-bold`
*   Size: `text-2xl` or `text-3xl`
*   Tracking: `tracking-tight`

---

## 5. Reusable Component

To apply this theme quickly, use the `<GlassCard />` component located in `src/components/ui/glass-card.tsx`.

```tsx
import { GlassCard } from "@/components/ui/glass-card";

<GlassCard className="max-w-4xl">
  {/* Content */}
</GlassCard>
```
