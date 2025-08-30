import dayjs from "dayjs";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { RenderEditCellProps } from "react-data-grid";

import { BlockKeys, Key } from "../common/BlockKeys";
import { Input } from "@/components/editor/components";
import { Popover, PopoverContent, PopoverTrigger } from "@nuvix/sui/components/popover";
import { cn } from "@nuvix/sui/lib/utils";
import { Button, IconButton } from "@nuvix/ui/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nuvix/sui/components/dropdown-menu";
import {
  TimestampInfo,
  timestampLocalFormatter,
} from "@/components/editor/components/_timestamp_info";

interface BaseEditorProps<TRow, TSummaryRow = unknown>
  extends RenderEditCellProps<TRow, TSummaryRow> {
  type: "date" | "datetime" | "datetimetz";
  isNullable: boolean;
}

const FORMAT_MAP = {
  date: "YYYY-MM-DD",
  datetime: "YYYY-MM-DD HH:mm:ss",
  datetimetz: "YYYY-MM-DD HH:mm:ss+ZZ",
};

function BaseEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  type,
  isNullable,
  onRowChange,
  onClose,
}: BaseEditorProps<TRow, TSummaryRow>) {
  const ref = useRef<HTMLInputElement>(null);
  const format = FORMAT_MAP[type];

  const value = row[column.key as keyof TRow] as unknown as string;
  const [inputValue, setInputValue] = useState(value);
  const timeValue = inputValue ? Number(dayjs(inputValue, format)) : inputValue;

  const saveChanges = (value: string | null) => {
    if ((typeof value === "string" && value.length === 0) || timeValue === "Invalid Date") return;
    onRowChange({ ...row, [column.key]: value }, true);
  };

  const setToNow = () => {
    const formattedNow = dayjs().format(
      type === "date"
        ? "YYYY-MM-DD"
        : type === "datetimetz"
          ? "YYYY-MM-DDTHH:mm:ssZ"
          : "YYYY-MM-DDTHH:mm:ss",
    );
    saveChanges(formattedNow);
  };

  useEffect(() => {
    try {
      ref.current?.focus({ preventScroll: true });
    } catch (e) {
      ref.current?.focus();
    }
  }, []);

  return (
    <Popover open>
      <PopoverTrigger>
        <div className={cn("px-[8px]", value === null ? "neutral-on-backround-weak" : "")}>
          {value === null ? "NULL" : value}
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-64">
        <BlockKeys
          ignoreOutsideClicks
          value={inputValue}
          onEscape={() => onClose(false)}
          onEnter={saveChanges}
        >
          <Input
            ref={ref}
            value={inputValue ?? ""}
            placeholder={format}
            variant={"subtle"}
            onChange={(e) => setInputValue(e.target.value)}
            className="!border-0 !rounded-b-none !bg-[var(--neutral-alpha-weak)] !outline-none !ring-0 !ring-offset-0"
          />
        </BlockKeys>
        <div className="px-3 py-1 flex flex-col gap-y-0.5">
          <p className="text-xs text-secondary-foreground">Formatted value:</p>
          {(inputValue ?? "").length === 0 ? (
            <p className="text-sm font-mono text-muted-foreground">Enter a valid date format</p>
          ) : timeValue === "Invalid Date" ? (
            <p className="text-sm font-mono text-muted-foreground">Invalid date format</p>
          ) : type === "datetimetz" ? (
            <TimestampInfo
              displayAs="utc"
              utcTimestamp={timeValue}
              labelFormat="DD MMM YYYY HH:mm:ss (ZZ)"
              className="text-left !text-sm font-mono tracking-tight"
            />
          ) : (
            <p className="text-sm font-mono tracking-tight">
              {timestampLocalFormatter({
                utcTimestamp: timeValue,
                format:
                  type === "date"
                    ? "DD MMM YYYY"
                    : type === "datetime"
                      ? "DD MMM YYYY HH:mm:ss"
                      : undefined,
              })}
            </p>
          )}
        </div>
        <div className="px-3 pt-1 pb-2 flex justify-between gap-x-1">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Key>⏎</Key>
              <p className="text-xs text-muted-foreground">Save changes</p>
            </div>
            <div className="flex items-center space-x-2">
              <Key>Esc</Key>
              <p className="text-xs text-muted-foreground">Cancel changes</p>
            </div>
          </div>
          <div className="flex">
            {isNullable ? (
              <>
                <Button
                  size="s"
                  variant="secondary"
                  type="button"
                  className="!rounded-r-none"
                  onClick={() => saveChanges(null)}
                >
                  Set NULL
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconButton
                      type="button"
                      variant="secondary"
                      icon={<ChevronDown size={18} />}
                      className="!rounded-l-none !border-l-0"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-20" align="end">
                    <DropdownMenuItem onClick={setToNow}>Set to NOW</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button type="button" size="s" variant="secondary" onClick={setToNow}>
                Set to NOW
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DateTimeEditor(type: "datetime" | "datetimetz" | "date", isNullable: boolean) {
  // eslint-disable-next-line react/display-name
  return <TRow, TSummaryRow = unknown>(props: RenderEditCellProps<TRow, TSummaryRow>) => {
    return <BaseEditor {...props} type={type} isNullable={isNullable} />;
  };
}
