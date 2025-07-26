import { Column, RevealFx, Input, PasswordInput, Button, Text } from "@nuvix/ui/components";
import { motion } from "motion/react";

export const Authentication = () => (
  <RevealFx delay={0.2} translateY={0.5}>
    <motion.div className="mx-auto w-[calc(90%_-_20px)] max-w-72 pb-2">
      <Column
        radius="l"
        borderWidth={2}
        border="accent-alpha-weak"
        className="h-48 p-2 gap-2 overflow-hidden -ml-5 mr-5"
        background="neutral-alpha-weak"
      >
        <Input height="s" readOnly label="user@example.com" labelAsPlaceholder />
        <PasswordInput height="s" readOnly label="********" labelAsPlaceholder />
        <Button variant="primary" size="s" fillWidth className="mt-2">
          Sign In
        </Button>
        <Text onBackground="neutral-weak" className="mx-auto mt-auto" variant="body-default-xs">
          OR
        </Text>
        <Button
          variant="secondary"
          size="s"
          className="mt-2 !absolute bottom-0 right-0 !bg-popover backdrop-blur-md"
          prefixIcon="google"
          weight="default"
        >
          Sign in with google
        </Button>
      </Column>
    </motion.div>
  </RevealFx>
);
