import React from "react";
import { MobileScreen } from "./mobile-screen";
import { SMSContent, type SMSData } from "./sms-content";

interface MobileSMSProps {
  sms?: SMSData;
}

const MobileSMS: React.FC<MobileSMSProps> = ({
  sms = {
    contactName: "John",
    contactStatus: "Active now",
    contactAvatar: "J",
    messages: [
      {
        id: "1",
        text: "Hey! How's your day going?",
        timestamp: "2:30 PM",
        isOutgoing: false,
      },
      {
        id: "2",
        text: "Pretty good! Just finished work. How about you?",
        timestamp: "2:32 PM",
        isOutgoing: true,
      },
      {
        id: "3",
        text: "Great! Want to grab coffee later?",
        timestamp: "2:35 PM",
        isOutgoing: false,
      },
    ],
  },
}) => {
  return (
    <MobileScreen>
      <SMSContent sms={sms} />
    </MobileScreen>
  );
};

export { MobileSMS };
