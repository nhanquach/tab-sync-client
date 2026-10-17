import React from "react";
import { Loader2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface IFeedbackProps {
  sendFeedback: (type: string, description: string) => void;
}

const FeedbackForm: React.FC<IFeedbackProps> = ({ sendFeedback }) => {
  const [type, setType] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (type && description) {
      setMessage("Your feedback has been sent. Thank you!");
      await sendFeedback(type, description);

      setType("");
      setDescription("");
    } else {
      setError("Oops, are you forgetting something?");
      setMessage("");
    }

    setIsLoading(false);
  };

  return (
    <form className="space-y-3" onSubmit={handleSendFeedback}>
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>Please pick a type and add a description.</AlertDescription>
        </Alert>
      )}

      <div className="grid w-full gap-1.5">
        <Label htmlFor="feedback-type">Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="feedback-type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="suggestion">Feature suggestion</SelectItem>
            <SelectItem value="other">Something else</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="feedback-description">Description</Label>
        <Textarea
          id="feedback-description"
          placeholder="What happened, or what would you like to see?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[120px]"
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="min-w-[88px]">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-label="Sending" /> : "Send"}
        </Button>
      </div>
    </form>
  );
};

export default FeedbackForm;
