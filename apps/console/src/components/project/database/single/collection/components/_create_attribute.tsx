import { CreateButton } from "@/components/others";
import { useProjectStore } from "@/lib/store";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@nuvix/cui/popover";
import React from "react";
import {
  BooleanAttributeForm,
  DatetimeAttributeForm,
  EmailAttributeForm,
  EnumAttributeForm,
  FloatAttributeForm,
  IntegerAttributeForm,
  IpAttributeForm,
  RelationshipAttributeForm,
  StringAttributeForm,
  UrlAttributeForm,
} from "./_attribute_forms";
import { Button } from "@nuvix/ui/components";
import { AttributeIcon } from "./_attribute_icon";

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

  return (
    <>
      <PopoverRoot
        size="xs"
        open={open}
        onOpenChange={(open) => setOpen(open.open)}
        autoFocus={false}
        unmountOnExit
      >
        <PopoverTrigger asChild>
          <CreateButton
            hasPermission={true}
            label="Create Attribute"
            onClick={() => setOpen(true)}
          />
        </PopoverTrigger>
        <PopoverContent
          maxWidth="88"
          portalled={false}
          css={{ "--popover-bg": "var(--neutral-background-weak)" }}
        >
          <PopoverArrow />
          <PopoverBody overflowY="auto">
            <div className="grid grid-cols-2 gap-2">
              {attributeTypes.map((type) => (
                <Button
                  key={type.value}
                  prefixIcon={AttributeIcon({ format: type.value }, false, 14)}
                  variant="tertiary"
                  fillWidth
                  justifyContent="flex-start"
                  size="s"
                  onClick={() => {
                    setSelectedType(type);
                    setOpen(false);
                  }}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
      <StringAttributeForm isOpen={selectedType?.value === "string"} {...commonProps} />
      <IntegerAttributeForm isOpen={selectedType?.value === "integer"} {...commonProps} />
      <FloatAttributeForm isOpen={selectedType?.value === "float"} {...commonProps} />
      <BooleanAttributeForm isOpen={selectedType?.value === "boolean"} {...commonProps} />
      <DatetimeAttributeForm isOpen={selectedType?.value === "datetime"} {...commonProps} />
      <IpAttributeForm isOpen={selectedType?.value === "ip"} {...commonProps} />
      <EnumAttributeForm isOpen={selectedType?.value === "enum"} {...commonProps} />
      <UrlAttributeForm isOpen={selectedType?.value === "url"} {...commonProps} />
      <EmailAttributeForm isOpen={selectedType?.value === "email"} {...commonProps} />
      <RelationshipAttributeForm isOpen={selectedType?.value === "relationship"} {...commonProps} />
    </>
  );
};
