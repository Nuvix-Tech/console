import { CloseButton } from "@/components/cui/close-button";
import { InputGroup } from "@/components/cui/input-group";
import { Row } from "@/ui/components";
import { Button, ButtonProps, Input } from "@chakra-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { LuPlus, LuSearch } from "react-icons/lu";

interface SearchAndCreateProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  onCreate?: () => void;
  button?: {
    allowed?: boolean;
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
    setSearchValue(searchParmas.get("search") ?? "");
  }, [searchParmas.get("search")]);

  const onSearch = (value: string) => {
    const params = new URLSearchParams(searchParmas);
    value ? params.set("search", value) : params.delete("search");
    push(path + `?${params.toString()}`);
  };

  return (
    <>
      <Row
        fillWidth
        horizontal="space-between"
        vertical="center"
        marginY="12"
        marginBottom="24"
        gap="12"
      >
        <Row maxWidth={20} fillWidth>
          <InputGroup
            flex="1"
            startElement={<LuSearch />}
            endElement={
              searchValue ? (
                <CloseButton
                  size={"xs"}
                  onClick={() => {
                    setSearchValue("");
                    onSearch("");
                  }}
                />
              ) : null
            }
          >
            <Input
              placeholder={placeholder ?? "Search ..."}
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                onSearch(e.target.value);
              }}
            />
          </InputGroup>
        </Row>

        {button?.allowed ? <Button size="md">{button?.text}</Button> : null}
      </Row>
    </>
  );
};

export const CreateButton = ({ label, ...props }: ButtonProps & { label: React.ReactNode }) => {
  return (
    <Button size="md" {...props}>
      <LuPlus />
      {label}
    </Button>
  );
};

export default SearchAndCreate;
