// import * as Sentry from '@sentry/nextjs'
import { ProjectSdk } from "@/lib/sdk";
// import { uuidv4 } from '@/lib/helpers'
// import createClient from 'openapi-fetch'
import { ResponseError } from "@/types";
// import type { paths } from './api' // generated from openapi-typescript

const DEFAULT_HEADERS = {
  Accept: "application/json",
};

type Options = {
  query?: Record<string, string | boolean | number | undefined>;
  headers?: Record<string, string>;
  payload?: any;
  signal?: AbortSignal;
};

const createClient = async (
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH" | "HEAD" | "TRACE" | "OPTIONS",
  path: string,
  sdk: ProjectSdk,
  options?: Options,
) => {
  try {
    const data = await sdk.schema.call({
      method,
      path,
      ...options,
    });
    return { data, error: null }; // returning the data received from the SDK call
  } catch (error) {
    return { data: null, error };
  }
};

const client = {
  GET: async (path: string, sdk: ProjectSdk, options?: Options) =>
    createClient("GET", path, sdk, options),
  POST: async (path: string, sdk: ProjectSdk, options?: Options) =>
    createClient("POST", path, sdk, options),
  PUT: async (path: string, sdk: ProjectSdk, options?: Options) =>
    createClient("PUT", path, sdk, options),
  PATCH: async (path: string, sdk: ProjectSdk, options?: Options) =>
    createClient("PATCH", path, sdk, options),
  DELETE: async (path: string, sdk: ProjectSdk, options?: Options) =>
    createClient("DELETE", path, sdk, options),
  HEAD: async (path: string, sdk: ProjectSdk, options?: Options) =>
    createClient("HEAD", path, sdk, options),
  TRACE: async (path: string, sdk: ProjectSdk, options?: Options) =>
    createClient("TRACE", path, sdk, options),
  OPTIONS: async (path: string, sdk: ProjectSdk, options?: Options) =>
    createClient("OPTIONS", path, sdk, options),
};

export const {
  GET: get,
  POST: post,
  PUT: put,
  PATCH: patch,
  DELETE: del,
  HEAD: head,
  TRACE: trace,
  OPTIONS: options,
} = client;

export const handleError = (error: unknown): never => {
  if (error && typeof error === "object") {
    const errorMessage =
      "msg" in error && typeof error.msg === "string"
        ? error.msg
        : "message" in error && typeof error.message === "string"
          ? error.message
          : undefined;

    const errorCode = "code" in error && typeof error.code === "number" ? error.code : undefined;
    const requestId =
      "requestId" in error && typeof error.requestId === "string" ? error.requestId : undefined;

    if (errorMessage) {
      throw new ResponseError(errorMessage, errorCode, requestId);
    }
  }

  if (error !== null && typeof error === "object" && "stack" in error) {
    console.error(error.stack);
  }

  // the error doesn't have a message or msg property, so we can't throw it as an error. Log it via Sentry so that we can
  // add handling for it.
  // Sentry.captureException(error);

  // throw a generic error if we don't know what the error is. The message is intentionally vague because it might show
  // up in the UI.
  throw new ResponseError(undefined);
};
