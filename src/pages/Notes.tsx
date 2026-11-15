import React, { useCallback, useEffect, useMemo, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useSearchParams } from "react-router-dom";
import { Archive, ExternalLink, Plus, RefreshCw, Search, StickyNote, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { deleteNote, getNotes, setNoteArchived } from "../clients";
import { IDevice, INote } from "../interfaces/iNote";
import AppShell from "../components/AppShell";
import { DeviceChip, DevicePill } from "../components/DeviceIcon";
import NoteEditor from "../components/notes/NoteEditor";
import NoteItem from "../components/notes/NoteItem";
import { useNotes } from "../hooks/useNotes";
import { timeAgo } from "../utils/tabMeta";
import { groupNotesByDevice, NOTE_ARCHIVE_CAP, noteErrorMessage, searchNotes } from "../utils/notes";
import { EXTENSION_PAGE } from "../utils/constants";

interface INotesProps {
  user: User;
}

type Filter = "live" | "archived";

const browserLabel = (d?: IDevice) =>
  d?.browser && d.browser !== "unknown" ? d.browser[0].toUpperCase() + d.browser.slice(1) : "";

const EmptyState: React.FC<{ archived: boolean; onWrite?: () => void; hasDevices: boolean }> = ({ archived, onWrite, hasDevices }) => (
  <div className="glass rounded-xl px-6 py-14 text-center">
    <span className="icon-tile mx-auto h-10 w-10 rounded-xl" style={{ "--hue": "172" } as React.CSSProperties} aria-hidden>
      {archived ? <Archive className="h-5 w-5" strokeWidth={2.2} /> : <StickyNote className="h-5 w-5" strokeWidth={2.2} />}
    </span>
    <p className="mt-4 text-sm font-semibold">{archived ? "No archived notes" : "No notes yet"}</p>
    <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
      {archived
        ? "Archive a note when you're done with it. It leaves its browser's list and waits here, so you can restore it or delete it for good."
        : "Notes live with a browser: where you left off, a reminder, a to-do. Write them here or in the TabSync extension, and they show under that browser everywhere."}
    </p>
    {!archived && hasDevices && onWrite && (
      <button
        type="button"
        onClick={onWrite}
        className="bg-signature mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-primary-foreground hover:opacity-90"
      >
        <Plus className="h-4 w-4" aria-hidden /> Write a note
      </button>
    )}
    {!archived && !hasDevices && (
      <a
        href={EXTENSION_PAGE}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary-ink hover:underline"
      >
        Get the extension <ExternalLink className="h-3.5 w-3.5" aria-hidden />
      </a>
    )}
  </div>
);

/** All notes, grouped by browser: search, write (pick the browser), edit, archive; Archived filter to restore / delete. */
const Notes: React.FC<INotesProps> = ({ user }) => {
  const state = useNotes();
  const [filter, setFilter] = useState<Filter>("live");
  const [query, setQuery] = useState("");
  const [archived, setArchived] = useState<INote[] | null>(null);
  const [error, setError] = useState("");
  /** Device the composer writes for: null = closed. */
  const [composeFor, setComposeFor] = useState<string | null>(null);

  const loadArchived = useCallback(async () => {
    setError("");
    try {
      setArchived(await getNotes({ archived: true }));
    } catch (e) {
      setArchived([]);
      setError(e instanceof Error ? e.message : String((e as { message?: string })?.message ?? e));
    }
  }, []);

  useEffect(() => {
    if (filter === "archived" && archived === null) loadArchived();
  }, [filter, archived, loadArchived]);

  const refresh = () => {
    state.refresh();
    if (filter === "archived") loadArchived();
  };

  const list = useMemo(() => (filter === "live" ? state.notes : archived ?? []), [filter, state.notes, archived]);
  const results = useMemo(() => searchNotes(list, query, state.deviceName), [list, query, state.deviceName]);
  const groups = useMemo(() => {
    const byDevice = groupNotesByDevice(results);
    // Known browsers newest first, then notes of browsers no longer listed.
    const order = [...state.devices.map((d) => d.id), ...Array.from(byDevice.keys())];
    return Array.from(new Set(order))
      .filter((id) => byDevice.has(id))
      .map((id) => ({ id, device: state.devices.find((d) => d.id === id), notes: byDevice.get(id)! }));
  }, [results, state.devices]);

  const defaultDevice = state.devices[0]?.id ?? null;

  // From the command palette: "?focus=<id>[&archived=1]" scrolls to a note and flashes it;
  // "?new=1" opens the composer. Params are dropped once handled.
  const [searchParams, setSearchParams] = useSearchParams();
  const focusParam = searchParams.get("focus");
  const archivedParam = searchParams.get("archived") === "1";
  const newParam = searchParams.get("new") === "1";
  const [focusId, setFocusId] = useState<string | null>(null);
  const dropParams = useCallback(
    (...keys: string[]) => {
      const next = new URLSearchParams(searchParams);
      keys.forEach((k) => next.delete(k));
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );
  useEffect(() => {
    if (!focusParam) return;
    setFocusId(focusParam);
    setQuery("");
    setComposeFor(null);
    setFilter(archivedParam ? "archived" : "live");
    if (archivedParam) setArchived(null); // reload so the note is there
    dropParams("focus", "archived");
  }, [focusParam, archivedParam, dropParams]);
  useEffect(() => {
    if (!newParam || !state.ready) return;
    if (defaultDevice) {
      setFilter("live");
      setQuery("");
      setComposeFor(defaultDevice);
    }
    dropParams("new");
  }, [newParam, state.ready, defaultDevice, dropParams]);

  /** Restore / delete in the archive: drop from the list, put back if refused. */
  const drop = (fn: (n: INote) => Promise<unknown>) => async (note: INote) => {
    const before = archived;
    setArchived((prev) => (prev ?? []).filter((n) => n.id !== note.id));
    try {
      await fn(note);
    } catch (e) {
      setArchived(before);
      setError(noteErrorMessage(e));
    }
  };
  const restore = drop(async (n) => {
    await setNoteArchived(n.id, false);
    state.refresh();
  });
  const remove = drop((n) => deleteNote(n.id));
  const archive = async (n: INote) => {
    try {
      await state.archive(n);
      setArchived(null); // reload the archive next time it's opened
    } catch (e) {
      setError(noteErrorMessage(e));
    }
  };


  const unavailable = state.failed;
  const loading = filter === "live" ? !state.ready && !state.failed : archived === null;

  useEffect(() => {
    if (!focusId) return;
    const el = document.querySelector<HTMLElement>(`[data-note-id="${CSS.escape(focusId)}"]`);
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    el.classList.remove("note-focus");
    void el.offsetWidth; // restart the flash
    el.classList.add("note-focus");
    setFocusId(null);
  }, [focusId, groups, loading]);
  const total = filter === "live" ? state.notes.length : archived?.length ?? 0;

  return (
    <AppShell active="notes" user={user}>
      <div className="flex items-end gap-3 pb-3 pt-4 md:pt-6">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">TabSync</p>
          <h1 className="text-lg font-semibold leading-7 tracking-tight">Notes</h1>
        </div>
        <button type="button" className="icon-btn" onClick={refresh} aria-label="Refresh notes" title="Refresh">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </button>
        {!unavailable && filter === "live" && state.devices.length > 0 && (
          <button
            type="button"
            onClick={() => setComposeFor(composeFor ? null : defaultDevice)}
            className="bg-signature inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" aria-hidden /> New note
          </button>
        )}
      </div>

      {unavailable && (
        <div className="glass rounded-xl px-6 py-12 text-center text-sm text-muted-foreground">
          Notes aren&apos;t switched on for your account yet. Check back after the next update.
        </div>
      )}

      {!unavailable && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="glass-strong focus-ring flex h-10 min-w-[220px] flex-1 items-center gap-2 rounded-xl px-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setQuery("")}
                placeholder={filter === "live" ? "Search notes, links and browsers" : "Search archived notes"}
                className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                aria-label="Search notes"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </label>
            <div className="glass-strong flex h-10 items-center rounded-xl p-1" role="tablist" aria-label="Filter notes">
              {(["live", "archived"] as Filter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => {
                    setFilter(f);
                    setComposeFor(null);
                  }}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-colors",
                    filter === f ? "bg-primary/45 text-primary-foreground dark:bg-primary/20 dark:text-primary-ink" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f === "live" ? <StickyNote className="h-3.5 w-3.5" aria-hidden /> : <Archive className="h-3.5 w-3.5" aria-hidden />}
                  {f === "live" ? "Notes" : "Archived"}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/[0.06] px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {(query || (filter === "archived" && total > 0)) && !loading && (
            <p className="px-1 text-xs text-muted-foreground">
              {query
                ? results.length === 0
                  ? "No notes match."
                  : `${results.length} match${results.length === 1 ? "" : "es"}`
                : `${total.toLocaleString()} of ${NOTE_ARCHIVE_CAP.toLocaleString()} kept · oldest go first`}
            </p>
          )}

          {composeFor && filter === "live" && (
            <div className="glass rounded-xl p-2">
              <NoteEditor
                label="New note"
                placeholder="Where you left off, a reminder, a to-do…"
                saveLabel="Add"
                devices={state.devices}
                deviceId={composeFor}
                onDeviceChange={setComposeFor}
                onSave={async (text, link) => {
                  await state.add(composeFor, text, link);
                  setComposeFor(null);
                }}
                onCancel={() => setComposeFor(null)}
              />
            </div>
          )}

          {loading && (
            <div className="glass space-y-3 rounded-xl p-4" aria-busy>
              {[60, 45, 70, 52].map((w, i) => (
                <div key={i} className="space-y-1.5">
                  <span className="shimmer block h-3 rounded" style={{ width: `${w}%` }} />
                  <span className="shimmer block h-2.5 w-1/4 rounded" />
                </div>
              ))}
            </div>
          )}

          {!loading && total === 0 && !composeFor && (
            <EmptyState
              archived={filter === "archived"}
              hasDevices={state.devices.length > 0}
              onWrite={() => setComposeFor(defaultDevice)}
            />
          )}

          {!loading &&
            groups.map(({ id, device, notes }) => {
              const name = device?.name || "Removed browser";
              return (
                <section key={id} className="glass rounded-xl p-1" aria-label={`Notes on ${name}`}>
                  <div className="flex h-10 items-center gap-2.5 px-2">
                    <DeviceChip name={name} />
                    <span className="min-w-0 truncate text-sm font-semibold">{name}</span>
                    <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                      {[browserLabel(device), device?.last_seen_at ? timeAgo(device.last_seen_at) : ""].filter(Boolean).join(" · ")}
                    </span>
                    <DevicePill name={name}>{notes.length}</DevicePill>
                    {filter === "live" && device && (
                      <button
                        type="button"
                        className="icon-btn h-7 w-7"
                        onClick={() => setComposeFor(id)}
                        aria-label={`New note for ${name}`}
                        title={`New note for ${name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div role="list">
                    {notes.map((n) =>
                      filter === "live" ? (
                        <NoteItem key={n.id} note={n} onSave={state.save} onArchive={archive} />
                      ) : (
                        <NoteItem key={n.id} note={n} onRestore={restore} onDelete={remove} />
                      )
                    )}
                  </div>
                </section>
              );
            })}
        </div>
      )}
    </AppShell>
  );
};

export default Notes;
