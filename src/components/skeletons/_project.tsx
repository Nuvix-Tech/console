import { Skeleton } from "@/ui/components";

export function SkeletonProject() {
  return (
    <>
      <Skeleton shape="block" fillWidth height="xl" radius="l" />
      <Skeleton shape="block" width="xl" height="m" radius="l" />
      <Skeleton shape="line" width="s" />
    </>
  );
}
