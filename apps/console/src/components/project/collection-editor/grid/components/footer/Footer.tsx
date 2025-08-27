import RefreshButton from "../header/RefreshButton";
import { Pagination } from "./pagination";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";

export interface FooterProps {
  isRefetching?: boolean;
}

const GridFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center justify-between px-4 py-2 min-h-10">{children}</div>;
};

const Footer = ({ isRefetching }: FooterProps) => {
  const snap = useCollectionEditorCollectionStateSnapshot();

  return (
    <GridFooter>
      <Pagination />

      <div className="ml-auto flex items-center gap-x-2">
        <RefreshButton
          collectionId={snap.collection.$id}
          schema={snap.collection.$schema}
          isRefetching={isRefetching}
        />
      </div>
    </GridFooter>
  );
};

export default Footer;
