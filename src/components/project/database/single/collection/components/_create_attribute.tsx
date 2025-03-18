import { CreateButton } from "@/components/others";
import { useProjectStore } from "@/lib/store";
import { Popover, Portal } from "@chakra-ui/react";
import React from "react";
import { StringAttributeForm } from "./_attribute_forms";
import { Button } from "@/ui/components";

const attributeTypes = [
  { label: "String", value: "string" },
  { label: "Integer", value: "integer" },
  { label: "Float", value: "float" },
  { label: "Boolean", value: "boolean" },
  { label: "Datetime", value: "datetime" },
  { label: "IP", value: "ip" },
  { label: "Enum", value: "enum" },
  { label: "URL", value: "url" },
  { label: "Email", value: "email" },
  { label: "Relationship", value: "relationship" },
] as const;

export const CreateAttribute = ({ refetch }: { refetch: () => Promise<void> }) => {
  const [selectedType, setSelectedType] = React.useState<(typeof attributeTypes)[number] | null>(
    null,
  );
  const { canCreateAttributes } = useProjectStore.use.permissions()();

  const onClose = () => setSelectedType(null);

  const commonProps = { onClose, refetch };

  // Create a map for all attribute types
  const attributeFormMap: Record<string, React.ReactNode> = {
    string: <StringAttributeForm isOpen={selectedType?.value === "string"} {...commonProps} />,
    integer: <div>Integer Form</div>,
    float: <div>Float Form</div>,
    boolean: <div>Boolean Form</div>,
    datetime: <div>Datetime Form</div>,
    ip: <div>IP Form</div>,
    enum: <div>Enum Form</div>,
    url: <div>URL Form</div>,
    email: <div>Email Form</div>,
    relationship: <div>Relationship Form</div>,
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <CreateButton
          hasPermission={canCreateAttributes}
          label="Create Attribute"
          onClick={() => console.log("Create attribute clicked")}
        />
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <div className="grid grid-cols-2 gap-2">
                {attributeTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant="tertiary"
                    size="s"
                    onClick={() => setSelectedType(type)}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
              {selectedType && attributeFormMap[selectedType.value]}
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};
