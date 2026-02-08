import { Icon, Row, Text } from "@nuvix/ui/components";
import type { IconName } from "@nuvix/ui/icons";
import { motion } from "motion/react";

export const UseWithSection = () => {
  const icons: Array<{
    icon: IconName;
    label: string;
  }> = [
    { icon: "nextjs", label: "Next.js" },
    { icon: "reactjs", label: "React" },
    { icon: "svelte", label: "Svelte" },
    { icon: "vue", label: "Vue" },
    { icon: "solidjs", label: "Solid" },
  ];

  return (
    <div className="py-16 md:py-24 container mx-auto px-4">
      <Row
        fillWidth
        className="!flex-col md:!flex-row gap-10 md:gap-16 items-center justify-between"
      >
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Text variant="display-strong-xs" as="h2" onBackground="neutral-medium" className="mb-3">
            Works with your stack
          </Text>
          <Text variant="body-default-m" as="p" onBackground="neutral-weak" className="max-w-sm">
            First-class SDKs for the frameworks you already use.
            <span className="text-(--neutral-on-background-strong)"> Zero lock-in.</span>
          </Text>
        </motion.div>
        <div className="grid grid-cols-5 gap-4 md:gap-6 flex-1 w-full max-w-xl">
          {icons.map((e, index) => (
            <motion.div
              key={e.icon}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex flex-col items-center justify-center gap-3 p-4 md:p-5 group/usewith border border-(--neutral-border-weak) rounded-xl bg-(--neutral-background) hover:border-(--brand-border-medium) hover:bg-(--neutral-background-strong) hover:shadow-lg hover:shadow-(--brand-alpha-weak) transition-all duration-300 cursor-pointer"
            >
              <Icon
                size="l"
                className="!text-(--neutral-on-background-weak) group-hover/usewith:!text-(--brand-on-background-strong) transition-colors duration-300 [&>_svg]:!size-8"
                name={e.icon}
              />
              <Text
                variant="label-strong-s"
                as="span"
                className="text-center text-xs md:text-sm font-medium text-(--neutral-on-background-weak) group-hover/usewith:text-(--brand-on-background-strong) transition-colors duration-300"
              >
                {e.label}
              </Text>
            </motion.div>
          ))}
        </div>
      </Row>
    </div>
  );
};
