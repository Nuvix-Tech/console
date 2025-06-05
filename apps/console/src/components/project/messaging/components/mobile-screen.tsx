import React from "react";
import { Battery, Wifi, Signal } from "lucide-react";

interface MobileScreenProps {
  children: React.ReactNode;
  className?: string;
  statusBarStyle?: "light" | "dark";
  backgroundColor?: string;
  time?: string;
}

const MobileScreen: React.FC<MobileScreenProps> = ({
  children,
  className = "",
  statusBarStyle = "dark",
  backgroundColor = "bg-white dark:bg-gray-900",
  time = "9:41",
}) => {
  const statusBarTextColor =
    statusBarStyle === "light" ? "text-white" : "text-black dark:text-white";

  return (
    <div className="mx-auto max-w-xs">
      {/* iPhone-style mobile frame */}
      <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
        <div className={`${backgroundColor} rounded-[2rem] overflow-hidden`}>
          {/* Status bar */}
          <div
            className={`flex justify-between items-center px-6 py-3 ${statusBarTextColor} text-sm font-medium`}
          >
            <span>{time}</span>
            <div className="flex items-center space-x-1">
              <Signal size={14} className="fill-current" />
              <Wifi size={14} className="fill-current" />
              <Battery size={14} className="fill-current" />
            </div>
          </div>

          {/* Screen content */}
          <div className={`h-[600px] relative ${className}`}>
            {children}

            {/* Home indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="w-36 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MobileScreen };
