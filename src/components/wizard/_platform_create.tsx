"use client";
import React from "react";
import { Box, CloseButton, Dialog, Flex, Image, Portal, Text } from "@chakra-ui/react";
import { Form, InputField, SubmitButton } from "../others/forms";
import * as y from "yup";
import { sdkForConsole } from "@/lib/sdk";
import { PlatformType } from "@nuvix/console";
import { useRouter } from "@bprogress/next";
import { useToast } from "@/ui/components";
import { useProjectStore } from "@/lib/store";

// Define validation schema for platform creation form
const schema = y.object().shape({
  name: y.string().max(56).required("Platform name is required"),
  id: y.string().min(6).max(36).optional(),
  type: y.string().oneOf(Object.values(PlatformType)).required("Platform type is required"),
  key: y.string().when("type", {
    is: (type: string) =>
      [
        PlatformType.Appleios,
        PlatformType.Android,
        PlatformType.Reactnativeios,
        PlatformType.Reactnativeandroid,
      ].includes(type as PlatformType),
    then: (schema) => schema.required("Platform key is required for mobile platforms"),
    otherwise: (schema) => schema,
  }),
  store: y.string().optional(),
  hostname: y.string().when("type", {
    is: (type: string) =>
      [PlatformType.Web, PlatformType.Flutterweb].includes(type as PlatformType),
    then: (schema) => schema.required("Hostname is required for web platforms"),
    otherwise: (schema) => schema,
  }),
});

type CreatePlatformProps = {
  children?: React.ReactNode;
  type: PlatformType;
  onClose?: () => void;
} & Omit<React.ComponentProps<typeof Dialog.Root>, "size" | "motionPreset" | "children">;

export const CreatePlatform: React.FC<CreatePlatformProps> = ({ children, type, ...props }) => {
  const { projects } = sdkForConsole;
  const { project } = useProjectStore();
  const { addToast } = useToast();
  const router = useRouter();

  async function onSubmit(values: y.InferType<typeof schema>, resetForm: any) {
    const { name, key, store, hostname } = values;
    try {
      const platform = await projects.createPlatform(
        project!.$id,
        type,
        name,
        key,
        store,
        hostname,
      );

      addToast({
        variant: "success",
        message: "Platform created successfully.",
      });

      resetForm();
      props.onClose?.();

      // Navigate to the newly created platform
      if (platform && platform.$id) {
        router.push(`/project/${project?.$id}/platforms/${platform.$id}`);
      }
    } catch (e: any) {
      addToast({
        variant: "danger",
        message: e.message || "Failed to create platform",
      });
    }
  }

  return (
    <>
      <Dialog.Root size="full" motionPreset="slide-in-right" {...props}>
        {children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Body h="full" gap={10} p={12} display="flex" alignItems="center">
                <Box flex="1" h="full" justifyContent={"center"}>
                  <Text fontSize="4xl" fontWeight="bold" mb={6}>
                    Add a New Platform
                  </Text>

                  <Text fontSize="2xl" color="fg.muted" mb={10}>
                    Configure your {type} platform settings.
                  </Text>
                  <Form
                    initialValues={{
                      name: "",
                      type: type,
                      key: "",
                      store: "",
                      hostname: "",
                    }}
                    validationSchema={schema}
                    onSubmit={async (values, { resetForm }) => {
                      await onSubmit(values, resetForm);
                    }}
                  >
                    <div className="space-y-4">
                      <InputField name="name" label="Platform Name" />

                      {[PlatformType.Web, PlatformType.Flutterweb].includes(type) && (
                        <InputField
                          name="hostname"
                          label="Hostname"
                          placeholder="example.com"
                          description="Enter the domain where this platform will be deployed"
                        />
                      )}

                      {[
                        PlatformType.Appleios,
                        PlatformType.Android,
                        PlatformType.Reactnativeios,
                        PlatformType.Reactnativeandroid,
                      ].includes(type) && (
                        <>
                          <InputField
                            name="key"
                            label="App Key"
                            placeholder={
                              type.includes("ios") ? "com.example.app" : "com.example.app"
                            }
                            description="Enter your app bundle identifier/package name"
                          />
                          <InputField
                            name="store"
                            label="App Store URL"
                            placeholder={
                              type.includes("ios")
                                ? "https://apps.apple.com/app/id123456789"
                                : "https://play.google.com/store/apps/details?id=com.example.app"
                            }
                            description="Optional: Enter your app store URL if published"
                          />
                        </>
                      )}
                    </div>

                    <Flex justify="flex-end" mt={6}>
                      <SubmitButton>Create Platform</SubmitButton>
                    </Flex>
                  </Form>
                </Box>
                <Box flex="1" h="full">
                  <Dialog.Trigger>
                    <CloseButton position="absolute" top={4} right={4} />
                  </Dialog.Trigger>
                  <Image
                    src="https://img.freepik.com/free-vector/business-teamwork-concept-teamwork-leadership-effort-hard-work-team-strategy-concept-brainstorm-workshop-management-skills-vector-cartoon-illustration-flat-design_1150-56223.jpg?t=st=1741944634~exp=1741948234~hmac=a8809da68f5bcdb67d8616d53467b3b475fdf51020c728f1a1a1a00874fd875e&w=996"
                    alt="Platform Preview"
                    objectFit="cover"
                    borderRadius="md"
                  />
                </Box>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
