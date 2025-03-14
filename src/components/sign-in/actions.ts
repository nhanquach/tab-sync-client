"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "utils/supabase/server";

const signIn = async (
  formData: FormData
): Promise<{ data: any; error: any }> => {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { data: null, error };
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
};

const resetPassword = async (
  email: string
): Promise<{ data: any; error: any }> => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw error;
    }

    revalidatePath("/", "layout");
    redirect("/");

    return { data, error: null };
  } catch (error) {
    console.error(error);

    return { data: null, error: (error as Error).message };
  }
};

export { signIn, resetPassword };
