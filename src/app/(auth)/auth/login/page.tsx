"use client";
import { APP_NAME } from "@/lib/constants";
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
} from "@/ui/components";
import { useRouter } from "@bprogress/next";
import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { account } = sdkForConsole;

  const { replace } = useRouter();

  const validateLogin = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return "Email and / or password is invalid.";
    }
    return null;
  };

  async function onSubmit() {
    setLoading(true);
    try {
      const res = await account.createEmailPasswordSession(email, password);
      addToast({
        variant: "success",
        message: "You have successfully logged in.",
      });
      replace("/console");
    } catch (e: any) {
      addToast({
        variant: "danger",
        message: e.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Logo wordmark={false} size="l" />
      <Heading as="h3" variant="display-default-s" align="center">
        Welcome to {APP_NAME}
      </Heading>
      <Text onBackground="neutral-medium" marginBottom="24">
        Log in or
        <SmartLink href="/auth/register">sign up</SmartLink>
      </Text>
      <Column gap="-1" fillWidth>
        <Input
          id="email"
          label="Email"
          labelAsPlaceholder
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          validate={validateLogin}
          errorMessage={false}
          radius="top"
        />
        <PasswordInput
          autoComplete="new-password"
          id="password"
          label="Password"
          labelAsPlaceholder
          radius="bottom"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          validate={validateLogin}
        />
        <Flex horizontal="end" paddingTop="8">
          <SmartLink color="gray" href="/auth/forgot-password">
            Forgot password?
          </SmartLink>
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
      />
      <Row fillWidth paddingY="24">
        <Row onBackground="neutral-weak" fillWidth gap="24" vertical="center">
          <Line />*<Line />
        </Row>
      </Row>
      <Column fillWidth gap="8">
        {/* <Button
          label="Continue with Google"
          fillWidth
          variant="secondary"
          weight="default"
          prefixIcon="google"
          size="l"
        /> */}
        <Button
          label="Continue with GitHub"
          fillWidth
          disabled={true}
          // loading={loading}
          variant="secondary"
          weight="default"
          prefixIcon="github"
          size="l"
        />
      </Column>
    </>
  );
}
