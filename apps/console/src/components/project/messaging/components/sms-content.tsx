import React from "react";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOutgoing: boolean;
}

interface SMSData {
  contactName: string;
  contactStatus: string;
  contactAvatar?: string;
  messages: Message[];
  gradientColor?: string;
}

interface SMSContentProps {
  sms: SMSData;
}

const SMSContent: React.FC<SMSContentProps> = ({ sms }) => {
  const {
    contactName,
    contactStatus,
    contactAvatar = contactName.charAt(0),
    messages,
    gradientColor = "from-[#aa6e7f] to-[#9a5e6f]",
  } = sms;

  return (
    <div className="bg-white dark:bg-gray-900 px-6 pt-4 h-full">
      {/* SMS header */}
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div
          className={`w-8 h-8 bg-gradient-to-br ${gradientColor} rounded-full flex items-center justify-center shadow-md`}
        >
          <span className="text-white text-sm font-bold">{contactAvatar}</span>
        </div>
        <div>
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {contactName}
          </span>
          <p className="text-xs text-gray-500 dark:text-gray-400">{contactStatus}</p>
        </div>
      </div>

      {/* Message conversation */}
      <div className="space-y-4 pb-20 overflow-y-auto max-h-[480px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isOutgoing ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                ${
                  message.isOutgoing
                    ? `bg-gradient-to-br ${gradientColor} rounded-3xl rounded-br-lg shadow-md`
                    : "bg-gray-100 dark:bg-gray-800 rounded-3xl rounded-bl-lg shadow-sm"
                }
                px-4 py-3 max-w-xs transform hover:scale-105 transition-transform duration-200
              `}
            >
              <p
                className={`text-sm leading-relaxed ${
                  message.isOutgoing ? "text-white" : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {message.text}
              </p>
              <span
                className={`text-xs mt-1 block ${
                  message.isOutgoing ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Typing indicator (optional) */}
      <div className="absolute bottom-20 left-6">
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 shadow-sm">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {contactName} is typing...
          </span>
        </div>
      </div>
    </div>
  );
};

export { SMSContent };
export type { SMSData, Message };
