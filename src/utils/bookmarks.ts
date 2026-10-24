import { BookmarkRoot, IBookmarkRow, IBookmarkSnapshot } from "../interfaces/iBookmark";

/** A folder or bookmark in the tree built from backup rows. */
export interface IBookmarkNode {
  id: string;
  title: string;
  url: string | null;
  dateAdded: string | null;
  children: IBookmarkNode[];
  /** Links anywhere under this folder (0 for a link). */
  linkCount: number;
  /** Folder titles from the root section down to the parent, for search results. */
  path: string[];
}

/** Root sections in display order. Firefox "Other Bookmarks" is `unfiled`. */
export const ROOT_SECTIONS: { root: BookmarkRoot; label: string }[] = [
  { root: "toolbar", label: "Bookmarks bar" },
  { root: "menu", label: "Bookmarks menu" },
  { root: "other", label: "Other bookmarks" },
  { root: "unfiled", label: "Other bookmarks" },
  { root: "mobile", label: "Mobile bookmarks" },
];

/**
 * Rows -> one folder per root section, children in their original order.
 * A row whose parent is missing is shown at the top of its section.
 */
export const buildBookmarkTree = (rows: IBookmarkRow[]): IBookmarkNode[] => {
  const ids = new Set(rows.map((r) => r.node_id));
  const childrenOf = new Map<string, IBookmarkRow[]>();
  const topOf = new Map<BookmarkRoot, IBookmarkRow[]>();
  for (const row of rows) {
    const key = row.parent_node_id && ids.has(row.parent_node_id) ? row.parent_node_id : null;
    if (key) {
      const list = childrenOf.get(key) ?? [];
      list.push(row);
      childrenOf.set(key, list);
    } else {
      const list = topOf.get(row.root) ?? [];
      list.push(row);
      topOf.set(row.root, list);
    }
  }
  const byPosition = (a: IBookmarkRow, b: IBookmarkRow) => a.position - b.position;

  const toNode = (row: IBookmarkRow, path: string[]): IBookmarkNode => {
    if (row.url !== null) {
      return { id: row.node_id, title: row.title, url: row.url, dateAdded: row.date_added, children: [], linkCount: 0, path };
    }
    const childPath = [...path, row.title || "Untitled folder"];
    const children = (childrenOf.get(row.node_id) ?? []).sort(byPosition).map((r) => toNode(r, childPath));
    return {
      id: row.node_id,
      title: row.title,
      url: null,
      dateAdded: row.date_added,
      children,
      linkCount: children.reduce((n, c) => n + (c.url !== null ? 1 : c.linkCount), 0),
      path,
    };
  };

  const sections: IBookmarkNode[] = [];
  for (const { root, label } of ROOT_SECTIONS) {
    const top = topOf.get(root);
    if (!top?.length) continue;
    const children = top.sort(byPosition).map((r) => toNode(r, [label]));
    sections.push({
      id: `root:${root}`,
      title: label,
      url: null,
      dateAdded: null,
      children,
      linkCount: children.reduce((n, c) => n + (c.url !== null ? 1 : c.linkCount), 0),
      path: [],
    });
  }
  return sections;
};

/** Every link in tree order. */
export const flattenLinks = (sections: IBookmarkNode[]): IBookmarkNode[] => {
  const out: IBookmarkNode[] = [];
  const visit = (n: IBookmarkNode) => {
    if (n.url !== null) out.push(n);
    else n.children.forEach(visit);
  };
  sections.forEach(visit);
  return out;
};

/** Case-insensitive match on title or URL; every word must match. */
export const searchLinks = (links: IBookmarkNode[], query: string): IBookmarkNode[] => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return links.filter((l) => {
    const hay = `${l.title} ${l.url}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
};

export const hostOf = (url: string) => {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url.slice(0, 60);
  }
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const addDate = (iso: string | null) => {
  const t = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(t) ? "" : ` ADD_DATE="${Math.floor(t / 1000)}"`;
};

/**
 * Netscape bookmark file: the format every browser imports (Chrome, Edge,
 * Firefox, Safari, Opera, Brave, Arc). The bookmarks bar is marked as the
 * toolbar folder, so importers that support it put it back on the toolbar.
 */
export const toNetscapeHtml = (sections: IBookmarkNode[], title = "Bookmarks"): string => {
  const lines: string[] = [
    "<!DOCTYPE NETSCAPE-Bookmark-file-1>",
    "<!-- This is an automatically generated file.",
    "     It will be read and overwritten.",
    "     DO NOT EDIT! -->",
    '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
    `<TITLE>${escapeHtml(title)}</TITLE>`,
    `<H1>${escapeHtml(title)}</H1>`,
    "<DL><p>",
  ];
  const write = (node: IBookmarkNode, depth: number, toolbar = false) => {
    const pad = "    ".repeat(depth);
    if (node.url !== null) {
      lines.push(`${pad}<DT><A HREF="${escapeHtml(node.url)}"${addDate(node.dateAdded)}>${escapeHtml(node.title || node.url)}</A>`);
      return;
    }
    const flag = toolbar ? ' PERSONAL_TOOLBAR_FOLDER="true"' : "";
    lines.push(`${pad}<DT><H3${addDate(node.dateAdded)}${flag}>${escapeHtml(node.title || "Untitled folder")}</H3>`);
    lines.push(`${pad}<DL><p>`);
    node.children.forEach((c) => write(c, depth + 1));
    lines.push(`${pad}</DL><p>`);
  };
  sections.forEach((s) => write(s, 1, s.id === "root:toolbar"));
  lines.push("</DL><p>");
  return lines.join("\n") + "\n";
};

export const snapshotName = (s: IBookmarkSnapshot) => {
  const name = (s.devices?.name ?? "").trim();
  if (name) return name;
  const b = s.devices?.browser;
  return b && b !== "unknown" ? b[0].toUpperCase() + b.slice(1) : "Unnamed browser";
};

/** "tabsync-bookmarks-macbook-pro-2026-10-24.html" */
export const exportFileName = (deviceName: string, snapshotAt: string) => {
  const d = new Date(snapshotAt);
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = Number.isNaN(d.getTime()) ? "" : `-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const slug = deviceName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "browser";
  return `tabsync-bookmarks-${slug}${date}.html`;
};
