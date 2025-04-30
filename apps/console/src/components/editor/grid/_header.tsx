import { Button } from "@nuvix/ui/components";
import { InsertRow } from "./_insert";

export const GridHeader = () => {
  return (
    <div className="neutral-background-alpha-medium w-full h-12 rounded-md px-4 py-1">
      <Button>Insert</Button>

      <InsertRow onClose={() => {}} refetch={null as any} />
    </div>
  );
};
