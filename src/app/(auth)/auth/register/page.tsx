import { RegisterForm } from "@/components/auth/_register";
import { Heading, Logo, Text } from "@/ui/components";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 md:px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center">
          <Logo size="l" wordmark={false} iconSrc="/favicon.ico" />
          <Heading as="h3" variant="display-default-xs" align="center" className="mt-6">
            Get Started
          </Heading>
          <Text onBackground="neutral-medium" className="mt-2">
            Create a new account or{" "}
            <Link href="/auth/login" className="font-medium hover:underline">
              log in
            </Link>
          </Text>
        </div>

        <div className="flex flex-col w-full">
          <RegisterForm />

          <Text onBackground="neutral-medium" className="mt-4 text-sm text-center">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="font-medium hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium hover:underline">
              Privacy Policy
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
}
