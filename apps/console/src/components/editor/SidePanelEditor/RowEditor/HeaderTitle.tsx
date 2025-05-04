import { Code } from "@chakra-ui/react";

interface HeaderTitleProps {
  isNewRecord: boolean;
  tableName?: string;
}

const HeaderTitle = ({ isNewRecord, tableName }: HeaderTitleProps) => {
  let header = `${isNewRecord ? "Add new" : "Update"} row ${isNewRecord ? "to" : "from"} `;

  return (
    <>
      {header}
      {tableName && <Code>{tableName}</Code>}
    </>
  );
};

export default HeaderTitle;
