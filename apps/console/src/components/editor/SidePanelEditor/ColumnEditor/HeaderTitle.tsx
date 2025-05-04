import { Code } from "@chakra-ui/react";
import type { PostgresTable, PostgresColumn } from "@nuvix/pg-meta";

interface Props {
  table: PostgresTable;
  column: PostgresColumn;
}

// Need to fix for new column later
const HeaderTitle: React.FC<Props> = ({ table, column }) => {
  if (!column) {
    return (
      <>
        Add new column to <Code>{table.name}</Code>
      </>
    );
  }
  return (
    <>
      Update column <Code>{column.name}</Code> from <Code>{column.table}</Code>
    </>
  );
};

export default HeaderTitle;
