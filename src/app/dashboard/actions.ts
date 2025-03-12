import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@utils/supabase/server";
import { TABLES } from "../../clients/constants";
import { ITab } from "@interfaces/Tab";

const getOpenTabs = async (): Promise<{
  data: ITab[] | null;
  error: PostgrestError | null;
  count: number | null;
}> => {
  const supabase = await createClient();

  const user = await supabase.auth.getUser();

  const { data, error, count } = await supabase
    .from(TABLES.OPEN_TABS)
    .select("*", { count: "exact" })
    .order("timeStamp", { ascending: false })
    .limit(user.data.user?.user_metadata?.numberOfTabs || 10);

  if (error) {
    console.error(error);
  }

  return { data, count, error };
};

const getArchivedTabs = async (): Promise<{
  data: ITab[] | null;
  error: PostgrestError | null;
  count: number | null;
}> => {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from(TABLES.ARCHIVED_TABS)
    .select("*", {
      count: "exact",
    })
    .limit(1);

  if (error) {
    console.error(error);
  }

  return { data, count, error };
};

const getDevices = async (): Promise<{
  devices: string[] | null;
  error: PostgrestError | null;
}> => {
  const devices: string[] = [];

  const supabase = await createClient();

  // TODO: Add unique_device VIEW
  const { data, error } = await supabase
    .from(TABLES.OPEN_TABS)
    .select("deviceName", { count: "exact" })
    

  if (error) {
    console.error(error);
  }

  data?.forEach(({ deviceName }: { deviceName: string }) => {
    if (!devices.includes(deviceName)) {
      devices.push(deviceName!);
    }
  });

  return { devices, error };
};

export { getOpenTabs, getArchivedTabs, getDevices };
