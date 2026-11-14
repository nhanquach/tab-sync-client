import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  BarChart3,
  Bookmark,
  ExternalLink,
  Layers,
  Link2,
  Loader2,
  Monitor,
  Moon,
  Plus,
  Settings,
  StickyNote,
  Sun,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { getPaletteDevices, searchEverything } from "../clients";
import { IDevice } from "../interfaces/iNote";
import { ISearchResults, SearchGroup } from "../interfaces/iSearch";
import { TABS_VIEWS } from "../interfaces/iView";
import { ROUTES } from "../routes";
import { useNotesAvailable } from "../hooks/useNotes";
import { setColorMode, useAppearance } from "../theme/appearance";
import { hostOf, timeAgo } from "../utils/tabMeta";
import { highlightParts, matchesAllWords, parsePaletteQuery, SEARCH_MIN_CHARS } from "../utils/search";
import Favicon from "./Favicon";
import { DeviceChip } from "./DeviceIcon";
import { noteSnippet } from "../utils/noteMarkdown";

/** A command a page adds to the palette (refresh, layout, sort, …). */
export interface IPaletteCommand {
  id: string;
  label: string;
  icon: React.ReactNode;
  /** Extra words that should find it ("grid", "list"). */
  keywords?: string;
  shortcut?: string;
  run: () => void;
}

interface ICommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  /** Text to start with when opened (e.g. ">"). */
  initialQuery?: string;
  /** Commands of the current page, shown first. */
  pageCommands?: IPaletteCommand[];
  /** Device names on the current page (Home), merged with the account's browsers. */
  devices?: string[];
  /** When the page can filter by device in place (Home); otherwise device commands navigate there. */
  onSelectDevice?: (device: string) => void;
  /** Opens Insights. */
  onOpenInsights?: () => void;
}

const DEBOUNCE_MS = 200;
const MIXED_COMMANDS_MAX = 5;

const EMPTY_RESULTS: ISearchResults = { tabs: [], archived: [], bookmarks: [], notes: [], failed: [] };

const GROUP_LABEL: Record<SearchGroup, string> = {
  tabs: "Open tabs",
  archived: "Archived tabs",
  bookmarks: "Bookmarks",
  notes: "Notes",
};

/** Title with the matched words marked. */
const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => (
  <>
    {highlightParts(text, query).map((p, i) =>
      p.hit ? (
        <mark key={i} className="palette-mark">
          {p.text}
        </mark>
      ) : (
        <React.Fragment key={i}>{p.text}</React.Fragment>
      )
    )}
  </>
);

/** Device name + host, right-aligned and quiet. */
const Meta: React.FC<{ device?: string; host?: string; when?: string }> = ({ device, host, when }) => (
  <span className="hidden min-w-0 max-w-[45%] shrink-0 items-center gap-1.5 text-xs text-muted-foreground sm:flex">
    {host && <span className="truncate">{host}</span>}
    {device && (
      <span className="inline-flex min-w-0 items-center gap-1">
        {host && <span aria-hidden>·</span>}
        <DeviceChip name={device} size="sm" className="h-4 w-4" />
        <span className="truncate">{device}</span>
      </span>
    )}
    {when && <span className="hidden shrink-0 md:inline">· {when}</span>}
  </span>
);

/** Phone: host and device on a second line under the title (the right column is hidden). */
const PhoneMeta: React.FC<{ parts: (string | undefined)[] }> = ({ parts }) => {
  const text = parts.filter(Boolean).join(" · ");
  return text ? <span className="block truncate text-xs text-muted-foreground sm:hidden">{text}</span> : null;
};

const openInNewTab = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

/**
 * The command center (Ctrl/⌘ K, or the ⌘ button): searches open tabs on every
 * device, archived tabs, bookmark backups and notes on the server as you type,
 * and runs commands. Start with ">" for commands only.
 */
