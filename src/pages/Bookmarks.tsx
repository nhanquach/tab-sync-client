import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  Bookmark,
  ChevronRight,
  Download,
  ExternalLink,
  Folder,
  FolderOpen,
  Globe,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getBookmarkNodes, getBookmarkSnapshots } from "../clients";
import { IBookmarkRow, IBookmarkSnapshot } from "../interfaces/iBookmark";
import AppShell from "../components/AppShell";
import { DeviceChip, DevicePill } from "../components/DeviceIcon";
import {
  buildBookmarkTree,
  exportFileName,
  flattenLinks,
  hostOf,
  IBookmarkNode,
  searchLinks,
  snapshotName,
  toNetscapeHtml,
} from "../utils/bookmarks";
import { EXTENSION_PAGE } from "../utils/constants";

interface IBookmarksProps {
  user: User;
}

/** Children shown per folder before "Show more" (keeps 10k-link folders fast). */
const PAGE = 200;
/** Search results shown at once. */
const MAX_RESULTS = 300;

const timeAgo = (iso?: string | null) => {
  if (!iso) return "";
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
};
const titleCase = (s?: string | null) => (s && s !== "unknown" ? s[0].toUpperCase() + s.slice(1) : "");

const LinkRow: React.FC<{ node: IBookmarkNode; depth: number; showPath?: boolean }> = ({ node, depth, showPath }) => (
  <a
    href={node.url!}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex min-h-[36px] items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    style={{ paddingLeft: 8 + depth * 18 }}
    title={node.url!}
  >
    {/* No favicons are stored for bookmarks (and none are fetched from third parties). */}
    <Globe className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    <span className="min-w-0 flex-1">
      <span className="block truncate">{node.title || node.url}</span>
      {showPath && (
        <span className="block truncate text-[11.5px] text-muted-foreground">{node.path.join(" › ")}</span>
      )}
    </span>
    <span className="hidden max-w-[40%] shrink-0 truncate text-xs text-muted-foreground sm:block">{hostOf(node.url!)}</span>
    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
  </a>
);

interface IFolderProps {
  node: IBookmarkNode;
  depth: number;
  expanded: Set<string>;
  toggle: (id: string) => void;
}

