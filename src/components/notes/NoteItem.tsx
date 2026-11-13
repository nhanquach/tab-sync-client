import React, { useState } from "react";
import { Archive, Link2, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { INote } from "../../interfaces/iNote";
import { INoteLink } from "../../hooks/useNotes";
import { hostOf, timeAgo } from "../../utils/tabMeta";
import NoteEditor from "./NoteEditor";

interface INoteItemProps {
  note: INote;
  onSave?: (note: INote, text: string, link: INoteLink | null) => Promise<void>;
  onArchive?: (note: INote) => Promise<void>;
  onRestore?: (note: INote) => Promise<void>;
  onDelete?: (note: INote) => Promise<void>;
  /** Shown before the time (e.g. the browser in search results). */
  label?: string;
  compact?: boolean;
}

/** One note (same look as the extension): text, optional link, time; actions on hover / focus. */
const NoteItem: React.FC<INoteItemProps> = ({ note, onSave, onArchive, onRestore, onDelete, label, compact }) => {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  if (editing && onSave) {
    return (
      <div className="px-1 py-1">
        <NoteEditor
          initial={note.body}
          initialLink={note.url ? { url: note.url, title: note.title } : null}
          label="Edit note"
          onSave={async (text, link) => {
            await onSave(note, text, link);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  const act = (fn?: (n: INote) => Promise<void>) => async () => {
    if (!fn) return;
    setBusy(true);
    try {
      await fn(note);
    } catch (e) {
      console.error(e);
      setBusy(false);
    }
  };

  const when = note.archived_at ? `archived ${timeAgo(note.archived_at)}` : timeAgo(note.created_at);

  return (
    <div className={cn("note-item", busy && "opacity-50")} role="listitem">
      <div className="min-w-0 flex-1">
        <p className={cn("break-words text-sm leading-5", compact && "line-clamp-2")} title={note.body}>
          {note.body}
        </p>
        <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs leading-4 text-muted-foreground">
          {note.url && (
            <a href={note.url} target="_blank" rel="noopener noreferrer" className="note-link min-w-0" title={note.url}>
              <Link2 className="h-3 w-3 shrink-0" aria-hidden />
              <span className="truncate">{note.title || hostOf(note.url)}</span>
            </a>
          )}
          <span className="shrink-0 whitespace-nowrap">
            {note.url ? "· " : ""}
            {label ? `${label} · ` : ""}
            {when}
          </span>
        </div>
      </div>
      <div className="note-actions">
        {onSave && (
          <button type="button" className="icon-btn h-7 w-7" onClick={() => setEditing(true)} disabled={busy} aria-label="Edit note" title="Edit">
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
        {onArchive && (
          <button type="button" className="icon-btn h-7 w-7" onClick={act(onArchive)} disabled={busy} aria-label="Archive note" title="Archive">
            <Archive className="h-3.5 w-3.5" />
          </button>
        )}
        {onRestore && (
          <button type="button" className="icon-btn h-7 w-7" onClick={act(onRestore)} disabled={busy} aria-label="Restore note" title="Restore">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className="icon-btn h-7 w-7 hover:text-destructive"
            onClick={act(onDelete)}
            disabled={busy}
            aria-label="Delete note"
            title="Delete for good"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteItem;
