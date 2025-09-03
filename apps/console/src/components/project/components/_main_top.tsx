import { Background, Chip, Column, Heading, Row, Text } from "@nuvix/ui/components";
import { useProjectStore } from "@/lib/store";
import { IDChip } from "@/components/others";
import { useRouter } from "@bprogress/next";
import { AnimatePresence, motion } from "framer-motion";
import { CreatePlatform } from "@/components/wizard";
import { useState } from "react";
import { PlatformType } from "@nuvix/console";
import { NoPlatforms } from "./_main_no_platforms";
import { availablePlatforms, platformConfig, platformIcon } from "./_utils";

export const TopInfo = () => {
  const [showPlatformOptions, setShowPlatformOptions] = useState(false);
  const togglePlatformOptions = () => {
    setShowPlatformOptions(!showPlatformOptions);
  };
  const project = useProjectStore.use.project?.();
  const { push } = useRouter();

  return (
    <Column zIndex={1} fill horizontal="start" vertical="start" gap="16" padding="24">
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

        {project?.platforms && project?.platforms.length < 0 ? (
          <>
            {project?.platforms.slice(0, 3).map((platform) => (
              <Chip
                fillWidth
                key={platform.$id}
                height={2.3}
                paddingX="24"
                textVariant="label-default-m"
                selected={false}
                prefixIcon={platformIcon(platform.type as PlatformType)}
                onClick={() => push(`/project/${project?.$id}/s/apps/${platform.$id}`)}
                label={platform.name}
                // className="!w-full gap-2"
                iconButtonProps={{
                  tooltip: "More info",
                  tooltipPosition: "top",
                  size: "l",
                }}
              />
            ))}
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
          </>
        ) : (
          <NoPlatforms />
        )}

        {!project?.platforms.length && project?.platforms.length > 3 ? (
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
      </Row>
    </Column>
  );
};
