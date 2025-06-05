import React from "react";
import { Battery, Wifi, Signal, Paperclip } from "lucide-react";

const MobileMail = () => {
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

                    {/* Gmail header */}
                    <div className="bg-gradient-to-r from-[#aa6e7f] to-[#9a5e6f] px-6 py-4 shadow-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md">
                                <span className="text-[#aa6e7f] text-sm font-bold">G</span>
                            </div>
                            <span className="text-white font-semibold text-lg">Gmail</span>
                        </div>
                    </div>

                    {/* Email preview */}
                    <div className="h-[540px] bg-white dark:bg-gray-900 relative px-6 pt-6">
                        {/* Email header */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                                Q2 Marketing Results & Strategy Update
                            </h2>

                            <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#aa6e7f] to-[#9a5e6f] rounded-full flex items-center justify-center shadow-md">
                                    <span className="text-white text-sm font-bold">S</span>
                                </div>
                                <div className="flex-1">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        Sarah Martinez
                                    </span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        sarah.martinez@company.com
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                                </div>
                            </div>
                        </div>

                        {/* Email content preview */}
                        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3 leading-relaxed">
                            <p>Hi Team,</p>
                            <p>
                                I'm excited to share our Q2 marketing campaign results. The numbers are outstanding!
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">Key Highlights:</p>
                            <ul className="space-y-1 ml-4">
                                <li>• 45% increase in website traffic</li>
                                <li>• 32% improvement in conversion rates</li>
                                <li>• 28% growth in social engagement</li>
                            </ul>

                            {/* Attachment preview */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 mt-4 shadow-sm">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#aa6e7f] to-[#9a5e6f] rounded-lg flex items-center justify-center shadow-md">
                                        <Paperclip size={14} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            Q2_Marketing_Report.pdf
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            2.4 MB • PDF Document
                                        </p>
                                    </div>
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

export { MobileMail };
