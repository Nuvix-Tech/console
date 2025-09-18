import { IconButton, Row, Text } from "@nuvix/ui/components";
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
    <div className="py-5 container mx-auto px-4">
      <Row fillWidth>
        <Text variant="display-strong-xs" as="h2" onBackground="neutral-medium">
          Use Nuvix <br />
          With Your <span className="text-(--neutral-on-background-strong)">Favorite Tools</span>
        </Text>
        <div className="flex flex-1 gap-6 mt-6 flex-wrap items-center md:justify-end">
          {icons.map((e, i) => (
            <IconButton
              variant="ghost"
              size="l"
              className="[&_svg]:!size-10 !size-14 !text-(--neutral-alpha-strong) hover:!text-(--neutral-on-background-medium) transition-colors"
              icon={e.icon}
              key={i}
              tooltipOffset={40}
              tooltip={e.label}
            />
          ))}
        </div>
      </Row>
    </div>
  );
};
