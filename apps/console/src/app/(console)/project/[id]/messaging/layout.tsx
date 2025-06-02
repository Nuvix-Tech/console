import { MessagingLayout } from "@/components/project/messaging";

export default function ({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MessagingLayout>{children}</MessagingLayout>;
}
