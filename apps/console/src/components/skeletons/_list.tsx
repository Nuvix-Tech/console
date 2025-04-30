import { Column, Row, Skeleton } from "@nuvix/ui/components";

export function ListPageSkelton() {
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
        <Row fillWidth height="m">
          <Skeleton shape="block" fillWidth height="xl" radius="l" />
        </Row>
        <Row gap="20" horizontal="space-between" vertical="center">
          <Row gap="20" vertical="center" width="m">
            <Row width="80" height="40">
              <Skeleton shape="block" radius="l" />
            </Row>
            <Skeleton shape="line" width="xs" height="s" />
          </Row>
          <Row gap="20" vertical="center">
            <Skeleton shape="circle" width="s" height="s" />
            <Row width="32" height="32">
              <Skeleton shape="block" radius="s" />
            </Row>
            <Skeleton shape="circle" width="s" height="s" />
          </Row>
        </Row>
      </Column>
    </>
  );
}
