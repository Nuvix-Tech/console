import { Skeleton } from "@nuvix/ui/components";

export const GridSkeleton = ({ limit }: { limit: number }) => {
  return Array.from({ length: limit }).map((_, index) => (
    <Skeleton key={index} minHeight={12} topRadius="l" bottomRadius="l" shape="line" />
  ));
};
