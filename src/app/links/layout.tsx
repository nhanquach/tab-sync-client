import { redirect } from "next/navigation";

import { createClient } from "@utils/supabase/server";
import Appbar from "@components/appbar/Appbar";
import { Menu } from "lucide-react";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  console.log("🚀 . data:", data);
  if (error || !data?.user) {
    redirect("/");
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <label
          htmlFor="drawer"
          className="btn btn-soft drawer-button lg:hidden absolute right-6 top-6"
        >
          <Menu />
        </label>
        <main className="flex-1 p-6 w-full">{children}</main>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <Appbar user={data.user} />
      </div>
    </div>
  );
};

export default HomeLayout;
