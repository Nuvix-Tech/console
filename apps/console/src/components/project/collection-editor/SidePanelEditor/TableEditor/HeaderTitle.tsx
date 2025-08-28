import { Code } from "@chakra-ui/react";

interface HeaderTitleProps {
  schema: string;
  collection?: { name: string };
  isDuplicating: boolean;
}

const HeaderTitle = ({ schema, collection, isDuplicating }: HeaderTitleProps) => {
  if (!collection) {
    return (
      <>
        Create a new collection under <Code className="text-sm">{schema}</Code>
      </>
    );
  }
  if (isDuplicating) {
    return (
      <>
        Duplicate collection <Code className="text-sm">{collection?.name}</Code>
      </>
    );
  }
  return (
    <>
      Update collection <Code className="text-sm">{collection?.name}</Code>
    </>
  );
};

export default HeaderTitle;
