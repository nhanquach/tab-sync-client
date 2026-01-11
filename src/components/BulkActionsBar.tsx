import React from "react";
import {
  ArchiveTwoTone,
  DeleteForeverTwoTone,
  CloseTwoTone
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TABS_VIEWS } from "../interfaces/iView";

interface IBulkActionsBarProps {
  selectedCount: number;
  view: TABS_VIEWS;
  onClearSelection: () => void;
  onArchiveSelected: () => void;
  onDeleteSelected: () => void;
}

const BulkActionsBar: React.FC<IBulkActionsBarProps> = ({
  selectedCount,
  view,
  onClearSelection,
  onArchiveSelected,
  onDeleteSelected,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className={cn(
      "fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-50",
      "animate-in slide-in-from-bottom-24 fade-in duration-300"
    )}>
      <div className={cn(
        "flex items-center gap-2 p-2 pr-4 pl-4",
        "bg-md-sys-color-surface-container-high/80 backdrop-blur-xl",
        "border border-md-sys-color-outline-variant/20 shadow-2xl",
        "rounded-full"
      )}>
        <div className="flex items-center gap-2 mr-2">
            <div className="bg-md-sys-color-primary/10 text-md-sys-color-primary px-3 py-1 rounded-full text-xs font-bold">
                {selectedCount}
            </div>
            <span className="text-sm font-medium text-md-sys-color-on-surface hidden xs:inline">Selected</span>
        </div>

        <div className="h-6 w-px bg-md-sys-color-outline-variant/30 mx-1" />

        {view === TABS_VIEWS.OPEN_TABS ? (
          <Button
            onClick={onArchiveSelected}
            variant="ghost"
            size="sm"
            className="rounded-full hover:bg-md-sys-color-primary/10 hover:text-md-sys-color-primary gap-2"
          >
            <ArchiveTwoTone fontSize="small" />
            <span className="hidden sm:inline">Archive</span>
          </Button>
        ) : (
             <Button
            onClick={onDeleteSelected}
            variant="ghost"
            size="sm"
            className="rounded-full hover:bg-md-sys-color-error/10 hover:text-md-sys-color-error gap-2"
          >
            <DeleteForeverTwoTone fontSize="small" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        )}

        <Button
            onClick={onClearSelection}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-md-sys-color-surface-container-highest ml-1 h-8 w-8"
        >
            <CloseTwoTone fontSize="small" />
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
