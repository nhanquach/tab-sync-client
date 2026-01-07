import React from "react";
import { CloudSyncTwoTone, ArchiveTwoTone } from "@mui/icons-material";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { TABS_VIEWS } from "../interfaces/iView";
import { ROUTES } from "../routes";
import { headerHeight } from "./HomeAppBar";
import { drawerWidth } from "../utils/dimensions";

interface IHomeSidebarProps {
  view: string;
}

const HomeSidebar: React.FC<IHomeSidebarProps> = ({ view }) => {
  return (
    <aside
      className={cn(
        // Floating Navigation Rail
        "sticky z-40 hidden md:flex flex-col items-center",
        "bg-md-sys-color-surface-container shadow-sm border border-white/20 dark:border-white/10",
        "rounded-2xl ml-4 mb-4" // Detached margins and rounding
      )}
      style={{
          width: drawerWidth,
          // Calculate top position: Header Height (64) + Header Top Margin (16) + Gap (16) = 96px
          top: `calc(${headerHeight}px + 32px)`,
          // Calculate height: Viewport - Top Offset - Bottom Margin (16)
          height: `calc(100vh - ${headerHeight}px - 48px)`
      }}
    >
      <div className="flex-1 overflow-y-auto pt-4 px-2 pb-4 flex flex-col items-center gap-4 w-full">
        <nav className="flex flex-col gap-4 w-full items-center">
          {/* Open Tabs Item */}
          <Link to={`${ROUTES.HOME}/${TABS_VIEWS.OPEN_TABS}`} className="w-full flex flex-col items-center group">
            <div className={cn(
                "w-12 h-8 rounded-full flex items-center justify-center transition-all duration-300 mb-1", // Slightly smaller pill for rail
                 view === TABS_VIEWS.OPEN_TABS
                    ? "bg-md-sys-color-primary-container text-md-sys-color-on-primary-container"
                    : "hover:bg-md-sys-color-surface-container-high text-md-sys-color-on-surface-variant"
            )}>
                <CloudSyncTwoTone sx={{ fontSize: 20 }} />
            </div>
            <span className={cn(
                "text-[10px] font-medium text-center transition-colors duration-300",
                 view === TABS_VIEWS.OPEN_TABS
                    ? "text-md-sys-color-on-surface font-bold"
                    : "text-md-sys-color-on-surface-variant"
            )}>
                Open
            </span>
          </Link>

          {/* Archived Tabs Item */}
          <Link to={`${ROUTES.HOME}/${TABS_VIEWS.ARCHIVED_TABS}`} className="w-full flex flex-col items-center group">
             <div className={cn(
                "w-12 h-8 rounded-full flex items-center justify-center transition-all duration-300 mb-1",
                 view === TABS_VIEWS.ARCHIVED_TABS
                    ? "bg-md-sys-color-primary-container text-md-sys-color-on-primary-container"
                    : "hover:bg-md-sys-color-surface-container-high text-md-sys-color-on-surface-variant"
            )}>
                <ArchiveTwoTone sx={{ fontSize: 20 }} />
            </div>
             <span className={cn(
                "text-[10px] font-medium text-center transition-colors duration-300",
                 view === TABS_VIEWS.ARCHIVED_TABS
                    ? "text-md-sys-color-on-surface font-bold"
                    : "text-md-sys-color-on-surface-variant"
            )}>
                Archived
            </span>
          </Link>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />
      </div>
    </aside>
  );
};

export default HomeSidebar;
