/**
 * Notes, organized by browser (extension repo: supabase/migrations/20261110_notes.sql).
 * One table, public.notes; archive is a state (archived_at).
 */
export interface INote {
  id: string;
  device_id: string;
  body: string;
  url: string | null;
  title: string | null;
  created_at: string;
  updated_at: string;
  /** null = live (on its browser's list); set = archived. */
  archived_at: string | null;
}

/** public.devices: one row per browser install (the extension registers it). */
export interface IDevice {
  id: string;
  name: string;
  browser?: string | null;
  os?: string | null;
  last_seen_at?: string | null;
}
