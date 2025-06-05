import { CreateMessage } from "@/components/wizard/messaging";
import { MessagingProviderType } from "@nuvix/console";
import { Popover, PopoverTrigger, PopoverContent } from "@nuvix/sui/components";
import { Button, ToggleButton } from "@nuvix/ui/components";
import { Rect } from "@xyflow/react";
import { MailIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";
import React, { useState } from "react";

export const CreateMessageButton = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<MessagingProviderType | null>(null);

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

export const MessageTypeIcon = ({ type }: { type: MessagingProviderType }) => {
  const Icon: any = () => {
    switch (type) {
      case MessagingProviderType.Email:
        return MailIcon;
      case MessagingProviderType.Push:
        return PhoneIcon;
      case MessagingProviderType.Sms:
        return MessageCircleIcon;
    }
  };

  return <Icon />;
};
