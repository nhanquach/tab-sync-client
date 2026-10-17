import React from "react";
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Archive, BarChart3, Layers, MessageSquare, QrCode, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { TABS_VIEWS } from "../interfaces/iView";
import { ROUTES } from "../routes";
import LogoWithTabSync from "./LogoWithTabSync";
import { DeviceChip } from "./DeviceIcon";
import FeedbackDialog from "./FeedbackDialog";
import QRCodeDialog from "./QRCodeDialog";
import { StatsDialog } from "./StatsDialog";

export type SidebarSection = "open" | "archived" | "settings";

interface IHomeSidebarProps {
  active: SidebarSection;
  user?: User;
  isLoading?: boolean;
  /** Count for the active tab view, shown next to its nav item. */
  activeCount?: number;
  devices?: string[];
  selectedDevice?: string;
  onSelectDevice?: (device: string) => void;
}

const NavButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: React.ReactNode }
>(({ icon, children, className, ...props }, ref) => (
  <button ref={ref} type="button" className={cn("nav-item", className)} {...props}>
    {icon}
    <span className="min-w-0 flex-1 truncate">{children}</span>
  </button>
));
NavButton.displayName = "NavButton";

const iconCls = "h-4 w-4 shrink-0";

/** Slim desktop sidebar: views, devices, utilities and the account. */
const HomeSidebar: React.FC<IHomeSidebarProps> = ({
  active,
  user,
  isLoading = false,
  activeCount,
  devices,
  selectedDevice = "All",
  onSelectDevice,
}) => {
  const initial = user?.email?.charAt(0).toUpperCase();

  const viewLink = (section: SidebarSection, view: TABS_VIEWS, label: string, icon: React.ReactNode) => (
    <Link
      to={`${ROUTES.HOME}/${view}`}
      className={cn("nav-item", active === section && "nav-item-active")}
      aria-current={active === section ? "page" : undefined}
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {active === section && activeCount !== undefined && !isLoading && (
        <span className="shrink-0 rounded-full bg-primary/40 px-1.5 text-[11px] font-semibold tabular-nums text-primary-foreground dark:bg-primary/15 dark:text-primary-ink">{activeCount}</span>
      )}
    </Link>
  );

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col glass-bar glass-bar-right md:flex">
      <div className="px-4 pb-3 pt-5">
        <Link to={`${ROUTES.HOME}/${TABS_VIEWS.OPEN_TABS}`} className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <LogoWithTabSync />
        </Link>
      </div>

      <nav className="min-h-0 flex-1 space-y-5 overflow-y-auto px-2 pb-4" aria-label="Main">
        <div className="space-y-0.5">
          {viewLink("open", TABS_VIEWS.OPEN_TABS, "Open tabs", <Layers className={iconCls} />)}
          {viewLink("archived", TABS_VIEWS.ARCHIVED_TABS, "Archived", <Archive className={iconCls} />)}
        </div>

        {onSelectDevice && devices && devices.length > 0 && (
          <div className="space-y-1">
            <p className="section-label px-2">Devices</p>
            <div className="space-y-0.5">
              {["All", ...devices].map((device) => (
                <button
                  key={device}
                  type="button"
                  onClick={() => onSelectDevice(device)}
                  className={cn("nav-item", selectedDevice === device && "nav-item-active")}
                  aria-pressed={selectedDevice === device}
                >
                  {device === "All" ? (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-foreground/[0.06] text-muted-foreground" aria-hidden>
                      <Layers className="h-3 w-3" />
                    </span>
                  ) : (
                    <DeviceChip name={device} size="sm" />
                  )}
                  <span className="min-w-0 flex-1 truncate">{device === "All" ? "All devices" : device}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="space-y-0.5 border-t border-[color:var(--glass-border)] px-2 py-2">
        <StatsDialog>
          <NavButton icon={<BarChart3 className={iconCls} />}>Insights</NavButton>
        </StatsDialog>
        <QRCodeDialog>
          <NavButton icon={<QrCode className={iconCls} />}>Get the app</NavButton>
        </QRCodeDialog>
        <FeedbackDialog>
          <NavButton icon={<MessageSquare className={iconCls} />}>Feedback</NavButton>
        </FeedbackDialog>
        <Link to={ROUTES.SETTINGS} className={cn("nav-item", active === "settings" && "nav-item-active")}>
          <Settings className={iconCls} />
          <span className="min-w-0 flex-1 truncate">Settings</span>
        </Link>
      </div>

      <Link
        to={ROUTES.SETTINGS}
        className="flex items-center gap-2 border-t border-[color:var(--glass-border)] px-4 py-3 text-sm transition-colors hover:bg-accent/50"
        title="Account settings"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
          {isLoading ? "" : initial}
        </span>
        <span className="min-w-0 flex-1 truncate text-muted-foreground">
          {isLoading ? <span className="block h-3 w-28 animate-pulse rounded bg-muted" /> : user?.email}
        </span>
      </Link>
    </aside>
  );
};

export default HomeSidebar;
