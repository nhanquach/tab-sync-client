import React, { useEffect, useState } from "react";
import {
  BarChartTwoTone,
  PieChartTwoTone,
  DevicesTwoTone,
  PublicTwoTone,
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
import LoadingSpinner from "./LoadingSpinner";
import { ITab } from "@/interfaces/iTab";

// Simple helper to avoid dependency issues with lodash types
const groupBy = <T,>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {} as Record<string, T[]>);
};

export const StatsDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<{
    totalOpen: number;
    totalArchived: number;
    byDevice: { name: string; count: number }[];
    byDomain: { domain: string; count: number }[];
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Fetch all tabs (limit 1000 to be safe, though 200 is current limit)
      const [openRes, archivedRes] = await Promise.all([
        getOpenTabs(1, 1000, "", "All", "TIME"),
        getArchivedTabs(1, 1000, "", "All", "TIME")
      ]);

      const openTabs = openRes.data || [];
      const archivedTabs = archivedRes.data || [];
      const allTabs = [...openTabs, ...archivedTabs];

      // Process Devices
      const groupedByDevice = groupBy(allTabs, 'deviceName');
      const byDevice = Object.entries(groupedByDevice).map(([name, tabs]) => ({
        name,
        count: tabs.length
      })).sort((a, b) => b.count - a.count);

      // Process Domains
      const domainCounts: Record<string, number> = {};
      allTabs.forEach(tab => {
        try {
            const url = new URL(tab.url);
            const hostname = url.hostname.replace('www.', '');
            domainCounts[hostname] = (domainCounts[hostname] || 0) + 1;
        } catch {
            // Ignore invalid URLs
        }
      });

      const byDomain = Object.entries(domainCounts)
        .map(([domain, count]) => ({ domain, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5

      setStats({
        totalOpen: openTabs.length,
        totalArchived: archivedTabs.length,
        byDevice,
        byDomain
      });

    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setIsLoading(false);
    }
  };

  const maxDeviceCount = stats?.byDevice[0]?.count || 1;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="View Insights"
          className="w-10 h-10 rounded-full hover:bg-md-sys-color-surface-container-high transition-all"
        >
          <BarChartTwoTone className="text-md-sys-color-on-surface-variant" />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
          "shadow-none md:shadow-2xl",
          "backdrop-blur-xl",
          "bg-white/40 border-0 md:border md:border-white/40",
          "dark:bg-black/40 dark:border-0 md:dark:border md:dark:border-white/10",
          "max-h-[85vh] overflow-y-auto sm:max-w-5xl p-0 rounded-tl-[32px] md:rounded-tl-[48px] md:rounded-tr-[16px] md:rounded-bl-[16px] md:rounded-br-[16px]"
      )}>
        <div className="flex flex-col md:flex-row min-h-[450px]">
           {/* Left Column (Hero) */}
           <div className="flex-1 p-6 md:p-10 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border-r border-white/20 dark:border-white/10 flex flex-col justify-center items-start space-y-6 md:space-y-8 relative overflow-hidden shrink-0">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

                <div className="flex items-center gap-2 transform -rotate-12 transition-transform hover:rotate-0 duration-500 origin-bottom-left">
                  <PieChartTwoTone className="!text-6xl md:!text-8xl opacity-80 text-md-sys-color-primary" />
                </div>

                <div className="space-y-4 z-10">
                  <DialogTitle className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                    Insights <span className="inline-block hover:animate-pulse">📊</span>
                  </DialogTitle>
                  <DialogDescription className="text-lg md:text-xl font-medium opacity-90 max-w-sm text-foreground">
                    An overview of your digital footprint across all devices.
                  </DialogDescription>
                </div>

                {stats && (
                    <div className="flex gap-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                        <div>
                            <div className="text-4xl font-bold text-md-sys-color-primary">{stats.totalOpen}</div>
                            <div className="text-sm font-medium opacity-60 uppercase tracking-wide">Open Tabs</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-md-sys-color-secondary">{stats.totalArchived}</div>
                            <div className="text-sm font-medium opacity-60 uppercase tracking-wide">Archived</div>
                        </div>
                    </div>
                )}
           </div>

           {/* Right Column (Details) */}
           <div className="flex-1 p-6 md:p-10 flex flex-col relative bg-white/30 dark:bg-black/20 backdrop-blur-sm shrink-0 overflow-y-auto">
               {isLoading ? (
                   <div className="flex-1 flex items-center justify-center">
                       <LoadingSpinner />
                   </div>
               ) : stats ? (
                   <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                       {/* Devices Section */}
                       <div className="space-y-4">
                           <div className="flex items-center gap-2 text-md-sys-color-primary font-semibold text-sm uppercase tracking-wider">
                               <DevicesTwoTone fontSize="small" />
                               <span>Devices</span>
                           </div>
                           <div className="space-y-3">
                               {stats.byDevice.map((device, idx) => (
                                   <div key={device.name} className="space-y-1">
                                       <div className="flex justify-between text-sm">
                                           <span className="font-medium">{device.name}</span>
                                           <span className="opacity-60">{device.count}</span>
                                       </div>
                                       <div className="h-2 w-full bg-md-sys-color-surface-container-high rounded-full overflow-hidden">
                                           <div
                                                className="h-full bg-md-sys-color-primary rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${(device.count / maxDeviceCount) * 100}%`, transitionDelay: `${idx * 100}ms` }}
                                           />
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>

                       {/* Top Sites Section */}
                       <div className="space-y-4">
                           <div className="flex items-center gap-2 text-md-sys-color-tertiary font-semibold text-sm uppercase tracking-wider">
                               <PublicTwoTone fontSize="small" />
                               <span>Top Sites</span>
                           </div>
                           <div className="grid grid-cols-1 gap-2">
                               {stats.byDomain.map((site, idx) => (
                                   <div
                                        key={site.domain}
                                        className="flex items-center justify-between p-3 rounded-xl bg-md-sys-color-surface-container-low/50 border border-md-sys-color-outline-variant/10 hover:bg-md-sys-color-surface-container-low transition-colors"
                                   >
                                       <div className="flex items-center gap-3 min-w-0">
                                           <div className="w-6 h-6 rounded-full bg-md-sys-color-primary/10 flex items-center justify-center text-xs font-bold text-md-sys-color-primary">
                                               {idx + 1}
                                           </div>
                                           <span className="truncate font-medium text-sm">{site.domain}</span>
                                       </div>
                                       <div className="text-sm font-bold opacity-60">
                                           {site.count}
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                   </div>
               ) : (
                   <div className="flex-1 flex items-center justify-center opacity-50">
                       No data available
                   </div>
               )}
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
