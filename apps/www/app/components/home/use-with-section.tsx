import { Icon, Row, Text } from "@nuvix/ui/components";
import type { IconName } from "@nuvix/ui/icons";

export const UseWithSection = () => {
  const icons: Array<{
    icon: IconName;
    label: string;
  }> = [
    { icon: "nextjs", label: "Next Js" },
    { icon: "reactjs", label: "React" },
    { icon: "svelte", label: "Svelte Js" },
    { icon: "vue", label: "Vue Js" },
    { icon: "solidjs", label: "Solid Js" },
  ];

  return (
    <div className="py-5 container mx-auto px-4 h-96">
      <Row fillWidth className="!flex-col lg:!flex-row h-full items-center justify-between">
        <Text variant="display-strong-xs" as="h2" onBackground="neutral-medium">
          Bring your own framework <br />
          <i className="text-(--neutral-on-background-strong)">it just works.</i>
        </Text>
        <div className="grid grid-cols-3 flex-1 gap-1 md:gap-6 mt-6 flex-wrap items-center md:justify-end max-w-md">
          {icons.map((e, i) => (
            <div key={i} className="flex items-center gap-2 p-2">
              <Icon
                size="l"
                className="!text-(--neutral-on-background-medium) hover:!text-(--brand-on-background-medium) transition-colors [&>_svg]:!size-10"
                name={e.icon}
              />
              <Text variant="label-strong-m" className="hidden md:inline-block">
                {e.label}
              </Text>
            </div>
          ))}
        </div>
      </Row>
    </div>
  );
};
