import {
  Account,
  Assistant,
  Avatars,
  Client,
  Console,
  ConsoleAccount,
  ConsoleUsers,
  Databases,
  Functions,
  Health,
  Locale,
  Messaging,
  Migrations,
  Organizations,
  Project,
  Project as ProjectApi,
  Projects,
  Proxy,
  Storage,
  Teams,
  Users,
  Vcs,
} from "@nuvix/console";

const API_URL =
  process.env.PUBLIC_NUVIX_ENDPOINT ??
  process.env.NUVIX_ENDPOINT ??
  "https://skill.collegejaankaar.in/v1";

const clientConsole = new Client().setEndpoint(API_URL).setProject("console");

const clientProject = new Client().setEndpoint(API_URL).setMode('admin');

const sdkForProject = {
  client: clientProject,
  account: new Account(clientProject),
  avatars: new Avatars(clientProject),
  // backups: new Backups(clientProject),
  databases: new Databases(clientProject),
  functions: new Functions(clientProject),
  health: new Health(clientProject),
  locale: new Locale(clientProject),
  messaging: new Messaging(clientProject),
  project: new Project(clientProject),
  projectApi: new ProjectApi(clientProject),
  storage: new Storage(clientProject),
  teams: new Teams(clientProject),
  users: new Users(clientProject),
  vcs: new Vcs(clientProject),
  proxy: new Proxy(clientProject),
  migrations: new Migrations(clientProject),
};

const sdkForConsole = {
  client: clientConsole,
  account: new ConsoleAccount(clientConsole),
  avatars: new Avatars(clientConsole),
  functions: new Functions(clientConsole),
  health: new Health(clientConsole),
  locale: new Locale(clientConsole),
  projects: new Projects(clientConsole),
  teams: new Organizations(clientConsole),
  users: new ConsoleUsers(clientConsole),
  migrations: new Migrations(clientConsole),
  console: new Console(clientConsole),
  assistant: new Assistant(clientConsole),
  // billing: new Billing(clientConsole),
  // sources: new Sources(clientConsole),
  organizations: new Organizations(clientConsole),
};

function getProjectSdk(id: string) {
  clientProject.setProject(id);
  return sdkForProject;
}

export { sdkForConsole, getProjectSdk };
export type { sdkForProject };
