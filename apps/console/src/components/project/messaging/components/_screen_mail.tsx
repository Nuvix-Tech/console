import React from "react";
import { MobileScreen } from "./mobile-screen";
import { EmailContent, type EmailData } from "./email-content";

interface MobileMailProps {
  email?: EmailData;
}

const MobileMail: React.FC<MobileMailProps> = ({
  email = {
    subject: "Q2 Marketing Results & Strategy Update",
    senderName: "Sarah Martinez",
    senderEmail: "sarah.martinez@company.com",
    timestamp: "2 hours ago",
    content: "",
    attachments: [
      {
        name: "Q2_Marketing_Report.pdf",
        size: "2.4 MB",
        type: "PDF Document",
      },
    ],
    senderAvatar: "S",
  },
}) => {
  return (
    <div className="max-w-xs space-y-3">
      <MobileScreen>
        <EmailContent email={email} />
      </MobileScreen>

      <p className="text-xs warning-on-background-medium text-center">
        Some interactive features (e.g., scripts, forms) may not work in preview mode.
      </p>
    </div>
  );
};

export { MobileMail };
