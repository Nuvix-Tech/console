import { Column, Row, Skeleton } from "@/ui/components";

export function PageSkelton() {
  return (
    <>
      <Column gap="20" fillWidth paddingY="16">
        <Row gap="20" horizontal="space-between" vertical="center" fillWidth>
          <Column fillWidth gap="8">
            <Skeleton shape="line" width="xs" height="xl" />
            <Skeleton shape="line" width="m" height="s" />
          </Column>
          <Row height="40" width={"160"}>
            <Skeleton shape="block" width="s" height="m" radius="l" />
          </Row>
        </Row>
        <Row fillWidth height="s">
          <Skeleton shape="block" fillWidth radius="l" />
        </Row>
        <Row fillWidth height="xs">
          <Skeleton shape="block" fillWidth height="xl" radius="l" />
        </Row>
        <Row fillWidth height="s">
          <Skeleton shape="block" fillWidth height="xl" radius="l" />
        </Row>
      </Column>
    </>
  );
}
