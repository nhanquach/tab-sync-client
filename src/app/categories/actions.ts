'use server'

import {cache} from 'react'
import { createClient } from "@utils/supabase/server";

const getUser = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
  }

  return { data, error };
});

export default { getUser };
