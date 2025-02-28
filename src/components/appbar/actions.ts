"use server";

import { createClient } from "../../utils/supabase/server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const signout = async () => {
  try {
    const supabase = await createClient();

    await supabase.auth.signOut();

    revalidatePath("/", "layout");
    redirect("/");
  } catch (error) {
    console.error(error);
  }
};

export { signout };
