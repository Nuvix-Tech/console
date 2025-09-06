import { ColorModeButton } from "@nuvix/cui/color-mode";
import { ThemeSelector } from "@nuvix/sui/components/ThemeSelector";

export const ThemeSwitch = () => {
  return (
    <div className="flex items-center space-x-2 ml-auto">
      <ThemeSelector />
      <ColorModeButton size={"xs"} />
    </div>
  );
};
