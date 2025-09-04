import { Metadata } from "next";
import { RegisterPage } from "@/components/auth/pages";

export const metadata: Metadata = {
  title: "Register",
};

export default function () {
  return <RegisterPage />;
}
