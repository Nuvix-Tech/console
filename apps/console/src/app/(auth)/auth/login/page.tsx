"use client";
import { IS_PLATFORM } from "@/lib/constants";
import { sdkForConsole } from "@/lib/sdk";
import {
  Button,
  Column,
  Flex,
  Heading,
  Input,
  Line,
  Logo,
  PasswordInput,
  Row,
  SmartLink,
  Text,
  useToast,
} from "@nuvix/ui/components";
import { useRouter } from "@bprogress/next";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@nuvix/sui/components/alert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addToast } = useToast();
  const { account } = sdkForConsole;
  const { replace } = useRouter();

  const validateEmail = () => {
    if (!email) return "Email cannot be empty.";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return "Invalid email format.";
    return null;
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password cannot be empty.";
    return null;
  };

  const validateLogin = () => {
    const emailValidation = validateEmail();
    if (emailValidation) return emailValidation;
    if (!password) return "Password cannot be empty.";

    return null;
  };

  async function onSubmit() {
    setLoading(true);
    setError("");
    try {
      await account.createEmailPasswordSession(email, password);
      addToast({ variant: "success", message: "Successfully logged in." });
      replace("/");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center size-full gap-5 justigy-center md:p-4 rounded-sm"
    >
      <Logo size="l" wordmark={false} iconSrc="/favicon.ico" />
      <div className="flex flex-col items-center">
        <Heading as="h3" variant="display-default-xs" align="center">
          Welcome back
        </Heading>
        <Text onBackground="neutral-weak">
          Sign in to your account
          {IS_PLATFORM && (
            <>
              or{" "}
              <SmartLink className="neutral-on-background-medium" href="/auth/register">
                sign up
              </SmartLink>
            </>
          )}
        </Text>
      </div>

      {error && (
        <Alert variant="destructive" title="Error">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Column gap="16" fillWidth paddingY="8">
        <Input
          id="email"
          label="Email"
          type="email"
          labelAsPlaceholder
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          validate={validateEmail}
        />
        <PasswordInput
          id="password"
          label="Password"
          labelAsPlaceholder
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          validate={() => validatePassword(password)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        />
        <Flex horizontal="end">
          {/* <SmartLink href="/auth/forgot-password" className="!text-gray-500">
            Forgot password?
          </SmartLink> */}
        </Flex>
      </Column>

      <Button
        id="login"
        label="Log in"
        arrowIcon
        disabled={validateLogin() !== null || loading}
        loading={loading}
        fillWidth
        onClick={onSubmit}
        className="hover:shadow-lg hover:bg-opacity-90"
      />

      {IS_PLATFORM && (
        <>
          <Row fillWidth paddingY="8" vertical="center" gap="8">
            <Line />
            <Text onBackground="neutral-weak">OR</Text>
            <Line />
          </Row>

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
        </>
      )}
    </motion.div>
  );
}
