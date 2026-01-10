import { PALETTE } from "./palette";

/**
 * Injects the palette colors into CSS variables at runtime.
 * This ensures that Tailwind/CSS uses the exact same colors as MUI.
 */
export const injectTheme = () => {
  const root = document.documentElement;

  // Primary
  root.style.setProperty("--branding-primary", PALETTE.primary.main);
  root.style.setProperty("--branding-primary-dark", PALETTE.primary.dark);

  // Secondary
  root.style.setProperty("--branding-secondary", PALETTE.secondary.main);
};
