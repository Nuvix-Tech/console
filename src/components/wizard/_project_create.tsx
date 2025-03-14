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
                <Flex gap={6} p={12}>
                  <Box flex="1">
                    <Text fontSize="2xl" fontWeight="bold" mb={2}>
                      Let's Create Your Next Project
                    </Text>

                    <Text fontSize="xl" color="fg.subtle" mb={6}>
                      Provide a project name to get started.
                    </Text>

                    <div className="space-y-4">
                      <Input label="Project Name" labelAsPlaceholder />
                    </div>

                    <Flex justify="flex-end" mt={6}>
                      <Button>
                        Continue
                      </Button>
                    </Flex>
                  </Box>
                  <Box flex="1" h="full">
                    <CloseButton position="absolute" top={4} right={4} />
                    <Image
                      src="https://via.placeholder.com/400x300"
                      alt="Project Preview"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </Box>
                </Flex>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
