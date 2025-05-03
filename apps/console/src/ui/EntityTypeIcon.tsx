import { ENTITY_TYPE } from "@/data/entity-types/entity-type-constants";
import { cn } from "@nuvix/sui/lib/utils";
import { Eye, GitBranch, Table2 } from "lucide-react";

interface EntityTypeIconProps {
  type: "sql" | "schema" | "new" | "r" | "v" | "m" | "f" | "p";
  size?: number;
  strokeWidth?: number;
  isActive?: boolean;
}

const SQL_ICON = ({ size, className, strokeWidth }: any) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EntityTypeIcon = ({
  type,
  size = 15,
  strokeWidth = 1.5,
  isActive,
}: EntityTypeIconProps) => {
  if (type === "sql") {
    return (
      <SQL_ICON
        size={size}
        className={cn(
          "transition-colors",
          "fill-foreground-muted",
          "group-aria-selected:fill-foreground",
          "w-4 h-4",
          "-ml-0.5",
        )}
        strokeWidth={strokeWidth}
      />
    );
  }

  if (type === ENTITY_TYPE.TABLE) {
    return (
      <Table2
        size={size}
        strokeWidth={strokeWidth}
        className={cn(
          "text-foreground-muted group-hover:text-foreground-lighter group-aria-selected:text-foreground",
          isActive && "text-foreground-light",
          "transition-colors",
        )}
      />
    );
  }

  if (type === "schema") {
    return <GitBranch size={size} strokeWidth={strokeWidth} />;
  }

  if (type === ENTITY_TYPE.VIEW) {
    return (
      <Eye
        size={size}
        strokeWidth={strokeWidth}
        className={cn(
          "text-foreground-muted group-hover:text-foreground-lighter",
          isActive && "text-foreground-lighter",
          "transition-colors",
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center text-xs h-4 w-4 rounded-[2px] font-bold",
        type === ENTITY_TYPE.FOREIGN_TABLE && "text-yellow-900 bg-yellow-500",
        type === ENTITY_TYPE.MATERIALIZED_VIEW && "text-purple-1000 bg-purple-500",
        type === ENTITY_TYPE.PARTITIONED_TABLE && "text-foreground-light bg-border-stronger",
      )}
    >
      {Object.entries(ENTITY_TYPE)
        .find(([, value]) => value === type)?.[0]?.[0]
        ?.toUpperCase()}
    </div>
  );
};
