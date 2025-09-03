import { Background, Chip, Column, Heading, Row } from "@nuvix/ui/components";
import { useProjectStore } from "@/lib/store";
import { IDChip } from "@/components/others";
import { useRouter } from "@bprogress/next";
import { AnimatePresence, motion } from "framer-motion";
import { Apple, Code, Code2, Smartphone } from "lucide-react";
import { FaApple, FaFlutter, FaUnity } from "react-icons/fa6";
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
    <Row zIndex={1} fill horizontal="start" vertical="start" gap="16" padding="24">
      <Row vertical="center" horizontal="start" fillWidth gap="8">
        <Heading variant="heading-strong-l">{project?.name}</Heading>
        <IDChip id={project?.$id} />
      </Row>
      <Row horizontal="start" fillWidth gap="8" position="relative" minHeight={14}>
        {/* <Background
          zIndex={0}
          position="absolute"
          color="neutral-alpha-weak"
          mask={{ cursor: false, radius: 10 }}
          gradient={{
            colorEnd: "static-transparent",
            colorStart: "neutral-alpha-weak",
            display: true,
            height: 100,
            opacity: 80,
            tilt: 170,
            width: 100,
            x: 0,
            y: 0,
          }}
          dots={{
            color: "neutral-alpha-medium",
            display: true,
            opacity: 40,
            size: "4",
          }}
        /> */}
        <Column fillWidth gap="8">
          {project?.platforms &&
            project?.platforms.slice(0, 3).map((platform) => (
              <Chip
                fillWidth
                key={platform.$id}
                height={3}
                paddingX="24"
                textVariant="label-default-m"
                selected={false}
                prefixIcon={platformIcon(platform.type as PlatformType)}
                onClick={() => push(`/project/${project?.$id}/s/apps/${platform.$id}`)}
                label={platform.name}
                className="!w-full gap-2"
                iconButtonProps={{
                  tooltip: "More info",
                  tooltipPosition: "top",
                  size: "l",
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
        </Column>

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
                      <CreatePlatform
                        key={platform}
                        type={config.type}
                        onClose={togglePlatformOptions}
                      >
                        <Chip
                          paddingX="8"
                          selected={false}
                          prefixIcon={config.icon}
                          label={config.label}
                          className="bg-[var(--neutral-background-strong)] hover:bg-[var(--accent-background-strong)]"
                        />
                      </CreatePlatform>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Row>
        <div className="absolute bottom-3 right-3">
          <Chip
            height={2}
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
      </Row>
    </Row>
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
        return FaApple;
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
  return <IconComponent className="size-6" />;
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
  ios: { icon: <FaApple className="h-4 w-4" />, label: "Apple", type: "ios" },
} as const;
