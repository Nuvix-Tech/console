import React from "react";
import { Button, DialogHeader, DialogTitle, Input } from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";

export type LabelProps = {
  addRole: (label: string) => void;
  onClose: VoidFunction;
  groups: Map<string, any>;
};

export const LabelRole = ({ addRole, onClose, groups }: LabelProps) => {
  const [label, setLabel] = React.useState("");

  const onSave = () => {
    if (label && !groups.has(`label:${label}`)) {
      addRole(`label:${label}`);
    }
    onClose?.();
  };

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Label</DialogTitle>
          <DialogDescription>
            Use labels to grant access to users associated with the specified label.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Field label="Label" helperText="Only alphanumeric characters are allowed.">
            <Input width="full" value={label} onChange={(e) => setLabel(e.target.value)} />
          </Field>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button disabled={!label || groups.has(`label:${label}`)} onClick={onSave}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
};
