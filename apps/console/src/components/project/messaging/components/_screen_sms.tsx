import React from "react";
import { Battery, Wifi, Signal } from "lucide-react";

const MobileSMS = () => {
  return (
    <div className="mx-auto max-w-xs">
      {/* iPhone-style mobile frame */}
      <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden">
          {/* Status bar */}
          <div className="flex justify-between items-center px-6 py-3 text-black dark:text-white text-sm font-medium">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <Signal size={14} className="fill-current" />
              <Wifi size={14} className="fill-current" />
              <Battery size={14} className="fill-current" />
            </div>
          </div>

          {/* Screen content */}
          <div className="h-[600px] bg-white dark:bg-gray-900 relative px-6 pt-4">
            {/* SMS header */}
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-8 h-8 bg-gradient-to-br from-[#aa6e7f] to-[#9a5e6f] rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">J</span>
              </div>
              <div>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">John</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Active now</p>
              </div>
            </div>

            {/* Message conversation */}
            <div className="space-y-4">
              {/* Received message */}
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl rounded-bl-lg px-4 py-3 max-w-xs shadow-sm">
                  <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                    Hey! How's your day going?
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                    2:30 PM
                  </span>
                </div>
              </div>

              {/* Sent message */}
              <div className="flex justify-end">
                <div className="bg-gradient-to-br from-[#aa6e7f] to-[#9a5e6f] rounded-3xl rounded-br-lg px-4 py-3 max-w-xs shadow-md">
                  <p className="text-sm text-white leading-relaxed">
                    Pretty good! Just finished work. How about you?
                  </p>
                  <span className="text-xs text-white/80 mt-1 block">2:32 PM</span>
                </div>
              </div>

              {/* Received message */}
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl rounded-bl-lg px-4 py-3 max-w-xs shadow-sm">
                  <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                    Great! Want to grab coffee later?
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                    2:35 PM
                  </span>
                </div>
              </div>
            </div>

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

export { MobileSMS };
