import { useProjectStore } from "@/lib/store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlatformType } from "@nuvix/console";
import { CreatePlatform } from "../../wizard/_platform_create";
import { Plus, Code, Smartphone, Apple, Monitor, Globe, Laptop } from "lucide-react";
import { Button } from "@/ui/components";

// Platform icons configuration
const platformConfig = {
  web: { icon: <Code className="h-4 w-4" />, label: "Web", type: PlatformType.Web },
  flutterweb: {
    icon: <Globe className="h-4 w-4" />,
    label: "Flutter Web",
    type: PlatformType.Flutterweb,
  },
  android: {
    icon: <Smartphone className="h-4 w-4" />,
    label: "Android",
    type: PlatformType.Android,
  },
  reactnativeandroid: {
    icon: <Smartphone className="h-4 w-4" />,
    label: "React Native Android",
    type: PlatformType.Reactnativeandroid,
  },
  ios: { icon: <Apple className="h-4 w-4" />, label: "iOS", type: PlatformType.Appleios },
  reactnativeios: {
    icon: <Apple className="h-4 w-4" />,
    label: "React Native iOS",
    type: PlatformType.Reactnativeios,
  },
  flutterlinux: {
    icon: <Monitor className="h-4 w-4" />,
    label: "Flutter Linux",
    type: PlatformType.Flutterlinux,
  },
  fluttermacos: {
    icon: <Laptop className="h-4 w-4" />,
    label: "Flutter macOS",
    type: PlatformType.Fluttermacos,
  },
  flutterwindows: {
    icon: <Monitor className="h-4 w-4" />,
    label: "Flutter Windows",
    type: PlatformType.Flutterwindows,
  },
  applemacos: {
    icon: <Apple className="h-4 w-4" />,
    label: "macOS",
    type: PlatformType.Applemacos,
  },
};

// Available platforms for adding
const availablePlatforms = [
  "web",
  "flutterweb",
  "android",
  "reactnativeandroid",
  "ios",
  "reactnativeios",
  "flutterlinux",
  "fluttermacos",
  "flutterwindows",
  "applemacos",
];

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
      icon: <Code className="h-4 w-4" />,
      label: type,
    };

    return (
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-md px-3 py-2 text-sm">
        {config.icon}
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
        <Button
          onClick={togglePlatformOptions}
          variant="primary"
          className={`flex items-center gap-2 ${showPlatformOptions ? "opacity-75" : ""}`}
        >
          <Plus className="h-4 w-4" />
          <span>Add Platform</span>
        </Button>

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
                    <CreatePlatform key={platform} type={config.type}>
                      <Button
                        variant="tertiary"
                        className="flex items-center gap-2"
                        onClick={() => setShowPlatformOptions(false)}
                      >
                        {config.icon}
                        <span>{config.label}</span>
                      </Button>
                    </CreatePlatform>
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
