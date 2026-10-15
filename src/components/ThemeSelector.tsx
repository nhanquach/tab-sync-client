import React from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { THEMES } from "@/theme/definitions";
import { ColorMode, setAccent, setColorMode, useAppearance } from "@/theme/appearance";

const MODES: { id: ColorMode; label: string; Icon: typeof Sun }[] = [
  { id: "system", label: "System", Icon: Monitor },
  { id: "light", label: "Light", Icon: Sun },
  { id: "dark", label: "Dark", Icon: Moon },
];

/** Appearance rows for Settings: light/dark mode and accent colour. */
export const ThemeSelector: React.FC = () => {
  const { mode, accentId } = useAppearance();

  return (
    <div className="settings-group">
      <div className="settings-row flex-wrap justify-between">
        <span>Theme</span>
        <div className="flex rounded-md border border-border p-0.5" role="radiogroup" aria-label="Theme">
          {MODES.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={mode === id}
              onClick={() => setColorMode(id)}
              className={cn(
                "flex h-7 items-center gap-1.5 rounded px-2.5 text-xs font-medium transition-colors",
                mode === id ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-row flex-wrap justify-between">
        <span>Accent</span>
        <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Accent colour">
          {THEMES.map((theme) => {
            const isSelected = accentId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={theme.name}
                title={theme.name}
                onClick={() => setAccent(theme.id)}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected && "ring-2 ring-foreground/60"
                )}
                style={{ backgroundColor: theme.swatch }}
              >
                {isSelected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
