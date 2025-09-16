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
    comment?: string;
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
  private client2: Client;

  private readonly namespace = "/databases/schemas" as const;

  private endpoint: string;
  private endpoint2: string;

  constructor(client: Client, client2: Client) {
    this.client = client;
    this.endpoint = client.config.endpoint;
    this.client2 = client2;
    this.endpoint2 = client2.config.endpoint;
  }

  async list(
    type?: string,
    limit?: number,
    page?: number,
    search?: string,
  ): Promise<Models.SchemaList> {
    const apiPath = this.namespace;
    const payload: Payload = {};
    const uri = new URL(this.endpoint + apiPath);
    if (type) {
      uri.searchParams.set("type", type);
    }

    if (limit !== undefined) uri.searchParams.set("limit", limit.toString());
    if (page !== undefined) uri.searchParams.set("page", page.toString());
    if (search) uri.searchParams.set("search", search);

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
    const uri = new URL(this.endpoint + apiPath);

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

  async create(
    name: string,
    type: "managed" | "unmanaged" | "document",
    description?: string,
    enabled: boolean = true,
  ): Promise<Models.Schema> {
    const apiPath = this.namespace;
    const payload: Payload = {
      name,
      type,
      description,
    };
    const uri = new URL(this.endpoint + apiPath);

    const apiHeaders: { [header: string]: string } = {
      "content-type": "application/json",
    };
    return await this.client.call("post", uri, apiHeaders, payload);
  }

  async updateTablePermissions(
    schema: string,
    table: string,
    permissions: any[],
  ): Promise<string[]> {
    const apiPath = "/schemas" + "/" + schema + "/tables/" + table + "/permissions";
    const payload: Payload = {
      permissions,
    };
    const uri = new URL(this.endpoint + apiPath);

    const apiHeaders: { [header: string]: string } = {
      "content-type": "application/json",
    };
    return await this.client.call("put", uri, apiHeaders, payload);
  }

  async updateTableRowPermissions(
    schema: string,
    table: string,
    rowId: number,
    permissions: any[],
  ): Promise<string[]> {
    const apiPath = "/schemas" + "/" + schema + "/tables/" + table + "/" + rowId + "/permissions";
    const payload: Payload = {
      permissions,
    };
    const uri = new URL(this.endpoint + apiPath);

    const apiHeaders: { [header: string]: string } = {
      "content-type": "application/json",
    };
    return await this.client.call("put", uri, apiHeaders, payload);
  }

  async getTablePermissions(schema: string, table: string): Promise<string[]> {
    const apiPath = "/schemas" + "/" + schema + "/tables/" + table + "/permissions";
    const payload: Payload = {};
    const uri = new URL(this.endpoint + apiPath);

    const apiHeaders: { [header: string]: string } = {
      "content-type": "application/json",
    };
    return await this.client.call("get", uri, apiHeaders, payload);
  }

  async getTableRowPermissions(schema: string, table: string, rowId: number): Promise<string[]> {
    const apiPath = "/schemas" + "/" + schema + "/tables/" + table + "/" + rowId + "/permissions";
    const payload: Payload = {};
    const uri = new URL(this.endpoint + apiPath);

    const apiHeaders: { [header: string]: string } = {
      "content-type": "application/json",
    };
    return await this.client.call("get", uri, apiHeaders, payload);
  }

  async call({
    method,
    path,
    query,
    headers,
    payload,
  }: {
    method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH" | "HEAD" | "TRACE" | "OPTIONS";
    path: string;
    query?: Record<string, string | boolean | number | undefined>;
    headers?: Record<string, string>;
    payload?: any;
  }) {
    const uri = new URL(this.endpoint2 + "/database" + path);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        value && uri.searchParams.set(key, value.toString());
      }
    }
    const apiHeaders: { [header: string]: string } = {
      "content-type": "application/json",
      ...headers,
    };
    return await this.client2.call(method.toLowerCase(), uri, apiHeaders, payload);
  }
}
