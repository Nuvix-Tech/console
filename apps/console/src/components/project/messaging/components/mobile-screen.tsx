import React, { useEffect, useState } from "react";
import { Battery, Wifi, Signal } from "lucide-react";

interface MobileScreenProps {
  children: React.ReactNode;
  className?: string;
  statusBarStyle?: "light" | "dark";
  backgroundColor?: string;
}

const MobileScreen: React.FC<MobileScreenProps> = ({
  children,
  className = "",
  statusBarStyle = "dark",
  backgroundColor = "page-background",
}) => {
  const [time, setTime] = useState(new Date());
  const statusBarTextColor =
    statusBarStyle === "light" ? "text-white" : "text-black dark:text-white";

  useEffect(() => {
    const intervel = setInterval(() => setTime(new Date()), 1000 * 60);
    return () => {
      clearInterval(intervel);
    };
  }, []);

  return (
    <div className="max-w-xs relative min-w-xs">
      {/* iPhone-style mobile frame */}
      <div className="neutral-background-strong rounded-[2.5rem] p-2 shadow-2xl">
        <div className={`${backgroundColor} rounded-[2rem] overflow-hidden`}>
          {/* Status bar */}
          <div
            className={`flex justify-between items-center px-6 py-3 ${statusBarTextColor} text-sm font-medium`}
          >
            <span>
              {time.getHours()}:{time.getMinutes()}
            </span>
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="w-28 h-7 bg-[var(--neutral-alpha-medium)]  rounded-full shadow-inner" />
            </div>
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
              <div className="w-36 h-1.5 bg-[var(--neutral-alpha-medium)] rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MobileScreen };
