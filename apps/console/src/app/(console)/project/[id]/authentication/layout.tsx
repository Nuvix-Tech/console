import { ProjectAuthWrapper } from "@/components/project/auths/wrapper";

export default async function ({ children }: { children: React.ReactNode }) {
  return <ProjectAuthWrapper>{children}</ProjectAuthWrapper>;
}
