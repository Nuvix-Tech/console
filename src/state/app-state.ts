import { proxy } from "valtio";
import { Models } from "@nuvix/console";
import { useProxy } from "valtio/utils";

interface AppPermission {
  canReadSessions: boolean;
  canWriteSessions: boolean;
  canReadUsers: boolean;
  canWriteUsers: boolean;
  canReadTeams: boolean;
  canWriteTeams: boolean;
  canReadDatabases: boolean;
  canWriteDatabases: boolean;
  canReadCollections: boolean;
  canWriteCollections: boolean;
  canReadAttributes: boolean;
  canWriteAttributes: boolean;
  canReadIndexes: boolean;
  canWriteIndexes: boolean;
  canReadDocuments: boolean;
  canWriteDocuments: boolean;
  canReadFiles: boolean;
  canWriteFiles: boolean;
  canReadBuckets: boolean;
  canWriteBuckets: boolean;
  canReadFunctions: boolean;
  canWriteFunctions: boolean;
  canReadExecution: boolean;
  canWriteExecution: boolean;
  canReadLocale: boolean;
  canReadAvatars: boolean;
  canReadHealth: boolean;
  canReadProviders: boolean;
  canWriteProviders: boolean;
  canReadMessages: boolean;
  canWriteMessages: boolean;
  canReadTopics: boolean;
  canWriteTopics: boolean;
  canReadSubscribers: boolean;
  canWriteSubscribers: boolean;
  canReadTargets: boolean;
  canWriteTargets: boolean;
  canReadRules: boolean;
  canWriteRules: boolean;
  canReadMigrations: boolean;
  canWriteMigrations: boolean;
  canReadVcs: boolean;
  canWriteVcs: boolean;
  canReadAssistant: boolean;
  canReadGlobal: boolean;
  canWritePublic: boolean;
  canReadHome: boolean;
  canWriteConsole: boolean;
  canReadGraphql: boolean;
  canWriteOrganizations: boolean;
  canReadAccount: boolean;
  canReadProjects: boolean;
  canWriteProjects: boolean;
  canReadPlatforms: boolean;
  canWritePlatforms: boolean;
  canReadKeys: boolean;
  canWriteKeys: boolean;
  canReadWebhooks: boolean;
  canWriteWebhooks: boolean;
  canReadPolicies: boolean;
  canWritePolicies: boolean;
  canReadArchives: boolean;
  canWriteArchives: boolean;
  canReadRestorations: boolean;
  canWriteRestorations: boolean;
  canReadBilling: boolean;
  canWriteBilling: boolean;
}

interface TAppState {
  isDrawerOpen: boolean;
  isSecondMenuOpen: boolean;
  scopes: Models.Roles;
  organization: Models.Organization<any>;
  user: Models.User<any>;
  permissions: AppPermission;
}

class AppState implements TAppState {
  isDrawerOpen = false;
  isSecondMenuOpen = false;

