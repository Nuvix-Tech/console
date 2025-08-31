import { cn } from "@nuvix/sui/lib/utils";
import { Icon, type IconProps } from "@nuvix/ui/components";
import { Brackets } from "lucide-react";
import type React from "react";
import { AttributeFormat, Attributes } from "./utils";

export const AttributeIcon: React.FC<
  { type: Attributes | AttributeFormat; array?: boolean; twoWay?: boolean } & Omit<
    IconProps,
    "name"
  >
> = ({ type, array, twoWay, className, ...rest }) => {
  type = (type.endsWith("[]") ? type.slice(0, -2) : type) as Attributes | AttributeFormat;
  return (
    <div
      className={cn(
        "flex items-center gap-2 size-8 neutral-background-alpha-strong rounded-full relative justify-center",
        className,
      )}
    >
      <Icon name={type} {...rest} />
      {(array || twoWay) && (
        <div className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-background border border-border">
          {array && <Icon name={Brackets} className="!size-3" padding="1" decorative={false} />}
          {type === Attributes.Relationship && (
            <RelationshipIcon type={twoWay ? "twoWay" : "oneWay"} />
          )}
        </div>
      )}
    </div>
  );
};

export const RelationshipIcon = ({ type }: { type: "oneWay" | "twoWay" }) => {
  const icons = {
    oneWay: <Icon name="oneWay" size="xs" />,
    twoWay: <Icon name="twoWay" size="xs" />,
  };

  return icons[type];
};
