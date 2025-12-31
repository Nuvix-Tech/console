"use client";
import { IS_PLATFORM } from "@/lib/constants";
import { sdkForConsole } from "@/lib/sdk";
import {
  Button,
  Column,
  Flex,
  Heading,
  Line,
  Logo,
  Row,
  SmartLink,
  Text,
} from "@nuvix/ui/components";
import { useRouter } from "@bprogress/next";
import { motion } from "framer-motion";
import * as y from "yup";
import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { toast } from "sonner";

const schema = y.object().shape({
  email: y.string().email("Invalid email format").required("Email cannot be empty."),
  password: y.string().required("Password cannot be empty."),
});

export default function Login() {
  const { account } = sdkForConsole;
  const { replace } = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col size-full gap-5 justigy-center md:p-4 rounded-sm max-w-md mx-auto"
    >
      <Logo size="l" wordmark={false} iconSrc="/favicon.ico" className="sm:!hidden" />
      <div className="flex flex-col mb-6">
        <Heading as="h3" variant="display-default-s" onBackground="neutral-strong">
          Welcome back
        </Heading>
        <Text onBackground="neutral-weak" variant="body-default-m">
          Sign in to your account
        </Text>
      </div>

      {IS_PLATFORM && (
        <>
          <Button
            label="Continue with GitHub"
            fillWidth
            variant="secondary"
            weight="default"
            prefixIcon="github"
            disabled={true}
            tooltip="Only email-password login available."
            size="l"
            onClick={() => {}}
          />
          <Row fillWidth paddingY="8" vertical="center" gap="8">
            <Line />
            <Text onBackground="neutral-weak">OR</Text>
            <Line />
          </Row>
        </>
      )}

      <Form
        validationSchema={schema}
        initialValues={{ email: "", password: "" }}
        onSubmit={async ({ email, password }) => {
          return await toast.promise(
            async () => {
              await account.createEmailPasswordSession(email, password);
              replace("/");
            },
            {
              loading: "Logging in...",
              success: "Successfully logged in.",
              error: (e) => `${e?.message}`,
            },
          );
        }}
      >
        <Column gap="16" fillWidth paddingY="8">
          <InputField label="Email" type="email" labelAsPlaceholder name="email" />
          <InputField type="password" label="Password" labelAsPlaceholder name="password" />
          {IS_PLATFORM && (
            <Flex horizontal="end">
              <SmartLink href="/auth/forgot-password">
                <Text
                  onBackground="neutral-weak"
                  variant="label-default-s"
                  className="hover:!text-primary-foreground"
                >
                  {" "}
                  Forgot password?
                </Text>
              </SmartLink>
            </Flex>
          )}
        </Column>

        <div className="w-full [&>span]:w-full mt-2">
          <SubmitButton id="login" label="Log in" arrowIcon fillWidth size="l" showErrors={false} />
        </div>
      </Form>

      {IS_PLATFORM && (
        <>
          <Text
            onBackground="neutral-weak"
            variant="body-default-m"
            align="center"
            className="mt-4"
          >
            Don't have an account?{" "}
            <SmartLink
              className="neutral-on-background-medium font-medium hover:underline"
              href="/auth/register"
            >
              Sign up
            </SmartLink>
          </Text>
        </>
      )}
    </motion.div>
  );
}
