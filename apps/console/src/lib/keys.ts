export const rootKeys = {
  projects() {
    return ["projects"] as const;
  },
  project(projectId: string) {
    return ["projects", projectId] as const;
  },
  platforms(projectId: string) {
    return ["projects", projectId, "platforms"] as const;
  },
  platform(projectId: string, platformId: string) {
    return ["projects", projectId, "platforms", platformId] as const;
  },
  logs(projectId: string, rest: { [key: string]: any } = {}) {
    return ["projects", projectId, "logs", rest] as const;
  },
  keys(projectId: string) {
    return ["projects", projectId, "keys"] as const;
  },
  key(projectId: string, keyId: string) {
    return ["projects", projectId, "keys", keyId] as const;
  },

  organization(teamId?: string) {
    return ["organizations", teamId] as const;
  },
  scopes(teamId?: string) {
    return ["organizations", teamId, "scopes"] as const;
  },
};
