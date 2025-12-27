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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col size-full gap-6 md:p-6 max-w-md mx-auto"
    >
      <Logo size="l" wordmark={false} iconSrc="/favicon.ico" className="sm:!hidden mb-2" />
      <div className="space-y-2">
        <Heading as="h3" variant="display-default-s">
          Create your account
        </Heading>
        <Text onBackground="neutral-weak" variant="body-default-m">
          Start building something amazing today
        </Text>
      </div>

      <RegisterForm />

      <div className="mt-2 text-center">
        <Text onBackground="neutral-weak" className="text-sm">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold hover:underline neutral-on-background-medium transition-colors"
          >
            Sign in
          </Link>
        </Text>
      </div>

      <Text
        onBackground="neutral-weak"
        className="mt-auto pt-6 text-xs text-center leading-relaxed"
      >
        By signing up, you agree to our{" "}
        <Link
          href="https://www.nuvix.in/legal/terms"
          className="font-medium hover:underline neutral-on-background-medium transition-colors"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="https://www.nuvix.in/legal/privacy"
          className="font-medium hover:underline neutral-on-background-medium transition-colors"
        >
          Privacy Policy
        </Link>
      </Text>
    </motion.div>
  );
};
