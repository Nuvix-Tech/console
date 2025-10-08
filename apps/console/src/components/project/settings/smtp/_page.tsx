"use client";
import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import {
  Form,
  InputField,
  InputNumberField,
  InputSelectField,
  InputSwitchField,
  SubmitButton,
} from "@/components/others/forms";
import { rootKeys } from "@/lib/keys";
import { sdkForConsole } from "@/lib/sdk";
import { useProjectStore } from "@/lib/store";
import { formValue } from "@/lib/utils";
import { SMTPSecure } from "@nuvix/console";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

const smtpSchema = Yup.object().shape({
  enabled: Yup.boolean().required(),

  senderName: Yup.string().when("enabled", {
    is: true,
    then: (schema) => schema.required("Sender name is required when SMTP is enabled"),
  }),

  senderEmail: Yup.string()
    .email("Invalid email format")
    .when("enabled", {
      is: true,
      then: (schema) => schema.required("Sender email is required when SMTP is enabled"),
    }),

  replyTo: Yup.string().email("Invalid reply-to email format").nullable(),

  serverHost: Yup.string().when("enabled", {
    is: true,
    then: (schema) => schema.required("Server host is required when SMTP is enabled"),
  }),

  serverPort: Yup.number()
    .typeError("Server port must be a number")
    .integer("Server port must be an integer")
    .positive("Server port must be positive")
    .when("enabled", {
      is: true,
      then: (schema) => schema.required("Server port is required when SMTP is enabled"),
    }),

  username: Yup.string()
    .nullable()
    .when("enabled", {
      is: true,
      then: (schema) =>
        schema.test(
          "username-password-pair",
          "Username and password must be provided together when SMTP is enabled",
          function (value) {
            const { password } = this.parent;
            return (!value && !password) || (value && password);
          },
        ),
    }),

  password: Yup.string()
    .nullable()
    .when("enabled", {
      is: true,
      then: (schema) =>
        schema.test(
          "password-username-pair",
          "Username and password must be provided together when SMTP is enabled",
          function (value) {
            const { username } = this.parent;
            return (!value && !username) || (value && username);
          },
        ),
    }),

  secureProtocol: Yup.string()
    .oneOf(["ssl", "tls", "none"], "Invalid secure protocol")
    .default("none"),
});

export const SMTPSettings = () => {
  const project = useProjectStore.use.project?.();
  const queryClient = useQueryClient();

  const formik = useFormik({
    validationSchema: smtpSchema,
    initialValues: {
      enabled: project?.smtpEnabled ?? false,
      senderName: project?.smtpSenderName ?? "",
      senderEmail: project?.smtpSenderEmail ?? "",
      replyTo: project?.smtpReplyTo ?? "",
      serverHost: project?.smtpHost ?? "",
      serverPort: project?.smtpPort ?? 587,
      username: project?.smtpUsername ?? "",
      password: project?.smtpPassword ?? "",
      secureProtocol: project?.smtpSecure || "none",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await sdkForConsole.projects.updateSmtp(
          project.$id!,
          values.enabled,
          formValue(values.senderName),
          formValue(values.senderEmail),
          formValue(values.replyTo),
          formValue(values.serverHost),
          values.serverPort,
          formValue(values.username),
          formValue(values.password),
          values.secureProtocol === "none" ? undefined : (values.secureProtocol as SMTPSecure),
        );

        toast.success("SMTP settings updated successfully.");
        await queryClient.invalidateQueries({
          queryKey: rootKeys.project(project.$id),
        });
      } catch (error: any) {
        toast.error(error?.message || "Failed to update SMTP settings. Please try again.");
      }
    },
  });

  return (
    <>
      <Form {...formik}>
        <CardBox actions={<SubmitButton>Save</SubmitButton>}>
          <CardBoxBody>
            <CardBoxItem>
              <CardBoxTitle>SMTP server</CardBoxTitle>
              <CardBoxDesc>
                You can customize the email service by providing your own SMTP server.
                {/* View your email templates here */}
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              <InputSwitchField
                name="enabled"
                label="Custom SMTP server"
                description="Enabling this option allows customizing email templates and prevents emails from being labeled as spam."
              />
              {formik.values.enabled && (
                <div className="flex flex-col gap-3 mt-3 transition-all duration-200 border-t pt-3">
                  <InputField name="senderName" label="Sender name" />
                  <InputField name="senderEmail" label="Sender email" />
                  <InputField name="replyTo" label="Reply to" />
                  <InputField name="serverHost" label="Server host" />
                  <InputNumberField name="serverPort" label={"Server port"} placeholder="587" />
                  <InputField name="username" label="Username" />
                  <InputField name="password" label="Password" type="password" />
                  <InputSelectField
                    name="secureProtocol"
                    label="Secure protocol"
                    options={[
                      { label: "None", value: "none" },
                      { label: "SSL", value: "ssl" },
                      { label: "TLS", value: "tls" },
                    ]}
                  />
                </div>
              )}
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
