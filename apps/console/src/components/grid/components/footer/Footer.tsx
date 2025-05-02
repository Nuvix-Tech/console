// import { useParams } from "common";
// import { useProjectContext } from "components/layouts/ProjectLayout/ProjectContext";
// import { GridFooter } from "components/ui/GridFooter";
// import TwoOptionToggle from "components/ui/TwoOptionToggle";
import { useTableEditorQuery } from "@/data/table-editor/table-editor-query";
import { isTableLike, isViewLike } from "@/data/table-editor/table-editor-types";
// import { useUrlState } from "hooks/ui/useUrlState";
import { useSearchQuery } from "@/hooks/useQuery";
import RefreshButton from "../header/RefreshButton";
import { Pagination } from "./pagination";
import { useTableEditorTableState } from "@/lib/store/table";
import { useProjectStore } from "@/lib/store";

export interface FooterProps {
  isRefetching?: boolean;
}

const GridFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center justify-between px-4 py-1 min-h-10">{children}</div>;
};

const TwoOptionToggle = ({
  width,
  options,
  activeOption,
  borderOverride,
  onClickOption,
}: {
  width: number;
  options: string[];
  activeOption: string;
  borderOverride?: string;
  onClickOption: (option: string) => void;
}) => {
  return (
    <div className={`relative inline-flex ${borderOverride} rounded-full overflow-hidden`}>
      {options.map((option) => (
        <button
          key={option}
          className={`
            relative z-10 w-${width} px-4 py-2 text-sm font-medium
            ${activeOption === option ? "text-slate-800" : "text-gray-500 hover:bg-gray-100"}`}
          onClick={() => onClickOption(option)}
        >
          {option}
          {activeOption === option && (
            <span className="absolute inset-0 bg-white rounded-full transition-all duration-200 z-[-1]" />
          )}
        </button>
      ))}
    </div>
  );
};

const Footer = ({ isRefetching }: FooterProps) => {
  const { params, setQueryParam } = useSearchQuery();
  const tableId = Number(params.get("table"));
  const { sdk, project } = useProjectStore();

  const { data: entity } = useTableEditorQuery({
    projectRef: project?.$id,
    sdk,
    id: tableId,
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
            width={75}
            options={["definition", "data"]}
            activeOption={selectedView}
            borderOverride="border"
            onClickOption={setSelectedView}
          />
        )}
      </div>
    </GridFooter>
  );
};

export default Footer;
