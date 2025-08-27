import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "@nuvix/ui/components";
import { useParams } from "next/navigation";
import { collectionKeys } from "@/data/collections/keys";

export type RefreshButtonProps = {
  schema: string;
  collectionId: string;
  isRefetching?: boolean;
};

const RefreshButton = ({ collectionId, schema, isRefetching }: RefreshButtonProps) => {
  const { id: ref } = useParams();
  const queryClient = useQueryClient();
  const queryKey = collectionKeys.documents(ref as string, schema, collectionId);

  async function onClick() {
    await queryClient.invalidateQueries({ queryKey });
  }

  return (
    <Button
      type="text"
      size="s"
      variant="secondary"
      loading={isRefetching}
      prefixIcon={<RefreshCw className="text-foreground-muted" strokeWidth={1.5} size={18} />}
      onClick={() => onClick()}
    >
      Refresh
    </Button>
  );
};
export default RefreshButton;
