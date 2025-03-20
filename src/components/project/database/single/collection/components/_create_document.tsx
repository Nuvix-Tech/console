import { StepperDrawer } from "@/components/others/stepper";
import { useSteps } from "@chakra-ui/react";
import React from "react";
import { Models } from "@nuvix/console";
import { DynamicField, FIELD_TYPES } from "../document/components";
import { generateYupSchema } from "../document/components/_utils";
import { useCollectionStore } from "@/lib/store";

interface CreateDocumentProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDocument: React.FC<CreateDocumentProps> = ({ isOpen, onClose }) => {
  const collection = useCollectionStore.use.collection?.();
  let schema = generateYupSchema((collection?.attributes as any) ?? []);

  const steps = [
    {
      title: "Data",
      node: (
        <div>
          <DataComp attributes={(collection?.attributes as any) ?? []} />
        </div>
      ),
    },
    {
      title: "Permissions",
      node: <div>Permissions</div>,
    },
  ];

  const value = useSteps({ defaultStep: 0, linear: true, count: steps.length });

  return (
    <StepperDrawer
      form={{
        initialValues: {},
        onSubmit(values, formikHelpers) {},
        validationSchema: schema,
      }}
      size="lg"
      value={value}
      steps={steps}
      title="Create Document"
      open={isOpen}
      onOpenChange={(open) => {
        onClose();
      }}
    />
  );
};

type AttributeTypes = Models.AttributeString | Models.AttributeInteger | Models.AttributeBoolean;

interface DataMapperProps {
  attributes: AttributeTypes[];
}

const DataComp = ({ attributes }: DataMapperProps) => {
  return attributes.map((attribute, index) => {
    const commonProps = {
      name: attribute.key,
      nullable: !attribute.required,
      isArray: attribute.array,
      type: "string" as (typeof FIELD_TYPES)[number],
      options: !attribute.required ? [{ value: "null", label: "NULL" }] : [],
    };

    switch (attribute.type) {
      case "string":
        if ("format" in attribute) {
          switch (attribute.format) {
            case "email":
              commonProps.type = "email";
              break;
            case "url":
              commonProps.type = "url";
              break;
            case "enum":
              commonProps.type = "enum";
              commonProps.options.push(
                ...(attribute as Models.AttributeEnum).elements.map((v) => ({
                  value: v,
                  label: v,
                })),
              );
              break;
          }
        }
        return <DynamicField {...commonProps} size={(attribute as Models.AttributeString)?.size} />;
      case "integer":
        return (
          <DynamicField
            {...commonProps}
            min={(attribute as Models.AttributeInteger).min}
            max={(attribute as Models.AttributeInteger).max}
            type="integer"
          />
        );
      case "boolean":
        commonProps.options = [
          { value: "true", label: "True" },
          { value: "false", label: "False" },
        ];
        return <DynamicField {...commonProps} type="boolean" />;
      default:
        return null;
    }
  });
};
