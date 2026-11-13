import { useCallback, useEffect, useMemo, useState } from "react";

import { addNote, getDevices, getNotes, getNotesCount, setNoteArchived, updateNote } from "../clients";
import { IDevice, INote } from "../interfaces/iNote";
import { deviceIdForGroup, groupNotesByDevice, sortDevices, upsertNote } from "../utils/notes";

export interface INoteLink {
  url: string;
  title?: string | null;
}

/**
 * Live notes of every browser + the user's devices, with add / edit / archive.
 * Notes are extra: if they can't load (offline, or the database isn't migrated
 * yet) `ready` stays false and the lists render as before.
 */
export const useNotes = () => {
  const [notes, setNotes] = useState<INote[] | null>(null);
  const [devices, setDevices] = useState<IDevice[]>([]);
  const [failed, setFailed] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [live, devs] = await Promise.all([getNotes(), getDevices().catch(() => [] as IDevice[])]);
      setNotes(live);
      setDevices(sortDevices(devs));
      setFailed(false);
      notesAvailable = Promise.resolve(true);
    } catch (e) {
      console.warn("[notes] unavailable", e);
      setNotes(null);
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const byDevice = useMemo(() => groupNotesByDevice(notes ?? []), [notes]);

  const deviceName = useCallback(
    (id: string) => devices.find((d) => d.id === id)?.name || "Another browser",
    [devices]
  );

  /** Notes for a tab group in the lists (grouped by device name). */
  const notesForGroup = useCallback(
    (groupName: string, tabs: { device_id?: string | null }[]) => {
      const id = deviceIdForGroup(groupName, tabs, devices);
      return id ? { deviceId: id, notes: byDevice.get(id) ?? [] } : undefined;
    },
    [byDevice, devices]
  );

  const add = useCallback(async (deviceId: string, body: string, link: INoteLink | null) => {
    const saved = await addNote({ deviceId, body, url: link?.url, title: link?.title });
    setNotes((prev) => upsertNote(prev ?? [], saved));
    return saved;
  }, []);

  const save = useCallback(async (note: INote, body: string, link: INoteLink | null) => {
    const saved = await updateNote(note.id, { body, url: link?.url ?? null, title: link?.title ?? null });
    setNotes((prev) => upsertNote(prev ?? [], saved));
  }, []);

  /** Optimistic: the note leaves the list, and comes back if the server refuses. */
  const archive = useCallback(async (note: INote) => {
    setNotes((prev) => (prev ?? []).filter((n) => n.id !== note.id));
    try {
      await setNoteArchived(note.id, true);
    } catch (e) {
      setNotes((prev) => upsertNote(prev ?? [], note));
      throw e;
    }
  }, []);

  return useMemo(
    () => ({ ready: notes !== null, failed, notes: notes ?? [], devices, byDevice, deviceName, notesForGroup, refresh, add, save, archive }),
    [notes, failed, devices, byDevice, deviceName, notesForGroup, refresh, add, save, archive]
  );
};

/**
 * Is the notes table there (migration run)? One cheap HEAD request per page
 * load, shared by every caller. Navigation hides the Notes entry until it is.
 */
let notesAvailable: Promise<boolean> | null = null;
export const checkNotesAvailable = () => {
  if (!notesAvailable) {
    notesAvailable = getNotesCount()
      .then(() => true)
      .catch(() => {
        notesAvailable = null; // try again on the next page
        return false;
      });
  }
  return notesAvailable;
};

export const useNotesAvailable = () => {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let alive = true;
    checkNotesAvailable().then((ok) => alive && setAvailable(ok));
    return () => {
      alive = false;
    };
  }, []);
  return available;
};

export type NotesState = ReturnType<typeof useNotes>;
