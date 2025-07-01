import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "@nuvix/cui/dialog";
import { Button, DialogFooter, DialogRootProps } from "@chakra-ui/react";
import { Text } from "@nuvix/ui/components";
import { CodeBlock } from "@nuvix/ui/modules";
import React from "react";

interface LogsDialogProps extends DialogRootProps {
  title: string;
  message: LogMessage;
}

interface LogMessage {
  title: string;
  code: string[];
  description?: React.ReactNode;
}

export const LogsDialog = ({ children, title, message, ...rest }: LogsDialogProps) => {
  return (
    <>
      <DialogRoot {...rest}>
        {children && <DialogTrigger>{children}</DialogTrigger>}
        <DialogContent>
          <DialogHeader>
            <Text variant="heading-default-s"> {title}</Text>
          </DialogHeader>
          <DialogBody className="flex flex-col gap-2 bg-[var(--neutral-alpha-weak)]">
            <Text variant="label-strong-m">{message.title}</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              {message.description}
            </Text>

            <CodeBlock
              codeInstances={[
                { label: "Error", language: "markdown", code: message.code.join("\n") },
              ]}
              compact
            />
          </DialogBody>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button variant={"outline"} size={"sm"} data-action="closeLogsDialog">
                Close
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
