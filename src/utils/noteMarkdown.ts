/**
 * Markdown in notes: the safety rules and a plain-text view, kept free of React
 * and of the Markdown parser so they can be unit tested and reused anywhere
 * (search rows, tooltips). The renderer is components/notes/NoteMarkdown.tsx.
 *
 * Kept in step with the extension (tab-sync-extension src/sync/noteMarkdown.ts).
 */

/** The only link schemes a note may open. Everything else renders as plain text. */
export const NOTE_LINK_PROTOCOLS = ["http:", "https:", "mailto:"] as const;

/**
 * A link a note may open, or null. Only absolute http(s)/mailto URLs pass:
 * javascript:, data:, vbscript:, file:, chrome-extension:, relative and #hash
 * links all return null. Control characters and whitespace (used to smuggle a
 * scheme, as in "java\tscript:") are refused outright.
 */
export const safeHref = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const t = url.trim();
  // eslint-disable-next-line no-control-regex
  if (!t || /[\u0000-\u0020\u007f-\u009f]/.test(t)) return null;
  const m = /^([a-z][a-z0-9+.-]*):/i.exec(t);
  if (!m) return null;
  const scheme = `${m[1].toLowerCase()}:`;
  return (NOTE_LINK_PROTOCOLS as readonly string[]).includes(scheme) ? t : null;
};

/** react-markdown's urlTransform: unsafe URLs become '' (the renderer then shows text, not a link). */
export const noteUrlTransform = (url: string) => safeHref(url) ?? "";

/**
 * A note's Markdown as plain text, for one-line snippets (search results, the
 * command palette) and tooltips: syntax is dropped, the words stay. Not a full
 * parser; good enough that rows never show raw "**", "#", "- [ ]" or "](url)".
 */
export const markdownToPlain = (md: string) => {
  // Backslash escapes (\* \# \_ ...) are literal text: park them so no rule below eats them.
  const escaped: string[] = [];
  const plain = md
    .replace(/\\([\\`*_{}[\]()#+\-.!|~<>])/g, (_, ch: string) => {
      escaped.push(ch);
      return `\uE000${escaped.length - 1}\uE001`;
    })
    .replace(/\r\n?/g, "\n")
    // Fenced code: drop the fence lines, keep the code.
    .replace(/^[ \t]*(```|~~~)[^\n]*$/gm, "")
    // Block syntax at the start of a line: headings, quotes, list markers, task boxes, rules.
    .replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, "")
    .replace(/^[ \t]*(?:>[ \t]?)+/gm, "")
    .replace(/^[ \t]*(?:[-*+]|\d{1,9}[.)])[ \t]+(?:\[[ xX]\][ \t]+)?/gm, "")
    .replace(/^[ \t]*(?:[-*_][ \t]*){3,}$/gm, "")
    // Table rules (|---|:--:|) go; cell pipes become spaces.
    .replace(
      /^[ \t]*\|?[ \t]*:?-+:?[ \t]*(?:\|[ \t]*:?-+:?[ \t]*)+\|?[ \t]*$/gm,
      ""
    )
    // Images -> alt text, links -> their text, autolinks -> the URL.
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/!\[([^\]]*)\]\[[^\]]*\]/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1")
    .replace(/^[ \t]*\[[^\]]+\]:[ \t]*\S+.*$/gm, "")
    .replace(/<((?:https?:\/\/|mailto:)[^>\s]+)>/gi, "$1")
    // Inline code and emphasis.
    .replace(/`+([^`\n]+?)`+/g, "$1")
    .replace(/(\*\*|__)(?=\S)([^\n]*?\S)\1/g, "$2")
    .replace(/~~(?=\S)([^\n]*?\S)~~/g, "$1")
    .replace(/(^|[^\w*])\*(?=\S)([^*\n]*?\S)\*(?!\w)/g, "$1$2")
    .replace(/(^|[^\w])_(?=\S)([^_\n]*?\S)_(?!\w)/g, "$1$2")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.replace(
    /\uE000(\d+)\uE001/g,
    (_, i: string) => escaped[Number(i)] ?? ""
  );
};
