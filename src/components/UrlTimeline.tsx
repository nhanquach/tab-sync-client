import React, { useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { CalendarMonthTwoTone } from "@mui/icons-material";

import { ITab } from "../interfaces/iTab";
import { TABS_VIEWS } from "../interfaces/iView";
import UrlListItem from "./UrlListItem";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

interface IUrlTimelineProps {
  view: TABS_VIEWS;
  onClear: (deviceName: string) => void;
  urls: ITab[];
  onSelect?: (tab: ITab) => void;
  selectedId?: number;
  isSelectionMode?: boolean;
  selectedTabIds?: Set<number>;
  onToggleTabSelection?: (id: number) => void;
  onToggleDeviceSelection?: (deviceName: string, select: boolean) => void;
  exitingTabIds?: Set<number>;
}

const UrlTimeline: React.FC<IUrlTimelineProps> = ({
  urls,
  onSelect,
  selectedId,
  isSelectionMode,
  selectedTabIds,
  onToggleTabSelection,
  exitingTabIds
}) => {
  const groupedTabs = useMemo(() => {
    const groups: Record<string, ITab[]> = {
      Today: [],
      Yesterday: [],
      "Last 7 Days": [],
      "Last 30 Days": [],
      Older: [],
    };

    urls.forEach((tab) => {
      const date = dayjs(tab.timeStamp);
      if (date.isToday()) {
        groups["Today"].push(tab);
      } else if (date.isYesterday()) {
        groups["Yesterday"].push(tab);
      } else if (date.isAfter(dayjs().subtract(7, "day"))) {
        groups["Last 7 Days"].push(tab);
      } else if (date.isAfter(dayjs().subtract(30, "day"))) {
        groups["Last 30 Days"].push(tab);
      } else {
        groups["Older"].push(tab);
      }
    });

    // Remove empty groups and sort correctly
    const result: { title: string; tabs: ITab[] }[] = [];
    const order = ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "Older"];

    order.forEach(key => {
        if (groups[key].length > 0) {
            result.push({ title: key, tabs: groups[key] });
        }
    });

    return result;
  }, [urls]);

  return (
    <div className="space-y-8 my-4 relative">
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-md-sys-color-outline-variant/20 -z-10 hidden sm:block" />

        {groupedTabs.map((group) => (
            <div key={group.title} className="relative animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Header */}
                <div className="flex items-center gap-4 mb-3 sticky top-[72px] bg-md-sys-color-surface/95 backdrop-blur-sm z-10 py-2 -mx-2 px-2 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-md-sys-color-secondary-container flex items-center justify-center shrink-0 border-4 border-md-sys-color-surface shadow-sm">
                        <CalendarMonthTwoTone className="text-md-sys-color-on-secondary-container text-[20px]" />
                    </div>
                    <h3 className="text-lg font-bold text-md-sys-color-primary flex items-center gap-2">
                        {group.title}
                        <span className="text-xs font-medium text-md-sys-color-on-surface-variant bg-md-sys-color-surface-container-high px-2 py-0.5 rounded-full">
                            {group.tabs.length}
                        </span>
                    </h3>
                </div>

                {/* List */}
                <div className="space-y-2 pl-0 sm:pl-14">
                    {group.tabs.map((tab) => (
                         <div key={tab.id} className="bg-md-sys-color-surface rounded-[16px] shadow-sm border border-md-sys-color-outline-variant/10 overflow-hidden hover:shadow-md transition-shadow">
                            <UrlListItem
                                tab={tab}
                                onSelect={() => {
                                    if (isSelectionMode) {
                                        onToggleTabSelection?.(tab.id);
                                    } else {
                                        onSelect?.(tab);
                                    }
                                }}
                                isSelected={tab.id === selectedId}
                                isSelectionMode={isSelectionMode}
                                isChecked={selectedTabIds?.has(tab.id)}
                                isExiting={exitingTabIds?.has(tab.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
  );
};

export default UrlTimeline;
