import { createContext, useContext } from "react";

export interface ICommandPaletteContext {
  /** Open the palette, optionally with text already typed (e.g. ">" for commands only). */
  open: (initial?: string) => void;
}

export const CommandPaletteContext = createContext<ICommandPaletteContext>({ open: () => undefined });

/** Open the command palette from anywhere inside AppShell (toolbar ⌘ button, phone top bar). */
export const useCommandPalette = () => useContext(CommandPaletteContext);
