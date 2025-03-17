import { Column, Row, Skeleton } from "@/ui/components";

export default function () {
  return (
    <>
      <Column gap="20">
        <Row gap="20" horizontal="space-between" vertical="center">
          <Column>
            <Skeleton shape="line" width="s" />
            <Skeleton shape="line" width="l" height="xs" />
          </Column>
          <Skeleton shape="block" width="s" height="m" radius="l" />
        </Row>

        <Skeleton shape="block" fillWidth height="xl" radius="l" />

        <Row gap="20" horizontal="space-between" vertical="center">
          <Row gap="20" vertical="center">
            <Skeleton shape="line" width="xs" height="xl" />
            <Skeleton shape="line" width="m" height="xs" />
          </Row>
          <Row gap="20" vertical="center">
            <Skeleton shape="circle" width="s" height="s" />
            <Skeleton shape="circle" width="s" height="s" />
          </Row>
        </Row>
      </Column>
    </>
  );
}
