import { CreateButton } from "@/components/others";
import { useProjectStore } from "@/lib/store";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@/components/cui/popover";
import React from "react";
import {
  BooleanAttributeForm,
  DatetimeAttributeForm,
  EnumAttributeForm,
  FloatAttributeForm,
  IntegerAttributeForm,
  IpAttributeForm,
  RelationshipAttributeForm,
  StringAttributeForm,
  UrlAttributeForm,
} from "./_attribute_forms";
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
  const [open, setOpen] = React.useState(false);
  const { canCreateAttributes } = useProjectStore.use.permissions()();

  const onClose = () => setSelectedType(null);

  const commonProps = { onClose, refetch };

  const attributeFormMap: Record<string, React.ReactNode> = {
    string: <StringAttributeForm isOpen={selectedType?.value === "string"} {...commonProps} />,
    integer: <IntegerAttributeForm isOpen={selectedType?.value === "integer"} {...commonProps} />,
    float: <FloatAttributeForm isOpen={selectedType?.value === "float"} {...commonProps} />,
    boolean: <BooleanAttributeForm isOpen={selectedType?.value === "boolean"} {...commonProps} />,
    datetime: (
      <DatetimeAttributeForm isOpen={selectedType?.value === "datetime"} {...commonProps} />
    ),
    ip: <IpAttributeForm isOpen={selectedType?.value === "ip"} {...commonProps} />,
    enum: <EnumAttributeForm isOpen={selectedType?.value === "enum"} {...commonProps} />,
    url: <UrlAttributeForm isOpen={selectedType?.value === "url"} {...commonProps} />,
    email: <EnumAttributeForm isOpen={selectedType?.value === "email"} {...commonProps} />,
    relationship: (
      <RelationshipAttributeForm isOpen={selectedType?.value === "relationship"} {...commonProps} />
    ),
  };

  return (
    <>
      <PopoverRoot size="xs" open={open} onOpenChange={(open) => setOpen(open.open)}>
        <PopoverTrigger>
          <CreateButton hasPermission={true} label="Create Attribute" onClick={() => setOpen(true)} />
        </PopoverTrigger>
        <PopoverContent maxWidth="56" portalled={false}>
          <PopoverArrow />
          <PopoverBody overflowY="auto">
            <div className="grid grid-cols-2 gap-2">
              {attributeTypes.map((type) => (
                <Button
                  key={type.value}
                  variant="tertiary"
                  fillWidth
                  justifyContent="flex-start"
                  size="s"
                  onClick={() => { setSelectedType(type); setOpen(false) }}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
      {selectedType && attributeFormMap[selectedType.value]}
    </>
  );
};
