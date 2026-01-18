import React, { useEffect } from "react";
import { PaletteTwoTone, Check } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { THEMES, ThemeDefinition } from "@/theme/definitions";
import { getItem, saveItem } from "@/utils/LocalStorageHelper";
import { isMobileApp } from "@/utils/isMobile";

const THEME_KEY = "tabsync_theme_id";

export const ThemeSelector: React.FC = () => {
  const [currentThemeId, setCurrentThemeId] = React.useState<string>("indigo");
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = isMobileApp();

  const applyTheme = (theme: ThemeDefinition) => {
    const root = document.documentElement;
    root.style.setProperty("--seed-primary-hue", theme.seed.primaryHue.toString());
    root.style.setProperty("--seed-secondary-hue", theme.seed.secondaryHue.toString());
    root.style.setProperty("--seed-tertiary-hue", theme.seed.tertiaryHue.toString());
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
      <DialogContent className={cn(
          "shadow-none md:shadow-2xl",
          // Material: Glassmorphism
          "backdrop-blur-xl",
          // Light Mode
          "bg-white/40 border-0 md:border md:border-white/40",
          // Dark Mode
          "dark:bg-black/40 dark:border-0 md:dark:border md:dark:border-white/10",

          isMobile
            ? "h-screen w-screen max-w-none pt-10 rounded-none overflow-y-auto"
            : "max-h-[85vh] overflow-y-auto sm:max-w-4xl p-0 rounded-tl-[32px] md:rounded-tl-[48px] md:rounded-tr-[16px] md:rounded-bl-[16px] md:rounded-br-[16px]"
      )}>
        <div className={cn(
          "flex flex-col md:flex-row md:min-h-[450px]",
          "h-auto md:h-full"
        )}>
           {/* Left Column (Hero) */}
           <div className="flex-1 p-6 md:p-10 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border-r border-white/20 dark:border-white/10 flex flex-col justify-center items-start space-y-6 md:space-y-8 relative overflow-hidden shrink-0">
                {/* Decorative background blob */}
                <div className="absolute -right-20 -top-20 w-40 h-40 md:w-64 md:h-64 bg-primary/10 rounded-full blur-3xl" />

                <div className="flex items-center gap-2 transform -rotate-12 transition-transform hover:rotate-0 duration-500 origin-bottom-left">
                  <PaletteTwoTone className="!text-6xl md:!text-8xl opacity-80" />
                </div>

                <div className="space-y-2 md:space-y-4 z-10">
                  <DialogTitle className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                    Appearance <span className="inline-block hover:animate-bounce">🎨</span>
                  </DialogTitle>
                  <DialogDescription className="text-lg md:text-xl font-medium opacity-90 max-w-sm text-foreground">
                    Choose a color theme for your workspace.
                  </DialogDescription>
                </div>
           </div>

           {/* Right Column (Grid) */}
           <div className="flex-1 p-6 md:p-10 flex flex-col justify-center relative bg-white/30 dark:bg-black/20 backdrop-blur-sm shrink-0">
               <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
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
                            : "bg-md-sys-color-surface-container/50 hover:bg-md-sys-color-surface-container border-transparent hover:scale-105"
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

                {isMobile && (
                  <DialogFooter className="mt-8">
                    <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full rounded-full">
                      Close
                    </Button>
                  </DialogFooter>
                )}
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
