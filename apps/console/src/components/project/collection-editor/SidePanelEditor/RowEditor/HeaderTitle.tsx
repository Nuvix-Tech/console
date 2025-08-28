import { Code } from "@chakra-ui/react";

interface HeaderTitleProps {
  isNewRecord: boolean;
  collectionName?: string;
}

const HeaderTitle = ({ isNewRecord, collectionName }: HeaderTitleProps) => {
  let header = `${isNewRecord ? "Add new" : "Update"} document ${isNewRecord ? "to" : "from"} `;

  return (
    <>
      {header}
      {collectionName && <Code>{collectionName}</Code>}
    </>
  );
};

export default HeaderTitle;
