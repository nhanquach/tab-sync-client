"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "utils/supabase/server";

const signUp = async (
  formData: FormData
): Promise<{ data: any; error: any }> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const repeatPassword = formData.get("repeatPassword") as string;

  if (!email || !password || !repeatPassword) {
    throw new Error("Please enter your email and password");
  }

  if (password !== repeatPassword) {
    throw new Error("Passwords do not match");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      throw error;
    }

    revalidatePath("/", "layout");

    return { data, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: (error as Error).message };
  }
};

export { signUp };
