import { DiamondIcon, Fingerprint, Hash, Key } from "lucide-react";

export const SchemaGraphLegend = () => {
  return (
    <div className="absolute bottom-0 left-0 border-t flex justify-center px-1 py-2 neutral-background-medium neutral-border-medium w-full z-10">
      <ul className="flex flex-wrap  items-center justify-center gap-4">
        <li className="flex items-center text-xs font-mono gap-1">
          <Key size={15} strokeWidth={1.5} className="flex-shrink-0 text-muted-foreground" />
          Primary key
        </li>
        <li className="flex items-center text-xs font-mono gap-1">
          <Hash size={15} strokeWidth={1.5} className="flex-shrink-0 text-muted-foreground" />
          Identity
        </li>
        <li className="flex items-center text-xs font-mono gap-1">
          <Fingerprint
            size={15}
            strokeWidth={1.5}
            className="flex-shrink-0 text-muted-foreground"
          />
          Unique
        </li>
        <li className="flex items-center text-xs font-mono gap-1">
          <DiamondIcon
            size={15}
            strokeWidth={1.5}
            className="flex-shrink-0 text-muted-foreground"
          />
          Nullable
        </li>
        <li className="flex items-center text-xs font-mono gap-1">
          <DiamondIcon
            size={15}
            strokeWidth={1.5}
            fill="currentColor"
            className="flex-shrink-0 text-muted-foreground"
          />
          Non-Nullable
        </li>
      </ul>
    </div>
  );
};
