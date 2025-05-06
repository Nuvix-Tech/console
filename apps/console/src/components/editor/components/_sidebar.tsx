import TableEditorMenu from "@/components/project/table-editor/components/TableEditorMenu";
import { Text } from "@nuvix/ui/components";

export const Sidebar = () => {
  return (
    <div className="h-full w-full">
      <div className="w-full pb-3 px-3 border-b border-b-border">
        <Text variant="label-default-xl">Table Editor</Text>
      </div>
      <div className="h-full min-h-[calc(100svh-140px)]">
        <TableEditorMenu />
      </div>
    </div>
  );
};
