import { Button, Chip, Column, Heading, Line, Row } from "@/ui/components";
import { useProjectStore } from "@/lib/store";
import { IDChip } from "@/components/others";
import { useRouter } from "@bprogress/next";
import { AnimatePresence, motion } from "framer-motion";
import { Apple, Code, Code2, Smartphone } from "lucide-react";
import { FaFlutter, FaUnity } from "react-icons/fa6";
import { CreatePlatform } from "@/components/wizard";
import { useState } from "react";
import { PlatformType } from "@nuvix/console";

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
              prefixIcon={platformIcon(platform.type as PlatformType)}
              onClick={() => push(`/project/${project?.$id}/s/apps/${platform.$id}`)}
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
            onClick={() => push(`/project/${project?.$id}/s/apps`)}
            label={`+${project?.platforms.length - 3} more`}
            iconButtonProps={{
              tooltip: "More info",
              tooltipPosition: "top",
            }}
          />
        ) : null}
      </Row>
      <Row>
        <AnimatePresence>
          {showPlatformOptions && (
            <motion.div
              className="absolute left-auto right-[120px] z-[1] bottom-3"
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
      <div className="absolute bottom-3 right-3 z-[2]">
        <Chip
          height={2.3}
          paddingX="12"
          selected={false}
          prefixIcon={showPlatformOptions ? "close" : "plus"}
          onClick={togglePlatformOptions}
          label={showPlatformOptions ? "Cancel" : "Add app"}
          iconButtonProps={{
            tooltip: showPlatformOptions ? "Cancel" : "Add app",
            tooltipPosition: "top",
          }}
        />
      </div>
    </Column>
  );
};

const platformIcon = (platform: PlatformType) => {
  const Icon = () => {
    switch (platform) {
      case PlatformType.Web:
        return Code2;
      case PlatformType.Android:
        return Smartphone;
      case PlatformType.Flutterandroid:
      case PlatformType.Flutterios:
      case PlatformType.Flutterweb:
      case PlatformType.Fluttermacos:
      case PlatformType.Flutterwindows:
      case PlatformType.Flutterlinux:
        return FaFlutter;
      case PlatformType.Appleios:
      case PlatformType.Applemacos:
      case PlatformType.Applewatchos:
      case PlatformType.Appletvos:
        return Apple;
      case PlatformType.Reactnativeandroid:
      case PlatformType.Reactnativeios:
        return Smartphone;
      case PlatformType.Unity:
        return FaUnity;
      default:
        return Code;
    }
  };
  const IconComponent = Icon();
  return <IconComponent className="h-4 w-4" />;
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
