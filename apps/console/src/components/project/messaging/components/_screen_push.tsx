import React from "react";
import { Battery, Wifi, Signal } from "lucide-react";

const MobileNotification = () => {
  return (
    <div className="mx-auto max-w-xs">
      {/* iPhone-style mobile frame */}
      <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
        <div className="bg-gray-950 rounded-[2rem] overflow-hidden">
          {/* Status bar */}
          <div className="flex justify-between items-center px-6 py-3 text-white text-sm font-medium">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <Signal size={14} className="fill-white" />
              <Wifi size={14} className="fill-white" />
              <Battery size={14} className="fill-white" />
            </div>
          </div>

          {/* Screen content - Black background */}
          <div className="h-[600px] bg-gray-950 relative px-6 pt-4">
            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-28 h-7 bg-gray-800 rounded-full shadow-inner"></div>
            </div>

            {/* Push notification preview */}
            <div className="mt-12">
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-200/20 dark:border-gray-700/30">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#aa6e7f] to-[#9a5e6f] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white text-sm font-bold">M</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        Messages
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">now</span>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">
                      John Doe
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      Hey! Are we still on for the meeting tomorrow?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="w-36 h-1.5 bg-white/60 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MobileNotification };
