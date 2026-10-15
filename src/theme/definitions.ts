/**
 * Accent colours offered in Settings > Appearance.
 * Blue is the default and uses the design tokens in index.css verbatim;
 * the others only swap the hue of --primary / --ring.
 * Ids are kept from the previous theme picker so saved choices still resolve.
 */
export interface ThemeDefinition {
  id: string;
  name: string;
  /** Hue used for the accent; null means the default token (blue). */
  hue: number | null;
  /** Swatch colour shown in the picker. */
  swatch: string;
}

export const DEFAULT_THEME_ID = "blue";

export const THEMES: ThemeDefinition[] = [
  { id: "blue", name: "Blue", hue: null, swatch: "hsl(221 83% 53%)" },
  { id: "indigo", name: "Indigo", hue: 245, swatch: "hsl(245 70% 55%)" },
  { id: "teal", name: "Teal", hue: 175, swatch: "hsl(175 70% 38%)" },
  { id: "green", name: "Green", hue: 142, swatch: "hsl(142 70% 38%)" },
  { id: "orange", name: "Orange", hue: 25, swatch: "hsl(25 90% 50%)" },
  { id: "rose", name: "Rose", hue: 345, swatch: "hsl(345 75% 52%)" },
];
