import { UserRoundPenIcon } from "lucide-react";
import { getUser } from "./actions";
import ProfileForm from "../../components/profile-form/ProfileForm";
import ChangePasswordForm from "../../components/change-password-form/ChangePasswordForm";

const Settings = async () => {
  const { data } = await getUser();

  return (
    <div className="flex flex-col items-center justify-center mx-auto pb-6 overflow-auto w-full lg:max-w-6xl">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold mb-2 tracking-tighter flex gap-2 items-center text-left w-full">
          <UserRoundPenIcon className="text-primary w-8 h-8" />
          User Settings
        </h1>
      </div>
      <div className="flex flex-col md:flex-row w-full gap-2">
        <ProfileForm user={data.user} />
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default Settings;
