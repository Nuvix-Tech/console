// import { useParams } from "common";
// import { useProjectContext } from "components/layouts/ProjectLayout/ProjectContext";
// import { GridFooter } from "components/ui/GridFooter";
// import TwoOptionToggle from "components/ui/TwoOptionToggle";
// import { useTableEditorQuery } from "data/table-editor/table-editor-query";
// import { isTableLike, isViewLike } from "data/table-editor/table-editor-types";
// import { useUrlState } from "hooks/ui/useUrlState";
import { useSearchQuery } from "@/hooks/useQuery";
import RefreshButton from "../header/RefreshButton";
import { Pagination } from "./pagination";
import { useTableEditorTableState } from "@/lib/store/table";

export interface FooterProps {
  isRefetching?: boolean;
}

const GridFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-200">{children}</div>
  );
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
    <div className={`flex ${borderOverride} rounded-md`}>
      {options.map((option) => (
        <button
          key={option}
          className={`w-${width} p-2 text-sm font-medium ${
            activeOption === option ? "bg-blue-500 text-white" : "text-gray-700"
          }`}
          onClick={() => onClickOption(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

const Footer = ({ isRefetching }: FooterProps) => {
  const { table: entity } = useTableEditorTableState().getState();
  const { params, setQueryParam } = useSearchQuery();

  const selectedView = params.get("view") || "definition";

  const setSelectedView = (view: string) => {
    if (view === "data") {
      setQueryParam("view", view);
    } else {
      setQueryParam("view", undefined);
    }
  };

  // const isViewSelected = isViewLike(entity);
  // const isTableSelected = isTableLike(entity);

  return (
    <GridFooter>
      {selectedView === "data" && <Pagination />}

      <div className="ml-auto flex items-center gap-x-2">
        {/* {entity && selectedView === "data" && ( */}
        <RefreshButton tableId={entity.id} isRefetching={isRefetching} />
        {/* )} */}

        {/* {(isViewSelected || isTableSelected) && ( */}
        <TwoOptionToggle
          width={75}
          options={["definition", "data"]}
          activeOption={selectedView}
          borderOverride="border"
          onClickOption={setSelectedView}
        />
        {/* )} */}
      </div>
    </GridFooter>
  );
};

export default Footer;
