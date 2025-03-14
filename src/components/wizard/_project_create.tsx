"use client";
import React from "react";
import { Box, Button, CloseButton, Dialog, Flex, Image, Portal, Text } from "@chakra-ui/react";
import { Input } from "@/ui/components";

type CreateProjectProps = {
  children?: React.ReactNode;
} & Omit<React.ComponentProps<typeof Dialog.Root>, "size" | "motionPreset" | "children">;

export const CreateProject: React.FC<CreateProjectProps> = ({ children, ...props }) => {
  return (
    <>
      <Dialog.Root size="full" motionPreset="slide-in-right" {...props}>
        {children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Body>
                <Flex gap={6}>
                  <Box flex="1">
                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                      Enter Project Details
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Fill in the details below to create a new project.
                    </Text>

                    <div className="space-y-4">
                      <Input label="Project Name" />
                      <Input placeholder="Optional" label="Project ID" />
                    </div>

                    <Text fontSize="sm" color="gray.600">
                      Describe your project briefly.
                    </Text>
                  </Box>
                  <Box flex="1">
                    <Image
                      src="https://via.placeholder.com/400x300"
                      alt="Project Preview"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </Box>
                </Flex>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button>Create</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
