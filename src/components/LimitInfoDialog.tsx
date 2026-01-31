import React, { useEffect, useState } from "react";
import { DataUsageTwoTone, CloudSyncTwoTone, ArchiveTwoTone } from "@mui/icons-material";

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
  const [counts, setCounts] = useState<{ open: number; archived: number } | null>(null);

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
          "bg-white/80 border border-white/40",
          "dark:bg-black/80 dark:border-white/10",
          "max-w-md p-0 rounded-3xl overflow-hidden"
        )}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-full bg-md-sys-color-primary/10 flex items-center justify-center mx-auto mb-4">
               <DataUsageTwoTone className="text-md-sys-color-primary text-3xl" />
            </div>
            <DialogTitle className="text-2xl font-bold">Usage Limits</DialogTitle>
            <DialogDescription className="text-md opacity-80 max-w-sm mx-auto">
              To keep this service free for everyone, we limit the number of tabs you can sync.
            </DialogDescription>
          </div>

          {/* Usage Bars */}
          <div className="space-y-6 bg-md-sys-color-surface-container-low/50 p-4 rounded-xl border border-md-sys-color-outline-variant/10">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : counts ? (
              <>
                {/* Open Tabs */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <div className="flex items-center gap-2 text-md-sys-color-primary">
                        <CloudSyncTwoTone fontSize="small" />
                        <span>Open Tabs</span>
                    </div>
                    <span className={cn(
                        counts.open >= TAB_LIMITS.OPEN_TABS ? "text-red-500 font-bold" : "opacity-70"
                    )}>
                      {counts.open} / {TAB_LIMITS.OPEN_TABS}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-md-sys-color-surface-container-high rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-1000 ease-out", getProgressColor(counts.open, TAB_LIMITS.OPEN_TABS))}
                      style={{ width: `${Math.min((counts.open / TAB_LIMITS.OPEN_TABS) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Archived Tabs */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <div className="flex items-center gap-2 text-md-sys-color-secondary">
                        <ArchiveTwoTone fontSize="small" />
                        <span>Archived Tabs</span>
                    </div>
                    <span className={cn(
                         counts.archived >= TAB_LIMITS.ARCHIVED_TABS ? "text-red-500 font-bold" : "opacity-70"
                    )}>
                      {counts.archived} / {TAB_LIMITS.ARCHIVED_TABS}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-md-sys-color-surface-container-high rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-1000 ease-out", getProgressColor(counts.archived, TAB_LIMITS.ARCHIVED_TABS))}
                      style={{ width: `${Math.min((counts.archived / TAB_LIMITS.ARCHIVED_TABS) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
                <div className="text-center opacity-50 text-sm py-4">Unable to load usage data.</div>
            )}
          </div>

          <div className="text-xs text-center opacity-50 px-4">
              These limits help us maintain performance and availability for all users.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
