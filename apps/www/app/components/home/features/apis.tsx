import { BorderBeam } from "~/magicui/border-beam";
import { motion } from "motion/react";
import { Tag } from "@nuvix/ui/components";

const tables = [
  { name: "customers", endpoint: "customers" },
  { name: "orders", endpoint: "orders" },
  { name: "products", endpoint: "products" },
  { name: "categories", endpoint: "categories" },
  { name: "reviews", endpoint: "reviews" },
];

export const DataAPIs = () => {
  return (
    <div className="size-full relative flex items-center">
      <div className="w-full flex flex-col gap-3">
        {tables.map((table, idx) => (
          <div key={table.name} className="flex items-center justify-between w-full">
            {/* Table name (left) */}
            <Tag
              textVariant="body-default-xs"
              prefixIcon="table"
              variant="info"
              className="backdrop-blur !text-(--neutral-on-background-weak)"
              zIndex={1}
            >
              {table.name}
            </Tag>
            {/* Animated line (center) */}
            <motion.div
              className="relative flex-1 -mx-2 z-0 h-[3px] rounded-full overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 0.7 + idx * 0.05,
                delay: idx * 0.12,
                type: "spring",
                stiffness: 60 + idx * 5,
                damping: 20 + idx * 2,
              }}
              style={{
                originX: 0,
                background: `linear-gradient(
      90deg,
      var(--neutral-alpha-weak) ${10 + idx * 10}%,
      var(--accent-alpha-strong) ${70 + idx * 5}%,
      transparent 100%
    )`,
                opacity: Math.max(0.3, 0.9 - idx * 0.1), // clamp for readability
              }}
            >
              <BorderBeam
                size={180 + idx * 20}
                duration={2 + idx * 0.5}
                className="from-transparent via-(--brand-on-background-strong) to-transparent"
              />
              <BorderBeam
                size={80 + idx * 10}
                duration={2 + idx * 0.5}
                delay={2 + idx}
                className="from-transparent via-(--brand-alpha-strong) to-transparent"
              />
            </motion.div>

            {/* Endpoint (right) */}
            <Tag
              textVariant="body-default-xs"
              variant="neutral"
              className="backdrop-blur"
              zIndex={1}
            >
              <span className="!text-(--neutral-on-background-weak)">.../v1/</span>
              {table.endpoint}
            </Tag>
          </div>
        ))}
      </div>
      {/* {[
        { label: "GET", variant: "success" },
        { label: "POST", variant: "warning" },
        { label: "PUT", variant: "gradient" },
        { label: "DELETE", variant: "danger" },
      ].map((tag, i) => {
        // Generate random positions and rotation
        const top = Math.random() * 80 + 5; // 5% to 85%
        const left = Math.random() * 80 + 5; // 5% to 85%
        const rotate = Math.random() * 90 - 45; // -45deg to 45deg
        return (
          <Tag
            key={tag.label}
            variant={tag.variant as any}
            className="backdrop-blur absolute"
            textVariant="label-strong-s"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              transform: `rotate(${rotate}deg)`,
              zIndex: 10,
            }}
          >
            {tag.label}
          </Tag>
        );
      })} */}
    </div>
  );
};
