import { Menu } from "lucide-react";

import Appbar from "components/appbar/Appbar";
import NinjaKeys from "components/ninja-keys";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <label
          htmlFor="drawer"
          className="btn btn-ghost drawer-button lg:hidden absolute right-6 top-6"
        >
          <Menu />
        </label>
        <main className="flex-1 p-6 md:p-8 w-full">{children}</main>
        <NinjaKeys />
      </div>
      <div className="drawer-side">
        <label
          htmlFor="drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <Appbar />
      </div>
    </div>
  );
};

export default AppLayout;
