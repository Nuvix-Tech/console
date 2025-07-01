import Link from "next/link";
import { PropsWithChildren } from "react";

import { AlertDescription, AlertTitle, Alert } from "@nuvix/sui/components/alert";
import { Button } from "@nuvix/sui/components/button";
import { TriangleAlertIcon } from "lucide-react";

export interface AlertErrorProps {
  projectRef?: string;
  subject?: string;
  error?: { message: string } | null;
  className?: string;
  showIcon?: boolean;
}

const AlertError = ({
  projectRef,
  subject,
  error,
  className,
  showIcon = true,
  children,
}: PropsWithChildren<AlertErrorProps>) => {
  const subjectString = subject?.replace(/ /g, "%20");
  let href = `/support/new?category=dashboard_bug`;

  if (projectRef) href += `&ref=${projectRef}`;
  if (subjectString) href += `&subject=${subjectString}`;
  if (error) href += `&error=${error.message}`;

  const formattedErrorMessage = error?.message?.includes("503")
    ? "503 Service Temporarily Unavailable"
    : error?.message;

  return (
    <Alert className={className} variant="warning" title={subject}>
      {showIcon && <TriangleAlertIcon className="h-4 w-4" strokeWidth={2} />}
      <AlertTitle className="text-foreground">{subject}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 break-words">
        <div>
          {error?.message && <p className="text-left">Error: {formattedErrorMessage}</p>}
          <p className="text-left">
            Try refreshing your browser, but if the issue persists for more than a few minutes,
            please reach out to us via support.
          </p>
        </div>
        {children}
        <Button asChild size={"sm"} className="w-min">
          <Link href={href}>Contact support</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default AlertError;
