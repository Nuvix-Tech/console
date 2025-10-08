import { Metadata } from "next";
import { RegisterPage } from "@/components/auth/pages";
import { IS_PLATFORM } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Register",
};

export default function () {
  if (!IS_PLATFORM) return null;
  return <RegisterPage />;
}
