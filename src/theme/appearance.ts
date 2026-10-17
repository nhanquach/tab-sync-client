import { useSyncExternalStore } from "react";

import { getItem, saveItem } from "../utils/LocalStorageHelper";
import { DEFAULT_THEME_ID, THEMES } from "./definitions";
import { THEME_COLOR } from "./palette";

export type ColorMode = "system" | "light" | "dark";

export const THEME_KEY = "tabsync_theme_id";
export const COLOR_MODE_KEY = "tabsync_color_mode";

const darkQuery = () =>
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

interface AppearanceState {
  mode: ColorMode;
  accentId: string;
  isDark: boolean;
}

const readMode = (): ColorMode => {
  const saved = getItem<string>(COLOR_MODE_KEY);
  return saved === "light" || saved === "dark" ? saved : "system";
};

const readAccent = (): string => {
  const saved = getItem<string>(THEME_KEY);
  return THEMES.some((t) => t.id === saved) ? (saved as string) : DEFAULT_THEME_ID;
};

const resolveDark = (mode: ColorMode) =>
  mode === "dark" || (mode === "system" && !!darkQuery()?.matches);

let state: AppearanceState = {
  mode: readMode(),
  accentId: readAccent(),
  isDark: false,
};
state.isDark = resolveDark(state.mode);

const listeners = new Set<() => void>();

const apply = () => {
  const root = document.documentElement;
  root.classList.toggle("dark", state.isDark);

  const theme = THEMES.find((t) => t.id === state.accentId);
  if (theme && theme.hue !== null) {
    root.setAttribute("data-accent", theme.id);
    root.style.setProperty("--accent-hue", String(theme.hue));
  } else {
    root.removeAttribute("data-accent");
    root.style.removeProperty("--accent-hue");
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute("content", state.isDark ? THEME_COLOR.dark : THEME_COLOR.light);
};

const update = (next: Partial<AppearanceState>) => {
  state = { ...state, ...next };
  state.isDark = resolveDark(state.mode);
  apply();
  listeners.forEach((l) => l());
};

/** Apply the saved appearance before React renders, and follow system changes. */
export const initAppearance = () => {
  apply();
  darkQuery()?.addEventListener?.("change", () => {
    if (state.mode === "system") update({});
  });
};

export const setColorMode = (mode: ColorMode) => {
  saveItem(COLOR_MODE_KEY, mode);
  update({ mode });
};

export const setAccent = (accentId: string) => {
  saveItem(THEME_KEY, accentId);
  update({ accentId });
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useAppearance = () => useSyncExternalStore(subscribe, () => state);
