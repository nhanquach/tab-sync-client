/** Notes written in the extension (see supabase/migrations/20261110_notes.sql in the extension repo). */

/** public.device_notes: one pick-up note per browser. */
export interface IPickupNote {
  device_id: string;
  body: string;
  updated_at: string;
  devices?: { name?: string | null } | null;
}

/** public.tab_notes: "why is this open", keyed by browser + URL. */
export interface ITabNote {
  device_id: string;
  url: string;
  title: string;
  body: string;
  updated_at: string;
}

/** public.tab_note_archive: the note of a tab that was closed (newest 200 kept). */
export interface IArchivedNote {
  id: number;
  device_id: string | null;
  url: string;
  title: string;
  body: string;
  noted_at: string;
  archived_at: string;
  devices?: { name?: string | null; browser?: string | null } | null;
}
