import React, { useCallback, useMemo, useState } from "react";
import { useSteps } from "@chakra-ui/react";
import { StepperDrawer } from "@/components/others/stepper";
import { useBucketStore, useProjectStore } from "@/lib/store";
import { SubmitButton } from "@/components/others/forms";
import { useToast } from "@/ui/components";
import { PermissionsEditor } from "@/components/others/permissions";
import { useFormikContext } from "formik";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { ID } from "@nuvix/console";

interface UploadFileProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => Promise<void>;
}

export const UploadFile: React.FC<UploadFileProps> = ({ isOpen, onClose, refetch }) => {
  const bucket = useBucketStore.use.bucket?.();
  const sdk = useProjectStore.use.sdk();
  const { addToast } = useToast();

  const steps = useMemo(
    () => [
      {
        title: "File",
        node: <FileUploadField />,
      },
      {
        title: "Permissions",
        node: <PermissionsFields />,
      },
    ],
    [],
  );

  const initialValues = useMemo(() => {
    return {
      file: null,
      name: "",
      permissions: [],
    };
  }, []);

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
            if (!values.file) {
              throw new Error("Please select a file to upload");
            }

            const file = values.file as File;
            const fileId = ID.unique();
            const permissions = values.permissions ?? [];

            await sdk.storage.createFile(bucket!.$id, fileId, file, permissions);

            addToast({
              message: "File uploaded successfully",
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
      }}
      lastStep={<SubmitButton label="Upload" />}
      size="sm"
      value={stepperValue}
      steps={steps}
      title="Upload File"
      open={isOpen}
      onOpenChange={handleClose}
    />
  );
};

const FileUploadField = () => {
  const { setFieldValue, values } = useFormikContext<{ file: File | null; name: string }>();
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFieldValue("file", file);

    if (file) {
      setSelectedFileName(file.name);
      setFieldValue("name", file.name);
    } else {
      setSelectedFileName("");
      setFieldValue("name", "");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue("name", e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select File</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-white
                        hover:file:bg-primary/90"
        />
        {selectedFileName && (
          <p className="mt-2 text-sm text-gray-500">Selected: {selectedFileName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">File Name</label>
        <input
          type="text"
          value={values.name}
          onChange={handleNameChange}
          placeholder="File name"
          className="w-full p-2 border rounded-md"
        />
        <p className="mt-1 text-xs text-gray-500">Leave blank to use the original file name</p>
      </div>
    </div>
  );
};

const PermissionsFields = React.memo(() => {
  const bucket = useCallback(() => {
    return useBucketStore.use.bucket?.();
  }, []);
  const currentBucket = bucket();
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
      {!currentBucket?.fileSecurity ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>File Security Disabled</AlertTitle>
          <AlertDescription>
            To assign file-specific permissions, enable file security in the bucket settings.
            Otherwise, only bucket-level permissions will apply.{" "}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>File Security Enabled</AlertTitle>
          <AlertDescription>
            You can assign file-specific permissions to this file.
          </AlertDescription>
        </Alert>
      )}

      {currentBucket?.fileSecurity && (
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
