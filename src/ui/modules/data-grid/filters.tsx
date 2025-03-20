import { useDataGrid } from "./provider";
import { VStack } from "@chakra-ui/react";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/cui/popover";
import { Checkbox } from "@/components/cui/checkbox";
import { LuColumns3, LuFilter } from "react-icons/lu";
import { Button, ButtonProps } from "@/ui/components";

export const ColumnSelector = (props: ButtonProps) => {
  const { table } = useDataGrid();

  return (
    <>
      <PopoverRoot>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            {...props}
            className="bg-[var(--neutral-alpha-weak)] items-center"
          >
            <LuColumns3 />
            Columns
          </Button>
        </PopoverTrigger>
        <PopoverContent maxW={"40"}>
          <PopoverArrow />
          <PopoverBody>
            <VStack justifyContent="flex-start" alignItems="flex-start">
              {table.getAllColumns().map((column) => (
                <Checkbox
                  size="sm"
                  key={column.id}
                  checked={column.getIsVisible()}
                  disabled={!column.getCanHide()}
                  onChange={column.getToggleVisibilityHandler()}
                >
                  {column.columnDef.header as any}
                </Checkbox>
              ))}
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    </>
  );
};

export const Filter = (props: ButtonProps) => {
  const { table } = useDataGrid();

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          {...props}
          className="bg-[var(--neutral-alpha-weak)] items-center"
        >
          <LuFilter />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent maxW={"40"}>
        <PopoverArrow />
        <PopoverBody>
          <VStack justifyContent="flex-start" alignItems="flex-start">
            {table.getAllColumns().map((column) => (
              <Checkbox
                size="sm"
                key={column.id}
                checked={column.getIsVisible()}
                disabled={!column.getCanHide()}
                onChange={column.getToggleVisibilityHandler()}
              >
                {column.columnDef.header as any}
              </Checkbox>
            ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};
