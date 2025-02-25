import { createClient } from "@utils/supabase/server";
import { TABLES } from "../../clients/constants";
import { ITab } from "@interfaces/Tab";

const getOpenTabs = async (): Promise<{
  data: ITab[];
  error?: string;
  count: number;
}> => {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from(TABLES.OPEN_TABS)
    .select("*", { count: "exact" })
    .limit(10);

  if (error) {
    console.error(error);
  }

  return { data, count, error };
};

const getArchivedTabs = async (): Promise<{
  data: ITab[];
  error?: string;
  count: number;
}> => {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from(TABLES.ARCHIVED_TABS)
    .select("*", {
      count: "exact",
      limit: 10,
    });

  if (error) {
    console.error(error);
  }

  return { data, count, error };
};

export { getOpenTabs, getArchivedTabs };
