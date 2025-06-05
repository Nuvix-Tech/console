import React from "react";

interface PushNotificationData {
  appIcon: string;
  senderName: string;
  title: string;
  message: string;
  timestamp?: string;
  iconBackgroundColor?: string;
}

interface PushNotificationContentProps {
  notification: PushNotificationData;
}

const PushNotificationContent: React.FC<PushNotificationContentProps> = ({ notification }) => {
  const {
    appIcon,
    title,
    senderName,
    message,
    timestamp = "now",
    iconBackgroundColor = "from-accent to-[var(--neutral-solid-strong)]",
  } = notification;

  return (
    <div className="page-background px-4 pt-4 h-full">
      <div className="mt-12">
        <div className="neutral-background-medium backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-200/20 dark:border-gray-700/30 transform hover:scale-105 transition-transform duration-200">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 bg-gradient-to-br ${iconBackgroundColor} rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}
                >
                  <span className="text-white text-xs font-bold">{appIcon}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {senderName}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{timestamp}</span>
            </div>
            <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold line-clamp-1 text-elipsis">
              {title}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 text-elipsis word-break">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PushNotificationContent };
export type { PushNotificationData };
