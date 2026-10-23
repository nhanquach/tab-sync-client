/**
 * Resolve favicon hashes to data: URLs for tabs read from the server.
 *
 * The database stores each data: favicon once in `favicons` (keyed by md5) and
 * tab rows carry `favicon_hash` with a null `favIconUrl`
 * (tab-sync-extension: supabase/migrations/20261023_free_tier_cleanup.sql).
 * Lookups are batched (one `in (...)` query per 100 hashes), kept in memory and
 * in localStorage. A hash always maps to the same icon, so the cache only needs
 * a size cap, never invalidation.
 */

export interface FaviconRow {
  hash: string;
  data: string;
}

export interface FaviconResolverOptions {
  /** Fetch rows for these hashes (at most `batchSize` per call). */
  fetchFavicons: (hashes: string[]) => Promise<FaviconRow[]>;
  storageKey?: string;
  batchSize?: number;
  /** Most icons kept in localStorage (newest kept). */
  maxEntries?: number;
  /** Most characters of icon data kept in localStorage (~5 MB quota per origin). */
  maxChars?: number;
}

export const FAVICON_CACHE_KEY = "tabsync_favicon_cache";

export interface FaviconFields {
  favIconUrl?: string | null;
  favicon_hash?: string | null;
}

/** Hashes that need a lookup: rows without their own favIconUrl. */
export const hashesToResolve = (tabs: FaviconFields[]): string[] => {
  const seen = new Set<string>();
  tabs.forEach((t) => {
    if (!t.favIconUrl && t.favicon_hash) seen.add(t.favicon_hash);
  });
  return Array.from(seen);
};

const readStorage = (key: string): Record<string, string> => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const createFaviconResolver = ({
  fetchFavicons,
  storageKey = FAVICON_CACHE_KEY,
  batchSize = 100,
  maxEntries = 300,
  maxChars = 1_500_000,
}: FaviconResolverOptions) => {
  // Map keeps insertion order = recency, so trimming drops the oldest.
  let memory: Map<string, string> | null = null;
  const inFlight = new Map<string, Promise<void>>();

  const cache = () => {
    if (!memory) {
      memory = new Map();
      const saved = readStorage(storageKey);
      Object.keys(saved).forEach((h) => {
        if (typeof saved[h] === "string") memory!.set(h, saved[h]);
      });
    }
    return memory;
  };

  const persist = () => {
    const entries = Array.from(cache().entries());
    const kept: [string, string][] = [];
    let chars = 0;
    for (let i = entries.length - 1; i >= 0 && kept.length < maxEntries; i -= 1) {
      chars += entries[i][1].length;
      if (chars > maxChars) break;
      kept.unshift(entries[i]);
    }
    memory = new Map(kept);
    try {
      localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(kept)));
    } catch {
      // Quota exceeded or storage disabled: the in-memory cache still works.
    }
  };

  /**
   * Resolve these hashes. Returns every requested hash that is known (cached or
   * fetched); unknown hashes and failed lookups are left out so callers fall
   * back to the globe.
   */
  const resolve = async (hashes: string[]): Promise<Record<string, string>> => {
    const known = cache();
    const wanted = Array.from(new Set(hashes.filter(Boolean)));
    const missing = wanted.filter((h) => !known.has(h) && !inFlight.has(h));

    const batches: Promise<void>[] = [];
    for (let i = 0; i < missing.length; i += batchSize) {
      const batch = missing.slice(i, i + batchSize);
      const request = fetchFavicons(batch)
        .then((rows) => {
          (rows ?? []).forEach((row) => {
            if (row && typeof row.hash === "string" && typeof row.data === "string") {
              cache().set(row.hash, row.data);
            }
          });
        })
        .catch(() => undefined)
        .then(() => batch.forEach((h) => inFlight.delete(h)));
      batch.forEach((h) => inFlight.set(h, request));
      batches.push(request);
    }

    const waiting = wanted.map((h) => inFlight.get(h)).filter((p): p is Promise<void> => !!p);
    await Promise.all([...batches, ...waiting]);

    const out: Record<string, string> = {};
    wanted.forEach((h) => {
      const data = cache().get(h);
      if (data) out[h] = data;
    });
    // Persist (and trim) after reading, so this answer is complete even when it
    // asked for more than the cache keeps.
    if (batches.length) persist();
    return out;
  };

  return { resolve };
};

/**
 * Fill in `favIconUrl` from `favicon_hash` for display. Rows keep their
 * `favicon_hash`, so archiving one sends the hash rather than the icon bytes.
 */
export const withResolvedFavicons = async <T extends FaviconFields>(
  rows: T[],
  resolve: (hashes: string[]) => Promise<Record<string, string>>
): Promise<T[]> => {
  const hashes = hashesToResolve(rows);
  if (!hashes.length) return rows;
  let found: Record<string, string> = {};
  try {
    found = await resolve(hashes);
  } catch {
    return rows;
  }
  return rows.map((row) =>
    !row.favIconUrl && row.favicon_hash && found[row.favicon_hash]
      ? { ...row, favIconUrl: found[row.favicon_hash] }
      : row
  );
};
