import { Row } from "@/ui/components";
import { VStack } from "@chakra-ui/react";
import { TableOptions } from "@tanstack/react-table";
import { DataGridProvider } from "./provider";
import { TheTable } from "./table";
import { SelectLimit } from "./limit";
import { Paggination } from "./paggination";

interface TableProps<T> extends Omit<TableOptions<T>, "getCoreRowModel"> {
  loading?: boolean;
  showPaggination?: boolean;
}

export const DataGrid = <T,>({ showPaggination = true, ...rest }: TableProps<T>) => {
  return (
    <DataGridProvider {...rest}>
      <VStack width={"full"}>
        <TheTable />
        {showPaggination ? (
          <Row marginTop="20" marginY="12" fillWidth horizontal="space-between" vertical="center">
            <SelectLimit />
            <Paggination />
          </Row>
        ) : null}
      </VStack>
    </DataGridProvider>
  );
};
