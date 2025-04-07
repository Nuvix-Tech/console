import { Client, Payload } from "@nuvix/console";

declare namespace Models {
  export interface Schema {
    $id: string;
    name: string;
    description: string;
    type: "managed" | "unmanaged" | "document";
  }

  export interface SchemaList {
    schemas: Schema[];
    total: number;
  }
}

export type { Models as _Models };

export class Schema {
  private client: Client;

  private readonly namespace: string = "/schema";

  constructor(client: Client) {
    this.client = client;
  }

  async list(): Promise<Models.SchemaList> {
    const apiPath = this.namespace;
    const payload: Payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);

    const apiHeaders: { [header: string]: string } = {
      "content-type": "application/json",
    };
    const res = await this.client.call("get", uri, apiHeaders, payload);

    for (let i = 0; i < res.schemas.length; i++) {
      res.schemas[i].$id = res.schemas[i].name;
    }
    return res;
  }

  async get(name: string): Promise<Models.Schema> {
    const apiPath = this.namespace + "/" + name;
    const payload: Payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);

    const apiHeaders: { [header: string]: string } = {
      "content-type": "application/json",
    };
    const res = await this.client.call("get", uri, apiHeaders, payload);
    if (res) {
      return {
        ...res,
        $id: name,
      };
    }
    return res;
  }

  async createTypeDocument(name: string, description: string): Promise<Models.Schema> {
    const apiPath = this.namespace + "/document";
    const payload: Payload = {
      name,
      description,
    };
    const uri = new URL(this.client.config.endpoint + apiPath);

    const apiHeaders: { [header: string]: string } = {
      "content-type": "application/json",
    };
    return await this.client.call("post", uri, apiHeaders, payload);
  }
}
