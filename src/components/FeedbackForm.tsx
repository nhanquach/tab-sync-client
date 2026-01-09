import React from "react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { Loop } from "@mui/icons-material";
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
import { cn } from "@/lib/utils";

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

  const inputClasses = "bg-transparent border-md-sys-color-outline focus:ring-md-sys-color-primary focus:border-md-sys-color-primary placeholder:text-md-sys-color-on-surface-variant/50 text-md-sys-color-on-surface";
  const labelClasses = "text-md-sys-color-on-surface font-medium";

  return (
    <form className="space-y-4" onSubmit={handleSendFeedback}>
      {message && (
        <Alert className="bg-green-100 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-300">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>Oops, are you forgetting something? 👇🏼</AlertDescription>
        </Alert>
      )}

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="feedback-type" className={labelClasses}>Lemme tell you about</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="feedback-type" className={cn(inputClasses)}>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-md-sys-color-surface-container text-md-sys-color-on-surface border-md-sys-color-outline/50">
            <SelectItem value="bug">a bug</SelectItem>
            <SelectItem value="suggestion">a feature suggestion</SelectItem>
            <SelectItem value="other">something else</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="feedback-description" className={labelClasses}>Description</Label>
        <Textarea
          id="feedback-description"
          placeholder=" More detail"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={cn("min-h-[150px] font-sans text-sm", inputClasses)}
          required
        />
      </div>

      <Button
        className="w-full mt-2 bg-md-sys-color-primary text-md-sys-color-on-primary hover:bg-md-sys-color-primary/90 rounded-full"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loop className="animate-spin" fontSize="small" />
        ) : (
          "Send"
        )}
      </Button>
    </form>
  );
};

export default FeedbackForm;
