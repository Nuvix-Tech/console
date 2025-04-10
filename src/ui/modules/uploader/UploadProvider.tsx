"use client";
import type React from "react";
import { type ReactNode, createContext, useContext, useState, useCallback } from "react";
import { useProjectStore } from "@/lib/store";
import { ID } from "@nuvix/console";
import { Uploader } from "./Uploader";

export interface Upload {
  id: string;
  file: File;
  bucketId: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  errorMessage?: string;
  permissions?: string[];
  onComplete?: () => void | Promise<void>;
}

interface UploadContextProps {
  files: Upload[];
  uploadFile: (upload: {
    file: File;
    bucketId: string;
    id?: string;
    permissions?: string[];
    onComplete?: () => void | Promise<void>;
  }) => void;
  removeUpload: (id: string) => void;
  cancelUpload: (id: string) => void;
}

const UploadContext = createContext<UploadContextProps | undefined>(undefined);

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return context;
};

const UploadProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [files, setFiles] = useState<Upload[]>([]);
  const [abortControllers] = useState<Map<string, AbortController>>(new Map());
  const sdk = useProjectStore.use.sdk();

  const uploadFile = useCallback(
    ({
      file,
      bucketId,
      id = ID.unique(),
      permissions = [],
      onComplete,
    }: {
      file: File;
      bucketId: string;
      id?: string;
      permissions?: string[];
      onComplete?: () => void | Promise<void>;
    }) => {
      // Add the file to the queue with pending status
      const newUpload: Upload = {
        id,
        file,
        bucketId,
        progress: 0,
        status: "pending",
        permissions,
        onComplete,
      };

      setFiles((prev) => [...prev, newUpload]);

      // Start upload process
      if (sdk) {
        startUpload(newUpload);
      } else {
        console.error("SDK not available, cannot upload file");
        updateUploadStatus(id, "error", "SDK not available");
      }

      return id;
    },
    [sdk],
  );

  const removeUpload = useCallback((id: string) => {
    // Cancel the upload first if it's in progress
    cancelUpload(id);
    // Then remove from state
    setFiles((prev) => prev.filter((upload) => upload.id !== id));
  }, []);

  const cancelUpload = useCallback(
    (id: string) => {
      const controller = abortControllers.get(id);
      if (controller) {
        controller.abort();
        abortControllers.delete(id);
        updateUploadStatus(id, "error", "Upload cancelled");
      }
    },
    [abortControllers],
  );

  const updateUploadProgress = useCallback((id: string, progress: number) => {
    setFiles((prev) => prev.map((upload) => (upload.id === id ? { ...upload, progress } : upload)));
  }, []);

  const updateUploadStatus = useCallback(
    (id: string, status: Upload["status"], errorMessage?: string) => {
      setFiles((prev) =>
        prev.map((upload) => (upload.id === id ? { ...upload, status, errorMessage } : upload)),
      );
    },
    [],
  );

  const startUpload = useCallback(
    async (upload: Upload) => {
      if (!sdk) return;

      try {
        updateUploadStatus(upload.id, "uploading");

        // Create abort controller for cancellation
        const controller = new AbortController();
        abortControllers.set(upload.id, controller);

        // Use SDK's createFile method with onProgress callback
        await sdk.storage.createFile(
          upload.bucketId,
          upload.id,
          upload.file,
          upload.permissions || [],
          (progress) => {
            updateUploadProgress(upload.id, progress.progress);
          },
        );

        // Update status when complete
        updateUploadStatus(upload.id, "completed");
        abortControllers.delete(upload.id);
        await upload.onComplete?.();
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          // Upload was cancelled, already handled
          return;
        }

        console.error("Upload failed:", error);
        updateUploadStatus(
          upload.id,
          "error",
          error instanceof Error ? error.message : "Upload failed",
        );
        abortControllers.delete(upload.id);
      }
    },
    [sdk, updateUploadStatus, updateUploadProgress, abortControllers],
  );

  return (
    <UploadContext.Provider
      value={{
        files,
        uploadFile,
        removeUpload,
        cancelUpload,
      }}
    >
      {children}
      <Uploader files={files} removeUpload={removeUpload} cancelUpload={cancelUpload} />
    </UploadContext.Provider>
  );
};

UploadProvider.displayName = "UploadProvider";
export default UploadProvider;
