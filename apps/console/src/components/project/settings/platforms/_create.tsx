import { Popover, PopoverTrigger, PopoverContent } from "@nuvix/sui/components/popover";
import { availablePlatforms, platformConfig } from "../../components/_utils";
import { CreatePlatform } from "@/components/wizard";
import { Button } from "@nuvix/ui/components";
import React from "react";

export const CreatePlatformButton: React.FC = () => {
  const [open, setOpen] = React.useState<string | null>(null);

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
              <CreatePlatform
                key={platform}
                type={config.type}
                open={open === config.type}
                onOpenChange={({ open }) => setOpen(open === false ? null : config.type)}
                onClose={() => setOpen(null)}
              >
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
