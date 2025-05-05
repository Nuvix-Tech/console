import { Code } from "@chakra-ui/react";

interface HeaderTitleProps {
  schema: string;
  table?: { name: string };
  isDuplicating: boolean;
}

const HeaderTitle = ({ schema, table, isDuplicating }: HeaderTitleProps) => {
  if (!table) {
    return (
      <>
        Create a new table under <Code className="text-sm">{schema}</Code>
      </>
    );
  }
  if (isDuplicating) {
    return (
      <>
        Duplicate table <Code className="text-sm">{table?.name}</Code>
      </>
    );
  }
  return (
    <>
      Update table <Code className="text-sm">{table?.name}</Code>
    </>
  );
};

export default HeaderTitle;
