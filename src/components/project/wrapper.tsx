"use client";

import { getProjectSdk, sdkForConsole } from "@/lib/sdk";
import { ProjectContext } from "@/lib/store/project";
import React from "react";

export default function ProjectWrapper({
  children,
  id,
}: { children: React.ReactNode; id: string }) {
  const [project, setProject] = React.useState<any>(null);
  const [sdk, setSdk] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const { projects } = sdkForConsole;

  React.useEffect(() => {
    setLoading(true);

    projects.get(id).then((project) => {
      setProject(project);
      setSdk(getProjectSdk(project.$id));
      setLoading(false);
    });
  }, [id]);

  return (
    <>
      <ProjectContext.Provider value={{ data: { project, loading, sdk }, dispatch: setProject }}>
        {children}
      </ProjectContext.Provider>
    </>
  );
}
