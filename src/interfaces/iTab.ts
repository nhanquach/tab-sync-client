export interface ITab {
  /** Stable row id (uuid). Use this to identify a tab, never `id`. */
  uid: string;
  /** Browser tab id: only meaningful inside one browser session. */
  id: number;
  /** The browser install this tab came from; null for rows from older extension versions. */
  device_id?: string | null;
  title: string;
  url: string;
  /**
   * http(s) or data: URL. Null on the server when a data: icon was moved to the
   * `favicons` table (see favicon_hash); the client fills it in for display.
   */
  favIconUrl: string;
  /** md5 of the data: favicon stored in `favicons`, when the row's icon lives there. */
  favicon_hash?: string | null;
  index: number;
  timeStamp: string;
  deviceName: string;
  windowId: string;
}
