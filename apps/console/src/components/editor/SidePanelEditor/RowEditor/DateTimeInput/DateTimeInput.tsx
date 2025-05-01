import dayjs from "dayjs";
import { Edit } from "lucide-react";
import { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nuvix/sui/components/dropdown-menu";
import { getColumnType } from "./DateTimeInput.utils";
import { Button, Input } from "@nuvix/ui/components";
import { cn } from "@nuvix/sui/lib/utils";

interface DateTimeInputProps {
  name: string;
  format: string;
  value: string;
  isNullable: boolean;
  description: string | ReactNode;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Note: HTML Input cannot accept timezones within the value string
 * e.g Yes: 2022-05-13T14:29:03
 *     No:  2022-05-13T14:29:03+0800
 */
const DateTimeInput = ({
  value,
  onChange,
  name,
  isNullable,
  format,
  description,
  disabled = false,
}: DateTimeInputProps) => {
  const inputType = getColumnType(format);

  return (
    <Input
      layout="horizontal"
      className={cn("w-full [&>div>div>div>input]:pr-10")}
      label={name}
      description={
        <div className="space-y-1">
          {description}
          {format.includes("tz") && (
            <p>Your local timezone will be automatically applied ({dayjs().format("ZZ")})</p>
          )}
        </div>
      }
      labelOptional={format}
      // size="small"
      height="s"
      labelAsPlaceholder
      value={value}
      type={inputType}
      step={inputType == "datetime-local" || inputType == "time" ? "1" : undefined}
      hasSuffix={
        !disabled && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="default" prefixIcon={<Edit />} className="px-1.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-28 pointer-events-auto">
              {isNullable && (
                <DropdownMenuItem onClick={() => onChange("")}>Set to NULL</DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() =>
                  onChange(
                    dayjs().format(
                      format === "date"
                        ? "YYYY-MM-DD"
                        : ["time", "timetz"].includes(format)
                          ? "HH:mm:ss"
                          : "YYYY-MM-DDTHH:mm:ss",
                    ),
                  )
                }
              >
                Set to now
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
};

export default DateTimeInput;
