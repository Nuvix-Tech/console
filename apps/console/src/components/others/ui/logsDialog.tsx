import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "@/components/cui/dialog";
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
  desciption?: React.ReactNode;
}

export const LogsDialog = ({ children, title, message, ...rest }: LogsDialogProps) => {
  return (
    <>
      <DialogRoot {...rest}>
        {children && <DialogTrigger>{children}</DialogTrigger>}
        <DialogContent>
          <DialogHeader>{title}</DialogHeader>
          <DialogBody>
            <Text>{message.title}</Text>
            <CodeBlock
              codeInstances={[
                { label: "Error", language: "markdown", code: message.code.join("\n") },
              ]}
              compact
            />
          </DialogBody>
          <DialogFooter>
            <DialogTrigger>
              <Button variant={"outline"} size={"sm"}>
                Close
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
