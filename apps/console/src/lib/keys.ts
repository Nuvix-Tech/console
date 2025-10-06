export const rootKeys = {
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
};
