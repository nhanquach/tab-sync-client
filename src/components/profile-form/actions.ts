"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../utils/supabase/server";

const updateProfile = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const numberOfTabs =
    (formData.get("numberOfTabs") as unknown as number) || 10;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.updateUser({
    data: {
      name,
      numberOfTabs,
    },
  });

  if (error) {
    console.error(error);
  }

  if (!error) {
    revalidatePath("/settings", "page");
  }

  return { data, error };
};

export { updateProfile };
