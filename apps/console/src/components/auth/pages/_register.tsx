"use client";
import { RegisterForm } from "@/components/auth/_register";
import { Heading, Logo, Text } from "@nuvix/ui/components";
import Link from "next/link";
import { motion } from "framer-motion";

export const RegisterPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center size-full gap-5 justigy-center md:p-4 rounded-sm"
    >
      <Logo size="l" wordmark={false} iconSrc="/favicon.ico" />
      <div>
        <Heading as="h3" variant="display-default-xs" align="center" className="mt-6">
          Get Started
        </Heading>
        <Text onBackground="neutral-weak" className="mt-2">
          Create a new account or{" "}
          <Link
            href="/auth/login"
            className="font-medium hover:underline neutral-on-background-medium"
          >
            log in
          </Link>
        </Text>
      </div>

      <RegisterForm />

      <Text onBackground="neutral-weak" className="mt-4 text-sm text-center">
        By creating an account, you agree to our{" "}
        <Link
          href="https://www.nuvix.in/legal/terms"
          className="font-medium hover:underline neutral-on-background-medium"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="https://www.nuvix.in/legal/privacy"
          className="font-medium hover:underline neutral-on-background-medium"
        >
          Privacy Policy
        </Link>
      </Text>
    </motion.div>
  );
};
