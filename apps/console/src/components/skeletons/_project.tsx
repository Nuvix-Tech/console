import { Column, Spinner } from "@nuvix/ui/components";

export function SkeletonProject() {
  return (
    <>
      <Column fill horizontal="center" vertical="center">
        <Spinner />
      </Column>
    </>
  );
}
