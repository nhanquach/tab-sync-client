import type { CSSProperties } from "react";

/**
 * A stable hue per device, so each browser keeps its colour everywhere (same mapping as
 * the extension's deviceColor.ts). Hues read well as soft chips in light and dark themes.
 */
export const DEVICE_HUES = [252, 212, 172, 142, 32, 336];

/** The brand teal (the extension reserves it for "this browser"). */
export const THIS_DEVICE_HUE = 172;

/** FNV-1a hash of the device name with a murmur finaliser, mapped onto DEVICE_HUES. */
export const deviceHue = (key: string): number => {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return DEVICE_HUES[(h >>> 0) % DEVICE_HUES.length];
};

/** Inline style that feeds the hue to .device-chip / .device-pill / .icon-tile. */
export const hueStyle = (hue: number) => ({ "--hue": String(hue) }) as CSSProperties;
