import React, { useMemo } from "react";
import { Icon, Row, Text } from "@nuvix/ui/components";
import type { IconName } from "@nuvix/ui/icons";

type Props = {
  onSelect?: (name: IconName) => void;
};

export const UseWithSection: React.FC<Props> = ({ onSelect }) => {
  const icons = useMemo(
    () =>
      [
        { icon: "nextjs", label: "Next.js" },
        { icon: "reactjs", label: "React" },
        { icon: "svelte", label: "Svelte" },
        { icon: "vue", label: "Vue" },
        { icon: "solidjs", label: "Solid" },
      ] as const,
    [],
  );

  return (
    <section aria-labelledby="usewith-heading" className="py-12 md:py-16 container mx-auto px-4">
      <Row
        fillWidth
        className="!flex-col md:!flex-row gap-8 md:gap-12 items-start md:items-center justify-between"
      >
        <div className="flex-1 min-w-0">
          <Text
            id="usewith-heading"
            variant="display-strong-xs"
            as="h2"
            onBackground="neutral-medium"
            className="mb-2"
          >
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

        <ul
          role="list"
          className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 flex-1 w-full max-w-2xl"
        >
          {icons.map(({ icon, label }) => {
            const handleSelect = () => onSelect?.(icon);
            return (
              <li key={icon} className="list-none">
                <button
                  type="button"
                  onClick={handleSelect}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect();
                    }
                  }}
                  title={label}
                  aria-label={label}
                  data-testid={`usewith-${icon}`}
                  className={[
                    "w-full flex flex-col items-center justify-center gap-3 p-4 rounded-lg transition-colors motion-safe:transform motion-safe:transition-all duration-200",
                    "bg-(--neutral-background) border border-transparent cursor-pointer",
                    "hover:border-(--neutral-border-medium) hover:bg-(--neutral-background-medium) hover:scale-105",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-(--neutral-border-medium) focus-visible:ring-offset-2",
                    "motion-reduce:transition-none motion-reduce:transform-none",
                  ].join(" ")}
                >
                  {/* Icon (with graceful fallback) */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-(--neutral-surface)">
                    <Icon
                      name={icon}
                      size="l"
                      className="!text-(--neutral-on-background-medium) group-hover/usewith:!text-(--brand-on-background-medium) transition-colors [&>_svg]:!size-8"
                      aria-hidden="true"
                    />
                  </div>

                  <Text
                    variant="label-strong-s"
                    as="span"
                    className="text-center text-xs md:text-sm font-medium text-(--neutral-on-background-medium) truncate"
                  >
                    {label}
                  </Text>
                </button>
              </li>
            );
          })}
        </ul>
      </Row>
    </section>
  );
};
