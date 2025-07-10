"use client";
import React, { useState } from "react";
import { Box, CloseButton, Dialog, Flex, Image, Portal, Text } from "@chakra-ui/react";
import { Form, InputField, SubmitButton } from "../others/forms";
import { CustomID } from "../_custom_id";
import * as y from "yup";
import { sdkForConsole } from "@/lib/sdk";
import { ID } from "@nuvix/console";
import { useRouter } from "@bprogress/next";
import { useToast } from "@nuvix/ui/components";
import { useAppStore } from "@/lib/store";

type CreateProjectProps = {
  children?: React.ReactNode;
} & Omit<React.ComponentProps<typeof Dialog.Root>, "size" | "motionPreset" | "children">;

const schema = y.object().shape({
  name: y.string().max(56).required("Project name is required"),
  password: y.string().min(6).max(20).required("Database password is required"),
  id: y.string().min(6).max(36).optional(),
});

export const CreateProject: React.FC<CreateProjectProps> = ({ children, ...props }) => {
  const { projects } = sdkForConsole;
  const organization = useAppStore.use.organization?.();
  const { push } = useRouter();
  const { addToast } = useToast();

  async function onSubmit(name: string, resetForm: any, password: string, id?: string) {
    try {
      const project = await projects.create(
        id && id.length > 6 ? id : ID.unique(),
        name,
        organization!.$id,
        password as any,
        "fra" as any,
      );
      addToast({
        variant: "success",
        message: "Your project created.",
      });
      resetForm();
      push(`/project/${project.$id}`);
    } catch (e: any) {
      addToast({
        variant: "danger",
        message: e.message,
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
                    Let's Create Your Next Project
                  </Text>

                  <Text fontSize="2xl" color="fg.muted" mb={10}>
                    Provide a project name to get started.
                  </Text>
                  <Form
                    initialValues={{
                      name: "",
                      id: "",
                      password: "",
                    }}
                    validationSchema={schema}
                    onSubmit={async (values, { resetForm }) => {
                      const { id, name, password } = values;
                      await onSubmit(name, resetForm, password, id);
                    }}
                  >
                    <div className="space-y-4">
                      <InputField name="name" label="Project Name" />
                      <InputField name="password" type="password" label="Database Password" />
                      <CustomID label="Project ID" name="id" />
                    </div>

                    <Flex justify="flex-end" mt={6}>
                      <SubmitButton>Create</SubmitButton>
                      {/* <Button type="submit">
                        Continue
                      </Button> */}
                    </Flex>
                  </Form>
                </Box>
                <Box flex="1" h="full">
                  <Dialog.Trigger>
                    <CloseButton position="absolute" top={4} right={4} />
                  </Dialog.Trigger>
                  <Image
                    src="https://img.freepik.com/free-vector/business-teamwork-concept-teamwork-leadership-effort-hard-work-team-strategy-concept-brainstorm-workshop-management-skills-vector-cartoon-illustration-flat-design_1150-56223.jpg?t=st=1741944634~exp=1741948234~hmac=a8809da68f5bcdb67d8616d53467b3b475fdf51020c728f1a1a1a00874fd875e&w=996"
                    alt="Project Preview"
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
