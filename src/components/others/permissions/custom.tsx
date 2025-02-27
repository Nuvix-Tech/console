import React from "react";
import { Button, DialogHeader, DialogTitle, Input } from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/cui/dialog";
import { Field } from "@/components/cui/field";

export type CustomProps = {
  addRole: (label: string) => void;
  onClose: VoidFunction;
  groups: Map<string, any>;
};

export const CustomRole = ({ addRole, onClose, groups }: CustomProps) => {
  const [custom, setCustom] = React.useState("");

  const onSave = () => {
    if (custom && !groups.has(custom)) {
      addRole(custom);
    }
    onClose?.();
  };

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Custom permissions</DialogTitle>
          <DialogDescription>
            Custom permissions allow you to grant access to specific users or teams using their ID
            and role.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Field
            label="Role"
            helperText="A permission should be formatted as: user:[USER_ID] or team:[TEAM_ID]/[ROLE]¸"
          >
            <Input width="full" value={custom} onChange={(e) => setCustom(e.target.value)} />
          </Field>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button disabled={!custom || groups.has(custom)} onClick={onSave}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
};
