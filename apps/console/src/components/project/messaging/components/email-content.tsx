import React from "react";
import { Paperclip } from "lucide-react";

interface EmailAttachment {
  name: string;
  size: string;
  type: string;
  icon?: React.ReactNode;
}

interface EmailData {
  subject: string;
  senderName: string;
  senderEmail: string;
  timestamp: string;
  content: {
    greeting?: string;
    body: string[];
    highlights?: string[];
  };
  attachments?: EmailAttachment[];
  senderAvatar?: string;
  appName?: string;
  appIcon?: string;
}

interface EmailContentProps {
  email: EmailData;
  headerColor?: string;
}

const EmailContent: React.FC<EmailContentProps> = ({
  email,
  headerColor = "from-[#aa6e7f] to-[#9a5e6f]",
}) => {
  const {
    subject,
    senderName,
    senderEmail,
    timestamp,
    content,
    attachments,
    senderAvatar = senderName.charAt(0),
    appName = "Gmail",
    appIcon = "G",
  } = email;

  return (
    <>
      {/* App header */}
      <div className={`bg-gradient-to-r ${headerColor} px-6 py-4 shadow-lg`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md">
            <span className="text-[#aa6e7f] text-sm font-bold">{appIcon}</span>
          </div>
          <span className="text-white font-semibold text-lg">{appName}</span>
        </div>
      </div>

      {/* Email content */}
      <div className="bg-white dark:bg-gray-900 px-6 pt-6 h-full overflow-hidden">
        {/* Email header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
            {subject}
          </h2>

          <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div
              className={`w-10 h-10 bg-gradient-to-br ${headerColor} rounded-full flex items-center justify-center shadow-md`}
            >
              <span className="text-white text-sm font-bold">{senderAvatar}</span>
            </div>
            <div className="flex-1">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {senderName}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">{senderEmail}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{timestamp}</p>
            </div>
          </div>
        </div>

        {/* Email content preview */}
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3 leading-relaxed">
          {content.greeting && <p>{content.greeting}</p>}

          {content.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          {content.highlights && content.highlights.length > 0 && (
            <>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Key Highlights:</p>
              <ul className="space-y-1 ml-4">
                {content.highlights.map((highlight, index) => (
                  <li key={index}>• {highlight}</li>
                ))}
              </ul>
            </>
          )}

          {/* Attachments */}
          {attachments &&
            attachments.map((attachment, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 mt-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 bg-gradient-to-br ${headerColor} rounded-lg flex items-center justify-center shadow-md`}
                  >
                    {attachment.icon || <Paperclip size={14} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {attachment.size} • {attachment.type}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export { EmailContent };
export type { EmailData, EmailAttachment };
