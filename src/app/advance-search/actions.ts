"use server";

import { cache } from "react";

import { createClient } from "utils/supabase/server";

import ai from "../../services/gemini-service";
import { SimplifiedTab } from "../../interfaces/Tab";

const getUser = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
  }

  return { data, error };
};

const getUniqueOpenTabs = cache(async (table = "unique_archived_tabs") => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(table)
    .select("title, url, timeStamp")
    .order("timeStamp", { ascending: false })
    .limit(30);

  return { data, error };
});

const search = async (tabList: SimplifiedTab[], searchString: string) => {
  const { object: data } = await ai.searchByAI({
    tabList: JSON.stringify(tabList),
    searchString,
  });

  return data;
};

export { getUser, getUniqueOpenTabs, search };
