export type { Models as _Models } from "@nuvix/console";
export type { Models as ModelsX } from "@nuvix/console";
import { Schemas as BaseSchemas, Models } from "@nuvix/console";
export enum SchemaType {
  Document = "document",
  Managed = "managed",
  UnManaged = "unmanaged",
}

// src/services/schemas.ts
export class Schemas extends BaseSchemas {
  async list(
    type?: SchemaType | string,
    limit?: number,
    page?: number,
    search?: string,
  ): Promise<Models.SchemaList> {
    const apiPath = "/database/schemas";
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    if (type) {
      uri.searchParams.set("type", type);
    }
    if (limit !== void 0) uri.searchParams.set("limit", limit.toString());
    if (page !== void 0) uri.searchParams.set("page", page.toString());
    if (search) uri.searchParams.set("search", search);
    const apiHeaders = {
      "content-type": "application/json",
    };
    const res = await this.client.call("get", uri, apiHeaders, payload);
    for (let i = 0; i < res.data.length; i++) {
      res.data[i].$id = res.data[i].name;
    }
    return res;
  }
  async get(name: string): Promise<Models.Schema> {
    const apiPath = "/database/schemas/" + name;
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
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
    type: SchemaType | string,
    description?: string,
    enabled = true,
  ): Promise<Models.Schema> {
    const apiPath = "/database/schemas";
    const payload = {
      name,
      type,
      description,
    };
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "content-type": "application/json",
    };
    return await this.client.call("post", uri, apiHeaders, payload);
  }
  async delete(name: string) {
    const apiPath = "/database/schemas/" + name;
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "content-type": "application/json",
    };
    return await this.client.call("delete", uri, apiHeaders, payload);
  }
}
