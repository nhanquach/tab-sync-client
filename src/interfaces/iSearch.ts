import { ITab } from "./iTab";
import { INote } from "./iNote";

/** Result groups of the command palette's search. */
export type SearchGroup = "tabs" | "archived" | "bookmarks" | "notes";

/** A bookmark (not a folder) from one browser's latest backup. */
export interface IBookmarkHit {
  device_id: string;
  node_id: string;
  title: string;
  url: string;
  date_added: string | null;
  deviceName: string;
}

export interface INoteHit extends INote {
  deviceName: string;
}

export interface ISearchResults {
  tabs: ITab[];
  archived: ITab[];
  bookmarks: IBookmarkHit[];
  notes: INoteHit[];
  /** Groups whose request failed (shown as unavailable, others still render). */
  failed: SearchGroup[];
}
