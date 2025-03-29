"use server";

import { createClient } from "../../utils/supabase/server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { IUser } from "../../interfaces/IUser";
import { AuthError } from "@supabase/supabase-js";

const getUser = async (): Promise<{
  data: { user: IUser | null };
  error: AuthError | null;
}> => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/");
  }

  return { data, error };
};

const signout = async () => {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    revalidatePath("/", "layout");
  } catch (error) {
    console.error(error);
  } finally {
    redirect("/");
  }
};

export { signout, getUser };
