import type { AttributeTypes } from "@/components/project/collection-editor/SidePanelEditor/ColumnEditor/utils";
import { Code } from "@chakra-ui/react";
import type { Models } from "@nuvix/console";

interface Props {
  collection: Models.Collection;
  attribute: AttributeTypes;
}

// Need to fix for new column later
const HeaderTitle: React.FC<Props> = ({ collection, attribute }) => {
  if (!attribute) {
    return (
      <>
        Add new attribute to <Code>{collection.name}</Code>
      </>
    );
  }
  return (
    <>
      Update attribute <Code>{attribute.key}</Code> from <Code>{collection.name}</Code>
    </>
  );
};

export default HeaderTitle;
