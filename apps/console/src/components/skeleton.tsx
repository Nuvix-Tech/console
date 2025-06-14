import { Skeleton } from "@nuvix/ui/components";

export const GridSkeleton = ({ limit }: { limit: number }) => {
  return Array.from({ length: limit }).map((_, index) => (
    <Skeleton key={index} minHeight={14} topRadius="xl" bottomRadius="xl" shape="line" />
  ));
};
