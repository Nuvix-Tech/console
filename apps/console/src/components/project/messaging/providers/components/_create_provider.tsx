import { CreateProvider } from "@/components/wizard/messaging/providers";
import { MessagingProviderType } from "@nuvix/console";
import { Popover, PopoverTrigger, PopoverContent } from "@nuvix/sui/components";
import { Button, ToggleButton } from "@nuvix/ui/components";
import React, { useState } from "react";

export const CreateProviderButton = ({ refetch }: { refetch: () => Promise<any>  }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<MessagingProviderType | null>(null);

  const onClick = (type: any) => {
    setType(type);
    setOpen(true);
  };

  return (
    <>
      <CreateProvider
        open={open}
        onOpenChange={(o) => {
          setOpen(o.open);
        }}
        type={type}
        refetch={refetch}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button size="s">New Provider</Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-48 space-y-1">
          {[
            { name: "Push Notifications", key: MessagingProviderType.Push },
            { name: "Email", key: MessagingProviderType.Email },
            { name: "Sms", key: MessagingProviderType.Sms },
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