import { useSqlEditorStateSnapshot } from "@/lib/store/sql-runner";
import { Tabs } from "@chakra-ui/react";
import { Button, Column, Row } from "@nuvix/ui/components";

export const BottomPanel = () => {
  const { sql, loading, setLoading } = useSqlEditorStateSnapshot();

  return (
    <>
      <Column fill vertical="space-between">
        <Row
          fillWidth
          height={"40"}
          borderBottom="surface"
          background="surface"
          vertical="center"
          horizontal="space-between"
          paddingX="8"
        >
          <Tabs.Root value={"result"}>
            <Tabs.List>
              <Tabs.Trigger value="result">Result</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
          <Button size="s" disabled={loading || !sql} loading={loading}>
            Run
          </Button>
        </Row>
        <Row fillWidth height={"40"} borderTop="neutral-alpha-weak"></Row>
      </Column>
    </>
  );
};
