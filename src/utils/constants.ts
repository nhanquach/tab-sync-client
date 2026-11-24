export const HOME_PAGE = "https://tab-sync-b16b4.web.app";
export const EXTENSION_PAGE =
  "https://chromewebstore.google.com/detail/tab-sync/bokjahifgpgcilgpmhmaammkjmhbmjbc";
export const FIREFOX_EXTENSION_PAGE =
  "https://addons.mozilla.org/en-US/firefox/addon/tabsync-your-tabs-everywhere/";

export function getExtensionPage(): string {
  if (typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent)) {
    return FIREFOX_EXTENSION_PAGE;
  }
  return EXTENSION_PAGE;
}

export const LAYOUT_KEY = "displayMode";
export const LAST_SAVED_DISPLAYED_BROWSERS_KEY = "lastSavedDisplayedBrowsers";
export const LAST_SAVED_ORDER_BY_KEY = "lastSavedOrderBy";

export const LAYOUT = {
  LIST: "list",
  GRID: "grid",
};

export enum ORDER {
  TIME,
  TITLE,
}
