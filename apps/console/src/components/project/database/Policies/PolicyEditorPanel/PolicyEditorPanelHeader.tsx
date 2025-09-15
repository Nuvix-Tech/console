import type { PostgresPolicy } from "@nuvix/pg-meta";
import { ChevronDown, PanelLeftClose, PanelRightClose, X } from "lucide-react";
import { useState } from "react";

import {
  CollapsibleContent,
  CollapsibleTrigger,
  Collapsible,
} from "@nuvix/sui/components/collapsible";

import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { SheetClose, SheetHeader, SheetTitle } from "@nuvix/sui/components/sheet";
import { cn } from "@nuvix/sui/lib/utils";

export const PolicyEditorPanelHeader = ({
  selectedPolicy,
  showTools,
  setShowTools,
}: {
  selectedPolicy?: PostgresPolicy;
  showTools: boolean;
  setShowTools: (v: boolean) => void;
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <SheetHeader className={cn("py-3 flex flex-row justify-between items-start border-b")}>
      <div className="flex flex-row gap-3 max-w-[75%] items-start">
        <SheetClose
          className={cn(
            "text-muted-foreground hover:text ring-offset-background transition-opacity hover:opacity-100",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "transition disabled:pointer-events-none data-[state=open]:bg-secondary",
            "mt-1.5",
          )}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Close</span>
        </SheetClose>
        <div className="h-[24px] w-[1px] bg-muted" />
        <div>
          <SheetTitle className="truncate">
            {selectedPolicy !== undefined
              ? `Update policy: ${selectedPolicy.name}`
              : "Create a new Row Level Security policy"}
          </SheetTitle>
          {selectedPolicy !== undefined && (
            <Collapsible
              className="-mt-1.5 pb-1.5"
              open={showDetails}
              onOpenChange={setShowDetails}
            >
              <CollapsibleTrigger className="group  font-normal p-0 [&[data-state=open]>div>svg]:!-rotate-180">
                <div className="flex items-center gap-x-2 w-full">
                  <p className="!text-xs neutral-on-background-medium group-hover:text-foreground transition">
                    View policy details
                  </p>
                  <ChevronDown
                    className="transition-transform duration-200"
                    strokeWidth={1.5}
                    size={14}
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="grid gap-1.5">
                <div className="flex my-2">
                  <div>
                    <div className="!text-xs flex items-start gap-2 border-b py-1.5">
                      <p className="w-[110px] neutral-on-background-medium">Name:</p>
                      <p className="pr-4">{selectedPolicy?.name}</p>
                    </div>
                    <div className="!text-xs flex items-start gap-2 border-b py-1.5">
                      <p className="w-[110px] neutral-on-background-medium">Action:</p>
                      <p className="font-mono pr-4">{selectedPolicy?.action}</p>
                    </div>
                    <div className="!text-xs flex items-start gap-2 border-b py-1.5">
                      <p className="w-[110px] neutral-on-background-medium">Command:</p>
                      <p className="font-mono pr-4">{selectedPolicy?.command}</p>
                    </div>
                    <div className="!text-xs flex items-start gap-2 border-b py-1.5">
                      <p className="w-[110px] neutral-on-background-medium">Target roles:</p>
                      <p className="font-mono pr-4">{selectedPolicy?.roles.join(", ")}</p>
                    </div>
                    <div className="!text-xs flex items-start gap-2 border-b py-1.5">
                      <p className="w-[110px] neutral-on-background-medium">USING expression:</p>
                      <p className="font-mono pr-4">{selectedPolicy?.definition}</p>
                    </div>
                    <div className="!text-xs flex items-start gap-2 pt-1.5">
                      <p className="w-[110px] neutral-on-background-medium">CHECK expression:</p>
                      <p
                        className={`${selectedPolicy?.check ? "" : "neutral-on-background-medium"} font-mono pr-4`}
                      >
                        {selectedPolicy?.check ?? "None"}
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-expanded={showTools}
            aria-controls="ai-chat-assistant"
            className={cn(
              !showTools ? "neutral-on-background-weak" : "text-light",
              "mt-1 hover:text-foreground transition",
            )}
            onClick={() => setShowTools(!showTools)}
          >
            {!showTools ? (
              <PanelLeftClose size={19} strokeWidth={1} />
            ) : (
              <PanelRightClose size={19} strokeWidth={1} />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="left">{showTools ? "Hide" : "Show"} tools</TooltipContent>
      </Tooltip>
    </SheetHeader>
  );
};
