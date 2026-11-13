import { IDevice, INote } from "../interfaces/iNote";

/** Same limits as the extension and the database (enforced there). */
export const NOTE_MAX = 280;
export const NOTE_TITLE_MAX = 300;
export const NOTE_URL_MAX_BYTES = 2048;
export const NOTES_PER_DEVICE_CAP = 1000;
export const NOTE_ARCHIVE_CAP = 1000;
/** Notes shown under a device group in the tab lists before "Show all". */
export const NOTES_PREVIEW = 2;
export const NOTE_COLUMNS = "id,device_id,body,url,title,created_at,updated_at,archived_at";

const byteLength = (s: string) => new TextEncoder().encode(s).length;

/** A link the database accepts: http(s)/file/ftp, at most 2,048 bytes. */
export const canAttachUrl = (url: string | null | undefined): url is string =>
  !!url && /^(https?|file|ftp):\/\//i.test(url) && byteLength(url) <= NOTE_URL_MAX_BYTES;

/** "example.com/x" typed without a scheme becomes https://example.com/x. */
export const normalizeUrl = (input: string) => {
  const t = input.trim();
  if (!t) return "";
  return /^[a-z][a-z0-9+.-]*:/i.test(t) ? t : `https://${t}`;
};

/** Trim, fold newlines/tabs to spaces, cut to `max` characters (by code point, like Postgres). */
export const cleanNote = (text: string, max = NOTE_MAX) =>
  Array.from(
    text
      .replace(/[\r\n\t]+/g, " ")
      .replace(/ {2,}/g, " ")
      .trim()
  )
    .slice(0, max)
    .join("");

export const cleanTitle = (title: string | null | undefined) =>
  Array.from((title ?? "").trim())
    .slice(0, NOTE_TITLE_MAX)
    .join("");

export const charsLeft = (text: string, max = NOTE_MAX) => max - Array.from(text).length;

/** Newest first: live notes by when written, archived ones by when archived. */
export const sortNotes = (notes: INote[]) =>
  [...notes].sort((a, b) => {
    const ka = a.archived_at ?? a.created_at;
    const kb = b.archived_at ?? b.created_at;
    return kb.localeCompare(ka) || b.id.localeCompare(a.id);
  });

export const groupNotesByDevice = (notes: INote[]) => {
  const map = new Map<string, INote[]>();
  sortNotes(notes).forEach((n) => {
    const list = map.get(n.device_id);
    if (list) list.push(n);
    else map.set(n.device_id, [n]);
  });
  return map;
};

export const upsertNote = (notes: INote[], note: INote) => sortNotes([...notes.filter((n) => n.id !== note.id), note]);

/** Case-insensitive search by note, link title/URL and browser name; every word must match. */
export const searchNotes = (notes: INote[], query: string, deviceName?: (id: string) => string | undefined) => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return notes;
  return notes.filter((n) => {
    const haystack = `${n.body} ${n.title ?? ""} ${n.url ?? ""} ${deviceName?.(n.device_id) ?? ""}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
};

/** Devices newest first (by last seen); the first is the default for a new note. */
export const sortDevices = (devices: IDevice[]) =>
  [...devices].sort((a, b) => (b.last_seen_at ?? "").localeCompare(a.last_seen_at ?? ""));

export const isNoteCapError = (e: unknown) => {
  const err = e as { code?: string; message?: string } | null;
  return err?.code === "54000" || /at most 1000 notes/.test(err?.message ?? "");
};

export const noteErrorMessage = (e: unknown) =>
  isNoteCapError(e)
    ? "That browser has a lot of notes. Archive or delete a few first."
    : "Couldn't save. Check your connection and try again.";

/**
 * The device id of a tab group in the lists (the web app groups tabs by device
 * name): any tab's device_id, else the device with that name.
 */
export const deviceIdForGroup = (groupName: string, tabs: { device_id?: string | null }[], devices: IDevice[]) =>
  tabs.find((t) => t.device_id)?.device_id ?? devices.find((d) => d.name === groupName)?.id;
