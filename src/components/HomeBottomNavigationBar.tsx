import React, { useEffect, useState, useRef } from "react";
import { CloudSyncTwoTone, ArchiveTwoTone } from "@mui/icons-material";

import { TABS_VIEWS } from "../interfaces/iView";
import { cn } from "@/lib/utils";

interface IHomeBottomNavigationBarProps {
  view: TABS_VIEWS;
  setView: (view: TABS_VIEWS) => void;
}

const HomeBottomNavigationBar: React.FC<IHomeBottomNavigationBarProps> = ({
  view,
  setView,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // If we are near the top or bottom, always show (optional, but good for UX)
      // Showing near top is essential.
      if (currentScrollY < 10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Scrolling Down -> Hide
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      }
      // Scrolling Up -> Show
      else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed z-50 transition-all duration-300 ease-in-out will-change-transform",
        "md:hidden", // Hide on desktop
        // Floating Pill Positioning
        "bottom-6 left-1/2 -translate-x-1/2",
        // Floating Pill Styling
        "bg-md-sys-color-surface-container-high/90 backdrop-blur-md shadow-xl border border-white/20 dark:border-white/10 rounded-full",
        // Animation State
        !isVisible ? "translate-y-[150%] opacity-0" : "translate-y-0 opacity-100"
      )}
    >
      <div className="flex h-16 items-center px-2 gap-2 min-w-[280px] justify-between">
        {/* Open Tabs Item */}
        <button
          aria-label="Open tabs"
          onClick={() => setView(TABS_VIEWS.OPEN_TABS)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 h-12 rounded-full transition-all duration-200",
             view === TABS_VIEWS.OPEN_TABS
                ? "bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container"
                : "hover:bg-md-sys-color-surface-container text-md-sys-color-on-surface-variant"
          )}
        >
            <CloudSyncTwoTone sx={{ fontSize: 24 }} />
            <span className={cn(
              "text-sm font-medium",
               view === TABS_VIEWS.OPEN_TABS ? "block" : "hidden" // Only show label when active to save space? Or always show?
               // Let's hide label when inactive for a cleaner pill look, common in floating navs
            )}>
              Open
            </span>
        </button>

        {/* Divider (Optional, or just spacing) */}
        <div className="w-px h-6 bg-md-sys-color-outline-variant/50" />

        {/* Archived Tabs Item */}
        <button
          aria-label="Archived tabs"
          onClick={() => setView(TABS_VIEWS.ARCHIVED_TABS)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 h-12 rounded-full transition-all duration-200",
             view === TABS_VIEWS.ARCHIVED_TABS
                ? "bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container"
                : "hover:bg-md-sys-color-surface-container text-md-sys-color-on-surface-variant"
          )}
        >
            <ArchiveTwoTone sx={{ fontSize: 24 }} />
             <span className={cn(
              "text-sm font-medium",
               view === TABS_VIEWS.ARCHIVED_TABS ? "block" : "hidden"
            )}>
              Archived
            </span>
        </button>
      </div>
    </div>
  );
};

export default HomeBottomNavigationBar;
