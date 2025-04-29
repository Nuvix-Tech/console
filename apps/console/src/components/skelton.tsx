import { Skeleton } from "@/ui/components";

export const GridSkelton = ({ limit }: { limit: number }) => {
  return Array.from({ length: limit }).map((_, index) => (
    <Skeleton key={index} minHeight={14} topRadius="xl" bottomRadius="xl" shape="line" />
  ));
};
