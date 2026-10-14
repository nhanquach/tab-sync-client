import { SupabaseClient, createClient } from "@supabase/supabase-js";

import { TABLES } from "./constants";
import { ITabSyncSettings } from "../interfaces/TabSyncSettings";
import { ITab } from "../interfaces/iTab";
import { IDatabaseUpdatePayload } from "../interfaces/IDatabaseUpdate";
import { HOME_PAGE } from "../utils/constants";

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
