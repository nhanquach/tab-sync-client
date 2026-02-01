import React, { useEffect, useState } from "react";
import {
  DataUsageTwoTone,
  CloudSyncTwoTone,
  ArchiveTwoTone,
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
import { getOpenTabs, getArchivedTabs } from "@/clients";
import { TAB_LIMITS } from "@/clients/constants";
import LoadingSpinner from "./LoadingSpinner";

export const LimitInfoDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [counts, setCounts] = useState<{ open: number; archived: number } | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      fetchCounts();
    }
  }, [isOpen]);

  const fetchCounts = async () => {
    setIsLoading(true);
    try {
      // Fetch only 1 item to get the exact count
      const [openRes, archivedRes] = await Promise.all([
        getOpenTabs(1, 1),
        getArchivedTabs(1, 1),
      ]);

      setCounts({
        open: openRes.count || 0,
        archived: archivedRes.count || 0,
      });
    } catch (error) {
      console.error("Failed to fetch limit counts", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Usage Limits"
          className="w-10 h-10 rounded-full hover:bg-md-sys-color-surface-container-high transition-all"
        >
          <DataUsageTwoTone className="text-md-sys-color-on-surface-variant" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "shadow-none md:shadow-2xl",
          "backdrop-blur-xl",
          "bg-white/40 border-0 md:border md:border-white/40",
          "dark:bg-black/40 dark:border-0 md:dark:border md:dark:border-white/10",
          "max-h-[85vh] overflow-y-auto sm:max-w-5xl p-0 rounded-tl-[32px] md:rounded-tl-[48px] md:rounded-tr-[16px] md:rounded-bl-[16px] md:rounded-br-[16px]"
        )}
      >
        <div className="flex flex-col md:flex-row min-h-[450px]">
          {/* Left Column (Hero) */}
          <div className="flex-1 p-6 md:p-10 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border-r border-white/20 dark:border-white/10 flex flex-col justify-center items-start space-y-6 md:space-y-8 relative overflow-hidden shrink-0">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

            <div className="flex items-center gap-2 transform -rotate-12 transition-transform hover:rotate-0 duration-500 origin-bottom-left">
              <DataUsageTwoTone className="!text-6xl md:!text-8xl opacity-80 text-md-sys-color-primary" />
            </div>

            <div className="space-y-4 z-10">
              <DialogTitle className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                Usage Limits{" "}
                <span className="inline-block hover:animate-pulse">📉</span>
              </DialogTitle>
              <DialogDescription className="text-lg md:text-xl font-medium opacity-90 max-w-sm text-foreground">
                To keep this service free for everyone, we limit the number of tabs you can sync.
              </DialogDescription>
            </div>

            <div className="text-xs font-medium opacity-60 uppercase tracking-wide mt-auto">
                Fair Usage Policy
            </div>
          </div>

          {/* Right Column (Details) */}
          <div className="flex-1 p-6 md:p-10 flex flex-col relative bg-white/30 dark:bg-black/20 backdrop-blur-sm shrink-0 overflow-y-auto justify-center">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : counts ? (
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                {/* Open Tabs */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3 text-md-sys-color-primary">
                            <div className="p-2 rounded-full bg-md-sys-color-primary-container text-md-sys-color-on-primary-container">
                                <CloudSyncTwoTone />
                            </div>
                            <span className="font-bold text-lg">Open Tabs</span>
                        </div>
                        <div className="text-right">
                            <span className={cn(
                                "text-2xl font-black",
                                counts.open >= TAB_LIMITS.OPEN_TABS ? "text-red-500" : "text-md-sys-color-on-surface"
                            )}>
                                {counts.open}
                            </span>
                            <span className="text-sm font-medium opacity-50 ml-1">
                                / {TAB_LIMITS.OPEN_TABS}
                            </span>
                        </div>
                    </div>
                    <div className="h-3 w-full bg-md-sys-color-surface-container-high rounded-full overflow-hidden">
                        <div
                        className={cn("h-full rounded-full transition-all duration-1000 ease-out", getProgressColor(counts.open, TAB_LIMITS.OPEN_TABS))}
                        style={{ width: `${Math.min((counts.open / TAB_LIMITS.OPEN_TABS) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Archived Tabs */}
                <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3 text-md-sys-color-secondary">
                             <div className="p-2 rounded-full bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container">
                                <ArchiveTwoTone />
                            </div>
                            <span className="font-bold text-lg">Archived Tabs</span>
                        </div>
                        <div className="text-right">
                             <span className={cn(
                                "text-2xl font-black",
                                counts.archived >= TAB_LIMITS.ARCHIVED_TABS ? "text-red-500" : "text-md-sys-color-on-surface"
                            )}>
                                {counts.archived}
                            </span>
                             <span className="text-sm font-medium opacity-50 ml-1">
                                / {TAB_LIMITS.ARCHIVED_TABS}
                            </span>
                        </div>
                    </div>
                    <div className="h-3 w-full bg-md-sys-color-surface-container-high rounded-full overflow-hidden">
                        <div
                        className={cn("h-full rounded-full transition-all duration-1000 ease-out", getProgressColor(counts.archived, TAB_LIMITS.ARCHIVED_TABS))}
                        style={{ width: `${Math.min((counts.archived / TAB_LIMITS.ARCHIVED_TABS) * 100, 100)}%` }}
                        />
                    </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center opacity-50">
                Unable to load usage data.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
