import { Button, Chip, Column, Heading, Line, Row } from "@/ui/components";
import { useProjectStore } from "@/lib/store";
import { IDChip } from "@/components/others";
import { useRouter } from "@bprogress/next";
import { AnimatePresence, motion } from "framer-motion";
import { Apple, Code, Smartphone } from "lucide-react";
import { FaFlutter } from "react-icons/fa6";
import { CreatePlatform } from "@/components/wizard/_platform_create";
import { useState } from "react";

export const TopInfo = () => {
  const [showPlatformOptions, setShowPlatformOptions] = useState(false);
  const togglePlatformOptions = () => {
    setShowPlatformOptions(!showPlatformOptions);
  };
  const project = useProjectStore.use.project?.();
  const { push } = useRouter();

  return (
    <Column
      zIndex={1}
      maxWidth={"m"}
      fill
      horizontal="start"
      vertical="start"
      gap="16"
      padding="24"
    >
      <Row vertical="center" horizontal="start" fillWidth gap="8">
        <Heading variant="heading-strong-xl">{project?.name}</Heading>
        <IDChip id={project?.$id} />
      </Row>
      <Row vertical="center" horizontal="start" fillWidth gap="8">
        {/* {(project?.platforms.length ?? 0) > 0 ? (
          <>
            <Chip
              height={2.3}
              paddingX="12"
              selected={false}
              prefixIcon={<span className="icon-view-grid" aria-hidden="true"></span>}
              label={`${project?.platforms.length ?? 0} ${project?.platforms.length === 1 ? "platform" : "platforms"}`}
              iconButtonProps={{
                tooltip: "More info",
                tooltipPosition: "top",
              }}
            />

            <Line vert height={1.5} marginX="24" background="neutral-alpha-strong" />
          </>
        ) : null} */}
        {project?.platforms &&
          project?.platforms.slice(0, 3).map((platform) => (
            <Chip
              key={platform.$id}
              height={2.3}
              paddingX="12"
              selected={false}
              prefixIcon={<span className={platformIcon(platform.type)} aria-hidden="true"></span>}
              onClick={() => push(`/project/${project?.$id}/platforms/${platform.$id}`)}
              label={platform.name}
              iconButtonProps={{
                tooltip: "More info",
                tooltipPosition: "top",
              }}
            />
          ))}

        {project?.platforms.length && project?.platforms.length > 3 ? (
          <Chip
            height={2.3}
            paddingX="12"
            selected={false}
            onClick={() => push(`/project/${project?.$id}/platforms`)}
            label={`+${project?.platforms.length - 3} more`}
            iconButtonProps={{
              tooltip: "More info",
              tooltipPosition: "top",
            }}
          />
        ) : null}
        { }

        <Chip
          height={2.3}
          paddingX="12"
          selected={false}
          prefixIcon={"plus"}
          onClick={togglePlatformOptions}
          label={"Add platform"}
          iconButtonProps={{
            tooltip: "Add platform",
            tooltipPosition: "top",
          }}
        />
      </Row>
      <Row>
        <AnimatePresence>
          {showPlatformOptions && (
            <motion.div
              className="absolute left-0 right-0 z-10"
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
                      <Chip
                        height={2.3}
                        paddingX="12"
                        selected={false}
                        prefixIcon={config.icon}
                        label={config.label}
                      />
                    </CreatePlatform>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Row>
    </Column>
  );
};

const platformIcon = (platform: string) => {
  switch (platform) {
    case "web":
      return "icon-code";
    case "android":
      return "icon-android";
    case "ios":
      return "icon-ios";
    case "desktop":
      return "icon-desktop";
    default:
      return "icon-view-grid";
  }
};

const availablePlatforms = ["web", "flutter", "android", "reactnative", "ios"];

const platformConfig = {
  web: { icon: <Code className="h-4 w-4" />, label: "Web", type: "web" },
  flutter: {
    icon: <FaFlutter className="h-4 w-4" />,
    label: "Flutter",
    type: "flutter",
  },
  android: {
    icon: <Smartphone className="h-4 w-4" />,
    label: "Android",
    type: "android",
  },
  reactnative: {
    icon: <Smartphone className="h-4 w-4" />,
    label: "React Native",
    type: "reactnative",
  },
  ios: { icon: <Apple className="h-4 w-4" />, label: "iOS", type: "ios" },
} as const;
