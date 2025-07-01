import { useQuery } from "@tanstack/react-query";
import { useBucketSelector } from "./_store";
import { useBucketStore, useProjectStore } from "@/lib/store";
import { Avatar, RadioButton, Row, Text } from "@nuvix/ui/components";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Models, Query } from "@nuvix/console";
import { formatBytes } from "@/lib";
import { formatDate } from "@/lib/utils";
import { Tooltip } from "@nuvix/cui/tooltip";
import { DataGridProvider, Search, Table } from "@/ui/data-grid";
import { EmptyState } from "@/components/_empty_state";
import { HStack } from "@chakra-ui/react";
import { CreateButton } from "@/components/others";
import { UploadFile } from "@/components/project/storage/single/components";

export const Files = ({ mimeType }: { mimeType?: string[] }) => {
  const { bucket, setLoading, file, setFile } = useBucketSelector((state) => state);
  const { sdk, permissions } = useProjectStore((state) => state);
  const { setBucket } = useBucketStore((state) => state);
  const [search, setSearch] = useState("");
  const { canCreateFiles } = permissions();

  const fetcher = async () => {
    if (!bucket?.$id) return { files: [], total: 0 };

    const queries = [];
    if (mimeType?.length) {
      queries.push(Query.contains("mimeType", mimeType));
    }
    if (search.trim()) {
      queries.push(Query.search("search", search.trim()));
    }

    return await sdk.storage.listFiles(bucket.$id, queries);
  };

  const { data, isFetching, refetch, error } = useQuery({
    queryKey: ["files", bucket?.$id, mimeType, search],
    queryFn: fetcher,
    enabled: !!bucket?.$id,
    staleTime: 30000, // 30 seconds
  });

  const columns: ColumnDef<Models.File>[] = [
    {
      header: "",
      accessorKey: "$id",
      size: 14,
      minSize: 14,
      cell({ row }) {
        return (
          <RadioButton
            isChecked={file?.$id === row.original.$id}
            onToggle={() => setFile(row.original)}
            aria-label={`Select ${row.original.name}`}
          />
        );
      },
    },
    {
      header: "Name",
      accessorKey: "name",
      minSize: 280,
      cell(props) {
        const row = props.row.original;
        const isImage = row.mimeType?.startsWith("image/");

        return (
          <Row gap="8" vertical="center">
            <Avatar
              src={
                isImage
                  ? sdk.storage.getFilePreview(bucket?.$id!, row.$id, 64, 64).toString() +
                    "&mode=admin"
                  : undefined
              }
              value={isImage ? undefined : row.name.charAt(0).toUpperCase()}
              className="mr-2"
              unoptimized
            />
            <Tooltip showArrow content={row.name}>
              <span className="truncate">{row.name}</span>
            </Tooltip>
          </Row>
        );
      },
    },
    {
      header: "Type",
      accessorKey: "mimeType",
      minSize: 150,
      cell({ getValue }) {
        const mimeType = getValue<string>();
        const displayType = mimeType?.split("/")[1]?.toUpperCase() || "Unknown";
        return <span className="text-muted-foreground">{mimeType}</span>;
      },
    },
    {
      header: "Size",
      accessorKey: "sizeOriginal",
      cell({ getValue }) {
        return <span className="text-muted-foreground">{formatBytes(getValue<number>())}</span>;
      },
      minSize: 100,
    },
    {
      header: "Uploaded",
      accessorKey: "$createdAt",
      minSize: 150,
      cell(props) {
        const date = formatDate(props.getValue<string>());
        return (
          <Tooltip showArrow content={date}>
            <span className="text-muted-foreground">{date}</span>
          </Tooltip>
        );
      },
    },
  ];

  useEffect(() => {
    setLoading(isFetching);
  }, [isFetching, setLoading]);

  useEffect(() => {
    if (bucket) {
      setBucket(bucket);
    }
  }, [bucket, setBucket]);

  const hasFiles = (data?.total ?? 0) > 0;
  const showEmptyState = !hasFiles && !isFetching && !search.trim() && !error;
  const showNoResults = !hasFiles && !isFetching && search.trim();
  const create = (
    <CreateButton
      hasPermission={canCreateFiles}
      label="Upload File"
      component={UploadFile}
      size="s"
      extraProps={{ refetch, portalled: false }}
    />
  );
  return (
    <div className="w-full py-2">
      <Text variant="label-strong-s">
        {mimeType ? `${mimeType.join(", ")} Files` : "Files"}
        {hasFiles && <span className="ml-2 text-muted-foreground">({data?.total})</span>}
      </Text>

      <div className="space-y-4 mt-2">
        <DataGridProvider<Models.File>
          columns={columns}
          data={data?.files ?? []}
          manualPagination
          rowCount={data?.total}
          loading={isFetching}
        >
          <EmptyState
            show={showEmptyState}
            title="No files yet"
            description={
              mimeType
                ? `No ${mimeType.join(" or ")} files have been uploaded to this bucket.`
                : "Upload your first file to get started."
            }
            primaryComponent={create}
          />

          {error && (
            <EmptyState
              show={true}
              title="Failed to load files"
              description="There was an error loading files. Please try again."
            />
          )}

          {(hasFiles || search.trim()) && !error && (
            <>
              <HStack justifyContent="space-between" alignItems="center">
                <Search
                  height="s"
                  placeholder={
                    mimeType
                      ? `Search ${mimeType.join(" or ")} files...`
                      : "Search files by name..."
                  }
                  onSearch={(v) => setSearch(v ?? "")}
                  value={search}
                />
                {create}
              </HStack>
              <Table noResults={!!showNoResults} interactive={false} />
            </>
          )}
        </DataGridProvider>
      </div>
    </div>
  );
};
