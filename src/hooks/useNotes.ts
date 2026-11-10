import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getNotes } from "../clients";
import { IPickupNote, ITabNote } from "../interfaces/iNote";
import { indexTabNotes, noteKey, pickupForGroup } from "../utils/notes";

/** Don't re-read notes more often than this when tabs change in realtime. */
const MIN_REFRESH_MS = 30_000;

/**
 * Pick-up notes and tab notes for the tab lists. Notes are extra: if they can't
 * load (offline, or the database isn't migrated yet) the lists simply show none.
 */
export const useNotes = () => {
  const [pickup, setPickup] = useState<IPickupNote[]>([]);
  const [tabNotes, setTabNotes] = useState<Map<string, ITabNote>>(new Map());
  const last = useRef(0);

  const refresh = useCallback(async (force = true) => {
    if (!force && Date.now() - last.current < MIN_REFRESH_MS) return;
    last.current = Date.now();
    try {
      const notes = await getNotes();
      setPickup(notes.pickup);
      setTabNotes(indexTabNotes(notes.tabNotes));
    } catch (e) {
      console.warn("[notes] unavailable", e);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const noteFor = useCallback(
    (tab: { device_id?: string | null; url: string }) => tabNotes.get(noteKey(tab.device_id, tab.url)),
    [tabNotes]
  );
  const pickupFor = useCallback(
    (groupName: string, tabs: { device_id?: string | null }[]) => pickupForGroup(pickup, groupName, tabs),
    [pickup]
  );

  return useMemo(() => ({ pickup, noteFor, pickupFor, refresh }), [pickup, noteFor, pickupFor, refresh]);
};

export type NoteLookups = Pick<ReturnType<typeof useNotes>, "noteFor" | "pickupFor">;
