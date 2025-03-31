"use client";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

import Appbar from "components/appbar/Appbar";
import FeedbackForm from "components/feedback-form/FeedbackForm";

import NinjaKeys from "components/ninja-keys";
Appbar;
import { getUser, signOut } from "./actions.ts";
import { IUser } from "interfaces/IUser";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUser().then(({ data }) => {
      setUser(data.user as IUser);
    });
  }, []);

  const openFeedbackDialog = () => {
    (document.getElementById("feedback-dialog") as any).showModal();
  };

  const closeFeedbackDialog = () => {
    (document.getElementById("feedback-dialog") as any).close();
  };

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
        <Appbar
          openFeebackDialog={openFeedbackDialog}
          signOut={signOut}
          user={user}
        />
      </div>
      <dialog id="feedback-dialog" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Send Feedback</h3>
          <p className="py-4">Share your thoughts to help us improve TabSync</p>
          <FeedbackForm user={user} closeFeedbackDialog={closeFeedbackDialog} />
        </div>
      </dialog>
    </div>
  );
};

export default AppLayout;
