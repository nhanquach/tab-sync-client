"use client";

import { KeyIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { updatePassword } from "./actions";

const ChangePasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; message: string }>();

  const handleUpdatePassword = async (formData: FormData) => {
    try {
      setLoading(true);
      const { user: _user } = await updatePassword(formData);

      setMessage({
        type: "success",
        message: "Password updated successfully!",
      });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", message: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full card card-sm">
      <div className="card-body">
        <h2 className="card-title">Change Password</h2>
        <form action={handleUpdatePassword} className="flex flex-col gap-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">New Password</legend>
            <input
              type="password"
              className="input w-full"
              placeholder="Type here"
              name="newPassword"
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Repeat New Password</legend>
            <input
              type="password"
              className="input w-full"
              placeholder="Type here"
              name="repeatNewPassword"
            />
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
            <button className="btn btn-outline">
              {loading ? (
                <Loader2Icon className="h-4 w-4 mr-2" />
              ) : (
                <KeyIcon className="h-4 w-4 mr-2" />
              )}
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
