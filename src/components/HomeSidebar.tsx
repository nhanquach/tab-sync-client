import React from "react";
import { CloudSyncTwoTone, ArchiveTwoTone } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";

import { cn } from "@/lib/utils";
import { TABS_VIEWS } from "../interfaces/iView";
import { ROUTES } from "../routes";
import { drawerWidth } from "../utils/dimensions";
import Logo from "./Logo";
import AccountSettings from "./AccountSettings";
import FeedbackDialog from "./FeedbackDialog";
import QRCodeDialog from "./QRCodeDialog";
import { ThemeSelector } from "./ThemeSelector";
import { StatsDialog } from "./StatsDialog";
import { DataManagementDialog } from "./DataManagementDialog";

interface IHomeSidebarProps {
  view: string;
  user?: User;
  isLoading?: boolean;
}

const HomeSidebar: React.FC<IHomeSidebarProps> = ({ view, user, isLoading = false }) => {
  return (
    <aside
      className={cn(
        // Floating Navigation Rail
        "sticky z-40 hidden md:flex flex-col items-center justify-between py-6",
        "bg-md-sys-color-surface-container shadow-sm border border-white/20 dark:border-white/10",
        "rounded-2xl ml-4 mb-4"
      )}
      style={{
          width: drawerWidth,
          // Desktop: Top 0 + Margin. Since header is gone on desktop, we can just sit nicely.
          // But we need to check Home layout. Home container has padding.
          // Let's make it sticky relative to the viewport top with a margin.
          top: "1.5rem",
          height: `calc(100vh - 3rem)` // Full height minus top/bottom margins
      }}
    >
      {/* Top Section: Logo + Nav */}
      <div className="flex flex-col items-center gap-8 w-full">
        {/* Logo */}
        <div className="group relative flex items-center justify-center">
             {isLoading && (
                <div className="absolute inset-[-8px] rounded-full border-2 border-transparent border-t-md-sys-color-primary animate-spin" />
             )}
             <Logo className={cn(
                "w-10 h-10 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",
                isLoading ? "scale-75" : "scale-100",
                !isLoading && "group-hover:-translate-y-1 group-hover:scale-110 group-hover:brightness-110 group-hover:drop-shadow-md"
             )} />
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-6 w-full items-center">
          <Link to={`${ROUTES.HOME}/${TABS_VIEWS.OPEN_TABS}`} className="w-full flex flex-col items-center group">
            <div className={cn(
                "w-12 h-8 rounded-full flex items-center justify-center transition-all duration-300 mb-1",
                 view === TABS_VIEWS.OPEN_TABS
                    ? "bg-md-sys-color-primary-container text-md-sys-color-on-primary-container"
                    : "group-hover:bg-md-sys-color-surface-container-high text-md-sys-color-on-surface-variant"
            )}>
                <CloudSyncTwoTone sx={{ fontSize: 24 }} />
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

          <Link to={`${ROUTES.HOME}/${TABS_VIEWS.ARCHIVED_TABS}`} className="w-full flex flex-col items-center group">
             <div className={cn(
                "w-12 h-8 rounded-full flex items-center justify-center transition-all duration-300 mb-1",
                 view === TABS_VIEWS.ARCHIVED_TABS
                    ? "bg-md-sys-color-primary-container text-md-sys-color-on-primary-container"
                    : "group-hover:bg-md-sys-color-surface-container-high text-md-sys-color-on-surface-variant"
            )}>
                <ArchiveTwoTone sx={{ fontSize: 24 }} />
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
      </div>

      {/* Bottom Section: Feedback + Settings */}
      <div className="flex flex-col items-center gap-4 mb-2">
          <DataManagementDialog />
          <StatsDialog />
          <ThemeSelector />
          <div className="w-8 h-[1px] bg-md-sys-color-outline-variant/30 my-1" />
          <QRCodeDialog />
          <FeedbackDialog iconOnly />
          <AccountSettings user={user} isLoading={isLoading} />
      </div>
    </aside>
  );
};

export default HomeSidebar;
