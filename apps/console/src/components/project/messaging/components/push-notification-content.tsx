import React from "react";

interface PushNotificationData {
  appName: string;
  appIcon: string;
  senderName: string;
  message: string;
  timestamp?: string;
  iconBackgroundColor?: string;
}

interface PushNotificationContentProps {
  notification: PushNotificationData;
  showDynamicIsland?: boolean;
}

const PushNotificationContent: React.FC<PushNotificationContentProps> = ({
  notification,
  showDynamicIsland = true,
}) => {
  const {
    appName,
    appIcon,
    senderName,
    message,
    timestamp = "now",
    iconBackgroundColor = "from-[#aa6e7f] to-[#9a5e6f]",
  } = notification;

  return (
    <div className="bg-gray-950 px-6 pt-4 h-full">
      {/* Dynamic Island */}
      {showDynamicIsland && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-28 h-7 bg-gray-800 rounded-full shadow-inner"></div>
        </div>
      )}

      {/* Push notification preview */}
      <div className="mt-12">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-200/20 dark:border-gray-700/30 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-start space-x-3">
            <div
              className={`w-8 h-8 bg-gradient-to-br ${iconBackgroundColor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}
            >
              <span className="text-white text-sm font-bold">{appIcon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {appName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{timestamp}</span>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">{senderName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PushNotificationContent };
export type { PushNotificationData };
