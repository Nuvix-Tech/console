import { Chip } from "@nuvix/ui/components";
import { Clipboard } from "@chakra-ui/react";
import { LuClipboard } from "react-icons/lu";
import { LuCheck } from "react-icons/lu";
import type React from "react";

type Props = {
  id?: string;
  hideIcon?: boolean;
  label?: string;
} & Partial<React.ComponentProps<typeof Chip>>;

const IDChip = ({ id, hideIcon, label, ...rest }: Props) => {
  return (
    <Clipboard.Root value={id}>
      <Clipboard.Trigger asChild>
        <Clipboard.Indicator
          copied={
            <Chip
              {...rest}
              selected
              data-action="copyChip"
              prefixIcon={<LuCheck size={14} />}
              label={label ?? id ?? "Unknown"}
              iconButtonProps={{
                tooltip: "Copied",
                tooltipPosition: "top",
              }}
            />
          }
        >
          <Chip
            {...rest}
            selected={false}
            data-action="copyChip"
            label={label ?? id ?? "Unknown"}
            prefixIcon={!hideIcon && <LuClipboard size={14} />}
            iconButtonProps={{
              tooltip: "Copy ID",
              tooltipPosition: "top",
            }}
          />
        </Clipboard.Indicator>
      </Clipboard.Trigger>
    </Clipboard.Root>
  );
};

export default IDChip;
