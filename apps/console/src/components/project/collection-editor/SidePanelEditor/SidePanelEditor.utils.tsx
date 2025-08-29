import { chunk, find } from "lodash";
import Papa from "papaparse";
import { toast } from "sonner";

import { getQueryClient } from "@/data/query-client";
import { timeout, tryParseJson } from "@/lib/helpers";
import { ProjectSdk } from "@/lib/sdk";
import type { Models } from "@nuvix/console";
import { collectionKeys } from "@/data/collections/keys";

const BATCH_SIZE = 1000;
const CHUNK_SIZE = 1024 * 1024 * 0.1; // 0.1MB

/**
 * The methods below involve several contexts due to the UI flow of the
 * dashboard and hence do not sit within their own stores
 */
export const createCollection = async ({
  sdk,
  toastId,
  payload,
  schema,
}: {
  sdk: ProjectSdk;
  toastId: string | number;
  payload: Models.Collection;
  schema: string;
}) => {
  try {
    const collection = sdk.databases.createCollection(
      schema,
      payload.$id,
      payload.name,
      payload.$permissions,
      payload.documentSecurity,
      payload.enabled,
    );
    return collection;
  } catch (e) {
    toast.error(`An error occurred while creating the collection "${payload.name}"`, {
      id: toastId,
    });
    throw e;
  }
};

export const updateCollection = async ({
  sdk,
  toastId,
  payload,
  collectionId,
  schema,
  projectRef,
}: {
  projectRef: string;
  sdk: ProjectSdk;
  toastId: string | number;
  payload: Models.Collection;
  schema: string;
  collectionId: string;
}) => {
  try {
    const collection = await sdk.databases.updateCollection(
      schema,
      collectionId,
      payload.name,
      payload.$permissions,
      payload.documentSecurity,
      payload.enabled,
    );
    const queryClient = getQueryClient();

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: collectionKeys.editor(projectRef, schema, collection.$id),
      }),
      queryClient.invalidateQueries({ queryKey: collectionKeys.list(projectRef, { schema }) }),
    ]);

    // We need to invalidate tableRowsAndCount after collectionEditor
    // to ensure the query sent is correct
    await queryClient.invalidateQueries({
      queryKey: collectionKeys.documentsCount(projectRef, schema, collection.$id),
    });

    return collection;
  } catch (e) {
    toast.error(`An error occurred while updating the collection "${payload.name}"`, {
      id: toastId,
    });
    throw e;
  }
};

export const insertRowsViaSpreadsheet = async (
  projectRef: string,
  sdk: ProjectSdk,
  file: any,
  collection: Models.Collection,
  selectedHeaders: string[],
  onProgressUpdate: (progress: number) => void,
) => {
  let chunkNumber = 0;
  let insertError: any = undefined;
  const t1: any = new Date();
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      // dynamicTyping has to be disabled so that "00001" doesn't get parsed as 1.
      dynamicTyping: false,
      skipEmptyLines: true,
      chunkSize: CHUNK_SIZE,
      quoteChar: file.type === "text/tab-separated-values" ? "" : '"',
      // chunk: async (results: any, parser: any) => {
      //   parser.pause();
      //   const formattedData = results.data.map((row: any) => {
      //     const formattedRow: any = {};
      //     selectedHeaders.forEach((header) => {
      //       const column = table.columns?.find((c) => c.name === header);
      //       if ((column?.data_type ?? "") === "ARRAY" || (column?.format ?? "").includes("json")) {
      //         formattedRow[header] = tryParseJson(row[header]);
      //       } else if (row[header] === "") {
      //         // if the cell is empty string, convert it to NULL
      //         formattedRow[header] = column?.is_nullable ? null : "";
      //       } else {
      //         formattedRow[header] = row[header];
      //       }
      //     });
      //     return formattedRow;
      //   });
      //   const insertQuery = new Query()
      //     .from(table.name, table.schema)
      //     .insert(formattedData)
      //     .toSql();
      //   try {
      //     await executeSql({ projectRef, sdk, sql: insertQuery });
      //   } catch (error) {
      //     console.warn(error);
      //     insertError = error;
      //     parser.abort();
      //   }
      //   chunkNumber += 1;
      //   const progress = (chunkNumber * CHUNK_SIZE) / file.size;
      //   const progressPercentage = progress > 1 ? 100 : progress * 100;
      //   onProgressUpdate(progressPercentage);
      //   parser.resume();
      // },
      complete: () => {
        const t2: any = new Date();
        console.log(`Total time taken for importing spreadsheet: ${(t2 - t1) / 1000} seconds`);
        resolve({ error: insertError });
      },
    });
  });
};

export const insertTableRows = async (
  projectRef: string,
  sdk: ProjectSdk,
  collection: Models.Collection,
  rows: any,
  selectedHeaders: string[],
  onProgressUpdate: (progress: number) => void,
) => {
  let insertError = undefined;
  let insertProgress = 0;

  const formattedRows = rows.map((row: any) => {
    const formattedRow: any = {};
    // selectedHeaders.forEach((header) => {
    //   const column = table.columns?.find((c) => c.name === header);
    //   if ((column?.data_type ?? "") === "ARRAY" || (column?.format ?? "").includes("json")) {
    //     formattedRow[header] = tryParseJson(row[header]);
    //   } else if (row[header] === "") {
    //     formattedRow[header] = column?.is_nullable ? null : "";
    //   } else {
    //     formattedRow[header] = row[header];
    //   }
    // });
    return formattedRow;
  });

  const batches = chunk(formattedRows, BATCH_SIZE);
  const promises = batches.map((batch: any) => {
    return () => {
      return Promise.race([
        new Promise(async (resolve, reject) => {
          // const insertQuery = new Query().from(table.name, table.schema).insert(batch).toSql();
          // try {
          //   await executeSql({ projectRef, sdk, sql: insertQuery });
          // } catch (error) {
          //   insertError = error;
          //   reject(error);
          // }

          // insertProgress = insertProgress + batch.length / rows.length;
          resolve({});
        }),
        timeout(30000),
      ]);
    };
  });

  const batchedPromises = chunk(promises, 10);
  for (const batchedPromise of batchedPromises) {
    const res = await Promise.allSettled(batchedPromise.map((batch) => batch()));
    const hasFailedBatch = find(res, { status: "rejected" });
    if (hasFailedBatch) break;
    onProgressUpdate(insertProgress * 100);
  }
  return { error: insertError };
};

export const deleteCollection = async ({
  sdk,
  toastId,
  collectionId,
  schema,
  projectRef,
}: {
  projectRef: string;
  sdk: ProjectSdk;
  toastId: string | number;
  collectionId: string;
  schema: string;
}) => {
  try {
    await sdk.databases.deleteCollection(schema, collectionId);
    const queryClient = getQueryClient();

    queryClient.invalidateQueries({
      queryKey: collectionKeys.editor(projectRef, schema, collectionId),
    });
    queryClient.invalidateQueries({ queryKey: collectionKeys.list(projectRef, { schema }) });
    queryClient.invalidateQueries({
      queryKey: collectionKeys.documentsCount(projectRef, schema, collectionId),
    });
    return true;
  } catch (error) {
    toast.error("An error occurred while deleting the collection", { id: toastId });
    throw error;
  }
};
