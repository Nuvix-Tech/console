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
import {
  POSTGRES_DATA_TYPES,
  POSTGRES_DATA_TYPE_OPTIONS,
  RECOMMENDED_ALTERNATIVE_DATA_TYPE,
} from "../SidePanelEditor.constants";
import type { PostgresDataTypeOption } from "../SidePanelEditor.types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { Button, Icon } from "@nuvix/ui/components";
import { Button as ChakraButton } from "@chakra-ui/react";
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
import { Input } from "@/components/others/ui";
import { Code } from "@chakra-ui/react";

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
            orientation={showLabel ? layout : undefined}
            className="md:gap-x-0 [&>div>div]:text-left"
            width="100%"
            size={"sm"}
            hasPrefix={inferIcon(
              POSTGRES_DATA_TYPE_OPTIONS.find((x) => x.name === value)?.type ?? "",
            )}
            value={value}
            helperText={showLabel ? unsupportedDataTypeText : undefined}
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
            orientation={showLabel ? "horizontal" : undefined}
            className="md:gap-x-0"
            size="sm"
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
      {showLabel && <Label className="neutral-on-backround-medium">Type</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <ChakraButton
            role="combobox"
            variant="outline"
            size="xs"
            justifyContent="space-between"
            aria-expanded={open}
            className={cn(!value && "text-muted-foreground truncate")}
          >
            {value ? (
              <div className="flex gap-2 items-center max-w-[90%]">
                <span>{inferIcon(getOptionByName(value)?.type ?? "")}</span>
                <span className="truncate">{value.replaceAll('"', "")}</span>
              </div>
            ) : (
              <span className="truncate max-w-[85%]">{"Choose a column type..."}</span>
            )}
            <ChevronsUpDown className="opacity-50" />
          </ChakraButton>
        </PopoverTrigger>
        <PopoverContent className="w-[460px] p-0" side="bottom" align="center">
          <Command>
            <CommandInput placeholder="Search types..." />
            <CommandEmpty>Type not found.</CommandEmpty>

            <CommandList className="max-h-[335px] overflow-y-auto">
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
                      <span className="neutral-on-backround-weak">{option.description}</span>
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
                        className={cn("relative", option.format === value ? "bg-surface-200" : "")}
                        onSelect={(value: string) => {
                          // For camel case types specifically, format property includes escaped double quotes
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
                              className="neutral-on-backround-weak"
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
        </PopoverContent>
      </Popover>

      {showRecommendation && recommendation !== undefined && (
        <Alert variant="warning" className="mt-2">
          <Icon name="warningTriangle" size="s" />
          <AlertTitle>
            {" "}
            It is recommended to use <Code className="text-xs">{recommendation.alternative}</Code>{" "}
            instead
          </AlertTitle>
          <AlertDescription>
            <p>
              Postgres recommends against using the data type{" "}
              <Code className="text-xs">{value}</Code> unless you have a very specific use case.
            </p>
            <div className="flex items-center space-x-2 mt-3">
              <Button
                asChild
                type="default"
                size="s"
                variant="secondary"
                prefixIcon={<ExternalLink size={14} />}
              >
                <Link href={recommendation.reference} target="_blank" rel="noreferrer">
                  Read more
                </Link>
              </Button>
              <Button
                variant="primary"
                size="s"
                onClick={() => onOptionSelect(recommendation.alternative)}
              >
                Use {recommendation.alternative}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ColumnType;
