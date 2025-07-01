"use client";
import { CloseButton } from "@nuvix/cui/close-button";
import { cn } from "@nuvix/sui/lib/utils";
import { Input, Row } from "@nuvix/ui/components";
import { Button, ButtonProps } from "@chakra-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { LuPlus, LuSearch } from "react-icons/lu";
import { CreateButton as Create } from "@/components/others";

interface SearchAndCreateProps {
  placeholder?: string;
  onSearch?: (value?: string) => void;
  onClear?: () => void;
  onCreate?: () => void;
  button?: {
    allowed?: boolean;
    text: string;
    disabled?: boolean;
    tooltip?: string;
  };
}

const SearchAndCreate: React.FC<SearchAndCreateProps> = ({ onCreate, button, ...rest }) => {
  return <Search {...rest} />;
};

interface SearchAndCreateProps {
  placeholder?: string;
  onSearch?: (value?: string) => void;
  onClear?: () => void;
  onCreate?: () => void;
  button?: {
    allowed?: boolean;
    text: string;
    disabled?: boolean;
    tooltip?: string;
  };
}

interface SearchProps {
  placeholder?: string;
  value?: string;
  onSearch?: (value?: string) => void;
  onClear?: () => void;
}

export const Search: React.FC<SearchProps & React.ComponentProps<typeof Input>> = ({
  placeholder,
  onClear,
  value,
  onSearch,
  ...props
}) => {
  const [searchValue, setSearchValue] = React.useState("");
  const searchParmas = useSearchParams();
  const path = usePathname();
  const { push } = useRouter();

  useEffect(() => {
    if (value) {
      setSearchValue(value);
    } else setSearchValue(searchParmas.get("search") ?? "");
  }, [searchParmas.get("search"), value]);

  const handleSearch = (value?: string) => {
    if (onSearch) {
      onSearch(value);
    } else {
      const params = new URLSearchParams(searchParmas);
      value ? params.set("search", value) : params.delete("search");
      push(path + `?${params.toString()}`);
    }
  };

  return (
    <>
      <Input
        className={cn("max-w-md", props.className)}
        height="s"
        {...props}
        labelAsPlaceholder
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          handleSearch(e.target.value);
        }}
        hasPrefix={<LuSearch />}
        hasSuffix={!!searchValue.length && <CloseButton onClick={() => handleSearch()} />}
      />
    </>
  );
};

export const CreateButton = ({ label, ...props }: ButtonProps & { label: React.ReactNode }) => {
  return <Create {...(props as any)} />;
};

export default SearchAndCreate;
