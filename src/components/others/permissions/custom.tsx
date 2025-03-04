import React from "react";
import { Button, Input } from "@chakra-ui/react";
import { Field } from "@/components/cui/field";
import { SelectDialog } from "../select-dialog";

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
      <SelectDialog
        title="Custom permissions"
        description="Custom permissions allow you to grant access to specific users or teams using their ID
            and role."
        actions={
          <>
            <Button disabled={!custom || groups.has(custom)} onClick={onSave}>
              Add
            </Button>
          </>
        }
      >
        <div className="px-4">
          <Field
            label="Role"
            helperText="A permission should be formatted as: user:[USER_ID] or team:[TEAM_ID]/[ROLE]¸"
          >
            <Input width="full" value={custom} onChange={(e) => setCustom(e.target.value)} />
          </Field>
        </div>
      </SelectDialog>
    </>
  );
};
