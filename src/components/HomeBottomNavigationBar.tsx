import React from "react";
import { Link } from "react-router-dom";
import { Archive, Layers, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { TABS_VIEWS } from "../interfaces/iView";
import { ROUTES } from "../routes";
import type { SidebarSection } from "./HomeSidebar";

interface IHomeBottomNavigationBarProps {
  active: SidebarSection;
}

const items: { section: SidebarSection; to: string; label: string; Icon: typeof Layers }[] = [
  { section: "open", to: `${ROUTES.HOME}/${TABS_VIEWS.OPEN_TABS}`, label: "Open", Icon: Layers },
  { section: "archived", to: `${ROUTES.HOME}/${TABS_VIEWS.ARCHIVED_TABS}`, label: "Archived", Icon: Archive },
  { section: "settings", to: ROUTES.SETTINGS, label: "Settings", Icon: Settings },
];

/** Mobile bottom tab bar. Hidden on desktop. */
const HomeBottomNavigationBar: React.FC<IHomeBottomNavigationBarProps> = ({ active }) => {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Main"
    >
      <div className="grid h-14 grid-cols-3">
        {items.map(({ section, to, label, Icon }) => {
          const isActive = active === section;
          return (
            <Link
              key={section}
              to={to}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default HomeBottomNavigationBar;
