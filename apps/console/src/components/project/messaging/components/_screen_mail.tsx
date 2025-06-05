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
    content: {
      greeting: "Hi Team,",
      body: [
        "I'm excited to share our Q2 marketing campaign results. The numbers are outstanding!",
      ],
      highlights: [
        "45% increase in website traffic",
        "32% improvement in conversion rates",
        "28% growth in social engagement",
      ],
    },
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
    <MobileScreen>
      <EmailContent email={email} />
    </MobileScreen>
  );
};

export { MobileMail };
