import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { createListCollection } from "@chakra-ui/react";
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

  const pages = createListCollection({
    items: ["6", "12", "24", "48", "96"],
  });

  return (
    <>
      <Row vertical="center" gap="12">
        <SelectRoot
          collection={pages}
          size="sm"
          width="80px"
          disabled={loading}
          value={[table.getState().pagination.pageSize.toString()]}
          onValueChange={(details) => {
            const [value] = details.value;
            onPageSizeChange(parseInt(value));
          }}
        >
          <SelectTrigger>
            <SelectValueText placeholder="Select Limit" />
          </SelectTrigger>
          <SelectContent>
            {pages.items.map((page) => (
              <SelectItem item={page} key={page}>
                {page}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
        <p className="text"> Total results: {table.getRowCount()}</p>
      </Row>
    </>
  );
};
