import { createClient } from "utils/supabase/server";

const getUser = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
  }

  return { data, error };
};

const deleteAccount = async () => {
  const supabase = await createClient();

  // TODO: Add a new line to the Feedback table to delete the account with account id
};

export { getUser };
