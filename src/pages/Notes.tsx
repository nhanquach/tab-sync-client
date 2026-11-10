import React, { useCallback, useEffect, useMemo, useState } from "react";
import { User } from "@supabase/supabase-js";
import { ExternalLink, RefreshCw, Search, StickyNote, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { deleteArchivedNote, getArchivedNotes } from "../clients";
import { IArchivedNote } from "../interfaces/iNote";
import AppShell from "../components/AppShell";
import { DeviceChip } from "../components/DeviceIcon";
import { hostOf, timeAgo } from "../utils/tabMeta";
import { NOTE_ARCHIVE_CAP, searchArchivedNotes } from "../utils/notes";
import { EXTENSION_PAGE } from "../utils/constants";

interface INotesProps {
  user: User;
}

const EmptyState: React.FC = () => (
  <div className="glass rounded-xl px-6 py-14 text-center">
    <span className="icon-tile mx-auto h-10 w-10 rounded-xl" style={{ "--hue": "172" } as React.CSSProperties} aria-hidden>
      <StickyNote className="h-5 w-5" strokeWidth={2.2} />
    </span>
    <p className="mt-4 text-sm font-semibold">No archived notes yet</p>
    <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
      In the TabSync extension, hover a tab and click the note icon to say{" "}
      <span className="font-medium text-foreground">why it&apos;s open</span>. The note shows beside the tab everywhere,
      and when the tab closes it lands here with its link, so you can find it again.
    </p>
    <a
      href={EXTENSION_PAGE}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary-ink hover:underline"
    >
      Get the extension <ExternalLink className="h-3.5 w-3.5" aria-hidden />
    </a>
  </div>
);

/** Notes of tabs that were closed (written in the extension): search, reopen the link, delete. */
const Notes: React.FC<INotesProps> = ({ user }) => {
  const [notes, setNotes] = useState<IArchivedNote[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      setNotes(await getArchivedNotes());
    } catch (e) {
      setNotes([]);
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const results = useMemo(() => searchArchivedNotes(notes ?? [], query), [notes, query]);

  const remove = async (id: number) => {
    const before = notes;
    setNotes((list) => (list ?? []).filter((n) => n.id !== id));
    try {
      await deleteArchivedNote(id);
    } catch (e) {
      setNotes(before);
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <AppShell active="notes" user={user}>
      <div className="flex items-end gap-3 pb-3 pt-4 md:pt-6">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">TabSync</p>
          <h1 className="text-lg font-semibold leading-7 tracking-tight">Notes archive</h1>
        </div>
        {notes && notes.length > 0 && (
          <span className="pb-1 text-xs text-muted-foreground">
            {notes.length} of {NOTE_ARCHIVE_CAP} kept · oldest go first
          </span>
        )}
        <button type="button" className="icon-btn" onClick={load} aria-label="Refresh notes" title="Refresh">
          <RefreshCw className={cn("h-4 w-4", notes === null && "animate-spin")} />
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-3 rounded-lg border border-destructive/30 bg-destructive/[0.06] px-3 py-2 text-sm text-destructive">
          Couldn&apos;t load notes: {error}
        </p>
      )}

      {notes === null && (
        <div className="glass space-y-3 rounded-xl p-4" aria-busy>
          {[60, 45, 70, 52].map((w, i) => (
            <div key={i} className="space-y-1.5">
              <span className="shimmer block h-3 rounded" style={{ width: `${w}%` }} />
              <span className="shimmer block h-2.5 w-1/4 rounded" />
            </div>
          ))}
        </div>
      )}

      {notes !== null && notes.length === 0 && !error && <EmptyState />}

      {notes && notes.length > 0 && (
        <div className="space-y-3">
          <label className="glass-strong focus-ring flex h-10 items-center gap-2 rounded-xl px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setQuery("")}
              placeholder={`Search ${notes.length} notes by note, title, link or browser`}
              className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Search archived notes"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </label>

          {query && (
            <p className="px-1 text-xs text-muted-foreground">
              {results.length === 0 ? "No notes match." : `${results.length} match${results.length === 1 ? "" : "es"}`}
            </p>
          )}

          <ul className="settings-group">
            {results.map((n) => {
              const device = n.devices?.name || "Removed browser";
              return (
                <li key={n.id} className="group flex items-start gap-3 px-3 py-3">
                  <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-primary-ink" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm leading-5">{n.body}</p>
                    <a
                      href={n.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block truncate text-[13px] text-foreground/80 underline-offset-2 hover:underline"
                      title={n.url}
                    >
                      {n.title || n.url}
                    </a>
                    <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                      <DeviceChip name={device} size="sm" className="h-4 w-4 rounded-[5px]" />
                      <span className="truncate">
                        {[hostOf(n.url), device, `closed ${timeAgo(n.archived_at)}`].join(" · ")}
                      </span>
                    </p>
                  </div>
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn h-7 w-7"
                    aria-label={`Reopen ${n.title || hostOf(n.url)}`}
                    title="Reopen link"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(n.id)}
                    className="icon-btn h-7 w-7 hover:text-destructive"
                    aria-label="Delete note"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </AppShell>
  );
};

export default Notes;
