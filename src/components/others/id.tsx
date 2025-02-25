import { Chip } from "@/ui/components";
import { Clipboard } from "@chakra-ui/react";
import { LuClipboard } from "react-icons/lu";
import { LuCheck } from "react-icons/lu";

type Props = {
  id?: string;
  hideIcon?: boolean;
};

const IDChip = ({ id, hideIcon }: Props) => {
  return (
    <Clipboard.Root value={id}>
      <Clipboard.Trigger asChild>
        <Clipboard.Indicator
          copied={
            <Chip
              selected
              data-action="copyChip"
              prefixIcon={<LuCheck size={14} />}
              label={id ?? "Unknown"}
              iconButtonProps={{
                tooltip: "Copied",
                tooltipPosition: "top",
              }}
            />
          }
        >
          <Chip
            selected={false}
            data-action="copyChip"
            label={id ?? "Unknown"}
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
