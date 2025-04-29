import { Skeleton, Spinner } from "@/ui/components";

export function SkeletonProject() {
  return (
    <>
      <Skeleton shape="block" fillWidth radius="l" horizontal="center" vertical="center">
        <Spinner />
      </Skeleton>
    </>
  );
}
