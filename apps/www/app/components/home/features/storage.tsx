import { Background, Column, Icon } from "@nuvix/ui/components";
import { motion } from "motion/react";

export const Storage = () => (
  <motion.div className="relative size-full ">
    <Background
      position="absolute"
      fill
      dots={{ display: true, size: "12", color: "accent-solid-medium" }}
      grid={{ display: false }}
      className="rounded-lg overflow-hidden"
    />
    <motion.div
      className="size-full relative group backdrop-blur-xs rounded-lg"
      initial={false}
      whileHover="hover"
    >
      {[
        { name: "audio", x: -23, y: -10, color: "brand" },
        { name: "image", x: 60, y: -15, color: "neutral" },
        { name: "document", x: -10, y: 28, color: "accent" },
      ].map((item, idx) => (
        <motion.div
          key={item.name}
          className="absolute"
          style={{
            left: `${80 + item.x}px`,
            top: `${20 + item.y + idx * 30}px`,
          }}
          initial={{ x: 0, y: 0 }}
          variants={{
            hover: { x: item.x * 1.5, y: item.y * 1.2, scale: 1.1, rotate: 5 * (idx - 1) },
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Column
            background={`${item.color}-alpha-weak` as any}
            width={"80"}
            height={"80"}
            radius="s"
            center
            className="shadow-lg"
          >
            <Icon name={item.name} />
          </Column>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);
