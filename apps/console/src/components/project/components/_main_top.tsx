import { Chip, Column, Heading, Row } from "@nuvix/ui/components";
import { useProjectStore } from "@/lib/store";
import { IDChip } from "@/components/others";
import { useRouter } from "@bprogress/next";
import { AnimatePresence, motion } from "framer-motion";
import { CreatePlatform } from "@/components/wizard";
import { useState } from "react";
import { PlatformType } from "@nuvix/console";
import { NoPlatforms } from "./_main_no_platforms";
import { availablePlatforms, platformConfig, platformIcon } from "./_utils";
import { cn } from "@nuvix/sui/lib/utils";

export const TopInfo = () => {
  const [showPlatformOptions, setShowPlatformOptions] = useState(false);
  const togglePlatformOptions = () => {
    setShowPlatformOptions(!showPlatformOptions);
  };
  const project = useProjectStore.use.project?.();
  const { push } = useRouter();

  return (
    <Column zIndex={1} fill horizontal="start" vertical="start" gap="16" paddingX="24" marginY="24">
      <Row vertical="center" horizontal="start" fillWidth gap="8">
        <Heading variant="heading-strong-l">{project?.name}</Heading>
        <IDChip id={project?.$id} />
      </Row>
      <Column fillWidth gap="12">
        {(project?.platforms && project?.platforms.length > 0) ||
        (project?.keys && project.keys?.length > 0) ? (
          <>
            <Row
              horizontal="start"
              fillWidth
              gap="8"
              position="relative"
              minHeight={4}
              className="!flex-col md:!flex-row"
            >
              <div className="relative flex flex-wrap gap-2 w-full">
                {!project?.platforms.length &&
                  project?.keys.slice(0, 3).map((key) => (
                    <Chip
                      key={key.$id}
                      paddingY="8"
                      paddingX="16"
                      gap="4"
                      textVariant="label-strong-s"
                      selected={false}
                      prefixIcon={"key"}
                      onClick={() => push(`/project/${project?.$id}/s/keys/${key.$id}`)}
                      label={key.name}
                      className="!items-center"
                      iconButtonProps={{
                        tooltip: "More info",
                        tooltipPosition: "top",
                        size: "l",
                      }}
                    />
                  ))}
                {project?.platforms.slice(0, 3).map((platform) => (
                  <Chip
                    key={platform.$id}
                    paddingY="8"
                    paddingX="16"
                    gap="4"
                    textVariant="label-strong-s"
                    selected={false}
                    prefixIcon={platformIcon(platform.type as PlatformType)}
                    onClick={() => push(`/project/${project?.$id}/s/apps/${platform.$id}`)}
                    label={platform.name}
                    className="!items-center"
                    iconButtonProps={{
                      tooltip: "More info",
                      tooltipPosition: "top",
                      size: "l",
                    }}
                  />
                ))}
                {project?.platforms.length && project?.platforms.length > 3 ? (
                  <Chip
                    paddingY="8"
                    paddingX="16"
                    textVariant="label-strong-s"
                    selected={false}
                    onClick={() => push(`/project/${project?.$id}/s/apps`)}
                    label={`+${project?.platforms.length - 3} more`}
                    iconButtonProps={{
                      tooltip: "More info",
                      tooltipPosition: "top",
                    }}
                  />
                ) : null}
                <Chip
                  paddingX="16"
                  paddingY="8"
                  textVariant="label-strong-s"
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

              <AnimatePresence>
                {showPlatformOptions && (
                  <motion.div
                    className={cn(
                      "w-full bg-background p-3 rounded-lg border border-neutral-alpha-weak",
                      "md:absolute md:right-0 md:-bottom-[40px] xl:bottom-auto xl:top-0 md:z-[1] md:bg-background md:py-1.5 md:px-2 md:shadow-md md:w-max",
                    )}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
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
                              className="bg-[var(--neutral-background-strong)] hover:bg-[var(--accent-background-strong)] whitespace-nowrap"
                            />
                          </CreatePlatform>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Row>
          </>
        ) : (
          <NoPlatforms />
        )}
      </Column>
    </Column>
  );
};