  scopes: Models.Roles = { roles: ['any'], scopes: [] };
  permissions = {
    canReadSessions: this.scopes.scopes.includes('sessions.read'),
    canWriteSessions: this.scopes.scopes.includes('sessions.write'),
    canReadUsers: this.scopes.scopes.includes('users.read'),
    canWriteUsers: this.scopes.scopes.includes('users.write'),
    canReadTeams: this.scopes.scopes.includes('teams.read'),
    canWriteTeams: this.scopes.scopes.includes('teams.write'),
    canReadDatabases: this.scopes.scopes.includes('databases.read'),
    canWriteDatabases: this.scopes.scopes.includes('databases.write'),
    canReadCollections: this.scopes.scopes.includes('collections.read'),
    canWriteCollections: this.scopes.scopes.includes('collections.write'),
    canReadAttributes: this.scopes.scopes.includes('attributes.read'),
    canWriteAttributes: this.scopes.scopes.includes('attributes.write'),
    canReadIndexes: this.scopes.scopes.includes('indexes.read'),
    canWriteIndexes: this.scopes.scopes.includes('indexes.write'),
    canReadDocuments: this.scopes.scopes.includes('documents.read'),
    canWriteDocuments: this.scopes.scopes.includes('documents.write'),
    canReadFiles: this.scopes.scopes.includes('files.read'),
    canWriteFiles: this.scopes.scopes.includes('files.write'),
    canReadBuckets: this.scopes.scopes.includes('buckets.read'),
    canWriteBuckets: this.scopes.scopes.includes('buckets.write'),
    canReadFunctions: this.scopes.scopes.includes('functions.read'),
    canWriteFunctions: this.scopes.scopes.includes('functions.write'),
    canReadExecution: this.scopes.scopes.includes('execution.read'),
    canWriteExecution: this.scopes.scopes.includes('execution.write'),
    canReadLocale: this.scopes.scopes.includes('locale.read'),
    canReadAvatars: this.scopes.scopes.includes('avatars.read'),
    canReadHealth: this.scopes.scopes.includes('health.read'),
    canReadProviders: this.scopes.scopes.includes('providers.read'),
    canWriteProviders: this.scopes.scopes.includes('providers.write'),
    canReadMessages: this.scopes.scopes.includes('messages.read'),
    canWriteMessages: this.scopes.scopes.includes('messages.write'),
    canReadTopics: this.scopes.scopes.includes('topics.read'),
    canWriteTopics: this.scopes.scopes.includes('topics.write'),
    canReadSubscribers: this.scopes.scopes.includes('subscribers.read'),
    canWriteSubscribers: this.scopes.scopes.includes('subscribers.write'),
    canReadTargets: this.scopes.scopes.includes('targets.read'),
    canWriteTargets: this.scopes.scopes.includes('targets.write'),
    canReadRules: this.scopes.scopes.includes('rules.read'),
    canWriteRules: this.scopes.scopes.includes('rules.write'),
    canReadMigrations: this.scopes.scopes.includes('migrations.read'),
    canWriteMigrations: this.scopes.scopes.includes('migrations.write'),
    canReadVcs: this.scopes.scopes.includes('vcs.read'),
    canWriteVcs: this.scopes.scopes.includes('vcs.write'),
    canReadAssistant: this.scopes.scopes.includes('assistant.read'),
    canReadGlobal: this.scopes.scopes.includes('global'),
    canWritePublic: this.scopes.scopes.includes('public'),
    canReadHome: this.scopes.scopes.includes('home'),
    canWriteConsole: this.scopes.scopes.includes('console'),
    canReadGraphql: this.scopes.scopes.includes('graphql'),
    canWriteOrganizations: this.scopes.scopes.includes('organizations.write'),
    canReadAccount: this.scopes.scopes.includes('account'),
    canReadProjects: this.scopes.scopes.includes('projects.read'),
    canWriteProjects: this.scopes.scopes.includes('projects.write'),
    canReadPlatforms: this.scopes.scopes.includes('platforms.read'),
    canWritePlatforms: this.scopes.scopes.includes('platforms.write'),
    canReadKeys: this.scopes.scopes.includes('keys.read'),
    canWriteKeys: this.scopes.scopes.includes('keys.write'),
    canReadWebhooks: this.scopes.scopes.includes('webhooks.read'),
    canWriteWebhooks: this.scopes.scopes.includes('webhooks.write'),
    canReadPolicies: this.scopes.scopes.includes('policies.read'),
    canWritePolicies: this.scopes.scopes.includes('policies.write'),
    canReadArchives: this.scopes.scopes.includes('archives.read'),
    canWriteArchives: this.scopes.scopes.includes('archives.write'),
    canReadRestorations: this.scopes.scopes.includes('restorations.read'),
    canWriteRestorations: this.scopes.scopes.includes('restorations.write'),
    canReadBilling: this.scopes.scopes.includes('billing.read'),
    canWriteBilling: this.scopes.scopes.includes('billing.write'),
  }

  organization = null as unknown as Models.Organization<any>;
  user = null as unknown as Models.User<any>;
}

export const appState = proxy<TAppState>(AppState as unknown as TAppState);

export const getAppState = () => useProxy(appState);
