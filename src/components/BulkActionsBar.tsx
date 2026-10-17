import React from "react";
import { Archive, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 duration-200 animate-in fade-in slide-in-from-bottom-2 md:bottom-8">
      <div className="flex items-center gap-1 glass-strong rounded-xl py-1 pl-3 pr-1 text-popover-foreground shadow-md">
        <span className="mr-2 text-sm">
          <span className="font-semibold tabular-nums">{selectedCount}</span>
          <span className="text-muted-foreground"> selected</span>
        </span>

        {view === TABS_VIEWS.OPEN_TABS ? (
          <Button onClick={onArchiveSelected} size="sm" className="gap-1.5">
            <Archive className="h-3.5 w-3.5" />
            Archive
          </Button>
        ) : (
          <Button onClick={onDeleteSelected} size="sm" variant="destructive" className="gap-1.5">
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        )}

        <button type="button" onClick={onClearSelection} className="icon-btn" aria-label="Clear selection" title="Clear selection">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
