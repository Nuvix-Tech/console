import { StorageLayout } from "@/components/project/storage";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StorageLayout>{children}</StorageLayout>
    </>
  );
}
