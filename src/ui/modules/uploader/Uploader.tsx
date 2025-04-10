"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Flex, Icon, IconButton, Text } from "../../../ui/components";
import classNames from "classnames";
import styles from "./Uploader.module.scss";
import type { Upload } from "./UploadProvider";
import { ProgressBar, ProgressRoot } from "@/components/cui/progress";
import { Button } from "@chakra-ui/react";
import { formatBytes } from "@/lib";

interface UploaderProps {
  files: Upload[];
  removeUpload: (id: string) => void;
  cancelUpload: (id: string) => void;
}

const Uploader: React.FC<UploaderProps> = ({ files, removeUpload, cancelUpload }) => {
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Show uploader only if there are files
  const hasFiles = files.length > 0;

  // Count active uploads
  const activeUploads = files.filter(
    (file) => file.status === "uploading" || file.status === "pending",
  ).length;
  const completedUploads = files.filter((file) => file.status === "completed").length;
  const failedUploads = files.filter((file) => file.status === "error").length;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Auto-expand when new files are added
  useEffect(() => {
    if (hasFiles && activeUploads > 0) {
      setIsCollapsed(false);
    }
  }, [hasFiles, activeUploads]);

  if (!mounted || !hasFiles) return null;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Get status badge for a file
  const getStatusBadge = (status: Upload["status"]) => {
    return (
      <span className={classNames(styles.badge, styles[status])}>
        {status === "uploading"
          ? "Uploading"
          : status === "completed"
            ? "Complete"
            : status === "error"
              ? "Failed"
              : "Pending"}
      </span>
    );
  };

  return createPortal(
    <Flex
      className={styles.uploaderContainer}
      background="neutral-medium"
      gap="8"
      radius="l"
      overflow="hidden"
      borderWidth={1}
      border="neutral-medium"
      borderStyle="solid"
    >
      {/* Header - always visible */}
      <div
        className={classNames(styles.header, { [styles.collapsed]: isCollapsed })}
        onClick={toggleCollapse}
      >
        <Flex vertical="center" gap="8">
          <Icon name={isCollapsed ? "chevronUp" : "chevronDown"} size="s" />
          <Text variant="label-strong-s" as="div">
            File Uploads ({files.length}){activeUploads > 0 && ` - ${activeUploads} in progress`}
          </Text>
        </Flex>

        <Flex gap="8">
          {activeUploads > 0 && (
            <Text variant="body-default-xs" onBackground="info-medium">
              {activeUploads} active
            </Text>
          )}
          {completedUploads > 0 && (
            <Text variant="body-default-xs" onBackground="success-medium">
              {completedUploads} completed
            </Text>
          )}
          {failedUploads > 0 && (
            <Text variant="body-default-xs" onBackground="danger-medium">
              {failedUploads} failed
            </Text>
          )}
        </Flex>
      </div>

      {/* Upload list - collapsible */}
      <Flex
        background="accent-alpha-weak"
        className={classNames(styles.uploadList, { [styles.collapsed]: isCollapsed })}
      >
        {files.map((upload) => (
          <div key={upload.id} className={styles.uploadItem}>
            <Flex direction="column" gap="8">
              {/* File info */}
              <div className={styles.fileInfo}>
                <Text variant="body-default-s">{upload.file.name}</Text>
                <Text variant="body-default-xs" onBackground="neutral-medium">
                  {formatBytes(upload.file.size)}
                </Text>
              </div>

              {/* Progress bar */}
              {upload.status === "uploading" && (
                <div className={styles.progressContainer}>
                  <ProgressRoot value={upload.progress} size="xs" striped animated>
                    <ProgressBar />
                  </ProgressRoot>
                  <Flex horizontal="space-between" padding="4">
                    <Text variant="body-default-xs">{upload.progress}%</Text>
                    <Text variant="body-default-xs">{getStatusBadge(upload.status)}</Text>
                  </Flex>
                </div>
              )}

              {/* Status for non-uploading files */}
              {upload.status !== "uploading" && (
                <Flex horizontal="space-between" align="center">
                  {upload.status === "error" && (
                    <Text variant="body-default-xs" color="danger.medium">
                      {upload.errorMessage || "Upload failed"}
                    </Text>
                  )}
                  {upload.status === "completed" && (
                    <Text variant="body-default-xs" color="success.medium">
                      Upload complete
                    </Text>
                  )}
                  {upload.status === "pending" && (
                    <Text variant="body-default-xs" color="fg.muted">
                      Preparing upload...
                    </Text>
                  )}
                  {getStatusBadge(upload.status)}
                </Flex>
              )}

              {/* Action buttons */}
              <div className={styles.actionButtons}>
                {upload.status === "uploading" && (
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      cancelUpload(upload.id);
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <IconButton
                  icon="trash"
                  size="s"
                  variant="ghost"
                  onClick={() => {
                    // e.stopPropagation();
                    removeUpload(upload.id);
                  }}
                  tooltip={upload.status === "uploading" ? "Cancel and remove" : "Remove"}
                />
              </div>
            </Flex>
          </div>
        ))}
      </Flex>
    </Flex>,
    document.body,
  );
};

Uploader.displayName = "Uploader";
export { Uploader };
