import { useProjectStore } from "@/lib/store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Platform icons configuration
const platformConfig = {
  web: { icon: "icon-code", label: "Web" },
  android: { icon: "icon-android", label: "Android" },
  ios: { icon: "icon-ios", label: "iOS" },
  desktop: { icon: "icon-desktop", label: "Desktop" }
};

// Available platforms for adding
const availablePlatforms = ["web", "android", "ios", "desktop"];

export const TopLeftInfo = () => {
  const project = useProjectStore.use.project?.();
  const [showPlatformOptions, setShowPlatformOptions] = useState(false);

  // Function to toggle platform options
  const togglePlatformOptions = () => {
    setShowPlatformOptions(!showPlatformOptions);
  };

  // Platform icon component
  const PlatformIcon = ({ type, name }: { type: string; name: string }) => {
    const config = platformConfig[type as keyof typeof platformConfig] || {
      icon: "icon-view-grid",
      label: type
    };

    return (
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-md px-3 py-2 text-sm">
        <span className={config.icon} aria-hidden="true"></span>
        <span>{name || config.label}</span>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Platforms display */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project?.platforms?.length ? (
          project.platforms.map((platform, index) => (
            <PlatformIcon key={platform.$id || index} type={platform.type} name={platform.name} />
          ))
        ) : (
          <div className="text-sm text-gray-500">No platforms added yet</div>
        )}
      </div>

      {/* Add platform section */}
      <div className="mt-4">
        <button
          onClick={togglePlatformOptions}
          className={`flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-2 text-sm transition-all ${showPlatformOptions ? 'opacity-75' : ''}`}
        >
          <span className="icon-plus" aria-hidden="true"></span>
          <span>Add Platform</span>
        </button>

        {/* Platform selection options with slide animation */}
        <AnimatePresence>
          {showPlatformOptions && (
            <motion.div
              className="absolute left-0 right-0 mt-2 p-2 bg-white dark:bg-slate-900 rounded-md shadow-lg z-10 border border-slate-200 dark:border-slate-700"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex flex-wrap gap-2">
                {availablePlatforms.map((platform) => {
                  const config = platformConfig[platform as keyof typeof platformConfig];
                  return (
                    <button
                      key={platform}
                      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md px-3 py-2 text-sm transition-all"
                      onClick={() => {
                        // Here you would implement the logic to add this platform
                        // For now, just close the options display
                        setShowPlatformOptions(false);
                      }}
                    >
                      <span className={config.icon} aria-hidden="true"></span>
                      <span>{config.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
