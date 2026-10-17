/**
 * Accent colours offered in Settings > Appearance.
 * Teal (the Loop brand, shared with the extension) is the default and uses the design tokens
 * in index.css verbatim; the others only swap the hue of the pastel fill / ink / ring.
 * Ids are kept from the previous theme picker so saved choices still resolve.
 */
export interface ThemeDefinition {
  id: string;
  name: string;
  /** Hue used for the accent; null means the default token (teal). */
  hue: number | null;
  /** Swatch colour shown in the picker (the pastel fill). */
  swatch: string;
}

export const DEFAULT_THEME_ID = "teal";

export const THEMES: ThemeDefinition[] = [
  { id: "teal", name: "Teal", hue: null, swatch: "hsl(166 50% 76%)" },
  { id: "blue", name: "Blue", hue: 214, swatch: "hsl(214 55% 80%)" },
  { id: "indigo", name: "Indigo", hue: 245, swatch: "hsl(245 55% 80%)" },
  { id: "green", name: "Green", hue: 135, swatch: "hsl(135 55% 80%)" },
  { id: "orange", name: "Peach", hue: 25, swatch: "hsl(25 55% 80%)" },
  { id: "rose", name: "Rose", hue: 345, swatch: "hsl(345 55% 80%)" },
];
