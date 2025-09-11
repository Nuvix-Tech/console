import { Popover, PopoverTrigger, PopoverContent } from "@nuvix/sui/components/popover";
import { availablePlatforms, platformConfig } from "../../components/_utils";
import { CreatePlatform } from "@/components/wizard";
import { Button } from "@nuvix/ui/components";

export const CreatePlatformButton: React.FC = () => {
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button variant="primary" size="s">
            Create Platform
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-44 p-2">
          {availablePlatforms.map((platform) => {
            const config = platformConfig[platform as keyof typeof platformConfig];
            return (
              <CreatePlatform key={platform} type={config.type}>
                <Button
                  variant="tertiary"
                  size="s"
                  justifyContent="flex-start"
                  fillWidth
                  className="flex items-center gap-2"
                  prefixIcon={config.icon}
                >
                  <span>{config.label}</span>
                </Button>
              </CreatePlatform>
            );
          })}
        </PopoverContent>
      </Popover>
    </>
  );
};
