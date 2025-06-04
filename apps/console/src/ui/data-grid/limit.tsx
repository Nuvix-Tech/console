import { Row, Select } from "@nuvix/ui/components";
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
        <Row width={5}>
          <Select
            height="s"
            labelAsPlaceholder
            disabled={loading}
            value={table.getState().pagination.pageSize.toString()}
            onSelect={(value) => {
              onPageSizeChange(parseInt(value));
            }}
            options={[...pages.map((page) => ({ label: page, value: page }))]}
          />
        </Row>
        <p className="text"> Total results: {table.getRowCount()}</p>
      </Row>
    </>
  );
};
