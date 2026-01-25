import React, { useState } from "react";
import {
  FileDownloadTwoTone,
  DataObjectTwoTone,
  TableViewTwoTone,
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

export const ExportDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllTabs = async (): Promise<ITab[]> => {
    setIsLoading(true);
    try {
      // Fetch all tabs (limit 1000 each to cover most use cases)
      const [openRes, archivedRes] = await Promise.all([
        getOpenTabs(1, 1000, "", "All", "TIME"),
        getArchivedTabs(1, 1000, "", "All", "TIME"),
      ]);

      const openTabs = (openRes.data || []).map(t => ({ ...t, status: 'open' }));
      const archivedTabs = (archivedRes.data || []).map(t => ({ ...t, status: 'archived' }));

      return [...openTabs, ...archivedTabs];
    } catch (error) {
      console.error("Failed to fetch tabs for export", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = async () => {
    const tabs = await fetchAllTabs();
    if (tabs.length === 0) return;

    const jsonContent = JSON.stringify(tabs, null, 2);
    const fileName = `tabsync_export_${new Date().toISOString().split("T")[0]}.json`;
    downloadFile(jsonContent, fileName, "application/json");
    setIsOpen(false);
  };

  const handleExportCSV = async () => {
    const tabs = await fetchAllTabs();
    if (tabs.length === 0) return;

    // CSV Header
    const headers = ["ID", "Title", "URL", "Device", "Date", "Status"];
    const rows = tabs.map((t) => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`, // Escape quotes
      `"${t.url}"`,
      t.deviceName,
      t.timeStamp,
      // @ts-expect-error adding status for export
      t.status || "unknown"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");

    const fileName = `tabsync_export_${new Date().toISOString().split("T")[0]}.csv`;
    downloadFile(csvContent, fileName, "text/csv");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Export Data"
          className="w-10 h-10 rounded-full hover:bg-md-sys-color-surface-container-high transition-all"
        >
          <FileDownloadTwoTone className="text-md-sys-color-on-surface-variant" />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
          "shadow-2xl backdrop-blur-xl",
          "bg-white/80 dark:bg-black/80 border border-white/20 dark:border-white/10",
          "sm:max-w-md p-6 rounded-[28px]"
      )}>
        <div className="space-y-6">
            <div className="space-y-2">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <FileDownloadTwoTone className="text-md-sys-color-primary" />
                    Export Data
                </DialogTitle>
                <DialogDescription>
                    Download a copy of your tabs. You can use this for backups or to migrate your data.
                </DialogDescription>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                    <LoadingSpinner />
                    <span className="text-sm text-muted-foreground animate-pulse">Preparing your data...</span>
                </div>
            ) : (
                <div className="grid gap-3">
                    <Button
                        variant="outline"
                        className="h-16 justify-start px-4 gap-4 hover:bg-md-sys-color-secondary-container hover:text-md-sys-color-on-secondary-container hover:border-transparent transition-all group"
                        onClick={handleExportJSON}
                    >
                        <div className="p-2 bg-md-sys-color-surface-container-high rounded-lg group-hover:bg-white/20 transition-colors">
                            <DataObjectTwoTone />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="font-semibold text-base">JSON Format</span>
                            <span className="text-xs opacity-70">Best for backups and developers</span>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-16 justify-start px-4 gap-4 hover:bg-md-sys-color-tertiary-container hover:text-md-sys-color-on-tertiary-container hover:border-transparent transition-all group"
                        onClick={handleExportCSV}
                    >
                        <div className="p-2 bg-md-sys-color-surface-container-high rounded-lg group-hover:bg-white/20 transition-colors">
                            <TableViewTwoTone />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="font-semibold text-base">CSV Format</span>
                            <span className="text-xs opacity-70">Readable in Excel or Google Sheets</span>
                        </div>
                    </Button>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
