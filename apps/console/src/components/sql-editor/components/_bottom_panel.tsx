import { useSqlEditorStateSnapshot } from "@/lib/store/sql-runner";
import { Tabs } from "@chakra-ui/react";
import { Button, Column, Row } from "@nuvix/ui/components";
import Results from "./_results";
import { useExecuteSqlMutation } from "@/data/sql/execute-sql-mutation";
import { useProjectStore } from "@/lib/store";
import { suffixWithLimit } from "./_utils";

export const BottomPanel = () => {
  const { sdk, project } = useProjectStore((s) => s);
  const { sql, loading, addResult, result } = useSqlEditorStateSnapshot();

  const { mutate: execute, isPending: isExecuting } = useExecuteSqlMutation({
    onSuccess(data, vars) {
      addResult(data.result);
    },
  });

  const onRun = () => {
    if (sql) {
      let _sql = suffixWithLimit(sql, 100);
      execute({ sql: _sql, sdk, projectRef: project.$id });
    }
  };

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
          <Button size="s" disabled={loading || !sql} loading={isExecuting} onClick={onRun}>
            Run
          </Button>
        </Row>
        <div className="flex-1 h-full max-h-[calc(100%_-_80px)] overflow-y-auto">
          <Results rows={Array.isArray(result) ? result : []} panel={false} />
        </div>
        <Row fillWidth height={"40"} borderTop="neutral-alpha-weak"></Row>
      </Column>
    </>
  );
};
