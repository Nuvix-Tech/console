import React, { useCallback, useMemo } from "react";
import { useSteps } from "@chakra-ui/react";
import { StepperDrawer } from "@/components/others/stepper";
import { Models } from "@nuvix/console";
import { useCollectionStore, useDatabaseStore, useProjectStore } from "@/lib/store";
import { DynamicField } from "../document/components";
import {
  AttributeFormat,
  Attributes,
  AttributeTypes,
  generateYupSchema,
} from "../document/components/_utils";
import { SubmitButton } from "@/components/others/forms";
import { useToast } from "@nuvix/ui/components";
import { PermissionsEditor } from "@/components/others/permissions";
import { useFormikContext } from "formik";
import { Alert, AlertDescription, AlertTitle } from "@nuvix/sui/components/alert";
import { Info } from "lucide-react";

interface CreateDocumentProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => Promise<void>;
}

export const CreateDocument: React.FC<CreateDocumentProps> = ({ isOpen, onClose, refetch }) => {
  const collection = useCollectionStore.use.collection?.();
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database?.()!;
  const schema = useMemo(
    () => generateYupSchema((collection?.attributes as any) ?? []),
    [collection],
  );
  const { addToast } = useToast();

  const steps = useMemo(
    () => [
      {
        title: "Data",
        node: <DataFields attributes={(collection?.attributes as any) ?? []} />,
      },
      {
        title: "Permissions",
        node: <PermissionsFields />,
      },
    ],
    [collection],
  );

  const initialValues = useMemo(() => {
    const values = {} as any;
    collection?.attributes.forEach((attr: any) => {
      values[attr.key] = attr.default ?? null;
    });
    return values;
  }, [collection]);

  const stepperValue = useSteps({ defaultStep: 0, linear: true, count: steps.length });

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <StepperDrawer
      form={{
        initialValues: initialValues,
        onSubmit: async (values) => {
          try {
            const id = values.id ?? "unique()";
            const permissions = values.permissions ?? [];
            delete values.id;
            delete values.permissions;
            await sdk.databases.createDocument(
              database.$id,
              collection!.$id,
              id,
              values,
              permissions,
            );
            addToast({
              message: "Document created",
              variant: "success",
            });
            await refetch();
            handleClose();
          } catch (e: any) {
            addToast({
              message: e.message,
              variant: "danger",
            });
          }
        },
        validationSchema: schema,
      }}
      lastStep={<SubmitButton label="Create" />}
      size="sm"
      value={stepperValue}
      steps={steps}
      title="Create Document"
      open={isOpen}
      onOpenChange={handleClose}
    />
  );
};

interface DataMapperProps {
  attributes: AttributeTypes[];
}

interface CommonProps {
  name: string;
  nullable: boolean;
  isArray?: boolean;
  type: Attributes | AttributeFormat;
  options?: any;
}

const DataFields = ({ attributes }: DataMapperProps) => {
  return (
    <>
      <div className="flex flex-col gap-4">
        {attributes.map((attribute) => {
          const commonProps: CommonProps = {
            name: attribute.key,
            nullable: !attribute.required,
            isArray: attribute.array,
            type: Attributes.String as Attributes | AttributeFormat,
            options: !attribute.required ? [{ value: "null", label: "NULL" }] : [],
          };

          switch (attribute.type as Attributes) {
            case Attributes.String:
              if ("format" in attribute) {
                switch (attribute.format as AttributeFormat) {
                  case AttributeFormat.Email:
                  case AttributeFormat.Url:
                  case AttributeFormat.Ip:
                    commonProps.type = attribute.format as AttributeFormat;
                    break;
                  case AttributeFormat.Enum:
                    commonProps.type = AttributeFormat.Enum;
                    commonProps.options.push(
                      ...(attribute as Models.AttributeEnum).elements.map((v) => ({
                        value: v,
                        label: v,
                      })),
                    );
                    break;
                }
              }
              return (
                <DynamicField {...commonProps} size={(attribute as Models.AttributeString)?.size} />
              );
            case Attributes.Float:
            case Attributes.Integer:
              return (
                <DynamicField
                  {...commonProps}
                  min={(attribute as Models.AttributeInteger).min}
                  max={(attribute as Models.AttributeInteger).max}
                  type={attribute.type as Attributes}
                />
              );
            case Attributes.Boolean:
              commonProps.options = [
                { value: "true", label: "True" },
                { value: "false", label: "False" },
              ];
              return <DynamicField {...commonProps} type={Attributes.Boolean} />;
            case Attributes.Timestamptz:
              return <DynamicField {...commonProps} type={Attributes.Timestamptz} />;
            case Attributes.Relationship:
              return <DynamicField {...commonProps} type={Attributes.Relationship} />;
            default:
              return null;
          }
        })}
      </div>
    </>
  );
};

const PermissionsFields = React.memo(() => {
  const collection = useCallback(() => {
    return useCollectionStore.use.collection?.();
  }, []);
  const currentCollection = collection();
  const sdk = useProjectStore.use.sdk();
  const { setFieldValue, values } = useFormikContext<Record<string, string[]>>();
  const handleChange = useCallback(
    (updatedPermissions: string[]) => {
      setFieldValue("permissions", updatedPermissions);
    },
    [setFieldValue],
  );

  return (
    <div className="flex flex-col gap-4">
      {!currentCollection?.documentSecurity ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Document Security Disabled</AlertTitle>
          <AlertDescription>
            To assign document-specific permissions, enable document security in the collection
            settings. Otherwise, only collection-level permissions will apply.{" "}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Document Security Enabled</AlertTitle>
          <AlertDescription>
            You can assign document-specific permissions to this document.
          </AlertDescription>
        </Alert>
      )}

      {currentCollection?.documentSecurity && (
        <div className="relative">
          <PermissionsEditor
            sdk={sdk}
            permissions={values.permissions ?? []}
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
});
