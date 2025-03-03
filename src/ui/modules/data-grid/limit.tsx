import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Row } from "@/ui/components";
import { useDataGrid } from "./provider";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export const SelectLimit = () => {
  const { table, loading } = useDataGrid();
  const searchParams = useSearchParams();
  const path = usePathname();
  const { push } = useRouter();

  const onPageSizeChange = (pageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", pageSize.toString());
    push(path + "?" + params.toString());
  };

  const pages = ["6", "12", "24", "48", "96"];

  return (
    <>
      <Row vertical="center" gap="12">
        <Select
          disabled={loading}
          defaultValue={table.getState().pagination.pageSize.toString()}
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(value) => {
            onPageSizeChange(parseInt(value));
          }}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="Select Limit" />
          </SelectTrigger>
          <SelectContent>
            {pages.map((page) => (
              <SelectItem value={page} key={page}>
                {page}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text"> Total results: {table.getRowCount()}</p>
      </Row>
    </>
  );
};
