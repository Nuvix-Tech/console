import { useQueryClient } from "@tanstack/react-query";

import { tableRowKeys } from "@/data/table-rows/keys";
import { Button } from "@nuvix/ui/components";
import { useParams } from "next/navigation";

export type RefreshButtonProps = {
  tableId?: number;
  isRefetching?: boolean;
};

const RefreshButton = ({ tableId, isRefetching }: RefreshButtonProps) => {
  const { id: ref } = useParams();
  const queryClient = useQueryClient();
  const queryKey = tableRowKeys.tableRowsAndCount(ref as string, tableId);

  async function onClick() {
    await queryClient.invalidateQueries({ queryKey });
  }

  return (
    <Button
      type="text"
      size="s"
      variant="secondary"
      loading={isRefetching}
      prefixIcon={"refresh"}
      onClick={() => onClick()}
    >
      Refresh
    </Button>
  );
};
export default RefreshButton;
