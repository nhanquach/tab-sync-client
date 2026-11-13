/**
 * Helpers for the command palette's server-side search (PostgREST filters) and
 * its local command matching. Pure functions, no Supabase import.
 */

/** Results per group in the palette. Small on purpose (Free tier, one request per group). */
export const SEARCH_LIMIT = 8;
/** Shortest query that hits the server. */
export const SEARCH_MIN_CHARS = 2;
/** Words of the query that each must match (more are ignored). */
export const SEARCH_MAX_WORDS = 4;
/** Longest query sent to the server. */
export const SEARCH_MAX_CHARS = 100;

/** Split a query into lowercase words (deduped, capped). */
export const searchWords = (query: string) =>
  Array.from(
    new Set(
      query
        .slice(0, SEARCH_MAX_CHARS)
        .toLowerCase()
        .split(/\s+/)
        .map((w) => w.trim())
        .filter(Boolean)
    )
  ).slice(0, SEARCH_MAX_WORDS);

/**
 * ILIKE pattern that matches `word` literally anywhere: escapes the LIKE
 * wildcards (% and _) and the escape character itself (\), then wraps in %…%.
 * `*` is dropped because PostgREST turns it into a wildcard in (i)like values.
 */
export const likeContains = (word: string) => `%${word.replace(/\*/g, "").replace(/[\\%_]/g, (c) => `\\${c}`)}%`;

/**
 * Quote a value for a PostgREST logic-tree filter (or=/and=), so commas,
 * dots, colons and parentheses in the user's text can't break the filter:
 * wrap in double quotes, backslash-escape \ and ".
 */
export const quoteFilterValue = (value: string) => `"${value.replace(/[\\"]/g, (c) => `\\${c}`)}"`;

/** `or(col1.ilike."%w%",col2.ilike."%w%")` for one word. */
const anyColumnMatches = (columns: string[], word: string) =>
  `or(${columns.map((c) => `${c}.ilike.${quoteFilterValue(likeContains(word))}`).join(",")})`;

/**
 * Filter body (without the outer `and(...)`) requiring every word to match at
 * least one column: `or(title.ilike."%a%",url.ilike."%a%"),or(…"%b%"…)`.
 * Returns "" when there is nothing to search for.
 */
export const allWordsFilter = (columns: string[], query: string) =>
  searchWords(query)
    .filter((w) => likeContains(w) !== "%%")
    .map((w) => anyColumnMatches(columns, w))
    .join(",");

/** Does `text` contain every word of the query (case-insensitive)? Used for local commands. */
export const matchesAllWords = (text: string, query: string) => {
  const words = searchWords(query);
  if (!words.length) return true;
  const hay = text.toLowerCase();
  return words.every((w) => hay.includes(w));
};

/** ">" prefix (VS Code): show commands only. Returns the query without it. */
export const parsePaletteQuery = (raw: string) => {
  const trimmed = raw.trimStart();
  if (trimmed.startsWith(">")) return { commandsOnly: true, query: trimmed.slice(1).trim() };
  return { commandsOnly: false, query: raw.trim() };
};

/** Split text into parts for highlighting matched words: [{ text, hit }]. */
export const highlightParts = (text: string, query: string) => {
  const words = searchWords(query).filter((w) => w.length > 0);
  if (!text || !words.length) return [{ text, hit: false }];
  const lower = text.toLowerCase();
  const marks = new Array<boolean>(text.length).fill(false);
  for (const w of words) {
    for (let i = lower.indexOf(w); i !== -1; i = lower.indexOf(w, i + w.length)) {
      for (let j = i; j < i + w.length; j++) marks[j] = true;
    }
  }
  const parts: { text: string; hit: boolean }[] = [];
  for (let i = 0; i < text.length; i++) {
    const last = parts[parts.length - 1];
    if (last && last.hit === marks[i]) last.text += text[i];
    else parts.push({ text: text[i], hit: marks[i] });
  }
  return parts;
};
