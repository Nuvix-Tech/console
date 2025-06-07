"use client";

import type React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Button, Flex, Icon, IconButton, Text } from "@nuvix/ui/components";
import { Tooltip } from "@/components/cui/tooltip";
import classNames from "classnames";
import styles from "./Uploader.module.scss";
import type { Upload } from "./UploadProvider";
import { ProgressBar, ProgressRoot } from "@/components/cui/progress";
import { formatBytes } from "@/lib";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@chakra-ui/react";

export interface UploaderProps {
  files: Upload[];
  removeUpload: (id: string) => void;
  cancelUpload: (id: string) => void;
  retryUpload?: (id: string) => void; // Optional retry function
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  maxHeight?: string | number;
}

// File type icons mapping
const getFileTypeIcon = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";

  // Image files
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
    return "image";
  }
  // Document files
  if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(extension)) {
    return "document";
  }
  // Video files
  if (["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(extension)) {
    return "video";
  }
  // Audio files
  if (["mp3", "wav", "ogg", "flac", "aac"].includes(extension)) {
    return "audio";
  }
  // Archive files
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
    return "archive";
  }
  // Code files
  if (["js", "ts", "jsx", "tsx", "html", "css", "json", "py", "java", "cpp"].includes(extension)) {
    return "code";
  }

  return "file"; // Default icon
};

