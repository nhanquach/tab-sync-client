import React, { useState } from "react";
import { changePassword } from "../clients";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IChangePasswordFormProps {
  handleCloseChangePasswordDialog: () => void;
}

const ChangePasswordForm: React.FC<IChangePasswordFormProps> = ({
  handleCloseChangePasswordDialog,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [repeatedNewPassword, setRepeatedNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPassword(event.target.value as string);
  };
  const handleRepeatedNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRepeatedNewPassword(event.target.value as string);
  };

  const handleChangePassword = async () => {
    if (!newPassword || !repeatedNewPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== repeatedNewPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    const result = await changePassword({ newPassword });

    if (result?.error) {
      setError(result.error?.message as string);
      setIsLoading(false);
      return;
    }

    setError("");
    setMessage("Your password has been changed.");
    setIsLoading(false);

    setTimeout(() => {
      handleCloseChangePasswordDialog();
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="repeated-new-password">Repeat the new password</Label>
          <Input
            id="repeated-new-password"
            type="password"
            autoComplete="new-password"
            value={repeatedNewPassword}
            onChange={handleRepeatedNewPasswordChange}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert>
             <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-2 md:flex-row md:justify-end">
        <Button
            className="w-full md:w-auto rounded-full"
            onClick={handleChangePassword}
            disabled={isLoading}
        >
            {isLoading ? "Changing..." : "Change password"}
        </Button>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
