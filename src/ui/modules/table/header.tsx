import { InputGroup } from "@/components/ui/input-group";
import { Button, Icon, Row } from "@/ui/components";
import { Input } from "@chakra-ui/react";
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
          <InputGroup
            flex="1"
            startElement={<Icon name="search" />}
            endElement={<Icon name="close" />}
          >
            <Input
              placeholder={placeholder ?? "Search ..."}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </InputGroup>
        </Row>

        <Button variant="primary" size="m" prefixIcon="plus">
          {button?.text}
        </Button>
      </Row>
    </>
  );
};

export default SearchAndCreate;
