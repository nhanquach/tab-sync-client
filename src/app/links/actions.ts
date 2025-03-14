"use server";

import { cache } from "react";

import { createClient } from "../../utils/supabase/server";

const getTabsFromTable = cache(async (table: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(table)
    .select("*", { count: "exact" })
    .order("timeStamp", { ascending: false })
    .limit(30);

  return { data, error };
});

export { getTabsFromTable };
