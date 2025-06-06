import React, { useEffect, useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import { Content } from "node_modules/@chakra-ui/react/dist/types/components/color-picker/namespace";

interface EmailAttachment {
  name: string;
  size: string;
  type: string;
  icon?: React.ReactNode;
}

interface EmailData {
  subject: string;
  senderName: string;
  senderEmail?: string;
  timestamp?: string;
  content: string;
  html?: boolean;
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
  headerColor = "from-accent to-[var(--neutral-solid-strong)]",
}) => {
  const {
    subject,
    senderName,
    html,
    senderEmail = "example@domain.com",
    timestamp = "now",
    content,
    attachments,
    senderAvatar = senderName.charAt(0),
    appName = "Email",
    appIcon = "E",
  } = email;

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(340);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          const body = doc.body;
          const height = body.scrollHeight;
          setIframeHeight(height);
        }
      } catch (err) {
        console.warn("Could not access iframe content:", err);
      }
    };

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, [content]);

  return (
    <>
      <div className={`bg-gradient-to-r ${headerColor} px-6 py-4 shadow-lg`}>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
            <span className="text-[#aa6e7f] text-sm font-bold">{appIcon}</span>
          </div>
          <span className="text-white font-semibold text-lg">{appName}</span>
        </div>
      </div>

      <div className="page-background px-4 pt-4 h-full overflow-x-hidden pb-20">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 text-elipsis">
            {subject}
          </h2>

          <div className="flex items-center space-x-3 mb-4 mt-3 p-3 neutral-background-medium rounded-xl shadow-sm hover:shadow-md transition-shadow">
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

        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3 leading-relaxed">
          {html ? (
            <div className="-mx-4 px-2">
              <iframe
                ref={iframeRef}
                sandbox=""
                srcDoc={content}
                allowTransparency
                allowFullScreen
                style={{
                  width: "100%",
                  height: `${iframeHeight}px`,
                }}
                className="page-background neutral-border-medium rounded-lg "
                title="Email Preview"
              />
            </div>
          ) : (
            content
          )}

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
