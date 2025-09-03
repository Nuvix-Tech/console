import { Chip, Column, Row, Text } from "@nuvix/ui/components";
import { CreatePlatform } from "@/components/wizard";
import { platformConfig } from "./_utils";

const availablePlatforms = [
  { platform: "web", config: platformConfig.web, color: "gray" },
  { platform: "android", config: platformConfig.android, color: "green" },
  { platform: "ios", config: platformConfig.ios, color: "violet" },
  { platform: "flutter", config: platformConfig.flutter, color: "aqua" },
  { platform: "reactnative", config: platformConfig.reactnative, color: "blue" },
];

export const NoPlatforms = () => {
  return (
    <Row
      fillWidth
      marginTop="24"
      gap="16"
      className="bg-gradient-to-t from-(--neutral-alpha-medium) to-transparent rounded-sm"
    >
      <Column maxWidth={40} gap="24" className="p-12 lg:py-20 lg:pl-20 lg:pr-0 xl:py-28 xl:pl-28">
        <Text variant="display-strong-s" color="neutral-strong">
          Add your first app and start building faster with
          <Text onBackground="brand-weak"> Nuvix!</Text>
        </Text>

        <div className="flex flex-wrap gap-2">
          {availablePlatforms.map(({ platform, config, color }) => {
            return (
              <CreatePlatform key={platform} type={config.type} onClose={() => {}}>
                <Chip
                  paddingX="8"
                  selected={false}
                  textVariant="label-strong-s"
                  prefixIcon={config.icon}
                  label={config.label}
                  className="!text-background hover:!bg-(--brand-solid-weak) hover:!text-foreground"
                  style={{
                    backgroundColor: `var(--code-${color})`,
                  }}
                />
              </CreatePlatform>
            );
          })}
        </div>

        <Text variant="body-default-m" onBackground="neutral-medium">
          Your project is ready. Start connecting platforms and let Nuvix handle the backend.
        </Text>
      </Column>

      <div className="relative flex-1 p-12 lg:p-20 xl:p-28 hidden md:flex items-center">
        <img
          src="//www.gstatic.com/mobilesdk/240501_mobilesdk/2024-05-01-get_started_image_logo.png"
          alt=""
          className="size-96 absolute bottom-0"
        />
      </div>
    </Row>
  );
};
