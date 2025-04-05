"use client";

import { Loader2Icon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { updateProfile } from "./actions";
import { IUser } from "../../interfaces/IUser";

type TProps = {
  user: IUser;
};

const ProfileForm = ({ user }: TProps) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; message: string }>();

  const handleUpdateProfile = async (formData: FormData) => {
    try {
      setLoading(true);
      const { data: _data, error } = await updateProfile(formData);

      if (error) {
        setMessage({ type: "error", message: (error as Error).message });
        return;
      }

      setMessage({
        type: "success",
        message: "Profile updated successfully!",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full card card-sm">
      <div className="card-body">
        <h2 className="card-title">Profile</h2>
        <form action={handleUpdateProfile} className="flex flex-col gap-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Your name</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="Type here"
              name="name"
              defaultValue={user.user_metadata.name}
            />
            <p className="fieldset-label">Optional</p>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              type="text"
              className="input w-full"
              disabled
              value={user.email}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Number of Urls in the Dashboard
            </legend>
            <input
              type="number"
              className="input validator w-full"
              placeholder="10"
              min={1}
              max={1000}
              name="numberOfTabs"
              defaultValue={user.user_metadata.numberOfTabs}
            />
            <p className="validator-hint">We can show atmost 100 Urls</p>
          </fieldset>
          {message && (
            <div
              role="alert"
              className={`alert alert-soft ${
                message.type === "error" ? "alert-error" : "alert-success"
              }`}
            >
              <span>{message.message}</span>
            </div>
          )}
          <div className="card-actions justify-end">
            <button className="btn btn-outline" type="submit">
              {loading ? (
                <Loader2Icon className="w-4 h-4 mr-2" />
              ) : (
                <SaveIcon className="w-4 h-4 mr-2" />
              )}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
