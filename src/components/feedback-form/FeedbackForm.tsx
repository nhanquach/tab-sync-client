"use client";

import { useState } from "react";
import { sendFeedback } from "./actions";

import { IUser } from "../../interfaces/IUser";

type FeedbackType = {
  value: string;
  label: string;
};

type FeedbackFormProps = {
  user: IUser;
  closeFeedbackDialog: () => void;
};

const feedbackTypes = [
  { value: "bug-report", label: "Bug Report" },
  { value: "feature-request", label: "Feature Request" },
  { value: "account-deletion", label: "Account Deletion Request" },
];

const FeedBackForm = ({ user, closeFeedbackDialog }: FeedbackFormProps) => {
  const [open, setOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(
    feedbackTypes[0]
  );
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);

      formData.set("type", feedbackType.value);
      formData.set("description", feedbackMessage);
      formData.set("user_id", user.id);

      const { error } = await sendFeedback(formData);

      if (error) {
        throw error;
      }

      setMessage("Feedback sent successfully!");
      setTimeout(() => {
        setMessage("");
        setFeedbackMessage("");
        closeFeedbackDialog();
      }, 3000);
    } catch (error) {
      console.error(error);
      setMessage((error as Error)?.message || "Failed to send Feedback");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  const selectFeedbackType = (type: FeedbackType) => {
    setFeedbackType(type);
    // Close the popover
    setOpen(false);
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="feedbackType">Feedback Type</label>
        <div className="w-full">
          <button
            type="button"
            role="button"
            className="select w-full"
            popoverTarget="feedbackType"
            style={{ anchorName: "--anchor-1" } as React.CSSProperties}
            onClick={() => setOpen(true)}
          >
            {feedbackType.label || "Select Feedback Type"}
          </button>

          {open && (
            <ul
              className="dropdown menu rounded-box bg-transparent backdrop-blur-xl shadow-sm"
              popover="auto"
              id="feedbackType"
              style={{ positionAnchor: "--anchor-1" } as React.CSSProperties}
            >
              {feedbackTypes.map((type) => (
                <li key={type.value}>
                  <a
                    onClick={() => {
                      selectFeedbackType(type);
                    }}
                  >
                    {type.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="feedbackMessage">Your Feedback</label>
        <textarea
          id="feedbackMessage"
          name="feedbackMessage"
          placeholder="Please provide details about your feedback..."
          value={feedbackMessage}
          onChange={(e) => setFeedbackMessage(e.target.value)}
          className="min-h-[120px] textarea w-full"
          required
        />
      </div>

      <p className="text-sm">{message}</p>

      <div className="modal-action pt-2">
        <button
          className="btn btn-ghost"
          type="button"
          disabled={isSubmitting}
          onClick={closeFeedbackDialog}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary btn-ghost"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </form>
  );
};

export default FeedBackForm;
