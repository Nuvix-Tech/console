import { SettingsLayout } from "@/components/project";
import { PropsWithChildren } from "react";

export default function ({ children }: PropsWithChildren) {
  return <SettingsLayout>{children}</SettingsLayout>;
}
