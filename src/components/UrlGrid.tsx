import React from "react";
// @ts-expect-error no types for this lib
import groupBy from "lodash.groupby";

import { ArchiveTwoTone, DeleteForeverTwoTone } from "@mui/icons-material";

import { ITab } from "../interfaces/iTab";
import { TABS_VIEWS } from "../interfaces/iView";
import UrlGridItem from "./UrlGridItem";

// Shadcn UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface IUrlGridProps {
  view: TABS_VIEWS;
  onClear: (deviceName: string) => void;
  urls: ITab[];
}

const UrlGrid: React.FC<IUrlGridProps> = ({ onClear, urls, view }) => {
  const groupByBrowser = groupBy(urls, "deviceName");
  const browsers = Object.keys(groupByBrowser);

  return (
    <div className="space-y-6 my-4">
      {browsers.map((name) => {
        const tabs = groupByBrowser[name];
        return (
          <Card
            key={name}
            className={cn(
              "w-full transition-all duration-300",
              // Glassmorphism Styles matching SignIn.tsx and UrlList.tsx
              "backdrop-blur-xl bg-white/40 border border-white/40",
              "dark:bg-black/40 dark:border-white/10",
              "shadow-sm"
            )}
          >
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-white/20 dark:border-white/5 mb-4">
              <CardTitle className="text-lg font-medium">
                {name || "Unknown ¯\\_(ツ)_/¯ "}
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onClear(name)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      {view === "open_tabs" && <ArchiveTwoTone />}
                      {view === "archived_tabs" && <DeleteForeverTwoTone />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{view === "open_tabs" ? "Archive tabs" : "Clear"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tabs.map((tab: ITab) => {
                  return <UrlGridItem key={tab.id} tab={tab} />;
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UrlGrid;
