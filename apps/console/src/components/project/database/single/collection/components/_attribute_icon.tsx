import { cn } from "@workspace/ui/lib/utils.js";
import {
  Text,
  Hash,
  CheckCircle,
  List,
  Link,
  AtSign,
  Calendar,
  Globe,
  Brackets,
  ArrowRight,
  ArrowRightLeft,
  ArrowUpRight,
} from "lucide-react";

export const AttributeIcon = (
  attribute: any,
  isArray: boolean = false,
  size: number = 16,
  className?: string,
) => {
  const icons = {
    string: <Text size={size} />,
    integer: <Hash size={size} />,
    float: <Hash size={size} />,
    boolean: <CheckCircle size={size} />,
    enum: <List size={size} />,
    url: <Link size={size} />,
    email: <AtSign size={size} />,
    relationship: <ArrowUpRight size={size} />,
    datetime: <Calendar size={size} />,
    ip: <Globe size={size} />,
  };
  const type = (attribute.format || attribute.type) as keyof typeof icons;
  const isTwoWay = attribute?.twoWay ?? "-";
  return (
    <div
      className={cn(
        "flex items-center gap-2 size-8 neutral-background-alpha-strong rounded-full relative justify-center",
        className,
      )}
    >
      {icons[type]}
      {(isArray || isTwoWay !== "-") && (
        <div className="absolute bottom-0 right-0">
          {isArray && <Brackets size={10} />}
          {type === "relationship" && <RelationshipIcon type={isTwoWay ? "twoWay" : "oneWay"} />}
        </div>
      )}
    </div>
  );
};

export const RelationshipIcon = ({ type }: { type: "oneWay" | "twoWay" }) => {
  const icons = {
    oneWay: <ArrowRight size={10} />,
    twoWay: <ArrowRightLeft size={10} />,
  };

  return icons[type];
};
