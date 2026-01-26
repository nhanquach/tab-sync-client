import React, { useState } from "react";
import {
  StorageTwoTone,
  CloudDownloadTwoTone,
  CloudUploadTwoTone,
  CheckCircleTwoTone,
  ErrorOutlineTwoTone,
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
import { getOpenTabs, getArchivedTabs, importData } from "@/clients";
import LoadingSpinner from "./LoadingSpinner";
import { ITab } from "@/interfaces/iTab";

export const DataManagementDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Fetch data (limit 1000 each as per plan)
      const [openRes, archivedRes] = await Promise.all([
        getOpenTabs(1, 1000, "", "All", "TIME"),
        getArchivedTabs(1, 1000, "", "All", "TIME"),
      ]);

      const data = {
        exportDate: new Date().toISOString(),
        openTabs: openRes.data || [],
        archivedTabs: archivedRes.data || [],
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tabsync-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (!Array.isArray(json.openTabs) && !Array.isArray(json.archivedTabs)) {
          throw new Error("Invalid file format: missing openTabs or archivedTabs arrays");
        }

        const openTabs: ITab[] = Array.isArray(json.openTabs) ? json.openTabs : [];
        const archivedTabs: ITab[] = Array.isArray(json.archivedTabs) ? json.archivedTabs : [];

        const result = await importData({ openTabs, archivedTabs });

        if (result.success) {
          setImportStatus({
            success: true,
            message: `Successfully imported ${result.importedOpenCount} open tabs and ${result.importedArchivedCount} archived tabs.`,
          });
        } else {
            setImportStatus({
                success: false,
                message: result.error || "Import failed.",
            });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to parse file.";
        setImportStatus({
          success: false,
          message: errorMessage,
        });
      } finally {
        setIsImporting(false);
        // Reset input
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Data Management"
          className="w-10 h-10 rounded-full hover:bg-md-sys-color-surface-container-high transition-all"
        >
          <StorageTwoTone className="text-md-sys-color-on-surface-variant" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "shadow-none md:shadow-2xl",
          "backdrop-blur-xl",
          "bg-white/40 border-0 md:border md:border-white/40",
          "dark:bg-black/40 dark:border-0 md:dark:border md:dark:border-white/10",
          "max-h-[85vh] overflow-y-auto sm:max-w-2xl p-0 rounded-tl-[32px] md:rounded-tl-[48px] md:rounded-tr-[16px] md:rounded-bl-[16px] md:rounded-br-[16px]"
        )}
      >
        <div className="flex flex-col min-h-[400px]">
          {/* Header Section */}
          <div className="p-8 bg-gradient-to-r from-primary/10 to-transparent border-b border-white/20 dark:border-white/10 flex flex-col items-start space-y-4">
            <div className="flex items-center gap-3">
              <StorageTwoTone className="!text-4xl text-md-sys-color-primary" />
              <DialogTitle className="text-3xl font-black tracking-tighter">
                Data Management
              </DialogTitle>
            </div>
            <DialogDescription className="text-base opacity-80 max-w-md">
              Export your data for backup or migration, or import data from a previous backup.
            </DialogDescription>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-8 flex flex-col gap-8 bg-white/30 dark:bg-black/20 backdrop-blur-sm">

            {/* Export Section */}
            <div className="space-y-4">
               <h3 className="text-lg font-bold flex items-center gap-2">
                    <CloudDownloadTwoTone className="text-md-sys-color-primary" />
                    Export Data
               </h3>
               <p className="text-sm opacity-70">
                   Download a JSON file containing your Open and Archived tabs.
               </p>
               <Button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="w-full md:w-auto"
               >
                   {isExporting ? <LoadingSpinner className="w-4 h-4 mr-2" /> : null}
                   {isExporting ? "Exporting..." : "Download Backup"}
               </Button>
            </div>

            <div className="w-full h-[1px] bg-md-sys-color-outline-variant/20" />

            {/* Import Section */}
            <div className="space-y-4">
               <h3 className="text-lg font-bold flex items-center gap-2">
                    <CloudUploadTwoTone className="text-md-sys-color-secondary" />
                    Import Data
               </h3>
               <p className="text-sm opacity-70">
                   Restore data from a backup JSON file. This will add to your existing tabs.
               </p>
               <div className="flex flex-col gap-4">
                    <div className="relative">
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            disabled={isImporting}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <Button
                            variant="outline"
                            className="w-full md:w-auto pointer-events-none" // pointer-events-none so click goes to input
                            disabled={isImporting}
                        >
                             {isImporting ? <LoadingSpinner className="w-4 h-4 mr-2" /> : null}
                             {isImporting ? "Importing..." : "Select Backup File"}
                        </Button>
                    </div>

                    {importStatus && (
                        <div className={cn(
                            "p-4 rounded-xl flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2",
                            importStatus.success
                                ? "bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                                : "bg-red-100/50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                        )}>
                            {importStatus.success ? (
                                <CheckCircleTwoTone className="w-5 h-5 shrink-0" />
                            ) : (
                                <ErrorOutlineTwoTone className="w-5 h-5 shrink-0" />
                            )}
                            <span>{importStatus.message}</span>
                        </div>
                    )}
               </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
