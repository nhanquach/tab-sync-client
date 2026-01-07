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
        // Switch from fixed to sticky for flexbox layout
        "sticky z-40 bg-md-sys-color-surface-container shadow-sm border-r border-md-sys-color-outline-variant/20",
        "hidden md:flex flex-col items-center",
        "flex-shrink-0" // Prevent shrinking
      )}
      style={{
          width: drawerWidth,
          top: headerHeight,
          height: `calc(100vh - ${headerHeight}px)`
      }}
    >
      <div className="flex-1 overflow-y-auto pt-4 px-2 pb-4 flex flex-col items-center gap-4">
        <nav className="flex flex-col gap-4 w-full items-center">
          {/* Open Tabs Item */}
          <Link to={`${ROUTES.HOME}/${TABS_VIEWS.OPEN_TABS}`} className="w-full flex flex-col items-center group">
            <div className={cn(
                "w-14 h-8 rounded-full flex items-center justify-center transition-all duration-300 mb-1",
                 view === TABS_VIEWS.OPEN_TABS
                    ? "bg-md-sys-color-primary-container text-md-sys-color-on-primary-container"
                    : "hover:bg-md-sys-color-surface-container-high text-md-sys-color-on-surface-variant"
            )}>
                <CloudSyncTwoTone sx={{ fontSize: 24 }} />
            </div>
            <span className={cn(
                "text-xs font-medium text-center transition-colors duration-300",
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
                "w-14 h-8 rounded-full flex items-center justify-center transition-all duration-300 mb-1",
                 view === TABS_VIEWS.ARCHIVED_TABS
                    ? "bg-md-sys-color-primary-container text-md-sys-color-on-primary-container"
                    : "hover:bg-md-sys-color-surface-container-high text-md-sys-color-on-surface-variant"
            )}>
                <ArchiveTwoTone sx={{ fontSize: 24 }} />
            </div>
             <span className={cn(
                "text-xs font-medium text-center transition-colors duration-300",
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
