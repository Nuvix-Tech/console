import { useProjectStore } from "@/lib/store";

export const TopLeftInfo = () => {
  const project = useProjectStore.use.project?.();

  return (
    <>
      {project?.platforms?.map((platform, _) => (
        <div key={_}>
          {platform.type}
          {platform.name}
        </div>
      ))}
    </>
  );
};
