import React from "react";
import { CloudSyncTwoTone, ArchiveTwoTone } from "@mui/icons-material";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import QRCode from "./QRCode";
import DownloadCard from "./CardDownload";
import CardShare from "./CardShare";
import { TABS_VIEWS } from "../interfaces/iView";
import { ROUTES } from "../routes";

interface IHomeSidebarProps {
  view: string;
}

const sidebarWidth = 240;

const HomeSidebar: React.FC<IHomeSidebarProps> = ({ view }) => {
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen border-r bg-background",
        "hidden md:flex flex-col"
      )}
      style={{ width: sidebarWidth }}
    >
      <div className="flex-1 overflow-y-auto pt-2 px-2 pb-4">
        <nav className="flex flex-col gap-2">
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start h-auto py-3 px-4",
              view === TABS_VIEWS.OPEN_TABS && "bg-accent text-accent-foreground"
            )}
          >
            <Link to={`${ROUTES.HOME}/${TABS_VIEWS.OPEN_TABS}`}>
              <CloudSyncTwoTone sx={{ fontSize: 30 }} className="mr-4" />
              <span className="text-base font-normal">Open tabs</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start h-auto py-3 px-4",
              view === TABS_VIEWS.ARCHIVED_TABS && "bg-accent text-accent-foreground"
            )}
          >
            <Link to={`${ROUTES.HOME}/${TABS_VIEWS.ARCHIVED_TABS}`}>
              <ArchiveTwoTone sx={{ fontSize: 30 }} className="mr-4" />
              <span className="text-base font-normal">Archived tabs</span>
            </Link>
          </Button>
        </nav>

        <div className="my-2 border-t" />

        <div className="px-2">
          <DownloadCard small />
        </div>

        <div className="flex justify-center my-4">
            <div className="w-[200px]">
                <QRCode width={200} height={200} text="TabSync on your phone" />
            </div>
        </div>

        <div className="px-2">
          <CardShare small />
        </div>
      </div>
    </aside>
  );
};

export default HomeSidebar;
