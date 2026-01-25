import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import {
  CleaningServicesTwoTone,
  DeleteSweepTwoTone,
  AutoDeleteTwoTone,
  ContentCopyTwoTone,
} from "@mui/icons-material";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getOpenTabs, archiveTab, removeTab } from "@/clients";
import LoadingSpinner from "./LoadingSpinner";
import { ITab } from "@/interfaces/iTab";
import UrlListItem from "./UrlListItem";

// Helper to group by URL
const groupByUrl = (tabs: ITab[]) => {
  const groups: Record<string, ITab[]> = {};
  tabs.forEach((tab) => {
    // Normalize URL: remove trailing slash, maybe search params if we want to be aggressive
    // For safety, let's just stick to exact string match for now
    const url = tab.url;
    if (!groups[url]) groups[url] = [];
    groups[url].push(tab);
  });
  return groups;
};

export const CleanupDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allTabs, setAllTabs] = useState<ITab[]>([]);

  // State for actions
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTabs();
    }
  }, [isOpen]);

  const fetchTabs = async () => {
    setIsLoading(true);
    try {
      // Fetch open tabs (limit 1000)
      const res = await getOpenTabs(1, 1000, "", "All", "TIME");
      if (res.data) {
        setAllTabs(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch tabs", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { duplicates, staleTabs } = useMemo(() => {
    const urlGroups = groupByUrl(allTabs);
    const dups: ITab[][] = [];

    Object.values(urlGroups).forEach(group => {
      if (group.length > 1) {
        // Sort by time (newest first)
        dups.push(group.sort((a, b) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()));
      }
    });

    const thirtyDaysAgo = dayjs().subtract(30, "day");
    const stale = allTabs.filter(tab => dayjs(tab.timeStamp).isBefore(thirtyDaysAgo));

    return { duplicates: dups, staleTabs: stale };
  }, [allTabs]);

  const handleArchiveDuplicates = async () => {
    setProcessing(true);
    const tabsToArchive: ITab[] = [];

    // For each duplicate group, keep the first (newest) and archive the rest
    duplicates.forEach(group => {
      const [, ...rest] = group;
      tabsToArchive.push(...rest);
    });

    try {
        if (tabsToArchive.length > 0) {
            await archiveTab(tabsToArchive);
            await removeTab(tabsToArchive.map(t => t.id));
            await fetchTabs(); // Refresh
        }
    } catch (error) {
        console.error("Error archiving duplicates", error);
    } finally {
        setProcessing(false);
    }
  };

  const handleArchiveStale = async () => {
    setProcessing(true);
    try {
        if (staleTabs.length > 0) {
            await archiveTab(staleTabs);
            await removeTab(staleTabs.map(t => t.id));
            await fetchTabs(); // Refresh
        }
    } catch (error) {
        console.error("Error archiving stale tabs", error);
    } finally {
        setProcessing(false);
    }
  };

  const duplicateCount = duplicates.reduce((acc, group) => acc + group.length - 1, 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Cleanup Assistant"
          className="w-10 h-10 rounded-full hover:bg-md-sys-color-surface-container-high transition-all"
        >
          <CleaningServicesTwoTone className="text-md-sys-color-on-surface-variant" />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
          "shadow-none md:shadow-2xl",
          "backdrop-blur-xl",
          "bg-white/40 border-0 md:border md:border-white/40",
          "dark:bg-black/40 dark:border-0 md:dark:border md:dark:border-white/10",
          "max-h-[85vh] overflow-y-auto sm:max-w-2xl p-0 rounded-[32px]"
      )}>
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-md-sys-color-primary-container rounded-full text-md-sys-color-on-primary-container">
                    <CleaningServicesTwoTone fontSize="large" />
                </div>
                <div>
                    <DialogTitle className="text-2xl font-bold">Cleanup Assistant</DialogTitle>
                    <DialogDescription>
                        Keep your tab list organized by removing clutter.
                    </DialogDescription>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Duplicates Section */}
                    <div className="bg-md-sys-color-surface-container-low/50 rounded-2xl p-4 border border-md-sys-color-outline-variant/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-md-sys-color-primary font-semibold">
                                <ContentCopyTwoTone />
                                <span>Duplicates</span>
                            </div>
                            {duplicateCount > 0 && (
                                <Button
                                    size="sm"
                                    onClick={handleArchiveDuplicates}
                                    disabled={processing}
                                    className="bg-md-sys-color-primary text-md-sys-color-on-primary hover:bg-md-sys-color-primary/90"
                                >
                                    <DeleteSweepTwoTone className="mr-2 h-4 w-4" />
                                    Archive {duplicateCount} Duplicates
                                </Button>
                            )}
                        </div>

                        {duplicates.length === 0 ? (
                            <div className="text-center py-4 text-md-sys-color-on-surface-variant/60 text-sm">
                                No duplicate tabs found. Great job!
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                                {duplicates.map((group, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="text-xs font-medium text-md-sys-color-on-surface-variant truncate px-2">
                                            {group[0].title}
                                        </div>
                                        {group.slice(1).map(tab => (
                                             <div key={tab.id} className="opacity-70 pointer-events-none">
                                                <UrlListItem tab={tab} />
                                             </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Stale Tabs Section */}
                    <div className="bg-md-sys-color-surface-container-low/50 rounded-2xl p-4 border border-md-sys-color-outline-variant/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-md-sys-color-tertiary font-semibold">
                                <AutoDeleteTwoTone />
                                <span>Stale Tabs (&gt;30 days)</span>
                            </div>
                             {staleTabs.length > 0 && (
                                <Button
                                    size="sm"
                                    onClick={handleArchiveStale}
                                    disabled={processing}
                                    className="bg-md-sys-color-tertiary text-md-sys-color-on-tertiary hover:bg-md-sys-color-tertiary/90"
                                >
                                    <DeleteSweepTwoTone className="mr-2 h-4 w-4" />
                                    Archive {staleTabs.length} Tabs
                                </Button>
                            )}
                        </div>

                        {staleTabs.length === 0 ? (
                            <div className="text-center py-4 text-md-sys-color-on-surface-variant/60 text-sm">
                                No stale tabs found.
                            </div>
                        ) : (
                             <div className="text-sm px-2 text-md-sys-color-on-surface-variant">
                                Found {staleTabs.length} tabs that haven't been touched in over 30 days.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
