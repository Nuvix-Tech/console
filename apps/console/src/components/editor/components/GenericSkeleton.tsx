import { SkeletonText } from "@/components/cui/skeleton";

export const GenericSkeletonLoader = () => {
  return (
    <div className="space-y-2">
      <SkeletonText />
      {/* <ShimmeringLoader className="w-3/4" delayIndex={1} />
            <ShimmeringLoader className="w-1/2" delayIndex={2} /> */}
    </div>
  );
};
