import React from "react";
import { User } from "@supabase/supabase-js";

import { cn } from "@/lib/utils";
import HomeSidebar, { SidebarSection } from "./HomeSidebar";
import HomeAppBar from "./HomeAppBar";
import HomeBottomNavigationBar from "./HomeBottomNavigationBar";

interface IAppShellProps {
  active: SidebarSection;
  user?: User;
  isLoading?: boolean;
  activeCount?: number;
  devices?: string[];
  selectedDevice?: string;
  onSelectDevice?: (device: string) => void;
  /** Optional right-hand panel on desktop (e.g. tab details). */
  aside?: React.ReactNode;
  children: React.ReactNode;
}

/** Desktop: slim sidebar + centred content column. Mobile: top bar + bottom tabs. */
const AppShell: React.FC<IAppShellProps> = ({ aside, children, ...sidebar }) => {
  return (
    <div className="min-h-screen bg-background text-foreground md:flex">
      <HomeSidebar {...sidebar} />
      <HomeAppBar user={sidebar.user} isLoading={sidebar.isLoading} />

      <main className="min-w-0 flex-1">
        <div className={cn("mx-auto w-full max-w-[960px] px-4 pb-24 md:px-8 md:pb-12")}>{children}</div>
      </main>

      {aside}

      <HomeBottomNavigationBar active={sidebar.active} />
    </div>
  );
};

export default AppShell;
