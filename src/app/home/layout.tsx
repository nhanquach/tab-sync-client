import { redirect } from "next/navigation";

import { createClient } from "@utils/supabase/server";
import AppBar from "@components/Appbar";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/");
  }

  return (
    <>
      <AppBar user={data?.user} />
      <main>{children}</main>
    </>
  );
};

export default HomeLayout;
