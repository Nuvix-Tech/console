import { useRouter } from "@bprogress/next";
import { Button, EmptyState, VStack } from "@chakra-ui/react";
import { HiColorSwatch } from "react-icons/hi";

interface EmptySearchProps {
  title: string;
  description?: string;
  onClick?: () => void;
  clearSearch?: boolean;
}

export const EmptySearch = ({ title, description, onClick, clearSearch }: EmptySearchProps) => {
  const { replace } = useRouter();

  const onClear = () => {
    if (onClick) {
      onClick();
    } else {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete("search");
      replace(window.location.pathname + "?" + searchParams.toString());
    }
  };
  return (
    <EmptyState.Root bg={"bg.subtle"} borderRadius={"xl"}>
      <EmptyState.Content>
        <EmptyState.Indicator height={"100px"} width={"100px"}>
          <HiColorSwatch height={"100px"} width={"100px"} />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>{title}</EmptyState.Title>
          <EmptyState.Description>{description}</EmptyState.Description>
        </VStack>
        {clearSearch && (
          <Button onClick={onClear} variant="outline">
            Clear Search
          </Button>
        )}
      </EmptyState.Content>
    </EmptyState.Root>
  );
};
