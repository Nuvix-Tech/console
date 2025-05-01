import {
  Account,
  Assistant,
  Avatars,
  Billing,
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
import { Schema } from "./external-sdk";

const API_URL =
  process.env.NEXT_PUBLIC_NUVIX_ENDPOINT ?? process.env.NUVIX_ENDPOINT ?? "https://api.nuvix.in/v1";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_ENDPOINT ?? "https://server.nuvix.in";

const clientConsole = new Client().setEndpoint(API_URL).setProject("console");
const clientServer = new Client().setEndpoint(SERVER_URL).setProject("console");

const clientProject = new Client().setEndpoint(API_URL).setMode("admin");
const clientServerProject = new Client().setEndpoint(SERVER_URL).setMode("admin");

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
  schema: new Schema(clientServerProject, SERVER_URL),
};

const sdkForConsole = {
  client: clientServer,
  account: new ConsoleAccount(clientServer),
  avatars: new Avatars(clientConsole),
  health: new Health(clientServer),
  locale: new Locale(clientConsole),
  projects: new Projects(clientServer),
  teams: new Organizations(clientServer),
  users: new ConsoleUsers(clientServer),
  assistant: new Assistant(clientServer),
  billing: new Billing(clientServer),
  // sources: new Sources(clientServer), // Updated to use clientServer
  organizations: new Organizations(clientServer),
};

function getProjectSdk(id: string) {
  clientProject.setProject(id).setMode("admin");
  clientServerProject.setProject(id).setMode("admin");
  return sdkForProject;
}

export type ProjectSdk = typeof sdkForProject;

export { sdkForConsole, getProjectSdk };
export type { sdkForProject };
