import { IS_PLATFORM } from "@/lib/constants";
import { Popover, PopoverTrigger, PopoverContent } from "@nuvix/sui/components/popover";
import { Button, Icon, Text } from "@nuvix/ui/components";

export const HelpButton = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="s" variant="tertiary">
          Support
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-[320px]">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Icon name="helpCircle" />
            <Text as="h3" variant="heading-strong-s">
              Need Help?
            </Text>
          </div>

          <div className="space-y-3">
            <a
              href="https://docs.nuvix.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xs border hover:bg-muted transition-colors group"
            >
              <Icon name="document" />
              <div>
                <div className="font-medium text-(--neutral-on-background-medium) hover:text-(--neutral-on-background-strong)">
                  Documentation
                </div>
                <div className="text-sm neutral-on-background-weak">
                  Browse guides and API reference
                </div>
              </div>
            </a>

            <a
              href="https://github.com/Nuvix-Tech/nuvix/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xs border hover:bg-muted transition-colors group"
            >
              <Icon name="github" />
              <div>
                <div className="font-medium text-(--neutral-on-background-medium) hover:text-(--neutral-on-background-strong)">
                  Open GitHub issue
                </div>
                <div className="text-sm neutral-on-background-weak">
                  Report a bug or pitch a new feature
                </div>
              </div>
            </a>

            {IS_PLATFORM && (
              <a
                href="mailto:support@nuvix.in"
                className="flex items-center gap-3 p-3 rounded-xs border hover:bg-muted transition-colors group"
              >
                <Icon name="mail" />
                <div>
                  <div className="font-medium text-(--neutral-on-background-medium) hover:text-(--neutral-on-background-strong)">
                    Contact Support
                  </div>
                  <div className="text-sm neutral-on-background-weak">Get help from our team</div>
                </div>
              </a>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
