import { Skeleton, Spinner } from "@nuvix/ui/components";

export function SkeletonProject() {
  return (
    <>
      <Skeleton shape="block" fillWidth radius="l" horizontal="center" vertical="center">
        <Spinner />
      </Skeleton>
    </>
  );
}
