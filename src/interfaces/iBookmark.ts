/** Source browser root a bookmark lives under (see supabase/migrations/20261024_bookmarks.sql in the extension repo). */
export type BookmarkRoot = "toolbar" | "other" | "mobile" | "menu" | "unfiled";

/** One row of public.bookmarks: a bookmark (url set) or a folder (url null). */
export interface IBookmarkRow {
  node_id: string;
  parent_node_id: string | null;
  root: BookmarkRoot;
  position: number;
  title: string;
  url: string | null;
  date_added: string | null;
}

/** One browser's latest backup (public.bookmark_snapshots + its device). */
export interface IBookmarkSnapshot {
  device_id: string;
  gen: number;
  snapshot_at: string;
  node_count: number;
  link_count: number;
  devices?: { name?: string | null; browser?: string | null; os?: string | null } | null;
}
