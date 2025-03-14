"use server";

import { cache } from "react";
import { createClient } from "utils/supabase/server";
import { SimplifiedTab } from "interfaces/Tab";
import { uniqeArray } from "utils/unique";

import ai from "services/gemini-service";

const getUser = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
  }

  return { data, error };
});

const getUniqueOpenTabs = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("unique_open_tabs")
    .select("title, url")
    .order("timeStamp", { ascending: false })
    .limit(30);

  if (error) {
    throw error;
  }

  return {
    data: uniqeArray<SimplifiedTab[]>(data, "title"),
    error: null,
  };
};

const buildCategories = async (tabList: SimplifiedTab[]) => {
  const data = await ai.categorizeByAI({
    messages: JSON.stringify(tabList.map(({ title, url }) => ({ title, url }))),
  });

  return groupBy(data.object, "category");
};

const groupBy = (array: any[], key: string) => {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      ...currentValue.urls
    );
    return result;
  }, {});
};

export { getUser, getUniqueOpenTabs, buildCategories };
