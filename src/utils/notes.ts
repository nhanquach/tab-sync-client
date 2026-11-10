import { IArchivedNote, IPickupNote, ITabNote } from "../interfaces/iNote";

/** Same limits as the extension and the database. */
export const NOTE_ARCHIVE_CAP = 200;

/** Key a tab note the way the server does (per browser + URL). */
export const noteKey = (deviceId: string | null | undefined, url: string | null | undefined) =>
  `${deviceId ?? ""}\u0000${url ?? ""}`;

export const indexTabNotes = (notes: ITabNote[]) => {
  const map = new Map<string, ITabNote>();
  notes.forEach((n) => map.set(noteKey(n.device_id, n.url), n));
  return map;
};

/**
 * The pick-up note to pin on a device group. The web app groups tabs by device
 * name, so match by any tab's device id first, then by the device's name.
 */
export const pickupForGroup = (
  notes: IPickupNote[],
  groupName: string,
  tabs: { device_id?: string | null }[]
): IPickupNote | undefined => {
  const ids = new Set(tabs.map((t) => t.device_id).filter(Boolean));
  return notes.find((n) => ids.has(n.device_id)) ?? notes.find((n) => !!groupName && n.devices?.name === groupName);
};

/** Case-insensitive search by note, title or URL; every word must match. */
export const searchArchivedNotes = (notes: IArchivedNote[], query: string) => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return notes;
  return notes.filter((n) => {
    const haystack = `${n.body} ${n.title} ${n.url} ${n.devices?.name ?? ""}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
};
