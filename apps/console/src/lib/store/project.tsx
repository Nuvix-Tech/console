"use client";
import type { Models } from "@nuvix/console";
import React from "react";
import { getProjectSdk, sdkForProject } from "../sdk";
import { ProjectSidebarData, SidebarItem, SidebarItemGroup } from "@/components/project/sidebar";
import { create } from "zustand";
import { AppPermission } from "./app";
import { createSelectors } from "../utils";
import type { ModelsX } from "../external-sdk";
import { IS_PLATFORM } from "../constants";

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

    const hasScope = (scope: string) => {
      if (!IS_PLATFORM) return true;
      return scopes?.scopes?.includes(scope);
    };

    return {
      canReadSessions: hasScope("sessions.read"),
      canCreateSessions: hasScope("sessions.create"),
      canUpdateSessions: hasScope("sessions.update"),
      canDeleteSessions: hasScope("sessions.delete"),

      canReadUsers: hasScope("users.read"),
      canCreateUsers: hasScope("users.create"),
      canUpdateUsers: hasScope("users.update"),
      canDeleteUsers: hasScope("users.delete"),

      canReadTeams: hasScope("teams.read"),
      canCreateTeams: hasScope("teams.create"),
      canUpdateTeams: hasScope("teams.update"),
      canDeleteTeams: hasScope("teams.delete"),

      canReadDatabases: hasScope("databases.read"),
      canCreateDatabases: hasScope("databases.create"),
      canUpdateDatabases: hasScope("databases.update"),
      canDeleteDatabases: hasScope("databases.delete"),

      canReadCollections: hasScope("collections.read"),
      canCreateCollections: hasScope("collections.create"),
      canUpdateCollections: hasScope("collections.update"),
      canDeleteCollections: hasScope("collections.delete"),

      canReadAttributes: hasScope("attributes.read"),
      canCreateAttributes: hasScope("attributes.create"),
      canUpdateAttributes: hasScope("attributes.update"),
      canDeleteAttributes: hasScope("attributes.delete"),

      canReadIndexes: hasScope("indexes.read"),
      canCreateIndexes: hasScope("indexes.create"),
      canUpdateIndexes: hasScope("indexes.update"),
      canDeleteIndexes: hasScope("indexes.delete"),

      canReadDocuments: hasScope("documents.read"),
      canCreateDocuments: hasScope("documents.create"),
      canUpdateDocuments: hasScope("documents.update"),
      canDeleteDocuments: hasScope("documents.delete"),

      canReadFiles: hasScope("files.read"),
      canCreateFiles: hasScope("files.create"),
      canUpdateFiles: hasScope("files.update"),
      canDeleteFiles: hasScope("files.delete"),

      canReadBuckets: hasScope("buckets.read"),
      canCreateBuckets: hasScope("buckets.create"),
      canUpdateBuckets: hasScope("buckets.update"),
      canDeleteBuckets: hasScope("buckets.delete"),

      canReadFunctions: hasScope("functions.read"),
      canCreateFunctions: hasScope("functions.create"),
      canUpdateFunctions: hasScope("functions.update"),
      canDeleteFunctions: hasScope("functions.delete"),

      canReadExecution: hasScope("execution.read"),
      canCreateExecution: hasScope("execution.create"),
      canUpdateExecution: hasScope("execution.update"),
      canDeleteExecution: hasScope("execution.delete"),

      canReadLocale: hasScope("locale.read"),
      canReadAvatars: hasScope("avatars.read"),
      canReadHealth: hasScope("health.read"),
      canReadProviders: hasScope("providers.read"),
      canCreateProviders: hasScope("providers.create"),
      canUpdateProviders: hasScope("providers.update"),
      canDeleteProviders: hasScope("providers.delete"),

      canReadMessages: hasScope("messages.read"),
      canCreateMessages: hasScope("messages.create"),
      canUpdateMessages: hasScope("messages.update"),
      canDeleteMessages: hasScope("messages.delete"),

      canReadTopics: hasScope("topics.read"),
      canCreateTopics: hasScope("topics.create"),
      canUpdateTopics: hasScope("topics.update"),
      canDeleteTopics: hasScope("topics.delete"),

      canReadSubscribers: hasScope("subscribers.read"),
      canCreateSubscribers: hasScope("subscribers.create"),
      canUpdateSubscribers: hasScope("subscribers.update"),
      canDeleteSubscribers: hasScope("subscribers.delete"),

      canReadTargets: hasScope("targets.read"),
      canCreateTargets: hasScope("targets.create"),
      canUpdateTargets: hasScope("targets.update"),
      canDeleteTargets: hasScope("targets.delete"),

      canReadRules: hasScope("rules.read"),
      canCreateRules: hasScope("rules.create"),
      canUpdateRules: hasScope("rules.update"),
      canDeleteRules: hasScope("rules.delete"),

      canReadMigrations: hasScope("migrations.read"),
      canCreateMigrations: hasScope("migrations.create"),
      canUpdateMigrations: hasScope("migrations.update"),
      canDeleteMigrations: hasScope("migrations.delete"),

      canReadVcs: hasScope("vcs.read"),
      canCreateVcs: hasScope("vcs.create"),
      canUpdateVcs: hasScope("vcs.update"),
      canDeleteVcs: hasScope("vcs.delete"),

      canReadAssistant: hasScope("assistant.read"),
      canReadGlobal: hasScope("global"),
      canCreatePublic: hasScope("public.create"),
      canUpdatePublic: hasScope("public.update"),
      canDeletePublic: hasScope("public.delete"),
      canReadHome: hasScope("home"),
      canCreateConsole: hasScope("console.create"),
      canUpdateConsole: hasScope("console.update"),
      canDeleteConsole: hasScope("console.delete"),
      canReadGraphql: hasScope("graphql"),

      canCreateOrganizations: hasScope("organizations.create"),
      canUpdateOrganizations: hasScope("organizations.update"),
      canDeleteOrganizations: hasScope("organizations.delete"),

      canReadAccount: hasScope("account"),
      canReadProjects: hasScope("projects.read"),
      canCreateProjects: hasScope("projects.create"),
      canUpdateProjects: hasScope("projects.update"),
      canDeleteProjects: hasScope("projects.delete"),

      canReadPlatforms: hasScope("platforms.read"),
      canCreatePlatforms: hasScope("platforms.create"),
      canUpdatePlatforms: hasScope("platforms.update"),
      canDeletePlatforms: hasScope("platforms.delete"),

      canReadKeys: hasScope("keys.read"),
      canCreateKeys: hasScope("keys.create"),
      canUpdateKeys: hasScope("keys.update"),
      canDeleteKeys: hasScope("keys.delete"),

      canReadWebhooks: hasScope("webhooks.read"),
      canCreateWebhooks: hasScope("webhooks.create"),
      canUpdateWebhooks: hasScope("webhooks.update"),
      canDeleteWebhooks: hasScope("webhooks.delete"),

      canReadPolicies: hasScope("policies.read"),
      canCreatePolicies: hasScope("policies.create"),
      canUpdatePolicies: hasScope("policies.update"),
      canDeletePolicies: hasScope("policies.delete"),

      canReadArchives: hasScope("archives.read"),
      canCreateArchives: hasScope("archives.create"),
      canUpdateArchives: hasScope("archives.update"),
      canDeleteArchives: hasScope("archives.delete"),

      canReadRestorations: hasScope("restorations.read"),
      canCreateRestorations: hasScope("restorations.create"),
      canUpdateRestorations: hasScope("restorations.update"),
      canDeleteRestorations: hasScope("restorations.delete"),

      canReadBilling: hasScope("billing.read"),
      canCreateBilling: hasScope("billing.create"),
      canUpdateBilling: hasScope("billing.update"),
      canDeleteBilling: hasScope("billing.delete"),
    };
  },
}));

const useProjectStore = createSelectors(useProject);

export { useProject, useProjectStore };
