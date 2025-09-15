"use client";
import type { Models } from "@nuvix/console";
import React from "react";
import { getProjectSdk, sdkForProject } from "../sdk";
import { ProjectSidebarData, SidebarItem, SidebarItemGroup } from "@/components/project/sidebar";
import { create } from "zustand";
import { AppPermission } from "./app";
import { createSelectors } from "../utils";
import type { ModelsX } from "../external-sdk";

export interface ProjectContextData {
  project: Models.Project;
  loading: boolean;
  sideLinks: ProjectSidebarData[];
  sdk: typeof sdkForProject;
  [key: string]: any;
}

export type dispatchAction = "UPDATE_PROJECT" | "UPDATE_SIDEBAR_LINKS";
export type dispatchData = {
  action: dispatchAction;
  data: any;
};

export const ProjectContext = React.createContext<{
  data: Partial<ProjectContextData>;
  dispatch: (data: dispatchData) => void;
  update: (data: Partial<ProjectContextData>) => void;
}>({
  data: {},
  dispatch: () => {},
  update: () => {},
});

interface Sidebar {
  title?: string;
  first?: React.ReactNode;
  middle?: React.ReactNode;
  last?: React.ReactNode;
}

interface ProjectStore {
  initialFetching: boolean;
  project: Models.Project;
  sdk: typeof sdkForProject;
  scopes: Models.Roles;
  schemas: ModelsX.Schema[];
  showSidebar: boolean;
  showSubSidebar: boolean;
  sidebarItems: (SidebarItemGroup | SidebarItem)[];
  sidebar: Sidebar;
  permissions: () => AppPermission;
  update: () => Promise<void>;
  setSidebar: (data: Sidebar) => void;
  setSidebarNull: (...keys: (keyof Omit<Sidebar, "title">)[]) => void;
  setShowSidebar: (show: boolean) => void;
  setShowSubSidebar: (show: boolean) => void;
  setProject: (project: Models.Project) => void;
  setSdk: (sdk: typeof sdkForProject) => void;
  setScopes: (scopes: Models.Roles) => void;
  setUpdateFn: (fn: () => Promise<void>) => void;
  apiEndpoint: () => string;
  panel?: {
    id: string;
    node: React.ReactNode;
    open: boolean;
  };
  setPanel: (panel: ProjectStore["panel"]) => void;
  hidePanel: (id?: string) => void;
  setSchemas: (schemas: ModelsX.Schema[]) => void;
}

