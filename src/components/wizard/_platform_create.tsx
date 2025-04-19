"use client";
import React from "react";
import { Box, CloseButton, Dialog, Flex, Image, Portal, Text } from "@chakra-ui/react";
import { Form, InputField, SubmitButton } from "../others/forms";
import * as y from "yup";
import { sdkForConsole } from "@/lib/sdk";
import { PlatformType } from "@nuvix/console";
import { Chip, useToast } from "@/ui/components";
import { useProjectStore } from "@/lib/store";
import { Globe, Smartphone } from "lucide-react";
import { useFormikContext } from "formik";

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

const platformMap = {
  flutter: [
    { name: "Flutter Web", type: PlatformType.Flutterweb, icon: <Globe className="h-4 w-4" /> },
    {
      name: "Flutter iOS",
      type: PlatformType.Flutterios,
      icon: <Smartphone className="h-4 w-4" />,
    },
    {
      name: "Flutter Android",
      type: PlatformType.Flutterandroid,
      icon: <Smartphone className="h-4 w-4" />,
    },
    { name: "Flutter Linux", type: PlatformType.Flutterlinux, icon: <Globe className="h-4 w-4" /> },
    { name: "Flutter macOS", type: PlatformType.Fluttermacos, icon: <Globe className="h-4 w-4" /> },
    {
      name: "Flutter Windows",
      type: PlatformType.Flutterwindows,
      icon: <Globe className="h-4 w-4" />,
    },
  ],
  ios: [
    { name: "Apple iOS", type: PlatformType.Appleios, icon: <Smartphone className="h-4 w-4" /> },
    { name: "Apple macOS", type: PlatformType.Applemacos, icon: <Globe className="h-4 w-4" /> },
    { name: "Apple watchOS", type: PlatformType.Applewatchos, icon: <Globe className="h-4 w-4" /> },
    { name: "Apple tvOS", type: PlatformType.Appletvos, icon: <Globe className="h-4 w-4" /> },
  ],
  reactnative: [
    {
      name: "React Native iOS",
      type: PlatformType.Reactnativeios,
      icon: <Smartphone className="h-4 w-4" />,
    },
    {
      name: "React Native Android",
      type: PlatformType.Reactnativeandroid,
      icon: <Smartphone className="h-4 w-4" />,
    },
  ],
};

type CreatePlatformProps = {
  children?: React.ReactNode;
  type: "web" | "flutter" | "android" | "reactnative" | "ios";
  onClose?: () => void;
} & Omit<React.ComponentProps<typeof Dialog.Root>, "size" | "motionPreset" | "children">;

type SubmitValues = y.InferType<typeof schema>;

export const CreatePlatform: React.FC<CreatePlatformProps> = ({ children, type, ...props }) => {
  const { projects } = sdkForConsole;
  const { project } = useProjectStore();
  const { addToast } = useToast();

  async function onSubmit(values: SubmitValues, resetForm: any) {
    const { name, key, store, hostname } = values;
    try {
      const platform = await projects.createPlatform(
        project!.$id,
        values.type,
        name,
        key || undefined,
        store || undefined,
        hostname || undefined,
      );

      addToast({
        variant: "success",
        message: "Platform created successfully.",
      });

      resetForm();
      props.onClose?.();
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
                <Box flex="1" h="full" ml={10}>
                  <Image
                    src="https://img.freepik.com/free-vector/business-teamwork-concept-teamwork-leadership-effort-hard-work-team-strategy-concept-brainstorm-workshop-management-skills-vector-cartoon-illustration-flat-design_1150-56223.jpg?t=st=1741944634~exp=1741948234~hmac=a8809da68f5bcdb67d8616d53467b3b475fdf51020c728f1a1a1a00874fd875e&w=996"
                    alt="Platform Preview"
                    objectFit="cover"
                    borderRadius="lg"
                    shadow="md"
                    height="80%"
                  />
                </Box>

                <Box flex="1" h="full" justifyContent={"center"} maxW="500px">
                  <Flex alignItems="center" justifyContent="space-between" mb={6}>
                    <Text fontSize="3xl" fontWeight="bold">
                      Add a New Platform
                    </Text>
                    <Dialog.Trigger>
                      <CloseButton />
                    </Dialog.Trigger>
                  </Flex>

                  <Text fontSize="lg" color="fg.muted" mb={8}>
                    Configure your {type} platform settings.
                  </Text>

                  <Form
                    initialValues={{
                      name: "",
                      type:
                        type in platformMap
                          ? platformMap[type as keyof typeof platformMap][0].type
                          : type,
                      key: "",
                      store: "",
                      hostname: "",
                    }}
                    validationSchema={schema}
                    onSubmit={async (values, { resetForm }) => {
                      await onSubmit(values as SubmitValues, resetForm);
                    }}
                  >
                    <div className="space-y-6">
                      <CreateForm type={type} />
                    </div>

                    <Flex justify="flex-end" mt={8}>
                      <SubmitButton>Create Platform</SubmitButton>
                    </Flex>
                  </Form>
                </Box>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

const CreateForm = ({ type }: { type: string }) => {
  const { values, setFieldValue } = useFormikContext<{
    type: PlatformType;
    name: string;
    key: string;
    store: string;
    hostname: string;
  }>();
  const currentType = values.type;

  const platformOptions = platformMap[type as keyof typeof platformMap] || [];

  return (
    <>
      {platformOptions.length > 0 && (
        <Box mb={4}>
          <Flex gap={3} flexWrap="wrap">
            {platformOptions.map((option) => (
              <Chip
                key={option.type}
                height={2.3}
                paddingX="12"
                selected={currentType === option.type}
                prefixIcon={() => option.icon}
                onClick={() => setFieldValue("type", option.type)}
                label={option.name}
              />
            ))}
          </Flex>
        </Box>
      )}
      <InputField name="name" label="Platform Name" />

      {[PlatformType.Web, PlatformType.Flutterweb].includes(currentType) && (
        <InputField
          name="hostname"
          label="Hostname"
          placeholder="example.com"
          description="Enter the domain where this platform will be deployed (can be wildcard domain like *.example.com)"
        />
      )}

      {[
        PlatformType.Appleios,
        PlatformType.Android,
        PlatformType.Reactnativeios,
        PlatformType.Reactnativeandroid,
      ].includes(currentType) && (
        <>
          <InputField
            name="key"
            label="App Key"
            placeholder={currentType.includes("ios") ? "com.example.app" : "com.example.app"}
            description="Enter your app bundle identifier/package name"
          />
          {/* <InputField
              name="store"
              label="App Store URL"
              placeholder={
                currentType.includes("ios")
                  ? "https://apps.apple.com/app/id123456789"
                  : "https://play.google.com/store/apps/details?id=com.example.app"
              }
              description="Optional: Enter your app store URL if published"
            /> */}
        </>
      )}
    </>
  );
};
