"use client";
import { Form, InputField, SubmitButton } from "../others/forms";
import * as y from "yup";
import { sdkForConsole } from "@/lib/sdk";
import { ID } from "@nuvix/console";
import { useRouter } from "@bprogress/next";
import { toast } from "sonner";

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
  const { account } = sdkForConsole;
  const { replace } = useRouter();

  return (
    <div className="w-full max-w-md mx-auto">
      <Form
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        }}
        validationSchema={schema}
        onSubmit={async (values, { resetForm }) => {
          return toast.promise(
            async () => {
              await account.create(
                ID.unique(),
                values.email,
                values.password,
                [values.firstName.trim(), values.lastName?.trim()].filter(Boolean).join(" "),
              );
              resetForm();
              replace("/auth/login");
            },
            {
              loading: "Creating your account...",
              success: "Account created successfully! Redirecting to login...",
              error: (err) => `Failed to create account: ${err.message}`,
            },
          );
        }}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-start">
          <InputField name="firstName" label="First Name" placeholder="John" required />
          <InputField name="lastName" label="Last Name" placeholder="Doe" />
        </div>
        <InputField
          name="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          required
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          required
        />
        <div className="pt-2 [&>span]:w-full">
          <SubmitButton label="Create Your Account" fillWidth size="l" showErrors={false} />
        </div>
      </Form>
    </div>
  );
};
