"use server";
import { createClient } from "utils/supabase/server";

const sendFeedback = async (formData: FormData) => {
  const supabase = await createClient();

  const data = {
    type: formData.get("type") as string,
    description: formData.get("description") as string,
    user_id: formData.get("user_id") as string,
  };

  const { error } = await supabase.from("feedback").insert(data);

  return { error };
};

export { sendFeedback };
