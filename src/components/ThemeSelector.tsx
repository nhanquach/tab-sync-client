import React, { useEffect } from "react";
import { PaletteTwoTone, Check } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { THEMES, ThemeDefinition } from "@/theme/definitions";
import { getItem, saveItem } from "@/utils/LocalStorageHelper";

const THEME_KEY = "tabsync_theme_id";

export const ThemeSelector: React.FC = () => {
  const [currentThemeId, setCurrentThemeId] = React.useState<string>("indigo");
  const [isOpen, setIsOpen] = React.useState(false);

  const applyTheme = (theme: ThemeDefinition) => {
    const root = document.documentElement;
    root.style.setProperty("--seed-primary-hue", theme.seed.primaryHue.toString());
    root.style.setProperty("--seed-secondary-hue", theme.seed.secondaryHue.toString());
    root.style.setProperty("--seed-tertiary-hue", theme.seed.tertiaryHue.toString());

    // Also update branding colors for legacy compatibility if needed
    // Assuming simple HSL to Hex conversion is too complex here,
    // we rely on the CSS variables being the source of truth.
  };

  useEffect(() => {
    const savedThemeId = getItem<string>(THEME_KEY);
    if (savedThemeId) {
      const theme = THEMES.find((t) => t.id === savedThemeId);
      if (theme) {
        setCurrentThemeId(theme.id);
        applyTheme(theme);
      }
    }
  }, []);

  const handleSelectTheme = (theme: ThemeDefinition) => {
    setCurrentThemeId(theme.id);
    applyTheme(theme);
    saveItem(THEME_KEY, theme.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full hover:bg-md-sys-color-surface-container-high transition-all"
        >
          <PaletteTwoTone className="text-md-sys-color-on-surface-variant" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-md-sys-color-surface-container-high/95 backdrop-blur-xl border-white/20 rounded-[32px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal text-center">Appearance</DialogTitle>
          <DialogDescription className="text-center text-md-sys-color-on-surface-variant/70">
            Choose a color theme for your workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6">
          {THEMES.map((theme) => {
            const isSelected = currentThemeId === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleSelectTheme(theme)}
                className={cn(
                  "relative group flex flex-col items-center gap-3 p-4 rounded-[24px] border transition-all duration-300",
                  isSelected
                    ? "bg-md-sys-color-surface-container-low border-md-sys-color-primary shadow-lg scale-105"
                    : "bg-md-sys-color-surface-container hover:bg-md-sys-color-surface border-transparent hover:scale-105"
                )}
              >
                {/* Color Preview Circles */}
                <div className="flex -space-x-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-black shadow-sm"
                    style={{ backgroundColor: `hsl(${theme.seed.primaryHue}, 60%, 50%)` }}
                  />
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-black shadow-sm"
                    style={{ backgroundColor: `hsl(${theme.seed.secondaryHue}, 20%, 50%)` }}
                  />
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-black shadow-sm"
                    style={{ backgroundColor: `hsl(${theme.seed.tertiaryHue}, 60%, 50%)` }}
                  />
                </div>

                <span className={cn(
                    "text-sm font-medium transition-colors",
                    isSelected ? "text-md-sys-color-primary" : "text-md-sys-color-on-surface"
                )}>
                    {theme.name}
                </span>

                {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-md-sys-color-primary rounded-full flex items-center justify-center text-md-sys-color-on-primary shadow-md">
                        <Check className="w-4 h-4" />
                    </div>
                )}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
