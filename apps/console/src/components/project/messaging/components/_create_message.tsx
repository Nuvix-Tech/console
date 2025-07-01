import { CreateMessage } from "@/components/wizard/messaging";
import { MessagingProviderType } from "@nuvix/console";
import { Popover, PopoverTrigger, PopoverContent } from "@nuvix/sui/components/popover";
import { Button, Flex, Text, ToggleButton, useConfirm } from "@nuvix/ui/components";
import { LucideProps, MailIcon, MessageCircleIcon, SmartphoneIcon } from "lucide-react";
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
      <CreateMessage
        open={open}
        onOpenChange={(o) => {
          setOpen(o.open);
        }}
        type={type}
      />
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

export const MessageTypeIcon = ({
  type,
  icon,
  ...rest
}: { type: MessagingProviderType; icon?: LucideProps } & React.ComponentProps<typeof Text>) => {
  let IconComponent: React.ElementType<LucideProps> | null = null;
  let label: string;

  switch (type) {
    case MessagingProviderType.Email:
      IconComponent = MailIcon;
      label = "Email";
      break;
    case MessagingProviderType.Push:
      IconComponent = SmartphoneIcon;
      label = "Push";
      break;
    case MessagingProviderType.Sms:
      IconComponent = MessageCircleIcon;
      label = "Sms";
      break;
    default:
      console.warn(`No icon found for MessagingProviderType: ${type}`);
      return null;
  }
  return IconComponent ? (
    <Flex gap="8" vertical="center">
      <Flex
        background="neutral-alpha-medium"
        radius="full"
        vertical="center"
        horizontal="center"
        width={"32"}
        height={"32"}
      >
        <IconComponent width="18" height="18" {...icon} />
      </Flex>
      <Text {...rest}>{label}</Text>
    </Flex>
  ) : null;
};
