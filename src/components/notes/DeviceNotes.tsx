import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, StickyNote } from "lucide-react";

import { cn } from "@/lib/utils";
import { INote } from "../../interfaces/iNote";
import { NotesState } from "../../hooks/useNotes";
import { NOTES_PREVIEW } from "../../utils/notes";
import { ROUTES } from "../../routes";
import NoteItem from "./NoteItem";

interface IDeviceNotesProps {
  notes: INote[];
  state: Pick<NotesState, "save" | "archive">;
  className?: string;
  /** Show "<browser>:" header (notes of a browser with no tabs on this page). */
  title?: React.ReactNode;
}

/** A browser's notes under its group in the tab lists: newest few, "Show all", edit / archive. */
const DeviceNotes: React.FC<IDeviceNotesProps> = ({
  notes,
  state,
  className,
  title,
}) => {
  const [all, setAll] = useState(false);
  if (!notes.length) return null;
  const shown = all ? notes : notes.slice(0, NOTES_PREVIEW);
  return (
    <div className={cn("device-notes", className)} aria-label="Notes">
      {title}
      <div role="list">
        {shown.map((n) => (
          <NoteItem
            key={n.id}
            note={n}
            compact
            onSave={state.save}
            onArchive={state.archive}
          />
        ))}
      </div>
      {notes.length > NOTES_PREVIEW && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="note-more w-auto"
            onClick={() => setAll(!all)}
            aria-expanded={all}
          >
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                all && "rotate-180"
              )}
              aria-hidden
            />
            {all ? "Show fewer" : `Show all ${notes.length} notes`}
          </button>
          <Link to={ROUTES.NOTES} className="note-more ml-auto w-auto">
            <StickyNote className="h-3.5 w-3.5" aria-hidden />
            All notes
          </Link>
        </div>
      )}
    </div>
  );
};

export default DeviceNotes;