const Uploader: React.FC<UploaderProps> = ({
  files,
  removeUpload,
  cancelUpload,
  retryUpload,
  position = "bottom-right",
  maxHeight = "300px",
}) => {
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Show uploader only if there are files
  const hasFiles = files.length > 0;

  // Calculate total progress
  const calculateTotalProgress = () => {
    const uploading = files.filter(
      (file) => file.status === "uploading" || file.status === "pending",
    );
    if (uploading.length === 0) return 100;

    const totalProgress = uploading.reduce((acc, file) => acc + file.progress, 0);
    return Math.round(totalProgress / uploading.length);
  };

  const totalProgress = calculateTotalProgress();

  // Count uploads by status
  const activeUploads = files.filter(
    (file) => file.status === "uploading" || file.status === "pending",
  ).length;
  const completedUploads = files.filter((file) => file.status === "completed").length;
  const failedUploads = files.filter((file) => file.status === "error").length;

  // Handle escape key press to collapse uploader
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isCollapsed) {
        setIsCollapsed(true);
      }
    },
    [isCollapsed],
  );

  useEffect(() => {
    setMounted(true);
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      setMounted(false);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  // Auto-expand when new files are added
  useEffect(() => {
    if (hasFiles && activeUploads > 0) {
      setIsCollapsed(false);
    }
  }, [hasFiles, activeUploads]);

  // Auto-collapse after all uploads are done (with a delay)
  useEffect(() => {
    if (hasFiles && activeUploads === 0 && !isCollapsed) {
      const timer = setTimeout(() => {
        setIsCollapsed(true);
      }, 5000); // Auto-collapse after 5 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [hasFiles, activeUploads, isCollapsed]);

  if (!mounted || !hasFiles) return null;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Render file status with appropriate styling
  const FileStatus: React.FC<{ status: Upload["status"]; errorMessage?: string }> = ({
    status,
    errorMessage,
  }) => {
    switch (status) {
      case "uploading":
        return <Badge>Uploading</Badge>;
      case "completed":
        return <Badge colorPalette="green">Complete</Badge>;
      case "error":
        return (
          <Tooltip content={errorMessage || "Upload failed"}>
            <Badge colorPalette="red">Failed</Badge>
          </Tooltip>
        );
      case "pending":
        return <Badge colorPalette="yellow">Pending</Badge>;
      default:
        return null;
    }
  };

  // Position styles
  const getPositionStyle = () => {
    const styles: React.CSSProperties = {
      position: "fixed",
      zIndex: 10000,
    };

    switch (position) {
      case "bottom-right":
        styles.bottom = "20px";
        styles.right = "20px";
        break;
      case "bottom-left":
        styles.bottom = "20px";
        styles.left = "20px";
        break;
      case "top-right":
        styles.top = "20px";
        styles.right = "20px";
        break;
      case "top-left":
        styles.top = "20px";
        styles.left = "20px";
        break;
    }

    return styles;
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={styles.uploaderContainer}
      style={getPositionStyle()}
      ref={containerRef}
    >
      <Flex
        direction="column"
        background="neutral-medium"
        radius="l"
        overflow="hidden"
        borderWidth={1}
        border="neutral-medium"
        borderStyle="solid"
        style={{ width: "320px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}
      >
        {/* Header with overall status */}
        <Flex
          className={classNames(styles.header, { [styles.collapsed]: isCollapsed })}
          onClick={toggleCollapse}
          horizontal="space-between"
          padding="12"
          vertical="center"
        >
          <Flex vertical="center" gap="8" style={{ cursor: "pointer" }}>
            <Icon name={isCollapsed ? "chevronUp" : "chevronDown"} size="s" />
            <Flex direction="column" gap="2">
              <Text variant="label-strong-s" as="div">
                File Uploads ({files.length})
              </Text>

              {activeUploads > 0 && (
                <Flex vertical="center" gap="4">
                  <Text variant="body-default-xs" onBackground="neutral-medium">
                    {activeUploads} in progress • {totalProgress}% complete
                  </Text>
                </Flex>
              )}
            </Flex>
          </Flex>

          <Flex gap="8" align="center">
            {/* Status indicators */}
            <Flex gap="8" align="center">
              {activeUploads > 0 && <Badge>{activeUploads}</Badge>}
              {completedUploads > 0 && <Badge colorPalette="green">{completedUploads}</Badge>}
              {failedUploads > 0 && <Badge colorPalette="red">{failedUploads}</Badge>}
            </Flex>

            {/* Clear all button */}
            <IconButton
              icon="close"
              size="s"
              variant="ghost"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                files.forEach((file) => {
                  if (file.status === "uploading") {
                    cancelUpload(file.id);
                  }
                  removeUpload(file.id);
                });
              }}
              aria-label="Close"
              tooltip="Clear all uploads"
              className={styles.closeButton}
            />
          </Flex>
        </Flex>

        {/* Overall progress bar */}
        {activeUploads > 0 && (
          <ProgressRoot value={totalProgress} striped animated height={"2px"} className="!h-0.5">
            <ProgressBar className="!h-0.5" />
          </ProgressRoot>
        )}

        {/* Upload list - collapsible */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: "hidden" }}
            >
              <Flex
                direction="column"
                fillWidth
                padding="8"
                overflowY="auto"
                overflowX="hidden"
                background="accent-alpha-weak"
                className={styles.uploadList}
                style={{ maxHeight }}
              >
                <AnimatePresence>
                  {files.map((upload) => (
                    <motion.div
                      key={upload.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`${styles.uploadItem} group/uploader`}
                    >
                      <Flex gap="12" padding="4" align="start">
                        {/* File type icon */}
                        <div className={`${styles.fileIcon}`}>
                          <Icon name={getFileTypeIcon(upload.file.name)} size="s" />
                        </div>

                        <Flex direction="column" gap="4" style={{ flex: 1 }}>
                          {/* File info */}
                          <Flex horizontal="space-between">
                            <Text
                              variant="body-strong-s"
                              className="truncate line-clamp-1"
                              style={{ maxWidth: "170px" }}
                            >
                              {upload.file.name}
                            </Text>
                            <Text
                              variant="body-default-xs"
                              onBackground="neutral-medium"
                              className="truncate line-clamp-1"
                              style={{
                                display: "inline-flex",
                                gap: "2px",
                                alignItems: "center",
                              }}
                            >
                              {formatBytes(upload.file.size)}

                              {(upload.status === "completed" || upload.status === "error") && (
                                <IconButton
                                  icon="close"
                                  size="s"
                                  variant="ghost"
                                  className="!hidden group-hover/uploader:!block transition-all"
                                  aria-label="Remove"
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    removeUpload(upload.id);
                                  }}
                                  tooltip="Remove"
                                />
                              )}
                            </Text>
                          </Flex>

                          {/* Progress bar */}
                          {upload.status === "uploading" && (
                            <div className="w-full">
                              <ProgressRoot
                                value={upload.progress}
                                size="xs"
                                striped
                                animated
                                height={0.5}
                              >
                                <ProgressBar />
                              </ProgressRoot>

                              <Flex horizontal="space-between" marginTop="8">
                                <Text variant="body-default-xs">{upload.progress}%</Text>
                                <FileStatus status={upload.status} />
                              </Flex>
                            </div>
                          )}

                          {/* Status for non-uploading files */}
                          {upload.status !== "uploading" && (
                            <Flex horizontal="space-between" align="start" vertical="center">
                              <Text variant="body-default-xs" onBackground="neutral-medium">
                                {upload.status === "error"
                                  ? upload.errorMessage || "Upload failed"
                                  : upload.status === "completed"
                                    ? "Upload complete"
                                    : "Preparing upload..."}
                              </Text>
                              <FileStatus
                                status={upload.status}
                                errorMessage={upload.errorMessage}
                              />
                            </Flex>
                          )}

                          {/* Action buttons */}
                          <Flex horizontal="end" gap="8">
                            {/* {upload.status === "uploading" && (
                              <Button
                                size="s"
                                variant="secondary"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  cancelUpload(upload.id);
                                }}
                                prefixIcon="close"
                              >
                                Cancel
                              </Button>
                            )} */}

                            {upload.status === "error" && retryUpload && (
                              <Button
                                size="s"
                                variant="secondary"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  retryUpload(upload.id);
                                }}
                                prefixIcon="refresh"
                              >
                                Retry
                              </Button>
                            )}
                          </Flex>
                        </Flex>
                      </Flex>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Flex>
            </motion.div>
          )}
        </AnimatePresence>
      </Flex>
    </motion.div>,
    document.body,
  );
};

Uploader.displayName = "Uploader";
export { Uploader };
