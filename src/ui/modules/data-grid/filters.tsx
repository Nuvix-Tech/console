import { useDataGrid } from "./provider";
import { Button, ButtonProps, VStack } from "@chakra-ui/react";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { LuColumns3 } from "react-icons/lu";

export const ColumnSelector = (props: ButtonProps) => {
  const { table } = useDataGrid();

  return (
    <>
      <PopoverRoot>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" {...props}>
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
