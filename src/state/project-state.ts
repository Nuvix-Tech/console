"use client";
import { proxy } from "valtio";
import { Models } from "@nuvix/console";
import { sdkForConsole, type sdkForProject } from "@/lib/sdk";
import { useProxy } from "valtio/utils";
import { SidebarItem, SidebarItemGroup } from "@/components/project/sidebar";
import React from "react";
import { AppPermission } from "./app-state";

interface Sidebar {
  first?: React.ReactNode;
  middle?: React.ReactNode;
  last?: React.ReactNode;
}

interface IProjectState {
  initialfetching: boolean;
  project?: Models.Project;
  sdk?: typeof sdkForProject;
  scopes: Models.Roles;
  showSidebar: boolean;
  showSubSidebar: boolean;
  sidebarItems: (SidebarItemGroup | SidebarItem)[];
  sidebar: Sidebar;
  permissions: AppPermission;
  _update: () => Promise<void>;
}

class ProjectState implements IProjectState {
  initialfetching = true;
  scopes: Models.Roles = { roles: ["any"], scopes: [] };
  showSubSidebar = false;

  get permissions() {
    return {
      canReadSessions: this.scopes.scopes.includes("sessions.read"),
      canCreateSessions: this.scopes.scopes.includes("sessions.create"),
      canUpdateSessions: this.scopes.scopes.includes("sessions.update"),
      canDeleteSessions: this.scopes.scopes.includes("sessions.delete"),

      canReadUsers: this.scopes.scopes.includes("users.read"),
      canCreateUsers: this.scopes.scopes.includes("users.create"),
      canUpdateUsers: this.scopes.scopes.includes("users.update"),
      canDeleteUsers: this.scopes.scopes.includes("users.delete"),

      canReadTeams: this.scopes.scopes.includes("teams.read"),
      canCreateTeams: this.scopes.scopes.includes("teams.create"),
      canUpdateTeams: this.scopes.scopes.includes("teams.update"),
      canDeleteTeams: this.scopes.scopes.includes("teams.delete"),

      canReadDatabases: this.scopes.scopes.includes("databases.read"),
      canCreateDatabases: this.scopes.scopes.includes("databases.create"),
      canUpdateDatabases: this.scopes.scopes.includes("databases.update"),
      canDeleteDatabases: this.scopes.scopes.includes("databases.delete"),

      canReadCollections: this.scopes.scopes.includes("collections.read"),
      canCreateCollections: this.scopes.scopes.includes("collections.create"),
      canUpdateCollections: this.scopes.scopes.includes("collections.update"),
      canDeleteCollections: this.scopes.scopes.includes("collections.delete"),

      canReadAttributes: this.scopes.scopes.includes("attributes.read"),
      canCreateAttributes: this.scopes.scopes.includes("attributes.create"),
      canUpdateAttributes: this.scopes.scopes.includes("attributes.update"),
      canDeleteAttributes: this.scopes.scopes.includes("attributes.delete"),

      canReadIndexes: this.scopes.scopes.includes("indexes.read"),
      canCreateIndexes: this.scopes.scopes.includes("indexes.create"),
      canUpdateIndexes: this.scopes.scopes.includes("indexes.update"),
      canDeleteIndexes: this.scopes.scopes.includes("indexes.delete"),

      canReadDocuments: this.scopes.scopes.includes("documents.read"),
      canCreateDocuments: this.scopes.scopes.includes("documents.create"),
      canUpdateDocuments: this.scopes.scopes.includes("documents.update"),
      canDeleteDocuments: this.scopes.scopes.includes("documents.delete"),

      canReadFiles: this.scopes.scopes.includes("files.read"),
      canCreateFiles: this.scopes.scopes.includes("files.create"),
      canUpdateFiles: this.scopes.scopes.includes("files.update"),
      canDeleteFiles: this.scopes.scopes.includes("files.delete"),

      canReadBuckets: this.scopes.scopes.includes("buckets.read"),
      canCreateBuckets: this.scopes.scopes.includes("buckets.create"),
      canUpdateBuckets: this.scopes.scopes.includes("buckets.update"),
      canDeleteBuckets: this.scopes.scopes.includes("buckets.delete"),

      canReadFunctions: this.scopes.scopes.includes("functions.read"),
      canCreateFunctions: this.scopes.scopes.includes("functions.create"),
      canUpdateFunctions: this.scopes.scopes.includes("functions.update"),
      canDeleteFunctions: this.scopes.scopes.includes("functions.delete"),

      canReadExecution: this.scopes.scopes.includes("execution.read"),
      canCreateExecution: this.scopes.scopes.includes("execution.create"),
      canUpdateExecution: this.scopes.scopes.includes("execution.update"),
      canDeleteExecution: this.scopes.scopes.includes("execution.delete"),

      canReadLocale: this.scopes.scopes.includes("locale.read"),
      canReadAvatars: this.scopes.scopes.includes("avatars.read"),
      canReadHealth: this.scopes.scopes.includes("health.read"),
      canReadProviders: this.scopes.scopes.includes("providers.read"),
      canCreateProviders: this.scopes.scopes.includes("providers.create"),
      canUpdateProviders: this.scopes.scopes.includes("providers.update"),
      canDeleteProviders: this.scopes.scopes.includes("providers.delete"),

      canReadMessages: this.scopes.scopes.includes("messages.read"),
      canCreateMessages: this.scopes.scopes.includes("messages.create"),
      canUpdateMessages: this.scopes.scopes.includes("messages.update"),
      canDeleteMessages: this.scopes.scopes.includes("messages.delete"),

      canReadTopics: this.scopes.scopes.includes("topics.read"),
      canCreateTopics: this.scopes.scopes.includes("topics.create"),
      canUpdateTopics: this.scopes.scopes.includes("topics.update"),
      canDeleteTopics: this.scopes.scopes.includes("topics.delete"),

      canReadSubscribers: this.scopes.scopes.includes("subscribers.read"),
      canCreateSubscribers: this.scopes.scopes.includes("subscribers.create"),
      canUpdateSubscribers: this.scopes.scopes.includes("subscribers.update"),
      canDeleteSubscribers: this.scopes.scopes.includes("subscribers.delete"),

      canReadTargets: this.scopes.scopes.includes("targets.read"),
      canCreateTargets: this.scopes.scopes.includes("targets.create"),
      canUpdateTargets: this.scopes.scopes.includes("targets.update"),
      canDeleteTargets: this.scopes.scopes.includes("targets.delete"),

      canReadRules: this.scopes.scopes.includes("rules.read"),
      canCreateRules: this.scopes.scopes.includes("rules.create"),
      canUpdateRules: this.scopes.scopes.includes("rules.update"),
      canDeleteRules: this.scopes.scopes.includes("rules.delete"),

      canReadMigrations: this.scopes.scopes.includes("migrations.read"),
      canCreateMigrations: this.scopes.scopes.includes("migrations.create"),
      canUpdateMigrations: this.scopes.scopes.includes("migrations.update"),
      canDeleteMigrations: this.scopes.scopes.includes("migrations.delete"),

      canReadVcs: this.scopes.scopes.includes("vcs.read"),
      canCreateVcs: this.scopes.scopes.includes("vcs.create"),
      canUpdateVcs: this.scopes.scopes.includes("vcs.update"),
      canDeleteVcs: this.scopes.scopes.includes("vcs.delete"),

      canReadAssistant: this.scopes.scopes.includes("assistant.read"),
      canReadGlobal: this.scopes.scopes.includes("global"),
      canCreatePublic: this.scopes.scopes.includes("public.create"),
      canUpdatePublic: this.scopes.scopes.includes("public.update"),
      canDeletePublic: this.scopes.scopes.includes("public.delete"),
      canReadHome: this.scopes.scopes.includes("home"),
      canCreateConsole: this.scopes.scopes.includes("console.create"),
      canUpdateConsole: this.scopes.scopes.includes("console.update"),
      canDeleteConsole: this.scopes.scopes.includes("console.delete"),
      canReadGraphql: this.scopes.scopes.includes("graphql"),

      canCreateOrganizations: this.scopes.scopes.includes("organizations.create"),
      canUpdateOrganizations: this.scopes.scopes.includes("organizations.update"),
      canDeleteOrganizations: this.scopes.scopes.includes("organizations.delete"),

      canReadAccount: this.scopes.scopes.includes("account"),
      canReadProjects: this.scopes.scopes.includes("projects.read"),
      canCreateProjects: this.scopes.scopes.includes("projects.create"),
      canUpdateProjects: this.scopes.scopes.includes("projects.update"),
      canDeleteProjects: this.scopes.scopes.includes("projects.delete"),

      canReadPlatforms: this.scopes.scopes.includes("platforms.read"),
      canCreatePlatforms: this.scopes.scopes.includes("platforms.create"),
      canUpdatePlatforms: this.scopes.scopes.includes("platforms.update"),
      canDeletePlatforms: this.scopes.scopes.includes("platforms.delete"),

      canReadKeys: this.scopes.scopes.includes("keys.read"),
      canCreateKeys: this.scopes.scopes.includes("keys.create"),
      canUpdateKeys: this.scopes.scopes.includes("keys.update"),
      canDeleteKeys: this.scopes.scopes.includes("keys.delete"),

      canReadWebhooks: this.scopes.scopes.includes("webhooks.read"),
      canCreateWebhooks: this.scopes.scopes.includes("webhooks.create"),
      canUpdateWebhooks: this.scopes.scopes.includes("webhooks.update"),
      canDeleteWebhooks: this.scopes.scopes.includes("webhooks.delete"),

      canReadPolicies: this.scopes.scopes.includes("policies.read"),
      canCreatePolicies: this.scopes.scopes.includes("policies.create"),
      canUpdatePolicies: this.scopes.scopes.includes("policies.update"),
      canDeletePolicies: this.scopes.scopes.includes("policies.delete"),

      canReadArchives: this.scopes.scopes.includes("archives.read"),
      canCreateArchives: this.scopes.scopes.includes("archives.create"),
      canUpdateArchives: this.scopes.scopes.includes("archives.update"),
      canDeleteArchives: this.scopes.scopes.includes("archives.delete"),

      canReadRestorations: this.scopes.scopes.includes("restorations.read"),
      canCreateRestorations: this.scopes.scopes.includes("restorations.create"),
      canUpdateRestorations: this.scopes.scopes.includes("restorations.update"),
      canDeleteRestorations: this.scopes.scopes.includes("restorations.delete"),

      canReadBilling: this.scopes.scopes.includes("billing.read"),
      canCreateBilling: this.scopes.scopes.includes("billing.create"),
      canUpdateBilling: this.scopes.scopes.includes("billing.update"),
      canDeleteBilling: this.scopes.scopes.includes("billing.delete"),
    };
  }
  _update = async () => {};
  showSidebar = false;
  sidebarItems = [];
  sidebar = {
    first: null,
    middle: null,
    last: null,
  };
}

export const projectState = proxy<IProjectState>(new ProjectState());

export const getProjectState = () => useProxy(projectState);
