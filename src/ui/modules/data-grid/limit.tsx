import { Row, Select } from "@/ui/components";
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
          width="80"
          maxWidth={20}
          labelAsPlaceholder
          disabled={loading}
          value={table.getState().pagination.pageSize.toString()}
          onSelect={(value) => {
            onPageSizeChange(parseInt(value));
          }}
          options={[...pages.map((page) => ({ label: page, value: page }))]}
        />
        <p className="text"> Total results: {table.getRowCount()}</p>
      </Row>
    </>
  );
};
