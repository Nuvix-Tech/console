import React from "react";
import { Button, Input } from "@chakra-ui/react";
import { Field } from "@/components/cui/field";
import { SelectDialog } from "../select-dialog";

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
      <SelectDialog
        title="Label"
        description="Use labels to grant access to users associated with the specified label."
        actions={
          <>
            <Button disabled={!label || groups.has(`label:${label}`)} onClick={onSave}>
              Add
            </Button>
          </>
        }
      >
        <div className="px-4">
          <Field label="Label" helperText="Only alphanumeric characters are allowed.">
            <Input width="full" value={label} onChange={(e) => setLabel(e.target.value)} />
          </Field>
        </div>
      </SelectDialog>
    </>
  );
};
