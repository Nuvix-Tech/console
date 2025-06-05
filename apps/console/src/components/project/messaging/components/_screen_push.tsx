import React from "react";
import { MobileScreen } from "./mobile-screen";
import { PushNotificationContent, type PushNotificationData } from "./push-notification-content";

interface MobileNotificationProps {
  notification?: PushNotificationData;
}

const MobileNotification: React.FC<MobileNotificationProps> = ({
  notification = {
    appName: "Messages",
    appIcon: "M",
    senderName: "John Doe",
    message: "Hey! Are we still on for the meeting tomorrow?",
    timestamp: "now",
    iconBackgroundColor: "from-[#aa6e7f] to-[#9a5e6f]",
  },
}) => {
  return (
    <MobileScreen statusBarStyle="light" backgroundColor="bg-gray-950">
      <PushNotificationContent notification={notification} />
    </MobileScreen>
  );
};

export { MobileNotification };
