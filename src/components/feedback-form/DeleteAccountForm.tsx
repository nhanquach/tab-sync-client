"use client";

import { useState } from "react";
import { sendFeedback } from "./actions";

import { IUser } from "../../interfaces/IUser";

type FeedbackType = {
  value: string;
  label: string;
};

type DeleteAccountFormProps = {
  user: IUser;
  closeDialog: () => void;
};

const feedbackTypes = [
  { value: "account-deletion", label: "Account Deletion Request" },
];

const DeleteAccountForm = ({ user, closeDialog }: DeleteAccountFormProps) => {
  const feedbackType = feedbackTypes[0];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);

      formData.set("type", feedbackType.value);
      formData.set("user_id", user.id);

      const { error } = await sendFeedback(formData);

      if (error) {
        throw error;
      }

      setMessage("Your account will be deleted in 72 hours.");
      setTimeout(() => {
        setMessage("");
        closeDialog();
      }, 3000);
    } catch (error) {
      console.error(error);
      setMessage((error as Error)?.message || "Failed to send request.");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        Delete your account from our system.
        <br />
        Please allow upto 72 hours for the deletion to take place.
        <br />
        <em>Thank you for using our service. ❤️</em>
      </div>

      <p className="text-sm">{message}</p>

      <div className="modal-action pt-2">
        <button
          className="btn btn-ghost"
          type="button"
          disabled={isSubmitting}
          onClick={closeDialog}
        >
          Cancel
        </button>
        <button
          className="btn btn-error btn-ghost"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Delete My Account"}
        </button>
      </div>
    </form>
  );
};

export default DeleteAccountForm;
