import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getOpenTabs, getArchivedTabs } from "@/clients";

// Simple helper to avoid dependency issues with lodash types
const groupBy = <T,>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      (result[groupKey] = result[groupKey] || []).push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
};

interface IStatsDialogProps {
  /** Element that opens the dialog. */
  children: React.ReactNode;
}

export const StatsDialog: React.FC<IStatsDialogProps> = ({ children }) => {
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
        getArchivedTabs(1, 1000, "", "All", "TIME"),
      ]);

      const openTabs = openRes.data || [];
      const archivedTabs = archivedRes.data || [];
      const allTabs = [...openTabs, ...archivedTabs];

      // Process Devices
      const groupedByDevice = groupBy(allTabs, "deviceName");
      const byDevice = Object.entries(groupedByDevice)
        .map(([name, tabs]) => ({
          name,
          count: tabs.length,
        }))
        .sort((a, b) => b.count - a.count);

      // Process Domains
      const domainCounts: Record<string, number> = {};
      allTabs.forEach((tab) => {
        try {
          const url = new URL(tab.url);
          const hostname = url.hostname.replace("www.", "");
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
        byDomain,
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insights</DialogTitle>
          <DialogDescription>Your tabs across every device.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
          </div>
        ) : stats ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border px-3 py-2">
                <div className="text-xl font-semibold tabular-nums">{stats.totalOpen.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Open tabs</div>
              </div>
              <div className="rounded-lg border border-border px-3 py-2">
                <div className="text-xl font-semibold tabular-nums">{stats.totalArchived.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Archived tabs</div>
              </div>
            </div>

            <section className="space-y-2">
              <h3 className="section-label">Devices</h3>
              <div className="space-y-2.5 rounded-lg border border-border p-3">
                {stats.byDevice.map((device) => (
                  <div key={device.name} className="space-y-1">
                    <div className="flex justify-between gap-2 text-sm">
                      <span className="truncate">{device.name}</span>
                      <span className="shrink-0 tabular-nums text-muted-foreground">{device.count}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary-ink"
                        style={{ width: `${(device.count / maxDeviceCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="section-label">Top sites</h3>
              <div className="settings-group">
                {stats.byDomain.map((site, idx) => (
                  <div key={site.domain} className="flex items-center gap-3 px-3 py-2 text-sm">
                    <span className="w-4 shrink-0 text-xs tabular-nums text-muted-foreground">{idx + 1}</span>
                    <span className="min-w-0 flex-1 truncate">{site.domain}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">{site.count}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">No data available</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
