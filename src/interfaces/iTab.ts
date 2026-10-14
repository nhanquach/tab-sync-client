export interface ITab {
  /** Stable row id (uuid). Use this to identify a tab, never `id`. */
  uid: string;
  /** Browser tab id: only meaningful inside one browser session. */
  id: number;
  /** The browser install this tab came from; null for rows from older extension versions. */
  device_id?: string | null;
  title: string;
  url: string;
  favIconUrl: string;
  index: number;
  timeStamp: string;
  deviceName: string;
  windowId: string;
}
