import {
  Account,
  Assistant,
  Avatars,
  Billing,
  Client,
  ConsoleAccount,
  ConsoleUsers,
  Databases,
  Functions,
  Health,
  Locale,
  Messaging,
  Migrations,
  Models,
  NuvixException,
  Organizations,
  Payload,
  Project,
  Project as ProjectApi,
  Projects,
  Proxy,
  Storage,
  Teams,
  Users,
  Vcs,
} from "@nuvix/console";
import { Schemas } from "./external-sdk";
import { NUVIX_INERNAL_API_URL } from "./constants";
import { getEnv } from "./env";

const clientConsole = new Client().setEndpoint(getEnv().API_ENDPOINT).setProject("console");
const clientServer = new Client().setEndpoint(getEnv().PLATFORM_ENDPOINT).setProject("console");

const clientProject = new Client().setEndpoint(getEnv().API_ENDPOINT).setMode("admin");
const clientServerProject = new Client().setEndpoint(getEnv().PLATFORM_ENDPOINT).setMode("admin");

const sdkForProject = {
  client: clientProject,
  platform: clientServerProject,
  account: new Account(clientProject),
  avatars: new Avatars(clientProject),
  databases: new Databases(clientProject),
  functions: new Functions(clientProject),
  health: new Health(clientProject),
  locale: new Locale(clientProject),
  messaging: new Messaging(clientProject),
  project: new Project(clientServerProject),
  projectApi: new ProjectApi(clientProject),
  storage: new Storage(clientProject),
  teams: new Teams(clientProject),
  users: new Users(clientProject),
  vcs: new Vcs(clientProject),
  proxy: new Proxy(clientProject),
  migrations: new Migrations(clientProject),
  schema: new Schemas(clientProject),
};

const projects = new Projects(clientServer);
projects.create = (async (
  projectId: string,
  name: string,
  teamId: string,
  password: string,
  region?: any,
  description?: string,
  logo?: string,
  url?: string,
  legalName?: string,
  legalCountry?: string,
  legalState?: string,
  legalCity?: string,
  legalAddress?: string,
  legalTaxId?: string,
): Promise<Models.Project> => {
  if (typeof projectId === "undefined") {
    throw new NuvixException('Missing required parameter: "projectId"');
  }
  if (typeof name === "undefined") {
    throw new NuvixException('Missing required parameter: "name"');
  }
  if (typeof teamId === "undefined") {
    throw new NuvixException('Missing required parameter: "teamId"');
  }
  if (typeof password === "undefined") {
    throw new NuvixException('Missing required parameter: "password"');
  }
  const apiPath = "/projects";
  const payload: Payload = {};
  if (typeof projectId !== "undefined") {
    payload["projectId"] = projectId;
  }
  payload["password"] = password;
  if (typeof name !== "undefined") {
    payload["name"] = name;
  }
  if (typeof teamId !== "undefined") {
    payload["teamId"] = teamId;
  }
  if (typeof region !== "undefined") {
    payload["region"] = region;
  }
  if (typeof description !== "undefined") {
    payload["description"] = description;
  }
  if (typeof logo !== "undefined") {
    payload["logo"] = logo;
  }
  if (typeof url !== "undefined") {
    payload["url"] = url;
  }
  if (typeof legalName !== "undefined") {
    payload["legalName"] = legalName;
  }
  if (typeof legalCountry !== "undefined") {
    payload["legalCountry"] = legalCountry;
  }
  if (typeof legalState !== "undefined") {
    payload["legalState"] = legalState;
  }
  if (typeof legalCity !== "undefined") {
    payload["legalCity"] = legalCity;
  }
  if (typeof legalAddress !== "undefined") {
    payload["legalAddress"] = legalAddress;
  }
  if (typeof legalTaxId !== "undefined") {
    payload["legalTaxId"] = legalTaxId;
  }
  const uri = new URL(projects.client.config.endpoint + apiPath);

  const apiHeaders: { [header: string]: string } = {
    "content-type": "application/json",
  };

  return await projects.client.call("post", uri, apiHeaders, payload);
}) as any;
projects.get = (async (projectId: string, teamId: string): Promise<Models.Project> => {
  if (typeof projectId === "undefined") {
    throw new NuvixException('Missing required parameter: "projectId"');
  }
  // if (typeof teamId === "undefined") {
  //   throw new NuvixException('Missing required parameter: "teamId"');
  // }
  const apiPath = "/projects/{projectId}".replace("{projectId}", projectId);
  const payload: Payload = {};
  const uri = new URL(projects.client.config.endpoint + apiPath);
  uri.searchParams.append("teamId", teamId);

  const apiHeaders: { [header: string]: string } = {
    "content-type": "application/json",
  };

  return await projects.client.call("get", uri, apiHeaders, payload);
}) as any;

const sdkForConsole = {
  client: clientServer,
  account: new ConsoleAccount(clientServer),
  avatars: new Avatars(clientConsole),
  health: new Health(clientServer),
  locale: new Locale(clientConsole),
  projects,
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

export const platformClient = new Client().setEndpoint(NUVIX_INERNAL_API_URL).setProject("console");
