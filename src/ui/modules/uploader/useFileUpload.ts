"use client";

import { useCallback } from "react";
import { useUpload } from "./UploadProvider";
import { ID } from "@nuvix/console";

interface UploadFileOptions {
  file: File;
  bucketId: string;
  id?: string;
  permissions?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Hook for easy file uploading with progress tracking
 *
 * @example
 * ```tsx
 * const { uploadFile } = useFileUpload();
 *
 * // In your file input handler
 * const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 *   if (e.target.files && e.target.files[0]) {
 *     uploadFile({
 *       file: e.target.files[0],
 *       bucketId: "your-bucket-id"
 *     });
 *   }
 * };
 * ```
 */
export const useFileUpload = (onComplete?: () => void | Promise<void>) => {
  const { uploadFile: addToUploadQueue } = useUpload();

  const uploadFile = useCallback(
    ({ file, bucketId, id = ID.unique(), permissions = [] }: UploadFileOptions) => {
      return addToUploadQueue({ file, bucketId, id, permissions, onComplete });
    },
    [addToUploadQueue],
  );

  const uploadFiles = useCallback(
    (files: File[], bucketId: string, permissions: string[] = []) => {
      const uploadIds: string[] = [];

      Array.from(files).forEach((file) => {
        const id = ID.unique();
        addToUploadQueue({
          file,
          bucketId,
          id,
          permissions,
          onComplete,
        });
        uploadIds.push(id);
      });

      return uploadIds;
    },
    [addToUploadQueue],
  );

  return {
    uploadFile,
    uploadFiles,
  };
};
