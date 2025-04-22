import React, { useCallback, useMemo } from "react";
import { useProjectStore } from "@/lib/store";
import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { Column, Line, useToast } from "@/ui/components";
import { PermissionsEditor } from "@/components/others/permissions";
import { useFormikContext } from "formik";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { CloseButton } from "@/components/cui/close-button";
import { Drawer, Portal } from "@chakra-ui/react";
import { useSchemaStore } from "@/lib/store/schema";
import { useGrid } from "./_store";

interface InsertRowProps {
  onClose: () => void;
  refetch: () => Promise<void>;
}

export const InsertRow: React.FC<InsertRowProps> = ({ onClose, refetch }) => {
  const { dialog, setDialog } = useGrid();
  const sdk = useProjectStore.use.sdk();
  const schema = useSchemaStore.use.schema?.();
  const { table } = useGrid();
  const { addToast } = useToast();

  const initialValues = useMemo(() => {
    return {
      name: "",
      description: "",
      permissions: [],
    };
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <>
      <Drawer.Root
        open={dialog.open}
        onOpenChange={(det) => setDialog({ ...dialog, open: det.open })}
        size="lg"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content height="full" asChild>
              <Form
                initialValues={initialValues}
                onSubmit={async (values) => {
                  try {
                    await sdk.schema.insertRow(table!.name, schema!.name, values);
                    addToast({
                      message: "Table created",
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
                }}
                className="w-full"
              >
                <Drawer.Header display="flex" flexDirection="column" gap={4}>
                  <Drawer.Title>Insert Row</Drawer.Title>
                  <div className="absolute right-4 top-4">
                    <Drawer.CloseTrigger asChild>
                      <CloseButton size="sm" />
                    </Drawer.CloseTrigger>
                  </div>
                </Drawer.Header>
                <TableSettings />
              </Form>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};

const TableSettings = () => {
  const { values, setFieldValue } = useFormikContext<{ name: string; permissions: string[] }>();
  const sdk = useProjectStore.use.sdk();

  const handleChange = useCallback(
    (updatedPermissions: string[]) => {
      setFieldValue("permissions", updatedPermissions);
    },
    [setFieldValue],
  );

  return (
    <>
      <Drawer.Body>
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-auto">
          <Column paddingX="24" gap="12">
            <InputField name="name" label="Name" placeholder="Enter table name" />
            <InputField
              name="description"
              label="Description"
              placeholder="Enter table description"
            />
          </Column>
          <Line marginY="16" />
          <div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Table Level Security (TLS)</AlertTitle>
              <AlertDescription>
                Set who can access this table and what actions they can perform.
              </AlertDescription>
            </Alert>
          </div>

          <div className="relative">
            <PermissionsEditor
              sdk={sdk}
              withCreate
              permissions={values.permissions}
              onChange={handleChange}
            />
          </div>
          <Line />
        </div>
      </Drawer.Body>
      <Drawer.Footer>
        <div className="flex justify-end">
          <button type="reset" className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2">
            Reset
          </button>
          <SubmitButton label="Insert" />
        </div>
      </Drawer.Footer>
    </>
  );
};
