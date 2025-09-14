import { useQueryClient } from "@tanstack/react-query";

import { tableRowKeys } from "@/data/table-rows/keys";
import { IconButton } from "@nuvix/ui/components";
import { useParams } from "next/navigation";
import { cn } from "@nuvix/sui/lib/utils";

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
    <IconButton
      type="text"
      size="m"
      variant="secondary"
      onClick={() => onClick()}
      icon={"refresh"}
      className={cn({
        "animate-spin": isRefetching,
      })}
      tooltipPosition="bottom"
      tooltip="Refresh"
    />
  );
};
export default RefreshButton;
