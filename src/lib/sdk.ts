import { Client } from "@nuvix/console";

const API_URL = process.env.PUBLIC_NUVIX_ENDPOINT ?? '';

const client = new Client()
  .setEndpoint(API_URL)
  .setProject('console')

const clientProject = new Client()
  .setEndpoint(API_URL)

function getProjectSdk(id: string) {
  return clientProject.setProject(id)
}

export { client, getProjectSdk };