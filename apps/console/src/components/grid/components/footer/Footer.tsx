import { useTableEditorQuery } from "@/data/table-editor/table-editor-query";
import { isTableLike, isViewLike } from "@/data/table-editor/table-editor-types";
import { useSearchQuery } from "@/hooks/useQuery";
import RefreshButton from "../header/RefreshButton";
import { Pagination } from "./pagination";
import { useTableEditorTableStateSnapshot } from "@/lib/store/table";
import { useProjectStore } from "@/lib/store";
import { useParams } from "next/navigation";
import { TableParam } from "@/types";
import { TwoOptionToggle } from "@/components/others/ui";

export interface FooterProps {
  isRefetching?: boolean;
}

const GridFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 min-h-10">
      {children}
    </div>
  );
};

const Footer = ({ isRefetching }: FooterProps) => {
  const { params, setQueryParam } = useSearchQuery();
  const { tableId } = useParams<TableParam>();
  const { sdk, project } = useProjectStore();

  const { data: entity } = useTableEditorQuery({
    projectRef: project?.$id,
    sdk,
    id: Number(tableId),
  });

  const selectedView = params.get("view") || "data";

  const setSelectedView = (view: string) => {
    if (view) {
      setQueryParam("view", view);
    } else {
      setQueryParam("view", undefined);
    }
  };

  const isViewSelected = isViewLike(entity);
  const isTableSelected = isTableLike(entity);

  return (
    <GridFooter>
      {selectedView === "data" && <Pagination />}

      <div className="ml-auto flex items-center gap-x-2">
        {entity && selectedView === "data" && (
          <RefreshButton tableId={entity.id} isRefetching={isRefetching} />
        )}

        {(isViewSelected || isTableSelected) && (
          <TwoOptionToggle
            size="xs"
            height={"30px"}
            options={["definition", "data"]}
            activeOption={selectedView}
            onClickOption={setSelectedView}
          />
        )}
      </div>
    </GridFooter>
  );
};

export default Footer;
