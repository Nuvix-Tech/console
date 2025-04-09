"use client";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";

export interface Props {
  id: string;
  bucketId: string;
}

export const StorageSingleLayout = ({
  children,
}: {
  children: React.ReactNode;
} & Props) => {
  const params = useParams();
  const bucketName = params?.bucketId as string;

  return (
    <div className="flex flex-col gap-6">
      <Separator />

      <div className="flex flex-row gap-6">{children}</div>
    </div>
  );
};
