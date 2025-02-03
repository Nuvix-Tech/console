"use client";
import { APP_NAME } from "@/lib/constants";
import {
  Button, Column,
  Heading, Line, Logo,
  Row,
  SmartLink, Text,
  Input, PasswordInput,
  useToast
} from "@/once-ui/components";
import React, { useState } from "react";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { addToast } = useToast();

  const validateLogin = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return "Email and / or password is invalid.";
    }
    return null;
  };

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
      <Column fillWidth gap="8">
        <Button
          label="Continue with Google"
          fillWidth
          variant="secondary"
          weight="default"
          prefixIcon="google"
          size="l"
        />
        <Button
          label="Continue with GitHub"
          fillWidth
          variant="secondary"
          weight="default"
          prefixIcon="github"
          size="l"
        />
      </Column>
      <Row fillWidth paddingY="24">
        <Row onBackground="neutral-weak" fillWidth gap="24" vertical="center">
          <Line />/<Line />
        </Row>
      </Row>
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
      </Column>
      <Button
        id="login"
        label="Log in"
        arrowIcon
        fillWidth
        onClick={() => {
          addToast({
            variant: "success",
            message: "Wohoo! It's a toast!",
          });
        }}
      />
    </>
  )
}