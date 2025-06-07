"use client";
import React, { Suspense, useState } from "react";
import { Box, Dialog, Portal, Text, HStack, VStack } from "@chakra-ui/react";
import { Button, Line } from "@nuvix/ui/components";
import { Buckets } from "./_buckets";
import { Files } from "./_files";
import { useBucketSelector } from "./_store";
import { Models } from "@nuvix/console";

type SelectFilesProps = {
  children?: React.ReactNode;
  mimeType?: string[];
  maxSize?: number; // in bytes
  onSelect?: (b?: Models.Bucket, f?: Models.File) => void;
  onError?: (error: string) => void;
} & Omit<React.ComponentProps<typeof Dialog.Root>, "size" | "motionPreset" | "children">;

export const SelectFiles: React.FC<SelectFilesProps> = ({
  children,
  onSelect,
  onError,
  mimeType,
  maxSize,
  ...props
}) => {
  const { bucket, file } = useBucketSelector();

  const validateFile = (selectedFile: Models.File): string | null => {
    if (maxSize && selectedFile.sizeOriginal > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return `File size exceeds maximum limit of ${maxSizeMB}MB`;
    }

    if (mimeType && mimeType.length > 0 && !mimeType.includes(selectedFile.mimeType)) {
      return `File type not supported. Allowed types: ${mimeType.join(", ")}`;
    }

    return null;
  };

  const handleSelect = () => {
    if (!bucket || !file) return;

    const error = validateFile(file);
    if (error) {
      onError?.(error);
      props.onOpenChange?.({ open: false });
      return;
    }

    onSelect?.(bucket, file);
    props.onOpenChange?.({ open: false });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <Dialog.Root size="cover" motionPreset="slide-in-bottom" {...props} closeOnEscape={false}>
      {children && (
        <Dialog.Trigger asChild type="button">
          {children}
        </Dialog.Trigger>
      )}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content gap={0}>
            <Dialog.Header py={"2"}>
              <VStack align="flex-start" gap={0.5}>
                <Text fontSize="xl" fontWeight="bold">
                  Select a File
                </Text>
                {(mimeType || maxSize) && (
                  <Text fontSize="sm" color="gray.600">
                    {mimeType && `Allowed types: ${mimeType.join(", ")}`}
                    {mimeType && maxSize && " • "}
                    {maxSize && `Max size: ${formatFileSize(maxSize)}`}
                  </Text>
                )}
              </VStack>
            </Dialog.Header>

            <Dialog.Body
              gap={2}
              px={4}
              py={0}
              display="flex"
              borderBlockWidth={1}
              pos={"relative"}
              height={"calc(100% - 200px)"}
            >
              <Box flex="0" h="full" minW={{ base: "48", lg: "52" }} className="overflow-y-auto">
                <Suspense fallback={<Text>Loading buckets...</Text>}>
                  <Buckets />
                </Suspense>
              </Box>
              <Line vert />
              <Box flex="1" className="w-[calc(100%-200px)] overflow-y-auto">
                <Suspense fallback={<Text>Loading files...</Text>}>
                  <Files mimeType={mimeType} />
                </Suspense>
              </Box>
            </Dialog.Body>

            {file && (
              <Box px={4} py={2} bg="bg.muted" borderTopWidth={1}>
                <Text fontSize="sm" fontWeight="medium">
                  Selected:
                </Text>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="fg.subtle" truncate>
                    {file.name}
                  </Text>
                  <Text fontSize="xs" color="fg.muted">
                    {formatFileSize(file.sizeOriginal)}
                  </Text>
                </HStack>
              </Box>
            )}

            <Dialog.Footer>
              <Dialog.Trigger asChild>
                <Button variant="tertiary" type="button">
                  Cancel
                </Button>
              </Dialog.Trigger>
              <Button
                variant="primary"
                disabled={!bucket || !file}
                onClick={handleSelect}
                type="button"
              >
                Select File
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export const FilesSelector = ({
  maxSize,
  mimeType,
  onSelect,
  ...props
}: Omit<SelectFilesProps, "children">) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Models.File | undefined>();
  const [error, setError] = useState<string | undefined>();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType.startsWith("video/")) return "🎥";
    if (mimeType.startsWith("audio/")) return "🎵";
    if (mimeType.includes("pdf")) return "📄";
    return "📁";
  };

  const handleClear = () => {
    setSelectedFile(undefined);
    setError(undefined);
    onSelect?.();
  };

  return (
    <VStack align="stretch" gap={2}>
      <div className="border border-neutral-medium w-full min-h-48 border-dashed radius-l p-4 flex flex-col items-center justify-center gap-3">
        <SelectFiles
          {...props}
          maxSize={maxSize}
          mimeType={mimeType}
          open={open}
          onOpenChange={({ open }) => {
            setOpen(open);
            if (!open) setError(undefined);
          }}
          onSelect={(b, f) => {
            setSelectedFile(f);
            setError(undefined);
            onSelect?.(b, f);
          }}
          onError={(err) => setError(err)}
        />

        {selectedFile ? (
          <VStack gap={2} align="center">
            <Text fontSize="2xl">{getFileIcon(selectedFile.mimeType)}</Text>
            <VStack gap={1} align="center">
              <Text fontWeight="medium" textAlign="center" lineClamp={2}>
                {selectedFile.name}
              </Text>
              <HStack gap={2} color="fg.subtle" fontSize="sm">
                <Text>{formatFileSize(selectedFile.sizeOriginal)}</Text>
                <Text>•</Text>
                <Text>{selectedFile.mimeType}</Text>
              </HStack>
            </VStack>
            <HStack gap={2}>
              <Button onClick={() => setOpen(true)} variant="tertiary" size="s" type="button">
                Change File
              </Button>
              <Button onClick={handleClear} variant="tertiary" size="s" type="button">
                Remove File
              </Button>
            </HStack>
          </VStack>
        ) : (
          <VStack gap={2} align="center">
            <Text fontSize="2xl">📁</Text>
            <Text color="fg.muted" textAlign="center">
              No file selected
            </Text>
            <Button onClick={() => setOpen(true)} variant="secondary">
              Choose File
            </Button>
          </VStack>
        )}
      </div>

      {error && (
        <Text color="red.500" fontSize="sm" textAlign="center">
          {error}
        </Text>
      )}

      {(mimeType || maxSize) && !selectedFile && (
        <Text fontSize="xs" color="fg.muted" textAlign="center">
          {mimeType && `Supported: ${mimeType.join(", ")}`}
          {mimeType && maxSize && " • "}
          {maxSize && `Max size: ${formatFileSize(maxSize)}`}
        </Text>
      )}
    </VStack>
  );
};
