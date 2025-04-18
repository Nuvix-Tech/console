import React, { useCallback, useMemo } from "react";
import { useProjectStore } from "@/lib/store";
import { Form, SubmitButton } from "@/components/others/forms";
import { useToast } from "@/ui/components";
import { PermissionsEditor } from "@/components/others/permissions";
import { useFormikContext } from "formik";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { CloseButton } from "@/components/cui/close-button";
import { Drawer, Portal } from "@chakra-ui/react";
interface CreateTableProps {
    isOpen: boolean;
    onClose: () => void;
    refetch: () => Promise<void>;
}

export const CreateTable: React.FC<CreateTableProps> = ({ isOpen, onClose, refetch }) => {
    const sdk = useProjectStore.use.sdk();
    const { addToast } = useToast();

    const initialValues = useMemo(() => {
        return {
            name: "",
            permissions: []
        };
    }, []);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    return (
        <>
            <Drawer.Root open={isOpen} onOpenChange={handleClose} size='sm'>
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content height="full" asChild>
                            <Form
                                initialValues={initialValues}
                                onSubmit={async (values) => {
                                    try {
                                        await sdk.schema.createTable(
                                            { ...values }
                                        );
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
                                className="w-full">
                                <Drawer.Header display="flex" flexDirection="column" gap={4}>
                                    <Drawer.Title>
                                        Create Table
                                    </Drawer.Title>
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
            </Drawer.Root >
        </>
    );
};

const TableSettings = () => {
    const { values, setFieldValue } = useFormikContext<{ name: string, permissions: string[] }>();
    const sdk = useProjectStore.use.sdk();

    const handleChange = useCallback(
        (updatedPermissions: string[]) => {
            setFieldValue("permissions", updatedPermissions);
        },
        [setFieldValue]
    );

    return (
        <>
            <Drawer.Body>
                <div className="flex flex-col gap-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Table Name</label>
                        <input
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={(e) => setFieldValue("name", e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter table name"
                        />
                    </div>

                    <div>
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Table Permissions</AlertTitle>
                            <AlertDescription>
                                Set who can read, update, and delete this table.
                            </AlertDescription>
                        </Alert>
                    </div>

                    <div className="relative">
                        <PermissionsEditor
                            sdk={sdk}
                            permissions={values.permissions}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </Drawer.Body >
            <Drawer.Footer>
                <div className="flex justify-end">
                    <button
                        type="reset"
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2"
                    >
                        Reset
                    </button>
                    <SubmitButton label="Create" />
                </div>
            </Drawer.Footer>
        </>
    );
};
