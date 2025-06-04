import { PropsWithChildren } from "react";

export const MessageSingleLayout = ({
  messageId,
  children,
}: PropsWithChildren<{ messageId: string }>) => {
  return children;
};
