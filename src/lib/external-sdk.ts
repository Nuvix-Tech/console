import { Client, Payload } from "@nuvix/console";

export declare namespace Models {
  export interface Schema {
    $id: string;
    name: string;
    description?: string;
    type: "managed" | "unmanaged" | "document";
  }

  export interface SchemaList {
    schemas: Schema[];
    total: number;
  }

  export interface Table {
    $id: string;
    id: number;
    name: string;
    schema: string;
    comment: string | null;
    rls: boolean;
    cls: boolean;
    $permissions: any[];
    created_at: string;
    updated_at: string;
    columns: Column[];
    indexes: Index[];
  }

  export interface Column {
    id: number;
    name: string;
    type: string;
    array: boolean;
    unique: boolean;
    default: any | null;
    not_null: boolean;
    collation: string | null;
    generated: string | null;
    references: string | null;
    validation: string | null;
    compression: string | null;
    primary_key: boolean;
    $permissions: any[];
  }

  export interface Index {
    // Add properties based on your needs when you have index data
  }

  export interface TableList {
    tables: Table[];
    total: number;
  }
}

export type { Models as _Models, Models as ModelsX };

export class Schema {
  private client: Client;

  private readonly namespace = "/databases/schemas" as const;

  private readonly ns2 = "/schemas" as const;

  private endpoint: string;

  constructor(client: Client, endpoint: string) {
    this.client = client;
    this.endpoint = endpoint;
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

  async create(
    name: string,
    type: "managed" | "unmanaged",
    description?: string,
  ): Promise<Models.Schema> {
    const apiPath = this.namespace;
    const payload: Payload = {
      name,
      type,
      description,
    };
    const uri = new URL(this.client.config.endpoint + apiPath);

    const apiHeaders: { [header: string]: string } = {
      "content-type": "application/json",
    };
    return await this.client.call("post", uri, apiHeaders, payload);
  }

  async getTables(name: string): Promise<Models.TableList> {
    const apiPath = this.namespace + "/" + name + "/tables";
    const payload: Payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);

    const apiHeaders: { [header: string]: string } = {
      "content-type": "application/json",
    };
    return await this.client.call("get", uri, apiHeaders, payload);
  }

  listTables(name: string): Promise<Models.TableList> {
    return this.getTables(name);
  }

  async createTable({
    schema,
    name,
    permissions,
  }: { schema: string; name: string; permissions: string[] }) {
    const apiPath = this.namespace + "/" + schema + "/tables";
    const payload: Payload = {
      $id: name,
      name,
      schema,
      permissions,
      columns: [],
      indexes: [],
      rls: false,
      cls: false,
    };
    const uri = new URL(this.client.config.endpoint + apiPath);

    const apiHeaders: { [header: string]: string } = {
      "content-type": "application/json",
    };
    return await this.client.call("post", uri, apiHeaders, payload);
  }

  async getTable(name: string, schema: string): Promise<Models.Table> {
    const apiPath = this.namespace + "/" + schema + "/tables/" + name;
    const payload: Payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);

    const apiHeaders: { [header: string]: string } = {
      "content-type": "application/json",
    };
    return await this.client.call("get", uri, apiHeaders, payload);
  }

  async getRows(name: string, schema: string): Promise<any[]> {
    const apiPath = this.ns2 + "/" + schema + "/table/" + name;
    const payload: Payload = {};
    const uri = new URL(this.endpoint + apiPath);

    const apiHeaders: { [header: string]: string } = {
      "content-type": "application/json",
    };
    return await this.client.call("get", uri, apiHeaders, payload);
  }
}
