import { Button, Icon, Input, Row } from "@/ui/components";
import React from "react";

interface SearchAndCreateProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  onCreate?: () => void;
  button?: {
    text: string;
    disabled?: boolean;
    tooltip?: string;
  };
}

const SearchAndCreate: React.FC<SearchAndCreateProps> = ({ placeholder, button }) => {
  const [searchValue, setSearchValue] = React.useState("");
  return (
    <>
      <Row fillWidth horizontal="space-between" vertical="center" marginY="16" paddingX="20">
        <Row maxWidth={20} fillWidth>
          <Input
            id="search"
            label={placeholder ?? "Search"}
            value={searchValue}
            hasPrefix={<Icon name="search" />}
            labelAsPlaceholder
            onChange={(e) => setSearchValue(e.target.value)}
            height="m"
          />
        </Row>

        <Button variant="primary" size="m" prefixIcon="plus">
          {button?.text}
        </Button>
      </Row>
    </>
  );
};

export default SearchAndCreate;
