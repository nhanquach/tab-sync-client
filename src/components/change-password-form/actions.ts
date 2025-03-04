"use server";

import { createClient } from "../../utils/supabase/server";

const updatePassword = async (formData: FormData) => {
  const newPassword = formData.get("newPassword") as string;
  const repeatNewPassword = formData.get("repeatNewPassword") as string;

  if (!newPassword || !repeatNewPassword) {
    throw new Error("Please fill in all fields");
  }

  if (newPassword !== repeatNewPassword) {
    throw new Error("Passwords do not match!");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export { updatePassword };
