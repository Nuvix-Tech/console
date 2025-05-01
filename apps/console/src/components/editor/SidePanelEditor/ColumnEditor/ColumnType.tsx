import { noop } from "lodash";
import {
  Calendar,
  Check,
  ChevronsUpDown,
  ExternalLink,
  Hash,
  ListPlus,
  ToggleRight,
  Type,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";

import type { EnumeratedType } from "@/data/enumerated-types/enumerated-types-query";
// import {
//   AlertDescription_Shadcn_,
//   AlertTitle_Shadcn_,
//   Alert_Shadcn_,
//   Button,
//   CommandEmpty_Shadcn_,
//   CommandGroup_Shadcn_,
//   CommandInput_Shadcn_,
//   CommandItem_Shadcn_,
//   CommandList_Shadcn_,
//   Command_Shadcn_,
//   CriticalIcon,
//   Input,
//   Label_Shadcn_,
//   PopoverContent_Shadcn_,
//   PopoverTrigger_Shadcn_,
//   Popover_Shadcn_,
//   ScrollArea,
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
//   cn,
// } from "ui";
import {
  POSTGRES_DATA_TYPES,
  POSTGRES_DATA_TYPE_OPTIONS,
  RECOMMENDED_ALTERNATIVE_DATA_TYPE,
} from "../SidePanelEditor.constants";
import type { PostgresDataTypeOption } from "../SidePanelEditor.types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { Button, Icon, Input } from "@nuvix/ui/components";
import { Label } from "@nuvix/sui/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@nuvix/sui/components/popover";
import { cn } from "@nuvix/sui/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@nuvix/sui/components/command";
import { Alert, AlertDescription, AlertTitle } from "@nuvix/sui/components/alert";

interface ColumnTypeProps {
  value: string;
  enumTypes: EnumeratedType[];
  className?: string;
  error?: any;
  disabled?: boolean;
  showLabel?: boolean;
  layout?: "horizontal" | "vertical";
  description?: ReactNode;
  showRecommendation?: boolean;
  onOptionSelect: (value: string) => void;
}

const ColumnType = ({
  value,
  className,
  enumTypes = [],
  disabled = false,
  showLabel = true,
  layout = "horizontal",
  description,
  showRecommendation = false,
  onOptionSelect = noop,
}: ColumnTypeProps) => {
  const [open, setOpen] = useState(false);
  const availableTypes = POSTGRES_DATA_TYPES.concat(
    enumTypes.map((type) => type.format.replaceAll('"', "")),
  );
  const isAvailableType = value ? availableTypes.includes(value) : true;
  const recommendation = RECOMMENDED_ALTERNATIVE_DATA_TYPE[value];

  const unsupportedDataTypeText = `This column's data type cannot be changed via the Table Editor as it is not supported yet. You can do so through the SQL Editor instead.`;

  const getOptionByName = (name: string) => {
    // handle built in types
    const pgOption = POSTGRES_DATA_TYPE_OPTIONS.find((option) => option.name === name);
    if (pgOption) return pgOption;

    // handle custom enums
    const enumType = enumTypes.find((type) => type.format === name);
    return enumType ? { ...enumType, type: "enum" } : undefined;
  };

  const inferIcon = (type: string) => {
    switch (type) {
      case "number":
        return <Hash size={14} className="text-foreground" strokeWidth={1.5} />;
      case "time":
        return <Calendar size={14} className="text-foreground" strokeWidth={1.5} />;
      case "text":
        return <Type size={14} className="text-foreground" strokeWidth={1.5} />;
      case "json":
        return (
          <div className="text-foreground" style={{ padding: "0px 1px" }}>
            {"{ }"}
          </div>
        );
      case "jsonb":
        return (
          <div className="text-foreground" style={{ padding: "0px 1px" }}>
            {"{ }"}
          </div>
        );
      case "bool":
        return <ToggleRight size={14} className="text-foreground" strokeWidth={1.5} />;
      default:
        return <ListPlus size={16} className="text-foreground" strokeWidth={1.5} />;
    }
  };

  if (!isAvailableType) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Input
            readOnly
            disabled
            label={showLabel ? "Type" : ""}
            // layout={showLabel ? layout : undefined}
            className="md:gap-x-0 [&>div>div]:text-left"
            height="s"
            hasPrefix={inferIcon(
              POSTGRES_DATA_TYPE_OPTIONS.find((x) => x.name === value)?.type ?? "",
            )}
            value={value}
            description={showLabel ? unsupportedDataTypeText : undefined}
          />
        </TooltipTrigger>
        {!showLabel && (
          <TooltipContent side="bottom" className="w-80">
            {unsupportedDataTypeText}
          </TooltipContent>
        )}
      </Tooltip>
    );
  }

  if (disabled && !showLabel) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Input
            readOnly
            disabled
            label={showLabel ? "Type" : ""}
            // layout={showLabel ? "horizontal" : undefined}
            className="md:gap-x-0"
            // size="small"
            value={value}
          />
        </TooltipTrigger>
        {!showLabel && description && (
          <TooltipContent side="bottom">
            <div className="w-80">{description}</div>
          </TooltipContent>
        )}
      </Tooltip>
    );
  }

  return (
    <div className={cn("flex flex-col gap-y-2", className)}>
      {showLabel && <Label className="text-foreground-light">Type</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="default"
            role="combobox"
            size={"s"}
            aria-expanded={open}
            className={cn("w-full justify-between", !value && "text-foreground-lighter")}
            suffixIcon={<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
          >
            {value ? (
              <div className="flex gap-2 items-center">
                <span>{inferIcon(getOptionByName(value)?.type ?? "")}</span>
                {value.replaceAll('"', "")}
              </div>
            ) : (
              "Choose a column type..."
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[460px] p-0" side="bottom" align="center">
          <ScrollArea className="h-[335px]">
            <Command>
              <CommandInput placeholder="Search types..." />
              <CommandEmpty>Type not found.</CommandEmpty>

              <CommandList>
                <CommandGroup>
                  {POSTGRES_DATA_TYPE_OPTIONS.map((option: PostgresDataTypeOption) => (
                    <CommandItem
                      key={option.name}
                      value={option.name}
                      className={cn("relative", option.name === value ? "bg-surface-200" : "")}
                      onSelect={(value: string) => {
                        onOptionSelect(value);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2 pr-6">
                        <span>{inferIcon(option.type)}</span>
                        <span className="text-foreground">{option.name}</span>
                        <span className="text-foreground-lighter">{option.description}</span>
                      </div>
                      <span className="absolute right-3 top-2">
                        {option.name === value ? <Check className="text-brand" size={14} /> : ""}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                {enumTypes.length > 0 && (
                  <>
                    <CommandItem>Other types</CommandItem>
                    <CommandGroup>
                      {enumTypes.map((option) => (
                        <CommandItem
                          key={option.id}
                          value={option.format}
                          className={cn(
                            "relative",
                            option.format === value ? "bg-surface-200" : "",
                          )}
                          onSelect={(value: string) => {
                            // [Joshen] For camel case types specifically, format property includes escaped double quotes
                            // which will cause the POST columns call to error out. So we strip it specifically in this context
                            onOptionSelect(
                              option.schema === "public" ? value.replaceAll('"', "") : value,
                            );
                            setOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div>
                              <ListPlus size={16} className="text-foreground" strokeWidth={1.5} />
                            </div>
                            <span className="text-foreground">
                              {option.format.replaceAll('"', "")}
                            </span>
                            {option.comment !== undefined && (
                              <span
                                title={option.comment ?? ""}
                                className="text-foreground-lighter"
                              >
                                {option.comment}
                              </span>
                            )}
                            {option.format === value && (
                              <span className="absolute right-3 top-2">
                                <Check className="text-brand" size={14} />
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {showRecommendation && recommendation !== undefined && (
        <Alert variant="warning" className="mt-2">
          <Icon name="warningTriangle" />
          <AlertTitle>
            {" "}
            It is recommended to use <code className="text-xs">{recommendation.alternative}</code>{" "}
            instead
          </AlertTitle>
          <AlertDescription>
            <p>
              Postgres recommends against using the data type{" "}
              <code className="text-xs">{value}</code> unless you have a very specific use case.
            </p>
            <div className="flex items-center space-x-2 mt-3">
              <Button type="default" prefixIcon={<ExternalLink />}>
                {/* asChild */}
                <Link href={recommendation.reference} target="_blank" rel="noreferrer">
                  Read more
                </Link>
              </Button>
              <Button type="primary" onClick={() => onOptionSelect(recommendation.alternative)}>
                Use {recommendation.alternative}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export const ScrollArea = ({
  children,
  className,
}: { children: ReactNode; className?: string }) => {
  return (
    <div
      className={cn(
        "h-full w-full overflow-hidden rounded-md border bg-surface-100",
        "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:duration-200",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ColumnType;
