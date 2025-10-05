import { SkeletonText } from "@nuvix/cui/skeleton";

export const GenericSkeletonLoader = ({ isLoaded }: { isLoaded?: boolean }) => {
  return isLoaded ? null : <SkeletonText noOfLines={3} gap={3} />;
};
