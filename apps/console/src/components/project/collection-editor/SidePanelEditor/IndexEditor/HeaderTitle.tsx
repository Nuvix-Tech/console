import { Code } from "@chakra-ui/react";
import type { Models } from "@nuvix/console";

interface Props {
  collection: Models.Collection;
  index: Models.Index;
}

const HeaderTitle: React.FC<Props> = ({ collection, index }) => {
  if (!index) {
    return (
      <>
        Add new index to <Code>{collection.name}</Code>
      </>
    );
  }
  return (
    <>
      Update index <Code>{index.key}</Code> from <Code>{collection.name}</Code>
    </>
  );
};

export default HeaderTitle;
