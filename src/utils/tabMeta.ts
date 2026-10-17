import dayjs from "dayjs";

/** Hostname without the leading www., or the raw url when it doesn't parse. */
export const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/** Compact relative time: "just now", "2m ago", "3h ago", "2d ago", then a date. */
export const timeAgo = (value?: string | null) => {
  if (!value) return "";
  const t = dayjs(value);
  if (!t.isValid()) return "";
  const mins = Math.max(0, Math.round((Date.now() - t.valueOf()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return t.format(t.year() === dayjs().year() ? "MMM D" : "MMM D, YYYY");
};

/** Newest timestamp of a set of tabs. */
export const newestTimeStamp = (tabs: { timeStamp?: string | null }[]) =>
  tabs.reduce<string | undefined>((best, t) => {
    if (!t.timeStamp) return best;
    if (!best) return t.timeStamp;
    return dayjs(t.timeStamp).isAfter(dayjs(best)) ? t.timeStamp : best;
  }, undefined);

export const isPhoneDevice = (name: string) => /iphone|android|mobile|phone|ipad/i.test(name || "");