const CommandPalette: React.FC<ICommandPaletteProps> = ({
  isOpen,
  setIsOpen,
  initialQuery = "",
  pageCommands = [],
  devices: pageDevices,
  onSelectDevice,
  onOpenInsights,
}) => {
  const navigate = useNavigate();
  const notesAvailable = useNotesAvailable();
  const { mode } = useAppearance();

  const [input, setInput] = useState("");
  const [selected, setSelected] = useState("");
  const [results, setResults] = useState<ISearchResults>(EMPTY_RESULTS);
  const [searchedFor, setSearchedFor] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountDevices, setAccountDevices] = useState<IDevice[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const narrow = typeof window !== "undefined" && window.matchMedia?.("(max-width: 639px)").matches;

  const { commandsOnly, query } = parsePaletteQuery(input);
  const searching = !commandsOnly && query.length >= SEARCH_MIN_CHARS;

  // Ctrl/⌘ K anywhere toggles the palette.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen]);

  // Fresh state each time it opens; browser names for the device commands.
  useEffect(() => {
    if (!isOpen) {
      abortRef.current?.abort();
      return;
    }
    setInput(initialQuery);
    setResults(EMPTY_RESULTS);
    setSearchedFor("");
    getPaletteDevices()
      .then(setAccountDevices)
      .catch(() => setAccountDevices([]));
  }, [isOpen, initialQuery]);

  // Server search, debounced; an older request is cancelled when the query changes.
  useEffect(() => {
    if (!isOpen) return;
    abortRef.current?.abort();
    if (!searching) {
      setLoading(false);
      setResults(EMPTY_RESULTS);
      setSearchedFor("");
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = window.setTimeout(async () => {
      const found = await searchEverything(query, { notes: notesAvailable, signal: controller.signal });
      if (controller.signal.aborted) return;
      setResults(found);
      setSearchedFor(query);
      setLoading(false);
    }, DEBOUNCE_MS);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [isOpen, searching, query, notesAvailable]);

  const close = useCallback(() => setIsOpen(false), [setIsOpen]);
  const run = useCallback(
    (fn: () => unknown) => {
      close();
      fn();
    },
    [close]
  );

  const goDevice = useCallback(
    (name: string) => {
      if (onSelectDevice) onSelectDevice(name);
      else navigate(`${ROUTES.HOME}/${TABS_VIEWS.OPEN_TABS}?device=${encodeURIComponent(name)}`);
    },
    [navigate, onSelectDevice]
  );

  // Every command, grouped; filtered locally (they're a handful).
  const commandGroups = useMemo(() => {
    const deviceNames = Array.from(new Set([...(pageDevices ?? []), ...accountDevices.map((d) => d.name)].filter(Boolean)));
    const nav: IPaletteCommand[] = [
      { id: "go-open", label: "Go to Open tabs", icon: <Layers />, keywords: "home tabs", run: () => navigate(`${ROUTES.HOME}/${TABS_VIEWS.OPEN_TABS}`) },
      { id: "go-archived", label: "Go to Archived tabs", icon: <Archive />, keywords: "closed history", run: () => navigate(`${ROUTES.HOME}/${TABS_VIEWS.ARCHIVED_TABS}`) },
      ...(notesAvailable
        ? [{ id: "go-notes", label: "Go to Notes", icon: <StickyNote />, keywords: "memo", run: () => navigate(ROUTES.NOTES) }]
        : []),
      { id: "go-bookmarks", label: "Go to Bookmarks", icon: <Bookmark />, keywords: "backup favorites", run: () => navigate(ROUTES.BOOKMARKS) },
      ...(onOpenInsights
        ? [{ id: "go-insights", label: "Open Insights", icon: <BarChart3 />, keywords: "stats statistics", run: onOpenInsights }]
        : []),
      { id: "go-settings", label: "Go to Settings", icon: <Settings />, keywords: "account preferences password", run: () => navigate(ROUTES.SETTINGS) },
    ];
    const notes: IPaletteCommand[] = notesAvailable
      ? [{ id: "new-note", label: "New note", icon: <Plus />, keywords: "write add note", run: () => navigate(`${ROUTES.NOTES}?new=1`) }]
      : [];
    const devices: IPaletteCommand[] = deviceNames.length
      ? [
          { id: "device-all", label: "Show tabs from all devices", icon: <Layers />, keywords: "filter device browser", run: () => goDevice("All") },
          ...deviceNames.map((name) => ({
            id: `device-${name}`,
            label: `Show tabs from ${name}`,
            icon: <DeviceChip name={name} size="sm" className="h-4 w-4" />,
            keywords: "filter device browser",
            run: () => goDevice(name),
          })),
        ]
      : [];
    const theme: IPaletteCommand[] = (
      [
        { m: "light", label: "Theme: Light", icon: <Sun /> },
        { m: "dark", label: "Theme: Dark", icon: <Moon /> },
        { m: "system", label: "Theme: Match system", icon: <Monitor /> },
      ] as const
    )
      .filter((t) => t.m !== mode)
      .map((t) => ({ id: `theme-${t.m}`, label: t.label, icon: t.icon, keywords: "appearance color mode", run: () => setColorMode(t.m) }));

    return [
      { heading: "Actions", items: [...notes, ...pageCommands] },
      { heading: "Go to", items: nav },
      { heading: "Devices", items: devices },
      { heading: "Appearance", items: theme },
    ];
  }, [pageDevices, accountDevices, notesAvailable, onOpenInsights, navigate, goDevice, mode, pageCommands]);

  const visibleCommands = useMemo(() => {
    const groups = commandGroups
      .map((g) => ({ ...g, items: g.items.filter((c) => matchesAllWords(`${c.label} ${c.keywords ?? ""}`, query)) }))
      .filter((g) => g.items.length);
    if (commandsOnly || !query) return groups;
    // Mixed with search results: just the best few commands, in one group.
    const flat = groups.flatMap((g) => g.items).slice(0, MIXED_COMMANDS_MAX);
    return flat.length ? [{ heading: "Commands", items: flat }] : [];
  }, [commandGroups, commandsOnly, query]);

  const showResults = searching && searchedFor !== "";
  const stale = loading && showResults;

  // Values in render order, to keep the first row selected as results arrive.
  const firstValue = useMemo(() => {
    if (showResults) {
      if (visibleCommands[0]) return `cmd:${visibleCommands[0].items[0].id}`.toLowerCase();
      if (results.tabs[0]) return `tab:${results.tabs[0].uid}`;
      if (results.archived[0]) return `archived:${results.archived[0].uid}`;
      if (results.bookmarks[0]) return `bookmark:${results.bookmarks[0].device_id}:${results.bookmarks[0].node_id}`.toLowerCase();
      if (results.notes[0]) return `note:${results.notes[0].id}`;
    }
    return visibleCommands[0] ? `cmd:${visibleCommands[0].items[0].id}`.toLowerCase() : "";
  }, [showResults, results, visibleCommands]);

  useEffect(() => {
    setSelected(firstValue);
  }, [firstValue]);

  const openNote = useCallback(
    (id: string, archived: boolean) => navigate(`${ROUTES.NOTES}?focus=${encodeURIComponent(id)}${archived ? "&archived=1" : ""}`),
    [navigate]
  );

  // ⌘/Ctrl+Enter on a note opens its link instead of the Notes page.
  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" || !(e.metaKey || e.ctrlKey) || !selected.startsWith("note:")) return;
    const note = results.notes.find((n) => `note:${n.id}` === selected);
    if (note?.url) {
      e.preventDefault();
      e.stopPropagation();
      run(() => openInNewTab(note.url!));
    }
  };

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      commandProps={{ shouldFilter: false, value: selected, onValueChange: setSelected, loop: true, label: "Command palette" }}
    >
      <CommandInput
        value={input}
        onValueChange={setInput}
        onKeyDown={onInputKeyDown}
        placeholder={narrow ? "Search everything, or > for commands" : "Search tabs, bookmarks and notes, or type > for commands"}
        aria-label="Search everything or run a command"
        endAdornment={
          loading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" aria-label="Searching" />
          ) : commandsOnly ? (
            <span className="palette-badge">Commands</span>
          ) : null
        }
      />
      <CommandList className={cn("palette-list", stale && "opacity-70")}>
        {!loading && (!searching || showResults) && (
          <CommandEmpty>{query ? `No matches for “${query}”` : "No commands"}</CommandEmpty>
        )}

        {!commandsOnly && query && query.length < SEARCH_MIN_CHARS && (
          <p className="px-4 pb-1 pt-3 text-xs text-muted-foreground">Type {SEARCH_MIN_CHARS}+ characters to search tabs, bookmarks and notes.</p>
        )}

        {visibleCommands.map((g, gi) => (
          <React.Fragment key={g.heading}>
            {gi > 0 && <CommandSeparator />}
            <CommandGroup heading={g.heading}>
              {g.items.map((c) => (
                <CommandItem key={c.id} value={`cmd:${c.id}`.toLowerCase()} onSelect={() => run(c.run)}>
                  <span className="palette-icon">{c.icon}</span>
                  <span className="min-w-0 flex-1 truncate">
                    <Highlight text={c.label} query={query} />
                  </span>
                  {c.shortcut && <CommandShortcut>{c.shortcut}</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}

        {showResults && (
          <>
            {results.tabs.length > 0 && (
              <>
                {visibleCommands.length > 0 && <CommandSeparator />}
                <CommandGroup heading={GROUP_LABEL.tabs}>
                  {results.tabs.map((t) => (
                    <CommandItem key={t.uid} value={`tab:${t.uid}`} onSelect={() => run(() => openInNewTab(t.url))}>
                      <Favicon src={t.favIconUrl} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">
                          <Highlight text={t.title || t.url} query={query} />
                        </span>
                        <PhoneMeta parts={[hostOf(t.url), t.deviceName]} />
                      </span>
                      <Meta host={hostOf(t.url)} device={t.deviceName} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {results.archived.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading={GROUP_LABEL.archived}>
                  {results.archived.map((t) => (
                    <CommandItem key={t.uid} value={`archived:${t.uid}`} onSelect={() => run(() => openInNewTab(t.url))}>
                      <Favicon src={t.favIconUrl} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">
                          <Highlight text={t.title || t.url} query={query} />
                        </span>
                        <PhoneMeta parts={[hostOf(t.url), t.deviceName, timeAgo(t.timeStamp)]} />
                      </span>
                      <Meta host={hostOf(t.url)} device={t.deviceName} when={timeAgo(t.timeStamp)} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {results.bookmarks.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading={GROUP_LABEL.bookmarks}>
                  {results.bookmarks.map((b) => (
                    <CommandItem
                      key={`${b.device_id}:${b.node_id}`}
                      value={`bookmark:${b.device_id}:${b.node_id}`.toLowerCase()}
                      onSelect={() => run(() => openInNewTab(b.url))}
                    >
                      <span className="palette-icon">
                        <Bookmark />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">
                          <Highlight text={b.title || b.url} query={query} />
                        </span>
                        <PhoneMeta parts={[hostOf(b.url), b.deviceName]} />
                      </span>
                      <Meta host={hostOf(b.url)} device={b.deviceName} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {results.notes.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading={GROUP_LABEL.notes}>
                  {results.notes.map((n) => (
                    <CommandItem key={n.id} value={`note:${n.id}`} onSelect={() => run(() => openNote(n.id, !!n.archived_at))}>
                      <span className="palette-icon">{n.archived_at ? <Archive /> : <StickyNote />}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">
                          <Highlight text={noteSnippet(n.body, query)} query={query} />
                        </span>
                        {n.url && (
                          <span className="flex min-w-0 items-center gap-1 text-xs text-primary-ink">
                            <Link2 className="!h-3 !w-3 shrink-0" aria-hidden />
                            <span className="truncate">
                              <Highlight text={n.title || hostOf(n.url)} query={query} />
                            </span>
                          </span>
                        )}
                        <PhoneMeta parts={[n.deviceName, n.archived_at ? "archived" : undefined]} />
                      </span>
                      <Meta device={n.deviceName} when={n.archived_at ? "archived" : undefined} />
                      {n.url && (
                        <button
                          type="button"
                          className="icon-btn h-7 w-7 shrink-0"
                          aria-label="Open the note's link"
                          title="Open link (⌘↵)"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            run(() => openInNewTab(n.url!));
                          }}
                        >
                          <ExternalLink className="!h-3.5 !w-3.5" />
                        </button>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {results.failed.length > 0 && (
              <p className="px-4 py-2 text-xs text-muted-foreground" role="status">
                {results.failed.map((g) => GROUP_LABEL[g]).join(", ")} couldn&apos;t be searched right now.
              </p>
            )}
          </>
        )}
      </CommandList>
      <div className="palette-footer" aria-hidden>
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> move
        </span>
        <span>
          <kbd>↵</kbd> open
        </span>
        {notesAvailable && (
          <span>
            <kbd>⌘↵</kbd> note link
          </span>
        )}
        <span>
          <kbd>&gt;</kbd> commands
        </span>
        <span className="ml-auto">
          <kbd>esc</kbd> close
        </span>
      </div>
    </CommandDialog>
  );
};

export default CommandPalette;
