import React, { useCallback, useMemo } from "react";
import { useSteps } from "@chakra-ui/react";
import { StepperDrawer } from "@/components/others/stepper";
import { useBucketStore, useProjectStore } from "@/lib/store";
import { SubmitButton } from "@/components/others/forms";
import { Column, useToast } from "@/ui/components";
import { PermissionsEditor } from "@/components/others/permissions";
import { useFormikContext } from "formik";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Upload } from "lucide-react";
import { ID } from "@nuvix/console";
import { Box, FileUpload, Icon } from "@chakra-ui/react";
import { useFileUpload } from "@/ui/modules/uploader";
import { formatBytes } from "@/lib";
import { CustomID } from "@/components/_custom_id";

interface UploadFileProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => Promise<void>;
}

export const UploadFile: React.FC<UploadFileProps> = ({ isOpen, onClose, refetch }) => {
  const bucket = useBucketStore.use.bucket?.();
  const { addToast } = useToast();
  const { uploadFile } = useFileUpload(refetch);

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
      id: null,
      file: null,
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
            const fileId = values.id ?? ID.unique();
            const permissions = values.permissions ?? [];

            uploadFile({
              file,
              bucketId: bucket!.$id,
              id: fileId,
              permissions,
            });
            // await refetch();
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
  const { bucket } = useBucketStore();
  const { setFieldValue } = useFormikContext<{ file: File | null }>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFieldValue("file", file);
  };

  return (
    <Column gap={"4"} fillWidth>
      <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1} onChange={handleFileChange}>
        <FileUpload.HiddenInput />
        <FileUpload.Dropzone>
          <Icon size="md" color="fg.muted">
            <Upload />
          </Icon>
          <FileUpload.DropzoneContent>
            <Box fontWeight="medium">Drag and drop a file here</Box>
            <Box color="fg.muted">
              {bucket?.allowedFileExtensions
                ? `Allowed formats: ${bucket.allowedFileExtensions}`
                : "All file formats accepted"}
              {bucket?.maximumFileSize ? ` • Max size: ${formatBytes(bucket.maximumFileSize)}` : ""}
            </Box>
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
      <CustomID label="File ID" name="id" />
    </Column>
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
