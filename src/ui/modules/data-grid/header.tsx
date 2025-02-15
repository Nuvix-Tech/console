import { CloseButton } from "@/components/ui/close-button";
import { InputGroup } from "@/components/ui/input-group";
import { Button, Row } from "@/ui/components";
import { Input } from "@chakra-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { LuSearch } from "react-icons/lu";

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
  const searchParmas = useSearchParams();
  const path = usePathname();
  const { push } = useRouter();

  useEffect(() => {
    setSearchValue(searchParmas.get('search') ?? "")
  }, [searchParmas.get('search')])

  const onSearch = (value: string) => {
    const params = new URLSearchParams(searchParmas)
    value ? params.set('search', value) : params.delete('search');
    push(path + `?${params.toString()}`)
  };

  return (
    <>
      <Row fillWidth horizontal="space-between" vertical="center" marginY="12" marginBottom="24">
        <Row maxWidth={20} fillWidth>
          <InputGroup
            flex="1"
            startElement={<LuSearch />}
            endElement={searchValue ? <CloseButton size={'xs'} onClick={() => { setSearchValue(""); onSearch("") }} /> : null}
          >
            <Input
              placeholder={placeholder ?? "Search ..."}
              value={searchValue}
              onChange={(e) => { setSearchValue(e.target.value); onSearch(e.target.value) }}
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
