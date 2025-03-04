"use server";

import { revalidatePath } from "next/cache";
import { TABLES } from "../../clients/constants";
import { createClient } from "../../utils/supabase/server";
import { ITab } from "@interfaces/Tab";

export const archiveTab = async (tab: ITab) => {
  const supabase = await createClient();

  const { error } = await supabase.from(TABLES.ARCHIVED_TABS).upsert([tab]);

  if (error) {
    console.error(error);
    return error;
  }

  await supabase.from(TABLES.OPEN_TABS).delete().eq("id", tab.id);

  revalidatePath("/links", "page");
};
