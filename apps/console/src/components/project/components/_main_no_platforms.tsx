import { Chip, Column, Row, Text } from "@nuvix/ui/components";
import { CreatePlatform } from "@/components/wizard";
import { platformConfig } from "./_utils";

const availablePlatforms = [
  { platform: "web", config: platformConfig.web, color: "gray" },
  { platform: "flutter", config: platformConfig.flutter, color: "aqua" },
  { platform: "android", config: platformConfig.android, color: "green" },
  { platform: "reactnative", config: platformConfig.reactnative, color: "blue" },
  { platform: "ios", config: platformConfig.ios, color: "violet" },
];

export const NoPlatforms = () => {
  return (
    <Row
      fillWidth
      marginTop="24"
      gap="16"
      className="bg-gradient-to-t from-(--neutral-alpha-medium) to-transparent rounded-sm"
    >
      <Column maxWidth={40} gap="24" className="py-28 pl-28">
        <Text variant="display-default-s" color="neutral-strong">
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
          You can always add more apps later from the project settings.
        </Text>
      </Column>

      <div className="relative flex-1 p-28">
        <img
          src="//www.gstatic.com/mobilesdk/240501_mobilesdk/2024-05-01-get_started_image_logo.png"
          alt=""
          className="size-96 absolute bottom-0"
        />
      </div>
    </Row>
  );
};
