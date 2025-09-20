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
            <Tag
              textVariant="body-default-xs"
              prefixIcon="table"
              variant="info"
              className="backdrop-blur !text-(--neutral-on-background-weak)"
              zIndex={1}
            >
              {table.name}
            </Tag>

            <motion.div
              className="relative flex-1 -mx-2 z-0 h-[3px] rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: idx * 0.1,
              }}
            >
              <div
                className="w-full h-full bg-transparent border-t-2 border-dashed border-(--neutral-alpha-weak) animate-pulse"
                style={{
                  animation: `dash-run ${1 + idx * 0.2}s linear infinite`,
                }}
              />
            </motion.div>

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
    </div>
  );
};
