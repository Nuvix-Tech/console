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
import { IconButton } from "@nuvix/ui/components";
import { cn } from "@nuvix/sui/lib/utils";
import { Input } from "@/components/others/ui";

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
      orientation="horizontal"
      className={cn("w-full")}
      label={name}
      helperText={
        <div className="space-y-1">
          {description}
          {format.includes("tz") && (
            <p>Your local timezone will be automatically applied ({dayjs().format("ZZ")})</p>
          )}
        </div>
      }
      optionalText={format}
      size="sm"
      value={value}
      type={inputType}
      step={inputType == "datetime-local" || inputType == "time" ? "1" : undefined}
      hasSuffix={
        !disabled && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton size="s" type="default" icon={<Edit size={14} />} variant="secondary" />
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
