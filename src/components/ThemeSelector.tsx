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

/** Appearance rows for Settings: System/Light/Dark and the pastel accent. */
export const ThemeSelector: React.FC<{ tile?: React.ReactNode }> = ({ tile }) => {
  const { mode, accentId } = useAppearance();

  return (
    <div className="settings-group">
      <div className="settings-row flex-wrap justify-between gap-y-2">
        <span className="flex items-center gap-3">
          {tile}
          <span>Theme</span>
        </span>
        <div className="flex rounded-lg bg-foreground/[0.06] p-0.5" role="radiogroup" aria-label="Theme">
          {MODES.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={mode === id}
              onClick={() => setColorMode(id)}
              className={cn(
                "flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                mode === id
                  ? "bg-card text-foreground shadow-[0_1px_2px_hsl(var(--shadow-color)/0.12)]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", mode === id && "text-primary-ink")} aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-row flex-wrap justify-between gap-y-2">
        <span className="pl-10">Accent</span>
        <div className="flex items-center gap-2" role="radiogroup" aria-label="Accent colour">
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
                  "flex h-6 w-6 items-center justify-center rounded-full ring-offset-2 ring-offset-card transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "shadow-[inset_0_0_0_1px_hsl(var(--shadow-color)/0.1)]",
                  isSelected && "ring-2 ring-primary-ink"
                )}
                style={{ backgroundColor: theme.swatch }}
              >
                {isSelected && <Check className="h-3.5 w-3.5 text-[hsl(220_30%_14%)]" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
