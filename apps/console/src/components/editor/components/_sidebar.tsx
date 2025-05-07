import TableEditorMenu from "@/components/project/table-editor/components/TableEditorMenu";
import { Text } from "@nuvix/ui/components";

export const Sidebar = () => {
  return (
    <div className="h-[100svh-20px] overflow-hidden w-full">
      <div className="w-full px-3 pb-3 border-b border-b-border">
        <Text variant="label-default-xl">Table Editor</Text>
      </div>
      <div className="h-full min-h-[calc(100svh-64px)] pb-10">
        <TableEditorMenu />
      </div>
    </div>
  );
};
