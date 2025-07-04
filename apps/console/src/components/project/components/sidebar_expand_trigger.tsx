import { Tooltip, TooltipTrigger, TooltipContent } from "@nuvix/sui/components/tooltip";
import { cn } from "@nuvix/sui/lib/utils";
import { ChevronRight } from "lucide-react";

export const SidebarExpandTrigger = ({ onClick }: { onClick: () => void }) => {
  return (
    <Tooltip>
      <button
        onClick={onClick}
        aria-label="Expand sidebar"
        className={cn(
          "absolute left-[64px] top-1/2 transform translate-y-[calc(-50%-64px)] z-10",
          "group/expand h-8 w-1.5 rounded-r-md transition-all duration-300",
          "bg-muted hover:w-4 hover:bg-muted/60",
          "flex items-center justify-center overflow-hidden cursor-pointer",
        )}
      >
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-block transition-transform duration-300",
              "text-muted-foreground text-xs",
              "rotate-0 group-hover/expand:rotate-0",
              "opacity-100 group-hover/expand:opacity-100",
              "group translate-x-2 group-hover/expand:translate-x-0",
            )}
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground transition-opacity duration-300" />
          </span>
        </TooltipTrigger>
      </button>
      <TooltipContent side="right">Open sidebar</TooltipContent>
    </Tooltip>
  );
};
