import { EXTENSION_PAGE, FIREFOX_EXTENSION_PAGE } from "./constants";

/** Store URL matching the current browser (Firefox -> AMO, otherwise Chrome Web Store). */
export function getExtensionPage(): string {
  if (typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent)) {
    return FIREFOX_EXTENSION_PAGE;
  }
  return EXTENSION_PAGE;
}
