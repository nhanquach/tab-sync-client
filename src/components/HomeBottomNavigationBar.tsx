import React from "react";
import { CloudSyncTwoTone, ArchiveTwoTone } from "@mui/icons-material";

import { TABS_VIEWS } from "../interfaces/iView";
import { isMobileApp } from "../utils/isMobile";
import { cn } from "@/lib/utils";

interface IHomeBottomNavigationBarProps {
  view: TABS_VIEWS;
  setView: (view: TABS_VIEWS) => void;
}

const HomeBottomNavigationBar: React.FC<IHomeBottomNavigationBarProps> = ({
  view,
  setView,
}) => {
  const isMobile = isMobileApp();

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-md-sys-color-surface-container shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-md-sys-color-outline-variant/20",
        "md:hidden", // Hide on desktop
        isMobile ? "pb-[10px]" : "pb-0" // Safe area padding for mobile app
      )}
    >
      <div className="flex w-full h-20 items-center justify-around px-4">
        {/* Open Tabs Item */}
        <button
          onClick={() => setView(TABS_VIEWS.OPEN_TABS)}
          className="flex flex-col items-center justify-center gap-1 group flex-1"
        >
          <div
            className={cn(
              "w-16 h-8 rounded-full flex items-center justify-center transition-all duration-300",
              view === TABS_VIEWS.OPEN_TABS
                ? "bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container"
                : "bg-transparent text-md-sys-color-on-surface-variant group-hover:bg-md-sys-color-surface-container-high"
            )}
          >
            <CloudSyncTwoTone sx={{ fontSize: 24 }} />
          </div>
          <span
            className={cn(
              "text-xs font-medium transition-colors duration-200",
              view === TABS_VIEWS.OPEN_TABS
                ? "text-md-sys-color-on-surface font-bold"
                : "text-md-sys-color-on-surface-variant"
            )}
          >
            Open tabs
          </span>
        </button>

        {/* Archived Tabs Item */}
        <button
          onClick={() => setView(TABS_VIEWS.ARCHIVED_TABS)}
          className="flex flex-col items-center justify-center gap-1 group flex-1"
        >
          <div
            className={cn(
              "w-16 h-8 rounded-full flex items-center justify-center transition-all duration-300",
              view === TABS_VIEWS.ARCHIVED_TABS
                ? "bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container"
                : "bg-transparent text-md-sys-color-on-surface-variant group-hover:bg-md-sys-color-surface-container-high"
            )}
          >
            <ArchiveTwoTone sx={{ fontSize: 24 }} />
          </div>
          <span
            className={cn(
              "text-xs font-medium transition-colors duration-200",
              view === TABS_VIEWS.ARCHIVED_TABS
                ? "text-md-sys-color-on-surface font-bold"
                : "text-md-sys-color-on-surface-variant"
            )}
          >
            Archived tabs
          </span>
        </button>
      </div>
    </div>
  );
};

export default HomeBottomNavigationBar;
