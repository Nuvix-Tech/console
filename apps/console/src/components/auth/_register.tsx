"use client";

import React from "react";
import { Form, InputField } from "../others/forms";
import * as y from "yup";
import { sdkForConsole } from "@/lib/sdk";
import { ID } from "@nuvix/console";
import { Button, useToast } from "@nuvix/ui/components";
import { useRouter } from "@bprogress/next";

const schema = y.object({
  firstName: y.string().required("First name is required"),
  lastName: y.string(), // Last name can be empty
  email: y.string().email("Must be a valid email").required("Email is required"),
  password: y
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export const RegisterForm = () => {
  const [loading, setLoading] = React.useState(false);
  const { account } = sdkForConsole;
  const { addToast } = useToast();
  const { replace } = useRouter();

  return (
    <>
      <Form
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        }}
        validationSchema={schema}
        onSubmit={async (values, { resetForm }) => {
          setLoading(true);
          try {
            const res = await account.create(
              ID.unique(),
              values.email,
              values.password,
              [values.firstName, values.lastName].filter(Boolean).join(" "),
            );
            addToast({
              variant: "success",
              message: `Your account has been created`,
            });
            resetForm();
            replace("/auth/login");
          } catch (error: any) {
            addToast({
              variant: "danger",
              message: error.message,
            });
          }
          setLoading(false);
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField name="firstName" label="First Name" required />
          <InputField name="lastName" label="Last Name" />
        </div>
        <InputField name="email" label="Email" type="email" required />
        <InputField name="password" label="Password" type="password" required />
        <Button type="submit" loading={loading} fillWidth variant="primary" disabled={loading}>
          Create Account
        </Button>
      </Form>
    </>
  );
};
