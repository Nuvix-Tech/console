export const rootKeys = {
  platforms(projectId: string) {
    return ["projects", projectId, "platforms"] as const;
  },
  platform(projectId: string, platformId: string) {
    return ["projects", projectId, "platforms", platformId] as const;
  },
};
