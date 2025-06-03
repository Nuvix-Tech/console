"use client";
import React, { Suspense, useState } from "react";
import { Box, Dialog, Portal, Text } from "@chakra-ui/react";
import { Button, Line } from "@nuvix/ui/components";
import { Buckets } from "./_buckets";
import { Files } from "./_files";
import { useBucketSelector } from "./_store";
import { Models } from "@nuvix/console";

type SelectFilesProps = {
  children?: React.ReactNode;
  mimeType?: string[];
  onSelect?: (b: Models.Bucket, f: Models.File) => void;
} & Omit<React.ComponentProps<typeof Dialog.Root>, "size" | "motionPreset" | "children">;

export const SelectFiles: React.FC<SelectFilesProps> = ({
  children,
  onSelect,
  mimeType,
  ...props
}) => {
  const { bucket, file } = useBucketSelector();

  return (
    <>
      <Dialog.Root size="cover" motionPreset="slide-in-bottom" {...props} closeOnEscape={false}>
        {children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content gap={0}>
              <Dialog.Header>
                <Text fontSize="xl" fontWeight="bold">
                  Select Files
                </Text>
              </Dialog.Header>
              <Dialog.Body h="full" gap={2} px={4} py={0} display="flex" borderBlockWidth={1}>
                <Box flex="0" h="full" minW={{ base: "48", lg: "52" }}>
                  <Suspense>
                    <Buckets />
                  </Suspense>
                </Box>
                <Line vert />
                <Box flex="1" h="full" className="w-[calc(100%-200px)]">
                  <Files mimeType={mimeType} />
                </Box>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Trigger asChild>
                  <Button variant="tertiary">Cancle</Button>
                </Dialog.Trigger>
                <Button
                  variant="secondary"
                  disabled={!bucket || !file}
                  onClick={() => {
                    onSelect?.(bucket!, file!);
                    props.onOpenChange?.({ open: false });
                  }}
                >
                  Select
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export const FilesSelector = ({ ...props }: Omit<SelectFilesProps, "children">) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<Models.File | undefined>();

  return (
    <div className="border border-neutral-medium w-full h-48 border-dashed radius-l p-4 flex items-center justify-center">
      <SelectFiles
        {...props}
        open={open}
        onOpenChange={({ open }) => setOpen(open)}
        onSelect={(b, f) => {
          setFile(f);
          props.onSelect?.(b, f);
        }}
      />
      <Button onClick={() => setOpen(true)} variant="secondary">
        Select Files
      </Button>

      {file?.$id}
    </div>
  );
};