const FolderRow: React.FC<IFolderProps> = ({ node, depth, expanded, toggle }) => {
  const open = expanded.has(node.id);
  const [limit, setLimit] = useState(PAGE);
  const Icon = open ? FolderOpen : Folder;
  const isSection = depth === 0;
  return (
    <div role="treeitem" aria-expanded={open} aria-selected={false}>
      <button
        type="button"
        onClick={() => toggle(node.id)}
        className={cn(
          "flex min-h-[36px] w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isSection && "font-semibold"
        )}
        style={{ paddingLeft: 8 + depth * 18 }}
      >
        <ChevronRight
          className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-150", open && "rotate-90")}
          aria-hidden
        />
        <Icon className={cn("h-4 w-4 shrink-0", isSection ? "text-primary-ink" : "text-muted-foreground")} aria-hidden />
        <span className="min-w-0 flex-1 truncate">{node.title || "Untitled folder"}</span>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{node.linkCount.toLocaleString()}</span>
      </button>
      {open && (
        <div role="group">
          {node.children.slice(0, limit).map((child) =>
            child.url !== null ? (
              <LinkRow key={child.id} node={child} depth={depth + 1} />
            ) : (
              <FolderRow key={child.id} node={child} depth={depth + 1} expanded={expanded} toggle={toggle} />
            )
          )}
          {node.children.length > limit && (
            <button
              type="button"
              onClick={() => setLimit((l) => l + PAGE * 5)}
              className="ml-2 rounded-md px-2 py-1.5 text-xs font-medium text-primary-ink hover:bg-accent/70"
              style={{ marginLeft: 8 + (depth + 1) * 18 }}
            >
              Show {Math.min(PAGE * 5, node.children.length - limit).toLocaleString()} more of{" "}
              {(node.children.length - limit).toLocaleString()}
            </button>
          )}
          {node.children.length === 0 && (
            <p className="py-1.5 text-xs text-muted-foreground" style={{ paddingLeft: 8 + (depth + 1) * 18 + 22 }}>
              Empty folder
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const EmptyState: React.FC = () => (
  <div className="glass rounded-xl px-6 py-14 text-center">
    <span className="icon-tile mx-auto h-10 w-10 rounded-xl" style={{ "--hue": "142" } as React.CSSProperties} aria-hidden>
      <Bookmark className="h-5 w-5" strokeWidth={2.2} />
    </span>
    <p className="mt-4 text-sm font-semibold">No bookmark backups yet</p>
    <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
      In the TabSync extension, open <span className="font-medium text-foreground">Settings › Bookmarks</span> and
      click <span className="font-medium text-foreground">Back up</span>. Folders and their order are kept. Then restore
      them into another browser with one click, or export them here as a file any browser can import, Safari included.
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

const SkeletonRows: React.FC<{ label?: string }> = ({ label }) => (
  <div className="glass space-y-2 rounded-xl p-3" aria-busy>
    {label && <p className="px-1 text-xs text-muted-foreground">{label}</p>}
    {Array.from({ length: 8 }, (_, i) => (
      <div key={i} className="flex items-center gap-2.5 px-2 py-1.5">
        <span className="shimmer h-4 w-4 rounded" />
        <span className="shimmer h-3 rounded" style={{ width: `${40 + ((i * 17) % 45)}%` }} />
      </div>
    ))}
  </div>
);

/** Bookmark backups made by the extension (read-only), per browser. */
const Bookmarks: React.FC<IBookmarksProps> = ({ user }) => {
  const [snapshots, setSnapshots] = useState<IBookmarkSnapshot[] | null>(null);
  const [selected, setSelected] = useState<string>("");
  const [rows, setRows] = useState<IBookmarkRow[] | null>(null);
  const [loaded, setLoaded] = useState(0);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  // Rows per device, so switching back is instant.
  const cache = useRef(new Map<string, IBookmarkRow[]>());
  const retried = useRef(new Set<string>());

  const loadSnapshots = useCallback(async () => {
    setError("");
    try {
      const list = await getBookmarkSnapshots();
      setSnapshots(list);
      setSelected((cur) => (cur && list.some((s) => s.device_id === cur) ? cur : list[0]?.device_id ?? ""));
      return list;
    } catch (e) {
      setSnapshots([]);
      setError(e instanceof Error ? e.message : String(e));
      return [];
    }
  }, []);

  useEffect(() => {
    loadSnapshots();
  }, [loadSnapshots]);

  const snapshot = snapshots?.find((s) => s.device_id === selected);

  // Lazy-load the selected device's nodes.
  useEffect(() => {
    if (!snapshot) return;
    const key = `${snapshot.device_id}:${snapshot.gen}:${snapshot.snapshot_at}`;
    const hit = cache.current.get(key);
    setQuery("");
    setExpanded(new Set(["root:toolbar", "root:menu", "root:other", "root:unfiled", "root:mobile"]));
    if (hit) {
      setRows(hit);
      return;
    }
    let cancelled = false;
    setRows(null);
    setLoaded(0);
    getBookmarkNodes(snapshot, (n) => !cancelled && setLoaded(n))
      .then(async (data) => {
        if (cancelled) return;
        if (data.length !== snapshot.node_count && !retried.current.has(key)) {
          retried.current.add(key);
          // Replaced by a newer backup while loading: refresh the list (re-runs this effect).
          await loadSnapshots();
          return;
        }
        cache.current.set(key, data);
        setRows(data);
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : String(e)));
    return () => {
      cancelled = true;
    };
  }, [snapshot, loadSnapshots]);

  const tree = useMemo(() => (rows ? buildBookmarkTree(rows) : []), [rows]);
  const links = useMemo(() => flattenLinks(tree), [tree]);
  const results = useMemo(() => searchLinks(links, query), [links, query]);

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const onExport = () => {
    if (!snapshot || !tree.length) return;
    const name = snapshotName(snapshot);
    const html = toNetscapeHtml(tree, `Bookmarks from ${name}`);
    const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = exportFileName(name, snapshot.snapshot_at);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <AppShell active="bookmarks" user={user}>
      <div className="flex items-end gap-3 pb-3 pt-4 md:pt-6">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">TabSync</p>
          <h1 className="text-lg font-semibold leading-7 tracking-tight">Bookmarks</h1>
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={() => {
            cache.current.clear();
            loadSnapshots();
          }}
          aria-label="Refresh backups"
          title="Refresh"
        >
          <RefreshCw className={cn("h-4 w-4", snapshots === null && "animate-spin")} />
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-3 rounded-lg border border-destructive/30 bg-destructive/[0.06] px-3 py-2 text-sm text-destructive">
          Couldn&apos;t load bookmarks: {error}
        </p>
      )}

      {snapshots === null && <SkeletonRows />}
      {snapshots !== null && snapshots.length === 0 && !error && <EmptyState />}

      {snapshots && snapshots.length > 0 && (
        <div className="space-y-3">
          {/* Device selector */}
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Browser backups">
            {snapshots.map((s) => {
              const name = snapshotName(s);
              const active = s.device_id === selected;
              return (
                <button
                  key={s.device_id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelected(s.device_id)}
                  className={cn(
                    "glass flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active && "border-[color:hsl(var(--primary-ink)/0.55)] bg-accent"
                  )}
                >
                  <DeviceChip name={name} />
                  <span className="min-w-0">
                    <span className="block max-w-[180px] truncate text-sm font-semibold">{name}</span>
                    <span className="block text-[11.5px] text-muted-foreground">
                      {[titleCase(s.devices?.browser), timeAgo(s.snapshot_at)].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <DevicePill name={name}>{s.link_count.toLocaleString()}</DevicePill>
                </button>
              );
            })}
          </div>

          {/* Search + export */}
          <div className="flex items-center gap-2">
            <label className="glass-strong focus-ring flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl px-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setQuery("")}
                placeholder={
                  snapshot ? `Search ${snapshot.link_count.toLocaleString()} bookmarks by title or URL` : "Search bookmarks"
                }
                className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                aria-label="Search bookmarks"
                disabled={!rows}
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </label>
            <button
              type="button"
              onClick={onExport}
              disabled={!rows || !tree.length}
              className="glass flex h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors hover:bg-accent/60 disabled:opacity-50"
              title="Netscape bookmark file: import it in Chrome, Edge, Firefox, Safari, Arc or any other browser"
            >
              <Download className="h-4 w-4 text-primary-ink" aria-hidden />
              <span className="hidden sm:inline">Export as HTML</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>

          {snapshot && (
            <p className="px-1 text-xs text-muted-foreground">
              Backed up {timeAgo(snapshot.snapshot_at)} from {snapshotName(snapshot)} ·{" "}
              {snapshot.link_count.toLocaleString()} bookmarks in{" "}
              {(snapshot.node_count - snapshot.link_count).toLocaleString()} folders · read-only here
            </p>
          )}

          {!rows && snapshot && (
            <SkeletonRows
              label={snapshot.node_count > 1000 ? `Loading ${loaded.toLocaleString()} of ${snapshot.node_count.toLocaleString()}…` : undefined}
            />
          )}

          {rows && query.trim() && (
            <div className="settings-group p-1.5">
              <p className="px-2 pb-1 pt-1.5 text-xs text-muted-foreground">
                {results.length === 0
                  ? "No bookmarks match. Titles and URLs are searched."
                  : results.length > MAX_RESULTS
                    ? `Showing ${MAX_RESULTS} of ${results.length.toLocaleString()} matches`
                    : `${results.length.toLocaleString()} match${results.length === 1 ? "" : "es"}`}
              </p>
              {results.slice(0, MAX_RESULTS).map((n) => (
                <LinkRow key={n.id} node={n} depth={0} showPath />
              ))}
            </div>
          )}

          {rows && !query.trim() && (
            <div className="settings-group p-1.5" role="tree" aria-label="Bookmarks">
              {tree.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">This backup has no bookmarks.</p>
              ) : (
                tree.map((section) => (
                  <FolderRow key={section.id} node={section} depth={0} expanded={expanded} toggle={toggle} />
                ))
              )}
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
};

export default Bookmarks;
