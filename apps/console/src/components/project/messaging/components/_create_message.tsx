import { CreateMessage } from "@/components/wizard/messaging";
import { Popover, PopoverTrigger, PopoverContent } from "@nuvix/sui/components";
import { Button, ToggleButton } from "@nuvix/ui/components";
import { useState } from "react";

export const CreateMessageButton = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"push" | "sms" | "email" | null>(null);

  const onClick = (type: any) => {
    setType(type);
    setOpen(true);
  };

  return (
    <>
      <CreateMessage open={open} onOpenChange={(o) => setOpen(o.open)} type={type} />
      <Popover>
        <PopoverTrigger asChild>
          <Button size="s">Create Message</Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-48 space-y-1">
          {[
            { name: "Push Notifications", key: "push" },
            { name: "Email", key: "email" },
            { name: "Sms", key: "sms" },
          ].map(({ name, key }) => (
            <ToggleButton
              key={key}
              selected={false}
              onClick={() => onClick(key)}
              fillWidth
              justifyContent="flex-start"
            >
              {name}
            </ToggleButton>
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
};
