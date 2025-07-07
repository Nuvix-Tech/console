import ProjectPage from "@/components/project/page";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ({ params }: Props) {
  const { id } = await params;
  return <ProjectPage id={id} />;
}
