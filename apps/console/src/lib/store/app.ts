"use client";
import { create } from "zustand";
import { Models } from "@nuvix/console";
import { createSelectors } from "../utils";

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
}

const useApp = create<AppStore>((set, get) => ({
  isDrawerOpen: false,
  isSecondMenuOpen: false,
  scopes: { roles: ["any"], scopes: [] },
  organization: null as any,
  user: null as unknown as Models.User<any>,

  setIsDrawerOpen: (value: boolean) => set(() => ({ isDrawerOpen: value })),
  setIsSecondMenuOpen: (value: boolean) => set(() => ({ isSecondMenuOpen: value })),
  setScopes: (scopes: Models.Roles) => set(() => ({ scopes })),
  setOrganization: (organization: Models.Organization<any>) => set(() => ({ organization })),
  setUser: (user: Models.User<any>) => set(() => ({ user })),

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

const useAppStore = createSelectors(useApp);

export { useApp, useAppStore };
