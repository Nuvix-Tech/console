import { Client, Payload } from "@nuvix/console";

export declare namespace Models {
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

  interface Table {}

  interface Column {}

  interface Index {}
}

export type { Models as _Models, Models as ModelsX };

export class Schema {
  private client: Client;

  private readonly namespace = "/databases/schemas" as const;

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

  async getTables(name: string): Promise<Models.Table> {
    const apiPath = this.namespace + "/" + name + "/tables";
    const payload: Payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);

    const apiHeaders: { [header: string]: string } = {
      "content-type": "application/json",
    };
    return await this.client.call("get", uri, apiHeaders, payload);
  }

  async createTable() {}
}
