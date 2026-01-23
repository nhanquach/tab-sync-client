import React, { useMemo } from "react";
import {
  ArchiveTwoTone,
  DeleteForeverTwoTone,
  LaptopMacTwoTone,
  PhoneIphoneTwoTone,
  DevicesOtherTwoTone,
  CheckBoxTwoTone,
  CheckBoxOutlineBlankTwoTone
} from "@mui/icons-material";

import { ITab } from "../interfaces/iTab";
import { TABS_VIEWS } from "../interfaces/iView";
import { groupBy } from "../utils/groupBy";
import UrlGridItem from "./UrlGridItem";

// Shadcn UI
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IUrlKanbanProps {
  view: string;
  urls: ITab[];
  onClear: (deviceName: string) => void;
  onSelect?: (tab: ITab) => void;
  selectedId?: number;
  isSelectionMode?: boolean;
  selectedTabIds?: Set<number>;
  onToggleTabSelection?: (id: number) => void;
  onToggleDeviceSelection?: (deviceName: string, select: boolean) => void;
  exitingTabIds?: Set<number>;
}

const UrlKanban: React.FC<IUrlKanbanProps> = ({
  urls,
  view,
  onClear,
  onSelect,
  selectedId,
  isSelectionMode,
  selectedTabIds,
  onToggleTabSelection,
  onToggleDeviceSelection,
  exitingTabIds,
}) => {
  const groupedTabs = useMemo(() => groupBy(urls, (t) => t.deviceName), [urls]);
  const devices = useMemo(() => Object.keys(groupedTabs).sort(), [groupedTabs]);

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    const className = "text-md-sys-color-primary mr-2";
    if (lower.includes("mac") || lower.includes("windows") || lower.includes("laptop"))
      return <LaptopMacTwoTone className={className} />;
    if (lower.includes("iphone") || lower.includes("android") || lower.includes("mobile"))
      return <PhoneIphoneTwoTone className={className} />;
    return <DevicesOtherTwoTone className={className} />;
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 -mx-6 px-6 h-[calc(100vh-14rem)] min-h-[500px] items-start">
      {devices.map((device) => {
        const tabs = groupedTabs[device];
        const allSelected = tabs.every(t => selectedTabIds?.has(t.id));

        return (
          <div key={device} className="flex-none w-80 flex flex-col gap-4 h-full bg-md-sys-color-surface-container-low/50 rounded-2xl p-4 border border-md-sys-color-outline-variant/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                {getIcon(device)}
                <h3 className="font-semibold text-base truncate max-w-[120px]" title={device}>
                  {device}
                </h3>
                <span className="ml-2 text-xs font-medium text-md-sys-color-on-surface-variant bg-md-sys-color-surface-container-high px-2 py-0.5 rounded-full">
                  {tabs.length}
                </span>
              </div>

              {!isSelectionMode ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onClear(device)}
                        className="h-8 w-8 text-md-sys-color-outline hover:text-md-sys-color-error hover:bg-md-sys-color-error-container/20 rounded-full"
                      >
                        {view === TABS_VIEWS.OPEN_TABS ? <ArchiveTwoTone fontSize="small" /> : <DeleteForeverTwoTone fontSize="small" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{view === TABS_VIEWS.OPEN_TABS ? "Archive all" : "Delete all"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleDeviceSelection?.(device, !allSelected)}
                  className="text-md-sys-color-primary hover:bg-md-sys-color-primary/10 rounded-full h-8 w-8"
                >
                    {allSelected ? <CheckBoxTwoTone fontSize="small" /> : <CheckBoxOutlineBlankTwoTone fontSize="small" />}
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              {tabs.map((tab) => (
                <UrlGridItem
                  key={tab.id}
                  tab={tab}
                  onSelect={() => {
                    if (isSelectionMode) {
                        onToggleTabSelection?.(tab.id);
                    } else {
                        onSelect?.(tab);
                    }
                  }}
                  isSelected={selectedId === tab.id}
                  isSelectionMode={isSelectionMode}
                  isChecked={selectedTabIds?.has(tab.id)}
                  isExiting={exitingTabIds?.has(tab.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UrlKanban;
