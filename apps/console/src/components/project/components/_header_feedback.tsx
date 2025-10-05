import { useState } from "react";
import { useLocalStorageQuery } from "@/hooks/useLocalStorage";
import { platformClient } from "@/lib/sdk";
import { Popover, PopoverContent, PopoverTrigger } from "@nuvix/sui/components/popover";
import { Button, Icon, Text, Textarea } from "@nuvix/ui/components";

interface FeedbackResponse {
  success: boolean;
  message?: string;
}

export const FeedbackButton = () => {
  const [lastAttempt, setLastAttempt] = useLocalStorageQuery<number>("nx_last_feedback_prompt", 0);

  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setFeedback("");
    setError(null);
    setSuccess(false);
  };

  const onSubmit = async () => {
    if (!feedback.trim()) {
      setError("Please enter your feedback");
      return;
    }

    if (feedback.length > 1000) {
      setError("Feedback must be less than 1000 characters");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const url = new URL(platformClient.config.endpoint + "/internal/feedback");

      const headers = {
        "content-type": "application/json",
      };

      const payload = {
        content: feedback.trim(),
      };

      const res = (await platformClient.call("post", url, headers, payload)) as FeedbackResponse;

      if (res.success) {
        setSuccess(true);
        setLastAttempt(Date.now());
        setTimeout(() => {
          setIsOpen(false);
          resetForm();
        }, 2000);
      } else {
        setError(res.message || "Failed to submit feedback");
      }
    } catch (err: any) {
      console.error("Feedback submission error:", err.message);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const canSubmit = feedback.trim().length > 0 && !isSubmitting;

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button size="s" variant="secondary" className="bg-transparent">
          Feedback
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-[300px]">
        <div className="p-0 !space-y-4">
          {success ? (
            <div className="text-center space-y-2">
              <Icon
                name="checkCircle"
                className="text-success [&_svg]:size-28 [&_svg]:!fill-(--success-on-background-weak)"
              />
              <Text as={"p"} variant="body-strong-m" onBackground="success-weak">
                Thank you for your feedback!
              </Text>
              <Text as={"p"} variant="body-default-xs" onBackground="neutral-medium">
                We appreciate you taking the time to help us improve.
              </Text>
            </div>
          ) : (
            <>
              <Text as={"p"} variant="body-strong-s" onBackground="neutral-strong">
                We'd love to hear your thoughts! Please share your feedback with us.
              </Text>

              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                innerClassName="!rounded-xs"
                placeholder="Your feedback..."
                maxLength={1000}
                rows={4}
              />

              {error && (
                <Text variant="body-default-s" className="text-red-500">
                  {error}
                </Text>
              )}

              <Button
                size="s"
                variant="primary"
                className="mt-2 w-full"
                onClick={onSubmit}
                disabled={!canSubmit}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
