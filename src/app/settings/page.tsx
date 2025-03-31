import { SettingsIcon } from "lucide-react";

import ProfileForm from "components/profile-form/ProfileForm";
import ChangePasswordForm from "components/change-password-form/ChangePasswordForm";

import { getUser } from "./actions";
import DangerZone from "./DangerZone";

import { IUser } from "../../interfaces/IUser";

const Settings = async () => {
  const { data } = await getUser();

  return (
    <div className="flex flex-col items-center justify-center mx-auto pb-6 overflow-auto w-full lg:max-w-6xl">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold mb-2 tracking-tighter flex gap-2 items-center text-left w-full">
          <SettingsIcon className="text-primary w-8 h-8" />
          User Settings
        </h1>
      </div>
      <div className="flex flex-col md:flex-row w-full gap-2">
        <ProfileForm user={data.user as IUser} />
        <ChangePasswordForm />
      </div>
      <div className="mt-16 p-4 flex flex-col gap-4 w-full text-left">
        <DangerZone user={data.user} />
      </div>
    </div>
  );
};

export default Settings;
