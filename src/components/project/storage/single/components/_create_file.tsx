import React, { useCallback, useMemo, useState } from "react";
import { Float, useFileUploadContext, useSteps } from "@chakra-ui/react";
import { StepperDrawer } from "@/components/others/stepper";
import { useBucketStore, useProjectStore } from "@/lib/store";
import { SubmitButton } from "@/components/others/forms";
import { useToast } from "@/ui/components";
import { PermissionsEditor } from "@/components/others/permissions";
import { useFormikContext } from "formik";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Upload, X } from "lucide-react";
import { ID } from "@nuvix/console";
import { Box, FileUpload, Icon } from "@chakra-ui/react";

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
      files: null,
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
            if (!values.files) {
              throw new Error("Please select a file to upload");
            }

            const file = values.files[0] as File;
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
  const { setFieldValue } = useFormikContext<{ files: File[] | null }>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || null;
    setFieldValue("files", files);
  };

  return (
    <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1} onChange={handleFileChange}>
      <FileUpload.HiddenInput />
      <FileUpload.Dropzone>
        <Icon size="md" color="fg.muted">
          <Upload />
        </Icon>
        <FileUpload.DropzoneContent>
          <Box>Drag and drop files here</Box>
          <Box color="fg.muted">.png, .jpg up to 5MB</Box>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file) => (
              <FileUpload.Item key={file.name} file={file}>
                <FileUpload.ItemPreview />
                <FileUpload.ItemName />
                <FileUpload.ItemSizeText />
                <FileUpload.ItemDeleteTrigger />
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>
    </FileUpload.Root>
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
