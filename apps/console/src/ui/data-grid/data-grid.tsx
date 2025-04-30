import { Row } from "@nuvix/ui/components";
import { VStack } from "@chakra-ui/react";
import { TableOptions } from "@tanstack/react-table";
import { DataGridProvider } from "./provider";
import { TheTable } from "./table";
import { SelectLimit } from "./limit";
import { Pagination } from "./paggination";

interface TableProps<T> extends Omit<TableOptions<T>, "getCoreRowModel"> {
  loading?: boolean;
  showPagination?: boolean;
}

export const DataGrid = <T,>({ showPagination = true, ...rest }: TableProps<T>) => {
  return (
    <DataGridProvider {...rest}>
      <VStack width={"full"}>
        <TheTable />
        {showPagination ? (
          <Row marginTop="20" marginY="12" fillWidth horizontal="space-between" vertical="center">
            <SelectLimit />
            <Pagination />
          </Row>
        ) : null}
      </VStack>
    </DataGridProvider>
  );
};
