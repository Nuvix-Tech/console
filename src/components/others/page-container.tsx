import { Column } from "@/ui/components";

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Column paddingX="16" fillWidth>
      {children}
    </Column>
  );
};
