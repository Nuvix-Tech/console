import { cn } from "@nuvix/sui/lib/utils";
import { Button, Text } from "@nuvix/ui/components";

export interface NoSearchResultsProps {
  searchString: string;
  onResetFilter?: () => void;
  className?: string;
}

export const NoSearchResults = ({
  searchString,
  onResetFilter,
  className,
}: NoSearchResultsProps) => {
  return (
    <div
      className={cn(
        "surface-background border border-default px-6 py-4 rounded-xs flex items-center justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        <Text as={"p"} variant="label-strong-s">
          No results found
        </Text>
        <Text as={"p"} variant="body-default-s" onBackground="neutral-weak">
          Your search for "{searchString}" did not return any results
        </Text>
      </div>
      {onResetFilter !== undefined && (
        <Button size="s" variant="secondary" type="default" onClick={() => onResetFilter()}>
          Reset filter
        </Button>
      )}
    </div>
  );
};

export default NoSearchResults;
