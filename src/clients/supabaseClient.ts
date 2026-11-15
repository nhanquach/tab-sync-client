import { SupabaseClient, createClient } from "@supabase/supabase-js";

import { TABLES } from "./constants";
import { ITabSyncSettings } from "../interfaces/TabSyncSettings";
import { ITab } from "../interfaces/iTab";
import { IDatabaseUpdatePayload } from "../interfaces/IDatabaseUpdate";
import { HOME_PAGE } from "../utils/constants";
import { IBookmarkRow, IBookmarkSnapshot } from "../interfaces/iBookmark";
import { IDevice, INote } from "../interfaces/iNote";
import { canAttachUrl, cleanNote, cleanTitle, NOTE_COLUMNS } from "../utils/notes";

const rootClient = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: SupabaseClient<any, "public", any> | null;

export const getClient = async () => {
  try {
    const tabSyncSettings = getLocalSettings();

    if (!tabSyncSettings || !tabSyncSettings.token) {
      return { client, deviceName: "", userId: "" };
    }

    const { deviceName, user } = tabSyncSettings;

    if (client) {
      return {
        client,
        deviceName,
        userId: user.id,
      };
    }

    const currentUser = await getUser();

    if (!currentUser) {
      return { client, deviceName: "", userId: "" };
    }

    client = createClient(
      import.meta.env.VITE_SUPABASE_URL!,
      import.meta.env.VITE_SUPABASE_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${tabSyncSettings.token.access_token}`,
            // Marks this as a current client so the database trigger that emulates
            // old extension versions' upserts leaves our writes alone.
            "x-tabsync-client": "web",
          },
        },
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        },
      }
    );

    return {
      client,
      deviceName: deviceName,
      userId: currentUser.id,
    };
  } catch (e) {
    console.error(e);
  }

  return { client, deviceName: "", userId: "" };
};

export const signIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await rootClient.auth.signInWithPassword({
    email,
    password,
  });

  const tabSyncSettings = await getLocalSettings();
  localStorage.setItem(
    "tabSyncSettings",
    JSON.stringify({
      tabSyncSettings: {
        ...tabSyncSettings,
        user: user.data.user,
        token: user?.data?.session || tabSyncSettings.token,
      },
    })
  );

  return user;
};

export const signUp = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return await rootClient.auth.signUp({
    email,
    password,
  });
};

export const signOut = async () => {
  await rootClient.auth.signOut();
  localStorage.clear();
};

export const getUser = async () => {
  const tabSyncSettings = await getLocalSettings();

  const user = await rootClient.auth.getUser(
    tabSyncSettings?.token?.access_token
  );

  const session = await rootClient.auth.getSession();

  localStorage.setItem(
    "tabSyncSettings",
    JSON.stringify({
      tabSyncSettings: {
        ...tabSyncSettings,
        user: user.data.user,
        token: session.data.session || tabSyncSettings.token,
      },
    })
  );

  return user?.data?.user;
};

export const changePassword = async ({
  newPassword,
}: {
  newPassword: string;
}) => {
  return client?.auth.updateUser({
    password: newPassword,
  });
};

export const resetPassword = async ({ email }: { email: string }) => {
  return rootClient?.auth.resetPasswordForEmail(email, {
    redirectTo: `${HOME_PAGE}/forgot-password`,
  });
};

export const deleteAccount = async () => {
  sendFeedback("delete_account", "");

  await archiveOpenTabs();
  await removeArchivedTabs();
};

export const getOpenTabs = async (
  page = 1,
  limit = 20,
  searchString = "",
  deviceName?: string,
  orderBy = "TIME"
): Promise<{
  data: ITab[];
  count: number;
  error?: string;
}> => {
  const { client, userId } = await getClient();

  if (client && userId) {
    let query = client
      .from(TABLES.OPEN_TABS)
      .select("*", { count: "exact" });

    if (deviceName && deviceName !== "All") {
      query = query.eq("deviceName", deviceName);
    }

    if (searchString) {
      query = query.or(
        `title.ilike.%${searchString}%,url.ilike.%${searchString}%`
      );
    }

    if (orderBy === "TIME") {
      query = query.order("timeStamp", { ascending: false });
    } else {
      query = query.order("title", { ascending: true });
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to);

    return {
      data: data as ITab[],
      count: count || 0,
      error: error?.message,
    };
  }

  return { data: [], count: 0, error: "No user id" };
};

export const getArchivedTabs = async (
  page = 1,
  limit = 20,
  searchString = "",
  deviceName?: string,
  orderBy = "TIME"
): Promise<{
  data: ITab[];
  count: number;
  error?: string;
}> => {
  const { client, userId } = await getClient();

  if (client && userId) {
    let query = client
      .from(TABLES.ARCHIVED_TABS)
      .select("*", { count: "exact" });

    if (deviceName && deviceName !== "All") {
      query = query.eq("deviceName", deviceName);
    }

    if (searchString) {
      query = query.or(
        `title.ilike.%${searchString}%,url.ilike.%${searchString}%`
      );
    }

    if (orderBy === "TIME") {
      query = query.order("timeStamp", { ascending: false });
    } else {
      query = query.order("title", { ascending: true });
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to);

    return {
      data: data as ITab[],
      count: count || 0,
      error: error?.message,
    };
  }

  return { data: [], count: 0, error: "No user id" };
};

/** Supabase resolves with `{ error }` instead of throwing; turn it into a throw so callers can react. */
const assertOk = (result: { error: { message: string } | null }, action: string) => {
  if (result.error) {
    throw new Error(`${action}: ${result.error.message}`);
  }
};

const newUid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });

export const sendTab = async (
  tab: Omit<ITab, "uid"> & { uid?: string }
): Promise<{ data: ITab; error?: { message: string } }> => {
  checkTokenExpired();

  const { id, url, favIconUrl = "", title, index, windowId } = tab;
  const uid = tab.uid ?? newUid();
  const { client, deviceName, userId } = await getClient();

  if (!userId) {
    return { data: { ...tab, uid }, error: { message: "No user id" } };
  }

  if (client) {
    const result = await client.from(TABLES.OPEN_TABS).upsert(
      {
        uid,
        id,
        url,
        favIconUrl,
        title,
        index,
        windowId,
        deviceName: deviceName || tab.deviceName,
        userId,
      },
      { onConflict: "uid" }
    );
    assertOk(result, "sendTab");
  }

  return { data: { ...tab, uid }, error: undefined };
};

/** Delete rows by their stable uid. */
export const removeTab = async (uids: string[], table = TABLES.OPEN_TABS) => {
  checkTokenExpired();

  const { client } = await getClient();

  if (client && uids.length) {
    // Chunk to keep the request URL short.
    for (let i = 0; i < uids.length; i += 100) {
      const result = await client
        .from(table)
        .delete()
        .in("uid", uids.slice(i, i + 100));
      assertOk(result, "removeTab");
    }
  }
};

/**
 * Copy tabs into archived_tabs. The archive row keeps the tab's uid and device,
 * so archiving twice (e.g. a retry) doesn't create duplicates.
 */
export const archiveTab = async (tabs: ITab[]) => {
  checkTokenExpired();

  const { client, userId } = await getClient();

  const tabsWillBeArchived = tabs.map(
    ({ uid, id, url, favIconUrl, title, index, windowId, deviceName, device_id }) => {
      return {
        uid,
        id,
        url,
        favIconUrl,
        title,
        index,
        windowId,
        deviceName,
        device_id: device_id ?? null,
        userId,
      };
    }
  );

  if (!userId) {
    return { data: [], error: { message: "No user id" } };
  }

  if (client && tabsWillBeArchived.length) {
    const result = await client
      .from(TABLES.ARCHIVED_TABS)
      .upsert(tabsWillBeArchived, { onConflict: "uid" });
    assertOk(result, "archiveTab");
  }
};

export const onOpenTabChange = async (
  callback: (payload: IDatabaseUpdatePayload) => void
) => {
  const { client, userId } = await getClient();
  if (client) {
    client
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: TABLES.OPEN_TABS,
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          callback(payload as unknown as IDatabaseUpdatePayload);
        }
      )
      .subscribe();
  }
};

export const onArchivedTabChange = async (
  callback: (paylod: IDatabaseUpdatePayload) => void
) => {
  const { client, userId } = await getClient();
  if (client) {
    client
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: TABLES.ARCHIVED_TABS,
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          callback(payload as unknown as IDatabaseUpdatePayload);
        }
      )
      .subscribe();
  }
};

export const archiveOpenTabs = async (deviceName?: string) => {
  const { data: openTabs, error } = await getOpenTabs(
    1,
    1000,
    "",
    deviceName
  );

  if (error) {
    console.error(error);
  }

  if (openTabs) {
    await archiveTab(openTabs);
    await removeTab(openTabs.map((t) => t.uid));
  }
};

export const removeArchivedTabs = async (deviceName?: string) => {
  const archivedTabs = await getArchivedTabs(1, 1000, "", deviceName);

  const uids = archivedTabs.data.map((t) => t.uid);
  await removeTab(uids, TABLES.ARCHIVED_TABS);
};

export const sendFeedback = async (type: string, description: string) => {
  const { client } = await getClient();
  const currentUser = await getUser();

  await client
    ?.from("feedback")
    .insert([{ type, description, user_id: currentUser?.id }]);
};

const checkTokenExpired = async () => {
  const tabSyncSettings = await getLocalSettings();

  if (
    tabSyncSettings?.token?.expires_in &&
    tabSyncSettings.token.expires_in <= 100
  ) {
    getNewToken();
  }
};

const getNewToken = async () => {
  const tabSyncSettings = await getLocalSettings();

  if (tabSyncSettings?.token?.refresh_token) {
    const newToken = await rootClient.auth.refreshSession({
      refresh_token: tabSyncSettings.token.refresh_token,
    });

    localStorage.setItem(
      "tabSyncSettings",
      JSON.stringify({
        tabSyncSettings: {
          ...tabSyncSettings,
          token: newToken.data.session || tabSyncSettings.token,
        },
      })
    );

    client = null;
  }
};

const getLocalSettings = (): ITabSyncSettings => {
  const tabSyncSettings = localStorage.getItem("tabSyncSettings");

  if (tabSyncSettings) {
    return JSON.parse(tabSyncSettings).tabSyncSettings;
  }

  return {
    deviceName: "",
    token: {
      refresh_token: "",
      access_token: "",
      expires_in: 0,
      token_type: "bearer",
      user: {
        id: "",
        app_metadata: {},
        user_metadata: {},
        aud: "",
        created_at: "",
      },
    },
    user: {
      id: "",
      app_metadata: {},
      user_metadata: {},
      aud: "",
      created_at: "",
    },
  };
};

/** Every browser of this user with a bookmark backup, newest first. */
export const getBookmarkSnapshots = async (): Promise<IBookmarkSnapshot[]> => {
  const { client, userId } = await getClient();
  if (!client || !userId) throw new Error("Not signed in");
  const { data, error } = await client
    .from(TABLES.BOOKMARK_SNAPSHOTS)
    .select("device_id,gen,snapshot_at,node_count,link_count,devices(name,browser,os)")
    .eq("userId", userId)
    .not("snapshot_at", "is", null)
    .order("snapshot_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as IBookmarkSnapshot[];
};

/** All nodes of one backup, 1,000 rows per request (PostgREST's cap). */
export const getBookmarkNodes = async (
  snapshot: Pick<IBookmarkSnapshot, "device_id" | "gen">,
  onProgress?: (loaded: number) => void
): Promise<IBookmarkRow[]> => {
  const { client, userId } = await getClient();
  if (!client || !userId) throw new Error("Not signed in");
  const rows: IBookmarkRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await client
      .from(TABLES.BOOKMARKS)
      .select("node_id,parent_node_id,root,position,title,url,date_added")
      .eq("device_id", snapshot.device_id)
      .eq("gen", snapshot.gen)
      .order("node_id")
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    const page = (data ?? []) as IBookmarkRow[];
    rows.push(...page);
    onProgress?.(rows.length);
    if (page.length < 1000) break;
  }
  return rows;
};

// ---------------------------------------------------------------------------
// Notes, organized by browser (extension repo: supabase/migrations/20261110_notes.sql).
// Archive is a state (archived_at). Limits are enforced by the database.
// ---------------------------------------------------------------------------

/** This user's browsers (not retired), for naming note groups and the "write for" picker. */
export const getDevices = async (): Promise<IDevice[]> => {
  const { client, userId } = await getClient();
  if (!client || !userId) throw new Error("Not signed in");
  const { data, error } = await client
    .from(TABLES.DEVICES)
    .select("id,name,browser,os,last_seen_at")
    .eq("user_id", userId)
    .is("retired_at", null);
  if (error) throw error;
  return (data ?? []) as IDevice[];
};

/** Live notes (newest first) or archived notes (newest archived first), paged past the 1,000-row cap. */
export const getNotes = async ({ archived = false } = {}): Promise<INote[]> => {
  const { client, userId } = await getClient();
  if (!client || !userId) throw new Error("Not signed in");
  const out: INote[] = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    let query = client.from(TABLES.NOTES).select(NOTE_COLUMNS).eq("user_id", userId);
    query = archived ? query.not("archived_at", "is", null) : query.is("archived_at", null);
    const { data, error } = await query
      .order(archived ? "archived_at" : "created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, from + PAGE - 1);
    if (error) throw error;
    const rows = (data ?? []) as INote[];
    out.push(...rows);
    if (rows.length < PAGE || from >= PAGE * 19) break;
  }
  return out;
};

/** Probe: throws if the notes table isn't there yet (migration not run). No rows downloaded. */
export const getNotesCount = async (): Promise<number> => {
  const { client, userId } = await getClient();
  if (!client || !userId) throw new Error("Not signed in");
  const { count, error } = await client
    .from(TABLES.NOTES)
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("archived_at", null);
  if (error) throw error;
  return count ?? 0;
};

/** Write a note for one of the user's browsers. */
export const addNote = async (input: {
  deviceId: string;
  body: string;
  url?: string | null;
  title?: string | null;
}): Promise<INote> => {
  const { client, userId } = await getClient();
  if (!client || !userId) throw new Error("Not signed in");
  const body = cleanNote(input.body);
  if (!body) throw new Error("Empty note");
  const url = canAttachUrl(input.url) ? input.url : null;
  const { data, error } = await client
    .from(TABLES.NOTES)
    .insert({
      user_id: userId,
      device_id: input.deviceId,
      body,
      url,
      title: url ? cleanTitle(input.title) || null : null,
    })
    .select(NOTE_COLUMNS)
    .single();
  if (error) throw error;
  return data as INote;
};

/** Edit text and/or link (url: null detaches it). */
export const updateNote = async (
  id: string,
  patch: { body?: string; url?: string | null; title?: string | null }
): Promise<INote> => {
  const { client, userId } = await getClient();
  if (!client || !userId) throw new Error("Not signed in");
  const row: Record<string, unknown> = {};
  if (patch.body !== undefined) {
    const body = cleanNote(patch.body);
    if (!body) throw new Error("Empty note");
    row.body = body;
  }
  if (patch.url !== undefined) {
    const url = canAttachUrl(patch.url) ? patch.url : null;
    row.url = url;
    row.title = url ? cleanTitle(patch.title) || null : null;
  }
  const { data, error } = await client
    .from(TABLES.NOTES)
    .update(row)
    .eq("id", id)
    .eq("user_id", userId)
    .select(NOTE_COLUMNS)
    .single();
  if (error) throw error;
  return data as INote;
};

/** Archive (hide from its browser's list) or restore. The server stamps archived_at. */
export const setNoteArchived = async (id: string, archived: boolean): Promise<INote> => {
  const { client, userId } = await getClient();
  if (!client || !userId) throw new Error("Not signed in");
  const { data, error } = await client
    .from(TABLES.NOTES)
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id)
    .eq("user_id", userId)
    .select(NOTE_COLUMNS)
    .single();
  if (error) throw error;
  return data as INote;
};

export const deleteNote = async (id: string) => {
  const { client, userId } = await getClient();
  if (!client || !userId) throw new Error("Not signed in");
  const { error } = await client.from(TABLES.NOTES).delete().eq("id", id).eq("user_id", userId);
  if (error) throw error;
};
