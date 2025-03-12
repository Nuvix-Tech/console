import { RegisterForm } from "@/components/auth/_register";
import { Heading, Logo, Text } from "@/ui/components";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Logo size="l" wordmark={false} iconSrc="/favicon.ico" />
      <Heading as="h3" variant="display-default-s" align="center">
        Get Started
      </Heading>
      <Text onBackground="neutral-medium">
        Create a new account or <Link href="/auth/login">log in</Link>
      </Text>

      <RegisterForm />
    </div>
  );
}
