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
    <div className="py-12 md:py-16 container mx-auto px-4">
      <Row
        fillWidth
        className="!flex-col md:!flex-row gap-8 md:gap-12 items-center justify-between"
      >
        <div className="flex-1">
          <Text variant="display-strong-xs" as="h2" onBackground="neutral-medium" className="mb-2">
            Works with your framework
          </Text>
          <Text
            variant="body-strong-m"
            as="p"
            onBackground="neutral-strong"
            className="text-(--neutral-on-background-medium) italic"
          >
            No switching required.
          </Text>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 flex-1 w-full max-w-2xl">
          {icons.map((e) => (
            <div
              key={e.icon}
              className="flex flex-col items-center justify-center gap-3 p-4 group/usewith border border-transparent rounded-lg bg-(--neutral-background) hover:border-(--brand-border-medium) hover:bg-(--neutral-background-strong) transition-all duration-200 cursor-pointer"
            >
              <Icon
                size="l"
                className="!text-(--neutral-on-background-medium) group-hover/usewith:!text-(--brand-on-background-medium) transition-colors [&>_svg]:!size-8"
                name={e.icon}
              />
              <Text
                variant="label-strong-s"
                as="span"
                className="text-center text-xs md:text-sm font-medium group-hover/usewith:text-(--brand-on-background-medium) transition-colors"
              >
                {e.label}
              </Text>
            </div>
          ))}
        </div>
      </Row>
    </div>
  );
};