const useProject = create<ProjectStore>((set, get) => ({
  initialFetching: true,
  scopes: { roles: ["any"], scopes: [] },
  showSidebar: true,
  showSubSidebar: true,
  sidebarItems: [],
  sidebar: {
    first: null,
    middle: null,
    last: null,
  },
  sdk: undefined as any,
  project: null as any,
  schemas: [],
  setSchemas: (schemas: ModelsX.Schema[]) => set({ schemas }),
  update: async () => {},
  setSdk: (sdk) => set({ sdk }),
  apiEndpoint: () => get().sdk?.client?.config?.endpoint,
  setProject: (project) => {
    set({
      project: project,
      sdk: getProjectSdk(project.$id),
      initialFetching: false,
    });
  },
  setScopes: (scopes) => set({ scopes }),
  setShowSidebar: (show) => set({ showSidebar: show }),
  setShowSubSidebar: (show) => set({ showSubSidebar: show }),
  setSidebar(data) {
    set((prev) => ({ sidebar: { ...prev.sidebar, ...data } }));
  },
  setUpdateFn(fn: () => Promise<void>) {
    set({ update: fn });
  },
  setSidebarNull(...keys) {
    set((state) => {
      const sidebar = { ...state.sidebar };
      if (keys.length) {
        keys.forEach((key) => {
          sidebar[key] = null;
        });
      } else {
        sidebar.first = sidebar.middle = sidebar.last = null;
      }
      return { sidebar };
    });
  },
  setPanel: (panel) => set({ panel }),
  hidePanel: (id) => {
    const panel = get().panel;
    if (panel) {
      panel.open = false;
      set({ panel });
    }
  },
  permissions: () => {
    const { scopes } = get();
    return {
      canReadSessions: scopes.scopes.includes("sessions.read"),
      canCreateSessions: scopes.scopes.includes("sessions.create"),
      canUpdateSessions: scopes.scopes.includes("sessions.update"),
      canDeleteSessions: scopes.scopes.includes("sessions.delete"),

      canReadUsers: scopes.scopes.includes("users.read"),
      canCreateUsers: scopes.scopes.includes("users.create"),
      canUpdateUsers: scopes.scopes.includes("users.update"),
      canDeleteUsers: scopes.scopes.includes("users.delete"),

      canReadTeams: scopes.scopes.includes("teams.read"),
      canCreateTeams: scopes.scopes.includes("teams.create"),
      canUpdateTeams: scopes.scopes.includes("teams.update"),
      canDeleteTeams: scopes.scopes.includes("teams.delete"),

      canReadDatabases: scopes.scopes.includes("databases.read"),
      canCreateDatabases: scopes.scopes.includes("databases.create"),
      canUpdateDatabases: scopes.scopes.includes("databases.update"),
      canDeleteDatabases: scopes.scopes.includes("databases.delete"),

      canReadCollections: scopes.scopes.includes("collections.read"),
      canCreateCollections: scopes.scopes.includes("collections.create"),
      canUpdateCollections: scopes.scopes.includes("collections.update"),
      canDeleteCollections: scopes.scopes.includes("collections.delete"),

      canReadAttributes: scopes.scopes.includes("attributes.read"),
      canCreateAttributes: scopes.scopes.includes("attributes.create"),
      canUpdateAttributes: scopes.scopes.includes("attributes.update"),
      canDeleteAttributes: scopes.scopes.includes("attributes.delete"),

      canReadIndexes: scopes.scopes.includes("indexes.read"),
      canCreateIndexes: scopes.scopes.includes("indexes.create"),
      canUpdateIndexes: scopes.scopes.includes("indexes.update"),
      canDeleteIndexes: scopes.scopes.includes("indexes.delete"),

      canReadDocuments: scopes.scopes.includes("documents.read"),
      canCreateDocuments: scopes.scopes.includes("documents.create"),
      canUpdateDocuments: scopes.scopes.includes("documents.update"),
      canDeleteDocuments: scopes.scopes.includes("documents.delete"),

      canReadFiles: scopes.scopes.includes("files.read"),
      canCreateFiles: scopes.scopes.includes("files.create"),
      canUpdateFiles: scopes.scopes.includes("files.update"),
      canDeleteFiles: scopes.scopes.includes("files.delete"),

      canReadBuckets: scopes.scopes.includes("buckets.read"),
      canCreateBuckets: scopes.scopes.includes("buckets.create"),
      canUpdateBuckets: scopes.scopes.includes("buckets.update"),
      canDeleteBuckets: scopes.scopes.includes("buckets.delete"),

      canReadFunctions: scopes.scopes.includes("functions.read"),
      canCreateFunctions: scopes.scopes.includes("functions.create"),
      canUpdateFunctions: scopes.scopes.includes("functions.update"),
      canDeleteFunctions: scopes.scopes.includes("functions.delete"),

      canReadExecution: scopes.scopes.includes("execution.read"),
      canCreateExecution: scopes.scopes.includes("execution.create"),
      canUpdateExecution: scopes.scopes.includes("execution.update"),
      canDeleteExecution: scopes.scopes.includes("execution.delete"),

      canReadLocale: scopes.scopes.includes("locale.read"),
      canReadAvatars: scopes.scopes.includes("avatars.read"),
      canReadHealth: scopes.scopes.includes("health.read"),
      canReadProviders: scopes.scopes.includes("providers.read"),
      canCreateProviders: scopes.scopes.includes("providers.create"),
      canUpdateProviders: scopes.scopes.includes("providers.update"),
      canDeleteProviders: scopes.scopes.includes("providers.delete"),

      canReadMessages: scopes.scopes.includes("messages.read"),
      canCreateMessages: scopes.scopes.includes("messages.create"),
      canUpdateMessages: scopes.scopes.includes("messages.update"),
      canDeleteMessages: scopes.scopes.includes("messages.delete"),

      canReadTopics: scopes.scopes.includes("topics.read"),
      canCreateTopics: scopes.scopes.includes("topics.create"),
      canUpdateTopics: scopes.scopes.includes("topics.update"),
      canDeleteTopics: scopes.scopes.includes("topics.delete"),

      canReadSubscribers: scopes.scopes.includes("subscribers.read"),
      canCreateSubscribers: scopes.scopes.includes("subscribers.create"),
      canUpdateSubscribers: scopes.scopes.includes("subscribers.update"),
      canDeleteSubscribers: scopes.scopes.includes("subscribers.delete"),

      canReadTargets: scopes.scopes.includes("targets.read"),
      canCreateTargets: scopes.scopes.includes("targets.create"),
      canUpdateTargets: scopes.scopes.includes("targets.update"),
      canDeleteTargets: scopes.scopes.includes("targets.delete"),

      canReadRules: scopes.scopes.includes("rules.read"),
      canCreateRules: scopes.scopes.includes("rules.create"),
      canUpdateRules: scopes.scopes.includes("rules.update"),
      canDeleteRules: scopes.scopes.includes("rules.delete"),

      canReadMigrations: scopes.scopes.includes("migrations.read"),
      canCreateMigrations: scopes.scopes.includes("migrations.create"),
      canUpdateMigrations: scopes.scopes.includes("migrations.update"),
      canDeleteMigrations: scopes.scopes.includes("migrations.delete"),

      canReadVcs: scopes.scopes.includes("vcs.read"),
      canCreateVcs: scopes.scopes.includes("vcs.create"),
      canUpdateVcs: scopes.scopes.includes("vcs.update"),
      canDeleteVcs: scopes.scopes.includes("vcs.delete"),

      canReadAssistant: scopes.scopes.includes("assistant.read"),
      canReadGlobal: scopes.scopes.includes("global"),
      canCreatePublic: scopes.scopes.includes("public.create"),
      canUpdatePublic: scopes.scopes.includes("public.update"),
      canDeletePublic: scopes.scopes.includes("public.delete"),
      canReadHome: scopes.scopes.includes("home"),
      canCreateConsole: scopes.scopes.includes("console.create"),
      canUpdateConsole: scopes.scopes.includes("console.update"),
      canDeleteConsole: scopes.scopes.includes("console.delete"),
      canReadGraphql: scopes.scopes.includes("graphql"),

      canCreateOrganizations: scopes.scopes.includes("organizations.create"),
      canUpdateOrganizations: scopes.scopes.includes("organizations.update"),
      canDeleteOrganizations: scopes.scopes.includes("organizations.delete"),

      canReadAccount: scopes.scopes.includes("account"),
      canReadProjects: scopes.scopes.includes("projects.read"),
      canCreateProjects: scopes.scopes.includes("projects.create"),
      canUpdateProjects: scopes.scopes.includes("projects.update"),
      canDeleteProjects: scopes.scopes.includes("projects.delete"),

      canReadPlatforms: scopes.scopes.includes("platforms.read"),
      canCreatePlatforms: scopes.scopes.includes("platforms.create"),
      canUpdatePlatforms: scopes.scopes.includes("platforms.update"),
      canDeletePlatforms: scopes.scopes.includes("platforms.delete"),

      canReadKeys: scopes.scopes.includes("keys.read"),
      canCreateKeys: scopes.scopes.includes("keys.create"),
      canUpdateKeys: scopes.scopes.includes("keys.update"),
      canDeleteKeys: scopes.scopes.includes("keys.delete"),

      canReadWebhooks: scopes.scopes.includes("webhooks.read"),
      canCreateWebhooks: scopes.scopes.includes("webhooks.create"),
      canUpdateWebhooks: scopes.scopes.includes("webhooks.update"),
      canDeleteWebhooks: scopes.scopes.includes("webhooks.delete"),

      canReadPolicies: scopes.scopes.includes("policies.read"),
      canCreatePolicies: scopes.scopes.includes("policies.create"),
      canUpdatePolicies: scopes.scopes.includes("policies.update"),
      canDeletePolicies: scopes.scopes.includes("policies.delete"),

      canReadArchives: scopes.scopes.includes("archives.read"),
      canCreateArchives: scopes.scopes.includes("archives.create"),
      canUpdateArchives: scopes.scopes.includes("archives.update"),
      canDeleteArchives: scopes.scopes.includes("archives.delete"),

      canReadRestorations: scopes.scopes.includes("restorations.read"),
      canCreateRestorations: scopes.scopes.includes("restorations.create"),
      canUpdateRestorations: scopes.scopes.includes("restorations.update"),
      canDeleteRestorations: scopes.scopes.includes("restorations.delete"),

      canReadBilling: scopes.scopes.includes("billing.read"),
      canCreateBilling: scopes.scopes.includes("billing.create"),
      canUpdateBilling: scopes.scopes.includes("billing.update"),
      canDeleteBilling: scopes.scopes.includes("billing.delete"),
    };
  },
}));

const useProjectStore = createSelectors(useProject);

export { useProject, useProjectStore };
