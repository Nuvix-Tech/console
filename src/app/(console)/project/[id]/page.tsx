import ProjectPage from "@/components/project/page";
import { Skeleton } from "@/ui/components";
import { Suspense } from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense fallback={<Skeleton fill shape="block" />}>
      <ProjectPage id={id} />
    </Suspense>
  );
}
