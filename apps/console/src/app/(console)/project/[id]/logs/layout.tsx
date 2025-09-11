import { ApiLogsLayout } from "@/components/project/logs/_layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ApiLogsLayout>{children}</ApiLogsLayout>;
}
