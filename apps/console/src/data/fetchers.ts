// import * as Sentry from '@sentry/nextjs'
import { ProjectSdk, SERVER_URL } from "@/lib/sdk";
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
    const url = new URL(SERVER_URL + "/database" + path);

    // Prepare headers
    let headers: Record<string, any> = { ...DEFAULT_HEADERS, ...options?.headers, ...sdk.client.headers };

    // Add cookie fallback if available
    if (typeof window !== "undefined" && window.localStorage) {
      const cookieFallback = window.localStorage.getItem("cookieFallback");
      if (cookieFallback) {
        headers["X-Fallback-Cookies"] = cookieFallback;
      }
    }

    let body: string | FormData | undefined;

    // Handle query parameters for GET requests
    if (options?.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      }
    }

    // Handle payload for non-GET requests
    if (method !== "GET" && options?.payload) {
      const contentType = headers["content-type"] || headers["Content-Type"];

      switch (contentType) {
        case "multipart/form-data":
          const formData = new FormData();
          for (const [key, value] of Object.entries(options.payload)) {
            if (value instanceof File) {
              formData.append(key, value, value.name);
            } else if (Array.isArray(value)) {
              for (const nestedValue of value) {
                formData.append(`${key}[]`, String(nestedValue));
              }
            } else if (value !== undefined) {
              formData.append(key, String(value));
            }
          }
          body = formData;
          delete headers["content-type"];
          delete headers["Content-Type"];
          break;
        default:
          body = JSON.stringify(options.payload);
          if (!contentType) {
            headers["Content-Type"] = "application/json";
          }
          break;
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      credentials: "include",
      signal: options?.signal,
      body,
    });

    const warnings = response.headers.get("x-nuvix-warning");
    if (warnings) {
      warnings.split(";").forEach((warning) => console.warn("Warning: " + warning));
    }

    let data = null;
    if (response.headers.get("content-type")?.includes("application/json")) {
      data = await response.json();
    } else {
      data = {
        message: await response.text(),
      };
    }

    if (400 <= response.status) {
      throw new ResponseError(
        data?.message,
        response.status,
        response.headers.get("x-request-id") || undefined,
      );
    }

    const cookieFallback = response.headers.get("X-Fallback-Cookies");
    if (typeof window !== "undefined" && window.localStorage && cookieFallback) {
      window.console.warn(
        "Nuvix is using localStorage for session management. Increase your security by adding a custom domain as your API endpoint.",
      );
      window.localStorage.setItem("cookieFallback", cookieFallback);
    }

    return { data, error: null };
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
