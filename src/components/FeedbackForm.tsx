import React from "react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
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
import { HandshakeOutlined } from "@mui/icons-material";

interface IFeedbackProps {
  sendFeedback: (type: string, description: string) => void;
}

const FeedbackForm: React.FC<IFeedbackProps> = ({ sendFeedback }) => {
  const [type, setType] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSendFeedback = async () => {
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <HandshakeOutlined className="text-primary text-4xl" />
        <h4 className="text-2xl font-semibold tracking-tight">Hi there 🙌🏼</h4>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>Thank you for trying out! We'd love to hear from you.</p>
        <p>All feedback are welcome!</p>
      </div>

      {message && (
        <Alert>
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
        <Label htmlFor="feedback-type">Lemme tell you about</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="feedback-type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bug">a bug</SelectItem>
            <SelectItem value="suggestion">a feature suggestion</SelectItem>
            <SelectItem value="other">something else</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full gap-1.5">
        <Textarea
          placeholder=" More detail"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[150px] font-sans text-sm"
          required
        />
      </div>

      <Button
        className="w-full mt-2"
        onClick={handleSendFeedback}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send"}
      </Button>

      <div className="text-center text-secondary-foreground my-4">
        <p>
          Need more help?&nbsp;
          <a
            href="mailto:qtrongnhan+tabsync+support@gmail.com?subject=[TabSync]"
            className="text-primary hover:underline"
          >
            Contact us via email
          </a>
        </p>
      </div>
    </div>
  );
};

export default FeedbackForm;
