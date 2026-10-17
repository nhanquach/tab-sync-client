/**
 * Hex equivalents of the design tokens in src/index.css, for MUI.
 * Keep in sync with the HSL values there.
 *
 * MUI uses `primary.main` for text, outlines and focus as well as fills, so it gets the
 * readable teal ink (deep teal on light, the pastel itself on dark); `primary.light` is the
 * pastel fill and `contrastText` the text that sits on `main`.
 */
export const PALETTE = {
  light: {
    primary: "#167467", // --primary-ink 172 68% 27%
    primaryFill: "#a3e0d2", // --primary 166 50% 76%
    primaryContrast: "#ffffff",
    primaryFillText: "#0d3531", // --primary-foreground 174 60% 13%
    background: "#f8f8fa", // 228 14% 97.5%
    paper: "#ffffff",
    text: "#171921", // 230 18% 11%
    muted: "#636574", // 230 8% 42%
    border: "#e0e1e6", // 228 12% 89%
    error: "#cb2a3a", // 354 66% 48%
  },
  dark: {
    primary: "#94dbcb", // --primary-ink 166 50% 72%
    primaryFill: "#97d8c9", // --primary 166 46% 72%
    primaryContrast: "#0b2d2a",
    primaryFillText: "#0b2d2a", // --primary-foreground 174 60% 11%
    background: "#121316", // 235 10% 8%
    paper: "#1a1a1f", // 235 9% 11%
    text: "#edeef2", // 230 15% 94%
    muted: "#9c9eab", // 230 8% 64%
    border: "#28282f", // 235 8% 17%
    error: "#e36370", // 354 70% 64%
  },
};

/** Browser chrome colour (meta theme-color) per mode: the page background. */
export const THEME_COLOR = { light: PALETTE.light.background, dark: PALETTE.dark.background };
