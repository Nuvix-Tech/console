"use client";
import { create } from "zustand";
import { Models } from "@nuvix/console";
import { createSelectors } from "../utils";
import { isPlatform } from "../constants";

export interface AppPermission {
  canReadSessions: boolean;
  canCreateSessions: boolean;
  canUpdateSessions: boolean;
  canDeleteSessions: boolean;

  canReadUsers: boolean;
  canCreateUsers: boolean;
  canUpdateUsers: boolean;
  canDeleteUsers: boolean;

  canReadTeams: boolean;
  canCreateTeams: boolean;
  canUpdateTeams: boolean;
  canDeleteTeams: boolean;

  canReadDatabases: boolean;
  canCreateDatabases: boolean;
  canUpdateDatabases: boolean;
  canDeleteDatabases: boolean;

  canReadCollections: boolean;
  canCreateCollections: boolean;
  canUpdateCollections: boolean;
  canDeleteCollections: boolean;

  canReadAttributes: boolean;
  canCreateAttributes: boolean;
  canUpdateAttributes: boolean;
  canDeleteAttributes: boolean;

  canReadIndexes: boolean;
  canCreateIndexes: boolean;
  canUpdateIndexes: boolean;
  canDeleteIndexes: boolean;

  canReadDocuments: boolean;
  canCreateDocuments: boolean;
  canUpdateDocuments: boolean;
  canDeleteDocuments: boolean;

  canReadFiles: boolean;
  canCreateFiles: boolean;
  canUpdateFiles: boolean;
  canDeleteFiles: boolean;

  canReadBuckets: boolean;
  canCreateBuckets: boolean;
  canUpdateBuckets: boolean;
  canDeleteBuckets: boolean;

  canReadFunctions: boolean;
  canCreateFunctions: boolean;
  canUpdateFunctions: boolean;
  canDeleteFunctions: boolean;

  canReadExecution: boolean;
  canCreateExecution: boolean;
  canUpdateExecution: boolean;
  canDeleteExecution: boolean;

  canReadLocale: boolean;
  canReadAvatars: boolean;
  canReadHealth: boolean;
  canReadProviders: boolean;
  canCreateProviders: boolean;
  canUpdateProviders: boolean;
  canDeleteProviders: boolean;

  canReadMessages: boolean;
  canCreateMessages: boolean;
  canUpdateMessages: boolean;
  canDeleteMessages: boolean;

  canReadTopics: boolean;
  canCreateTopics: boolean;
  canUpdateTopics: boolean;
  canDeleteTopics: boolean;

  canReadSubscribers: boolean;
  canCreateSubscribers: boolean;
  canUpdateSubscribers: boolean;
  canDeleteSubscribers: boolean;

  canReadTargets: boolean;
  canCreateTargets: boolean;
  canUpdateTargets: boolean;
  canDeleteTargets: boolean;

  canReadRules: boolean;
  canCreateRules: boolean;
  canUpdateRules: boolean;
  canDeleteRules: boolean;

  canReadMigrations: boolean;
  canCreateMigrations: boolean;
  canUpdateMigrations: boolean;
  canDeleteMigrations: boolean;

  canReadVcs: boolean;
  canCreateVcs: boolean;
  canUpdateVcs: boolean;
  canDeleteVcs: boolean;

  canReadAssistant: boolean;
  canReadGlobal: boolean;
  canCreatePublic: boolean;
  canUpdatePublic: boolean;
  canDeletePublic: boolean;

  canReadHome: boolean;
  canCreateConsole: boolean;
  canUpdateConsole: boolean;
  canDeleteConsole: boolean;

  canReadGraphql: boolean;
  canCreateOrganizations: boolean;
  canUpdateOrganizations: boolean;
  canDeleteOrganizations: boolean;

  canReadAccount: boolean;
  canReadProjects: boolean;
  canCreateProjects: boolean;
  canUpdateProjects: boolean;
  canDeleteProjects: boolean;

  canReadPlatforms: boolean;
  canCreatePlatforms: boolean;
  canUpdatePlatforms: boolean;
  canDeletePlatforms: boolean;

  canReadKeys: boolean;
  canCreateKeys: boolean;
  canUpdateKeys: boolean;
  canDeleteKeys: boolean;

  canReadWebhooks: boolean;
  canCreateWebhooks: boolean;
  canUpdateWebhooks: boolean;
  canDeleteWebhooks: boolean;

  canReadPolicies: boolean;
  canCreatePolicies: boolean;
  canUpdatePolicies: boolean;
  canDeletePolicies: boolean;

  canReadArchives: boolean;
  canCreateArchives: boolean;
  canUpdateArchives: boolean;
  canDeleteArchives: boolean;

  canReadRestorations: boolean;
  canCreateRestorations: boolean;
  canUpdateRestorations: boolean;
  canDeleteRestorations: boolean;

  canReadBilling: boolean;
  canCreateBilling: boolean;
  canUpdateBilling: boolean;
  canDeleteBilling: boolean;
}

interface AppStore {
  // Boolean states
  isDrawerOpen: boolean;
  isSecondMenuOpen: boolean;
  rightSidebarOpen: boolean;

  // Data
  scopes: Models.Roles;
  organization?: Models.Organization<any>;
  user: Models.User<any>;

  // Methods
  permissions: () => AppPermission;
  setIsDrawerOpen: (value: boolean) => void;
  setIsSecondMenuOpen: (value: boolean) => void;
  setScopes: (scopes: Models.Roles) => void;
  setOrganization: (organization: Models.Organization<any>) => void;
  setUser: (user: Models.User<any>) => void;
  setRightSidebarOpen: (value: boolean) => void;

  vars: {
    [key: string]: string;
  };
}

const useApp = create<AppStore>((set, get) => ({
  isDrawerOpen: false,
  isSecondMenuOpen: false,
  scopes: { roles: ["any"], scopes: [] },
  organization: null as any,
  user: null as unknown as Models.User<any>,
  rightSidebarOpen: true,
  vars: {},

  setIsDrawerOpen: (value: boolean) => set(() => ({ isDrawerOpen: value })),
  setIsSecondMenuOpen: (value: boolean) => set(() => ({ isSecondMenuOpen: value })),
  setScopes: (scopes: Models.Roles) => set(() => ({ scopes })),
  setOrganization: (organization: Models.Organization<any>) => set(() => ({ organization })),
  setUser: (user: Models.User<any>) => set(() => ({ user })),
  setRightSidebarOpen: (value: boolean) => set(() => ({ rightSidebarOpen: value })),

  permissions: () => {
    const { scopes } = get();
    const hasScope = (scope: string) => {
      if (!isPlatform) return true;
      return scopes.scopes.includes(scope);
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

const useAppStore = createSelectors(useApp);

export { useApp, useAppStore };
